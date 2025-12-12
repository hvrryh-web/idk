# ADR-0007: Tracks, Strain, Overflow, and Meta-Currency Spends

**Status**: Accepted

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

ADR-0001 through ADR-0006 lock the engine, stat spine, bonus composition, skills/tags, technique tags, and condition ladders. What remains to fully "close the loop" for SRD + web/VN implementation is the economy layer:

1. **Cost tracks** that express "Power Draws Blood" over time (Blood/Fate/Stain), including Strain and Overflow pacing beats
2. **Positive meta-currencies** (Fury/Clout/Insight) with deterministic gain triggers, standardized spends, and a defined Push mechanism
3. Alignment with proven patterns: "push yourself at a cost" (stress-for-performance) and "spend a point to reroll/flat bonus"

---

## Decision

### 1. Canonical Cost Tracks (Blood, Fate, Stain)

Every PC has three cost tracks: **Blood**, **Fate**, **Stain**.

#### Track Maximums

```
TrackMax = 3 + SCL
```

**Optional table dial**: If a pillar is Blood-Forward, you may add +2 boxes to that pillar's associated track:
- Violence → Blood
- Influence → Fate
- Revelation → Stain

#### Thresholds

| Threshold | Formula | Effect |
|-----------|---------|--------|
| **Strain** | `ceil(TrackMax / 2)` | First crossing triggers Strain effects |
| **Overflow** | `TrackMax` | Track full triggers Cost Crash |

---

### 2. Strain Effects (Deterministic)

When you first reach or exceed StrainAt on a given track **in a scene**:

| Track | Strain Penalty | Affected Rolls |
|-------|----------------|----------------|
| **Blood** | -1 Blood Strained | Body Defense/Resilience, Violence checks |
| **Fate** | -1 Fate Strained | Influence checks; +1 faction clock tick |
| **Stain** | -1 Stain Strained | Mind checks; +1 TN on Revelation resistance |

**Immediate gain**: +1 meta-currency of matching pillar (Blood→Fury, Fate→Clout, Stain→Insight)

This gain can happen **once per track per scene**.

---

### 3. Overflow Effects (Deterministic Crash + Reset)

When a track fills completely (reaches OverflowAt), resolve an immediate **Cost Crash**:

| Track | Overflow Effect | Reset To |
|-------|-----------------|----------|
| **Blood** | Violence fallout (2nd-3rd degree condition or Mortally Wounded) | `floor(TrackMax/2)` |
| **Fate** | Major Influence twist (betrayal/scandal); lose all Clout or spend to mitigate | `floor(TrackMax/2)` |
| **Stain** | Revelation fallout (3rd degree or worse); Insight zeroed or halved | `floor(TrackMax/2)` |

---

### 4. Meta-Currency Pools (Fury, Clout, Insight)

Each PC may have 0–3 pools:

| Pool | Pillar | Associated Track |
|------|--------|------------------|
| **Fury** | Violence | Blood |
| **Clout** | Influence | Fate |
| **Insight** | Revelation | Stain |

**Starting values** (session start):
- 1 in your primary pillar pool
- 0 in others unless explicitly granted

**Pool maximum**:
```
MetaMax = 3 + SCL
```

---

### 5. Deterministic Gain Triggers

You gain +1 Fury/Clout/Insight (matching the pillar) when any of the following occurs:

| Trigger | Description |
|---------|-------------|
| **Complication triggers against you** | A Complication Tag of that pillar is applied to you or invoked to hinder you |
| **Accept a Bargain** | Voluntarily accept a declared downside (Complication Tag, clock tick, or track mark) before rolling |
| **Strain crossing** | Automatic +1 when a track first crosses Strain in a scene (per §2) |
| **Hostile invocation parity** | If an opponent invokes one of your Tags against you, gain +1 at end of scene |

**Overflow rule**: If a gain would exceed MetaMax, the point is lost unless immediately spent as part of the same resolution window.

---

### 6. Standard Spends (Any Pool)

Spend 1 Fury/Clout/Insight to do **one** of the following:

| Spend | Effect |
|-------|--------|
| **Reroll** | Reroll one d20 you rolled; keep the better |
| **Boost** | Add +3 to your total after seeing the roll but before DoS is finalized |
| **Shake It Off** | Downgrade a 1st-degree condition in that pillar (Injured/Rattled/Shaken → cleared) |

---

### 7. Push (Cap Overdraw)

**Push** is a pillar-specific "extra effort" action: a temporary cap exception purchased with meta-currency plus track cost.

