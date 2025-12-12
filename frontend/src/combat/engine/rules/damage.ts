/**
 * Damage Calculation Rules
 *
 * Implements damage calculation including DR, Guard, and damage routing.
 *
 * @module combat/engine/rules/damage
 */

import type { SeededRNG } from "../rng";
import type { CombatUnit } from "../combatState";
import type { HitResult } from "./hit";

// ============================================================================
// Damage Result Types
// ============================================================================

export interface DamageCalculation {
  /** Base damage before any reductions */
  baseDamage: number;
  /** DR tier used for reduction */
  drTier: number;
  /** DR reduction percentage (0.0 - 0.6+) */
  drReduction: number;
  /** Damage reduced by DR */
  drReduced: number;
  /** Damage after DR */
  postDrDamage: number;
  /** Damage absorbed by Guard */
  guardAbsorbed: number;
  /** New Guard value after absorption */
  newGuard: number;
  /** Final damage to THP */
  thpDamage: number;
  /** New THP value after damage */
  newThp: number;
  /** Strain damage (if strain-routed) */
  strainDamage: number;
  /** New Strain value after damage */
  newStrain: number;
  /** Whether this damage defeats the unit */
  isLethal: boolean;
  /** Resolve charges depleted */
  chargesDepleted: number;
  /** Crit multiplier applied */
  critMultiplier: number;
}

// ============================================================================
// DR Tier Table
// ============================================================================

const DR_TIERS: Record<number, number> = {
  0: 0.0,
  1: 0.1,
  2: 0.2,
  3: 0.3,
  4: 0.4,
  5: 0.5,
  6: 0.6,
};

/**
 * Get DR reduction percentage from tier
 */
export function getDRReduction(tier: number): number {
  if (tier <= 0) return 0;
  if (tier >= 6) return 0.6;
  return DR_TIERS[tier] ?? 0;
}

// ============================================================================
// Damage Calculation
// ============================================================================

export interface DamageParams {
  /** Base damage value */
  baseDamage: number;
  /** Defender unit */
  defender: CombatUnit;
  /** Whether attack was a crit */
  isCrit?: boolean;
  /** Whether damage is strain-routed (bypasses DR/Guard) */
  strainRouted?: boolean;
  /** Whether damage is guard-routed (bypasses DR) */
  guardRouted?: boolean;
}

/**
 * Calculate damage from an attack
 *
 * Implements the full damage pipeline:
 * 1. Apply crit multiplier (if crit)
 * 2. Check resolve charges for DR
 * 3. Apply DR reduction (if charges remain)
 * 4. Route through Guard first
 * 5. Overflow to THP
 * 6. Deplete resolve charges
 */
export function calculateDamage(params: DamageParams): DamageCalculation {
  const { defender, isCrit = false, strainRouted = false, guardRouted = false } = params;
  let baseDamage = params.baseDamage;

  // Crit multiplier (1.5x damage)
  const critMultiplier = isCrit ? 1.5 : 1.0;
  baseDamage = Math.floor(baseDamage * critMultiplier);

  // Strain-routed damage bypasses DR and Guard
  if (strainRouted) {
    const strainDamage = baseDamage;
    const newStrain = defender.strain + strainDamage;
    const isLethal = newStrain >= defender.maxStrain;

    return {
      baseDamage,
      drTier: 0,
      drReduction: 0,
      drReduced: 0,
      postDrDamage: 0,
      guardAbsorbed: 0,
      newGuard: defender.guard,
      thpDamage: 0,
      newThp: defender.thp,
      strainDamage,
      newStrain: Math.min(newStrain, defender.maxStrain),
      isLethal,
      chargesDepleted: 0,
      critMultiplier,
    };
  }

  // Check if DR applies (requires resolve charges)
  const hasResolveCharges = defender.resolveCharges.prc > 0;
  const drTier = hasResolveCharges ? defender.drTier : 0;
  const drReduction = guardRouted ? 0 : getDRReduction(drTier);

  // Calculate damage after DR
  const drReduced = Math.floor(baseDamage * drReduction);
  const postDrDamage = baseDamage - drReduced;

  // Route through Guard first (unless strain-routed)
  const guardAbsorbed = Math.min(defender.guard, postDrDamage);
  const overflowDamage = postDrDamage - guardAbsorbed;
  const newGuard = defender.guard - guardAbsorbed;

  // Apply overflow to THP
  const thpDamage = overflowDamage;
  const newThp = Math.max(0, defender.thp - thpDamage);
  const isLethal = newThp <= 0;

  // Deplete resolve charges based on raw damage (before DR)
  const chargesDepleted = Math.min(defender.resolveCharges.prc, baseDamage);

  return {
    baseDamage,
    drTier,
    drReduction,
    drReduced,
    postDrDamage,
    guardAbsorbed,
    newGuard,
    thpDamage,
    newThp,
    strainDamage: 0,
    newStrain: defender.strain,
    isLethal,
    chargesDepleted,
    critMultiplier,
  };
}

