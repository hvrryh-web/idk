/**
 * Combat Event Types
 *
 * Defines all event types for the event-sourced combat engine.
 * Events are the only way to modify combat state.
 *
 * @module combat/engine/events
 */

import type {
  Action,
  CombatPhase,
  ConditionDegree,
  CostTrackType,
  StatusEffect,
  VictoryResult,
} from "./combatState";

// ============================================================================
// Damage Calculation Result
// ============================================================================

export interface DamageCalculation {
  baseDamage: number;
  attackBonus: number;
  defenseValue: number;
  effectRank: number;
  drTier: number;
  drReduction: number;
  guardAbsorbed: number;
  thpDamage: number;
  strainDamage: number;
}

// ============================================================================
// Combat Event Types
// ============================================================================

export type CombatEvent =
  // ============== Phase Events ==============
  | {
      type: "COMBAT_START";
      encounterId: string;
      seed: number;
      timestamp: number;
    }
  | {
      type: "COMBAT_END";
      result: VictoryResult;
      timestamp: number;
    }
  | {
      type: "ROUND_START";
      round: number;
      timestamp: number;
    }
  | {
      type: "ROUND_END";
      round: number;
      timestamp: number;
    }
  | {
      type: "PHASE_START";
      phase: CombatPhase;
      timestamp: number;
    }
  | {
      type: "PHASE_END";
      phase: CombatPhase;
      timestamp: number;
    }

  // ============== Turn Events ==============
  | {
      type: "TURN_START";
      unitId: string;
      timestamp: number;
    }
  | {
      type: "TURN_END";
      unitId: string;
      timestamp: number;
    }
  | {
      type: "ACTION_CHOSEN";
      action: Action;
      timestamp: number;
    }

  // ============== Resolution Events ==============
  | {
      type: "ATTACK_ROLL";
      attackerId: string;
      targetId: string;
      roll: number;
      total: number;
      defense: number;
      timestamp: number;
    }
  | {
      type: "HIT";
      attackerId: string;
      targetId: string;
      margin: number;
      isCrit: boolean;
      timestamp: number;
    }
  | {
      type: "MISS";
      attackerId: string;
      targetId: string;
      margin: number;
      timestamp: number;
    }
  | {
      type: "CRIT";
      attackerId: string;
      targetId: string;
      margin: number;
      timestamp: number;
    }

  // ============== Damage Events ==============
  | {
      type: "DAMAGE_CALCULATED";
      targetId: string;
      calculation: DamageCalculation;
      timestamp: number;
    }
  | {
      type: "GUARD_ABSORBED";
      targetId: string;
      amount: number;
      newValue: number;
      timestamp: number;
    }
  | {
      type: "THP_DAMAGE";
      targetId: string;
      amount: number;
      newValue: number;
      timestamp: number;
    }
  | {
      type: "THP_HEAL";
      targetId: string;
      amount: number;
      newValue: number;
      source: string;
      timestamp: number;
    }
  | {
      type: "STRAIN_DAMAGE";
      targetId: string;
      amount: number;
      newValue: number;
      timestamp: number;
    }

  // ============== Resource Events ==============
  | {
      type: "AE_SPENT";
      unitId: string;
      amount: number;
      newValue: number;
      timestamp: number;
    }
  | {
      type: "AE_REGENERATED";
      unitId: string;
      amount: number;
      newValue: number;
      timestamp: number;
    }
  | {
      type: "GUARD_GAINED";
      unitId: string;
      amount: number;
      newValue: number;
      timestamp: number;
    }
  | {
      type: "STRAIN_GAINED";
      unitId: string;
      amount: number;
      newValue: number;
      source: string;
      timestamp: number;
    }

  // ============== Condition Events ==============
  | {
      type: "CONDITION_APPLIED";
      targetId: string;
      condition: StatusEffect;
      timestamp: number;
    }
  | {
      type: "CONDITION_ADVANCED";
      targetId: string;
      conditionId: string;
      newDegree: ConditionDegree;
      timestamp: number;
    }
  | {
      type: "CONDITION_REMOVED";
      targetId: string;
      conditionId: string;
      timestamp: number;
    }

  // ============== Unit State Events ==============
  | {
      type: "UNIT_DEFEATED";
      unitId: string;
      cause: string;
      timestamp: number;
    }
  | {
      type: "UNIT_REVIVED";
      unitId: string;
      newThp: number;
      timestamp: number;
    }

  // ============== Meta-Currency Events ==============
  | {
      type: "FURY_GAINED";
      unitId: string;
      amount: number;
      newValue: number;
      source: string;
      timestamp: number;
    }
  | {
      type: "FURY_SPENT";
      unitId: string;
      amount: number;
      newValue: number;
      effect: string;
      timestamp: number;
    }
  | {
      type: "CLOUT_GAINED";
      unitId: string;
      amount: number;
      newValue: number;
      source: string;
      timestamp: number;
    }
  | {
      type: "CLOUT_SPENT";
      unitId: string;
      amount: number;
      newValue: number;
      effect: string;
      timestamp: number;
    }
  | {
      type: "INSIGHT_GAINED";
      unitId: string;
      amount: number;
      newValue: number;
      source: string;
      timestamp: number;
    }
  | {
      type: "INSIGHT_SPENT";
      unitId: string;
      amount: number;
      newValue: number;
      effect: string;
      timestamp: number;
    }

  // ============== Cost Track Events ==============
  | {
      type: "TRACK_MARKED";
      unitId: string;
      track: CostTrackType;
      source: string;
      newValue: number;
      timestamp: number;
    }
  | {
      type: "TRACK_CLEARED";
      unitId: string;
      track: CostTrackType;
      amount: number;
      newValue: number;
      timestamp: number;
    }

  // ============== Quick Action Events ==============
  | {
      type: "QUICK_ACTION_USED";
      actorId: string;
      actionType: string;
      targetId?: string;
      timestamp: number;
    }
  | {
      type: "MODIFIER_APPLIED";
      targetId: string;
      stat: string;
      value: number;
      duration: number;
      source: string;
      timestamp: number;
    }
  | {
      type: "MODIFIER_EXPIRED";
      targetId: string;
      stat: string;
      source: string;
      timestamp: number;
    };

