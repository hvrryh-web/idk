"""Tests for Soul Cultivation Level (SCL) calculation."""
import uuid
from app.models.characters import Character, CharacterType


def test_scl_calculation_all_zeros():
    """Test SCL calculation with all stats at zero."""
    character = Character(
        id=uuid.uuid4(),
        name="Test Character",
        type=CharacterType.pc,
        strength=0,
        dexterity=0,
        constitution=0,
        intelligence=0,
        wisdom=0,
        charisma=0,
        perception=0,
        resolve=0,
        presence=0,
        aether_fire=0,
        aether_ice=0,
        aether_void=0,
    )
    assert character.scl == 0


def test_scl_calculation_primary_stats_only():
    """Test SCL calculation with only primary stats."""
    character = Character(
        id=uuid.uuid4(),
        name="Test Character",
        type=CharacterType.pc,
        strength=3,
        dexterity=3,
        constitution=3,
        intelligence=3,
        wisdom=3,
        charisma=3,
        perception=3,
        resolve=3,
        presence=3,
        aether_fire=0,
        aether_ice=0,
        aether_void=0,
    )
    # SCL = floor(27/9) + floor((0/3) * 0.5) = 3 + 0 = 3
    assert character.scl == 3


def test_scl_calculation_with_aether_stats():
    """Test SCL calculation with primary and aether stats."""
    character = Character(
        id=uuid.uuid4(),
        name="Test Character",
        type=CharacterType.pc,
        strength=5,
        dexterity=5,
        constitution=5,
        intelligence=5,
        wisdom=5,
        charisma=5,
        perception=5,
        resolve=5,
        presence=5,
        aether_fire=6,
        aether_ice=6,
        aether_void=6,
    )
    # SCL = floor(45/9) + floor((18/3) * 0.5) = 5 + floor(3.0) = 5 + 3 = 8
    assert character.scl == 8


def test_scl_calculation_with_partial_stats():
    """Test SCL calculation with mixed stat values."""
    character = Character(
        id=uuid.uuid4(),
        name="Test Character",
        type=CharacterType.pc,
        strength=4,
        dexterity=3,
        constitution=5,
        intelligence=2,
        wisdom=4,
        charisma=3,
        perception=4,
        resolve=3,
        presence=2,
        aether_fire=3,
        aether_ice=2,
        aether_void=4,
    )
    # Primary sum = 30, Aether sum = 9
    # SCL = floor(30/9) + floor((9/3) * 0.5) = floor(3.33) + floor(1.5) = 3 + 1 = 4
    assert character.scl == 4


def test_scl_calculation_with_none_values():
    """Test SCL calculation handles None values gracefully."""
    character = Character(
        id=uuid.uuid4(),
        name="Test Character",
        type=CharacterType.pc,
        strength=3,
        dexterity=None,  # None should be treated as 0
        constitution=3,
        intelligence=None,
        wisdom=3,
        charisma=3,
        perception=3,
        resolve=3,
        presence=3,
        aether_fire=None,
        aether_ice=2,
        aether_void=None,
    )
    # Primary sum = 21 (7 stats * 3), Aether sum = 2
    # SCL = floor(21/9) + floor((2/3) * 0.5) = 2 + 0 = 2
    assert character.scl == 2


def test_scl_calculation_high_values():
    """Test SCL calculation with high stat values."""
    character = Character(
        id=uuid.uuid4(),
        name="Test Character",
        type=CharacterType.pc,
        strength=10,
        dexterity=10,
        constitution=10,
        intelligence=10,
        wisdom=10,
        charisma=10,
        perception=10,
        resolve=10,
        presence=10,
        aether_fire=10,
        aether_ice=10,
        aether_void=10,
    )
    # Primary sum = 90, Aether sum = 30
    # SCL = floor(90/9) + floor((30/3) * 0.5) = 10 + floor(5.0) = 10 + 5 = 15
    assert character.scl == 15
