"""Tests for combat primitives."""
import pytest
from app.combat.core import (
    resolve_attack,
    apply_effects,
    compute_damage,
    validate_technique_usage,
    roll_with_advantage,
    roll_with_disadvantage,
    AttackResult,
    EffectResult,
    DamageResult,
)


def test_resolve_attack_hit():
    """Test basic attack resolution."""
    attacker = {"name": "Hero"}
    defender = {"name": "Enemy"}
    
    # Run multiple times to test randomness
    results = []
    for _ in range(20):
        result = resolve_attack(attacker, defender, attack_bonus=5)
        results.append(result)
    
    # Should have some hits
    hits = [r for r in results if r.hit]
    assert len(hits) > 0, "Should have at least some hits"
    
    # Check that hit results have damage
    for hit in hits:
        assert hit.damage > 0
        assert isinstance(hit, AttackResult)


def test_resolve_attack_with_advantage():
    """Test attack with advantage modifier."""
    attacker = {"name": "Hero"}
    defender = {"name": "Enemy"}
    
    result = resolve_attack(attacker, defender, attack_bonus=10, modifiers={"advantage": True})
    assert isinstance(result, AttackResult)


def test_apply_effects_zero_rank():
    """Test applying effect with zero rank."""
    target = {"name": "Target"}
    
    result = apply_effects(target, effect_rank=0, effect_type="buff")
    
    assert isinstance(result, EffectResult)
    assert result.success is False
    assert result.magnitude == 0


def test_apply_effects_positive_rank():
    """Test applying effect with positive rank."""
    target = {"name": "Target"}
    
    result = apply_effects(target, effect_rank=5, effect_type="buff")
    
    assert isinstance(result, EffectResult)
    assert result.success is True
    assert result.magnitude == 5
    assert "buff" in result.message.lower()


def test_apply_effects_different_types():
    """Test different effect types."""
    target = {"name": "Target"}
    
    for effect_type in ["buff", "debuff", "condition"]:
        result = apply_effects(target, effect_rank=3, effect_type=effect_type)
        assert result.success is True
        assert result.effect_type == effect_type


def test_compute_damage_no_resistance():
    """Test damage computation without resistances."""
    result = compute_damage(base=20, attack_bonus=5, resistances={})
    
    assert isinstance(result, DamageResult)
    assert result.final_damage == 25  # 20 + 5
    assert result.damage_blocked == 0


def test_compute_damage_with_dr():
    """Test damage computation with damage reduction."""
    result = compute_damage(base=20, attack_bonus=0, resistances={"dr": 0.3})
    
    assert isinstance(result, DamageResult)
    # 20 * (1 - 0.3) = 14
    assert result.final_damage == 14


def test_compute_damage_with_guard():
    """Test damage computation with guard value."""
    result = compute_damage(base=20, attack_bonus=0, resistances={"guard": 10})
    
    assert isinstance(result, DamageResult)
    # 20 - 10 = 10
    assert result.final_damage == 10
    assert result.damage_blocked == 10


def test_compute_damage_guard_exceeds_damage():
    """Test guard blocking all damage."""
    result = compute_damage(base=10, attack_bonus=0, resistances={"guard": 20})
    
    assert isinstance(result, DamageResult)
    assert result.final_damage == 0
    assert result.damage_blocked == 10  # Only blocks actual damage


def test_validate_technique_usage_valid():
    """Test technique validation with valid conditions."""
    is_valid, error = validate_technique_usage(
        character_scl=5,
        technique_max_scl=10,
        character_cost_tracks={
            "blood": {"current": 5, "maximum": 10},
            "fate": {"current": 3, "maximum": 10},
            "stain": {"current": 2, "maximum": 10},
        },
        technique_cost={"blood": 2, "fate": 1, "stain": 0},
    )
    
    assert is_valid is True
    assert error == ""


def test_validate_technique_usage_scl_too_high():
    """Test technique validation with SCL too high."""
    is_valid, error = validate_technique_usage(
        character_scl=15,
        technique_max_scl=10,
        character_cost_tracks={"blood": {"current": 10}, "fate": {"current": 10}, "stain": {"current": 10}},
        technique_cost={},
    )
    
    assert is_valid is False
    assert "SCL" in error
    assert "exceeds" in error


def test_validate_technique_usage_insufficient_blood():
    """Test technique validation with insufficient blood cost."""
    is_valid, error = validate_technique_usage(
        character_scl=5,
        technique_max_scl=10,
        character_cost_tracks={
            "blood": {"current": 1, "maximum": 10},
            "fate": {"current": 10, "maximum": 10},
            "stain": {"current": 10, "maximum": 10},
        },
        technique_cost={"blood": 5, "fate": 0, "stain": 0},
    )
    
    assert is_valid is False
    assert "blood" in error.lower()
    assert "Insufficient" in error


def test_validate_technique_usage_no_scl_limit():
    """Test technique validation with no SCL limit."""
    is_valid, error = validate_technique_usage(
        character_scl=999,
        technique_max_scl=None,  # No limit
        character_cost_tracks={"blood": {"current": 10}, "fate": {"current": 10}, "stain": {"current": 10}},
        technique_cost={},
    )
    
    assert is_valid is True
    assert error == ""


def test_roll_with_advantage():
    """Test advantage roll produces values in valid range."""
    results = [roll_with_advantage() for _ in range(100)]
    
    for result in results:
        assert 0.0 <= result <= 1.0
    
    # Advantage should produce higher average
    avg = sum(results) / len(results)
    assert avg > 0.4  # Should be biased higher


def test_roll_with_disadvantage():
    """Test disadvantage roll produces values in valid range."""
    results = [roll_with_disadvantage() for _ in range(100)]
    
    for result in results:
        assert 0.0 <= result <= 1.0
    
    # Disadvantage should produce lower average
    avg = sum(results) / len(results)
    assert avg < 0.6  # Should be biased lower
