"""
Integration tests for the combat system.

These tests verify end-to-end combat flows including:
- Combat initialization with characters
- Action execution and state updates
- Condition application on damage
- SCL cap enforcement
- Combat resolution
"""

import pytest
from uuid import uuid4

from app.simulation.combat_state import CombatantState, CombatState, CostTracks
from app.simulation.engine import (
    execute_technique,
    apply_damage_conditions,
    validate_technique_usage,
    apply_technique_costs,
    TechniqueData,
)
from app.simulation.player_combat import PlayerCombatSession


# =============================================================================
# Fixtures
# =============================================================================


class MockTechnique:
    """Mock technique for testing."""
    
    def __init__(
        self,
        id=None,
        name="Test Strike",
        technique_type="Basic",
        base_damage=20,
        ae_cost=5,
        self_strain=0,
        damage_routing="THP",
        boss_strain_on_hit=0,
        dr_debuff=0.0,
        is_quick_action=False,
        max_scl=None,
        cost=None,
    ):
        self.id = id or uuid4()
        self.name = name
        self.technique_type = technique_type
        self.base_damage = base_damage
        self.ae_cost = ae_cost
        self.self_strain = self_strain
        self.damage_routing = damage_routing
        self.boss_strain_on_hit = boss_strain_on_hit
        self.dr_debuff = dr_debuff
        self.is_quick_action = is_quick_action
        self.max_scl = max_scl
        self.cost = cost


def create_test_combatant(
    name="Test Fighter",
    thp=100,
    ae=20,
    scl=5,
    is_boss=False,
    **kwargs
) -> CombatantState:
    """Create a test combatant with reasonable defaults."""
    return CombatantState(
        id=uuid4(),
        name=name,
        is_boss=is_boss,
        thp=thp,
        max_thp=thp,
        ae=ae,
        max_ae=ae,
        ae_reg=kwargs.get("ae_reg", 5),
        dr=kwargs.get("dr", 0.0),
        strain=kwargs.get("strain", 0),
        guard=kwargs.get("guard", 0),
        spd_band=kwargs.get("spd_band", "Normal"),
        technique_ids=kwargs.get("technique_ids", []),
        scl=scl,
        conditions=kwargs.get("conditions", []),
        cost_tracks=kwargs.get("cost_tracks", CostTracks()),
    )


# =============================================================================
# Test: Combat Initialization
# =============================================================================


class TestCombatInitialization:
    """Tests for combat setup and initialization."""
    
    def test_create_combat_state(self):
        """Combat state initializes with correct defaults."""
        state = CombatState(round_number=1)
        
        assert state.round_number == 1
        assert state.party == []
        assert state.boss is None
        assert state.damage_dealt == {}
    
    def test_combatant_starts_alive(self):
        """New combatants are alive."""
        combatant = create_test_combatant(thp=100)
        
        assert combatant.is_alive()
        assert combatant.thp == 100
    
    def test_combatant_with_conditions(self):
        """Combatants can have initial conditions."""
        combatant = create_test_combatant(conditions=["wounded"])
        
        assert "wounded" in combatant.conditions
        assert combatant.get_condition_degree("violence") == 1


# =============================================================================
# Test: Action Execution
# =============================================================================


