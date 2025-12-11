"""Tests for the simulation engine."""
import uuid
from unittest.mock import MagicMock

from app.models.boss_template import BossTemplate
from app.models.characters import Character, CharacterType
from app.models.simulation import SimulationConfig
from app.models.techniques import DamageRouting, Technique, TechniqueType
from app.simulation.combat_state import CombatantState, CombatState
from app.simulation.engine import (
    TechniqueData,
    choose_technique_simple,
    execute_technique,
    run_1beat_round,
    run_simulation,
)


def test_combatant_state_is_alive():
    """Test CombatantState.is_alive()."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=10,
        max_thp=100,
        ae=5,
        max_ae=10,
        ae_reg=2,
        dr=0.2,
        strain=0,
        guard=0,
    )
    assert combatant.is_alive()

    combatant.thp = 0
    assert not combatant.is_alive()


def test_combatant_apply_damage_thp():
    """Test THP damage routing."""
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
        guard=0,
    )

    actual_damage = combatant.apply_damage(30, "THP")
    assert actual_damage == 30
    assert combatant.thp == 70


def test_combatant_apply_damage_guard():
    """Test Guard damage routing."""
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
        guard=50,
    )

    # Damage absorbed by guard
    actual_damage = combatant.apply_damage(30, "Guard")
    assert actual_damage == 0
    assert combatant.guard == 20
    assert combatant.thp == 100

    # Damage exceeds guard
    actual_damage = combatant.apply_damage(30, "Guard")
    assert actual_damage == 10
    assert combatant.guard == 0
    assert combatant.thp == 90


def test_combatant_apply_damage_strain():
    """Test Strain damage routing."""
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
        guard=0,
    )

    actual_damage = combatant.apply_damage(20, "Strain")
    assert actual_damage == 0
    assert combatant.strain == 20
    assert combatant.thp == 100


def test_combatant_regenerate_ae():
    """Test AE regeneration."""
    combatant = CombatantState(
        id=uuid.uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=5,
        max_ae=10,
        ae_reg=3,
        dr=0.0,
        strain=0,
        guard=0,
    )

    combatant.regenerate_ae()
    assert combatant.ae == 8

    combatant.regenerate_ae()
    assert combatant.ae == 10  # Capped at max_ae


def test_combat_state_tracking():
    """Test CombatState tracking methods."""
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
    )

    state = CombatState(party=[pc1], boss=boss)

    # Test tracking
    state.record_damage(pc1.id, 50)
    state.record_damage(pc1.id, 30)
    assert state.damage_dealt[pc1.id] == 80

    # Test round stats
    state.record_round_stats()
    assert len(state.ae_history[pc1.id]) == 1
    assert state.ae_history[pc1.id][0] == 10


def test_choose_technique_simple():
    """Test simple technique selection."""
    tech1 = Technique(
        id=uuid.uuid4(),
        name="Basic Attack",
        technique_type=TechniqueType.basic,
        base_damage=10,
        ae_cost=2,
    )
    tech2 = Technique(
        id=uuid.uuid4(),
        name="Power Attack",
        technique_type=TechniqueType.major,
        base_damage=30,
        ae_cost=5,
    )

    techniques = {tech1.id: TechniqueData(tech1), tech2.id: TechniqueData(tech2)}

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
        guard=0,
        technique_ids=[tech1.id, tech2.id],
    )

    # Should choose highest damage technique (tech2)
    chosen = choose_technique_simple(combatant, techniques, is_boss=False)
    assert chosen.id == tech2.id

    # With low AE, should choose tech1
    combatant.ae = 3
    chosen = choose_technique_simple(combatant, techniques, is_boss=False)
    assert chosen.id == tech1.id


def test_execute_technique():
    """Test technique execution."""
    attacker = CombatantState(
        id=uuid.uuid4(),
        name="Attacker",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=10,
        ae_reg=2,
        dr=0.0,
        strain=0,
        guard=0,
    )

    target = CombatantState(
        id=uuid.uuid4(),
        name="Target",
        is_boss=True,
        thp=200,
        max_thp=200,
        ae=15,
        max_ae=15,
        ae_reg=3,
        dr=0.3,  # 30% damage reduction
        strain=0,
        guard=0,
    )

    tech = Technique(
        id=uuid.uuid4(),
        name="Attack",
        base_damage=100,
        ae_cost=5,
        self_strain=2,
        damage_routing=DamageRouting.thp,
        boss_strain_on_hit=10,
    )
    tech_data = TechniqueData(tech)

    state = CombatState(party=[attacker], boss=target)

    execute_technique(attacker, target, tech_data, state)

    # Check attacker effects
    assert attacker.ae == 5  # 10 - 5
    assert attacker.strain == 2

    # Check target effects
    # Damage = 100 * (1 - 0.3) = 70
    assert target.thp == 130  # 200 - 70
    assert target.strain == 10  # Boss strain on hit

    # Check damage tracking
    assert state.damage_dealt[attacker.id] == 70


def test_run_1beat_round():
    """Test a complete 1-beat round."""
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
        technique_ids=[],
    )

    tech1 = Technique(id=uuid.uuid4(), name="PC Attack", base_damage=50, ae_cost=3)
    tech2 = Technique(id=uuid.uuid4(), name="Boss Attack", base_damage=30, ae_cost=4)

    pc1.technique_ids = [tech1.id]
    boss.technique_ids = [tech2.id]

    techniques = {tech1.id: TechniqueData(tech1), tech2.id: TechniqueData(tech2)}

    state = CombatState(party=[pc1], boss=boss)

    run_1beat_round(state, techniques)

    # Check round advanced
    assert state.round_number == 1

    # Check AE was spent and regenerated
    # PC: 10 - 3 + 2 = 9
    assert pc1.ae == 9
    # Boss: 15 - 4 + 3 = 14
    assert boss.ae == 14

    # Check damage was dealt
    # PC deals 50 * (1 - 0.2) = 40 to boss
    assert boss.thp == 160
    # Boss deals 30 to PC (no DR)
    assert pc1.thp == 70


def test_run_simulation_with_mock_db(client_with_mock_db):
    """Test run_simulation with mocked database."""
    client, mock_db = client_with_mock_db

    # Create test data
    char_id = uuid.uuid4()
    boss_id = uuid.uuid4()
    tech_id = uuid.uuid4()

    # Mock character
    char = Character(
        id=char_id,
        name="Test PC",
        type=CharacterType.pc,
        thp=100,
        ae=10,
        ae_reg=2,
        dr=0.0,
        techniques=[str(tech_id)],
    )

    # Mock boss
    boss = BossTemplate(
        id=boss_id,
        name="Test Boss",
        thp=200,
        ae=15,
        ae_reg=3,
        dr=0.2,
        strain=0,
        guard=0,
        basic_technique_id=tech_id,
    )

    # Mock technique
    tech = Technique(
        id=tech_id, name="Attack", base_damage=50, ae_cost=3, technique_type=TechniqueType.basic
    )

    # Mock config
    config = SimulationConfig(
        id=uuid.uuid4(),
        party_character_ids=[str(char_id)],
        boss_template_id=boss_id,
        trials=10,  # Small number for test
        max_rounds=10,
        random_seed=42,
    )

    # Setup mock queries
    char_query = MagicMock()
    char_query.filter.return_value.all.return_value = [char]

    boss_query = MagicMock()
    boss_query.filter.return_value.first.return_value = boss

    tech_query = MagicMock()
    tech_query.filter.return_value.all.return_value = [tech]

    def mock_query(model):
        if model == Character:
            return char_query
        elif model == BossTemplate:
            return boss_query
        elif model == Technique:
            return tech_query
        return MagicMock()

    mock_db.query = mock_query

    # Run simulation
    results = run_simulation(config, mock_db)

    # Check results structure
    assert "win_rate" in results
    assert "avg_rounds" in results
    assert "damage_by_character" in results
    assert "ae_curves" in results
    assert "strain_curves" in results
    assert "boss_kills" in results
    assert "party_wipes" in results
    assert "timeouts" in results

    # Win rate should be between 0 and 1
    assert 0.0 <= results["win_rate"] <= 1.0

    # Rounds should be positive
    assert results["avg_rounds"] > 0

    # Total outcomes should equal trials
    assert results["boss_kills"] + results["party_wipes"] + results["timeouts"] == 10
