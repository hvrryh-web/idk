# ADR-0004: Skill Layer and Tagging

**Status**: Accepted

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

ADR-0001 established a single opposed-roll engine (Actor vs Opposition, DoS in ±4 bands), ADR-0002 fixed the canonical stat spine and pillar mapping, and ADR-0003 fixed which pillar traits (Attack/Defense/Resilience) are used as the base Bonus by contest type.

We now need two remaining "plumbing" layers that must be stable for SRD and web/VN implementation:

1. **A Skill Layer** that adds breadth to non-combat and supports specialized competency without inflating pillar caps or reintroducing multiple engines

2. **A Tagging System** that unifies situational advantages, complications, gear, techniques, and scene states into a machine-readable format

---

## Decision

### 1. Skill Layer: What Skills Are, How They're Bought, and When They Apply

**Definition**: Skills are additive training bonuses that may be included as `SkillBonus` in ADR-0003's formula:

```
Bonus = PillarTrait + SkillBonus + EdgeBonus + SituationalMods
```

**Key Rules**:
- Skills are **not** pillar traits
- They do not change Attack/Defense/Resilience values
- They do not affect OffCap/DefCap math by default

**Application**:
- Skills apply by default to **non-combat** tasks and contests (Influence, Revelation, and "Violence-as-athletics" obstacles)
- In structured combat conflicts, skills are **not added** unless a technique explicitly grants it (see Tagging, "Overrides")

**Rating Scale**: Integer 0–6

| Rating | Description |
|--------|-------------|
| 0 | Untrained |
| 1 | Novice |
| 2 | Competent |
| 3 | Practiced |
| 4 | Expert |
| 5 | Master |
| 6 | Legendary |

**Cost Model (SCP)**:
- **Broad Skill rank**: 1 SCP per +1 rating
- **Specialty ranks** (optional module): 1 SCP buys +2 to a narrowly defined specialty under a skill (e.g., `Deceive: Forgery`, `Occult: Seals`)

**Skill Caps**:
```
SkillRating ≤ SCL + 2
```

### 2. Canonical Skill List (12 Skills)

Each skill is "default-pillar anchored" for SRD clarity and authoring consistency.

#### Violence-Anchored (Body-Facing Tasks)

| Skill | Description |
|-------|-------------|
| **Athletics** | Movement, climbing, jumps, grapples, pursuit |
| **Arms** | Weapon forms, martial discipline, drills, disarms |
| **Stealth** | Infiltration, ambush, conceal presence |
| **Survival** | Tracking, navigation, harsh terrain, fieldcraft |

#### Influence-Anchored (Soul-Facing Contests)

| Skill | Description |
|-------|-------------|
| **Command** | Authority, intimidation, coercive presence |
| **Deceive** | Lies, feints, disguise, misdirection |
| **Rapport** | Charm, empathy, bargaining, reading the room |
| **Etiquette** | Protocol, faction politics, court maneuver |

#### Revelation-Anchored (Mind-Facing Contests)

| Skill | Description |
|-------|-------------|
| **Observe** | Awareness, scouting, threat read |
| **Investigate** | Analysis, research, deduction |
| **Occult** | Cultivation theory, spirits, seals, metaphysics |
| **Artifice** | Alchemy, talismans, arrays, medicine-as-technique |

**Rule**: A check may include at most **one skill** (one SkillBonus) unless a specific technique tag states otherwise.

### 3. Tagging System: Definition, Types, and Invocation

**Definition**: A **Tag** is a short keyword/phrase with a machine payload (rules effect) and a scope (who/what it attaches to).

#### Tag Types (5 Canonical)

| Type | Scope | Persistence |
|------|-------|-------------|
| **Technique Tags** | Permanent on technique definition | Permanent |
| **Gear Tags** | Permanent on equipment | Permanent |
| **Character Tags** | Permanent descriptors/perks | Permanent |
| **Scene Tags** | Temporary situational states | Until scene ends or removed |
| **Complication Tags** | Temporary negative states | Until resolved or scene ends |

#### Invoking Tags (Core Mechanic)

A tag may be invoked to gain either:
- **Reroll** one d20 you rolled (keep the better), OR
- **+3** to your total after rolling but before DoS is finalized

**Cost**: Spend 1 pillar meta-currency (Fury/Clout/Insight) per invoke.

**Free Invokes**: A tag can carry `FreeInvokeCount` that can be spent instead of currency.

#### Create Tag Action (Universal)

Any character may take an action to **Create an Advantage**, rolling an appropriate contest:

**On Success (DoS ≥ +1)**:
- Create a Scene Tag on target, location, or situation
- `FreeInvokeCount = 1` on DoS +1 to +2
- `FreeInvokeCount = 2` on DoS +3 or higher

