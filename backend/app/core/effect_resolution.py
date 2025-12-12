"""
Effect Resolution Module

Implements ADR-0006: Effect Resolution and Condition Ladders

This module provides:
- Two-step effect resolution (Contact Contest + Resistance Contest)
- Condition ladders (Violence, Influence, Revelation)
- FailDeg computation with contact amplification
- Ward mitigation mechanics

Reference: docs/adr/ADR-0006-effect-resolution-condition-ladders.md
Patch: ALPHA-0.4-20251212
"""

from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Optional

from app.core.resolution_engine import (
    resolve_opposed,
    resolve_tn,
)
from app.core.srd_constants import Pillar

# =============================================================================
# Constants (ADR-0006 Locked)
# =============================================================================

TN_BASE = 10
MAX_FAIL_DEG = 4
K = 4  # DoS band width (from ADR-0001)


# =============================================================================
# Core Effect Types
# =============================================================================

class CoreEffectType(str, Enum):
    """Core effect types per ADR-0006."""
    STRIKE = "Strike"
    INFLUENCE_ATTACK = "InfluenceAttack"
    REVELATION_ATTACK = "RevelationAttack"
    DEBILITATE = "Debilitate"
    WARD = "Ward"


# =============================================================================
# Condition Ladders
# =============================================================================

@dataclass
class ConditionRung:
    """A single rung on a condition ladder."""
    rung: int  # 0-4
    name: str
    penalty: int  # Negative modifier to relevant checks
    incapacitated: bool = False
    taken_out: bool = False


# Violence Ladder (Strike, Violence Debilitate)
VIOLENCE_LADDER: List[ConditionRung] = [
    ConditionRung(0, "No Effect", 0),
    ConditionRung(1, "Injured", -1),
    ConditionRung(2, "Maimed", -2),
    ConditionRung(3, "Mortally Wounded", -3, incapacitated=True),
    ConditionRung(4, "Ruined Body", -4, taken_out=True),
]

# Influence Ladder (Influence Attack, Influence Debilitate)
INFLUENCE_LADDER: List[ConditionRung] = [
    ConditionRung(0, "No Effect", 0),
    ConditionRung(1, "Rattled", -1),
    ConditionRung(2, "Discredited", -2),
    ConditionRung(3, "Isolated", -3, incapacitated=True),
    ConditionRung(4, "Broken", -4, taken_out=True),
]

# Revelation Ladder (Revelation Attack, Revelation Debilitate)
REVELATION_LADDER: List[ConditionRung] = [
    ConditionRung(0, "No Effect", 0),
    ConditionRung(1, "Shaken", -1),
    ConditionRung(2, "Haunted", -2),
    ConditionRung(3, "Deranged", -3, incapacitated=True),
    ConditionRung(4, "Shattered", -4, taken_out=True),
]

# Debilitate Ladders (control effects)
DEBILITATE_LADDERS: Dict[Pillar, List[str]] = {
    Pillar.VIOLENCE: ["No Effect", "Slowed", "Bound", "Downed", "Ruined Body"],
    Pillar.INFLUENCE: ["No Effect", "Muted", "Censured", "Exiled", "Broken"],
    Pillar.REVELATION: ["No Effect", "Doubt", "Paranoia", "Unraveling", "Shattered"],
}

# Ladder mapping
PILLAR_TO_LADDER: Dict[Pillar, List[ConditionRung]] = {
    Pillar.VIOLENCE: VIOLENCE_LADDER,
    Pillar.INFLUENCE: INFLUENCE_LADDER,
    Pillar.REVELATION: REVELATION_LADDER,
}


def get_condition_from_ladder(
    effect_type: str,
    pillar: Pillar,
    fail_deg: int
) -> ConditionRung:
    """Get the condition rung for a given effect and fail degree."""
    fail_deg = max(0, min(MAX_FAIL_DEG, fail_deg))
    ladder = PILLAR_TO_LADDER.get(pillar, VIOLENCE_LADDER)
    return ladder[fail_deg]


