/**
 * Combat State Types and Interfaces
 *
 * Defines the core data structures for the combat engine state.
 * These types are used by the reducer, events, and UI components.
 *
 * @module combat/engine/combatState
 */

// ============================================================================
// Core Types
// ============================================================================

export type Team = "player" | "enemy" | "neutral";
export type CombatPhase = "Quick1" | "Major" | "Quick2";
export type SpdBand = "fast" | "normal" | "slow";
export type ConditionPillar = "violence" | "influence" | "revelation";
export type ConditionDegree = 1 | 2 | 3 | 4;
export type CostTrackType = "blood" | "fate" | "stain";

// ============================================================================
// Pillar Stats
// ============================================================================

export interface PillarStats {
  /** OVR - Offense Value Rating (to-hit) */
  attack: number;
  /** DVR - Defense Value Rating (to-be-hit) */
  defense: number;
  /** Resistance to effects */
  resilience: number;
  /** Effect magnitude */
  effectRank: number;
}

// ============================================================================
// Resolve Charges
// ============================================================================

export interface ResolveCharges {
  /** Physical Resolve Charges */
  prc: number;
  /** Mental Resolve Charges */
  mrc: number;
  /** Spiritual Resolve Charges */
  src: number;
}

// ============================================================================
// Cost Track
// ============================================================================

export interface CostTrack {
  current: number;
  maximum: number;
}

// ============================================================================
// Status Effects / Conditions
// ============================================================================

export interface StatusEffect {
  id: string;
  name: string;
  pillar: ConditionPillar;
  degree: ConditionDegree;
  duration: number | "permanent";
  source: string;
  effects: ConditionEffect[];
}

export interface ConditionEffect {
  type: "modifier" | "dot" | "hot" | "prevent" | "custom";
  stat?: string;
  value?: number;
  damage?: number;
  healing?: number;
}

// ============================================================================
// Combat Unit
// ============================================================================

export interface CombatUnit {
  // Identity
  id: string;
  name: string;
  team: Team;
  isPlayer: boolean;
  isBoss: boolean;
  bossRank?: 1 | 2 | 3 | 4 | 5;

  // Core Stats (per SRD)
  scl: number;
  cl: number;
  sl: number;

  // Primary Stats (9 stats)
  strength: number;
  endurance: number;
  agility: number;
  technique: number;
  willpower: number;
  focus: number;
  essence: number;
  resolve: number;
  presence: number;

  // Combat Resources
  thp: number;
  maxThp: number;
  ae: number;
  maxAe: number;
  aeRegen: number;
  strain: number;
  maxStrain: number;
  guard: number;

  // Combat Values (per pillar)
  violence: PillarStats;
  influence: PillarStats;
  revelation: PillarStats;

  // Derived
  spdBand: SpdBand;
  drTier: number;
  resolveCharges: ResolveCharges;

  // Equipment & Abilities
  techniqueIds: string[];
  conditionIds: string[];
  statusEffects: StatusEffect[];

  // Meta-Currencies
  fury: number;
  clout: number;
  insight: number;

  // Cost Tracks
  bloodTrack: CostTrack;
  fateTrack: CostTrack;
  stainTrack: CostTrack;
}

// ============================================================================
// Team State
// ============================================================================

export interface TeamState {
  unitIds: string[];
  isPlayerControlled: boolean;
  aiProfile?: string;
}

// ============================================================================
// Turn Order
// ============================================================================

export interface TurnOrder {
  round: number;
  phase: CombatPhase;
  activeUnitId: string | null;
  pendingUnits: string[];
  completedUnits: string[];
}

// ============================================================================
// Victory Conditions
// ============================================================================

export type VictoryCondition =
  | { type: "eliminate"; targetTeam: Team }
  | { type: "survive"; rounds: number }
  | { type: "defeat"; targetId: string }
  | { type: "protect"; targetId: string }
  | { type: "escape"; threshold: number };

export interface VictoryResult {
  victor: Team | "draw";
  condition: VictoryCondition;
}

// ============================================================================
// Actions
// ============================================================================

export type ActionType =
  | "attack"
  | "technique"
  | "defend"
  | "guard"
  | "item"
  | "wait"
  | "quick";

export type QuickActionType =
  | "strike"
  | "block"
  | "pressure"
  | "weaken"
  | "empower"
  | "shield"
  | "reposition";

export interface Action {
  type: ActionType;
  actorId: string;
  targetId?: string;
  targetIds?: string[];
  techniqueId?: string;
  itemId?: string;
  quickActionType?: QuickActionType;
}

// ============================================================================
// RNG State (for serialization)
// ============================================================================

export interface RNGState {
  seed: number;
  currentState: number;
}

// ============================================================================
// Main Combat State
// ============================================================================