**On Failure (DoS ≤ -1)**:
- Create a Complication Tag instead (same naming, hostile)
- Attached to the actor or scene
- `FreeInvokeCount = 1` usable by the opposition

#### Tag Limits (Hard Bounds)

- Maximum **2 invoked tags per check** (total), regardless of source
- Maximum **1 tag per StackGroup**

### 4. Reserved Tag Fields (SRD + Code Schema)

Every tag in the SRD must define these fields:

| Field | Type | Description |
|-------|------|-------------|
| `TagID` | string | Stable identifier |
| `TagType` | enum | Technique/Gear/Character/Scene/Complication |
| `Pillar` | enum? | Optional: Violence/Influence/Revelation |
| `StackGroup` | string? | Optional: e.g., "Stance", "Form", "DomainState" |
| `InvokeAllowed` | bool | Whether this tag can be invoked |
| `InvokeEffect` | enum | Reroll, +3, or Both |
| `PassiveMods` | list | Explicit numeric mods, if any |
| `Overrides` | object? | Optional override fields (see below) |

**Override Fields**:
- `ApproachOverride`: Martial/Sorcerous
- `PillarOverride`: V/I/R
- `ContestTypeOverride`: Attack/Counter/Resist/Duel/Task (per ADR-0003)
- `SkillAllowInCombat`: true/false (default false)

### 5. Tag Interactions with Caps (Critical for Balance)

- Tags do **not** permanently increase pillar traits
- Tags do **not** alter OffCap/DefCap by default

**VirtualRanks Rule**: Any tag that temporarily increases "effective Attack/Defense/Resilience" must:
1. Declare it as `VirtualRanks`
2. Count against caps during validation (OffCap/DefCap checks) using ADR-0002's cap rules

**Overclock Tags**: Tags that allow temporary cap pushes must always carry an explicit cost track or meta-currency spend gate.

---

## Options Considered

1. **No skills; only pillar traits + tags**: Fastest, but risks non-combat feeling flat and forces tags to do too much

2. **Large granular skill list (20–30+)**: Expressive, but heavy SRD surface area and harder VN authoring

3. **Selected: 12 anchored skills + bounded tag invocation**: Expressive enough for non-combat, compact enough for SRD, deterministic enough for code

---

## Rationale

- The 12-skill anchored set keeps authoring predictable while still allowing "fiction-first" flexibility in how skills are described and applied

- Tag invocation as reroll/flat bonus is a highly proven pattern that creates consistent player agency and clean UI prompts ("Invoke tag?")

- Assets/complications as scene-attachable states are a proven way to model ephemeral advantages and problems without rewriting the core engine

- The existing economy already supports rerolls and +3 boosts through Fury/Clout/Insight, so tags integrate without adding a new currency subsystem

---

## Consequences

### Positive

- **Stable interface**: Every check can be resolved with `(ContestType, Pillar, Approach, PillarTrait, SkillID?, TagInvokes[])`
- **Combat remains pillar-driven**: Skills do not stealth-inflate to-hit math unless explicitly enabled
- **Scalable content**: VN scenes can be built from skill contests, advantage creation, and tag invocations

### Negative

- **Must define normative skill list**: SRD must define the skill list, cost/caps, and tag schema as normative content
- **VirtualRanks auditing**: Tags that grant VirtualRanks require careful balance review

### Requirements

- SRD must define the 12 skills as normative content
- Codebase must implement tag schema with all reserved fields
- Combat implementation must not include SkillBonus unless technique grants `SkillAllowInCombat`

---

## Canonical Skill and Tag Appendix (SRD + Codebase Reference)

### Skill Data Schema

```python
from dataclasses import dataclass
from enum import Enum

class SkillID(str, Enum):
    # Violence-anchored
    ATHLETICS = "Athletics"
    ARMS = "Arms"
    STEALTH = "Stealth"
    SURVIVAL = "Survival"
    
    # Influence-anchored
    COMMAND = "Command"
    DECEIVE = "Deceive"
    RAPPORT = "Rapport"
    ETIQUETTE = "Etiquette"
    
    # Revelation-anchored
    OBSERVE = "Observe"
    INVESTIGATE = "Investigate"
    OCCULT = "Occult"
    ARTIFICE = "Artifice"

SKILL_PILLAR_MAPPING = {
    SkillID.ATHLETICS: "Violence",
    SkillID.ARMS: "Violence",
    SkillID.STEALTH: "Violence",
    SkillID.SURVIVAL: "Violence",
    SkillID.COMMAND: "Influence",
    SkillID.DECEIVE: "Influence",
    SkillID.RAPPORT: "Influence",
    SkillID.ETIQUETTE: "Influence",
    SkillID.OBSERVE: "Revelation",
    SkillID.INVESTIGATE: "Revelation",
    SkillID.OCCULT: "Revelation",
    SkillID.ARTIFICE: "Revelation",
}

@dataclass
class SkillRating:
    skill_id: SkillID
    rating: int  # 0-6
    specialties: list[tuple[str, int]] = None  # (name, bonus)
    
    def get_cap(self, scl: int) -> int:
        return scl + 2
    
    def validate(self, scl: int) -> bool:
        return self.rating <= self.get_cap(scl)
```

