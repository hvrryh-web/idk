/**
 * Condition (Status Effect) Management
 *
 * Implements condition application, stacking, and recovery.
 *
 * @module combat/engine/rules/conditions
 */

import type {
  CombatUnit,
  ConditionDegree,
  ConditionPillar,
  StatusEffect,
} from "../combatState";

// ============================================================================
// Condition Names by Pillar and Degree
// ============================================================================

const CONDITION_NAMES: Record<ConditionPillar, Record<ConditionDegree, string>> = {
  violence: {
    1: "Injured",
    2: "Maimed",
    3: "Mortally Wounded",
    4: "Ruined Body",
  },
  influence: {
    1: "Rattled",
    2: "Discredited",
    3: "Isolated",
    4: "Shattered",
  },
  revelation: {
    1: "Shaken",
    2: "Haunted",
    3: "Deranged",
    4: "Shattered",
  },
};

/**
 * Get condition name for a pillar and degree
 */
export function getConditionName(
  pillar: ConditionPillar,
  degree: ConditionDegree
): string {
  return CONDITION_NAMES[pillar][degree];
}

// ============================================================================
// Condition Creation
// ============================================================================

let conditionIdCounter = 0;

/**
 * Create a new status effect/condition
 */
export function createCondition(
  pillar: ConditionPillar,
  degree: ConditionDegree,
  source: string,
  duration: number | "permanent" = "permanent"
): StatusEffect {
  conditionIdCounter++;
  const id = `condition-${pillar}-${Date.now()}-${conditionIdCounter}`;

  return {
    id,
    name: getConditionName(pillar, degree),
    pillar,
    degree,
    duration,
    source,
    effects: getConditionEffects(pillar, degree),
  };
}

/**
 * Get the mechanical effects of a condition
 */
function getConditionEffects(
  pillar: ConditionPillar,
  degree: ConditionDegree
): StatusEffect["effects"] {
  const penalty = -degree;

  switch (pillar) {
    case "violence":
      // Violence conditions penalize physical actions
      return [
        { type: "modifier", stat: "attack", value: penalty },
        { type: "modifier", stat: "agility", value: penalty },
      ];

    case "influence":
      // Influence conditions penalize social actions
      return [
        { type: "modifier", stat: "presence", value: penalty },
        { type: "modifier", stat: "influence_attack", value: penalty },
      ];

    case "revelation":
      // Revelation conditions penalize mental actions
      return [
        { type: "modifier", stat: "focus", value: penalty },
        { type: "modifier", stat: "willpower", value: penalty },
      ];

    default:
      return [];
  }
}

// ============================================================================
// Condition Application
// ============================================================================

export interface ApplyConditionResult {
  appliedCondition: StatusEffect;
  advanced: boolean;
  previousDegree?: ConditionDegree;
}

/**
 * Apply a condition to a unit, handling stacking rules
 *
 * Same pillar: Advance to next degree
 * Different pillar: Both apply (handled by caller)
 */
export function applyCondition(
  unit: CombatUnit,
  pillar: ConditionPillar,
  degree: ConditionDegree,
  source: string
): ApplyConditionResult {
  // Check for existing condition of same pillar
  let existingCondition: StatusEffect | undefined;
  for (let i = 0; i < unit.statusEffects.length; i++) {
    if (unit.statusEffects[i].pillar === pillar) {
      existingCondition = unit.statusEffects[i];
      break;
    }
  }

  if (existingCondition) {
    // Advance to next degree (max 4)
    const newDegree = Math.min(4, Math.max(existingCondition.degree, degree) + 1) as ConditionDegree;

    const advancedCondition: StatusEffect = {
      ...existingCondition,
      degree: newDegree,
      name: getConditionName(pillar, newDegree),
      effects: getConditionEffects(pillar, newDegree),
    };

    return {
      appliedCondition: advancedCondition,
      advanced: true,
      previousDegree: existingCondition.degree,
    };
  }

  // Create new condition
  const newCondition = createCondition(pillar, degree, source);

  return {
    appliedCondition: newCondition,
    advanced: false,
  };
}

// ============================================================================
// Condition Queries
// ============================================================================

/**
 * Check if unit has any condition of a given pillar
 */
export function hasCondition(unit: CombatUnit, pillar: ConditionPillar): boolean {
  return unit.statusEffects.some((e) => e.pillar === pillar);
}

/**
 * Get the highest degree condition of a given pillar
 */
export function getConditionDegree(unit: CombatUnit, pillar: ConditionPillar): ConditionDegree | 0 {
  const conditions = unit.statusEffects.filter((e) => e.pillar === pillar);
  if (conditions.length === 0) return 0;
  return Math.max(...conditions.map((c) => c.degree)) as ConditionDegree;
}

/**
 * Get total penalty from all conditions for a stat type
 */
export function getTotalConditionPenalty(unit: CombatUnit): number {
  let total = 0;
  for (const effect of unit.statusEffects) {
    total -= effect.degree;
  }
  return total;
}

/**
 * Check if unit is at 4th degree of any condition (taken out)
 */
export function isTakenOut(unit: CombatUnit): boolean {
  return unit.statusEffects.some((e) => e.degree >= 4);
}

/**
 * Check if unit is dying (3rd degree violence or 0 THP)
 */
export function isDying(unit: CombatUnit): boolean {
  return (
    unit.thp <= 0 ||
    unit.statusEffects.some((e) => e.pillar === "violence" && e.degree >= 3)
  );
}

// ============================================================================
// Condition Recovery
// ============================================================================

export type RecoveryType = "short_rest" | "long_rest" | "extended_rest" | "technique" | "treatment";

/**
 * Get conditions that can be recovered with a given recovery type
 */
export function getRecoverableConditions(
  unit: CombatUnit,
  recoveryType: RecoveryType
): StatusEffect[] {
  return unit.statusEffects.filter((condition) => {
    // 4th degree conditions require narrative resolution
    if (condition.degree >= 4) return false;

    switch (recoveryType) {
      case "short_rest":
        // Short rest can recover 1st degree only
        return condition.degree === 1;

      case "long_rest":
        // Long rest can recover 1st-2nd degree
        return condition.degree <= 2;

      case "extended_rest":
        // Extended rest can recover up to 3rd degree
        return condition.degree <= 3;

      case "technique":
      case "treatment":
        // Techniques/treatment can recover up to 3rd degree
        return condition.degree <= 3;

      default:
        return false;
    }
  });
}

/**
 * Reduce condition degree (recovery)
 */
export function reduceCondition(
  condition: StatusEffect,
  amount: number = 1
): StatusEffect | null {
  const newDegree = condition.degree - amount;

  if (newDegree <= 0) {
    // Condition fully recovered
    return null;
  }

  return {
    ...condition,
    degree: newDegree as ConditionDegree,
    name: getConditionName(condition.pillar, newDegree as ConditionDegree),
    effects: getConditionEffects(condition.pillar, newDegree as ConditionDegree),
  };
}

// ============================================================================
// Duration Processing
// ============================================================================

/**
 * Process conditions at end of round (reduce durations, expire)
 */
export function processConditionDurations(
  effects: StatusEffect[]
): { remaining: StatusEffect[]; expired: StatusEffect[] } {
  const remaining: StatusEffect[] = [];
  const expired: StatusEffect[] = [];

  for (const effect of effects) {
    if (effect.duration === "permanent") {
      remaining.push(effect);
      continue;
    }

    const newDuration = effect.duration - 1;

    if (newDuration <= 0) {
      expired.push(effect);
    } else {
      remaining.push({
        ...effect,
        duration: newDuration,
      });
    }
  }

  return { remaining, expired };
}
