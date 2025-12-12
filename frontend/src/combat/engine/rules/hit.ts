/**
 * Hit and Critical Hit Logic
 *
 * Implements attack resolution and critical hit determination.
 *
 * @module combat/engine/rules/hit
 */

import type { SeededRNG } from "../rng";
import type { CombatUnit, ConditionPillar } from "../combatState";
import { calculateAttackBonus, calculateDefenseValue } from "./bonus";

// ============================================================================
// Hit Result Types
// ============================================================================

export type HitOutcome = "miss" | "hit" | "crit";

export interface HitResult {
  outcome: HitOutcome;
  attackRoll: number;
  attackTotal: number;
  defenseValue: number;
  margin: number;
  isNat1: boolean;
  isNat20: boolean;
}

// ============================================================================
// Hit Resolution
// ============================================================================

/**
 * Resolve whether an attack hits
 *
 * @param attackRoll - The d20 roll result
 * @param attackBonus - Attacker's total attack bonus
 * @param defenseValue - Defender's defense value
 * @returns Hit result with outcome and details
 */
export function resolveHit(
  attackRoll: number,
  attackBonus: number,
  defenseValue: number
): HitResult {
  const isNat1 = attackRoll === 1;
  const isNat20 = attackRoll === 20;
  const attackTotal = attackRoll + attackBonus;
  const margin = attackTotal - defenseValue;

  // Natural 1: Always miss
  if (isNat1) {
    return {
      outcome: "miss",
      attackRoll,
      attackTotal,
      defenseValue,
      margin,
      isNat1: true,
      isNat20: false,
    };
  }

  // Natural 20: Always hit + crit
  if (isNat20) {
    return {
      outcome: "crit",
      attackRoll,
      attackTotal,
      defenseValue,
      margin,
      isNat1: false,
      isNat20: true,
    };
  }

  // Miss if margin is negative
  if (margin < 0) {
    return {
      outcome: "miss",
      attackRoll,
      attackTotal,
      defenseValue,
      margin,
      isNat1: false,
      isNat20: false,
    };
  }

  // Crit if success by 5+
  if (margin >= 5) {
    return {
      outcome: "crit",
      attackRoll,
      attackTotal,
      defenseValue,
      margin,
      isNat1: false,
      isNat20: false,
    };
  }

  // Regular hit
  return {
    outcome: "hit",
    attackRoll,
    attackTotal,
    defenseValue,
    margin,
    isNat1: false,
    isNat20: false,
  };
}

/**
 * Full attack roll and hit resolution
 *
 * @param rng - Seeded RNG instance
 * @param attacker - Attacking unit
 * @param defender - Defending unit
 * @param pillar - Which pillar (violence/influence/revelation)
 * @param skillBonus - Additional skill bonus (optional)
 * @param situationalMods - Situational modifiers (optional)
 */
export function rollAttack(
  rng: SeededRNG,
  attacker: CombatUnit,
  defender: CombatUnit,
  pillar: ConditionPillar = "violence",
  skillBonus: number = 0,
  situationalMods: number = 0
): HitResult {
  const attackRoll = rng.d20();
  const attackBonus = calculateAttackBonus(attacker, pillar, skillBonus, 0, situationalMods);
  const defenseValue = calculateDefenseValue(defender, pillar);

  return resolveHit(attackRoll, attackBonus, defenseValue);
}

// ============================================================================
// Hit Chance Calculation (for forecasting)
// ============================================================================

/**
 * Calculate estimated hit chance for UI forecasting
 *
 * @param attackBonus - Attacker's total attack bonus
 * @param defenseValue - Defender's defense value
 * @returns Hit chance as percentage (0-100)
 */
export function calculateHitChance(attackBonus: number, defenseValue: number): number {
  const neededRoll = defenseValue - attackBonus;

  // Always hits on nat 20 (5% minimum)
  // Always misses on nat 1 (5% minimum miss)

  if (neededRoll <= 1) {
    // Hit on 2-20 (95%)
    return 95;
  }

  if (neededRoll > 20) {
    // Only hit on nat 20 (5%)
    return 5;
  }

  // (21 - neededRoll) / 20 * 100, accounting for nat 1 miss
  const hitChance = ((21 - neededRoll) / 20) * 100;
  return Math.max(5, Math.min(95, hitChance));
}

/**
 * Calculate estimated crit chance for UI forecasting
 *
 * @param attackBonus - Attacker's total attack bonus
 * @param defenseValue - Defender's defense value
 * @returns Crit chance as percentage (0-100)
 */
export function calculateCritChance(attackBonus: number, defenseValue: number): number {
  // Crit on nat 20 (5%) or success by 5+
  const critThreshold = defenseValue + 5 - attackBonus;

  // Always crit on nat 20 (5% minimum)
  if (critThreshold <= 1) {
    return 95; // Crit on 2-20
  }

  if (critThreshold > 20) {
    return 5; // Only crit on nat 20
  }

  const critChance = ((21 - critThreshold) / 20) * 100;
  return Math.max(5, Math.min(95, critChance));
}

// ============================================================================
// Resistance Checks
// ============================================================================

export interface ResistanceResult {
  success: boolean;
  roll: number;
  total: number;
  dc: number;
  margin: number;
  conditionDegree: 0 | 1 | 2 | 3 | 4;
}

/**
 * Roll a resistance check
 *
 * @param rng - Seeded RNG instance
 * @param resilienceBonus - Defender's resilience + modifiers
 * @param effectRank - Effect rank determining DC (DC = 10 + Effect Rank)
 */
export function rollResistance(
  rng: SeededRNG,
  resilienceBonus: number,
  effectRank: number
): ResistanceResult {
  const roll = rng.d20();
  const total = roll + resilienceBonus;
  const dc = 10 + effectRank;
  const margin = total - dc;

  // Natural 20: Always success
  if (roll === 20) {
    return {
      success: true,
      roll,
      total,
      dc,
      margin,
      conditionDegree: 0,
    };
  }

  // Natural 1: Automatic failure, minimum 2nd degree
  if (roll === 1) {
    return {
      success: false,
      roll,
      total,
      dc,
      margin,
      conditionDegree: Math.max(2, determineConditionDegree(margin)) as 2 | 3 | 4,
    };
  }

  const success = margin >= 0;
  const conditionDegree = success ? 0 : determineConditionDegree(margin);

  return {
    success,
    roll,
    total,
    dc,
    margin,
    conditionDegree,
  };
}

/**
 * Determine condition degree from resistance failure margin
 *
 * - Failure by 1-4: 1st Degree
 * - Failure by 5-9: 2nd Degree
 * - Failure by 10-14: 3rd Degree
 * - Failure by 15+: 4th Degree
 */
export function determineConditionDegree(margin: number): 0 | 1 | 2 | 3 | 4 {
  if (margin >= 0) return 0;

  const failure = Math.abs(margin);

  if (failure <= 4) return 1;
  if (failure <= 9) return 2;
  if (failure <= 14) return 3;
  return 4;
}
