"""Tests for 3-stage combat system and quick actions."""
import uuid

from app.models.techniques import Technique
from app.simulation.combat_state import CombatantState, CombatState
from app.simulation.engine import TechniqueData, run_3stage_round
from app.simulation.quick_actions import (
    QuickActionType,
    choose_quick_action,
    execute_ae_pulse,
    execute_brace,
    execute_counter_prep,
    execute_dodge,
    execute_guard_shift,
    execute_quick_action,
    execute_stance_switch,
    execute_strain_vent,
)


def test_execute_guard_shift():
    """Test GUARD_SHIFT quick action."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.0,
        strain=0,
        guard=10,
    )

    execute_guard_shift(combatant, amount=20)
    assert combatant.guard == 30


def test_execute_dodge():
    """Test DODGE quick action."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.2,
        strain=0,
        guard=0,
    )

    execute_dodge(combatant, dr_bonus=0.15)
    assert combatant.temp_dr_modifier == 0.15
    assert combatant.get_effective_dr() == 0.35  # 0.2 + 0.15


def test_execute_brace():
    """Test BRACE quick action."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.1,
        strain=0,
        guard=5,
    )

    execute_brace(combatant, guard_bonus=30, dr_bonus=0.10)
    assert combatant.guard == 35
    assert combatant.temp_dr_modifier == 0.10
    assert combatant.get_effective_dr() == 0.20


def test_execute_ae_pulse():
    """Test AE_PULSE quick action."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=5,
        max_ae=10,
        ae_reg=2,
        dr=0.0,
        strain=0,
        guard=0,
    )

    execute_ae_pulse(combatant, ae_gain=3)
    assert combatant.ae == 8

    # Should cap at max_ae
    execute_ae_pulse(combatant, ae_gain=5)
    assert combatant.ae == 10


def test_execute_strain_vent():
    """Test STRAIN_VENT quick action."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.0,
        strain=25,
        guard=0,
    )

    execute_strain_vent(combatant, strain_reduction=5)
    assert combatant.strain == 20

    # Should floor at 0
    execute_strain_vent(combatant, strain_reduction=30)
    assert combatant.strain == 0


def test_execute_stance_switch():
    """Test STANCE_SWITCH quick action."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.2,
        strain=0,
        guard=0,
    )

    # Defensive stance
    execute_stance_switch(combatant, dr_change=0.05)
    assert combatant.temp_dr_modifier == 0.05

    # Could also go aggressive (negative)
    combatant.temp_dr_modifier = 0
    execute_stance_switch(combatant, dr_change=-0.05)
    assert combatant.temp_dr_modifier == -0.05


def test_execute_counter_prep():
    """Test COUNTER_PREP quick action."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.0,
        strain=0,
        guard=5,
    )

    execute_counter_prep(combatant, guard_bonus=15)
    assert combatant.guard == 20


def test_choose_quick_action():
    """Test quick action selection logic."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.0,
        strain=0,
        guard=15,
    )

    # Default case: should dodge
    action = choose_quick_action(combatant)
    assert action == QuickActionType.DODGE

    # High strain: should vent
    combatant.strain = 25
    action = choose_quick_action(combatant)
    assert action == QuickActionType.STRAIN_VENT

    # Low AE: should pulse
    combatant.strain = 0
    combatant.ae = 2
    action = choose_quick_action(combatant)
    assert action == QuickActionType.AE_PULSE

    # Low guard and good AE: should brace
    combatant.ae = 10
    combatant.guard = 5
    action = choose_quick_action(combatant)
    assert action == QuickActionType.BRACE