export interface CombatState {
  encounterId: string;
  seed: number;
  rngState: RNGState;
  round: number;
  phase: CombatPhase;
  turnOrder: TurnOrder;
  units: Record<string, CombatUnit>;
  teams: Record<Team, TeamState>;
  victoryConditions: VictoryCondition[];
  result: VictoryResult | null;
  isPlayerTurn: boolean;
  combatEnded: boolean;
}

// ============================================================================
// Initial State Factory
// ============================================================================

export function createInitialCombatState(
  encounterId: string,
  seed: number
): CombatState {
  return {
    encounterId,
    seed,
    rngState: { seed, currentState: seed },
    round: 0,
    phase: "Quick1",
    turnOrder: {
      round: 0,
      phase: "Quick1",
      activeUnitId: null,
      pendingUnits: [],
      completedUnits: [],
    },
    units: {},
    teams: {
      player: { unitIds: [], isPlayerControlled: true },
      enemy: { unitIds: [], isPlayerControlled: false },
      neutral: { unitIds: [], isPlayerControlled: false },
    },
    victoryConditions: [{ type: "eliminate", targetTeam: "enemy" }],
    result: null,
    isPlayerTurn: false,
    combatEnded: false,
  };
}

// ============================================================================
// Unit Factory
// ============================================================================

export interface UnitCreationParams {
  id: string;
  name: string;
  team: Team;
  isPlayer?: boolean;
  isBoss?: boolean;
  scl?: number;
  stats?: Partial<{
    strength: number;
    endurance: number;
    agility: number;
    technique: number;
    willpower: number;
    focus: number;
    essence: number;
    resolve: number;
    presence: number;
  }>;
  violence?: Partial<PillarStats>;
  influence?: Partial<PillarStats>;
  revelation?: Partial<PillarStats>;
  techniqueIds?: string[];
}

export function createCombatUnit(params: UnitCreationParams): CombatUnit {
  const scl = params.scl ?? 5;
  const stats = {
    strength: params.stats?.strength ?? 3,
    endurance: params.stats?.endurance ?? 3,
    agility: params.stats?.agility ?? 3,
    technique: params.stats?.technique ?? 3,
    willpower: params.stats?.willpower ?? 3,
    focus: params.stats?.focus ?? 3,
    essence: params.stats?.essence ?? 3,
    resolve: params.stats?.resolve ?? 3,
    presence: params.stats?.presence ?? 3,
  };

  // Calculate derived values per SRD formulas
  const maxThp = 10 + stats.endurance * 5;
  const maxAe = 10 + stats.willpower * 2;
  const aeRegen = 1 + Math.floor(stats.willpower / 3);
  const maxStrain = stats.endurance * 10;

  // SPD band from agility
  let spdBand: SpdBand = "normal";
  if (stats.agility >= 6) spdBand = "fast";
  else if (stats.agility <= 1) spdBand = "slow";

  // Calculate CL and SL (simplified)
  const bodyCore = Math.round((stats.strength + stats.endurance + stats.agility) / 3);
  const mindCore = Math.round((stats.technique + stats.willpower + stats.focus) / 3);
  const soulCore = Math.round((stats.essence + stats.resolve + stats.presence) / 3);
  const cl = Math.floor((bodyCore + mindCore + soulCore) / 3);

  // Default pillar stats based on SCL
  const defaultPillar: PillarStats = {
    attack: Math.floor(scl * 2),
    defense: 10 + scl,
    resilience: scl,
    effectRank: Math.floor(scl * 2),
  };

  // Resolve charges based on endurance/willpower/resolve
  const resolveCharges: ResolveCharges = {
    prc: Math.floor(stats.endurance / 2) + (scl >= 5 ? 1 : 0),
    mrc: Math.floor(stats.willpower / 2) + (scl >= 5 ? 1 : 0),
    src: Math.floor(stats.resolve / 2) + (scl >= 5 ? 1 : 0),
  };

  // Cost track boxes: 5 + floor(SCL/2)
  const trackMax = 5 + Math.floor(scl / 2);

  return {
    id: params.id,
    name: params.name,
    team: params.team,
    isPlayer: params.isPlayer ?? params.team === "player",
    isBoss: params.isBoss ?? false,

    scl,
    cl,
    sl: 0,

    ...stats,

    thp: maxThp,
    maxThp,
    ae: maxAe,
    maxAe,
    aeRegen,
    strain: 0,
    maxStrain,
    guard: 0,

    violence: { ...defaultPillar, ...params.violence },
    influence: { ...defaultPillar, ...params.influence },
    revelation: { ...defaultPillar, ...params.revelation },

    spdBand,
    drTier: 0,
    resolveCharges,

    techniqueIds: params.techniqueIds ?? [],
    conditionIds: [],
    statusEffects: [],

    fury: 0,
    clout: 0,
    insight: 0,

    bloodTrack: { current: 0, maximum: trackMax },
    fateTrack: { current: 0, maximum: trackMax },
    stainTrack: { current: 0, maximum: trackMax },
  };
}
