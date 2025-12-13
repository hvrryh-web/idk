"""
Core Resolution Engine Module

Implements ADR-0001: Core Resolution Engine (Opposed d20 + Rank Dice, ±4 DoS)

This module provides pure, deterministic functions for:
- Rank dice mapping and rolling
- Total computation
- Degrees of Success (DoS) computation
- Natural 20/1 DoS shift
- Tie handling

Reference: docs/adr/ADR-0001-core-resolution-engine.md
Patch: ALPHA-0.4-20251212
"""

import random
from dataclasses import dataclass
from enum import Enum
from typing import List, Optional, Tuple

# =============================================================================
# Constants (ADR-0001 Locked)
# =============================================================================

K = 4                # DoS band width (locked constant)
DOS_MIN = -4         # Minimum DoS
DOS_MAX = 4          # Maximum DoS
D20_NAT_HIGH = 20    # Natural 20
D20_NAT_LOW = 1      # Natural 1


# =============================================================================
# Approach Enum
# =============================================================================

class Approach(str, Enum):
    """Combat approach determining which rank to use."""
    MARTIAL = "Martial"
    SORCEROUS = "Sorcerous"


# =============================================================================
# Rank Dice Functions
# =============================================================================

def get_rank_dice_pool(rank: int) -> Tuple[int, int]:
    """
    Calculate the rank dice pool (XdY) for a given rank.

    Per ADR-0001:
        X = 1 + floor(Rank / 2)
        Y = min(12, 4 + 2*Rank)

    Args:
        rank: The character's rank (MartialRank or SorceryRank)

    Returns:
        Tuple of (X, Y) where X is dice count and Y is die size

    Examples:
        Rank 0 -> 1d4
        Rank 1 -> 1d6
        Rank 2 -> 2d8
        Rank 3 -> 2d10
        Rank 4 -> 3d12
        Rank 5 -> 3d12
    """
    if rank < 0:
        rank = 0

    x = 1 + (rank // 2)
    y = min(12, 4 + 2 * rank)

    return (x, y)


def roll_rank_dice(rank: int) -> int:
    """
    Roll the rank dice pool and return the kept (highest) die.

    Args:
        rank: The character's rank

    Returns:
        The highest die result from the pool (KeptRankDie)
    """
    x, y = get_rank_dice_pool(rank)

    if x <= 0:
        return 0

    rolls = [random.randint(1, y) for _ in range(x)]
    return max(rolls)


def roll_rank_dice_detailed(rank: int) -> Tuple[int, List[int], int, int]:
    """
    Roll the rank dice pool with full details.

    Args:
        rank: The character's rank

    Returns:
        Tuple of (kept_die, all_rolls, dice_count, die_size)
    """
    x, y = get_rank_dice_pool(rank)

    if x <= 0:
        return (0, [], 0, 0)

    rolls = [random.randint(1, y) for _ in range(x)]
    kept = max(rolls)

    return (kept, rolls, x, y)


# =============================================================================
# DoS Computation
# =============================================================================

def compute_dos(margin: int, k: int = K) -> int:
    """
    Compute Degrees of Success from margin.

    Per ADR-0001:
        If margin == 0: DoS = 0
        If margin > 0:  DoS = min(4, 1 + floor((margin - 1) / K))
        If margin < 0:  DoS = -min(4, 1 + floor((abs(margin) - 1) / K))

    Band Table (K=4):
        0 => 0
        ±1..±4 => ±1
        ±5..±8 => ±2
        ±9..±12 => ±3
        ±13+ => ±4 (capped)

    Args:
        margin: ActorTotal - OppTotal
        k: Band width (default 4, locked per ADR-0001)

    Returns:
        DoS in range [-4, +4]
    """
    if margin == 0:
        return 0
    elif margin > 0:
        return min(DOS_MAX, 1 + (margin - 1) // k)
    else:
        return -min(-DOS_MIN, 1 + (abs(margin) - 1) // k)


def get_dos_band(margin: int, k: int = K) -> Tuple[int, int, int]:
    """
    Get the DoS band for a margin.

    Args:
        margin: ActorTotal - OppTotal
        k: Band width

    Returns:
        Tuple of (dos, band_min, band_max) where band_min/max are the
        margin values that map to this DoS
    """
    dos = compute_dos(margin, k)

    if dos == 0:
        return (0, 0, 0)
    elif dos > 0:
        band_min = 1 + (dos - 1) * k
        band_max = dos * k
        return (dos, band_min, band_max)
    else:
        abs_dos = abs(dos)
        band_min = -(1 + (abs_dos - 1) * k)
        band_max = -(abs_dos * k)
        return (dos, band_max, band_min)  # Swap for negative range


# =============================================================================
# Natural 20/1 Shift
# =============================================================================

def nat_shift(d20_roll: int) -> int:
    """
    Calculate the natural die shift for a d20 roll.

    Per ADR-0001:
        NatShift(d20) = +1 if 20, -1 if 1, else 0

    Args:
        d20_roll: The d20 result (1-20)

    Returns:
        +1 for nat 20, -1 for nat 1, 0 otherwise
    """
    if d20_roll == D20_NAT_HIGH:
        return 1
    elif d20_roll == D20_NAT_LOW:
        return -1
    return 0


def apply_nat_shift(base_dos: int, actor_d20: int, opp_d20: int) -> int:
    """
    Apply natural die shifts to base DoS.

    Per ADR-0001:
        FinalDoS = clamp(DoS + NatShift(d20_actor) - NatShift(d20_opp), -4, +4)

    Args:
        base_dos: The DoS computed from margin
        actor_d20: The actor's d20 roll
        opp_d20: The opponent's d20 roll (0 if TN mode)

    Returns:
        Final DoS after nat shift, clamped to [-4, +4]
    """
    shift = nat_shift(actor_d20) - nat_shift(opp_d20)
    final_dos = base_dos + shift
    return max(DOS_MIN, min(DOS_MAX, final_dos))


# =============================================================================
# Total Computation
# =============================================================================

@dataclass
class RollResult:
    """Result of a single side's roll."""
    d20: int
    bonus: int
    kept_rank_die: int
    rank_dice_rolls: List[int]
    total: int

    @property
    def is_nat_20(self) -> bool:
        return self.d20 == D20_NAT_HIGH

    @property
    def is_nat_1(self) -> bool:
        return self.d20 == D20_NAT_LOW


def compute_total(d20: int, bonus: int, kept_rank_die: int) -> int:
    """
    Compute total for one side of a check.

    Per ADR-0001:
        Total = d20 + Bonus + KeptRankDie

    Args:
        d20: The d20 roll result
        bonus: All numeric modifiers
        kept_rank_die: The highest rank die result

    Returns:
        The total
    """
    return d20 + bonus + kept_rank_die


def roll_total(bonus: int, rank: int) -> RollResult:
    """
    Roll a complete total for one side.

    Args:
        bonus: All numeric modifiers
        rank: Martial or Sorcery rank

    Returns:
        RollResult with all components
    """
    d20 = random.randint(1, 20)
    kept, rolls, _, _ = roll_rank_dice_detailed(rank)
    total = compute_total(d20, bonus, kept)

    return RollResult(
        d20=d20,
        bonus=bonus,
        kept_rank_die=kept,
        rank_dice_rolls=rolls,
        total=total
    )


# =============================================================================
# Full Resolution
# =============================================================================

@dataclass
class ResolutionResult:
    """Complete result of a resolution check."""
    actor_result: RollResult
    opp_result: Optional[RollResult]  # None for TN mode
    opp_tn: Optional[int]  # Set for TN mode
    margin: int
    base_dos: int
    final_dos: int
    nat_shift_applied: int
    actor_wins: bool
    is_tie: bool

    @property
    def defender_wins_tie(self) -> bool:
        """Per ADR-0001: Defender wins ties (status quo holds)."""
        return self.is_tie


def resolve_opposed(
    actor_bonus: int,
    actor_rank: int,
    opp_bonus: int,
    opp_rank: int,
    apply_nat_shifts: bool = True
) -> ResolutionResult:
    """
    Resolve an opposed check (both sides roll).

    Args:
        actor_bonus: Actor's total bonus
        actor_rank: Actor's rank for rank dice
        opp_bonus: Opposition's total bonus
        opp_rank: Opposition's rank for rank dice
        apply_nat_shifts: Whether to apply nat 20/1 shifts (default True)

    Returns:
        Complete ResolutionResult
    """
    actor = roll_total(actor_bonus, actor_rank)
    opp = roll_total(opp_bonus, opp_rank)

    margin = actor.total - opp.total
    base_dos = compute_dos(margin)

    if apply_nat_shifts:
        final_dos = apply_nat_shift(base_dos, actor.d20, opp.d20)
        nat_shift_amount = final_dos - base_dos
    else:
        final_dos = base_dos
        nat_shift_amount = 0

    return ResolutionResult(
        actor_result=actor,
        opp_result=opp,
        opp_tn=None,
        margin=margin,
        base_dos=base_dos,
        final_dos=final_dos,
        nat_shift_applied=nat_shift_amount,
        actor_wins=final_dos > 0,
        is_tie=final_dos == 0
    )


def resolve_tn(
    actor_bonus: int,
    actor_rank: int,
    tn: int,
    apply_nat_shifts: bool = True
) -> ResolutionResult:
    """
    Resolve a TN mode check (static opposition).

    Per ADR-0001: OppTotal = TN (no d20 or rank dice for opposition)

    Args:
        actor_bonus: Actor's total bonus
        actor_rank: Actor's rank for rank dice
        tn: Target Number (static opposition total)
        apply_nat_shifts: Whether to apply nat 20/1 shifts (default True)

    Returns:
        Complete ResolutionResult
    """
    actor = roll_total(actor_bonus, actor_rank)

    margin = actor.total - tn
    base_dos = compute_dos(margin)

    if apply_nat_shifts:
        # In TN mode, opponent has no d20, so their nat shift is 0
        final_dos = apply_nat_shift(base_dos, actor.d20, 0)
        nat_shift_amount = final_dos - base_dos
    else:
        final_dos = base_dos
        nat_shift_amount = 0

    return ResolutionResult(
        actor_result=actor,
        opp_result=None,
        opp_tn=tn,
        margin=margin,
        base_dos=base_dos,
        final_dos=final_dos,
        nat_shift_applied=nat_shift_amount,
        actor_wins=final_dos > 0,
        is_tie=final_dos == 0
    )


# =============================================================================
# Utility Functions
# =============================================================================

def get_rank_from_approach(
    approach: Approach,
    martial_rank: int,
    sorcery_rank: int
) -> int:
    """
    Get the appropriate rank based on approach.

    Per ADR-0001/ADR-0002:
        MartialRank = CL
        SorceryRank = SL

    Args:
        approach: Martial or Sorcerous
        martial_rank: CL value
        sorcery_rank: SL value

    Returns:
        The rank to use for rank dice
    """
    if approach == Approach.MARTIAL:
        return martial_rank
    return sorcery_rank


def interpret_dos(dos: int) -> str:
    """
    Get a human-readable interpretation of DoS.

    Args:
        dos: Degrees of Success

    Returns:
        Description string
    """
    if dos == 0:
        return "Tie - Defender wins (status quo holds)"
    elif dos == 1:
        return "Minor Success"
    elif dos == 2:
        return "Moderate Success"
    elif dos == 3:
        return "Major Success"
    elif dos >= 4:
        return "Critical Success"
    elif dos == -1:
        return "Minor Failure"
    elif dos == -2:
        return "Moderate Failure"
    elif dos == -3:
        return "Major Failure"
    else:  # dos <= -4
        return "Critical Failure"


# =============================================================================
# Rank Dice Reference Table
# =============================================================================

RANK_DICE_TABLE = {
    0: (1, 4, "1d4"),
    1: (1, 6, "1d6"),
    2: (2, 8, "2d8"),
    3: (2, 10, "2d10"),
    4: (3, 12, "3d12"),
    5: (3, 12, "3d12"),
}


def get_rank_dice_notation(rank: int) -> str:
    """Get the dice notation string for a rank (e.g., '2d8')."""
    x, y = get_rank_dice_pool(rank)
    return f"{x}d{y}"
