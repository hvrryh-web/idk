/**
 * Bonus Composition Rules (per ADR-0003)
 *
 * Implements the canonical bonus formula:
 * Bonus = PillarTrait + SkillBonus + EdgeBonus + SituationalMods
 *
 * @module combat/engine/rules/bonus
 */

import type { CombatUnit, ConditionPillar } from "../combatState";

// ============================================================================
// Bonus Components
// ============================================================================

export interface BonusComponents {
  /** Attack, Defense, or Resilience from the pillar */
  pillarTrait: number;
  /** Optional skill contribution */
  skillBonus: number;
  /** Persistent perks/gear */
  edgeBonus: number;
  /** Temporary modifiers (cover, conditions, scene tags) */
  situationalMods: number;
}

// ============================================================================
// Contest Types (per ADR-0003)
// ============================================================================

export type ContestType =
  | "attack"
  | "counter_negate"
  | "counter_resist"
  | "endurance"
  | "social_contest"
  | "social_duel"
  | "investigation"
  | "search_vs_concealment"
  | "obstacle";

export interface ContestRole {
  role: "actor" | "opposition";
  traitUsed: "attack" | "defense" | "resilience";
  pillar: ConditionPillar;
}

// ============================================================================
// Trait Mapping (ADR-0003 Table)
// ============================================================================

interface ContestMapping {
  actorTrait: "attack" | "defense" | "resilience";
  oppositionTrait: "attack" | "defense" | "resilience" | "potency";
}

const CONTEST_MAPPINGS: Record<ContestType, ContestMapping> = {
  attack: {
    actorTrait: "attack",
    oppositionTrait: "defense",
  },
  counter_negate: {
    actorTrait: "defense",
    oppositionTrait: "attack",
  },
  counter_resist: {
    actorTrait: "resilience",
    oppositionTrait: "attack",
  },
  endurance: {
    actorTrait: "resilience",
    oppositionTrait: "potency",
  },
  social_contest: {
    actorTrait: "attack",
    oppositionTrait: "defense",
  },
  social_duel: {
    actorTrait: "attack",
    oppositionTrait: "attack",
  },
  investigation: {
    actorTrait: "attack",
    oppositionTrait: "defense",
  },
  search_vs_concealment: {
    actorTrait: "attack",
    oppositionTrait: "attack",
  },
  obstacle: {
    actorTrait: "attack",
    oppositionTrait: "potency",
  },
};

// ============================================================================
// Pillar to Defense/Resilience Mapping (per ADR-0002)
// ============================================================================

export interface PillarDefenseMapping {
  defense: "body" | "mind" | "soul";
  resilience: "body" | "mind" | "soul";
}

/**
 * Mapping of pillars to their associated defense/resilience stat categories
 * Per ADR-0002: Violence ↔ Body, Influence ↔ Soul, Revelation ↔ Mind
 */
export const PILLAR_DEFENSE_MAP: Record<ConditionPillar, PillarDefenseMapping> = {
  violence: { defense: "body", resilience: "body" },
  influence: { defense: "soul", resilience: "soul" },
  revelation: { defense: "mind", resilience: "mind" },
};

// ============================================================================
// Core Bonus Calculation
// ============================================================================

/**
 * Calculate total bonus from components (per ADR-0003)
 *
 * Bonus = PillarTrait + SkillBonus + EdgeBonus + SituationalMods
 */
export function calculateBonus(components: BonusComponents): number {
  return (
    components.pillarTrait +
    components.skillBonus +
    components.edgeBonus +
    components.situationalMods
  );
}

/**
 * Get the pillar trait value for a given contest type and role
 */
