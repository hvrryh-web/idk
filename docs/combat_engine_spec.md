# Combat Engine Specification

**Version**: 1.0.0 (Draft)  
**Date**: 2025-12-12  
**Status**: Draft Specification  
**Related**: ADR-0003 (Bonus Composition), SRD Alpha v0.3

---

## Table of Contents

1. [Overview](#1-overview)
2. [Core Gameplay Model](#2-core-gameplay-model)
3. [Event Log Architecture](#3-event-log-architecture)
4. [Data-Driven Definitions](#4-data-driven-definitions)
5. [VN ↔ Combat Integration Contract](#5-vn--combat-integration-contract)
6. [Combat Resolution Flow](#6-combat-resolution-flow)
7. [Implementation Notes](#7-implementation-notes)

---

## 1. Overview

### Purpose

This specification defines a **turn-based combat engine** suitable for VN "tactics moments" - short encounters, boss duels, and scripted fights that integrate with the Visual Novel narrative system.

### Design Goals

1. **Deterministic**: Seeded RNG for reproducibility and testing
2. **Event-sourced**: Reducer-style state transitions enable replay and debugging
3. **Data-driven**: Units, skills, and encounters defined in JSON
4. **Static-web compatible**: No server required; runs entirely in browser
5. **VN-integrated**: Clean handoff between narrative and combat modes

### Key Decisions (per ADR-0003)

- **Opposed-first resolution**: ActorTotal vs OppTotal with DoS bands
- **Status quo rule**: Ties (DoS = 0) preserve prior state
- **Bonus composition**: `Bonus = PillarTrait + SkillBonus + EdgeBonus + SituationalMods`
- **Check type mapping**: Attack/Defense/Resilience per contest type

---

## 2. Core Gameplay Model

### 2.1 Units

Each combatant has the following attributes:

```typescript
interface CombatUnit {
  // Identity
  id: string;
  name: string;
  team: 'player' | 'enemy' | 'neutral';
  isPlayer: boolean;
  isBoss: boolean;
  bossRank?: 1 | 2 | 3 | 4 | 5;
  
  // Core Stats (per SRD)
  scl: number;              // Soul Core Level (balance cap)
  cl: number;               // Core Level (material refinement)
  sl: number;               // Soul Level (spiritual awakening)
  
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
  thp: number;              // Total Hit Points (current)
  maxThp: number;           // Maximum THP
  ae: number;               // Action Energy (current)
  maxAe: number;            // Maximum AE
  aeRegen: number;          // AE regeneration per round
  strain: number;           // Current strain
  maxStrain: number;        // Maximum strain (death at max)
  guard: number;            // Temporary damage absorption
  
  // Combat Values (per pillar)
  violence: PillarStats;
  influence: PillarStats;
  revelation: PillarStats;
  
  // Derived
  spdBand: 'fast' | 'normal' | 'slow';
  drTier: number;           // Damage Reduction tier (0-6+)
  resolveCharges: ResolveCharges;
  
  // Equipment & Abilities
  techniqueIds: string[];
  conditionIds: string[];   // Active conditions
  statusEffects: StatusEffect[];
  
  // Meta-Currencies
  fury: number;             // Violence resource (resets per encounter)
  clout: number;            // Influence resource (persists)
  insight: number;          // Revelation resource (persists)
  
  // Cost Tracks
  bloodTrack: CostTrack;
  fateTrack: CostTrack;
  stainTrack: CostTrack;
}

interface PillarStats {
  attack: number;           // OVR (Offense Value Rating)
  defense: number;          // DVR (Defense Value Rating)
  resilience: number;       // Resistance to effects
  effectRank: number;       // Effect magnitude
}

interface ResolveCharges {
  prc: number;              // Physical Resolve Charges
  mrc: number;              // Mental Resolve Charges
  src: number;              // Spiritual Resolve Charges
}

interface CostTrack {
  current: number;
  maximum: number;
}
```

### 2.2 Teams

```typescript
type Team = 'player' | 'enemy' | 'neutral';

interface TeamState {
  units: string[];          // Unit IDs
  isPlayerControlled: boolean;
  aiProfile?: AIProfile;
}
```

**Initial MVP**: Player vs Enemy (2 teams)  
**Future**: Neutral third party support

### 2.3 Actions

#### Action Types (MVP)

```typescript
type ActionType = 
  | 'attack'      // Basic strike (no AE cost)
  | 'technique'   // Use a technique (costs AE)
  | 'defend'      // Full defense (+2 all defenses)
  | 'guard'       // Block quick action (gain Guard)
  | 'item'        // Use item (stub for MVP)
  | 'wait'        // End turn early
  | 'quick';      // Quick action (Stage 1/3)

interface Action {
  type: ActionType;
  actorId: string;
  targetId?: string;
  targetIds?: string[];     // Multi-target
  techniqueId?: string;
  itemId?: string;
  quickActionType?: QuickActionType;
}
```

#### Quick Actions (7 Types per SRD)

```typescript
type QuickActionType = 
  | 'strike'      // Basic attack (1d6 + STR/AGI)
  | 'block'       // Gain Guard, +1 Strain
  | 'pressure'    // Enemy -2 attack
  | 'weaken'      // Enemy -2 defense
  | 'empower'     // Ally +2 attack
  | 'shield'      // Ally +2 defense
  | 'reposition'; // Move, change stance
```

### 2.4 Turn System

**Chosen**: 3-Stage Combat (Speed-based initiative)

```typescript
type CombatPhase = 'Quick1' | 'Major' | 'Quick2';

interface TurnOrder {
  round: number;
  phase: CombatPhase;
  activeUnitId: string | null;
  pendingUnits: string[];   // Units yet to act this phase
  completedUnits: string[]; // Units that have acted
}
```

**Phase Flow**:
1. **Stage 1 (Quick1)**: Fast SPD units take Quick Actions
2. **Stage 2 (Major)**: All units take Major Actions
3. **Stage 3 (Quick2)**: Slow SPD units take Quick Actions

**SPD Band Determination**:
```typescript
function getSpdBand(unit: CombatUnit): 'fast' | 'normal' | 'slow' {
  const spd = unit.agility; // Base SPD from agility
  if (spd >= 6) return 'fast';
  if (spd <= 1) return 'slow';
  return 'normal';
}
```

### 2.5 Damage Formula

Per ADR-0003 and SRD:

```typescript
interface DamageCalculation {
  baseDamage: number;       // Technique or attack damage
  attackBonus: number;      // OVR + modifiers
  defenseValue: number;     // Target's DVR
  effectRank: number;       // Effect magnitude
  drTier: number;           // Target's DR tier (0-6)
  drReduction: number;      // Percentage reduction (0.0-0.6+)
  guardAbsorbed: number;    // Damage absorbed by Guard
  thpDamage: number;        // Final THP damage
  strainDamage: number;     // Strain-routed damage (if any)
}
```

**Damage Resolution**:
```typescript
function calculateDamage(
  attacker: CombatUnit,
  defender: CombatUnit,
  technique: Technique | null,
  rng: SeededRNG
): DamageCalculation {
  // 1. Calculate attack total (per ADR-0003)
  const attackBonus = calculateBonus({
    pillarTrait: attacker.violence.attack,
    skillBonus: technique?.skillBonus ?? 0,
    edgeBonus: getEdgeBonus(attacker),
    situationalMods: getSituationalMods(attacker, defender)
  });
  
  // 2. Roll attack (d20 + attackBonus vs. defender DVR)
  const attackRoll = rng.d20();
  const attackTotal = attackRoll + attackBonus;
  const defenseValue = defender.violence.defense;
  
  // 3. Check hit
  const isHit = attackTotal >= defenseValue;
  const isNat20 = attackRoll === 20;
  const isNat1 = attackRoll === 1;
  
  if (isNat1 || (!isNat20 && !isHit)) {
    return missResult();
  }
  
  // 4. Calculate base damage
  const baseDamage = technique 
    ? technique.baseDamage + attacker.strength
    : rng.d6() + attacker.strength; // Basic attack
  
  // 5. Apply DR if defender has resolve charges
  const drReduction = defender.resolveCharges.prc > 0 
    ? getDRReduction(defender.drTier) 
    : 0;
  
  const reducedDamage = Math.floor(baseDamage * (1 - drReduction));
  
  // 6. Route through Guard first
  const guardAbsorbed = Math.min(defender.guard, reducedDamage);
  const overflowDamage = reducedDamage - guardAbsorbed;
  
  // 7. Deplete resolve charges
  const chargeDepletion = Math.min(defender.resolveCharges.prc, baseDamage);
  
  return {
    baseDamage,
    attackBonus,
    defenseValue,
    effectRank: technique?.effectRank ?? 0,
    drTier: defender.drTier,
    drReduction,
    guardAbsorbed,
    thpDamage: overflowDamage,
    strainDamage: technique?.strainRouted ? baseDamage : 0
  };
}
```

### 2.6 Hit/Crit Logic

```typescript
interface HitResult {
  outcome: 'miss' | 'hit' | 'crit';
  attackRoll: number;       // d20 result
  attackTotal: number;      // Roll + bonus
  defenseValue: number;     // Target's defense
  margin: number;           // Difference (DoS)
}

function resolveHit(
  attackRoll: number,
  attackBonus: number,
  defenseValue: number
): HitResult {
  const attackTotal = attackRoll + attackBonus;
  const margin = attackTotal - defenseValue;
  
  // Natural 1: Always miss
  if (attackRoll === 1) {
    return { outcome: 'miss', attackRoll, attackTotal, defenseValue, margin };
  }
  
  // Natural 20: Always hit + crit
  if (attackRoll === 20) {
    return { outcome: 'crit', attackRoll, attackTotal, defenseValue, margin };
  }
  
  // Success by 5+: Crit
  if (margin >= 5) {
    return { outcome: 'crit', attackRoll, attackTotal, defenseValue, margin };
  }
  
  // Miss or hit
  const outcome = margin >= 0 ? 'hit' : 'miss';
  return { outcome, attackRoll, attackTotal, defenseValue, margin };
}
```

### 2.7 Status Effects (Conditions)

Per SRD 4-step condition ladders:

```typescript
type ConditionPillar = 'violence' | 'influence' | 'revelation';
type ConditionDegree = 1 | 2 | 3 | 4;

interface StatusEffect {
  id: string;
  name: string;
  pillar: ConditionPillar;
  degree: ConditionDegree;
  duration: number | 'permanent';
  source: string;           // Who applied it
  effects: ConditionEffect[];
}

interface ConditionEffect {
  type: 'modifier' | 'dot' | 'hot' | 'prevent' | 'custom';
  stat?: string;
  value?: number;
  damage?: number;
  healing?: number;
}
```

**Condition Ladders**:

| Pillar | 1st Degree | 2nd Degree | 3rd Degree | 4th Degree |
|--------|------------|------------|------------|------------|
| Violence | Injured | Maimed | Mortally Wounded | Ruined Body |
| Influence | Rattled | Discredited | Isolated | Shattered |
| Revelation | Shaken | Haunted | Deranged | Shattered |

**Stacking Rules**:
- Same pillar: Advance to next degree
- Different pillars: Both apply, penalties stack

### 2.8 Victory Conditions

```typescript
type VictoryCondition = 
  | { type: 'eliminate'; targetTeam: Team }
  | { type: 'survive'; rounds: number }
  | { type: 'defeat'; targetId: string }
  | { type: 'protect'; targetId: string }
  | { type: 'escape'; threshold: number }
  | { type: 'custom'; checkFn: (state: CombatState) => boolean };

function checkVictory(state: CombatState): VictoryResult | null {
  for (const condition of state.victoryConditions) {
    if (isConditionMet(state, condition)) {
      return { 
        victor: determineVictor(condition),
        condition 
      };
    }
  }
  return null;
}
```

---

## 3. Event Log Architecture

### 3.1 Event Types

```typescript
type CombatEvent =
  // Phase Events
  | { type: 'COMBAT_START'; encounterId: string; seed: number }
  | { type: 'COMBAT_END'; result: VictoryResult }
  | { type: 'ROUND_START'; round: number }
  | { type: 'ROUND_END'; round: number }
  | { type: 'PHASE_START'; phase: CombatPhase }
  | { type: 'PHASE_END'; phase: CombatPhase }
  
  // Turn Events
  | { type: 'TURN_START'; unitId: string }
  | { type: 'TURN_END'; unitId: string }
  | { type: 'ACTION_CHOSEN'; action: Action }
  
  // Resolution Events
  | { type: 'ATTACK_ROLL'; attackerId: string; targetId: string; roll: number; total: number; defense: number }
  | { type: 'HIT'; attackerId: string; targetId: string; margin: number }
  | { type: 'MISS'; attackerId: string; targetId: string; margin: number }
  | { type: 'CRIT'; attackerId: string; targetId: string; margin: number }
  
  // Damage Events
  | { type: 'DAMAGE_CALCULATED'; calculation: DamageCalculation }
  | { type: 'GUARD_ABSORBED'; targetId: string; amount: number }
  | { type: 'THP_DAMAGE'; targetId: string; amount: number; newValue: number }
  | { type: 'STRAIN_DAMAGE'; targetId: string; amount: number; newValue: number }
  
  // Resource Events
  | { type: 'AE_SPENT'; unitId: string; amount: number; newValue: number }
  | { type: 'AE_REGENERATED'; unitId: string; amount: number; newValue: number }
  | { type: 'GUARD_GAINED'; unitId: string; amount: number; newValue: number }
  | { type: 'STRAIN_GAINED'; unitId: string; amount: number; newValue: number }
  
  // Condition Events
  | { type: 'CONDITION_APPLIED'; targetId: string; condition: StatusEffect }
  | { type: 'CONDITION_ADVANCED'; targetId: string; condition: StatusEffect; newDegree: ConditionDegree }
  | { type: 'CONDITION_REMOVED'; targetId: string; conditionId: string }
  
  // Unit State Events
  | { type: 'UNIT_DEFEATED'; unitId: string; cause: string }
  | { type: 'UNIT_REVIVED'; unitId: string }
  
  // Meta-Currency Events
  | { type: 'FURY_GAINED'; unitId: string; amount: number; source: string }
  | { type: 'FURY_SPENT'; unitId: string; amount: number; effect: string }
  | { type: 'CLOUT_GAINED'; unitId: string; amount: number; source: string }
  | { type: 'CLOUT_SPENT'; unitId: string; amount: number; effect: string }
  | { type: 'INSIGHT_GAINED'; unitId: string; amount: number; source: string }
  | { type: 'INSIGHT_SPENT'; unitId: string; amount: number; effect: string }
  
  // Cost Track Events
  | { type: 'TRACK_MARKED'; unitId: string; track: 'blood' | 'fate' | 'stain'; source: string }
  | { type: 'TRACK_CLEARED'; unitId: string; track: 'blood' | 'fate' | 'stain'; amount: number };
```

### 3.2 Reducer Pattern

```typescript
interface CombatState {
  encounterId: string;
  seed: number;
  rngState: RNGState;
  round: number;
  phase: CombatPhase;
  turnOrder: TurnOrder;
  units: Record<string, CombatUnit>;
  teams: Record<Team, TeamState>;
  eventLog: CombatEvent[];
  victoryConditions: VictoryCondition[];
  result: VictoryResult | null;
}

type CombatReducer = (state: CombatState, event: CombatEvent) => CombatState;

const combatReducer: CombatReducer = (state, event) => {
  switch (event.type) {
    case 'COMBAT_START':
      return {
        ...state,
        encounterId: event.encounterId,
        seed: event.seed,
        eventLog: [...state.eventLog, event]
      };
      
    case 'THP_DAMAGE':
      return {
        ...state,
        units: {
          ...state.units,
          [event.targetId]: {
            ...state.units[event.targetId],
            thp: event.newValue
          }
        },
        eventLog: [...state.eventLog, event]
      };
      
    // ... other cases
    
    default:
      return state;
  }
};
```

### 3.3 Replay System

```typescript
function replayCombat(
  initialState: CombatState,
  events: CombatEvent[]
): CombatState {
  return events.reduce(combatReducer, initialState);
}

function replayToEvent(
  initialState: CombatState,
  events: CombatEvent[],
  targetIndex: number
): CombatState {
  return events.slice(0, targetIndex + 1).reduce(combatReducer, initialState);
}
```

---

## 4. Data-Driven Definitions

### 4.1 Unit Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CombatUnit",
  "type": "object",
  "required": ["id", "name", "team", "scl"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "team": { "enum": ["player", "enemy", "neutral"] },
    "scl": { "type": "integer", "minimum": 1, "maximum": 15 },
    "stats": {
      "type": "object",
      "properties": {
        "strength": { "type": "integer" },
        "endurance": { "type": "integer" },
        "agility": { "type": "integer" },
        "technique": { "type": "integer" },
        "willpower": { "type": "integer" },
        "focus": { "type": "integer" },
        "essence": { "type": "integer" },
        "resolve": { "type": "integer" },
        "presence": { "type": "integer" }
      }
    },
    "combat": {
      "type": "object",
      "properties": {
        "thp": { "type": "integer" },
        "ae": { "type": "integer" },
        "violence": { "$ref": "#/definitions/PillarStats" },
        "influence": { "$ref": "#/definitions/PillarStats" },
        "revelation": { "$ref": "#/definitions/PillarStats" }
      }
    },
    "techniqueIds": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "definitions": {
    "PillarStats": {
      "type": "object",
      "properties": {
        "attack": { "type": "integer" },
        "defense": { "type": "integer" },
        "resilience": { "type": "integer" },
        "effectRank": { "type": "integer" }
      }
    }
  }
}
```

### 4.2 Skill/Technique Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Technique",
  "type": "object",
  "required": ["id", "name", "aeCost", "pillar"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "description": { "type": "string" },
    "pillar": { "enum": ["violence", "influence", "revelation"] },
    "aeCost": { "type": "integer", "minimum": 0 },
    "selfStrain": { "type": "integer", "minimum": 0 },
    "targeting": {
      "type": "object",
      "properties": {
        "type": { "enum": ["single", "aoe", "self", "ally", "all"] },
        "range": { "enum": ["melee", "close", "ranged", "any"] },
        "maxTargets": { "type": "integer" }
      }
    },
    "effects": {
      "type": "array",
      "items": { "$ref": "#/definitions/TechniqueEffect" }
    },
    "costRequirements": {
      "type": "object",
      "properties": {
        "blood": { "type": "integer" },
        "fate": { "type": "integer" },
        "stain": { "type": "integer" }
      }
    }
  },
  "definitions": {
    "TechniqueEffect": {
      "type": "object",
      "properties": {
        "type": { 
          "enum": ["damage", "heal", "condition", "buff", "debuff", "guard", "strain"]
        },
        "value": { "type": "integer" },
        "formula": { "type": "string" },
        "condition": { "type": "string" },
        "duration": { "type": "integer" }
      }
    }
  }
}
```

### 4.3 Encounter Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Encounter",
  "type": "object",
  "required": ["id", "name", "enemies"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "description": { "type": "string" },
    "environment": { "type": "string" },
    "music": { "type": "string" },
    "enemies": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "unitId": { "type": "string" },
          "level": { "type": "integer" },
          "aiProfile": { "type": "string" }
        }
      }
    },
    "victoryConditions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "enum": ["eliminate", "survive", "defeat", "protect", "escape"] },
          "target": { "type": "string" },
          "value": { "type": "integer" }
        }
      }
    },
    "rewards": {
      "type": "object",
      "properties": {
        "xp": { "type": "integer" },
        "items": { "type": "array", "items": { "type": "string" } },
        "flags": { "type": "array", "items": { "type": "string" } }
      }
    },
    "triggers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "condition": { "type": "string" },
          "event": { "type": "string" },
          "action": { "type": "string" }
        }
      }
    }
  }
}
```

---

## 5. VN ↔ Combat Integration Contract

### 5.1 Entry Point

```typescript
interface BattleOptions {
  encounterId: string;
  partyIds: string[];         // Player character IDs
  seed?: number;              // RNG seed (for determinism)
  enable3Stage?: boolean;     // Use 3-Stage combat (default: true)
  vnFlags?: Record<string, unknown>; // Narrative flags
}

