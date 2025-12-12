# ADR-0009: Domains, Clocks, and Multi-Stage Conflict Architecture

**Status**: Accepted — Locked

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

The system requires a deterministic, implementation-ready subsystem for Domains (cultivated sources of power and the first formal introduction to multiple cultivation forms), and a unified clock framework to drive pacing, escalation, and staged fights in both tabletop and VN formats.

The subsystem must integrate with:
- ADR-0001 opposed DoS engine (K=4), including TN mode
- ADR-0004/0005 tags and free invokes (Create Advantage semantics)
- ADR-0008 staged rounds, simultaneous resolution, seqLVL action economy, and OCR/DCR

---

## Decision

### 1. Domains: Definition, Rating, and Lifecycle

#### 1.1 Domain Definition

A **Domain** is a cultivated power construct with:
- A **Form** (e.g., Sword Domain, Mirror Domain, Contract Domain)
- A **Primary Pillar** (Violence, Influence, or Revelation)
- A **Domain Rating (DomR)** (0–4)
- A **Domain Tag** that can be created in scenes and invoked using ADR-0004 invocation rules

#### 1.2 Domain Rating (DomR) and Point-Buy Integration

- DomR is purchased during character build as a point-buy option
- **Cost**: DomR × 3 SCP (0–12 SCP total for DomR 0–4)
- DomR does not directly add to pillar traits; instead it enables bounded Domain Effects accounted via VirtualRanks or capped invocations

#### 1.3 Domain States

| State | Description |
|-------|-------------|
| **Dormant** | Not present in the scene |
| **Attuned** | Present as a narrative permission (no mechanical tag) |
| **Manifested** | Active as a Scene Tag (mechanical) |
| **Collapsed** | Forcibly ended; imposes a Complication |

#### 1.4 Manifest Domain (Scene Action)

Manifesting is a standard scene action resolved through ADR-0001/0003:

- **Default action type**: Major (per ADR-0008)
- **Actor Bonus**: Primary Pillar Attack + Skill (optional) + mods
- **Opposition**: TN = 10 + SceneTier (SceneTier is authored: 0–4)

| DoS Result | Outcome |
|------------|---------|
| DoS ≥ +1 | Create Scene Tag: Domain("Name") with FreeInvokeCount = 1 |
| DoS ≥ +3 | FreeInvokeCount = 2 |
| DoS ≤ -1 | Create Complication Tag: Domain Backlash("Name") with FreeInvokeCount = 1 for opposition |

#### 1.5 Domain Invocation

The Domain Scene Tag may be invoked (subject to ADR-0004 limits) to gain one of:
- Reroll (one d20), or
- +3 to total, or
- **Domain Potency**: add +1 VirtualRankOffense to the current technique's EffectRank for resistance TN only (Step B of ADR-0006)

**Domain Potency cap per scene**: `MaxPotencyUses = 1 + floor(DomR/2)`

#### 1.6 Domain Strain and Collapse

Each Domain maintains a per-scene **Domain Strain Clock**:
- **Default**: 6-segment danger clock
- **Tick Strain by 1** whenever you invoke Domain Potency or overclock the Domain
- **When Strain Clock fills**: Domain becomes Collapsed and immediately creates a Complication Tag on the owner (1 free invoke for opposition)

---

### 2. Clocks: Canonical Types and Tick Rules

#### 2.1 Clock Types (v1.0)

| Type | Purpose |
|------|---------|
| **Progress Clock** | Tracks completion of an obstacle or project |
| **Danger Clock** | Tracks approach of trouble (alarms, reinforcements, corruption) |

#### 2.2 Segment Standards

| Segments | Complexity |
|----------|------------|
| 4 | Complex obstacle |
| 6 | Complicated obstacle |
| 8 | Daunting obstacle |

#### 2.3 Tick Rule (Deterministic)

Whenever an action is declared to affect a clock:
- **DoS positive**: tick Progress Clock by `ticks = DoS` (1–4)
- **DoS zero**: no ticks (status quo holds)
- **DoS negative**: tick Danger Clock by `ticks = min(3, abs(DoS))`

---

### 3. Multi-Stage, Simultaneous Conflict Architecture

#### 3.1 Stage Model

A "staged fight" is defined as a conflict with:
- One **Stage Clock** (Progress Clock, typically 6 or 8 segments) representing the current stage's "break condition"
- One or more **Parallel Clocks** (Danger or Progress) representing hazards, reinforcements, Domain destabilization, etc.

All clocks advance during the same round under ADR-0008's simultaneous resolution.

#### 3.2 Stage Transition

