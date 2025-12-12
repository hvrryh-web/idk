# ADR-0010: Adversary Construction, Encounter Budgets, and Simultaneous Multi-Stage Conflict Sheets

**Status**: Accepted — Locked

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

With the core engine, stat spine, caps, action economy (seqLVL), Domains, clocks, and staged conflict architecture locked, the SRD and the web/VN implementation now require a deterministic method to:

1. Build NPCs and hazards quickly while preserving balance integrity (caps, OCR/DCR, seqLVL)
2. Author encounters as multi-stage, simultaneous-resolution conflicts driven by clocks and stage packages
3. Provide a scalable "Opposition" pipeline where not every NPC needs full PC-style point-buy detail

---

## Decision

### 1. Canonical Adversary Tiers

All opposition is authored as one of five **Adversary Types**:

| Type | Description |
|------|-------------|
| **Minion** | Disposable; single pillar focus; simplified defense; no Domains |
| **Rival** | Full pillar profile (1–2 pillars emphasized); limited technique set; optional Domain |
| **Elite** | Enhanced Rival; has a stage package or parallel clock; may have +fast |
| **Boss** | Multi-stage; has Stage Clock + parallel clocks; may have +very fast; may use Over-SCL bands |
| **Hazard** | Environmental/systemic opposition; primarily clocks + static TNs |

---

### 2. Canonical NPC Stat Block Schema

Every NPC has a single JSON-like canonical schema:

```python
@dataclass
class NPCStatBlock:
    # Identity
    npc_id: str
    name: str
    adversary_type: AdversaryType
    
    # Tiering
    scl_target: int
    speed_band: SpeedBand = SpeedBand.NORMAL
    over_scl_band: int = 0  # Boss/Elite only
    
    # Computed
    @property
    def seq_lvl_base(self) -> int:
        return 3 * max(1, self.scl_target - 1)
    
    @property
    def seq_lvl(self) -> int:
        return self.seq_lvl_base + (3 * self.speed_band.value) + (3 * self.over_scl_band)
    
    # Pillars (per pillar)
    pillar_stats: Dict[Pillar, PillarStats]
    
    # Techniques
    techniques: List[str] = field(default_factory=list)
    
    # Domain (optional)
    domain: Optional[Domain] = None
    
    # Clocks
    stage_clock: Optional[Clock] = None  # Boss mandatory
    parallel_clocks: List[Clock] = field(default_factory=list)
    danger_clocks: List[Clock] = field(default_factory=list)

@dataclass
class PillarStats:
    attack: int = 0
    defense: int = 0
    resilience: int = 0
    max_effect_rank: int = 0
    virtual_ranks: int = 0
    ward_active_bonus: int = 0
    
    @property
    def ocr(self) -> int:
        return self.attack + self.max_effect_rank + self.virtual_ranks
    
    @property
    def dcr(self) -> int:
        return self.defense + self.resilience + self.ward_active_bonus
```

---

### 3. OCR/DCR-Based Opposition Building

NPCs are not required to be purchased with SCP. Instead, they are authored to match OCR/DCR bands relative to the party's SCL and the desired threat posture.

#### 3.1 Party Baselines (per encounter)

```python
PartyOCR_med = median of PCs' max(OCR_V, OCR_I, OCR_R)
PartyDCR_med = median of PCs' max(DCR_V, DCR_I, DCR_R)
PartySeqBand_med = median of PCs' seqLVL/3
```

#### 3.2 Threat Bands

| Posture | OCR | DCR |
|---------|-----|-----|
| **Even** | PartyDCR_med ±1 | PartyOCR_med ±1 |
| **Pressuring** | PartyDCR_med +2 | PartyOCR_med +2 (in at least one pillar) |
| **Overwhelming** | +3 or higher | Requires Stage Clock + Parallel Progress Clock |

#### 3.3 Pillar Focus Rules

| Type | Primary | Secondary | Other |
|------|---------|-----------|-------|
| **Minion** | 1 pillar | — | -2 relative band |
| **Rival** | 1 pillar | 1 pillar (-1 band) | — |
| **Elite/Boss** | 2 pillars | — | Must have vulnerability in 3rd pillar |

---

### 4. Adversary Tier Templates

#### 4.1 Minion (Single-Actor or Squad)

| Attribute | Value |
|-----------|-------|
| seqLVL | Party median band (no OverSCLBand) |
| OCR_primary | PartyDCR_med ±0 |
| DCR_primary | PartyOCR_med −2 |
| Techniques | 1–2, no Domains |