interface BattleResult {
  result: 'victory' | 'defeat' | 'escape' | 'timeout';
  rewards: BattleRewards;
  flags: string[];            // Narrative flags set during combat
  log: CombatEvent[];         // Full event log for replay
  finalState: CombatState;    // End state snapshot
}

interface BattleRewards {
  xp?: number;
  items?: string[];
  conditions?: Array<{ unitId: string; condition: StatusEffect }>;
  trackMarks?: Array<{ unitId: string; track: string }>;
}

// The main integration function
async function startBattle(options: BattleOptions): Promise<BattleResult> {
  // 1. Load encounter data
  const encounter = await loadEncounter(options.encounterId);
  
  // 2. Initialize combat state
  const initialState = initializeCombat({
    ...options,
    encounter
  });
  
  // 3. Run combat loop (or return control to UI)
  const result = await runCombatUI(initialState);
  
  // 4. Process results
  return {
    result: result.victor === 'player' ? 'victory' : 'defeat',
    rewards: calculateRewards(encounter, result),
    flags: result.flagsSet,
    log: result.state.eventLog,
    finalState: result.state
  };
}
```

### 5.2 VN Scene Integration

```typescript
// In VN conversation script
const scene = {
  id: 'crimson_pavilion_duel',
  dialogue: [
    { speaker: 'Sect Elder', text: 'You dare challenge me?' },
    { speaker: 'player', text: 'I have no choice.' },
    {
      type: 'choice',
      options: [
        {
          text: 'Duel the Sect Elder',
          action: async () => {
            const result = await startBattle({
              encounterId: 'duel_sect_elder',
              partyIds: ['player_character'],
              vnFlags: { sect_confrontation: true }
            });
            
            if (result.result === 'victory') {
              return 'sect_elder_defeated';
            } else {
              return 'sect_elder_victorious';
            }
          }
        },
        {
          text: 'Attempt diplomacy',
          action: () => 'diplomacy_route'
        }
      ]
    }
  ]
};
```

### 5.3 Callback Events

```typescript
interface CombatCallbacks {
  onCombatStart?: (state: CombatState) => void;
  onRoundStart?: (round: number) => void;
  onTurnStart?: (unit: CombatUnit) => void;
  onEvent?: (event: CombatEvent) => void;
  onUnitDefeated?: (unit: CombatUnit) => void;
  onCombatEnd?: (result: BattleResult) => void;
  onScriptTrigger?: (trigger: string, data: unknown) => void;
}
```

---

## 6. Combat Resolution Flow

### 6.1 High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      COMBAT START                           │
├─────────────────────────────────────────────────────────────┤
│  1. Load encounter data                                     │
│  2. Initialize units (party + enemies)                      │
│  3. Set RNG seed                                            │
│  4. Emit COMBAT_START event                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      ROUND LOOP                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ROUND START                                          │   │
│  │ - Emit ROUND_START                                   │   │
│  │ - Determine turn order                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PHASE 1: Quick Actions (Fast SPD)                    │   │
│  │ - Fast units take Quick Actions                      │   │
│  │ - Process in SPD order                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PHASE 2: Major Actions                               │   │
│  │ - All units take Major Actions                       │   │
│  │ - Process in initiative order                        │   │
│  │ - Player: Wait for input                             │   │
│  │ - Enemy: AI decision                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PHASE 3: Quick Actions (Slow SPD)                    │   │
│  │ - Slow units take Quick Actions                      │   │
│  │ - Process in SPD order                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ROUND END                                            │   │
│  │ - Regenerate AE                                      │   │
│  │ - Process conditions (duration, ticks)               │   │
│  │ - Check victory conditions                           │   │
│  │ - Emit ROUND_END                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│              ┌───────────┴───────────┐                      │
│              │ Victory/Defeat?       │                      │
│              └───────────┬───────────┘                      │
│                    No    │    Yes                           │
│                    │     │     │                            │
│                    │     │     ▼                            │
│                    │     │  COMBAT END                      │
│                    ▼     │                                   │
│              Next Round ─┘                                   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Action Resolution Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ACTION CHOSEN                            │
├─────────────────────────────────────────────────────────────┤
│  1. Validate action (AE cost, target validity, etc.)        │
│  2. Emit ACTION_CHOSEN event                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    COST RESOLUTION                          │
├─────────────────────────────────────────────────────────────┤
│  1. Deduct AE cost                                          │
│  2. Apply self-strain                                       │
│  3. Mark cost tracks (if required)                          │
│  4. Emit resource events                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ATTACK RESOLUTION                        │
├─────────────────────────────────────────────────────────────┤
│  1. Roll d20 (seeded RNG)                                   │
│  2. Calculate attack total (per ADR-0003)                   │
│  3. Compare to target defense                               │
│  4. Determine hit/miss/crit                                 │
│  5. Emit ATTACK_ROLL, HIT/MISS/CRIT events                  │
└─────────────────────────────────────────────────────────────┘
                              │
                     ┌────────┴────────┐
                     │ Hit?            │
                     └────────┬────────┘
                        Yes   │   No
                         │    │    │
                         ▼    │    ▼
┌─────────────────────┐ │  ┌─────────────────────┐
│   DAMAGE CALC       │ │  │   MISS              │
│   Apply effects     │ │  │   End action        │
└─────────────────────┘ │  └─────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    EFFECT RESOLUTION                        │
├─────────────────────────────────────────────────────────────┤
│  1. Calculate damage (DR, Guard, THP)                       │
│  2. Apply conditions (resilience check)                     │
│  3. Apply buffs/debuffs                                     │
│  4. Emit damage/condition events                            │
│  5. Check for unit defeat                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Implementation Notes

### 7.1 Seeded RNG

```typescript
// Mulberry32 PRNG - fast, deterministic, good distribution
function createRNG(seed: number): SeededRNG {
  let state = seed;
  
  function next(): number {
    state = state + 0x6D2B79F5 | 0;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  
  return {
    next,
    d20: () => Math.floor(next() * 20) + 1,
    d6: () => Math.floor(next() * 6) + 1,
    roll: (sides: number) => Math.floor(next() * sides) + 1,
    getSeed: () => seed,
    getState: () => state
  };
}
```

### 7.2 File Structure

```
frontend/src/combat/
├── engine/
│   ├── index.ts              # Main exports
│   ├── combatState.ts        # State interfaces
│   ├── events.ts             # Event type definitions
│   ├── reducer.ts            # State reducer
│   ├── rng.ts                # Seeded RNG
│   └── rules/
│       ├── damage.ts         # Damage calculation
│       ├── hit.ts            # Hit/crit logic
│       ├── bonus.ts          # Bonus composition (ADR-0003)
│       └── conditions.ts     # Condition management
├── data/
│   ├── encounters.json       # Encounter definitions
│   ├── techniques.json       # Technique data
│   ├── units.json            # Unit templates
│   └── schemas/
│       ├── unit.schema.json
│       ├── technique.schema.json
│       └── encounter.schema.json
├── ai/
│   └── enemyAI.ts            # Simple enemy AI
└── integration/
    └── battleBridge.ts       # VN ↔ Combat bridge
```

### 7.3 Testing Strategy

```typescript
// Unit tests for determinism
describe('Combat Engine', () => {
  it('produces identical results with same seed', () => {
    const seed = 12345;
    const encounter = loadTestEncounter();
    
    const result1 = simulateCombat(encounter, seed);
    const result2 = simulateCombat(encounter, seed);
    
    expect(result1.eventLog).toEqual(result2.eventLog);
    expect(result1.finalState).toEqual(result2.finalState);
  });
  
  it('respects ADR-0003 bonus composition', () => {
    const attacker = createTestUnit({ violence: { attack: 5 } });
    const skillBonus = 2;
    const edgeBonus = 1;
    const situationalMods = 0;
    
    const bonus = calculateBonus({
      pillarTrait: attacker.violence.attack,
      skillBonus,
      edgeBonus,
      situationalMods
    });
    
    expect(bonus).toBe(8); // 5 + 2 + 1 + 0
  });
});
```

---

## Appendix A: Quick Reference

### Formulas

| Formula | Expression |
|---------|------------|
| THP | `10 + (Endurance × 5) + purchased ranks` |
| Max AE | `10 + (Willpower × 2) + purchased ranks` |
| AE Regen | `1 + floor(Willpower / 3)` per round |
| Max Strain | `Endurance × 10` |
| Block Guard | `Endurance × 2` |
| Bonus | `PillarTrait + SkillBonus + EdgeBonus + SituationalMods` |

### DR Tiers

| Tier | Reduction |
|------|-----------|
| 0 | 0% |
| 1 | 10% |
| 2 | 20% |
| 3 | 30% |
| 4 | 40% |
| 5 | 50% |
| 6+ | 60%+ |

### Condition Degrees

| Failure By | Degree |
|------------|--------|
| 1-4 | 1st |
| 5-9 | 2nd |
| 10-14 | 3rd |
| 15+ | 4th |