def test_execute_quick_action():
    """Test generic quick action executor."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=5,
        max_ae=10,
        ae_reg=2,
        dr=0.0,
        strain=20,
        guard=10,
    )

    # Test AE pulse
    execute_quick_action(combatant, QuickActionType.AE_PULSE)
    assert combatant.ae == 8

    # Test strain vent
    execute_quick_action(combatant, QuickActionType.STRAIN_VENT)
    assert combatant.strain == 15

    # Test guard shift
    execute_quick_action(combatant, QuickActionType.GUARD_SHIFT)
    assert combatant.guard == 30


def test_3stage_round_all_normal_spd():
    """Test 3-stage round with all Normal SPD_band (should behave like 1-beat)."""
    # When all actors have Normal SPD_band, there should be no quick actions
    # Only the major actions stage should execute

    pc1 = CombatantState(
        id=uuid.uuid4(),
        name="PC1",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.0,
        strain=0,
        guard=0,
        spd_band="Normal",
        technique_ids=[],
    )

    boss = CombatantState(
        id=uuid.uuid4(),
        name="Boss",
        is_boss=True,
        thp=200,
        max_thp=200,
        ae=15,
        max_ae=15,
        ae_reg=3,
        dr=0.2,
        strain=0,
        guard=0,
        spd_band="Normal",
        technique_ids=[],
    )

    tech1 = Technique(id=uuid.uuid4(), name="PC Attack", base_damage=50, ae_cost=3)
    tech2 = Technique(id=uuid.uuid4(), name="Boss Attack", base_damage=30, ae_cost=4)

    pc1.technique_ids = [tech1.id]
    boss.technique_ids = [tech2.id]

    techniques = {tech1.id: TechniqueData(tech1), tech2.id: TechniqueData(tech2)}

    state = CombatState(party=[pc1], boss=boss)

    run_3stage_round(state, techniques)

    # Same expectations as 1-beat round
    assert state.round_number == 1
    # PC: 10 - 3 + 2 = 9
    assert pc1.ae == 9
    # Boss: 15 - 4 + 3 = 14
    assert boss.ae == 14
    # PC deals 50 * (1 - 0.2) = 40 to boss
    assert boss.thp == 160
    # Boss deals 30 to PC (no DR)
    assert pc1.thp == 70


def test_3stage_round_with_fast_actor():
    """Test 3-stage round with Fast SPD_band actor."""
    pc1 = CombatantState(
        id=uuid.uuid4(),
        name="Fast PC",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.0,
        strain=0,
        guard=0,
        spd_band="Fast",  # Fast actor gets quick action in Stage 1
        technique_ids=[],
    )

    boss = CombatantState(
        id=uuid.uuid4(),
        name="Boss",
        is_boss=True,
        thp=200,
        max_thp=200,
        ae=15,
        max_ae=15,
        ae_reg=3,
        dr=0.2,
        strain=0,
        guard=0,
        spd_band="Normal",
        technique_ids=[],
    )

    tech1 = Technique(id=uuid.uuid4(), name="PC Attack", base_damage=50, ae_cost=3)
    tech2 = Technique(id=uuid.uuid4(), name="Boss Attack", base_damage=30, ae_cost=4)

    pc1.technique_ids = [tech1.id]
    boss.technique_ids = [tech2.id]

    techniques = {tech1.id: TechniqueData(tech1), tech2.id: TechniqueData(tech2)}

    state = CombatState(party=[pc1], boss=boss)

    # Fast PC should get a quick action before major actions
    # Based on choose_quick_action logic with default stats, should DODGE
    run_3stage_round(state, techniques)

    assert state.round_number == 1
    # PC should have executed both quick action and major action
    # The quick action (DODGE) should have given temp DR bonus during the round
    # But temp modifiers are cleared at end of round, so we can't check that directly
    # We can verify the combat proceeded normally
    assert boss.thp < 200  # Boss took damage
    assert pc1.thp < 100  # PC took damage


def test_3stage_round_with_slow_actor():
    """Test 3-stage round with Slow SPD_band actor."""
    pc1 = CombatantState(
        id=uuid.uuid4(),
        name="Normal PC",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.0,
        strain=0,
        guard=0,
        spd_band="Normal",
        technique_ids=[],
    )

    boss = CombatantState(
        id=uuid.uuid4(),
        name="Slow Boss",
        is_boss=True,
        thp=200,
        max_thp=200,
        ae=15,
        max_ae=15,
        ae_reg=3,
        dr=0.2,
        strain=0,
        guard=0,
        spd_band="Slow",  # Slow actor gets quick action in Stage 3
        technique_ids=[],
    )

    tech1 = Technique(id=uuid.uuid4(), name="PC Attack", base_damage=50, ae_cost=3)
    tech2 = Technique(id=uuid.uuid4(), name="Boss Attack", base_damage=30, ae_cost=4)

    pc1.technique_ids = [tech1.id]
    boss.technique_ids = [tech2.id]

    techniques = {tech1.id: TechniqueData(tech1), tech2.id: TechniqueData(tech2)}

    state = CombatState(party=[pc1], boss=boss)

    # Slow boss should get a quick action after major actions
    run_3stage_round(state, techniques)

    assert state.round_number == 1
    # Combat should proceed normally
    assert boss.thp < 200
    assert pc1.thp < 100
