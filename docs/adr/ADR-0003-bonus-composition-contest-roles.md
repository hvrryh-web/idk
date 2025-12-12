# ADR-0003: Bonus Composition and Contest Roles

**Status**: Accepted  
**Date**: 2025-12-12  
**Deciders**: Game Design Team  
**Technical Story**: Combat engine integration for VN/TTRPG hybrid

## Context

ADR-0001 locked an opposed-first core engine (ActorTotal vs OppTotal, DoS in ±4 bands) and ADR-0002 locked the canonical stat spine and pillar→defense/resilience mapping. We now need one deterministic rule for:

1. **Who is Actor vs Opposition** in common scenes
2. **Which pillar trait** (Attack, Defense, Resilience) composes `Bonus_actor` and `Bonus_opp` for each check type

This ADR ensures SRD text cannot drift and the web/VN codebase can implement checks without per-scene ambiguity.

This ADR also formalizes the **"tie means no state change"** principle for contested checks (status quo holds), aligning with widely used contested-check conventions.

## Decision

### 1) Contest Roles: Actor, Opposition, and Status Quo

**Actor** = the side currently taking an action (including reactions).

**Opposition** = the side resisting that action, or a static obstacle in TN mode.

**Status Quo Rule (Ties)**: If the final computed DoS is 0, the game state does not change relative to the state immediately before the check. (This is equivalent to "status quo holds" in contested checks.)

**Implementation Requirement**: Every check must declare:
- `StateKey` (what would change)
- `StateBefore` (current state value)

On `DoS === 0`, set `StateAfter = StateBefore`.

This generalizes "defender wins ties" into a machine-checkable rule that handles cases like "apply grapple" vs "escape grapple" without special-casing.

### 2) Bonus Composition (Universal Formula)

For both sides in ADR-0001 totals:

```
Bonus = PillarTrait + SkillBonus + EdgeBonus + SituationalMods
```

Where:
- **PillarTrait** is exactly one of: Attack, Defense, or Resilience, selected by the check type below.
- **SkillBonus** is optional and only included if a rule/technique/scene calls for a specific skill domain.
- **EdgeBonus** covers persistent perks (advantages, techniques, gear tags).
- **SituationalMods** are temporary modifiers (cover, leverage, conditions, scene tags).

### 3) Which Trait is Used by Check Type (Canonical Mapping)

Below, "Pillar" means Violence / Influence / Revelation, and the corresponding Defense/Resilience is fixed by ADR-0002:

- **Violence** ↔ Body Defense/Resilience
- **Influence** ↔ Soul Defense/Resilience
- **Revelation** ↔ Mind Defense/Resilience

| Check Type | Actor Uses PillarTrait | Opposition Uses PillarTrait | Notes (StateKey) |
|------------|------------------------|----------------------------|------------------|
| Attack (pillar action) | Attack (that pillar) | Defense (mapped defense) | StateKey: "target condition / harm / shift" |
| Counter (negate/ward/parry) | Defense (mapped defense) | Attack (incoming pillar) | StateKey: "attack proceeds?" (tie = no change) |
| Counter (resist/withstand) | Resilience (mapped resilience) | Attack (source pillar) or Potency (static) | StateKey: "effect applies?" |
| Endurance (self-initiated recovery) | Resilience (mapped resilience) | Potency (static) or Attack (ongoing source) | StateKey: "condition reduces?" |
| Social contest (influence attempt) | Influence Attack | Soul Defense | Default for persuade/deceive/charm/pressure |
| Social duel (both pushing agendas) | Influence Attack | Influence Attack | Use when both sides actively try to sway |
| Investigation (revelation attempt) | Revelation Attack | Mind Defense | Default for reading intent, piercing illusions |
| Search vs concealment | Revelation Attack | Revelation Attack | Use when opposition actively hides truth |
| Obstacle task (no opposing actor) | Appropriate pillar trait | TN (static) | Use TN mode; opposition does not roll |

**Approach → Rank Dice** (for ADR-0001 kept die):
- Default: Violence checks use `MartialRank = CL`, Influence/Revelation use `SorceryRank = SL`.
- A technique may override this by tagging the check as Martial or Sorcerous explicitly (e.g., "Sorcerous Violence" or "Martial Influence").

### 4) Static Opposition (TN Mode) is a First-Class Case

When there is no opposing actor, opposition is a fixed integer total:

```
OppTotal = TN (no d20, no rank dice)
```

This is fully compatible with ADR-0001 and avoids inventing parallel "DC math."

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Always Attack vs Defense | Simple | Collapses endurance/recovery into same axis, blurs "withstanding" vs "avoiding" |
| Saving-throw style (Resilience vs fixed DC) | Fast | Breaks opposed-first premise unless TN mode is explicitly canonical |
| **Role-based trait selection** (selected) | Deterministic, covers all common scenes | More complex mapping table |

## Rationale

1. **Formalizing "ties preserve prior state"** is a proven contested-check convention and prevents edge-case disputes; it also makes code implementation explicit (`StateBefore → StateAfter`).

2. **Separating Defense (avoid/negate) from Resilience (endure/withstand/recover)** supports cleaner tuning knobs for bosses, hazards, and long-form VN pacing without forcing all mitigation into a single stat.

3. **Treating TN mode as a special case** of the same engine preserves "one true engine" while still enabling authored VN obstacles at scale.

## Consequences

### SRD Impact
- SRD must present a single "Contest Type" taxonomy and use the mapping table above everywhere (combat, social, investigation, hazards, downtime).

### Web/VN Implementation Impact
- Must require each check to specify:
  - `ContestType`
  - `Pillar`
  - `ApproachOverride?`
  - `StateKey`
  - `StateBefore`
  - Whether opposition is `Rolled` or `StaticTN`

### Content Authoring Impact
- Content authoring becomes consistent: designers choose between resist mode (Attack vs Defense/Resilience) and duel mode (Attack vs Attack) rather than inventing bespoke mechanics per scene.

### Future Expansion
- Skills list, technique tags, environmental potency profiles can plug into `SkillBonus` and `Potency` without changing this ADR.

---

## Canonical Bonus and Role Appendix (SRD + Codebase Reference)

### Role Assignment

```typescript
type ContestRole = 'actor' | 'opposition';

// Actor = acting side (including reactions)
// Opposition = resisting side (or TN)
```

### Status Quo Rule

```typescript
// On DoS === 0: StateAfter = StateBefore (status quo holds)
interface ContestResult {
  dos: number;           // Degree of Success (-4 to +4 bands)
  stateKey: string;      // What would change
  stateBefore: unknown;  // State before check
  stateAfter: unknown;   // State after check (equals stateBefore if dos === 0)
}
```

### Bonus Formula

```typescript
interface BonusComponents {
  pillarTrait: number;      // Attack, Defense, or Resilience
  skillBonus: number;       // Optional skill contribution
  edgeBonus: number;        // Persistent perks/gear
  situationalMods: number;  // Temporary modifiers
}

function calculateBonus(components: BonusComponents): number {
  return (
    components.pillarTrait +
    components.skillBonus +
    components.edgeBonus +
    components.situationalMods
  );
}
```

---

## Related ADRs

- **ADR-0001**: Opposed-first core engine (ActorTotal vs OppTotal, DoS bands)
- **ADR-0002**: Canonical stat spine and pillar→defense/resilience mapping
- **ADR-0004** (next): Skill Layer and Tagging (skill list, technique tags, approach overrides)
