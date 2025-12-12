/**
 * Combat State Reducer
 *
 * Implements reducer-style state transitions for the combat engine.
 * All state changes go through this reducer via events.
 *
 * @module combat/engine/reducer
 */

import type {
  CombatState,
  CombatUnit,
  CombatPhase,
} from "./combatState";
import type { CombatEvent } from "./events";

// ============================================================================
// Event Log Entry
// ============================================================================

export interface LogEntry {
  timestamp: number;
  actor: string;
  action: string;
  target?: string;
  result: string;
  damage?: number;
  conditions?: string[];
}

// ============================================================================
// Combat Reducer
// ============================================================================

export type CombatReducer = (state: CombatState, event: CombatEvent) => CombatState;

/**
 * Main combat state reducer
 *
 * Processes combat events and returns new state.
 * State is immutable - always returns a new state object.
 */
export const combatReducer: CombatReducer = (state, event): CombatState => {
  switch (event.type) {
    // ============== Phase Events ==============

    case "COMBAT_START":
      return {
        ...state,
        encounterId: event.encounterId,
        seed: event.seed,
        rngState: { seed: event.seed, currentState: event.seed },
        round: 0,
        phase: "Quick1",
        combatEnded: false,
        result: null,
      };

    case "COMBAT_END":
      return {
        ...state,
        result: event.result,
        combatEnded: true,
      };

    case "ROUND_START":
      return {
        ...state,
        round: event.round,
        phase: "Quick1",
        turnOrder: {
          ...state.turnOrder,
          round: event.round,
          phase: "Quick1",
          completedUnits: [],
          pendingUnits: getPhaseUnits(state, "Quick1"),
        },
      };

    case "ROUND_END":
      // Regenerate AE for all units
      const updatedUnits: Record<string, CombatUnit> = {};
      for (const id in state.units) {
        const unit = state.units[id];
        updatedUnits[id] = {
          ...unit,
          ae: Math.min(unit.ae + unit.aeRegen, unit.maxAe),
        };
      }
      return {
        ...state,
        units: updatedUnits,
      };

    case "PHASE_START":
      return {
        ...state,
        phase: event.phase,
        turnOrder: {
          ...state.turnOrder,
          phase: event.phase,
          completedUnits: [],
          pendingUnits: getPhaseUnits(state, event.phase),
          activeUnitId: null,
        },
      };

    case "PHASE_END":
      return {
        ...state,
        turnOrder: {
          ...state.turnOrder,
          activeUnitId: null,
        },
      };

    // ============== Turn Events ==============

    case "TURN_START":
      return {
        ...state,
        turnOrder: {
          ...state.turnOrder,
          activeUnitId: event.unitId,
          pendingUnits: state.turnOrder.pendingUnits.filter((id) => id !== event.unitId),
        },
        isPlayerTurn: state.units[event.unitId]?.isPlayer ?? false,
      };

    case "TURN_END":
      return {
        ...state,
        turnOrder: {
          ...state.turnOrder,
          activeUnitId: null,
          completedUnits: [...state.turnOrder.completedUnits, event.unitId],
        },
        isPlayerTurn: false,
      };

    // ============== Resource Events ==============

    case "THP_DAMAGE":
      return updateUnit(state, event.targetId, {
        thp: event.newValue,
      });

    case "THP_HEAL":
      return updateUnit(state, event.targetId, {
        thp: Math.min(event.newValue, state.units[event.targetId]?.maxThp ?? event.newValue),
      });

    case "AE_SPENT":
      return updateUnit(state, event.unitId, {
        ae: event.newValue,
      });

    case "AE_REGENERATED":
      return updateUnit(state, event.unitId, {
        ae: Math.min(event.newValue, state.units[event.unitId]?.maxAe ?? event.newValue),
      });

    case "GUARD_GAINED":
      return updateUnit(state, event.unitId, {
        guard: event.newValue,
      });

    case "GUARD_ABSORBED":
      return updateUnit(state, event.targetId, {
        guard: event.newValue,
      });

    case "STRAIN_DAMAGE":
    case "STRAIN_GAINED":
      return updateUnit(state, event.type === "STRAIN_DAMAGE" ? event.targetId : event.unitId, {
        strain: event.newValue,
      });

    // ============== Meta-Currency Events ==============

    case "FURY_GAINED":
      return updateUnit(state, event.unitId, {
        fury: Math.min(event.newValue, 10),
      });

    case "FURY_SPENT":
      return updateUnit(state, event.unitId, {
        fury: Math.max(event.newValue, 0),
      });

    case "CLOUT_GAINED":
      return updateUnit(state, event.unitId, {
        clout: Math.min(event.newValue, 10),
      });

    case "CLOUT_SPENT":
      return updateUnit(state, event.unitId, {
        clout: Math.max(event.newValue, 0),
      });

    case "INSIGHT_GAINED":
      return updateUnit(state, event.unitId, {
        insight: Math.min(event.newValue, 10),
      });

    case "INSIGHT_SPENT":
      return updateUnit(state, event.unitId, {
        insight: Math.max(event.newValue, 0),
      });

    // ============== Cost Track Events ==============

    case "TRACK_MARKED": {
      const unit = state.units[event.unitId];
      if (!unit) return state;

      const trackKey = `${event.track}Track` as "bloodTrack" | "fateTrack" | "stainTrack";
      return updateUnit(state, event.unitId, {
        [trackKey]: {
          ...unit[trackKey],
          current: event.newValue,
        },
      });
    }

    case "TRACK_CLEARED": {
      const unit = state.units[event.unitId];
      if (!unit) return state;

      const trackKey = `${event.track}Track` as "bloodTrack" | "fateTrack" | "stainTrack";
      return updateUnit(state, event.unitId, {
        [trackKey]: {
          ...unit[trackKey],
          current: Math.max(0, event.newValue),
        },
      });
    }

    // ============== Condition Events ==============

    case "CONDITION_APPLIED": {
      const unit = state.units[event.targetId];
      if (!unit) return state;

      return updateUnit(state, event.targetId, {
        statusEffects: [...unit.statusEffects, event.condition],
        conditionIds: [...unit.conditionIds, event.condition.id],
      });
    }

    case "CONDITION_ADVANCED": {
      const unit = state.units[event.targetId];
      if (!unit) return state;

      return updateUnit(state, event.targetId, {
        statusEffects: unit.statusEffects.map((effect) =>
          effect.id === event.conditionId
            ? { ...effect, degree: event.newDegree }
            : effect
        ),
      });
    }

    case "CONDITION_REMOVED": {
      const unit = state.units[event.targetId];
      if (!unit) return state;

      return updateUnit(state, event.targetId, {
        statusEffects: unit.statusEffects.filter((e) => e.id !== event.conditionId),
        conditionIds: unit.conditionIds.filter((id) => id !== event.conditionId),
      });
    }

    // ============== Unit State Events ==============

    case "UNIT_DEFEATED":
      return updateUnit(state, event.unitId, {
        thp: 0,
      });

    case "UNIT_REVIVED":
      return updateUnit(state, event.unitId, {
        thp: event.newThp,
      });

    // ============== Default (no-op for unhandled events) ==============

    default:
      return state;
  }
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Update a single unit in the state
 */
function updateUnit(
  state: CombatState,
  unitId: string,
  updates: Partial<CombatUnit>
): CombatState {
  const unit = state.units[unitId];
  if (!unit) return state;

  return {
    ...state,
    units: {
      ...state.units,
      [unitId]: {
        ...unit,
        ...updates,
      },
    },
  };
}

/**
 * Get units that act in a given phase based on SPD band
 */
function getPhaseUnits(state: CombatState, phase: CombatPhase): string[] {
  const allUnits: CombatUnit[] = [];
  for (const id in state.units) {
    const u = state.units[id];
    if (u.thp > 0) {
      allUnits.push(u);
    }
  }

  switch (phase) {
    case "Quick1":
      // Fast SPD units get Quick Action in Stage 1
      return allUnits.filter((u) => u.spdBand === "fast").map((u) => u.id);

    case "Major":
      // All living units get Major Action
      return allUnits.map((u) => u.id);

    case "Quick2":
      // Slow SPD units get Quick Action in Stage 3
      return allUnits.filter((u) => u.spdBand === "slow").map((u) => u.id);

    default:
      return [];
  }
}

// ============================================================================
// Replay Functions
// ============================================================================

/**
 * Replay combat from initial state through all events
 */
export function replayCombat(
  initialState: CombatState,
  events: CombatEvent[]
): CombatState {
  return events.reduce(combatReducer, initialState);
}

/**
 * Replay combat up to a specific event index
 */
export function replayToEvent(
  initialState: CombatState,
  events: CombatEvent[],
  targetIndex: number
): CombatState {
  return events.slice(0, targetIndex + 1).reduce(combatReducer, initialState);
}

/**
 * Convert combat events to human-readable log entries
 */
export function eventsToLogEntries(events: CombatEvent[]): LogEntry[] {
  const entries: LogEntry[] = [];

  for (const event of events) {
    switch (event.type) {
      case "ROUND_START":
        entries.push({
          timestamp: event.timestamp,
          actor: "System",
          action: `Round ${event.round} begins`,
          result: "",
        });
        break;

      case "HIT":
        entries.push({
          timestamp: event.timestamp,
          actor: event.attackerId,
          action: "attacks",
          target: event.targetId,
          result: event.isCrit ? "Critical Hit!" : "Hit!",
        });
        break;

      case "MISS":
        entries.push({
          timestamp: event.timestamp,
          actor: event.attackerId,
          action: "attacks",
          target: event.targetId,
          result: "Miss",
        });
        break;

      case "THP_DAMAGE":
        entries.push({
          timestamp: event.timestamp,
          actor: event.targetId,
          action: "takes damage",
          result: `${event.amount} damage (${event.newValue} THP remaining)`,
          damage: event.amount,
        });
        break;

      case "UNIT_DEFEATED":
        entries.push({
          timestamp: event.timestamp,
          actor: event.unitId,
          action: "is defeated",
          result: event.cause,
        });
        break;

      case "COMBAT_END":
        entries.push({
          timestamp: event.timestamp,
          actor: "System",
          action: "Combat ended",
          result: `${event.result.victor} wins by ${event.result.condition.type}`,
        });
        break;
    }
  }

  return entries;
}
