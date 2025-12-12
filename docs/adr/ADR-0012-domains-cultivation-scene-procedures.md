# ADR-0012: Domains as Cultivation Power Sources and Scene Procedures

**Status**: Accepted

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

Domains must function as:
1. A **cultivation-facing identity layer** (the first on-ramp to multiple cultivation forms)
2. A **mechanical authority system** for what a character is allowed to do reliably
3. A **scene procedure engine** for clocks, pressures, and "rule-space" effects

Domains must integrate cleanly with:
- Pillar conflict model (Violence / Influence / Revelation) and effect ranks
- Meta-currencies and cost tracks (Fury/Clout/Insight; Blood/Fate/Stain) as pacing levers
- SCL-based budgeting and point-buy expectations (SCL 2 PCs as the baseline calibration set)

---

## Decision

### D1. Domain Object Model (Canonical)

A **Domain** is a named cultivated source of power with explicit tags and ranks.

Each Domain has:
- **DomainID**, **Name**
- **DomainRank** (0–N; recommended cap scales with SCL)
- **Pillar Affinity**: one primary pillar, optional secondary pillar
- **Domain Tags** (taxonomy references ADR-0005; this ADR defines the Domain-specific subset)
- **Scene Tag Rules**: which scene tags it creates/consumes (validated against ADR-0005 rules)
- **Pressure Profile**: how it projects pressure into a scene (see D4)

### D2. DomainRank Mechanical Contributions

DomainRank contributes in three ways:

#### 1. Authority (Gating)
- Certain techniques/effects require a minimum DomainRank or a Domain tag match to be legal to purchase/use

#### 2. VirtualRanks (Bounded Bonuses)
A Domain may grant **VirtualRanks** to specific effect categories or skill/tagged checks, but:
- VirtualRanks **count toward caps** exactly like purchased ranks (not "free cap bypass")
- VirtualRanks must declare their scope (pillar + effect family + tag condition)

#### 3. Scene Procedure Hooks
DomainRank determines how many times per scene the Domain can:
- Push pressure
- Advance clocks
- Invoke a Domain Clause (see D4/D5)

### D3. Domain Acquisition and Progression

- PCs begin with **1 Primary Domain** at creation; additional Domains are optional and must be bought with SCP/advancement
- DomainRank increases are purchased like other scalable features (costing is handled in the point-buy layer)
- Domains can be "reskinned" in fiction (Gu, Contracts, Sword Intent, Bureaucracy of Heaven, etc.) but must map to the same mechanics

### D4. Domain Pressure (Always-On Scene Modifier)

Each Domain can project **Pressure** into a scene when thematically relevant, chosen at scene start:

- Pressure is expressed as a **Scene Tag** plus a **Pressure Rank** (usually tied to DomainRank, capped by SCL)
- Pressure Rank provides one of:

| Pressure Type | Effect |
|---------------|--------|
| **Passive pressure** | Penalties/bonuses to defined rolls (tag-scoped) |
| **Threshold pressure** | If an actor reaches a condition degree threshold, trigger an extra clock tick or forced cost mark |
| **Rule pressure** | Introduces a limited "rule-space" clause (e.g., "movement is contested," "lies leave traces") |

### D5. Domain Clocks (Macro-Resolution Inside Scenes)

- Each Domain may define 1–2 standard **Domain Clocks** (4/6/8 segments)
- **Degrees of Success** on relevant actions can advance clocks by segments (Beat-based play)
- Clock resolution is handled at **End-of-Round** (combat) or **End-of-Beat** (non-combat)

### D6. Domain Clash and Domain Expansion (Optional, but Standardized)

If the project includes "expansion"-style rulespaces:

- A **Domain Expansion** is a **Major action** by default (ties into ADR-0011 stage model)
- Expansion sets/overrides the scene's active Domain Pressure and activates a dedicated Domain Clock
- Expansion should always have an explicit cost hook (Blood/Fate/Stain mark, or a meta-currency spend), to preserve "power is not free"

---

## Consequences

- Domains become the system's clean bridge between:
  - Character build identity (what you cultivate)
  - Tactical procedure (pressure, clash)
  - Narrative pacing (clocks and beats)
- The VN implementation can represent Domains as a small set of serializable fields plus a predictable set of hooks (pressure + clock + tag IO)
- Because VirtualRanks still count toward caps, Domains add flexibility without breaking the SCL-bounded balance model

---

## Canonical Domain Schema (SRD + Codebase Reference)

### Domain Object

```python
@dataclass
class Domain:
    domain_id: str
    name: str
    domain_rank: int = 0  # 0-N, typically capped by SCL
    primary_pillar: Pillar = Pillar.VIOLENCE
    secondary_pillar: Optional[Pillar] = None
    
    # Tags and permissions
    domain_tags: List[str] = field(default_factory=list)
    scene_tag_rules: List[str] = field(default_factory=list)
    
    # Pressure profile
    pressure_type: Optional[PressureType] = None
    pressure_rank: int = 0
    
    # Clocks
    domain_clocks: List[Clock] = field(default_factory=list)
    
    # State
    state: DomainState = DomainState.DORMANT
    
    @property
    def max_pressure_rank(self) -> int:
        """Maximum pressure rank (usually DomainRank, capped by SCL)."""
        return self.domain_rank
    
    @property
    def virtual_ranks_available(self) -> int:
        """VirtualRanks available from this Domain."""
        return self.domain_rank
```

### Pressure Types

```python
class PressureType(str, Enum):
    PASSIVE = "Passive"      # Penalties/bonuses to rolls
    THRESHOLD = "Threshold"  # Extra clock ticks on condition thresholds
    RULE = "Rule"            # Limited rule-space clause
```

### Domain Expansion

```python
@dataclass
class DomainExpansion:
    domain_id: str
    action_type: str = "Major"  # ADR-0011 action type
    pressure_override: Optional[PressureType] = None
    expansion_clock: Optional[Clock] = None
    cost_track: Optional[TrackType] = None
    cost_amount: int = 1
    meta_currency_cost: int = 0
    
    def validate_cost(self, pool: MetaPool, track: CostTrack) -> bool:
        """Check if expansion cost can be paid."""
        if self.meta_currency_cost > 0 and not pool.can_afford(self.meta_currency_cost):
            return False
        # Track marks are applied, not validated as "affordable"
        return True
```

---

## References

- ADR-0001: Core Resolution Engine
- ADR-0005: Technique Tag Taxonomy
- ADR-0007: Tracks, Strain, Overflow, Meta-Currency
- ADR-0008: Turn Structure, Action Economy
- ADR-0009: Domains, Clocks, Multi-Stage Conflict
- ADR-0011: Sequence Level Scheduler
