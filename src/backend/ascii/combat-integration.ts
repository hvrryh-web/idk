/**
 * Combat System ASCII Integration - Enhanced Version
 * 
 * Maps combat state to ASCII visual representation with:
 * - Multi-resolution support
 * - Dynamic status bars
 * - Damage numbers
 * - Enhanced sprites
 */

import { SceneSpec, Overlay } from './generator';
import {
  generateHealthBar,
  generateAEBar,
  generateStatusPanel,
  generateDamageNumber,
  getStatusEffectIcon,
  generateTurnOrder,
  generateArenaHeader,
} from './status-bars';

/**
 * Resolution profiles for adaptive display
 */
export type ResolutionProfile = 'mobile' | 'tablet' | 'desktop';

interface ResolutionConfig {
  arenaWidth: number;
  arenaHeight: number;
  characterDetail: 'simple' | 'detailed';
  showStatusBars: boolean;
  showFullStats: boolean;
  combatLogLines: number;
}

const RESOLUTION_CONFIGS: Record<ResolutionProfile, ResolutionConfig> = {
  mobile: {
    arenaWidth: 40,
    arenaHeight: 20,
    characterDetail: 'simple',
    showStatusBars: false,
    showFullStats: false,
    combatLogLines: 3,
  },
  tablet: {
    arenaWidth: 80,
    arenaHeight: 30,
    characterDetail: 'detailed',
    showStatusBars: true,
    showFullStats: false,
    combatLogLines: 5,
  },
  desktop: {
    arenaWidth: 120,
    arenaHeight: 40,
    characterDetail: 'detailed',
    showStatusBars: true,
    showFullStats: true,
    combatLogLines: 10,
  },
};

/**
 * Combat state from backend
 */
export interface CombatState {
  round: number;
  phase: 'quick' | 'normal' | 'slow';
  playerParty: Combatant[];
  enemies: Combatant[];
  activeEffects: ActiveEffect[];
  activeTurn?: string; // combatant ID
}

export interface Combatant {
  id: string;
  name: string;
  isBoss: boolean;
  pose: 'idle' | 'attack' | 'defend' | 'hurt' | 'dead' | 'cast';
  hp: { current: number; max: number };
  ae: { current: number; max: number };
  strain: number;
  guard: number;
  effects: string[]; // status effect IDs
  spdBand: 'quick' | 'normal' | 'slow';
}

export interface ActiveEffect {
  id: string;
  type: 'attack' | 'heal' | 'buff' | 'debuff' | 'explosion';
  source: string;
  target: string;
  frame: number; // current animation frame (0-based)
  maxFrames: number;
}

/**
 * Combat visual configuration
 */
const COMBAT_CONFIG = {
  arena: {
    background: 'arena_basic',
    width: 63,
    height: 8,
  },
  positioning: {
    playerStart: { x: 10, y: 6 },
    playerSpacing: 10,
    enemyStart: { x: 45, y: 6 },
    enemySpacing: 10,
  },
  statusBars: {
    yOffset: -4, // above character
    width: 10,
  },
};

/**
 * Map combatant pose to asset name with resolution awareness
 */
function getPoseAsset(
  combatant: Combatant,
  detail: 'simple' | 'detailed'
): string {
  if (combatant.isBoss) {
    return 'boss_idle'; // TODO: Add boss poses
  }
  
  const prefix = detail === 'detailed' ? 'char_detailed' : 'char';
  return `${prefix}_${combatant.pose}`;
}

/**
 * Map effect type to asset name
 */
function getEffectAsset(effect: ActiveEffect): string {
  const baseAssets: Record<string, string> = {
    attack: 'attack_slash',
    heal: 'effect_heal',
    buff: 'effect_buff',
    debuff: 'sparkles', // TODO: Add debuff asset
    explosion: 'effect_explosion',
  };
  return baseAssets[effect.type] || 'sparkles';
}

/**
 * Calculate effect position between source and target
 */
function calculateEffectPosition(
  sourcePos: { x: number; y: number },
  targetPos: { x: number; y: number },
  frame: number,
  maxFrames: number
): { x: number; y: number } {
  // Interpolate position based on animation frame
  const progress = frame / maxFrames;
  return {
    x: Math.floor(sourcePos.x + (targetPos.x - sourcePos.x) * progress),
    y: Math.floor(sourcePos.y + (targetPos.y - sourcePos.y) * progress),
  };
}

/**
 * Generate status bar overlay for a combatant
 */
function generateStatusBarOverlay(
  combatant: Combatant,
  position: { x: number; y: number }
): Overlay[] {
  const overlays: Overlay[] = [];
  
  // HP bar
  const hpPercent = combatant.hp.current / combatant.hp.max;
  const hpWidth = Math.ceil(COMBAT_CONFIG.statusBars.width * hpPercent);
  
  // TODO: Implement dynamic bar generation
  // For now, just show text representation
  
  return overlays;
}

/**
 * Generate turn indicator overlay
 */
function generateTurnIndicator(position: { x: number; y: number }): Overlay {
  return {
    assetName: 'turn_indicator',
    x: position.x - 5,
    y: position.y,
    blendMode: 'transparent',
  };
}

