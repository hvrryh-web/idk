# ADR-0005: Technique Tag Taxonomy and Validation Rules

**Status**: Accepted

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

We have locked:
1. A single opposed resolution engine with DoS bands (ADR-0001)
2. A canonical stat spine and pillar mapping with caps (ADR-0002)
3. Bonus composition and contest roles (ADR-0003)
4. A skill layer plus a generalized tagging/invocation system (ADR-0004)

We now need an SRD-grade, implementation-grade Technique Tag taxonomy that:
- Defines the exact allowed technique tags (v1.0 core list)
- Specifies which tags generate VirtualRanks that count against OffCap/DefCap band checks
- Specifies which tags create and/or consume Scene/Complication tags
- Provides deterministic validation rules for web/VN rules engine

---

## Decision

### 1. Technique Definition Schema (Canonical)

Every Technique is defined by the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `TechniqueID` | string | Stable identifier |
| `Name` | string | Display name |
| `Pillar` | enum | Violence, Influence, Revelation |
| `Approach` | enum | Martial, Sorcerous (default per ADR-0003; may be overridden) |
| `CoreEffectType` | enum | Strike, InfluenceAttack, RevelationAttack, Debilitate, Ward |
| `EffectRank` | int ≥ 0 | Purchased rank; counts toward caps |
| `Tags[]` | list | From v1.0 allowed tag list |
| `SCPBaseCost` | int | Derived from EffectRank and effect cost model |
| `SCPDelta` | int | Sum of tag adjustments (can be negative for Flaws) |
| `VirtualRanksOffense` | int | Sum of tag VirtualRanks for OffCap checks |
| `VirtualRanksDefense` | int | Sum of tag VirtualRanks for DefCap checks |
| `CreatesTags[]` | list | Scene/Complication tags this technique can create |
| `ConsumesTags[]` | list | Tags this technique can consume for effect |
| `Costs[]` | list | Track marks, meta-currency spend, cooldowns |

### 2. Tag Taxonomy: Three Classes

All technique tags are one of:

| Class | Purpose | SCP Effect | VirtualRanks |
|-------|---------|------------|--------------|
| **Descriptor** | Fiction-only permissions | None | None |
| **Extra** | Increase flexibility/power | Adds SCP | Often adds VirtualRanks |
| **Flaw** | Constrain use, impose costs | Reduces SCP | May mark cost tracks |

### 3. VirtualRanks Rule (Hard Constraint)

A technique's band check uses:

**Offense band**:
```
Attack + EffectRank + VirtualRanksOffense ≤ OffCap(pillar)
```

**Defense band**:
```
Defense + Resilience + WardBonus + VirtualRanksDefense ≤ DefCap(pillar)
```

Tags that increase reach/targets/duration frequently add VirtualRanks so that "bigger rules footprint" always consumes cap headroom.

### 4. Scene/Complication Tag Creation and Consumption

**Create Tags**:
- Technique with a Create tag generates a Scene/Complication tag with FreeInvokeCount
- Success (DoS ≥ +1): 1 Free Invoke
- Strong success (DoS ≥ +3): 2 Free Invokes
- Failure (DoS ≤ -1): Creates Complication Tag for opposition

**Consume Tags**:
- Techniques with Consume tags may remove an existing tag
- Gain a declared mechanical effect (+3, reroll, DoS step, or temporary VirtualRanks)

---

## V1.0 Allowed Technique Tags

### A) Descriptor Tags (No Cost; No VirtualRanks)

| Tag | Description |
|-----|-------------|
| `Melee` | Close combat range |
| `Ranged` | Projectile/distant |
| `Thrown` | Thrown weapon/object |
| `Gu` | Poison/curse cultivation |
| `Talisman` | Paper/seal magic |
| `SwordForm` | Formal sword technique |
| `Contract` | Bound spirit/entity |
| `Song` | Sound/music based |
| `Script` | Written/calligraphy magic |
| `Mirror` | Reflection/illusion |
| `Poison` | Toxin-based |
| `Shadow` | Darkness element |
| `Fire` | Fire element |
| `Ice` | Ice/cold element |
| `Lightning` | Electric element |
| `Nonlethal` | Requires GM permission for Violence outcomes |

### B) Core Geometry & Targeting (Extras)

