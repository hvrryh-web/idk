"""Monte Carlo combat simulation engine."""
import random
from typing import Dict, List, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.boss_template import BossTemplate
from app.models.characters import Character
from app.models.simulation import SimulationConfig
from app.models.techniques import Technique
from app.simulation.combat_state import CombatantState, CombatState


class TechniqueData:
    """Cached technique data for quick access during simulation."""

    def __init__(self, technique: Technique):
        self.id = technique.id
        self.name = technique.name
        self.technique_type = technique.technique_type
        self.base_damage = technique.base_damage or 0
        self.ae_cost = technique.ae_cost or 0
        self.self_strain = technique.self_strain or 0
        self.damage_routing = technique.damage_routing or "THP"
        self.boss_strain_on_hit = technique.boss_strain_on_hit or 0
        self.dr_debuff = technique.dr_debuff or 0.0
        self.is_quick_action = bool(technique.is_quick_action)


def load_techniques(db: Session, technique_ids: List[UUID]) -> Dict[UUID, TechniqueData]:
    """Load and cache technique data."""
    techniques = db.query(Technique).filter(Technique.id.in_(technique_ids)).all()
    return {t.id: TechniqueData(t) for t in techniques}


def create_combatant_from_character(
    char: Character, techniques: Dict[UUID, TechniqueData]
) -> CombatantState:
    """Create a CombatantState from a Character model."""
    tech_ids = char.techniques or []
    return CombatantState(
        id=char.id,
        name=char.name,
        is_boss=False,
        thp=char.thp or 100,
        max_thp=char.thp or 100,
        ae=char.ae or 10,
        max_ae=char.ae or 10,
        ae_reg=char.ae_reg or 2,
        dr=char.dr or 0.0,
        strain=char.strain or 0,
        guard=char.guard or 0,
        spd_band=char.spd_band.value if char.spd_band else "Normal",
        technique_ids=tech_ids,
    )


def create_combatant_from_boss(
    boss: BossTemplate, techniques: Dict[UUID, TechniqueData]
) -> CombatantState:
    """Create a CombatantState from a BossTemplate model."""
    tech_ids = boss.techniques or []
    if boss.basic_technique_id:
        tech_ids.append(str(boss.basic_technique_id))
    if boss.spike_technique_id:
        tech_ids.append(str(boss.spike_technique_id))

    return CombatantState(
        id=boss.id,
        name=boss.name,
        is_boss=True,
        thp=boss.thp,
        max_thp=boss.thp,
        ae=boss.ae,
        max_ae=boss.ae,
        ae_reg=boss.ae_reg,
        dr=boss.dr,
        strain=boss.strain,
        guard=boss.guard,
        spd_band="Normal",
        technique_ids=tech_ids,
    )


def choose_technique_simple(
    combatant: CombatantState, techniques: Dict[UUID, TechniqueData], is_boss: bool = False
) -> Optional[TechniqueData]:
    """
    Simple decision policy for choosing a technique.

    For PCs: Choose highest damage technique they can afford (AE-wise).
    For Boss: Choose Spike if enough AE, otherwise Basic.
    """
    available = []
    for tech_id in combatant.technique_ids:
        tech_uuid = UUID(str(tech_id)) if isinstance(tech_id, str) else tech_id
        if tech_uuid in techniques:
            tech = techniques[tech_uuid]
            # Check if combatant has enough AE
            if combatant.ae >= tech.ae_cost:
                available.append(tech)

    if not available:
        return None

    if is_boss:
        # Boss prefers spike techniques, then highest damage
        spike_techs = [t for t in available if t.technique_type == "Spike"]
        if spike_techs:
            return max(spike_techs, key=lambda t: t.base_damage)
        return max(available, key=lambda t: t.base_damage)
    else:
        # PCs prefer highest damage they can afford
        return max(available, key=lambda t: t.base_damage)


def execute_technique(
    attacker: CombatantState, target: CombatantState, technique: TechniqueData, state: CombatState
):
    """
    Execute a technique from attacker to target.

    Applies:
    - AE cost to attacker
    - Self strain to attacker
    - Damage to target (after DR)
    - Boss strain (if applicable)
    - DR debuff (if applicable)
    """
    # Apply costs to attacker
    attacker.apply_ae_cost(technique.ae_cost)
    attacker.apply_strain(technique.self_strain)

    # Calculate damage after DR
    effective_dr = target.get_effective_dr()
    final_damage = int(technique.base_damage * (1.0 - effective_dr))

    # Apply damage to target
    actual_thp_damage = target.apply_damage(final_damage, technique.damage_routing)

    # Record damage dealt
    state.record_damage(attacker.id, actual_thp_damage)

    # Apply boss strain if target is boss
    if target.is_boss and technique.boss_strain_on_hit > 0:
        target.apply_strain(technique.boss_strain_on_hit)

    # Apply DR debuff if any
    if technique.dr_debuff > 0:
        target.temp_dr_modifier -= technique.dr_debuff