// ============================================================================
// Basic Attack Damage
// ============================================================================

/**
 * Calculate basic attack damage (Strike quick action)
 *
 * Basic attack: 1d6 + STR or AGI
 */
export function calculateBasicAttackDamage(
  rng: SeededRNG,
  attacker: CombatUnit,
  useAgility: boolean = false
): number {
  const statBonus = useAgility ? attacker.agility : attacker.strength;
  const dieRoll = rng.d6();
  return dieRoll + statBonus;
}

// ============================================================================
// Technique Damage
// ============================================================================

export interface Technique {
  id: string;
  name: string;
  baseDamage: number;
  aeCost: number;
  selfStrain?: number;
  strainRouted?: boolean;
  guardRouted?: boolean;
  effectRank?: number;
  pillar?: "violence" | "influence" | "revelation";
}

/**
 * Calculate technique damage
 *
 * Technique damage = base damage + STR/relevant stat
 */
export function calculateTechniqueDamage(
  attacker: CombatUnit,
  technique: Technique
): number {
  // Add STR for violence, or relevant stat for other pillars
  const statBonus = technique.pillar === "violence" ? attacker.strength : 0;
  return technique.baseDamage + statBonus;
}

// ============================================================================
// Full Attack Resolution
// ============================================================================

export interface AttackResult {
  hitResult: HitResult;
  damageResult: DamageCalculation | null;
  aeCost: number;
  selfStrain: number;
}

/**
 * Resolve a full attack (hit check + damage calculation)
 */
export function resolveAttack(
  rng: SeededRNG,
  attacker: CombatUnit,
  defender: CombatUnit,
  hitResult: HitResult,
  technique?: Technique
): AttackResult {
  // Miss = no damage
  if (hitResult.outcome === "miss") {
    return {
      hitResult,
      damageResult: null,
      aeCost: technique?.aeCost ?? 0,
      selfStrain: technique?.selfStrain ?? 0,
    };
  }

  // Calculate damage
  const baseDamage = technique
    ? calculateTechniqueDamage(attacker, technique)
    : calculateBasicAttackDamage(rng, attacker);

  const damageResult = calculateDamage({
    baseDamage,
    defender,
    isCrit: hitResult.outcome === "crit",
    strainRouted: technique?.strainRouted,
    guardRouted: technique?.guardRouted,
  });

  return {
    hitResult,
    damageResult,
    aeCost: technique?.aeCost ?? 0,
    selfStrain: technique?.selfStrain ?? 0,
  };
}

// ============================================================================
// Damage Estimation (for forecasting)
// ============================================================================

export interface DamageEstimate {
  min: number;
  max: number;
  avg: number;
}

/**
 * Estimate damage range for UI forecasting
 *
 * @param attacker - Attacking unit
 * @param defender - Defending unit
 * @param technique - Technique being used (optional for basic attack)
 */
export function estimateDamage(
  attacker: CombatUnit,
  defender: CombatUnit,
  technique?: Technique
): DamageEstimate {
  // Calculate base damage range
  let minBase: number;
  let maxBase: number;

  if (technique) {
    const statBonus = attacker.strength;
    minBase = technique.baseDamage + statBonus;
    maxBase = technique.baseDamage + statBonus;
  } else {
    // Basic attack: 1d6 + STR
    const statBonus = attacker.strength;
    minBase = 1 + statBonus;
    maxBase = 6 + statBonus;
  }

  // Apply DR if defender has resolve charges
  const hasCharges = defender.resolveCharges.prc > 0;
  const drReduction = hasCharges ? getDRReduction(defender.drTier) : 0;

  const minAfterDR = Math.floor(minBase * (1 - drReduction));
  const maxAfterDR = Math.floor(maxBase * (1 - drReduction));

  // Account for Guard absorption
  const minFinal = Math.max(0, minAfterDR - defender.guard);
  const maxFinal = Math.max(0, maxAfterDR - defender.guard);

  return {
    min: minFinal,
    max: maxFinal,
    avg: Math.floor((minFinal + maxFinal) / 2),
  };
}

// ============================================================================
// Guard Gain
// ============================================================================

/**
 * Calculate Guard gained from Block action
 *
 * Guard = Endurance × 2
 */
export function calculateBlockGuard(unit: CombatUnit): number {
  return unit.endurance * 2;
}
