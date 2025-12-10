"""API routes for player-controlled combat."""
from typing import Dict, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.boss_template import BossTemplate
from app.models.characters import Character
from app.simulation.engine import create_combatant_from_boss, create_combatant_from_character, load_techniques
from app.simulation.player_combat import PlayerCombatSession

router = APIRouter()

# In-memory storage for combat sessions (TODO: move to Redis or database)
active_sessions: Dict[str, PlayerCombatSession] = {}


class CreateCombatRequest(BaseModel):
    """Request to create a new combat encounter."""

    party_ids: List[str]
    enemy_ids: List[str]
    enable_3_stage: bool = False


class ExecuteActionRequest(BaseModel):
    """Request to execute a combat action."""

    actor_id: str
    action_type: str
    technique_id: Optional[str] = None
    target_id: Optional[str] = None


class ExecuteQuickActionRequest(BaseModel):
    """Request to execute a quick action."""

    actor_id: str
    quick_action_type: str


@router.post("/encounters")
def create_combat_encounter(request: CreateCombatRequest, db: Session = Depends(get_db)):
    """
    Create a new player-controlled combat encounter.

    Returns the encounter ID and initial combat state.
    """
    # Load party characters
    party_chars = db.query(Character).filter(Character.id.in_([UUID(cid) for cid in request.party_ids])).all()

    if len(party_chars) != len(request.party_ids):
        raise HTTPException(status_code=404, detail="Some party character IDs not found")

    # Load enemies (boss templates)
    enemies = db.query(BossTemplate).filter(BossTemplate.id.in_([UUID(eid) for eid in request.enemy_ids])).all()

    if len(enemies) != len(request.enemy_ids):
        raise HTTPException(status_code=404, detail="Some enemy IDs not found")

    # Collect all technique IDs
    all_technique_ids = set()
    for char in party_chars:
        if char.techniques:
            all_technique_ids.update([UUID(tid) for tid in char.techniques])

    for enemy in enemies:
        if enemy.techniques:
            all_technique_ids.update([UUID(tid) for tid in enemy.techniques])
        if enemy.basic_technique_id:
            all_technique_ids.add(enemy.basic_technique_id)
        if enemy.spike_technique_id:
            all_technique_ids.add(enemy.spike_technique_id)

    # Load techniques
    techniques = load_techniques(db, list(all_technique_ids))

    # Create combatant states
    party_states = [create_combatant_from_character(char, techniques) for char in party_chars]
    enemy_states = [create_combatant_from_boss(boss, techniques) for boss in enemies]

    # Generate encounter ID
    encounter_id = f"encounter-{len(active_sessions) + 1}"

    # Create combat session
    session = PlayerCombatSession(
        encounter_id=encounter_id,
        party=party_states,
        enemies=enemy_states,
        techniques=techniques,
        enable_3_stage=request.enable_3_stage,
    )

    # Store session
    active_sessions[encounter_id] = session

    return {"encounter_id": encounter_id, "combat_state": session.get_combat_state_dict()}


@router.get("/encounters/{encounter_id}")
def get_combat_state(encounter_id: str):
    """Get the current state of a combat encounter."""
    session = active_sessions.get(encounter_id)
    if not session:
        raise HTTPException(status_code=404, detail="Combat encounter not found")

    return session.get_combat_state_dict()


@router.post("/encounters/{encounter_id}/actions")
def execute_action(encounter_id: str, request: ExecuteActionRequest):
    """Execute a player action (technique)."""
    session = active_sessions.get(encounter_id)
    if not session:
        raise HTTPException(status_code=404, detail="Combat encounter not found")

    log_entries = session.execute_player_action(
        actor_id=request.actor_id,
        action_type=request.action_type,
        technique_id=request.technique_id,
        target_id=request.target_id,
    )

    return {"combat_state": session.get_combat_state_dict(), "log_entries": log_entries}


@router.post("/encounters/{encounter_id}/quick-actions")
def execute_quick_action(encounter_id: str, request: ExecuteQuickActionRequest):
    """Execute a quick action."""
    session = active_sessions.get(encounter_id)
    if not session:
        raise HTTPException(status_code=404, detail="Combat encounter not found")

    log_entries = session.execute_quick_action(actor_id=request.actor_id, quick_action_type=request.quick_action_type)

    return {"combat_state": session.get_combat_state_dict(), "log_entries": log_entries}


@router.post("/encounters/{encounter_id}/end-turn")
def end_turn(encounter_id: str):
    """
    End the current turn manually.

    This triggers enemy actions and round-end processing.
    """
    session = active_sessions.get(encounter_id)
    if not session:
        raise HTTPException(status_code=404, detail="Combat encounter not found")

    session.end_round()

    return {"combat_state": session.get_combat_state_dict(), "log_entries": session.log_entries[-10:]}


@router.get("/encounters/{encounter_id}/log")
def get_combat_log(encounter_id: str):
    """Get the full combat log for an encounter."""
    session = active_sessions.get(encounter_id)
    if not session:
        raise HTTPException(status_code=404, detail="Combat encounter not found")

    return session.log_entries


@router.get("/encounters/{encounter_id}/preview")
def get_action_preview(encounter_id: str, actor_id: str, technique_id: str, target_id: str):
    """
    Get a preview of an action's effects before executing it.

    Shows cost, damage estimate, and warnings.
    """
    session = active_sessions.get(encounter_id)
    if not session:
        raise HTTPException(status_code=404, detail="Combat encounter not found")

    # Find actor and target
    actor = next((c for c in session.state.party if str(c.id) == actor_id), None)
    target = next((e for e in session.enemies if str(e.id) == target_id), None)

    if not actor or not target:
        raise HTTPException(status_code=404, detail="Actor or target not found")

    # Find technique
    tech_uuid = UUID(technique_id)
    if tech_uuid not in session.techniques:
        raise HTTPException(status_code=404, detail="Technique not found")

    technique = session.techniques[tech_uuid]

    # Calculate preview data
    effective_dr = target.get_effective_dr()
    estimated_damage = int(technique.base_damage * (1.0 - effective_dr))

    # Check for cost track warnings (simplified)
    warnings = []
    blood_marks = 0
    fate_marks = 0
    stain_marks = 0

    if technique.self_strain >= 2:
        warnings.append("High self-strain: This technique is taxing on the user")
        blood_marks = 1

    if actor.ae - technique.ae_cost < 5:
        warnings.append("Low AE after use: You may not have enough energy for follow-up actions")

    return {
        "technique_id": technique_id,
        "technique_name": technique.name,
        "ae_cost": technique.ae_cost,
        "self_strain": technique.self_strain,
        "estimated_damage": estimated_damage,
        "blood_marks": blood_marks,
        "fate_marks": fate_marks,
        "stain_marks": stain_marks,
        "warnings": warnings,
    }