| Tag | Type | SCP | VirtualRanks | Description |
|-----|------|-----|--------------|-------------|
| `Reach(+1)` | Extra, flat | +1 | +1 Offense | +1 zone/reach step |
| `FarShot(+1)` | Extra, flat | +1 | +1 Offense | Long-range extension |
| `Area(Burst/Line/Cone) r` | Extra, ranked | +1/r | +1 Offense/r | Area effect, radius r |
| `Multiattack r` | Extra, ranked | +1/r | +1 Offense/r | Distribute or focus hits |
| `Aura r` | Extra, ranked | +1/r | +1 Offense/r | Persists as zone hazard |

### C) Accuracy & Control (Extras)

| Tag | Type | SCP | VirtualRanks | Description |
|-----|------|-----|--------------|-------------|
| `Accurate` | Extra, flat | +1 | 0 | +2 to Attack bonus |
| `Reliable` | Extra, flat | +1 | 0 | Ignore first -1 penalty |
| `Piercing r` | Extra, ranked | +1/r | +1 Offense/r | Reduce Defense/Resilience by r |

### D) Severity Escalators (Extras, Always VirtualRanks)

| Tag | Type | SCP | VirtualRanks | Description |
|-----|------|-----|--------------|-------------|
| `Brutal r` | Extra, ranked | +1/r | +1 Offense/r | On 2+ DoS failure, advance condition +1 |
| `Echoing r` | Extra, ranked | +1/r | +1 Offense/r | Effect repeats next beat/round |
| `Lingering r` | Extra, ranked | +1/r | +1 Offense/r | Extends condition duration |

### E) Defensive Technique Tags (Ward-Focused)

| Tag | Type | SCP | VirtualRanks | Description |
|-----|------|-----|--------------|-------------|
| `Sustained` | Extra, flat | +1 | +1 Defense | Ward persists without re-casting |
| `Shared r` | Extra, ranked | +1/r | +1 Defense/r | Ward covers additional allies |
| `Reactive` | Extra, flat | +1 | +1 Defense | May use as Counter |

### F) Advantage Creation and Exploitation

| Tag | Type | SCP | VirtualRanks | Description |
|-----|------|-----|--------------|-------------|
| `Mark(TagID)` | Extra, flat | +1 | 0 | Create Scene Tag on success |
| `Expose(TagID)` | Extra, flat | +1 | 0 | Revelation-flavored Mark |
| `Exploit(TagID)` | Extra, flat | +1 | 0 | Consume tag for +3 or reroll |
| `Shatter(TagID)` | Extra, flat | +1 | 0 | Consume tag to downgrade Ward |

### G) Cost-Linked Flaw Tags

| Tag | Type | SCP | Effect | Description |
|-----|------|-----|--------|-------------|
| `Tiring(Blood x)` | Flaw, ranked | -1/x | Marks Blood | Each use marks x Blood |
| `Backlash(Stain x)` | Flaw, ranked | -1/x | Marks Stain | Each use marks x Stain |
| `Traceable(Fate x)` | Flaw, ranked | -1/x | Marks Fate | Each use marks x Fate |
| `Anchored(Domain)` | Flaw, flat | -2 | Domain limit | Only usable in declared Domain |
| `PreparedDomain` | Flaw, flat | -1 | Setup required | Requires setup action |
| `Limited(Condition)` | Flaw, flat | -1 | Conditional | Only vs specific targets/situations |
| `ChargeUp` | Flaw, flat | -1 | Action cost | Requires 1 extra action before use |
| `SingleUse(Scene)` | Flaw, flat | -2 | Once per scene | Cannot repeat in same scene |
| `Unstable` | Flaw, flat | -1 | Risk | On DoS≤-2, create Complication on self |

### H) Approach/Pillar Override Tags

| Tag | Type | SCP | VirtualRanks | Description |
|-----|------|-----|--------------|-------------|
| `ApproachOverride(Martial/Sorcerous)` | Extra, flat | +1 | +1 Offense | Sets which Rank dice to use |
| `PillarShift(SecondaryPillar)` | Extra, flat | +2 | +2 Offense | Resolves as different pillar |

---

## Validation Rules (Hard Constraints)

### 1. Tag Count and Strength Limits (Per Technique)

