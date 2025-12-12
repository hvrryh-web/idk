# ADR-0006: Effect Resolution and Condition Ladders

**Status**: Accepted

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

Previous ADRs have locked:
- ADR-0001: Opposed-first, DoS-banded core engine (K=4)
- ADR-0002: Canonical stat spine and pillar mapping
- ADR-0003: Which pillar traits are used as check bonuses by contest type
- ADR-0004/0005: Skills and technique tags (including VirtualRanks and Ward)

The remaining core dependency for both SRD and web/VN implementation is to lock:
1. The effect resolution sequence for the five core effects (Strike, Influence Attack, Revelation Attack, Debilitate, Ward)
2. The condition ladders and their mechanical meaning
3. How Ward modifies (or blocks) incoming conditions

This ADR explicitly chooses a two-step "hit then resist" pattern that still uses the ADR-0001 engine in both steps (opposed roll, then TN mode).

---

## Decision

### 1. Canonical Two-Step Effect Resolution (All Attack Effects)

For **Strike**, **Influence Attack**, **Revelation Attack**, and **Debilitate**, resolution is:

#### Step A — Contact Contest (Opposed)

Actor attempts to land the effect.

```
Actor:      d20 + PillarAttack + KeptRankDie + mods
Opposition: d20 + MappedDefense + KeptRankDie + mods
```

Compute `DoS_contact` using ADR-0001 (K=4).

- If `DoS_contact ≤ 0`: No effect (status quo holds)
- If `DoS_contact > 0`: Proceed to Step B

#### Step B — Resistance Contest (TN Mode)

Target resists the landed effect.

```
Target:     d20 + MappedResilience + KeptRankDie + WardBonus + mods
Opposition: TN = 10 + EffectRank + PotencyVirtualRanks (static)
```

Compute `DoS_resist` against the static TN using ADR-0001 (TN mode, K=4).

Convert to failure degrees:

```
BaseFailDeg = max(0, -DoS_resist)
Amplify = max(0, DoS_contact - 1)
FailDeg = clamp(BaseFailDeg + Amplify, 0, 4)
```

Then apply the appropriate condition ladder at `FailDeg`.

---

### 2. Condition Ladders (Locked Names + Mechanical Payload)

#### A) Violence Ladder (Strike, Violence Debilitate)

| Rung | Name | Mechanical Payload |
|------|------|-------------------|
| 0 | No effect | — |
| 1 | Injured | -1 to Violence checks |
| 2 | Maimed | -2 to Violence checks |
| 3 | Mortally Wounded | -3 to Violence checks; Incapacitated without help or push |
| 4 | Ruined Body | Taken Out (death, maiming, capture, or equivalent) |

**Affected Checks**: Violence Attack, Body Defense, Athletics/Arms/Stealth where relevant

#### B) Influence Ladder (Influence Attack, Influence Debilitate)

| Rung | Name | Mechanical Payload |
|------|------|-------------------|
| 0 | No effect | — |
| 1 | Rattled | -1 to Influence checks |
| 2 | Discredited | -2 to Influence checks |
| 3 | Isolated | -3 to Influence checks; Cannot leverage allies/faction support |
| 4 | Broken (socially) | Taken Out (forced concession, reputational ruin) |

**Affected Checks**: Influence Attack, Soul Defense, Command/Deceive/Rapport/Etiquette where relevant

#### C) Revelation Ladder (Revelation Attack, Revelation Debilitate)

| Rung | Name | Mechanical Payload |
|------|------|-------------------|
| 0 | No effect | — |
| 1 | Shaken | -1 to Revelation checks |
| 2 | Haunted | -2 to Revelation checks |
| 3 | Deranged | -3 to Revelation checks; Incapacitated unless supported or pushed |
| 4 | Shattered | Taken Out (catatonia, possession window, compulsion) |

**Affected Checks**: Revelation Attack, Mind Defense, Observe/Investigate/Occult where relevant

#### D) Debilitate Ladders (Control Effects)

Debilitate always applies one of the below ladders based on its pillar, at FailDeg:

| Pillar | Rung 1 | Rung 2 | Rung 3 | Rung 4 |
|--------|--------|--------|--------|--------|
| Violence | Slowed | Bound | Downed | Ruined Body (if Escalating) |
| Influence | Muted | Censured | Exiled | Broken (socially) |
| Revelation | Doubt | Paranoia | Unraveling | Shattered |

**Note**: Debilitate severity is expressed as a Complication Tag with `Severity = FailDeg` for code + UI.

---

### 3. Ward Mitigation and Blocking (Locked Behavior)

Ward is a pillar-typed defensive effect that primarily increases Resilience (not Defense).

#### Ward Base Behavior

- Choose one pillar when purchased: **Body Ward**, **Soul Ward**, or **Mind Ward**
- While active: `WardBonus = WardRank` is added to the target's mapped Resilience for Step B resistance checks
- Band legality while active: `Defense + Resilience + WardBonus ≤ DefCap(pillar)` (per ADR-0002/0005)