#### Push the Limits (Unified)

1. **Spend**: 1 matching meta-currency (Fury for Violence, Clout for Influence, Insight for Revelation)
2. **Effect**: For one roll, treat that pillar's OffCap as +2 for band validation:
   ```
   Attack + EffectRank + VirtualRanks ≤ OffCap(pillar) + 2
   ```
3. **Cost**: After the roll (hit or miss), immediately mark +1 matching cost track (Blood/Fate/Stain)

**Timing rule** (locked): You must declare Push **before rolling**. No retroactive Push.

---

### 8. Pillar-Specific Spends (v1.0 Core List)

These are SRD-legal "stunts" on top of standard spends:

#### Fury (Violence)

| Spend | Cost | Effect |
|-------|------|--------|
| **Push the Limits** | 1 Fury + 1 Blood | OffCap+2 for one roll |
| **Last Stand** | 2 Fury | Act through Mortally Wounded for one round with -2 to all rolls; further harm can escalate to Ruined Body |

#### Clout (Influence)

| Spend | Cost | Effect |
|-------|------|--------|
| **Push the Limits** | 1 Clout + 1 Fate | OffCap+2 for one roll |
| **Spin the Narrative** | 1 Clout | Establish a minor relationship/reputation detail as a Scene Tag with 1 Free Invoke |
| **Public Sympathy** | 1 Clout | Downgrade Discredited (2nd) to Rattled (1st) for the scene |

#### Insight (Revelation)

| Spend | Cost | Effect |
|-------|------|--------|
| **Push the Limits** | 1 Insight + 1 Stain | OffCap+2 for one roll |
| **Connect the Dots** | 1 Insight | Ask one focused mystery question; answer must be truthful within inferable scope |
| **Hold the Pattern** | 1 Insight | Delay onset/escalation of a Revelation condition by one round or one scene |

---

## Options Considered

1. **Purely GM-discretionary metacurrency gains**: Rejected; not implementation-grade for VN/web
2. **Single universal "stress" track**: Rejected; collapses pillar theming
3. **Selected: Three thematically keyed cost tracks + three keyed meta pools** with deterministic triggers, plus Push as a controlled cap exception

---

## Rationale

- "Push yourself for performance at a cost" is a proven pacing lever (stress economy) and cleanly maps onto the "Power Draws Blood" doctrine
- "Spend for reroll/flat bonus; hostile invokes feed opponents later" is a proven, stable metacurrency pattern
- Overflow as an explicit, foreshadowed beat supports both tabletop pacing and VN authoring

---

## Consequences

### Positive

- **Deterministic economy**: SRD treats gain triggers as rules, not guidance
- **Predictable pacing**: Strain/Overflow as foreshadowed beats
- **Implementable pipeline**: Code can implement `ApplyCostMarks → CheckThresholds → AwardMeta → ResolveSpends`

### Negative

- **Tracking overhead**: Three tracks + three pools per character
- **Balance sensitivity**: TrackMax and Bargain availability strongly affect survivability

### Balance Knobs

- `TrackMax = 2 + SCL` for harsher tone
- Restricting Bargain availability reduces player survivability
- Adjusting Overflow reset point affects recovery pacing

---

## Canonical Economy Appendix (SRD + Codebase Reference)

### Constants

```python
TRACK_BASE = 3
META_BASE = 3
PUSH_CAP_BONUS = 2
STANDARD_BOOST = 3
```

### Track Calculations

```python
def calculate_track_max(scl: int, pillar_forward: bool = False) -> int:
    """Calculate TrackMax for a cost track."""
    base = TRACK_BASE + scl
    return base + 2 if pillar_forward else base

def calculate_strain_threshold(track_max: int) -> int:
    """Calculate StrainAt threshold."""
    return (track_max + 1) // 2  # ceil(track_max / 2)

def calculate_overflow_threshold(track_max: int) -> int:
    """Calculate OverflowAt threshold."""
    return track_max

def calculate_reset_value(track_max: int) -> int:
    """Calculate reset value after Overflow."""
    return track_max // 2  # floor(track_max / 2)
```

### Meta Pool Calculations

```python
def calculate_meta_max(scl: int) -> int:
    """Calculate MetaMax for a meta-currency pool."""
    return META_BASE + scl

def get_starting_pool(is_primary: bool) -> int:
    """Get starting pool value at session start."""
    return 1 if is_primary else 0
```

### Track and Pool Schema

