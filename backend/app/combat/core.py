"""
Combat primitives and reusable functions for the combat system.
These functions provide the building blocks for both simulation and player combat.
"""
import random
from typing import Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class AttackResult:
    """Result of an attack resolution."""
    hit: bool
    damage: int
    critical: bool = False
    message: str = ""


@dataclass
class EffectResult:
    """Result of applying an effect."""
    success: bool
    magnitude: int
    effect_type: str
    message: str = ""


@dataclass
class DamageResult:
    """Result of damage calculation."""
    final_damage: int
    damage_blocked: int
    damage_routing: str


def resolve_attack(
    attacker: Dict[str, Any],
    defender: Dict[str, Any],
    attack_bonus: int,
    modifiers: Optional[Dict[str, Any]] = None
) -> AttackResult:
    """
    Resolve an attack from attacker to defender.
    
    Args:
        attacker: Attacker stats/state
        defender: Defender stats/state
        attack_bonus: Bonus to the attack roll/damage
        modifiers: Additional modifiers (advantage, disadvantage, etc.)
    
    Returns:
        AttackResult with hit status and damage
    """
    modifiers = modifiers or {}
    
    # Simple hit resolution for now (can be expanded with actual mechanics)
    base_hit_chance = 0.7
    hit_roll = random.random()
    
    # Apply modifiers
    if modifiers.get("advantage"):
        hit_roll = max(hit_roll, random.random())
    elif modifiers.get("disadvantage"):
        hit_roll = min(hit_roll, random.random())
    
    hit = hit_roll < base_hit_chance
    
    if hit:
        # Calculate damage with attack_bonus
        base_damage = attack_bonus + 10  # Base scaling
        damage = max(0, base_damage)
        
        return AttackResult(
            hit=True,
            damage=damage,
            critical=hit_roll > 0.9,
            message=f"Attack hits for {damage} damage!"
        )
    else:
        return AttackResult(
            hit=False,
            damage=0,
            message="Attack misses!"
        )


def apply_effects(
    target: Dict[str, Any],
    effect_rank: int,
    effect_type: str
) -> EffectResult:
    """
    Apply a non-damage effect to a target.
    
    Args:
        target: Target state
        effect_rank: Magnitude of the effect (0-10)
        effect_type: Type of effect (buff, debuff, condition, etc.)
    
    Returns:
        EffectResult with success status and magnitude
    """
    if effect_rank <= 0:
        return EffectResult(
            success=False,
            magnitude=0,
            effect_type=effect_type,
            message="No effect applied"
        )
    
    # Apply effect based on type
    if effect_type == "buff":
        message = f"Applies {effect_type} (rank {effect_rank})"
    elif effect_type == "debuff":
        message = f"Applies {effect_type} (rank {effect_rank})"
    elif effect_type == "condition":
        message = f"Inflicts condition (rank {effect_rank})"
    else:
        message = f"Applies {effect_type} effect (rank {effect_rank})"
    
    return EffectResult(
        success=True,
        magnitude=effect_rank,
        effect_type=effect_type,
        message=message
    )


def compute_damage(
    base: int,
    attack_bonus: int,
    resistances: Dict[str, float]
) -> DamageResult:
    """
    Compute final damage after applying resistances.
    
    Args:
        base: Base damage value
        attack_bonus: Attack bonus modifier
        resistances: Dict of resistance values (dr, guard, etc.)
    
    Returns:
        DamageResult with final damage and routing
    """
    total_damage = base + attack_bonus
    dr = resistances.get("dr", 0.0)
    guard = resistances.get("guard", 0)
    
    # Apply DR (damage reduction percentage)
    damage_after_dr = int(total_damage * (1.0 - dr))
    
    # Apply guard
    damage_blocked = min(guard, damage_after_dr)
    final_damage = max(0, damage_after_dr - damage_blocked)
    
    return DamageResult(
        final_damage=final_damage,
        damage_blocked=damage_blocked,
        damage_routing="thp"
    )


def roll_with_advantage() -> float:
    """Roll two random values and take the higher one."""
    return max(random.random(), random.random())


def roll_with_disadvantage() -> float:
    """Roll two random values and take the lower one."""
    return min(random.random(), random.random())


def validate_technique_usage(
    character_scl: int,
    technique_max_scl: Optional[int],
    character_cost_tracks: Dict[str, Dict[str, int]],
    technique_cost: Dict[str, int]
) -> tuple[bool, str]:
    """
    Validate if a character can use a technique based on SCL and costs.
    
    Args:
        character_scl: Character's Soul Cultivation Level
        technique_max_scl: Maximum SCL allowed for this technique (None = no limit)
        character_cost_tracks: Character's cost tracks (blood, fate, stain)
        technique_cost: Technique's cost requirements
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    # Check SCL constraint
    if technique_max_scl is not None and character_scl > technique_max_scl:
        return False, f"SCL {character_scl} exceeds technique's maximum SCL {technique_max_scl}"
    
    # Check cost requirements
    for cost_type in ["blood", "fate", "stain"]:
        required = technique_cost.get(cost_type, 0)
        available = character_cost_tracks.get(cost_type, {}).get("current", 0)
        
        if required > available:
            return False, f"Insufficient {cost_type}: need {required}, have {available}"
    
    return True, ""


def compute_initiative(participants: list) -> list:
    """
    Compute initiative order for participants.
    Simple random order for now; can be expanded with speed stats.
    
    Args:
        participants: List of combatant dicts
    
    Returns:
        Sorted list in initiative order
    """
    # Simple random initiative
    initiative_list = [(p, random.random()) for p in participants]
    initiative_list.sort(key=lambda x: x[1], reverse=True)
    return [p[0] for p in initiative_list]