When the Stage Clock fills:
1. Advance to the next stage (authored or procedurally selected)
2. Apply a **Stage Shift package** (see 3.3)
3. Reset or replace stage-linked clocks as authored

#### 3.3 Stage Shift Package (Locked Knobs)

Stage shifts may modify, by authored amounts (typically ±1–±2):
- OCR and/or DCR (global or pillar-specific)
- seqLVL via Over-SCL Band (+1 or +2)
- Domain state permissions (e.g., allow Manifested → Overclocked)
- Add/replace Scene Tags with free invokes (bounded by ADR-0004 limits)

---

### 4. OCR/DCR Integration for Encounter Authoring

#### 4.1 Encounter Threat Bands

| Threat Level | Description |
|--------------|-------------|
| **Even** | Enemy OCR and DCR within ±1 of party medians |
| **Pressuring** | Enemy OCR or DCR is +2 above party median (in at least one pillar) |
| **Overwhelming** | Enemy has +3+ advantage, but must have explicit Stage Clocks |

#### 4.2 Domain as Pressure Valve

Domains are the primary in-fiction tool that can temporarily close OCR/DCR gaps:
- By granting bounded Potency VirtualRanks (1.5)
- By enabling stage transitions that modify Over-SCL bands (3.3)

---

### 5. Downtime: Domain Cultivation and Long-Term Projects

#### 5.1 Downtime Structure

- **2 Downtime Activities** per character per downtime phase
- Additional activities may be purchased via explicit economy hooks

#### 5.2 Domain Cultivation as a Long-Term Project

Improving a Domain is a Long-Term Project tracked with a Progress Clock:

| Upgrade | Segments | Notes |
|---------|----------|-------|
| DomR 0→1 | 4 | — |
| DomR 1→2 | 6 | — |
| DomR 2→3 | 8 | — |
| DomR 3→4 | 8 | + required "breakthrough event" scene |

Each cultivation downtime action:
- Rolls ADR-0001 TN mode using an appropriate pillar/skill
- Ticks the project clock per 2.3 tick rules

When the clock completes, DomR increases by 1 and the character gains one new Domain Technique permission.

---

## Consequences

- Domains become a first-class rules object: character build, combat scenes, and downtime all reference the same Domain schema
- OCR/DCR remain stable "truth metrics" because Domain power is bounded by invocation limits, strain clocks, and VirtualRanks
- VN authoring gains predictable pacing controls: stage clocks, parallel clocks, and domain strain are all deterministic state machines

---

## Canonical Domain and Clock Appendix (SRD + Codebase Reference)

### Domain Object Schema

```python
@dataclass
class Domain:
    domain_id: str
    name: str
    form: str
    primary_pillar: Pillar
    secondary_pillar: Optional[Pillar] = None
    dom_r: int = 0  # 0-4
    state: DomainState = DomainState.DORMANT
    strain_clock_segments: int = 6
    strain_clock_filled: int = 0
    scene_tag_id: Optional[str] = None
    
    @property
    def scp_cost(self) -> int:
        return self.dom_r * 3
    
    @property
    def max_potency_uses(self) -> int:
        return 1 + (self.dom_r // 2)
    
    @property
    def is_collapsed(self) -> bool:
        return self.strain_clock_filled >= self.strain_clock_segments
```

### Clock Schema

```python
@dataclass
class Clock:
    clock_id: str
    name: str
    clock_type: ClockType  # PROGRESS or DANGER
    segments: int = 6  # 4, 6, or 8
    filled: int = 0
    
    @property
    def is_complete(self) -> bool:
        return self.filled >= self.segments
    
    def tick(self, amount: int) -> int:
        """Tick the clock and return overflow."""
        self.filled += amount
        overflow = max(0, self.filled - self.segments)
        self.filled = min(self.filled, self.segments)
        return overflow
```

### Stage Shift Package

```python
@dataclass
class StageShiftPackage:
    stage_index: int
    ocr_delta: Dict[Pillar, int] = field(default_factory=dict)
    dcr_delta: Dict[Pillar, int] = field(default_factory=dict)
    seq_lvl_delta: int = 0
    add_scene_tags: List[str] = field(default_factory=list)
    remove_scene_tags: List[str] = field(default_factory=list)
    replace_clocks: Dict[str, Clock] = field(default_factory=dict)
```

---

## References

- ADR-0001: Core Resolution Engine
- ADR-0004: Skill Layer and Tagging
- ADR-0005: Technique Tag Taxonomy
- ADR-0006: Effect Resolution
- ADR-0008: Turn Structure, Action Economy
- Blades in the Dark: Progress/Danger Clocks
- Fate SRD: Create Advantage, Free Invokes