```python
from dataclasses import dataclass
from enum import Enum
from typing import Optional

class TrackType(str, Enum):
    BLOOD = "Blood"
    FATE = "Fate"
    STAIN = "Stain"

class PoolType(str, Enum):
    FURY = "Fury"
    CLOUT = "Clout"
    INSIGHT = "Insight"

TRACK_TO_POOL = {
    TrackType.BLOOD: PoolType.FURY,
    TrackType.FATE: PoolType.CLOUT,
    TrackType.STAIN: PoolType.INSIGHT,
}

POOL_TO_TRACK = {v: k for k, v in TRACK_TO_POOL.items()}

@dataclass
class CostTrack:
    track_type: TrackType
    current: int = 0
    maximum: int = 0
    strain_triggered_this_scene: bool = False

    @property
    def strain_at(self) -> int:
        return calculate_strain_threshold(self.maximum)

    @property
    def overflow_at(self) -> int:
        return self.maximum

    @property
    def is_strained(self) -> bool:
        return self.current >= self.strain_at

    @property
    def is_overflowing(self) -> bool:
        return self.current >= self.overflow_at

    def mark(self, amount: int = 1) -> tuple[bool, bool]:
        """
        Mark boxes on the track.
        Returns (strain_crossed, overflow_triggered)
        """
        was_strained = self.is_strained
        self.current = min(self.current + amount, self.maximum)

        strain_crossed = not was_strained and self.is_strained and not self.strain_triggered_this_scene
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

@dataclass
class MetaPool:
    pool_type: PoolType
    current: int = 0
    maximum: int = 0

    def gain(self, amount: int = 1) -> int:
        """
        Gain meta-currency. Returns actual amount gained.
        """
        actual = min(amount, self.maximum - self.current)
        self.current += actual
        return actual

    def spend(self, amount: int = 1) -> bool:
        """
        Spend meta-currency. Returns True if successful.
        """
        if self.current >= amount:
            self.current -= amount
            return True
        return False

    def can_afford(self, amount: int = 1) -> bool:
        return self.current >= amount
```

### Spend Types

```python
class SpendType(str, Enum):
    REROLL = "Reroll"
    BOOST = "Boost"
    SHAKE_IT_OFF = "ShakeItOff"
    PUSH_THE_LIMITS = "PushTheLimits"
    LAST_STAND = "LastStand"
    SPIN_THE_NARRATIVE = "SpinTheNarrative"
    PUBLIC_SYMPATHY = "PublicSympathy"
    CONNECT_THE_DOTS = "ConnectTheDots"
    HOLD_THE_PATTERN = "HoldThePattern"

SPEND_COSTS = {
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

SPEND_POOL_REQUIREMENTS = {
    SpendType.LAST_STAND: PoolType.FURY,
    SpendType.SPIN_THE_NARRATIVE: PoolType.CLOUT,
    SpendType.PUBLIC_SYMPATHY: PoolType.CLOUT,
    SpendType.CONNECT_THE_DOTS: PoolType.INSIGHT,
    SpendType.HOLD_THE_PATTERN: PoolType.INSIGHT,
}
```

### Gain Triggers

```python
class GainTrigger(str, Enum):
    COMPLICATION_APPLIED = "ComplicationApplied"
    COMPLICATION_INVOKED = "ComplicationInvoked"
    BARGAIN_ACCEPTED = "BargainAccepted"
    STRAIN_CROSSED = "StrainCrossed"
    HOSTILE_INVOCATION = "HostileInvocation"

def process_gain_trigger(
    trigger: GainTrigger,
    pillar: str,
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
```

### Push Resolution

```python
@dataclass
class PushResult:
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

def apply_push_cost(track: CostTrack) -> tuple[bool, bool]:
    """
    Apply the track cost after a Push roll completes.
    Returns (strain_crossed, overflow_triggered).
    """
    return track.mark(1)
```

### Strain and Overflow Effects

```python
@dataclass
class StrainEffect:
    track_type: TrackType
    penalty: int = -1
    meta_gained: int = 1

@dataclass
class OverflowEffect:
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
```

---

## References

- ADR-0001: Core Resolution Engine (Opposed d20 + Rank Dice, ±4 DoS)
- ADR-0002: Canonical Stat Model and Pillar→Defense Mapping
- ADR-0004: Skill Layer and Tagging
- ADR-0006: Effect Resolution and Condition Ladders
- Blades in the Dark: Stress economy, Push mechanics
- Fate SRD: Meta-currency spends, Hostile invocations