#### Ward Extras (Locked Interactions)

| Extra | Effect |
|-------|--------|
| **Reactive** | May be activated as a reaction to apply WardBonus to incoming resistance check (Step B) even if not pre-sustained |
| **Aura** | Allies in range gain `floor(WardBonus/2)` to their resistance checks against that pillar (each resists separately) |
| **Hardened** | Impervious analogue: for attacks with `EffectRank ≤ WardRank`, once per scene per WardRank: if `FailDeg == 1`, treat it as `FailDeg = 0` |

#### Ward Flaws (Locked Triggers)

| Flaw | Effect |
|------|--------|
| **Fragile** | If you ever suffer `FailDeg ≥ 2` on the warded pillar in a scene, the Ward collapses until refreshed out of combat |

---

## Options Considered

1. **Single-step resolution only** (no resistance step): Faster, but collapses the Attack/Effect tradeoff logic and reduces design space for Ward

2. **Opposed resistance** (two rolled sides): Pure opposed symmetry, but increases roll count and variance

3. **Selected: Opposed contact + TN resistance** using the same ADR-0001 engine in both steps (opposed roll, then TN mode)

---

## Rationale

- The two-step structure preserves the intended "M&M-style split" between accuracy and effect severity (attack vs defense, then resist vs effect rank DC)
- A 4-rung ladder maps cleanly to the bounded DoS space and is consistent with ladder-based consequence systems
- Locking TN mode for resistance keeps VN implementation deterministic and content-authorable ("this power is rank 4; TN is 14")
- Uses the "one true engine" (same DoS computation, K=4) for both steps

---

## Consequences

### Positive

- **Unified effect resolution**: All effect writeups use the same two-step pipeline
- **Ward as first-class mitigation**: Clearly defined interaction with resistance checks
- **Deterministic VN authoring**: Effect ranks directly translate to TNs

### Negative

- **Two rolls per effect**: Slightly slower than single-step resolution
- **Must track FailDeg**: Condition severity requires tracking per-pillar

### Requirements

- All effect writeups in SRD must specify: (A) Contact contest bonuses and (B) Resistance TN formula
- All effects must reference the canonical ladders
- Ward must always be validated against DefCap while active
- Web/VN engine must implement `EffectResolver` pipeline

---

## Canonical Effect Resolution Appendix (SRD + Codebase Reference)

### Constants

```python
K = 4
TN_BASE = 10
MAX_FAIL_DEG = 4
```

### Step A — Contact (Opposed)

```python
ActorTotal = d20 + PillarAttack + KeptRankDie + mods
OppTotal = d20 + MappedDefense + KeptRankDie + mods
DoS_contact = compute_dos(ActorTotal - OppTotal, K=4)

if DoS_contact <= 0:
    return NoEffect()  # Status quo holds
```

### Step B — Resistance (TN Mode)

```python
TN = TN_BASE + EffectRank + PotencyVirtualRanks  # Default: 10 + EffectRank
ResistTotal = d20 + MappedResilience + KeptRankDie + WardBonus + mods
DoS_resist = compute_dos(ResistTotal - TN, K=4)

BaseFailDeg = max(0, -DoS_resist)
Amplify = max(0, DoS_contact - 1)
FailDeg = min(MAX_FAIL_DEG, BaseFailDeg + Amplify)
```

### Apply Ladder

```python
if effect_type == "Strike":
    apply_violence_ladder(target, FailDeg)
elif effect_type == "InfluenceAttack":
    apply_influence_ladder(target, FailDeg)
elif effect_type == "RevelationAttack":
    apply_revelation_ladder(target, FailDeg)
elif effect_type == "Debilitate":
    apply_debilitate_ladder(target, pillar, FailDeg)
    create_complication_tag(target, pillar, severity=FailDeg)
```

### Condition Ladder Schema

```python
from dataclasses import dataclass
from enum import Enum
from typing import List

class Pillar(str, Enum):
    VIOLENCE = "Violence"
    INFLUENCE = "Influence"
    REVELATION = "Revelation"

@dataclass
class ConditionRung:
    rung: int  # 0-4
    name: str
    penalty: int  # Negative modifier to relevant checks
    incapacitated: bool = False
    taken_out: bool = False

VIOLENCE_LADDER: List[ConditionRung] = [
    ConditionRung(0, "No Effect", 0),
    ConditionRung(1, "Injured", -1),
    ConditionRung(2, "Maimed", -2),
    ConditionRung(3, "Mortally Wounded", -3, incapacitated=True),
    ConditionRung(4, "Ruined Body", -4, taken_out=True),
]

INFLUENCE_LADDER: List[ConditionRung] = [
    ConditionRung(0, "No Effect", 0),
    ConditionRung(1, "Rattled", -1),
    ConditionRung(2, "Discredited", -2),
    ConditionRung(3, "Isolated", -3, incapacitated=True),
    ConditionRung(4, "Broken", -4, taken_out=True),
]

REVELATION_LADDER: List[ConditionRung] = [
    ConditionRung(0, "No Effect", 0),
    ConditionRung(1, "Shaken", -1),
    ConditionRung(2, "Haunted", -2),
    ConditionRung(3, "Deranged", -3, incapacitated=True),
    ConditionRung(4, "Shattered", -4, taken_out=True),
]

DEBILITATE_LADDERS = {
    Pillar.VIOLENCE: ["No Effect", "Slowed", "Bound", "Downed", "Ruined Body"],
    Pillar.INFLUENCE: ["No Effect", "Muted", "Censured", "Exiled", "Broken"],
    Pillar.REVELATION: ["No Effect", "Doubt", "Paranoia", "Unraveling", "Shattered"],
}
```