- Each technique may have **0-3 Extras** and **0-3 Flaws** (max 6 total)
- A technique may include at most one of: `Area`, `Aura`, `Multiattack` (geometry exclusivity) unless it also includes at least one cost-linked Flaw (`Tiring`/`Backlash`/`Traceable`)

### 2. VirtualRanks Accounting (Non-Negotiable)

- Any Extra that expands targets/area/duration, bypasses defenses, or adds repeat/linger effects **must** contribute VirtualRanks
- Ward effects **must** count into DefCap while active

### 3. Cap and Budget Legality (Per ADR-0002)

```
Offense band: Attack + EffectRank + VirtualRanksOffense ≤ OffCap(pillar)
Defense band: Defense + Resilience + WardBonus + VirtualRanksDefense ≤ DefCap(pillar)
Total SCP spend = 30 × SCL
```

### 4. Scene Tag Creation/Consumption Legality

- A technique may create at most **one** Scene/Complication tag per use
- A technique may consume at most **one** tag per use
- Free invokes follow Create Advantage semantics (1 on success; 2 on strong success)

### 5. Currency/Cost Integration

- If a technique enables cap pushing or repeated high-impact outcomes, it **must** include an explicit cost gate (track marks or meta-currency)
- "Push yourself" costs must be expressed through Blood/Fate/Stain or pillar currency

---

## Options Considered

1. **Fully freeform, user-defined tags**: Rejected; SRD and codebase become non-deterministic
2. **Large exhaustive tag set**: Rejected for v1.0; too broad for balance and VN authoring
3. **Selected: Compact v1.0 tag set** with explicit VirtualRanks and Create/Consume semantics

---

## Rationale

- The free-invoke advantage model is a proven method for creating tactical/narrative states with bounded swing and clear UI prompts
- Assets/complications as attachable states are a proven approach for representing situational leverage without rewriting core resolution
- Cost-for-performance (push mechanics) is a proven knob for "burst" moments; we express it through the established track/currency economy

---

## Consequences

### Positive

- **Closed, auditable tag list**: Future expansions must be versioned (e.g., "Tag Set v1.1")
- **Deterministic compilation**: Technique → (SCP cost, VirtualRanks, Creates/Consumes tags, cap legality)
- **Tractable balance tuning**: Adjust VirtualRanks or SCP deltas per tag without rewriting engine

### Negative

- **Limited initial flexibility**: Creative techniques may need to wait for v1.1 tags
- **Strict validation**: Some player concepts may not fit v1.0 constraints

---

## Canonical Technique Tag Appendix (SRD + Codebase Reference)

### Technique Schema

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional

class CoreEffectType(str, Enum):
    STRIKE = "Strike"
    INFLUENCE_ATTACK = "InfluenceAttack"
    REVELATION_ATTACK = "RevelationAttack"
    DEBILITATE = "Debilitate"
    WARD = "Ward"

class TagClass(str, Enum):
    DESCRIPTOR = "Descriptor"
    EXTRA = "Extra"
    FLAW = "Flaw"

@dataclass
class TechniqueTag:
    tag_id: str
    tag_class: TagClass
    name: str
    scp_delta: int = 0
    virtual_ranks_offense: int = 0
    virtual_ranks_defense: int = 0
    rank: int = 0  # For ranked tags
    creates_tag: Optional[str] = None
    consumes_tag: Optional[str] = None
    cost_track: Optional[str] = None  # "Blood", "Fate", "Stain"
    cost_amount: int = 0

@dataclass
class Technique:
    technique_id: str
    name: str
    pillar: str  # "Violence", "Influence", "Revelation"
    approach: str = "Martial"  # or "Sorcerous"
    core_effect_type: CoreEffectType = CoreEffectType.STRIKE
    effect_rank: int = 0
    tags: List[TechniqueTag] = field(default_factory=list)
    
    @property
    def scp_base_cost(self) -> int:
        """Base cost from EffectRank (1 SCP per rank for most effects)."""
        return self.effect_rank
    
    @property
    def scp_delta(self) -> int:
        """Sum of tag adjustments."""
        return sum(t.scp_delta for t in self.tags)
    
    @property
    def scp_total(self) -> int:
        """Total SCP cost."""
        return max(0, self.scp_base_cost + self.scp_delta)
    
    @property
    def virtual_ranks_offense(self) -> int:
        """Sum of offensive VirtualRanks from tags."""
        return sum(t.virtual_ranks_offense for t in self.tags)
    
    @property
    def virtual_ranks_defense(self) -> int:
        """Sum of defensive VirtualRanks from tags."""
        return sum(t.virtual_ranks_defense for t in self.tags)
    
    @property
    def creates_tags(self) -> List[str]:
        """Scene/Complication tags this technique can create."""
        return [t.creates_tag for t in self.tags if t.creates_tag]
    
    @property
    def consumes_tags(self) -> List[str]:
        """Tags this technique can consume."""
        return [t.consumes_tag for t in self.tags if t.consumes_tag]
