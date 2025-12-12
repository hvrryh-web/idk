# ADR-0011: Sequence Level Scheduler and Multi-Stage Round Resolution

**Status**: Accepted

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

This ADR locks the combat-time scheduler that the web application and SRD can treat as the authoritative state machine. It formalizes how **Sequence Level (SeqLVL)** drives **initiative advantage** and **action economy scaling** without introducing a second resolution engine.

> "Sequence Level (seqLVL) is related to initiative & the action advantages gauge axis / xianxia level action economy tied to sequence level running off of a Base-X system with Base3 giving 1 Major Action, 1 Minor Action, 1 Bonus Action, going up in bands of Base3 Base6 Base9 each giving +1 Bonus Action, +1 Minor Action, +1 Major Action in that order."

This scheduler must remain compatible with:
- Pillar caps and banding model (Attack + Effect bounded by SCL)
- "Power Draws Blood" profiles as build-time constraints

---

## Decision

### D1. SeqLVL Definition (Mechanical)

- **SeqLVL (base)** is a character scalar used for initiative, reaction access, and action budget scaling
- **Default**: `SeqLVL_base = SCL` (unless a creature/feature explicitly overrides it)
- **SeqLVL_effective = SeqLVL_base + SeqOffset**, where:
  - **SeqOffset** comes from speed traits and scene effects (+fast, +very fast, slows, stuns)

### D2. Action Budget Ladder (BaseX / XL bands)

Define **BaseX = 3 × SeqLVL_effective**.

The character's **Action Budget** is derived from BaseX in repeating +3 bands, granting actions in the locked order **Bonus → Minor → Major**:

| BaseX | Name | Major | Minor | Bonus |
|-------|------|-------|-------|-------|
| 3 | Base3 | 1 | 1 | 1 |
| 6 | Base6 | 1 | 1 | 2 |
| 9 | Base9 | 1 | 2 | 2 |
| 12 | Base12 | 2 | 2 | 2 |
| 15 | Base15 | 2 | 2 | 3 |
| 18 | Base18 | 2 | 3 | 3 |
| 21 | Base21 | 3 | 3 | 3 |

Continue cycling every +3 BaseX thereafter.

This ladder is purely an **action count** model; it does not alter caps.

### D3. Initiative and Ordering

At **scene start**, each combatant rolls **Initiative Check** using ADR-0001 opposed engine:

```
d20 + SeqLVL_effective + InitiativeSkill
```

Initiative produces an **ordered list** used only for:
- Tie-breaking simultaneous triggers
- Ordering declarations when needed
- Ordering reaction windows (not for rewriting the stage model)

### D4. Multi-Stage, Simultaneous Round (Authoritative State Machine)

Each Round executes these stages in order:

#### Stage 0: Start-of-Round
- Refresh per-round flags
- Apply ongoing conditions
- Decrement timed effects
- Pay/clear upkeep
- Finalize "Prepared" states

#### Stage 1: Bonus Stage (Simultaneous)
- All actors may spend **Bonus actions** (up to their budget) on Bonus-tag techniques
- Resolution is simultaneous: collect declarations, then resolve outcomes
- Apply condition changes at end of stage

#### Stage 2: Minor Stage (Simultaneous)
- All actors may spend **Minor actions** (up to budget) on Minor-tag techniques
- Same simultaneous resolution rule

#### Stage 3: Major Stage (Simultaneous)
- All actors may spend **Major actions** (up to budget) on Major-tag techniques
- Same simultaneous resolution rule

#### Stage 4: End-of-Round
- Evaluate defeats/take-outs
- Apply overflow effects
- Process clock ticks triggered by the round
- Handle recovery windows
- Advance the Round counter

### D5. Reactions, +fast, +very fast

**Reaction Tier** is separate from action budget counts.

| Tier | Access |
|------|--------|
| **Baseline** | Basic Reactions (opportunity responses explicitly granted by techniques) |
| **+fast** | Improved Reactions access (expanded trigger list + can contest/mitigate within defined window) |
| **+very fast** | Improved Reactions + Prepare access + 1 Nuance Chance per round (Minor-equivalent) |

**Reaction resolution rule**:
When triggers occur inside a stage, queue them; resolve in:
1. Descending SeqLVL_effective
2. Then by Initiative order
3. Then by deterministic tie-break (stable ID) for code safety

### D6. Determinism Requirement (for VN Implementation)

Within each stage:
1. Lock declarations
2. Compute rolls
3. Resolve reactions
4. Apply results
5. Commit state

**Condition application timing** is **end-of-stage** (not mid-resolution), except where a Reaction explicitly cancels/redirects.

---

## Consequences

- The SRD gets a single, code-friendly combat loop that naturally supports "anime tempo" escalation via SeqLVL
- Designers can tune speed fantasies via **SeqOffset** rather than rewriting initiative or inventing extra action types
- Balance stays anchored to SCL banding/caps (action volume increases agency, but not raw cap-busting)
- Implementation complexity moves into a predictable event queue (stages + reaction windows), favorable for VN presentation layer

---

## Canonical Scheduler Appendix (SRD + Codebase Reference)

### SeqLVL Calculation

```python
def calculate_seq_lvl_base(scl: int) -> int:
    """SeqLVL_base = SCL by default."""
    return scl

def calculate_seq_lvl_effective(scl: int, seq_offset: int = 0) -> int:
    """Calculate effective SeqLVL with offset."""
    return calculate_seq_lvl_base(scl) + seq_offset
```

### Action Budget Calculation

```python
def calculate_action_budget(seq_lvl_effective: int) -> ActionBudget:
    """Calculate action budget from effective SeqLVL."""
    base_x = 3 * seq_lvl_effective
    bands_above_base = max(0, (base_x - 3) // 3)
    
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
    
    return ActionBudget(major=major, minor=minor, bonus=bonus, reaction=1)
```

### Round State Machine

```python
class RoundStage(int, Enum):
    START_OF_ROUND = 0
    BONUS_STAGE = 1
    MINOR_STAGE = 2
    MAJOR_STAGE = 3
    END_OF_ROUND = 4

@dataclass
class RoundState:
    round_number: int = 1
    current_stage: RoundStage = RoundStage.START_OF_ROUND
    declarations: Dict[str, List[Declaration]] = field(default_factory=dict)
    pending_reactions: List[Reaction] = field(default_factory=list)
    
    def advance_stage(self) -> RoundStage:
        """Advance to next stage, cycling to next round if needed."""
        if self.current_stage == RoundStage.END_OF_ROUND:
            self.round_number += 1
            self.current_stage = RoundStage.START_OF_ROUND
        else:
            self.current_stage = RoundStage(self.current_stage.value + 1)
        return self.current_stage
```

---

## References

- ADR-0001: Core Resolution Engine
- ADR-0003: Bonus Composition and Contest Roles
- ADR-0008: Turn Structure, Action Economy