**Squad variant** (3–6 minions as one "unit actor"):
- OCR_primary = PartyDCR_med +1
- DCR_primary = PartyOCR_med −1
- 4-segment Unit Cohesion Clock; ticks by FailDeg; when full, unit breaks

#### 4.2 Rival

| Attribute | Value |
|-----------|-------|
| seqLVL | Party median band; SpeedBand optionally +fast |
| OCR_primary | PartyDCR_med +1 |
| DCR_primary | PartyOCR_med ±0 |
| Techniques | 3–5; Domain optional (DomR 1–2) |

#### 4.3 Elite

| Attribute | Value |
|-----------|-------|
| seqLVL | Party median band + SpeedBand (+fast typical) |
| OCR_primary | PartyDCR_med +2 |
| DCR_primary | PartyOCR_med +1 |
| Required | 6-segment Elite Advantage or Weakness Clock |

#### 4.4 Boss (Multi-Stage Mandatory)

| Attribute | Value |
|-----------|-------|
| seqLVL | Party median band + SpeedBand (+very fast) + OverSCLBand |
| Stage 1 OCR | PartyDCR_med +2 |
| Stage 1 DCR | PartyOCR_med +2 |
| Stage 2+ | May go to +3 in one axis only with compensating clock |

#### 4.5 Hazard

- Uses TN mode and clocks
- Has `TN_profile` and `Clocks[]`
- Can define a "virtual actor" for opposed contests (rare)

---

### 5. Simultaneous Multi-Stage Conflict Sheet

An **Encounter** is a structured state machine with one or more concurrent fronts.

#### 5.1 Encounter Sheet Fields

```python
@dataclass
class EncounterSheet:
    encounter_id: str
    scene_tier: int  # 0-4
    actors: List[str]  # PC and NPC IDs
    fronts: List[Front]
    stage_index: int = 0
    stage_clock: Optional[Clock] = None  # 6 or 8 segments
    parallel_clocks: List[Clock] = field(default_factory=list)
    stage_packages: List[StageShiftPackage] = field(default_factory=list)

@dataclass
class Front:
    front_id: str
    name: str
    stakes: str
    clocks: List[Clock]
```

#### 5.2 Clock Segment Standards

| Segments | Complexity |
|----------|------------|
| 4 | Complex obstacle |
| 6 | Complicated obstacle |
| 8 | Daunting obstacle |

#### 5.3 Stage Package Constraints

When StageClock completes, apply the stage package:

**Compensating Rule** (hard):
If a stage package increases any pillar OCR or DCR by +3 or more relative to party medians, it must also add a **Weakness Progress Clock** (6 segments) that, when completed, removes at least 2 points of that advantage.

---

### 6. Simultaneous Resolution Procedure

#### 6.1 Declaration

All actors declare:
- Which front they are acting on
- Which action they spend (Major/Minor/Bonus/Nuance/Reaction)
- Target(s) and technique

#### 6.2 Pairing Rule

If two actions directly oppose each other:
1. Contact contests resolve first (ADR-0006 Step A), simultaneously across all pairs
2. Resistance contests resolve next (ADR-0006 Step B), using TN mode per target
3. Conditions and clock ticks are applied in the Aftermath stage

#### 6.3 Reaction Windows

Reaction windows may open:
- At targeting
- On movement threshold triggers
- On Domain triggers
- On clock threshold triggers

---

### 7. GM/VN Authoring Guidance

Every encounter must declare:
- Primary fronts (e.g., "Duel," "Ritual," "Mob Pressure")
- Each front's clocks and what ticks them
- Stage transition conditions
- Which advantage is intended to be attacked (OCR/DCR, seqLVL, Domain strain, clocks)

---

## Consequences

- The SRD must include an "Opposition" chapter with tier templates, NPC schema, and encounter sheets
- The web/VN toolchain can generate and validate encounters by comparing party medians to adversary OCR/DCR/seqLVL
- Boss fights become authored state machines with stage transitions and compensating weakness clocks

---

## References

- ADR-0001: Core Resolution Engine
- ADR-0006: Effect Resolution and Condition Ladders
- ADR-0008: Turn Structure, Action Economy
- ADR-0009: Domains, Clocks, Multi-Stage Conflict
- Fate SRD: Opposition building
- Blades in the Dark: Progress/Danger Clocks
