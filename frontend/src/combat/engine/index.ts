/**
 * Combat Engine
 *
 * Main exports for the turn-based combat engine.
 *
 * @module combat/engine
 */

// Core state types
export * from "./combatState";

// Event types and creators
export { type CombatEvent, CombatEvents } from "./events";

// State reducer
export * from "./reducer";

// Seeded RNG
export * from "./rng";

// Rules modules
export * from "./rules/bonus";
export * from "./rules/hit";
export { 
  type DamageCalculation, 
  type DamageParams, 
  type DamageEstimate,
  type AttackResult,
  type Technique,
  calculateDamage,
  calculateBasicAttackDamage,
  calculateTechniqueDamage,
  resolveAttack,
  estimateDamage,
  calculateBlockGuard,
  getDRReduction
} from "./rules/damage";
export * from "./rules/conditions";
