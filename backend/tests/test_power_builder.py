"""Tests for the Power Builder service."""
import pytest

from app.models.characters import Character
from app.models.enums import (
    CharacterType,
    FateAspect,
    FateColour,
    SpeedBand,
    TechniqueTier,
)
from app.models.fate_cards import BodyCard, DeathCard, SeedCard
from app.services.power_builder import build_innate_technique


def test_build_innate_technique(db_session):
    """Test building an innate technique with known module set."""
    
    # Create dummy fate cards
    death_card = DeathCard(
        name="Test Death",
        summary="A test death card",
        tags=["test"],
        mechanical_hooks={},
    )
    db_session.add(death_card)
    
    body_card = BodyCard(
        name="Test Body",
        summary="A test body card",
        stat_mods={},
        spd_mod=0,
        archetype_hint="Body",
        mechanical_hooks={},
    )
    db_session.add(body_card)
    
    seed_cards = [
        SeedCard(
            colour=FateColour.Red,
            aspect=FateAspect.Body,
            keywords=["strength"],
            mechanical_bias={},
        ),
        SeedCard(
            colour=FateColour.Blue,
            aspect=FateAspect.Mind,
            keywords=["wisdom"],
            mechanical_bias={},
        ),
        SeedCard(
            colour=FateColour.Green,
            aspect=FateAspect.Soul,
            keywords=["spirit"],
            mechanical_bias={},
        ),
    ]
    for seed in seed_cards:
        db_session.add(seed)
    
    # Create a test character
    character = Character(
        name="Test Hero",
        type=CharacterType.PC,
        bod=10,
        mnd=12,
        sol=14,
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
        spd_raw=6,
        spd_band=SpeedBand.Fast,
    )
    db_session.add(character)
    db_session.commit()
    
    # Build technique with known module set
    modules = [
        {"id": "DMG", "rank": 5},
        {"id": "DR_SHRED", "rank": 2},
    ]
    
    technique = build_innate_technique(
        character=character,
        death_card=death_card,
        body_card=body_card,
        seed_cards=seed_cards,
        soul_thesis="Test Thesis",
        modules=modules,
        advantages=["Increased Range"],
        limitations=["Requires Concentration"],
    )
    
    # Assertions
    assert technique is not None
    assert technique.tier == TechniqueTier.Innate
    assert technique.base_damage > 0, "Technique should have base damage from DMG modules"
    assert technique.dr_debuff > 0, "Technique should have DR debuff from DR_SHRED modules"
    assert technique.build_meta is not None, "Technique should have build_meta populated"
    assert "magic_rank" in technique.build_meta
    assert "real_cost" in technique.build_meta
    assert "budget" in technique.build_meta
    
    # Check that real cost is computed
    real_cost = technique.build_meta["real_cost"]
    budget = technique.build_meta["budget"]
    assert real_cost > 0, "Real cost should be positive"
    assert budget > 0, "Budget should be positive"
    
    # Magic rank should be average of MND and SOL
    expected_magic_rank = (character.mnd + character.sol) // 2
    assert technique.build_meta["magic_rank"] == expected_magic_rank
