# ADR-0003: Bonus Composition and Contest Roles

**Status**: Accepted

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

ADR-0001 locked an opposed-first core engine (ActorTotal vs OppTotal, DoS in ±4 bands) and ADR-0002 locked the canonical stat spine and pillar→defense/resilience mapping.

We now need one deterministic rule for:
1. Who is Actor vs Opposition in common scenes
2. Which pillar trait (Attack, Defense, Resilience) composes Bonus_actor and Bonus_opp for each check type

This ensures SRD text cannot drift and the web/VN codebase can implement checks without per-scene ambiguity.

This ADR also formalizes the "tie means no state change" principle for contested checks (status quo holds), aligning with widely used contested-check conventions.

---

## Decision

### 1. Contest Roles: Actor, Opposition, and Status Quo

**Actor** = the side currently taking an action (including reactions)

**Opposition** = the side resisting that action, or a static obstacle in TN mode

**Status quo rule (ties)**: If the final computed DoS is 0, the game state does not change relative to the state immediately before the check. This is equivalent to "status quo holds" in contested checks.

**Implementation requirement**: Every check must declare:
- `StateKey`: What would change
- `StateBefore`: Current state value

On DoS=0, set `StateAfter = StateBefore`.

This generalizes "defender wins ties" into a machine-checkable rule that handles cases like "apply grapple" vs "escape grapple" without special-casing.

### 2. Bonus Composition (Universal Formula)

For both sides in ADR-0001 totals:

```
Bonus = PillarTrait + SkillBonus + EdgeBonus + SituationalMods
```

Where:
- **PillarTrait**: Exactly one of Attack, Defense, or Resilience (selected by check type below)
- **SkillBonus**: Optional; only included if a rule/technique/scene calls for a specific skill domain (see ADR-0004)
- **EdgeBonus**: Persistent perks (advantages, techniques, gear tags)
- **SituationalMods**: Temporary modifiers (cover, leverage, conditions, scene tags)

### 3. Which Trait Is Used by Check Type (Canonical Mapping)

**Pillar** means Violence / Influence / Revelation, and the corresponding Defense/Resilience is fixed by ADR-0002:

| Pillar | Defense | Resilience |
|--------|---------|------------|
| Violence | Body Defense | Body Resilience |
| Influence | Soul Defense | Soul Resilience |
| Revelation | Mind Defense | Mind Resilience |

**Check Type Table**:

| Check Type | Actor Uses | Opposition Uses | Notes (StateKey) |
|------------|------------|-----------------|------------------|
| **Attack** (pillar action) | Attack (that pillar) | Defense (mapped) | StateKey: "target condition/harm/shift" |
| **Counter** (negate/ward/parry) | Defense (mapped) | Attack (incoming pillar) | StateKey: "attack proceeds?" |
| **Counter** (resist/withstand) | Resilience (mapped) | Attack (source pillar) or Potency (static) | StateKey: "effect applies?" |
| **Endurance** (recovery/purge/stabilize) | Resilience (mapped) | Potency (static) or Attack (ongoing source) | StateKey: "condition reduces?" |
| **Social contest** (influence attempt) | Influence Attack | Soul Defense | Default for persuade/deceive/charm/pressure |
| **Social duel** (both pushing agendas) | Influence Attack | Influence Attack | Both sides actively trying to sway |
| **Investigation** (revelation vs mind/illusion) | Revelation Attack | Mind Defense | Default for reading intent, piercing illusions |
| **Search vs concealment** (active hiding) | Revelation Attack | Revelation Attack | Opposition actively "hiding" truth |
| **Obstacle task** (no opposing actor) | Appropriate pillar trait | TN (static) | Use TN mode; opposition does not roll |

### 4. Approach → Rank Dice (for ADR-0001 kept die)

**Default**:
- Violence checks use `MartialRank = CL`
- Influence/Revelation checks use `SorceryRank = SL`

**Override**: A technique may override this by tagging the check as Martial or Sorcerous explicitly (e.g., "Sorcerous Violence" or "Martial Influence").

### 5. Static Opposition (TN Mode) Is First-Class

When there is no opposing actor, opposition is a fixed integer total:

```
OppTotal = TN  # No d20, no rank dice
```

This is fully compatible with ADR-0001 and avoids inventing parallel "DC math."

---

## Options Considered

1. **Always Attack vs Defense**: Simple, but collapses endurance/recovery into the same axis and blurs "withstanding" vs "avoiding"

2. **Saving-throw style (Resilience vs fixed DC)**: Fast, but breaks the opposed-first premise unless TN mode is explicitly canonical

3. **Selected: Role-based trait selection** (Attack/Defense/Resilience) with status-quo ties and TN mode: Deterministic and covers all common scenes

---

## Rationale

- Formalizing "ties preserve the prior state" is a proven contested-check convention and prevents edge-case disputes; it also makes code implementation explicit (`StateBefore → StateAfter`)

- Separating Defense (avoid/negate) from Resilience (endure/withstand/recover) supports cleaner tuning knobs for bosses, hazards, and long-form VN pacing without forcing all mitigation into a single stat