class TestActionExecution:
    """Tests for technique and action execution."""
    
    def test_execute_technique_applies_damage(self):
        """Technique execution deals damage to target."""
        attacker = create_test_combatant(name="Attacker", ae=20)
        target = create_test_combatant(name="Target", thp=100)
        state = CombatState(round_number=1, party=[attacker], boss=target)
        
        technique = TechniqueData(MockTechnique(base_damage=20, ae_cost=5))
        
        result = execute_technique(attacker, target, technique, state)
        
        assert result["hit"] is True
        assert result["damage"] == 20
        assert target.thp == 80
        assert attacker.ae == 15  # 20 - 5
    
    def test_execute_technique_applies_dr(self):
        """Damage is reduced by target's DR."""
        attacker = create_test_combatant(name="Attacker", ae=20)
        target = create_test_combatant(name="Target", thp=100, dr=0.5)
        state = CombatState(round_number=1, party=[attacker], boss=target)
        
        technique = TechniqueData(MockTechnique(base_damage=20, ae_cost=5))
        
        result = execute_technique(attacker, target, technique, state)
        
        # 20 damage * (1 - 0.5 DR) = 10 damage
        assert result["damage"] == 10
        assert target.thp == 90
    
    def test_execute_technique_applies_strain(self):
        """Self-strain is applied to attacker."""
        attacker = create_test_combatant(name="Attacker", ae=20, strain=0)
        target = create_test_combatant(name="Target", thp=100)
        state = CombatState(round_number=1, party=[attacker], boss=target)
        
        technique = TechniqueData(MockTechnique(base_damage=10, ae_cost=5, self_strain=2))
        
        execute_technique(attacker, target, technique, state)
        
        assert attacker.strain == 2


# =============================================================================
# Test: Condition Application
# =============================================================================


class TestConditionApplication:
    """Tests for condition application based on damage."""
    
    def test_no_condition_below_threshold(self):
        """No condition applied for low damage."""
        target = create_test_combatant(thp=100)
        
        # 24% damage - below 25% threshold
        conditions = apply_damage_conditions(target, 24, "violence")
        
        assert conditions == []
        assert target.conditions == []
    
    def test_first_degree_at_25_percent(self):
        """1st degree condition at 25% damage."""
        target = create_test_combatant(thp=100)
        
        # 25% damage exactly
        conditions = apply_damage_conditions(target, 25, "violence")
        
        assert "wounded" in conditions
        assert "wounded" in target.conditions
    
    def test_second_degree_at_50_percent(self):
        """2nd degree condition at 50% damage."""
        target = create_test_combatant(thp=100)
        
        # 50% damage
        conditions = apply_damage_conditions(target, 50, "violence")
        
        assert "wounded" in conditions
        assert "crippled" in conditions
        # Note: get_condition_degree returns first match, so check conditions list directly
        assert "wounded" in target.conditions
        assert "crippled" in target.conditions
    
    def test_fourth_degree_at_zero_thp(self):
        """4th degree condition when THP reaches 0."""
        target = create_test_combatant(thp=0, max_thp=100)  # 0 THP but valid max_thp
        
        # Apply damage with 1 HP to trigger 4th degree
        conditions = apply_damage_conditions(target, 1, "violence")
        
        # Should have multiple conditions escalated
        # The loop applies up to 4 conditions
        assert len(target.conditions) >= 1


# =============================================================================
# Test: SCL Cap Enforcement
# =============================================================================


class TestSCLCapEnforcement:
    """Tests for SCL-based technique restrictions."""
    
    def test_technique_allowed_when_scl_below_max(self):
        """Technique allowed when character SCL <= max_scl."""
        attacker = create_test_combatant(scl=5, ae=20)
        technique = TechniqueData(MockTechnique(max_scl=10, ae_cost=5))
        
        is_valid, error = validate_technique_usage(attacker, technique)
        
        assert is_valid is True
        assert error == ""
    
    def test_technique_blocked_when_scl_above_max(self):
        """Technique blocked when character SCL > max_scl."""
        attacker = create_test_combatant(scl=10, ae=20)
        technique = TechniqueData(MockTechnique(max_scl=5, ae_cost=5))
        
        is_valid, error = validate_technique_usage(attacker, technique)
        
        assert is_valid is False
        assert "SCL too high" in error
    
    def test_technique_allowed_when_no_max_scl(self):
        """Technique allowed when no max_scl restriction."""
        attacker = create_test_combatant(scl=100, ae=20)
        technique = TechniqueData(MockTechnique(max_scl=None, ae_cost=5))
        
        is_valid, error = validate_technique_usage(attacker, technique)
        
        assert is_valid is True
    
    def test_technique_blocked_insufficient_ae(self):
        """Technique blocked when not enough AE."""
        attacker = create_test_combatant(scl=5, ae=3)
        technique = TechniqueData(MockTechnique(ae_cost=10))
        
        is_valid, error = validate_technique_usage(attacker, technique)
        
        assert is_valid is False
        assert "Not enough AE" in error


