"""Tests for the simulation engine (stub)."""
import pytest

from app.models.boss_templates import BossTemplate
from app.models.characters import Character
from app.models.enums import BossRank, CharacterType, QuickActionsMode, SpeedBand
from app.models.simulations import SimulationConfig, SimulationRun


def test_simulation_config_creation(db_session):
    """Test creating a simulation config."""

    # Create a simple boss template
    boss_template = BossTemplate(
        id="test_boss",
        name="Test Boss",
        rank=BossRank.Lieutenant,
        sc_level=5,
        sc_offset_from_party=0,
        thp_factor=2.0,
        dmg_factor=1.0,
        dr_factor=0.1,
        minions=[],
        lieutenants=[],
    )
    db_session.add(boss_template)

    # Create a test character
    character = Character(
        name="Test PC",
        type=CharacterType.PC,
        bod=10,
        mnd=10,
        sol=10,
        ae_max=100,
        ae_reg=10,
        strain_cap=50,
        thp_max=0,
        php_max=100,
        mshp_max=80,
        dr=0.1,
        guard_base_charges=3,
        guard_prr=5,
        guard_mrr=5,
        guard_srr=5,
        spd_raw=5,
        spd_band=SpeedBand.Normal,
    )
    db_session.add(character)
    db_session.commit()

    # Create simulation config
    config = SimulationConfig(
        name="Test Simulation",
        party_character_ids=[str(character.id)],
        boss_template_id=boss_template.id,
        rounds_max=10,
        trials=100,
        enable_3_stage=False,
        quick_actions_mode=QuickActionsMode.none,
        decision_policy={},
    )
    db_session.add(config)
    db_session.commit()

    assert config.id is not None
    assert config.name == "Test Simulation"
    assert len(config.party_character_ids) == 1


def test_simulation_run_stub(db_session):
    """Test creating a simulation run with stub metrics."""

    # Create dependencies
    boss_template = BossTemplate(
        id="test_boss_2",
        name="Test Boss 2",
        rank=BossRank.Major,
        sc_level=5,
        thp_factor=2.0,
        dmg_factor=1.0,
        dr_factor=0.1,
        minions=[],
        lieutenants=[],
    )
    db_session.add(boss_template)

    character = Character(
        name="Test PC 2",
        type=CharacterType.PC,
        bod=10,
        mnd=10,
        sol=10,
        ae_max=100,
        ae_reg=10,
        strain_cap=50,
        thp_max=0,
        php_max=100,
        mshp_max=80,
        dr=0.1,
        guard_base_charges=3,
        guard_prr=5,
        guard_mrr=5,
        guard_srr=5,
        spd_raw=5,
        spd_band=SpeedBand.Normal,
    )
    db_session.add(character)
    db_session.commit()

    config = SimulationConfig(
        name="Test Simulation 2",
        party_character_ids=[str(character.id)],
        boss_template_id=boss_template.id,
        rounds_max=10,
        trials=100,
    )
    db_session.add(config)
    db_session.commit()

    # Create simulation run with stub metrics
    run = SimulationRun(
        config_id=config.id,
        metrics={
            "party_win_rate": 0.5,
            "avg_rounds": 8.5,
            "damage_by_character": {str(character.id): 500},
            "ae_curves": {},
            "strain_curves": {},
        },
    )
    db_session.add(run)
    db_session.commit()

    assert run.id is not None
    assert run.metrics is not None
    assert "party_win_rate" in run.metrics
    assert run.metrics["avg_rounds"] > 0
    assert "damage_by_character" in run.metrics