def get_debilitate_name(pillar: Pillar, fail_deg: int) -> str:
    """Get the debilitate condition name for a pillar and fail degree."""
    fail_deg = max(0, min(MAX_FAIL_DEG, fail_deg))
    return DEBILITATE_LADDERS.get(pillar, DEBILITATE_LADDERS[Pillar.VIOLENCE])[fail_deg]


# =============================================================================
# Ward Mechanics
# =============================================================================

@dataclass
class WardState:
    """Ward state for a character."""
    pillar: Pillar
    rank: int
    is_active: bool = True
    has_reactive: bool = False
    has_aura: bool = False
    has_hardened: bool = False
    has_fragile: bool = False
    hardened_uses_remaining: int = 0

    def __post_init__(self):
        if self.has_hardened:
            self.hardened_uses_remaining = self.rank

    @property
    def bonus(self) -> int:
        """WardBonus = WardRank if active."""
        return self.rank if self.is_active else 0

    def aura_bonus(self) -> int:
        """Bonus granted to allies in range."""
        return self.rank // 2 if self.has_aura and self.is_active else 0

    def apply_hardened(self, effect_rank: int, fail_deg: int) -> int:
        """Apply Hardened to potentially reduce FailDeg."""
        if not self.has_hardened:
            return fail_deg
        if effect_rank > self.rank:
            return fail_deg
        if fail_deg == 1 and self.hardened_uses_remaining > 0:
            self.hardened_uses_remaining -= 1
            return 0
        return fail_deg

    def check_fragile(self, fail_deg: int) -> None:
        """Collapse ward if Fragile and took significant damage."""
        if self.has_fragile and fail_deg >= 2:
            self.is_active = False


# =============================================================================
# Effect Resolution Results
# =============================================================================

@dataclass
class ContactResult:
    """Result of Step A: Contact Contest."""
    dos_contact: int
    actor_d20: int
    opp_d20: int
    hit: bool  # DoS_contact > 0


@dataclass
class ResistanceResult:
    """Result of Step B: Resistance Contest."""
    dos_resist: int
    resist_d20: int
    tn: int
    base_fail_deg: int
    amplify: int
    fail_deg: int


@dataclass
class EffectResult:
    """Complete effect resolution result."""
    contact: ContactResult
    resistance: Optional[ResistanceResult]
    condition_applied: Optional[ConditionRung]
    complication_tag: Optional[str]
    ward_applied: bool = False


# =============================================================================
# Effect Resolution Functions
# =============================================================================

def compute_resistance_tn(
    effect_rank: int,
    potency_virtual_ranks: int = 0
) -> int:
    """
    Compute the TN for resistance checks per ADR-0006.

    TN = 10 + EffectRank + PotencyVirtualRanks
    """
    return TN_BASE + effect_rank + potency_virtual_ranks


def compute_fail_deg(
    dos_resist: int,
    dos_contact: int
) -> int:
    """
    Compute FailDeg per ADR-0006.

    BaseFailDeg = max(0, -DoS_resist)
    Amplify = max(0, DoS_contact - 1)
    FailDeg = clamp(BaseFailDeg + Amplify, 0, 4)
    """
    base_fail_deg = max(0, -dos_resist)
    amplify = max(0, dos_contact - 1)
    fail_deg = min(MAX_FAIL_DEG, base_fail_deg + amplify)
    return fail_deg