### Tag Data Schema

```python
from dataclasses import dataclass, field
from typing import Optional, List

class TagType(str, Enum):
    TECHNIQUE = "Technique"
    GEAR = "Gear"
    CHARACTER = "Character"
    SCENE = "Scene"
    COMPLICATION = "Complication"

class InvokeEffect(str, Enum):
    REROLL = "Reroll"
    PLUS_THREE = "+3"
    BOTH = "Both"

@dataclass
class TagOverrides:
    approach_override: Optional[str] = None  # "Martial" or "Sorcerous"
    pillar_override: Optional[str] = None    # "Violence", "Influence", "Revelation"
    contest_type_override: Optional[str] = None
    skill_allow_in_combat: bool = False

@dataclass
class Tag:
    tag_id: str
    tag_type: TagType
    name: str
    description: str = ""
    pillar: Optional[str] = None
    stack_group: Optional[str] = None
    invoke_allowed: bool = True
    invoke_effect: InvokeEffect = InvokeEffect.BOTH
    passive_mods: List[dict] = field(default_factory=list)
    virtual_ranks: int = 0
    overrides: Optional[TagOverrides] = None
    free_invoke_count: int = 0
```

### Tag Invocation Logic

```python
def invoke_tag(
    tag: Tag,
    meta_currency: int,
    free_invokes_available: int,
    invokes_this_check: int,
    stack_groups_invoked: set[str]
) -> tuple[bool, str, int, int]:
    """
    Attempt to invoke a tag.
    
    Returns: (success, effect, new_currency, new_free_invokes)
    """
    # Check invoke allowed
    if not tag.invoke_allowed:
        return (False, "Tag cannot be invoked", meta_currency, free_invokes_available)
    
    # Check max invokes per check
    if invokes_this_check >= 2:
        return (False, "Maximum 2 tag invokes per check", meta_currency, free_invokes_available)
    
    # Check stack group limit
    if tag.stack_group and tag.stack_group in stack_groups_invoked:
        return (False, f"Already invoked tag from StackGroup: {tag.stack_group}", 
                meta_currency, free_invokes_available)
    
    # Determine cost source
    if free_invokes_available > 0:
        return (True, tag.invoke_effect.value, meta_currency, free_invokes_available - 1)
    elif meta_currency >= 1:
        return (True, tag.invoke_effect.value, meta_currency - 1, free_invokes_available)
    else:
        return (False, "Insufficient meta-currency or free invokes", 
                meta_currency, free_invokes_available)
```

### Create Advantage Action

```python
def create_advantage(dos: int, tag_name: str, target: str) -> Tag:
    """
    Create a tag from a Create Advantage action.
    
    Args:
        dos: Degrees of Success from the contest
        tag_name: Name for the new tag
        target: What the tag attaches to
    
    Returns:
        Tag object (Scene or Complication)
    """
    if dos >= 1:
        # Success - create Scene Tag
        free_invokes = 2 if dos >= 3 else 1
        return Tag(
            tag_id=f"scene_{tag_name.lower().replace(' ', '_')}",
            tag_type=TagType.SCENE,
            name=tag_name,
            description=f"Created by advantage action on {target}",
            invoke_allowed=True,
            invoke_effect=InvokeEffect.BOTH,
            free_invoke_count=free_invokes
        )
    else:
        # Failure - create Complication Tag (for opposition)
        return Tag(
            tag_id=f"complication_{tag_name.lower().replace(' ', '_')}",
            tag_type=TagType.COMPLICATION,
            name=tag_name,
            description=f"Complication from failed advantage on {target}",
            invoke_allowed=True,
            invoke_effect=InvokeEffect.BOTH,
            free_invoke_count=1
        )
```

---

## References

- ADR-0001: Core Resolution Engine (Opposed d20 + Rank Dice, ±4 DoS)
- ADR-0002: Canonical Stat Model and Pillar→Defense Mapping
- ADR-0003: Bonus Composition and Contest Roles
- Fate SRD: Aspects and Invokes
- Cortex Prime: Assets and Complications
- Blades in the Dark: Action Ratings