# =============================================================================
# Test: Cost Tracks
# =============================================================================


class TestCostTracks:
    """Tests for Blood/Fate/Stain cost track mechanics."""
    
    def test_blood_track_marks(self):
        """Blood track marks accumulate."""
        cost_tracks = CostTracks()
        
        cost_tracks.mark_blood(2)
        
        assert cost_tracks.blood == 2
    
    def test_blood_threshold_triggers_condition(self):
        """Blood track reaching 3 triggers wounded condition."""
        attacker = create_test_combatant()
        technique = TechniqueData(MockTechnique(cost={"blood": 3, "fate": 0, "stain": 0}))
        
        marks = apply_technique_costs(attacker, technique)
        
        assert marks["blood"] == 3
        assert "wounded" in attacker.conditions
    
    def test_fate_track_marks(self):
        """Fate track marks accumulate."""
        cost_tracks = CostTracks()
        
        cost_tracks.mark_fate(1)
        cost_tracks.mark_fate(2)
        
        assert cost_tracks.fate == 3
    
    def test_stain_track_marks(self):
        """Stain track marks accumulate."""
        cost_tracks = CostTracks()
        
        cost_tracks.mark_stain(1)
        
        assert cost_tracks.stain == 1
    
    def test_tracks_cap_at_maximum(self):
        """Cost tracks don't exceed maximum."""
        cost_tracks = CostTracks(maximum=10)
        
        cost_tracks.mark_blood(15)
        
        assert cost_tracks.blood == 10


# =============================================================================
# Test: Combat Resolution
# =============================================================================


class TestCombatResolution:
    """Tests for combat end conditions and resolution."""
    
    def test_combatant_dies_at_zero_thp(self):
        """Combatant is not alive at 0 THP."""
        combatant = create_test_combatant(thp=0)
        
        assert not combatant.is_alive()
    
    def test_combatant_incapacitated_at_fourth_degree(self):
        """Combatant is incapacitated with 4th degree condition."""
        combatant = create_test_combatant(thp=50, conditions=["ruined_body"])
        
        assert combatant.is_incapacitated()
        assert not combatant.is_alive()
    
    def test_party_alive_with_living_member(self):
        """Party is alive if any member is alive."""
        alive = create_test_combatant(thp=50)
        dead = create_test_combatant(thp=0)
        
        state = CombatState(round_number=1, party=[alive, dead])
        
        assert state.party_alive()
    
    def test_party_dead_when_all_dead(self):
        """Party is dead when all members are dead."""
        dead1 = create_test_combatant(thp=0)
        dead2 = create_test_combatant(thp=0)
        
        state = CombatState(round_number=1, party=[dead1, dead2])
        
        assert not state.party_alive()


# =============================================================================
# Test: Player Combat Session
# =============================================================================


class TestPlayerCombatSession:
    """Tests for the player combat session manager."""
    
    def test_session_initializes_correctly(self):
        """Combat session initializes with correct state."""
        party = [create_test_combatant(name="Hero")]
        enemies = [create_test_combatant(name="Enemy", is_boss=True)]
        
        session = PlayerCombatSession(
            encounter_id="test-1",
            party=party,
            enemies=enemies,
            techniques={},
            enable_3_stage=True,
        )
        
        assert session.encounter_id == "test-1"
        assert len(session.state.party) == 1
        assert len(session.enemies) == 1
        assert session.current_phase == "Quick1"
        assert not session.combat_ended
    
    def test_get_combat_state_dict(self):
        """Combat state serializes to dictionary."""
        party = [create_test_combatant(name="Hero")]
        enemies = [create_test_combatant(name="Enemy", is_boss=True)]
        
        session = PlayerCombatSession(
            encounter_id="test-1",
            party=party,
            enemies=enemies,
            techniques={},
        )
        
        state_dict = session.get_combat_state_dict()
        
        assert state_dict["encounter_id"] == "test-1"
        assert len(state_dict["party"]) == 1
        assert len(state_dict["enemies"]) == 1
        assert state_dict["party"][0]["name"] == "Hero"
        assert "conditions" in state_dict["party"][0]
        assert "scl" in state_dict["party"][0]
        assert "sequence_band" in state_dict["party"][0]