- Treating TN mode as a special case of the same engine preserves "one true engine" while still enabling authored VN obstacles at scale

---

## Consequences

### Positive

- **Single taxonomy**: SRD presents a single "Contest Type" taxonomy
- **Deterministic implementation**: Web/VN implementation has clear spec
- **Consistent authoring**: Designers choose between resist mode and duel mode rather than inventing bespoke mechanics

### Negative

- **Must specify contest type**: Every check must specify ContestType, Pillar, ApproachOverride?, StateKey, StateBefore
- **More upfront design**: Scenes must declare if opposition is Rolled or StaticTN

### Requirements

- SRD must present the Contest Type taxonomy and use the mapping table everywhere (combat, social, investigation, hazards, downtime)
- Web/VN implementation must require each check to specify:
  - `ContestType`
  - `Pillar`
  - `ApproachOverride?`
  - `StateKey`
  - `StateBefore`
  - `OppositionMode: "Rolled" | "StaticTN"`

---

## Canonical Bonus and Role Appendix (SRD + Codebase Reference)

### Role Assignment

```python
# Actor = acting side (including reactions)
# Opposition = resisting side (or TN)

# On DoS == 0: StateAfter = StateBefore (status quo holds)
```

### Bonus Composition

```python
Bonus = PillarTrait + SkillBonus + EdgeBonus + SituationalMods
```

Where `PillarTrait ∈ {Attack, Defense, Resilience}` selected by ContestType table.

### Contest Type Enum

```python
from enum import Enum

class ContestType(str, Enum):
    ATTACK = "Attack"
    COUNTER_NEGATE = "Counter_Negate"
    COUNTER_RESIST = "Counter_Resist"
    ENDURANCE = "Endurance"
    SOCIAL_CONTEST = "Social_Contest"
    SOCIAL_DUEL = "Social_Duel"
    INVESTIGATION = "Investigation"
    SEARCH_VS_CONCEALMENT = "Search_vs_Concealment"
    OBSTACLE_TASK = "Obstacle_Task"
```

### Trait Selection Logic

```python
def get_actor_trait(contest_type: ContestType, pillar: str) -> str:
    """Return which trait the actor uses."""
    if contest_type in [ContestType.ATTACK, ContestType.SOCIAL_CONTEST, 
                        ContestType.SOCIAL_DUEL, ContestType.INVESTIGATION,
                        ContestType.SEARCH_VS_CONCEALMENT]:
        return f"{pillar}Attack"
    elif contest_type == ContestType.COUNTER_NEGATE:
        return get_mapped_defense(pillar)
    elif contest_type in [ContestType.COUNTER_RESIST, ContestType.ENDURANCE]:
        return get_mapped_resilience(pillar)
    else:
        return f"{pillar}Attack"  # Default

def get_opposition_trait(contest_type: ContestType, pillar: str) -> str:
    """Return which trait the opposition uses."""
    if contest_type == ContestType.ATTACK:
        return get_mapped_defense(pillar)
    elif contest_type == ContestType.COUNTER_NEGATE:
        return f"{pillar}Attack"
    elif contest_type == ContestType.COUNTER_RESIST:
        return f"{pillar}Attack"  # or Potency if static
    elif contest_type == ContestType.SOCIAL_DUEL:
        return "InfluenceAttack"
    elif contest_type == ContestType.SEARCH_VS_CONCEALMENT:
        return "RevelationAttack"
    else:
        return get_mapped_defense(pillar)

def get_mapped_defense(pillar: str) -> str:
    """Return the defense stat for a pillar per ADR-0002."""
    mapping = {
        "Violence": "BodyDefense",
        "Influence": "SoulDefense",
        "Revelation": "MindDefense"
    }
    return mapping.get(pillar, "BodyDefense")

def get_mapped_resilience(pillar: str) -> str:
    """Return the resilience stat for a pillar per ADR-0002."""
    mapping = {
        "Violence": "BodyResilience",
        "Influence": "SoulResilience",
        "Revelation": "MindResilience"
    }
    return mapping.get(pillar, "BodyResilience")
```

### Approach Selection

```python
def get_approach_rank(pillar: str, cl: int, sl: int, override: str = None) -> int:
    """
    Return the rank for rank dice based on pillar and approach.
    
    Args:
        pillar: Violence, Influence, or Revelation
        cl: Core Level (MartialRank)
        sl: Soul Level (SorceryRank)
        override: Optional "Martial" or "Sorcerous" override
    """
    if override == "Martial":
        return cl
    elif override == "Sorcerous":
        return sl
    
    # Default by pillar
    if pillar == "Violence":
        return cl  # MartialRank
    else:
        return sl  # SorceryRank for Influence/Revelation
```

---

## References

- ADR-0001: Core Resolution Engine (Opposed d20 + Rank Dice, ±4 DoS)
- ADR-0002: Canonical Stat Model and Pillar→Defense Mapping
- ADR-0004: Skill Layer and Tagging
- SRD_UNIFIED.md: Section 4 (Conflict Types & Conditions)