```

### Validation Functions

```python
def validate_technique_tag_counts(technique: Technique) -> tuple[bool, str]:
    """Validate tag count limits."""
    extras = [t for t in technique.tags if t.tag_class == TagClass.EXTRA]
    flaws = [t for t in technique.tags if t.tag_class == TagClass.FLAW]
    
    if len(extras) > 3:
        return False, f"Too many Extras: {len(extras)} > 3"
    if len(flaws) > 3:
        return False, f"Too many Flaws: {len(flaws)} > 3"
    if len(technique.tags) > 6:
        return False, f"Too many total tags: {len(technique.tags)} > 6"
    
    return True, ""

def validate_geometry_exclusivity(technique: Technique) -> tuple[bool, str]:
    """Validate geometry tag exclusivity."""
    geometry_tags = {"Area", "Aura", "Multiattack"}
    has_geometry = [t for t in technique.tags if any(g in t.tag_id for g in geometry_tags)]
    
    if len(has_geometry) > 1:
        # Check for cost-linked flaw
        cost_flaws = {"Tiring", "Backlash", "Traceable"}
        has_cost_flaw = any(any(f in t.tag_id for f in cost_flaws) for t in technique.tags)
        
        if not has_cost_flaw:
            return False, "Multiple geometry tags require a cost-linked Flaw"
    
    return True, ""

def validate_offense_cap(
    attack: int,
    effect_rank: int,
    virtual_ranks: int,
    off_cap: int
) -> tuple[bool, str]:
    """Validate offense band against cap."""
    total = attack + effect_rank + virtual_ranks
    if total > off_cap:
        return False, f"Offense band exceeds cap: {total} > {off_cap}"
    return True, ""

def validate_defense_cap(
    defense: int,
    resilience: int,
    ward_bonus: int,
    virtual_ranks: int,
    def_cap: int
) -> tuple[bool, str]:
    """Validate defense band against cap."""
    total = defense + resilience + ward_bonus + virtual_ranks
    if total > def_cap:
        return False, f"Defense band exceeds cap: {total} > {def_cap}"
    return True, ""

def validate_technique(
    technique: Technique,
    attack: int,
    off_cap: int
) -> tuple[bool, List[str]]:
    """Full technique validation."""
    errors = []
    
    # Tag counts
    valid, msg = validate_technique_tag_counts(technique)
    if not valid:
        errors.append(msg)
    
    # Geometry exclusivity
    valid, msg = validate_geometry_exclusivity(technique)
    if not valid:
        errors.append(msg)
    
    # Offense cap
    valid, msg = validate_offense_cap(
        attack,
        technique.effect_rank,
        technique.virtual_ranks_offense,
        off_cap
    )
    if not valid:
        errors.append(msg)
    
    return len(errors) == 0, errors
```

### Free Invoke Computation

```python
def compute_free_invokes(dos: int) -> int:
    """Compute free invokes for Create tag based on DoS."""
    if dos >= 3:
        return 2  # Strong success
    elif dos >= 1:
        return 1  # Success
    else:
        return 0  # Failure creates Complication instead
```

---

## References

- ADR-0001: Core Resolution Engine (Opposed d20 + Rank Dice, ±4 DoS)
- ADR-0002: Canonical Stat Model and Pillar→Defense Mapping
- ADR-0003: Bonus Composition and Contest Roles
- ADR-0004: Skill Layer and Tagging
- Fate SRD: Create an Advantage, Free Invokes
- Cortex Prime: Assets and Complications
- Blades in the Dark: Push Mechanics