def resolve_effect(
    effect_type: str,
    pillar: Pillar,
    actor_attack: int,
    actor_rank: int,
    opp_defense: int,
    opp_rank: int,
    target_resilience: int,
    target_ward_bonus: int,
    effect_rank: int,
    potency_virtual_ranks: int = 0,
    apply_nat_shifts: bool = True,
) -> EffectResult:
    """
    Full two-step effect resolution per ADR-0006.

    Step A: Contact Contest (Opposed)
    Step B: Resistance Contest (TN Mode)

    Args:
        effect_type: Type of effect (Strike, InfluenceAttack, etc.)
        pillar: Which pillar this effect targets
        actor_attack: Actor's attack bonus
        actor_rank: Actor's rank for rank dice
        opp_defense: Opposition's defense
        opp_rank: Opposition's rank for rank dice
        target_resilience: Target's resilience for resistance
        target_ward_bonus: Target's active ward bonus
        effect_rank: The effect's rank (determines TN)
        potency_virtual_ranks: Additional virtual ranks from Domain Potency
        apply_nat_shifts: Whether to apply nat 20/1 shifts

    Returns:
        Complete EffectResult with contact, resistance, and condition info
    """
    # Step A: Contact Contest (Opposed)
    contact_resolution = resolve_opposed(
        actor_bonus=actor_attack,
        actor_rank=actor_rank,
        opp_bonus=opp_defense,
        opp_rank=opp_rank,
        apply_nat_shifts=apply_nat_shifts
    )
    dos_contact = contact_resolution.final_dos

    contact_result = ContactResult(
        dos_contact=dos_contact,
        actor_d20=contact_resolution.actor_result.d20,
        opp_d20=contact_resolution.opp_result.d20,
        hit=dos_contact > 0
    )

    # If contact fails, no effect
    if not contact_result.hit:
        return EffectResult(
            contact=contact_result,
            resistance=None,
            condition_applied=None,
            complication_tag=None
        )

    # Step B: Resistance Contest (TN Mode)
    tn = compute_resistance_tn(effect_rank, potency_virtual_ranks)
    resist_bonus = target_resilience + target_ward_bonus

    resist_resolution = resolve_tn(
        actor_bonus=resist_bonus,
        actor_rank=opp_rank,  # Target resists with their own rank
        tn=tn,
        apply_nat_shifts=apply_nat_shifts
    )
    dos_resist = resist_resolution.final_dos

    # Compute FailDeg
    base_fail_deg = max(0, -dos_resist)
    amplify = max(0, dos_contact - 1)
    fail_deg = min(MAX_FAIL_DEG, base_fail_deg + amplify)

    resistance_result = ResistanceResult(
        dos_resist=dos_resist,
        resist_d20=resist_resolution.actor_result.d20,
        tn=tn,
        base_fail_deg=base_fail_deg,
        amplify=amplify,
        fail_deg=fail_deg
    )

    # Apply ladder
    condition = get_condition_from_ladder(effect_type, pillar, fail_deg)

    # Debilitate creates complication tag
    complication = None
    if effect_type == CoreEffectType.DEBILITATE.value and fail_deg > 0:
        debilitate_name = get_debilitate_name(pillar, fail_deg)
        complication = f"{pillar.value.lower()}_{debilitate_name.lower().replace(' ', '_')}_{fail_deg}"

    return EffectResult(
        contact=contact_result,
        resistance=resistance_result,
        condition_applied=condition,
        complication_tag=complication,
        ward_applied=target_ward_bonus > 0
    )


def resolve_effect_with_ward(
    effect_type: str,
    pillar: Pillar,
    actor_attack: int,
    actor_rank: int,
    opp_defense: int,
    opp_rank: int,
    target_resilience: int,
    effect_rank: int,
    ward: Optional[WardState],
    potency_virtual_ranks: int = 0,
    apply_nat_shifts: bool = True,
) -> EffectResult:
    """
    Full effect resolution with Ward mechanics.

    Handles Ward bonus, Hardened, and Fragile.
    """
    ward_bonus = ward.bonus if ward and ward.pillar == pillar else 0

    result = resolve_effect(
        effect_type=effect_type,
        pillar=pillar,
        actor_attack=actor_attack,
        actor_rank=actor_rank,
        opp_defense=opp_defense,
        opp_rank=opp_rank,
        target_resilience=target_resilience,
        target_ward_bonus=ward_bonus,
        effect_rank=effect_rank,
        potency_virtual_ranks=potency_virtual_ranks,
        apply_nat_shifts=apply_nat_shifts
    )

    # Apply Ward extras if applicable
    if ward and result.resistance:
        # Hardened can reduce FailDeg
        original_fail_deg = result.resistance.fail_deg
        new_fail_deg = ward.apply_hardened(effect_rank, original_fail_deg)
        if new_fail_deg != original_fail_deg:
            result.resistance.fail_deg = new_fail_deg
            result.condition_applied = get_condition_from_ladder(
                effect_type, pillar, new_fail_deg
            )

        # Fragile check
        ward.check_fragile(result.resistance.fail_deg)

    return result