export function getPillarTrait(
  unit: CombatUnit,
  contestType: ContestType,
  role: "actor" | "opposition",
  pillar: ConditionPillar = "violence"
): number {
  const mapping = CONTEST_MAPPINGS[contestType];
  if (!mapping) return 0;

  const traitType = role === "actor" ? mapping.actorTrait : mapping.oppositionTrait;

  // Potency is a static value, not from unit
  if (traitType === "potency") {
    return 0; // Caller should provide TN instead
  }

  const pillarStats = unit[pillar];
  return pillarStats[traitType] ?? 0;
}

/**
 * Calculate attack bonus for a unit attacking
 */
export function calculateAttackBonus(
  attacker: CombatUnit,
  pillar: ConditionPillar = "violence",
  skillBonus: number = 0,
  edgeBonus: number = 0,
  situationalMods: number = 0
): number {
  return calculateBonus({
    pillarTrait: attacker[pillar].attack,
    skillBonus,
    edgeBonus,
    situationalMods: situationalMods + getConditionModifiers(attacker, "attack"),
  });
}

/**
 * Calculate defense value for a unit defending
 */
export function calculateDefenseValue(
  defender: CombatUnit,
  pillar: ConditionPillar = "violence",
  edgeBonus: number = 0,
  situationalMods: number = 0
): number {
  return (
    defender[pillar].defense +
    edgeBonus +
    situationalMods +
    getConditionModifiers(defender, "defense")
  );
}

/**
 * Calculate resilience for resistance checks
 */
export function calculateResilience(
  unit: CombatUnit,
  pillar: ConditionPillar = "violence",
  edgeBonus: number = 0,
  situationalMods: number = 0
): number {
  return (
    unit[pillar].resilience +
    edgeBonus +
    situationalMods +
    getConditionModifiers(unit, "resilience")
  );
}

// ============================================================================
// Condition Modifiers
// ============================================================================

/**
 * Get penalty/bonus from active conditions
 */
export function getConditionModifiers(
  unit: CombatUnit,
  stat: "attack" | "defense" | "resilience"
): number {
  let modifier = 0;

  for (const effect of unit.statusEffects) {
    // Condition penalties based on degree
    const degreePenalty = effect.degree;

    // Violence conditions affect physical stats
    if (effect.pillar === "violence") {
      if (stat === "attack" || stat === "defense") {
        modifier -= degreePenalty;
      }
    }

    // Influence conditions affect social stats
    if (effect.pillar === "influence") {
      // Minimal combat impact for influence conditions
    }

    // Revelation conditions affect mental stats
    if (effect.pillar === "revelation") {
      // Could affect defense through distraction
      if (stat === "defense") {
        modifier -= Math.floor(degreePenalty / 2);
      }
    }

    // Process explicit modifier effects
    for (const condEffect of effect.effects) {
      if (condEffect.type === "modifier" && condEffect.stat === stat) {
        modifier += condEffect.value ?? 0;
      }
    }
  }

  return modifier;
}

// ============================================================================
// Status Quo Rule (ADR-0003)
// ============================================================================

export interface ContestResult {
  dos: number; // Degree of Success
  stateKey: string;
  stateBefore: unknown;
  stateAfter: unknown;
}

/**
 * Apply the status quo rule (DoS === 0 means no change)
 */
export function applyStatusQuoRule<T>(
  dos: number,
  stateKey: string,
  stateBefore: T,
  stateAfterIfSuccess: T
): ContestResult {
  // Ties (DoS === 0) preserve prior state
  const stateAfter = dos === 0 ? stateBefore : stateAfterIfSuccess;

  return {
    dos,
    stateKey,
    stateBefore,
    stateAfter,
  };
}

/**
 * Calculate Degree of Success (DoS) from margin
 *
 * DoS is in ±4 bands per ADR-0001
 */
export function calculateDoS(margin: number): number {
  if (margin <= -15) return -4;
  if (margin <= -10) return -3;
  if (margin <= -5) return -2;
  if (margin < 0) return -1;
  if (margin === 0) return 0;
  if (margin < 5) return 1;
  if (margin < 10) return 2;
  if (margin < 15) return 3;
  return 4;
}
