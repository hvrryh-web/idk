"""
Economy Module

Implements ADR-0007: Tracks, Strain, Overflow, and Meta-Currency Spends

This module provides:
- Cost tracks (Blood, Fate, Stain)
- Strain and overflow mechanics
- Meta-currency pools (Fury, Clout, Insight)
- Standard spends (Reroll, Boost, Shake It Off)
- Push mechanics

Reference: docs/adr/ADR-0007-tracks-strain-metacurrency.md
Patch: ALPHA-0.4-20251212
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, Optional, Tuple

from app.core.srd_constants import Pillar

# =============================================================================
# Constants (ADR-0007 Locked)
# =============================================================================

TRACK_BASE = 3
META_BASE = 3
PUSH_CAP_BONUS = 2
STANDARD_BOOST = 3


# =============================================================================
# Track and Pool Types
# =============================================================================

class TrackType(str, Enum):
    """Cost track types."""
    BLOOD = "Blood"
    FATE = "Fate"
    STAIN = "Stain"


class PoolType(str, Enum):
    """Meta-currency pool types."""
    FURY = "Fury"
    CLOUT = "Clout"
    INSIGHT = "Insight"


# Mapping between tracks and pools
TRACK_TO_POOL: Dict[TrackType, PoolType] = {
    TrackType.BLOOD: PoolType.FURY,
    TrackType.FATE: PoolType.CLOUT,
    TrackType.STAIN: PoolType.INSIGHT,
}

POOL_TO_TRACK: Dict[PoolType, TrackType] = {v: k for k, v in TRACK_TO_POOL.items()}

# Mapping between pillars and tracks
PILLAR_TO_TRACK: Dict[Pillar, TrackType] = {
    Pillar.VIOLENCE: TrackType.BLOOD,
    Pillar.INFLUENCE: TrackType.FATE,
    Pillar.REVELATION: TrackType.STAIN,
}

PILLAR_TO_POOL: Dict[Pillar, PoolType] = {
    Pillar.VIOLENCE: PoolType.FURY,
    Pillar.INFLUENCE: PoolType.CLOUT,
    Pillar.REVELATION: PoolType.INSIGHT,
}


# =============================================================================
# Track and Pool Calculations
# =============================================================================

def calculate_track_max(scl: int, pillar_forward: bool = False) -> int:
    """Calculate TrackMax for a cost track."""
    base = TRACK_BASE + scl
    return base + 2 if pillar_forward else base


def calculate_strain_threshold(track_max: int) -> int:
    """Calculate StrainAt threshold (ceil(track_max / 2))."""
    return (track_max + 1) // 2


def calculate_overflow_threshold(track_max: int) -> int:
    """Calculate OverflowAt threshold (= track_max)."""
    return track_max


def calculate_reset_value(track_max: int) -> int:
    """Calculate reset value after Overflow (floor(track_max / 2))."""
    return track_max // 2


def calculate_meta_max(scl: int) -> int:
    """Calculate MetaMax for a meta-currency pool."""
    return META_BASE + scl


def get_starting_pool(is_primary: bool) -> int:
    """Get starting pool value at session start."""
    return 1 if is_primary else 0


# =============================================================================
# Cost Track
# =============================================================================

@dataclass
class CostTrack:
    """A cost track (Blood, Fate, or Stain)."""
    track_type: TrackType
    current: int = 0
    maximum: int = 0
    strain_triggered_this_scene: bool = False

    @property
    def strain_at(self) -> int:
        """Strain threshold."""
        return calculate_strain_threshold(self.maximum)

    @property
    def overflow_at(self) -> int:
        """Overflow threshold."""
        return self.maximum

    @property
    def is_strained(self) -> bool:
        """Whether currently at or above strain threshold."""
        return self.current >= self.strain_at

    @property
    def is_overflowing(self) -> bool:
        """Whether at overflow (full)."""
        return self.current >= self.overflow_at

    def mark(self, amount: int = 1) -> Tuple[bool, bool]:
        """
        Mark boxes on the track.

        Returns:
            Tuple of (strain_crossed, overflow_triggered)
        """
        was_strained = self.is_strained
        self.current = min(self.current + amount, self.maximum)

        strain_crossed = (
            not was_strained and
            self.is_strained and
            not self.strain_triggered_this_scene
        )
        if strain_crossed:
            self.strain_triggered_this_scene = True

        overflow_triggered = self.is_overflowing
        return (strain_crossed, overflow_triggered)

    def resolve_overflow(self) -> None:
        """Reset track after overflow."""
        self.current = calculate_reset_value(self.maximum)

    def reset_scene(self) -> None:
        """Reset per-scene flags."""
        self.strain_triggered_this_scene = False

    def clear(self, amount: int = 1) -> int:
        """Clear boxes from the track. Returns amount actually cleared."""
        actual = min(amount, self.current)
        self.current -= actual
        return actual


# =============================================================================
# Meta-Currency Pool
# =============================================================================

@dataclass
class MetaPool:
    """A meta-currency pool (Fury, Clout, or Insight)."""
    pool_type: PoolType
    current: int = 0
    maximum: int = 0

    def gain(self, amount: int = 1) -> int:
        """
        Gain meta-currency.

        Returns:
            Actual amount gained (may be less if capped)
        """
        actual = min(amount, self.maximum - self.current)
        self.current += actual
        return actual

    def spend(self, amount: int = 1) -> bool:
        """
        Spend meta-currency.

        Returns:
            True if successful, False if insufficient
        """
        if self.current >= amount:
            self.current -= amount
            return True
        return False

    def can_afford(self, amount: int = 1) -> bool:
        """Check if pool can afford a spend."""
        return self.current >= amount


# =============================================================================
# Spend Types
# =============================================================================

class SpendType(str, Enum):
    """Types of meta-currency spends."""
    # Standard spends (any pool)
    REROLL = "Reroll"
    BOOST = "Boost"
    SHAKE_IT_OFF = "ShakeItOff"

    # Push (any pool, matching pillar)
    PUSH_THE_LIMITS = "PushTheLimits"

    # Fury-specific
    LAST_STAND = "LastStand"

    # Clout-specific
    SPIN_THE_NARRATIVE = "SpinTheNarrative"
    PUBLIC_SYMPATHY = "PublicSympathy"

    # Insight-specific
    CONNECT_THE_DOTS = "ConnectTheDots"
    HOLD_THE_PATTERN = "HoldThePattern"


SPEND_COSTS: Dict[SpendType, int] = {
    SpendType.REROLL: 1,
    SpendType.BOOST: 1,
    SpendType.SHAKE_IT_OFF: 1,
    SpendType.PUSH_THE_LIMITS: 1,  # Plus track mark
    SpendType.LAST_STAND: 2,
    SpendType.SPIN_THE_NARRATIVE: 1,
    SpendType.PUBLIC_SYMPATHY: 1,
    SpendType.CONNECT_THE_DOTS: 1,
    SpendType.HOLD_THE_PATTERN: 1,
}

SPEND_POOL_REQUIREMENTS: Dict[SpendType, Optional[PoolType]] = {
    SpendType.REROLL: None,  # Any pool
    SpendType.BOOST: None,
    SpendType.SHAKE_IT_OFF: None,  # Must match pillar
    SpendType.PUSH_THE_LIMITS: None,  # Must match pillar
    SpendType.LAST_STAND: PoolType.FURY,
    SpendType.SPIN_THE_NARRATIVE: PoolType.CLOUT,
    SpendType.PUBLIC_SYMPATHY: PoolType.CLOUT,
    SpendType.CONNECT_THE_DOTS: PoolType.INSIGHT,
    SpendType.HOLD_THE_PATTERN: PoolType.INSIGHT,
}


# =============================================================================
# Gain Triggers
# =============================================================================

class GainTrigger(str, Enum):
    """Deterministic gain triggers per ADR-0007."""
    COMPLICATION_APPLIED = "ComplicationApplied"
    COMPLICATION_INVOKED = "ComplicationInvoked"
    BARGAIN_ACCEPTED = "BargainAccepted"
    STRAIN_CROSSED = "StrainCrossed"
    HOSTILE_INVOCATION = "HostileInvocation"


def process_gain_trigger(
    trigger: GainTrigger,
    pillar: Pillar,
    pool: MetaPool,
    is_end_of_scene: bool = False
) -> int:
    """
    Process a gain trigger and return amount gained.

    HostileInvocation gains are deferred to end of scene.
    """
    if trigger == GainTrigger.HOSTILE_INVOCATION and not is_end_of_scene:
        return 0  # Deferred
    return pool.gain(1)


# =============================================================================
# Strain and Overflow Effects
# =============================================================================

@dataclass
class StrainEffect:
    """Effect when crossing strain threshold."""
    track_type: TrackType
    penalty: int = -1  # Applies to pillar-facing rolls
    meta_gained: int = 1


@dataclass
class OverflowEffect:
    """Effect when track overflows."""
    track_type: TrackType
    fallout_pillar: str
    fallout_severity: int  # Condition rung
    reset_to: int
    clears_meta: bool = False


def get_strain_effect(track_type: TrackType) -> StrainEffect:
    """Get the strain effect for a track type."""
    return StrainEffect(track_type=track_type, penalty=-1, meta_gained=1)


def get_overflow_effect(track_type: TrackType, track_max: int) -> OverflowEffect:
    """Get the overflow effect for a track type."""
    reset_to = calculate_reset_value(track_max)

    if track_type == TrackType.BLOOD:
        return OverflowEffect(
            track_type=track_type,
            fallout_pillar="Violence",
            fallout_severity=3,  # Mortally Wounded
            reset_to=reset_to,
            clears_meta=False
        )
    elif track_type == TrackType.FATE:
        return OverflowEffect(
            track_type=track_type,
            fallout_pillar="Influence",
            fallout_severity=2,  # Discredited or worse
            reset_to=reset_to,
            clears_meta=True  # Lose all Clout
        )
    else:  # STAIN
        return OverflowEffect(
            track_type=track_type,
            fallout_pillar="Revelation",
            fallout_severity=3,  # Deranged
            reset_to=reset_to,
            clears_meta=True  # Insight zeroed
        )


# =============================================================================
# Push Mechanics
# =============================================================================

@dataclass
class PushResult:
    """Result of a Push the Limits action."""
    success: bool
    new_off_cap: int
    track_marked: bool
    error: Optional[str] = None


def resolve_push(
    pool: MetaPool,
    track: CostTrack,
    current_off_cap: int
) -> PushResult:
    """
    Resolve a Push the Limits action.

    Must be called BEFORE rolling.
    After roll resolves, call apply_push_cost().
    """
    if not pool.can_afford(1):
        return PushResult(
            success=False,
            new_off_cap=current_off_cap,
            track_marked=False,
            error="Insufficient meta-currency"
        )

    pool.spend(1)
    new_cap = current_off_cap + PUSH_CAP_BONUS

    return PushResult(
        success=True,
        new_off_cap=new_cap,
        track_marked=False  # Mark after roll
    )


def apply_push_cost(track: CostTrack) -> Tuple[bool, bool]:
    """
    Apply the track cost after a Push roll completes.

    Returns:
        Tuple of (strain_crossed, overflow_triggered)
    """
    return track.mark(1)


# =============================================================================
# Character Economy State
# =============================================================================

@dataclass
class CharacterEconomy:
    """Complete economy state for a character."""
    scl: int
    primary_pillar: Pillar

    # Cost tracks
    blood: CostTrack = field(default_factory=lambda: CostTrack(TrackType.BLOOD))
    fate: CostTrack = field(default_factory=lambda: CostTrack(TrackType.FATE))
    stain: CostTrack = field(default_factory=lambda: CostTrack(TrackType.STAIN))

    # Meta pools
    fury: MetaPool = field(default_factory=lambda: MetaPool(PoolType.FURY))
    clout: MetaPool = field(default_factory=lambda: MetaPool(PoolType.CLOUT))
    insight: MetaPool = field(default_factory=lambda: MetaPool(PoolType.INSIGHT))

    def __post_init__(self):
        """Initialize track/pool maximums from SCL."""
        track_max = calculate_track_max(self.scl)
        meta_max = calculate_meta_max(self.scl)

        self.blood.maximum = track_max
        self.fate.maximum = track_max
        self.stain.maximum = track_max

        self.fury.maximum = meta_max
        self.clout.maximum = meta_max
        self.insight.maximum = meta_max

        # Set starting pool values
        self.fury.current = 1 if self.primary_pillar == Pillar.VIOLENCE else 0
        self.clout.current = 1 if self.primary_pillar == Pillar.INFLUENCE else 0
        self.insight.current = 1 if self.primary_pillar == Pillar.REVELATION else 0

    def get_track(self, track_type: TrackType) -> CostTrack:
        """Get track by type."""
        return {
            TrackType.BLOOD: self.blood,
            TrackType.FATE: self.fate,
            TrackType.STAIN: self.stain,
        }[track_type]

    def get_pool(self, pool_type: PoolType) -> MetaPool:
        """Get pool by type."""
        return {
            PoolType.FURY: self.fury,
            PoolType.CLOUT: self.clout,
            PoolType.INSIGHT: self.insight,
        }[pool_type]

    def get_track_for_pillar(self, pillar: Pillar) -> CostTrack:
        """Get the track associated with a pillar."""
        track_type = PILLAR_TO_TRACK[pillar]
        return self.get_track(track_type)

    def get_pool_for_pillar(self, pillar: Pillar) -> MetaPool:
        """Get the pool associated with a pillar."""
        pool_type = PILLAR_TO_POOL[pillar]
        return self.get_pool(pool_type)

    def reset_scene(self) -> None:
        """Reset per-scene flags on all tracks."""
        self.blood.reset_scene()
        self.fate.reset_scene()
        self.stain.reset_scene()

    def session_start(self) -> None:
        """Reset pools for session start."""
        self.fury.current = 1 if self.primary_pillar == Pillar.VIOLENCE else 0
        self.clout.current = 1 if self.primary_pillar == Pillar.INFLUENCE else 0
        self.insight.current = 1 if self.primary_pillar == Pillar.REVELATION else 0