/**
 * Convert combat state to ASCII scene specification
 */
export function combatStateToScene(state: CombatState): SceneSpec {
  const overlays: Overlay[] = [];
  
  // Track positions for effect calculations
  const positions = new Map<string, { x: number; y: number }>();
  
  // Add player party
  state.playerParty.forEach((player, i) => {
    const x = COMBAT_CONFIG.positioning.playerStart.x + (i * COMBAT_CONFIG.positioning.playerSpacing);
    const y = COMBAT_CONFIG.positioning.playerStart.y;
    
    positions.set(player.id, { x, y });
    
    overlays.push({
      assetName: getPoseAsset(player),
      x,
      y,
      blendMode: 'transparent',
    });
    
    // Add turn indicator if active
    if (state.activeTurn === player.id) {
      overlays.push(generateTurnIndicator({ x, y }));
    }
    
    // Add status bars
    overlays.push(...generateStatusBarOverlay(player, { x, y }));
  });
  
  // Add enemies
  state.enemies.forEach((enemy, i) => {
    const x = COMBAT_CONFIG.positioning.enemyStart.x + (i * COMBAT_CONFIG.positioning.enemySpacing);
    const y = COMBAT_CONFIG.positioning.enemyStart.y;
    
    positions.set(enemy.id, { x, y });
    
    overlays.push({
      assetName: getPoseAsset(enemy),
      x,
      y,
      blendMode: 'transparent',
    });
    
    // Add turn indicator if active
    if (state.activeTurn === enemy.id) {
      overlays.push(generateTurnIndicator({ x, y }));
    }
    
    // Add status bars
    overlays.push(...generateStatusBarOverlay(enemy, { x, y }));
  });
  
  // Add active effects
  state.activeEffects.forEach((effect) => {
    const sourcePos = positions.get(effect.source);
    const targetPos = positions.get(effect.target);
    
    if (sourcePos && targetPos) {
      const effectPos = calculateEffectPosition(
        sourcePos,
        targetPos,
        effect.frame,
        effect.maxFrames
      );
      
      overlays.push({
        assetName: getEffectAsset(effect),
        x: effectPos.x,
        y: effectPos.y,
        blendMode: 'transparent',
      });
    }
  });
  
  return {
    background: COMBAT_CONFIG.arena.background,
    overlays,
    transparentChar: '.',
  };
}

/**
 * Generate animation sequence for a combat action
 */
export function generateCombatAnimation(
  action: {
    actor: string;
    technique: string;
    target: string;
    type: 'attack' | 'heal' | 'buff';
  },
  state: CombatState
): SceneSpec[] {
  const frames: SceneSpec[] = [];
  const maxFrames = 4; // Number of animation frames
  
  // Create modified states for each frame
  for (let frame = 0; frame < maxFrames; frame++) {
    // Update actor pose
    const modifiedState: CombatState = {
      ...state,
      playerParty: state.playerParty.map(p =>
        p.id === action.actor ? { ...p, pose: 'attack' as const } : p
      ),
      enemies: state.enemies.map(e =>
        e.id === action.actor ? { ...e, pose: 'attack' as const } : e
      ),
      activeEffects: [
        {
          id: `${action.actor}_${action.target}_${Date.now()}`,
          type: action.type,
          source: action.actor,
          target: action.target,
          frame,
          maxFrames,
        },
      ],
    };
    
    frames.push(combatStateToScene(modifiedState));
  }
  
  // Final frame: target reacts
  const finalState: CombatState = {
    ...state,
    playerParty: state.playerParty.map(p => ({
      ...p,
      pose: p.id === action.target ? ('hurt' as const) : ('idle' as const),
    })),
    enemies: state.enemies.map(e => ({
      ...e,
      pose: e.id === action.target ? ('hurt' as const) : ('idle' as const),
    })),
    activeEffects: [],
  };
  
  frames.push(combatStateToScene(finalState));
  
  return frames;
}

/**
 * Helper to create a mock combat state for testing
 */
export function createMockCombatState(): CombatState {
  return {
    round: 1,
    phase: 'normal',
    activeTurn: 'player1',
    playerParty: [
      {
        id: 'player1',
        name: 'Hero',
        isBoss: false,
        pose: 'idle',
        hp: { current: 85, max: 100 },
        ae: { current: 45, max: 60 },
        strain: 10,
        guard: 0,
        effects: [],
        spdBand: 'normal',
      },
      {
        id: 'player2',
        name: 'Mage',
        isBoss: false,
        pose: 'idle',
        hp: { current: 62, max: 80 },
        ae: { current: 72, max: 100 },
        strain: 5,
        guard: 0,
        effects: [],
        spdBand: 'quick',
      },
    ],
    enemies: [
      {
        id: 'enemy1',
        name: 'Demon',
        isBoss: true,
        pose: 'idle',
        hp: { current: 450, max: 500 },
        ae: { current: 80, max: 100 },
        strain: 15,
        guard: 20,
        effects: [],
        spdBand: 'slow',
      },
    ],
    activeEffects: [],
  };
}
