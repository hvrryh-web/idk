# ADR-0008: Turn Structure, Action Economy, and Scene Procedures

**Status**: Accepted — Locked

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

The system requires a single, deterministic turn model that:
- Stays consistent with ADR-0001's opposed DoS engine
- Scales cleanly by tier (SCL)
- Supports anime/xianxia tempo (initiative and action advantage as a visible axis)
- Is implementation-ready for web application and visual-novel branching

Sequence Level (seqLVL) is the temporal/initiative-axis of the game: it governs initiative priority and action-economy breadth as a "combat tempo rating," distinct from (but derived from) SCL.

---

## Decision

### 1. Definitions and Derived Ratings

#### 1.1 Base Sequence Level

```
seqLVL_base = 3 × max(1, SCL − 1)
```

This anchors starting "heroic" play (SCL 2) at Base3, then expands tempo at higher SCL.

#### 1.2 Speed Bands

A character's effective sequence level is:

```
seqLVL = seqLVL_base + (3 × SpeedBand) + (3 × Over-SCL Band)
```

| Speed Band | Modifier |
|------------|----------|
| Normal | 0 |
| +fast | +1 |
| +very fast | +2 |

**Over-SCL Band** (locked): optional +1 or +2 "bands above the SCL base" for exceptional NPCs, boss phases, Domain states, or scripted VN beats.

> Note: Each "band" is +3 seqLVL, because the action ladder advances on multiples of 3.

---

### 2. Action Economy Ladder (Base-X)

#### 2.1 Baseline Grant

At seqLVL = 3 (Base3), each round grants:
- 1 Major Action
- 1 Minor Action
- 1 Bonus Action
- 1 Reaction (standard)

#### 2.2 Expansion Rule

For each additional +3 seqLVL above 3, add one action in a repeating cycle:
1. +1 Bonus Action
2. +1 Minor Action
3. +1 Major Action
4. Repeat...

#### 2.3 Quick Table

| seqLVL band | Name | Major | Minor | Bonus |
|-------------|------|-------|-------|-------|
| 3 | Base3 | 1 | 1 | 1 |
| 6 | Base6 | 1 | 1 | 2 |
| 9 | Base9 | 1 | 2 | 2 |
| 12 | Base12 | 2 | 2 | 2 |
| 15 | Base15 | 2 | 2 | 3 |

#### 2.4 Action Type Semantics

| Action Type | Purpose | Examples |
|-------------|---------|----------|
| **Major** | Primary stakes-moving actions | Strike/Influence/Revelation attacks, major Techniques, Domain pushes |
| **Minor** | Positioning, setup, assists | Light Techniques, guard shifts, scene-tag creation |
| **Bonus** | Micro-tempo, follow-ups | Feints, "free-flow" actions; lower DoS payload unless enabled by tags |
| **Reaction** | Interrupts, counters, blocks | See Section 3 |

---

### 3. Reactions, +fast, +very fast (Locked Behaviors)

#### 3.1 Standard Reaction

- Each actor has 1 Reaction per round by default
- A Reaction may be spent in a Reaction Window to execute an eligible Reaction technique

#### 3.2 Improved Reactions (gated)

**+fast**: Unlocks Improved Reactions (eligibility flag)
- May use Reaction-type techniques tagged `Improved Reaction`
- Does not automatically add extra Reactions unless a Technique explicitly grants them

**+very fast**: Unlocks Improved Reactions and also grants:
- Prepare access (see 3.3)
- +1 Nuance Chance per round, valued as one Minor-equivalent spend

#### 3.3 Prepare

**Prepare** is a special action option that:
- May be taken as a Minor (always), and as a Bonus only if a Technique permits
- Creates a **Prepared** state that can be consumed to:
  - Convert a later Bonus into a Minor, or
  - Add a +1 virtual rank to a tagged Technique, or
  - Open a Reaction Window for a specific counter line

Prepared states expire at end of round unless specified otherwise.

#### 3.4 Nuance Chance

Nuance is a per-round micro-resource representing "fine timing / cinematic edge / VN branch leverage."

**+very fast** grants 1 Nuance per round that may be spent as one of:
- An extra Minor action (cannot be upgraded into Major)
- A "nuance rider" on an action: add/remove a scene tag if Technique's tag rules permit
- A small DoS manipulation: +1 DoS after the roll, once per round (cannot exceed maximum)

---

### 4. OCR/DCR (Encounter Math and Point-Buy Readouts)

#### 4.1 Definitions

Per pillar P ∈ {Violence, Influence, Revelation}:

```
OCR_P = Attack_P + EffectRank_P (incl. allowed VirtualRanks)
DCR_P = Defense_P + Resilience_P (incl. Ward mitigation where applicable)
```

Global readouts:
```
OCR = max(OCR_V, OCR_I, OCR_R)
DCR = max(DCR_V, DCR_I, DCR_R)
```

#### 4.2 Relationship to Caps

OCR and DCR must respect the pillar bands locked earlier (OffCap/DefCap per pillar).

The build system validates:
- `OCR_P ≤ OffCap_P`
- `DCR_P ≤ DefCap_P`

#### 4.3 Why OCR/DCR exist

- **Encounter building**: Quick matchup checks and phase tuning
- **Web app logic**: Single scalar for UI summaries and automated warnings
- **Action economy balancing**: OCR/DCR deltas remain the primary "power truth"

---

### 5. Turn Structure: Multi-Stage, Simultaneous Resolution

Each round is resolved in stages. Within a stage, actions are declared, then resolved simultaneously.

#### 5.1 Round Stages

| Stage | Name | Purpose |
|-------|------|---------|
| 0 | Upkeep | Refresh resources, tick conditions and scene tags |
| 1 | Intent | Declare intended Major/Minor/Bonus spends |
| 2 | Clash | Resolve all declared actions simultaneously |
| 3 | Reaction Windows | Triggered when targeted, entering threatened space, etc. |
| 4 | Aftermath | Apply end-of-round effects, overflow rules, recovery |

#### 5.2 Initiative Ordering

Initiative sets priority for Reaction resolution and tie-breaks, not for "who goes first."

```
Init = d20 + seqLVL_band + relevant Skill/Tag modifiers
seqLVL_band = floor(seqLVL / 3)
```

Higher initiative wins ties in Reaction Windows and interrupt contests.

---

### 6. Scene Procedures: Beats, Recovery, Domains, Clocks

#### 6.1 Beats

A **Beat** is the VN-native unit of pacing (a camera cut / dialogue exchange / tactical micro-objective).

- Typical Beat budget: 1–3 checks total
- After each Beat, advance at least one pacing element: a Clock, a Domain pressure state, or a Scene Tag stack

#### 6.2 Recovery

| Type | When | Effect |
|------|------|--------|
| Micro-recovery | Aftermath Stage | If no Major action spent that round |
| Beat recovery | End of Beat | On meaningful objective or withdrawal |
| Scene recovery | End of scene | Resets per-scene effects, may reduce conditions |

#### 6.3 Domains and Clocks

**Domains** are cultivated power sources with two operational roles:
- **Permissioning**: Unlock Techniques/tags/scene interactions
- **Pacing pressure**: Create/consume scene tags and drive clock advancement

**Clock advancement rule** (default):
- +1 segment per 1 DoS applied to the clock's relevant action
- Capped at +3 per Beat unless a Technique explicitly breaks this cap

---

## Consequences

- The action economy is deterministic and tier-scalable
- Simultaneous staged rounds support VN presentation
- OCR/DCR become the balancing spine for automation
- Domains are structurally integrated into pacing

---

## Canonical Turn Structure Appendix (SRD + Codebase Reference)

### SeqLVL Calculation

```python
def calculate_seq_lvl_base(scl: int) -> int:
    """Calculate base sequence level from SCL."""
    return 3 * max(1, scl - 1)

def calculate_seq_lvl(scl: int, speed_band: int = 0, over_scl_band: int = 0) -> int:
    """Calculate effective sequence level."""
    base = calculate_seq_lvl_base(scl)
    return base + (3 * speed_band) + (3 * over_scl_band)
```

### Action Budget

```python
def calculate_action_budget(seq_lvl: int) -> dict:
    """Calculate action budget from seqLVL."""
    bands_above_base = max(0, (seq_lvl - 3) // 3)
    
    major = 1
    minor = 1
    bonus = 1
    
    for i in range(bands_above_base):
        cycle_pos = i % 3
        if cycle_pos == 0:
            bonus += 1
        elif cycle_pos == 1:
            minor += 1
        else:
            major += 1
    
    return {
        "major": major,
        "minor": minor,
        "bonus": bonus,
        "reaction": 1  # Always 1 by default
    }
```

### Speed Band Enum

```python
class SpeedBand(int, Enum):
    NORMAL = 0
    FAST = 1
    VERY_FAST = 2
```

---

## References

- ADR-0001: Core Resolution Engine
- ADR-0002: Canonical Stat Model
- ADR-0003: Bonus Composition and Contest Roles