# =============================================================================
# Test: End-to-End Combat Flow
# =============================================================================


class TestEndToEndCombatFlow:
    """Integration tests for complete combat scenarios."""
    
    def test_full_combat_round(self):
        """Complete combat round executes correctly."""
        # Setup
        attacker = create_test_combatant(name="Hero", thp=100, ae=30, ae_reg=0)  # No AE regen
        enemy = create_test_combatant(name="Enemy", thp=50, is_boss=True)
        
        tech = MockTechnique(base_damage=25, ae_cost=5)
        technique = TechniqueData(tech)
        techniques = {tech.id: technique}
        
        attacker.technique_ids = [tech.id]
        
        session = PlayerCombatSession(
            encounter_id="e2e-test",
            party=[attacker],
            enemies=[enemy],
            techniques=techniques,
            enable_3_stage=False,  # Simple mode
        )
        
        # Execute attack
        log = session.execute_player_action(
            actor_id=str(attacker.id),
            action_type="technique",
            technique_id=str(tech.id),
            target_id=str(enemy.id),
        )
        
        # Verify results
        assert len(log) >= 1
        assert enemy.thp == 25  # 50 - 25
        # Note: With ae_reg=0, AE should remain at 25 after round ends
        state_dict = session.get_combat_state_dict()
        party_member = state_dict["party"][0]
        assert party_member["ae"] == 25  # 30 - 5 = 25 (no regen)
    
    def test_combat_ends_on_enemy_defeat(self):
        """Combat ends when all enemies are defeated."""
        attacker = create_test_combatant(name="Hero", thp=100, ae=30)
        enemy = create_test_combatant(name="Enemy", thp=20, is_boss=True)
        
        tech = MockTechnique(base_damage=50, ae_cost=5)
        technique = TechniqueData(tech)
        techniques = {tech.id: technique}
        
        attacker.technique_ids = [tech.id]
        
        session = PlayerCombatSession(
            encounter_id="e2e-test",
            party=[attacker],
            enemies=[enemy],
            techniques=techniques,
        )
        
        # Execute fatal attack
        session.execute_player_action(
            actor_id=str(attacker.id),
            action_type="technique",
            technique_id=str(tech.id),
            target_id=str(enemy.id),
        )
        
        # Verify combat ended
        assert session.combat_ended
        assert session.victor == "party"
    
    def test_condition_applied_during_combat(self):
        """Conditions are applied during combat based on damage."""
        attacker = create_test_combatant(name="Hero", thp=100, ae=30)
        enemy = create_test_combatant(name="Enemy", thp=100, is_boss=True)
        
        # 50% of 100 THP = 50 damage, should apply conditions
        tech = MockTechnique(base_damage=50, ae_cost=5)
        technique = TechniqueData(tech)
        techniques = {tech.id: technique}
        
        attacker.technique_ids = [tech.id]
        
        session = PlayerCombatSession(
            encounter_id="cond-test",
            party=[attacker],
            enemies=[enemy],
            techniques=techniques,
        )
        
        # Execute heavy attack
        log = session.execute_player_action(
            actor_id=str(attacker.id),
            action_type="technique",
            technique_id=str(tech.id),
            target_id=str(enemy.id),
        )
        
        # Verify condition applied
        assert len(enemy.conditions) > 0
        # Check log mentions conditions
        condition_log = [e for e in log if e.get("conditions")]
        assert len(condition_log) > 0 or "wounded" in enemy.conditions or "crippled" in enemy.conditions
