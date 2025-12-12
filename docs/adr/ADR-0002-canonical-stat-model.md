# ADR-0002: Canonical Stat Model and Pillar→Defense Mapping

**Status**: Accepted

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

We need a single, authoritative "character math spine" that the SRD and the web/VN rules engine can reference without contradictions. The current project materials contain two competing pillar mappings (Influence↔Mind vs Influence↔Soul) and two competing stat layer models (a 6-stat "root" model vs a 9-primary model that derives the 3 cores).

The SRD and codebase require:
1. One canonical stat schema
2. One canonical pillar→attack/defense/resilience mapping
3. One canonical set of derived formulas and cap checks that align with character creation and SCP budgets

ADRs are treated as immutable records; future changes must supersede this ADR rather than silently editing it.

---

## Decision

### 1. Canonical Stats (Core SRD)

The game uses **six root stats only**:

**Core Stats**:
- Body
- Mind
- Soul

**Aether Stats**:
- Control
- Fate
- Spirit

### 2. Canonical Derived Tiers

```
CL  = floor((Body + Mind + Soul) / 3)
SL  = floor((Control + Fate + Spirit) / 3)
SCL = CL + SL
```

### 3. Canonical Pillar Mapping (Locks the "Triad")

| Pillar | Attack | Defense | Resilience |
|--------|--------|---------|------------|
| **Violence** | Violence Attack | Body Defense | Body Resilience |
| **Influence** | Influence Attack | Soul Defense | Soul Resilience |
| **Revelation** | Revelation Attack | Mind Defense | Mind Resilience |

**This mapping is the canonical SRD rule** and supersedes earlier draft text that mapped Influence→Mind and Revelation→Soul.

### 4. Canonical Trait Purchasing (SCP) and Campaign Budget

**Campaign starting budget**:
```
Total SCP = 30 × SCL
```

**Root stats cost**:
- Each +1 in Body/Mind/Soul/Control/Fate/Spirit costs **2 SCP**

**Pillar traits cost**:
- Each +1 in Attack/Defense/Resilience costs **1 SCP**

### 5. Canonical Caps and Validation Checks (Per Pillar, Per Character)

For each pillar, choose a permanent **Power Draws Blood** profile:

| Profile | OffCap | DefCap |
|---------|--------|--------|
| **Balanced** | 4×SCL | 4×SCL |
| **Blood-Forward** | 4×SCL + 2 | 4×SCL − 2 |
| **Ward-Forward** | 4×SCL − 2 | 4×SCL + 2 |

**Defense band validation**:
```
Defense + Resilience ≤ DefCap(pillar)
```

**Offense band validation**:
```
Attack + EffectRank + VirtualRanks ≤ OffCap(pillar)
```

### 6. Integration with ADR-0001 Rank Dice

```
MartialRank  = CL
SorceryRank = SL
```

This is the canonical source of Rank for the rank-dice function in the Core Resolution Engine (ADR-0001).

---

## Options Considered

1. **6 root stats only (selected)**: Simplest, already written into Quick Build and cap/budget text; minimizes "double-paying for numbers."

2. **9 primaries → derive 3 cores → derive CL/SL**: Richer granularity, but increases implementation complexity and currently conflicts with the 6-stat chargen and pillar trait blocks.

3. **Hybrid (support both simultaneously)**: Rejected for SRD v1.0 because it will continuously reintroduce contradictions and increases surface area for balancing errors.

---

## Rationale

- The 6-stat model is already expressed as the "root numbers used to derive CL/SL/SCL" in the character sheet template and quick-build procedure, including explicit SCP costs and cap checks.

- The selected pillar mapping (Influence→Soul, Revelation→Mind) is already the most internally consistent with later SRD-friendly pillar trait block, boss examples, and PDB/cap usage.

- Treating this as an ADR aligns with the "single source of truth" goal for an implementation-grade SRD and codebase: stable schema, explicit supersession rules, and minimized drift over time.

---

## Consequences

### Positive

- **Stable data model**: Web/VN rules engine becomes stable and minimal
- **Deterministic validation**: Build validation is now deterministic and automatable
- **Clear upgrade path**: Any later change must be done via ADR supersession

### Negative

- **9-stat layer deferred**: The 9-stat layer can be reintroduced later as an optional module (e.g., "Advanced Character Options") but must not be referenced by core procedures or validations
- **Removes earlier contradictory text**: All SRD text must be updated to remove the earlier contradictory mapping

### Data Model

```typescript
interface RootStats {
  Body: number;
  Mind: number;
  Soul: number;
  Control: number;
  Fate: number;
  Spirit: number;
}

interface Derived {
  CL: number;   // Core Level
  SL: number;   // Soul Level
  SCL: number;  // Soul Core Level
}

type Pillar = "Violence" | "Influence" | "Revelation";

interface PillarTraits {
  // Violence
  ViolenceAttack: number;
  BodyDefense: number;
  BodyResilience: number;
  
  // Influence
  InfluenceAttack: number;
  SoulDefense: number;
  SoulResilience: number;
  
  // Revelation
  RevelationAttack: number;
  MindDefense: number;
  MindResilience: number;
}

type PDBProfile = "Balanced" | "BloodForward" | "WardForward";

interface Caps {
  OffCap: number;  // Computed from SCL + PDB
  DefCap: number;  // Computed from SCL + PDB
}
```

### Validation Checks

1. Check SCL matches campaign SCL at chargen
2. Enforce band caps per pillar
3. Any later change (e.g., swapping pillar mapping, changing stat costs, redefining CL/SL) must be done via ADR supersession to avoid silent SRD/code divergence

---

## Canonical Stat and Cap Appendix (SRD + Codebase Reference)

### Root Stats

Integers: Body, Mind, Soul, Control, Fate, Spirit

Default start at 0; optional -1 only if explicitly allowed by campaign rules.

### Derived Tiers

```python
CL  = (Body + Mind + Soul) // 3
SL  = (Control + Fate + Spirit) // 3
SCL = CL + SL
```

### Ranks for ADR-0001

```python
MartialRank  = CL
SorceryRank = SL
```

### Pillar Trait Mapping

| Pillar | Attack | Defense | Resilience |
|--------|--------|---------|------------|
| Violence | ViolenceAttack | BodyDefense | BodyResilience |
| Influence | InfluenceAttack | SoulDefense | SoulResilience |
| Revelation | RevelationAttack | MindDefense | MindResilience |

### Budgets and Costs

```python
TotalSCP = 30 * SCL
ROOT_STAT_COST = 2      # SCP per +1
PILLAR_TRAIT_COST = 1   # SCP per +1
```

### Caps (Per Pillar)

```python
def calculate_off_cap(scl: int, profile: str) -> int:
    base = 4 * scl
    if profile == "BloodForward":
        return base + 2
    elif profile == "WardForward":
        return base - 2
    return base  # Balanced

def calculate_def_cap(scl: int, profile: str) -> int:
    base = 4 * scl
    if profile == "BloodForward":
        return base - 2
    elif profile == "WardForward":
        return base + 2
    return base  # Balanced
```

### Validation Checks

```python
def validate_offense_band(attack: int, effect_rank: int, virtual_ranks: int, off_cap: int) -> bool:
    return attack + effect_rank + virtual_ranks <= off_cap

def validate_defense_band(defense: int, resilience: int, def_cap: int) -> bool:
    return defense + resilience <= def_cap
```

---

## References

- ADR-0001: Core Resolution Engine (Opposed d20 + Rank Dice, ±4 DoS)
- ADR-0003: Bonus Composition and Contest Roles
- SRD_UNIFIED.md: Section 2 (Stats & Soul Core Level)
