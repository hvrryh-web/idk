/**
 * VN ↔ Combat Integration Bridge
 *
 * Provides the API for starting combat from VN scenes
 * and returning results back to the narrative.
 *
 * @module combat/integration/battleBridge
 */

import type {
  CombatState,
  CombatUnit,
  VictoryCondition,
  VictoryResult,
} from "../engine/combatState";
import {
  createInitialCombatState,
  createCombatUnit,
  type UnitCreationParams,
} from "../engine/combatState";
import { generateSeed } from "../engine/rng";
import type { CombatEvent } from "../engine/events";
import { CombatEvents } from "../engine/events";
import { combatReducer, eventsToLogEntries, type LogEntry } from "../engine/reducer";

// ============================================================================
// Types
// ============================================================================

export interface BattleOptions {
  /** Encounter ID for loading encounter data */
  encounterId: string;
  /** Player character unit params */
  partyParams: UnitCreationParams[];
  /** Enemy unit params (can be loaded from encounter data) */
  enemyParams?: UnitCreationParams[];
  /** RNG seed for determinism (auto-generated if not provided) */
  seed?: number;
  /** Use 3-Stage combat (default: true) */
  enable3Stage?: boolean;
  /** VN flags to pass through */
  vnFlags?: Record<string, unknown>;
  /** Victory conditions (default: eliminate enemies) */
  victoryConditions?: VictoryCondition[];
}

export interface BattleRewards {
  xp?: number;
  items?: string[];
  conditions?: Array<{ unitId: string; conditionName: string }>;
  trackMarks?: Array<{ unitId: string; track: string; amount: number }>;
}

export interface BattleResult {
  /** Combat outcome */
  result: "victory" | "defeat" | "escape" | "timeout";
  /** Victor team */
  victor: "player" | "enemy" | "draw";
  /** Rewards earned (if victory) */
  rewards: BattleRewards;
  /** Flags set during combat */
  flags: string[];
  /** Full event log for replay */
  log: CombatEvent[];
  /** Human-readable log entries */
  logEntries: LogEntry[];
  /** Final combat state snapshot */
  finalState: CombatState;
  /** Combat statistics */
  stats: BattleStats;
}

export interface BattleStats {
  rounds: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  unitsDefeated: number;
  criticalHits: number;
  misses: number;
}

export interface CombatCallbacks {
  onCombatStart?: (state: CombatState) => void;
  onRoundStart?: (round: number) => void;
  onTurnStart?: (unit: CombatUnit) => void;
  onEvent?: (event: CombatEvent) => void;
  onUnitDefeated?: (unit: CombatUnit) => void;
  onCombatEnd?: (result: BattleResult) => void;
  onScriptTrigger?: (trigger: string, data: unknown) => void;
}

// ============================================================================
// Battle Bridge Class
// ============================================================================

/**
 * Battle Bridge - Main integration point for VN ↔ Combat
 *
 * Usage:
 * ```typescript
 * const bridge = new BattleBridge();
 *
 * // Initialize combat
 * const state = bridge.initializeCombat({
 *   encounterId: 'duel_sect_elder',
 *   partyParams: [{ id: 'player', name: 'Wei Lin', team: 'player' }],
 *   enemyParams: [{ id: 'elder', name: 'Sect Elder', team: 'enemy', scl: 7 }],
 * });
 *
 * // Run combat loop (or hand off to UI)
 * // ...
 *
 * // Get results
 * const result = bridge.getResult();
 * ```
 */
export class BattleBridge {
  private state: CombatState | null = null;
  private events: CombatEvent[] = [];
  private callbacks: CombatCallbacks = {};
  private flags: string[] = [];
  private stats: BattleStats = {
    rounds: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    unitsDefeated: 0,
    criticalHits: 0,
    misses: 0,
  };

  /**
   * Initialize combat with given options
   */
  initializeCombat(options: BattleOptions): CombatState {
    const seed = options.seed ?? generateSeed();
    const encounterId = options.encounterId;

    // Create initial state
    this.state = createInitialCombatState(encounterId, seed);
    this.events = [];
    this.flags = [];
    this.stats = {
      rounds: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      unitsDefeated: 0,
      criticalHits: 0,
      misses: 0,
    };

    // Add party units
    for (const params of options.partyParams) {
      const unit = createCombatUnit({ ...params, team: "player" });
      this.state.units[unit.id] = unit;
      this.state.teams.player.unitIds.push(unit.id);
    }

    // Add enemy units
    if (options.enemyParams) {
      for (const params of options.enemyParams) {
        const unit = createCombatUnit({ ...params, team: "enemy" });
        this.state.units[unit.id] = unit;
        this.state.teams.enemy.unitIds.push(unit.id);
      }
    }

    // Set victory conditions
    if (options.victoryConditions) {
      this.state.victoryConditions = options.victoryConditions;
    }

    // Emit combat start event
    const startEvent = CombatEvents.combatStart(encounterId, seed);
    this.dispatchEvent(startEvent);

    // Notify callback
    this.callbacks.onCombatStart?.(this.state);

    return this.state;
  }