def run_1beat_round(state: CombatState, techniques: Dict[UUID, TechniqueData]):
    """
    Run a single 1-beat round: PCs act, then Boss acts.

    Each PC chooses and executes one technique against the boss.
    Then the boss chooses and executes one technique against a random living PC.
    """
    state.round_number += 1

    # PCs act first
    for pc in state.party:
        if not pc.is_alive():
            continue

        if not state.boss_alive():
            break

        # Choose technique
        technique = choose_technique_simple(pc, techniques, is_boss=False)
        if technique:
            execute_technique(pc, state.boss, technique, state)

    # Boss acts if still alive
    if state.boss_alive() and state.party_alive():
        # Choose technique
        technique = choose_technique_simple(state.boss, techniques, is_boss=True)
        if technique:
            # Target random living PC
            living_pcs = [pc for pc in state.party if pc.is_alive()]
            if living_pcs:
                target = random.choice(living_pcs)
                execute_technique(state.boss, target, technique, state)

    # End of round: regenerate AE
    for pc in state.party:
        if pc.is_alive():
            pc.regenerate_ae()

    if state.boss_alive():
        state.boss.regenerate_ae()

    # Clear temporary modifiers
    for pc in state.party:
        pc.temp_dr_modifier = 0.0
    if state.boss:
        state.boss.temp_dr_modifier = 0.0

    # Record stats
    state.record_round_stats()


def run_3stage_round(state: CombatState, techniques: Dict[UUID, TechniqueData]):
    """
    Run a single 3-stage round with SPD-aware turn ordering.

    Stage 1: Quick Actions for Fast SPD_band actors
    Stage 2: Major Actions for all actors
    Stage 3: Quick Actions for Slow SPD_band actors
    """
    from app.simulation.quick_actions import choose_quick_action, execute_quick_action

    state.round_number += 1

    # Stage 1: Quick Actions for Fast actors
    fast_actors = [pc for pc in state.party if pc.is_alive() and pc.spd_band == "Fast"]
    if state.boss and state.boss_alive() and state.boss.spd_band == "Fast":
        fast_actors.append(state.boss)

    for actor in fast_actors:
        if actor.is_alive():
            quick_action = choose_quick_action(actor)
            execute_quick_action(actor, quick_action)

    # Stage 2: Major Actions for all actors (same as 1-beat)
    # PCs act first
    for pc in state.party:
        if not pc.is_alive():
            continue

        if not state.boss_alive():
            break

        # Choose technique
        technique = choose_technique_simple(pc, techniques, is_boss=False)
        if technique:
            execute_technique(pc, state.boss, technique, state)

    # Boss acts if still alive
    if state.boss_alive() and state.party_alive():
        # Choose technique
        technique = choose_technique_simple(state.boss, techniques, is_boss=True)
        if technique:
            # Target random living PC
            living_pcs = [pc for pc in state.party if pc.is_alive()]
            if living_pcs:
                target = random.choice(living_pcs)
                execute_technique(state.boss, target, technique, state)

    # Stage 3: Quick Actions for Slow actors
    slow_actors = [pc for pc in state.party if pc.is_alive() and pc.spd_band == "Slow"]
    if state.boss and state.boss_alive() and state.boss.spd_band == "Slow":
        slow_actors.append(state.boss)

    for actor in slow_actors:
        if actor.is_alive():
            quick_action = choose_quick_action(actor)
            execute_quick_action(actor, quick_action)

    # End of round: regenerate AE
    for pc in state.party:
        if pc.is_alive():
            pc.regenerate_ae()

    if state.boss_alive():
        state.boss.regenerate_ae()

    # Clear temporary modifiers
    for pc in state.party:
        pc.temp_dr_modifier = 0.0
    if state.boss:
        state.boss.temp_dr_modifier = 0.0

    # Record stats
    state.record_round_stats()


def run_single_trial(
    party_states: List[CombatantState],
    boss_state: CombatantState,
    techniques: Dict[UUID, TechniqueData],
    max_rounds: int,
    enable_3_stage: bool = False,
) -> Dict:
    """
    Run a single combat trial.

    Returns:
        dict with keys: win, rounds, damage_dealt, ae_history, strain_history
    """
    # Initialize combat state
    state = CombatState(round_number=0, party=party_states, boss=boss_state)

    # Combat loop
    while state.round_number < max_rounds:
        if not state.boss_alive():
            # Party wins
            return {
                "win": True,
                "rounds": state.round_number,
                "damage_dealt": state.damage_dealt,
                "ae_history": state.ae_history,
                "strain_history": state.strain_history,
            }

        if not state.party_alive():
            # Boss wins (party wipe)
            return {
                "win": False,
                "rounds": state.round_number,
                "damage_dealt": state.damage_dealt,
                "ae_history": state.ae_history,
                "strain_history": state.strain_history,
            }

        # Run combat round
        if enable_3_stage:
            run_3stage_round(state, techniques)
        else:
            run_1beat_round(state, techniques)

    # Timeout
    return {
        "win": False,
        "rounds": max_rounds,
        "damage_dealt": state.damage_dealt,
        "ae_history": state.ae_history,
        "strain_history": state.strain_history,
        "timeout": True,
    }