// ============================================================================
// Event Creators (Helper Functions)
// ============================================================================

function now(): number {
  return Date.now();
}

export const CombatEvents = {
  combatStart: (encounterId: string, seed: number): CombatEvent => ({
    type: "COMBAT_START",
    encounterId,
    seed,
    timestamp: now(),
  }),

  combatEnd: (result: VictoryResult): CombatEvent => ({
    type: "COMBAT_END",
    result,
    timestamp: now(),
  }),

  roundStart: (round: number): CombatEvent => ({
    type: "ROUND_START",
    round,
    timestamp: now(),
  }),

  roundEnd: (round: number): CombatEvent => ({
    type: "ROUND_END",
    round,
    timestamp: now(),
  }),

  phaseStart: (phase: CombatPhase): CombatEvent => ({
    type: "PHASE_START",
    phase,
    timestamp: now(),
  }),

  phaseEnd: (phase: CombatPhase): CombatEvent => ({
    type: "PHASE_END",
    phase,
    timestamp: now(),
  }),

  turnStart: (unitId: string): CombatEvent => ({
    type: "TURN_START",
    unitId,
    timestamp: now(),
  }),

  turnEnd: (unitId: string): CombatEvent => ({
    type: "TURN_END",
    unitId,
    timestamp: now(),
  }),

  actionChosen: (action: Action): CombatEvent => ({
    type: "ACTION_CHOSEN",
    action,
    timestamp: now(),
  }),

  attackRoll: (
    attackerId: string,
    targetId: string,
    roll: number,
    total: number,
    defense: number
  ): CombatEvent => ({
    type: "ATTACK_ROLL",
    attackerId,
    targetId,
    roll,
    total,
    defense,
    timestamp: now(),
  }),

  hit: (
    attackerId: string,
    targetId: string,
    margin: number,
    isCrit: boolean
  ): CombatEvent => ({
    type: "HIT",
    attackerId,
    targetId,
    margin,
    isCrit,
    timestamp: now(),
  }),

  miss: (attackerId: string, targetId: string, margin: number): CombatEvent => ({
    type: "MISS",
    attackerId,
    targetId,
    margin,
    timestamp: now(),
  }),

  thpDamage: (targetId: string, amount: number, newValue: number): CombatEvent => ({
    type: "THP_DAMAGE",
    targetId,
    amount,
    newValue,
    timestamp: now(),
  }),

  thpHeal: (
    targetId: string,
    amount: number,
    newValue: number,
    source: string
  ): CombatEvent => ({
    type: "THP_HEAL",
    targetId,
    amount,
    newValue,
    source,
    timestamp: now(),
  }),

  aeSpent: (unitId: string, amount: number, newValue: number): CombatEvent => ({
    type: "AE_SPENT",
    unitId,
    amount,
    newValue,
    timestamp: now(),
  }),

  aeRegenerated: (unitId: string, amount: number, newValue: number): CombatEvent => ({
    type: "AE_REGENERATED",
    unitId,
    amount,
    newValue,
    timestamp: now(),
  }),

  guardGained: (unitId: string, amount: number, newValue: number): CombatEvent => ({
    type: "GUARD_GAINED",
    unitId,
    amount,
    newValue,
    timestamp: now(),
  }),

  guardAbsorbed: (targetId: string, amount: number, newValue: number): CombatEvent => ({
    type: "GUARD_ABSORBED",
    targetId,
    amount,
    newValue,
    timestamp: now(),
  }),

  strainGained: (
    unitId: string,
    amount: number,
    newValue: number,
    source: string
  ): CombatEvent => ({
    type: "STRAIN_GAINED",
    unitId,
    amount,
    newValue,
    source,
    timestamp: now(),
  }),

  unitDefeated: (unitId: string, cause: string): CombatEvent => ({
    type: "UNIT_DEFEATED",
    unitId,
    cause,
    timestamp: now(),
  }),

  furyGained: (
    unitId: string,
    amount: number,
    newValue: number,
    source: string
  ): CombatEvent => ({
    type: "FURY_GAINED",
    unitId,
    amount,
    newValue,
    source,
    timestamp: now(),
  }),

  conditionApplied: (targetId: string, condition: StatusEffect): CombatEvent => ({
    type: "CONDITION_APPLIED",
    targetId,
    condition,
    timestamp: now(),
  }),
};