  /**
   * Set callbacks for combat events
   */
  setCallbacks(callbacks: CombatCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Get current combat state
   */
  getState(): CombatState | null {
    return this.state;
  }

  /**
   * Get full event log
   */
  getEventLog(): CombatEvent[] {
    return [...this.events];
  }

  /**
   * Dispatch an event (updates state and logs)
   */
  dispatchEvent(event: CombatEvent): CombatState {
    if (!this.state) {
      throw new Error("Combat not initialized");
    }

    // Update state via reducer
    this.state = combatReducer(this.state, event);

    // Log event
    this.events.push(event);

    // Update stats based on event
    this.updateStats(event);

    // Notify callback
    this.callbacks.onEvent?.(event);

    return this.state;
  }

  /**
   * Dispatch multiple events
   */
  dispatchEvents(events: CombatEvent[]): CombatState {
    for (const event of events) {
      this.dispatchEvent(event);
    }
    return this.state!;
  }

  /**
   * Check if combat has ended
   */
  isCombatEnded(): boolean {
    return this.state?.combatEnded ?? false;
  }

  /**
   * Check victory conditions and end combat if met
   */
  checkVictoryConditions(): VictoryResult | null {
    if (!this.state) return null;

    for (const condition of this.state.victoryConditions) {
      const result = this.evaluateVictoryCondition(condition);
      if (result) {
        // End combat
        const endEvent = CombatEvents.combatEnd(result);
        this.dispatchEvent(endEvent);
        return result;
      }
    }

    return null;
  }

  /**
   * Get combat result (after combat ends)
   */
  getResult(): BattleResult | null {
    if (!this.state || !this.state.combatEnded || !this.state.result) {
      return null;
    }

    const resultType =
      this.state.result.victor === "player"
        ? "victory"
        : this.state.result.victor === "enemy"
        ? "defeat"
        : "escape";

    // Handle victor type - neutral maps to draw for simplicity
    let victor: "player" | "enemy" | "draw";
    if (this.state.result.victor === "draw" || this.state.result.victor === "neutral") {
      victor = "draw";
    } else {
      victor = this.state.result.victor;
    }

    return {
      result: resultType,
      victor,
      rewards: this.calculateRewards(),
      flags: [...this.flags],
      log: [...this.events],
      logEntries: eventsToLogEntries(this.events),
      finalState: this.state,
      stats: { ...this.stats },
    };
  }

  /**
   * Set a flag during combat (for VN branching)
   */
  setFlag(flag: string): void {
    if (this.flags.indexOf(flag) === -1) {
      this.flags.push(flag);
    }
  }

  /**
   * Start a new round
   */
  startRound(roundNumber: number): void {
    if (!this.state) return;

    this.stats.rounds = roundNumber;
    const event = CombatEvents.roundStart(roundNumber);
    this.dispatchEvent(event);
    this.callbacks.onRoundStart?.(roundNumber);
  }

  /**
   * End the current round
   */
  endRound(): void {
    if (!this.state) return;

    const event = CombatEvents.roundEnd(this.state.round);
    this.dispatchEvent(event);
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private evaluateVictoryCondition(condition: VictoryCondition): VictoryResult | null {
    if (!this.state) return null;

    switch (condition.type) {
      case "eliminate": {
        const targetTeam = condition.targetTeam;
        const teamUnits: CombatUnit[] = [];
        for (const id in this.state.units) {
          const u = this.state.units[id];
          if (u.team === targetTeam && u.thp > 0) {
            teamUnits.push(u);
          }
        }

        if (teamUnits.length === 0) {
          // Target team eliminated
          const victor = targetTeam === "enemy" ? "player" : ("enemy" as const);
          return { victor, condition };
        }
        break;
      }

      case "survive": {
        if (this.state.round >= condition.rounds) {
          // Survived required rounds
          return { victor: "player", condition };
        }
        break;
      }

      case "defeat": {
        const target = this.state.units[condition.targetId];
        if (target && target.thp <= 0) {
          return { victor: "player", condition };
        }
        break;
      }

      case "protect": {
        const target = this.state.units[condition.targetId];
        if (target && target.thp <= 0) {
          // Failed to protect
          return { victor: "enemy", condition };
        }
        break;
      }
    }

    return null;
  }

  private updateStats(event: CombatEvent): void {
    switch (event.type) {
      case "THP_DAMAGE":
        const targetUnit = this.state?.units[event.targetId];
        if (targetUnit?.team === "enemy") {
          this.stats.totalDamageDealt += event.amount;
        } else {
          this.stats.totalDamageTaken += event.amount;
        }
        break;

      case "CRIT":
        this.stats.criticalHits++;
        break;

      case "MISS":
        this.stats.misses++;
        break;

      case "UNIT_DEFEATED":
        this.stats.unitsDefeated++;
        this.callbacks.onUnitDefeated?.(this.state?.units[event.unitId] as CombatUnit);
        break;
    }
  }

  private calculateRewards(): BattleRewards {
    // TODO: Calculate based on encounter data and performance
    return {
      xp: this.state?.result?.victor === "player" ? 100 * this.stats.rounds : 0,
    };
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Start a battle and return the bridge instance
 *
 * This is the main entry point for VN integration.
 */
export function startBattle(options: BattleOptions): BattleBridge {
  const bridge = new BattleBridge();
  bridge.initializeCombat(options);
  return bridge;
}

/**
 * Create a simple test encounter
 */
export function createTestEncounter(): BattleOptions {
  return {
    encounterId: "test_battle",
    partyParams: [
      {
        id: "player_1",
        name: "Wei Lin",
        team: "player",
        scl: 5,
        stats: {
          strength: 4,
          endurance: 3,
          agility: 5,
          willpower: 4,
        },
        violence: {
          attack: 10,
          defense: 15,
          resilience: 5,
          effectRank: 10,
        },
        techniqueIds: ["gu_fangs", "swarming_dissection"],
      },
    ],
    enemyParams: [
      {
        id: "enemy_1",
        name: "Sect Elder",
        team: "enemy",
        scl: 6,
        isBoss: true,
        stats: {
          strength: 5,
          endurance: 5,
          agility: 4,
          willpower: 6,
        },
        violence: {
          attack: 12,
          defense: 17,
          resilience: 6,
          effectRank: 12,
        },
        techniqueIds: ["sky_rending_palm"],
      },
    ],
    victoryConditions: [{ type: "eliminate", targetTeam: "enemy" }],
  };
}