### Ward Application

```python
@dataclass
class WardState:
    pillar: Pillar
    rank: int
    is_active: bool = True
    has_reactive: bool = False
    has_aura: bool = False
    has_hardened: bool = False
    has_fragile: bool = False
    hardened_uses_remaining: int = 0

    def __post_init__(self):
        if self.has_hardened:
            self.hardened_uses_remaining = self.rank

    @property
    def bonus(self) -> int:
        return self.rank if self.is_active else 0

    def aura_bonus(self) -> int:
        """Bonus granted to allies in range."""
        return self.rank // 2 if self.has_aura and self.is_active else 0

    def apply_hardened(self, effect_rank: int, fail_deg: int) -> int:
        """Apply Hardened to potentially reduce FailDeg."""
        if not self.has_hardened:
            return fail_deg
        if effect_rank > self.rank:
            return fail_deg
        if fail_deg == 1 and self.hardened_uses_remaining > 0:
            self.hardened_uses_remaining -= 1
            return 0
        return fail_deg

    def check_fragile(self, fail_deg: int) -> None:
        """Collapse ward if Fragile and took significant damage."""
        if self.has_fragile and fail_deg >= 2:
            self.is_active = False
```

### Effect Resolution Pipeline

```python
@dataclass
class ContactResult:
    dos_contact: int
    actor_roll: int
    opp_roll: int
    hit: bool  # DoS_contact > 0

@dataclass
class ResistanceResult:
    dos_resist: int
    resist_roll: int
    tn: int
    base_fail_deg: int
    amplify: int
    fail_deg: int

@dataclass
class EffectResult:
    contact: ContactResult
    resistance: ResistanceResult | None
    condition_applied: ConditionRung | None
    complication_tag: str | None

def resolve_effect(
    effect_type: str,
    pillar: Pillar,
    actor_attack: int,
    actor_rank: int,
    opp_defense: int,
    opp_rank: int,
    target_resilience: int,
    target_ward_bonus: int,
    effect_rank: int,
    potency_virtual_ranks: int = 0,
) -> EffectResult:
    """
    Full two-step effect resolution per ADR-0006.
    """
    from app.core.resolution_engine import resolve_opposed, resolve_tn, compute_dos

    # Step A: Contact Contest (Opposed)
    contact = resolve_opposed(actor_attack, actor_rank, opp_defense, opp_rank)
    dos_contact = contact.final_dos

    contact_result = ContactResult(
        dos_contact=dos_contact,
        actor_roll=contact.actor_result.d20,
        opp_roll=contact.opp_result.d20,
        hit=dos_contact > 0
    )

    if not contact_result.hit:
        return EffectResult(
            contact=contact_result,
            resistance=None,
            condition_applied=None,
            complication_tag=None
        )

    # Step B: Resistance Contest (TN Mode)
    tn = TN_BASE + effect_rank + potency_virtual_ranks
    resist_bonus = target_resilience + target_ward_bonus
    resist = resolve_tn(resist_bonus, opp_rank, tn)
    dos_resist = resist.final_dos

    base_fail_deg = max(0, -dos_resist)
    amplify = max(0, dos_contact - 1)
    fail_deg = min(MAX_FAIL_DEG, base_fail_deg + amplify)

    resistance_result = ResistanceResult(
        dos_resist=dos_resist,
        resist_roll=resist.actor_result.d20,
        tn=tn,
        base_fail_deg=base_fail_deg,
        amplify=amplify,
        fail_deg=fail_deg
    )

    # Apply ladder
    condition = get_condition_from_ladder(effect_type, pillar, fail_deg)
    complication = None
    if effect_type == "Debilitate" and fail_deg > 0:
        complication = f"{pillar.value}_debilitate_{fail_deg}"

    return EffectResult(
        contact=contact_result,
        resistance=resistance_result,
        condition_applied=condition,
        complication_tag=complication
    )
```

---

## References

- ADR-0001: Core Resolution Engine (Opposed d20 + Rank Dice, ±4 DoS)
- ADR-0002: Canonical Stat Model and Pillar→Defense Mapping
- ADR-0003: Bonus Composition and Contest Roles
- ADR-0005: Technique Tag Taxonomy and Validation Rules
- Mutants & Masterminds: Effect Rank vs Toughness DC pattern
- Blades in the Dark: Harm ladders and incapacitation thresholds
- Fate SRD: Complications as states