def run_simulation(config: SimulationConfig, db: Session) -> Dict:
    """
    Run a Monte Carlo combat simulation.

    Args:
        config: SimulationConfig with party, boss, and simulation parameters
        db: Database session for loading models

    Returns:
        dict with aggregated results:
        - win_rate: percentage of party wins
        - avg_rounds: average rounds to completion
        - damage_by_character: total damage dealt by each character
        - ae_curves: average AE per character per round
        - strain_curves: average Strain per character per round
        - boss_kills, party_wipes, timeouts: counts
    """
    # Set random seed if provided
    if config.random_seed is not None:
        random.seed(config.random_seed)

    # Load party characters
    party_chars = (
        db.query(Character)
        .filter(Character.id.in_([UUID(cid) for cid in config.party_character_ids]))
        .all()
    )

    if len(party_chars) != len(config.party_character_ids):
        raise ValueError("Some party character IDs not found in database")

    # Load boss template
    boss_template = (
        db.query(BossTemplate).filter(BossTemplate.id == config.boss_template_id).first()
    )

    if not boss_template:
        raise ValueError(f"Boss template {config.boss_template_id} not found")

    # Collect all technique IDs
    all_technique_ids = set()
    for char in party_chars:
        if char.techniques:
            all_technique_ids.update([UUID(tid) for tid in char.techniques])

    if boss_template.techniques:
        all_technique_ids.update([UUID(tid) for tid in boss_template.techniques])
    if boss_template.basic_technique_id:
        all_technique_ids.add(boss_template.basic_technique_id)
    if boss_template.spike_technique_id:
        all_technique_ids.add(boss_template.spike_technique_id)

    # Load all techniques
    techniques = load_techniques(db, list(all_technique_ids))

    # Run trials
    wins = 0
    total_rounds = 0
    all_damage = {}
    all_ae_curves = {}
    all_strain_curves = {}
    boss_kills = 0
    party_wipes = 0
    timeouts = 0

    for _trial in range(config.trials):
        # Create fresh copies of combatants for this trial
        party_states = [create_combatant_from_character(char, techniques) for char in party_chars]
        boss_state = create_combatant_from_boss(boss_template, techniques)

        # Run trial
        result = run_single_trial(
            party_states, boss_state, techniques, config.max_rounds, config.enable_3_stage
        )

        # Aggregate results
        if result["win"]:
            wins += 1
            boss_kills += 1
        else:
            if result.get("timeout"):
                timeouts += 1
            else:
                party_wipes += 1

        total_rounds += result["rounds"]

        # Aggregate damage
        for char_id, damage in result["damage_dealt"].items():
            char_id_str = str(char_id)
            if char_id_str not in all_damage:
                all_damage[char_id_str] = []
            all_damage[char_id_str].append(damage)

        # Aggregate curves (we'll average these later)
        for char_id, ae_history in result["ae_history"].items():
            char_id_str = str(char_id)
            if char_id_str not in all_ae_curves:
                all_ae_curves[char_id_str] = []
            all_ae_curves[char_id_str].append(ae_history)

        for char_id, strain_history in result["strain_history"].items():
            char_id_str = str(char_id)
            if char_id_str not in all_strain_curves:
                all_strain_curves[char_id_str] = []
            all_strain_curves[char_id_str].append(strain_history)

    # Calculate averages
    win_rate = wins / config.trials
    avg_rounds = total_rounds / config.trials

    # Average damage per character
    damage_by_character = {}
    for char_id, damages in all_damage.items():
        damage_by_character[char_id] = sum(damages) / len(damages)

    # Average AE curves (per round)
    ae_curves = {}
    for char_id, curves in all_ae_curves.items():
        # Find max rounds across all trials for this character
        max_len = max(len(c) for c in curves) if curves else 0
        avg_curve = []
        for round_idx in range(max_len):
            values = [c[round_idx] for c in curves if round_idx < len(c)]
            avg_curve.append(sum(values) / len(values) if values else 0)
        ae_curves[char_id] = avg_curve

    # Average Strain curves
    strain_curves = {}
    for char_id, curves in all_strain_curves.items():
        max_len = max(len(c) for c in curves) if curves else 0
        avg_curve = []
        for round_idx in range(max_len):
            values = [c[round_idx] for c in curves if round_idx < len(c)]
            avg_curve.append(sum(values) / len(values) if values else 0)
        strain_curves[char_id] = avg_curve

    return {
        "win_rate": win_rate,
        "avg_rounds": avg_rounds,
        "damage_by_character": damage_by_character,
        "ae_curves": ae_curves,
        "strain_curves": strain_curves,
        "boss_kills": boss_kills,
        "party_wipes": party_wipes,
        "timeouts": timeouts,
    }
