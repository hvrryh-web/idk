# ADR-0001: Core Resolution Engine (Opposed d20 + Rank Dice, ±4 DoS)

**Status**: Accepted

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

We need a single, canonical resolution engine that:

1. Defaults to opposed clashes (both sides roll)
2. Supports both combat and non-combat scenarios
3. Produces degrees of success in ±4 bands
4. Supports XdY rank dice keyed off Martial Rank and Sorcery Rank

Without this unified engine, the SRD risks fragmenting into multiple incompatible subsystems with different roll procedures, DoS ladders, and tie rules.

---

## Decision

We adopt the following as the **one true engine** for all resolution in WUXUXIANXIA:

### 1. Opposed Totals

Every check is a comparison of two totals:
- **Actor Total** vs **Opposition Total**

By default, both sides roll (opposed). A "target number" (TN) is a special case where the opposition does not roll and instead uses a Static Opposition Total (TN mode).

### 2. Total Computation

Each side's total is computed as:

```
Total = d20 + Bonus + KeptRankDie
```

Where:
- **d20**: Standard twenty-sided die roll
- **Bonus**: All numeric modifiers (see ADR-0003 for composition)
- **KeptRankDie**: Highest result from the rank dice pool

### 3. Rank Dice Mapping

Rank dice are keyed by Approach (Martial or Sorcerous):

```
X = 1 + floor(Rank / 2)
Y = min(12, 4 + 2 * Rank)
```

Roll X dice of size Y, keep highest as **KeptRankDie**.

| Rank | X (dice count) | Y (die size) | Pool |
|------|----------------|--------------|------|
| 0 | 1 | 4 | 1d4 |
| 1 | 1 | 6 | 1d6 |
| 2 | 2 | 8 | 2d8 |
| 3 | 2 | 10 | 2d10 |
| 4 | 3 | 12 | 3d12 |
| 5 | 3 | 12 | 3d12 |

### 4. Degrees of Success (DoS)

DoS is computed from the margin between totals using K=4 (locked constant):

```
margin = ActorTotal - OppTotal

If margin == 0: DoS = 0
If margin > 0:  DoS = min(4, 1 + floor((margin - 1) / K))
If margin < 0:  DoS = -min(4, 1 + floor((abs(margin) - 1) / K))
```

**Band Table (K=4)**:

| Margin | DoS |
|--------|-----|
| 0 | 0 |
| +1 to +4 | +1 |
| +5 to +8 | +2 |
| +9 to +12 | +3 |
| +13+ | +4 (capped) |
| -1 to -4 | -1 |
| -5 to -8 | -2 |
| -9 to -12 | -3 |
| -13- | -4 (capped) |

### 5. Tie Rule

**Defender wins ties** (status quo holds).

When DoS = 0, the game state does not change. The opposition successfully resists the action.

### 6. Natural 20 / Natural 1 DoS Shift (Optional but Canonical)

After computing base DoS, apply natural die shifts:

```
NatShift(d20) = +1 if d20 == 20, -1 if d20 == 1, else 0

FinalDoS = clamp(DoS + NatShift(d20_actor) - NatShift(d20_opp), -4, +4)
```

This is applied symmetrically: actor's nat 20 improves their DoS by 1, opponent's nat 20 worsens it by 1.

### 7. Win/Lose Interpretation

- **DoS > 0**: Actor wins; apply success effects at DoS magnitude
- **DoS < 0**: Actor loses; apply failure/backlash at |DoS| magnitude  
- **DoS = 0**: Tie → defender wins (status quo holds) unless a specific rule triggers on ties

---

## Consequences

### Positive

- **Single source of truth**: All SRD chapters reference this engine
- **Consistency**: Combat, social, and investigation use identical resolution
- **Predictable math**: K=4 produces intuitive 4-point increments
- **Rank dice scale smoothly**: From 1d4 at Rank 0 to 3d12 at Rank 5

### Negative

- **No separate DC systems**: TN mode must be used for static challenges
- **Requires Rank tracking**: All characters need Martial Rank and Sorcery Rank
- **Nat shift adds complexity**: Optional rule, but canonical for full implementation

### Constraints

- All SRD chapters must reference this engine and must not introduce alternate core roll procedures
- Stat blocks must expose Bonus and Rank Dice inputs consistently
- Scenes must specify either opposing actor (rolled opposition) or static opposition profile (TN mode)
- Future changes must be via superseding ADR

---

## Canonical Math Appendix (SRD + Codebase Reference)

### Constants

```python
K = 4                        # DoS band width (locked)
DOS_MIN = -4                 # Minimum DoS
DOS_MAX = +4                 # Maximum DoS
```

### Inputs and Terms

| Term | Definition |
|------|------------|
| **Bonus** | All numeric modifiers (Attack, Defense, Resilience, etc.) |
| **Approach** | ∈ {Martial, Sorcerous} |
| **Rank** | Martial Rank if Martial approach, else Sorcery Rank |
| **RankDice(Rank)** | Returns pool XdY (see mapping above) |
| **KeptRankDie** | Max result of RankDice pool (or 0 if X=0) |

### Total Formulas

**Rolled Opposition**:
```
ActorTotal = d20_actor + Bonus_actor + KeptRankDie_actor
OppTotal   = d20_opp   + Bonus_opp   + KeptRankDie_opp
```

**Static Opposition (TN mode)**:
```
OppTotal = TN  # Fixed integer; no opponent d20 or rank dice
```

### DoS Computation

```python
def compute_dos(margin: int, k: int = 4) -> int:
    if margin == 0:
        return 0
    elif margin > 0:
        return min(4, 1 + (margin - 1) // k)
    else:
        return -min(4, 1 + (abs(margin) - 1) // k)
```

### Natural Shift

```python
def nat_shift(d20_roll: int) -> int:
    if d20_roll == 20:
        return +1
    elif d20_roll == 1:
        return -1
    return 0

def apply_nat_shift(base_dos: int, actor_d20: int, opp_d20: int) -> int:
    shift = nat_shift(actor_d20) - nat_shift(opp_d20)
    return max(-4, min(4, base_dos + shift))
```

---

## Implementation Notes

### Code Location

- `backend/app/core/resolution_engine.py` - Pure functions for resolution
- `backend/tests/test_resolution_engine.py` - Unit tests

### Integration with ADR-0002

- `MartialRank = CL` (from ADR-0002)
- `SorceryRank = SL` (from ADR-0002)

### Integration with ADR-0003

- Bonus composition follows ADR-0003 rules
- Contest roles (Actor vs Opposition) defined by ADR-0003

---

## References

- ADR-0002: Canonical Stat Model and Pillar→Defense Mapping
- ADR-0003: Bonus Composition and Contest Roles
- SRD_UNIFIED.md: Appendix C (Canonical Math Appendix)
