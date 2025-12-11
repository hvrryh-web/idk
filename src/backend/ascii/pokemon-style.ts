/**
 * Pokemon-Style Dueling System
 * 
 * Provides nostalgic Pokemon battle-style visualization for 1v1 duels
 * with turn-based mechanics, move selection panel, and classic layout.
 */

import { SceneSpec, Overlay } from './generator';

/**
 * Pokemon battle state
 */
export interface PokemonBattleState {
  player: {
    name: string;
    level: number;
    hp: { current: number; max: number };
    ae: { current: number; max: number };
    status?: string; // BRN, FRZ, PAR, PSN, SLP
  };
  enemy: {
    name: string;
    level: number;
    hp: { current: number; max: number };
    status?: string;
  };
  moves: Array<{
    id: string;
    name: string;
    type: string;
    power?: number;
    aeCost: number;
    effect?: string;
    selected: boolean;
  }>;
  messageBox?: {
    lines: string[];
    waitForInput: boolean;
  };
  state: 'move_select' | 'animating' | 'message' | 'victory' | 'defeat';
  round: number;
  effectActive?: {
    type: 'hit' | 'crit' | 'status';
    position: { x: number; y: number };
  };
}

/**
 * Generate Pokemon-style HP bar
 * 
 * @param current - Current HP
 * @param max - Maximum HP
 * @param width - Bar width in characters
 * @returns HP bar string with color coding
 */
export function generatePokemonHPBar(
  current: number,
  max: number,
  width: number = 20
): string {
  const percentage = current / max;
  const filled = Math.floor(percentage * width);
  const empty = width - filled;
  
  // Color coding via different characters
  let char = '▓'; // High HP (green)
  if (percentage < 0.5) char = '▒'; // Medium HP (yellow)
  if (percentage < 0.25) char = '░'; // Low HP (red)
  
  return char.repeat(filled) + '░'.repeat(empty);
}

/**
 * Generate Pokemon-style status box text
 * 
 * @param combatant - Combatant data
 * @param isEnemy - Whether this is the enemy status box
 * @returns Array of status box lines
 */
export function generatePokemonStatusBox(
  combatant: { name: string; level: number; hp: { current: number; max: number }; ae?: { current: number; max: number } },
  isEnemy: boolean
): string[] {
  const lines: string[] = [];
  const hpBar = generatePokemonHPBar(combatant.hp.current, combatant.hp.max);
  
  // Border top
  lines.push('╔═══════════════════════════════════╗');
  
  // Name and level line
  const nameLevel = `${combatant.name.toUpperCase().padEnd(28)}Lv.${combatant.level}`;
  lines.push(`║ ${nameLevel} ║`);
  
  // HP bar line
  if (isEnemy) {
    // Enemy: HP bar only, no numbers
    lines.push(`║ HP:${hpBar}              ║`);
  } else {
    // Player: HP bar with numbers
    const hpText = `${combatant.hp.current}/${combatant.hp.max}`;
    lines.push(`║ HP:${hpBar}  ${hpText.padStart(8)} ║`);
    
    // AE bar for player
    if (combatant.ae) {
      const aeBar = generatePokemonHPBar(combatant.ae.current, combatant.ae.max);
      const aeText = `${combatant.ae.current}/${combatant.ae.max}`;
      lines.push(`║ AE:${aeBar}  ${aeText.padStart(8)} ║`);
    }
  }
  
  // Border bottom
  lines.push('╚═══════════════════════════════════╝');
  
  return lines;
}

/**
 * Generate Pokemon-style move selection panel
 * 
 * @param moves - Array of moves
 * @returns Array of panel lines
 */
export function generatePokemonMovePanel(moves: PokemonBattleState['moves']): string[] {
  const lines: string[] = [];
  
  // Header
  lines.push('╔═══════════════════════════════════════════════════════════╗');
  lines.push('║ What will YOUR CULTIVATOR do?                            ║');
  lines.push('╠═════════════════╦═════════════════╦═══════════════╦══════╣');
  
  // Move slots (up to 4)
  const move1 = moves[0] || null;
  const move2 = moves[1] || null;
  const move3 = moves[2] || null;
  const move4 = moves[3] || null;
  
  const formatMove = (move: any, selected: boolean) => {
    if (!move) return '                 ';
    const prefix = selected ? '▶' : '○';
    const name = move.name.substring(0, 13).padEnd(13);
    return `${prefix} ${name}`;
  };
  
  const formatCost = (move: any) => {
    if (!move) return '        ';
    return `AE: ${move.aeCost.toString().padStart(2)}  `;
  };
  
  // Move row
  const m1 = formatMove(move1, move1?.selected);
  const m2 = formatMove(move2, move2?.selected);
  const m3 = formatMove(move3, move3?.selected);
  const m4 = formatMove(move4, move4?.selected);
  lines.push(`║ ${m1}║ ${m2}║ ${m3}║${m4}║`);
  
  // Cost row
  const c1 = formatCost(move1);
  const c2 = formatCost(move2);
  const c3 = formatCost(move3);
  const c4 = formatCost(move4);
  lines.push(`║   ${c1}      ║   ${c2}      ║   ${c3}    ║${c4}║`);
  
  // Border bottom
  lines.push('╚═════════════════╩═════════════════╩═══════════════╩══════╝');
  
  return lines;
}

/**
 * Generate Pokemon-style message box
 * 
 * @param messages - Array of message lines
 * @returns Array of box lines
 */
export function generatePokemonMessageBox(messages: string[]): string[] {
  const lines: string[] = [];
  
  lines.push('╔═══════════════════════════════════════════════════════════╗');
  
  // Pad to 5 lines
  for (let i = 0; i < 5; i++) {
    const msg = messages[i] || '';
    const padded = msg.padEnd(59);
    lines.push(`║ ${padded}║`);
  }
  
  lines.push('╚═══════════════════════════════════════════════════════════╝');
  
  return lines;
}

/**
 * Generate Pokemon-style battle scene
 * 
 * @param state - Pokemon battle state
 * @param resolution - Screen resolution ('mobile' | 'tablet' | 'desktop')
 * @returns Scene specification
 */
export function generatePokemonBattleScene(
  state: PokemonBattleState,
  resolution: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): SceneSpec {
  const overlays: Overlay[] = [];
  
  // Background - simple battle field
  const background = 'arena_basic';
  
  // Enemy sprite (front view) at top
  overlays.push({
    assetName: 'pokemon_char_front',
    x: 50,
    y: 8,
    blendMode: 'transparent',
  });
  
  // Player sprite (back view) at bottom
  overlays.push({
    assetName: 'pokemon_char_back',
    x: 15,
    y: 18,
    blendMode: 'transparent',
  });
  
  // Add effect if active
  if (state.effectActive) {
    let effectAsset = 'pokemon_effect_hit';
    if (state.effectActive.type === 'crit') {
      effectAsset = 'pokemon_effect_crit';
    }
    overlays.push({
      assetName: effectAsset,
      x: state.effectActive.position.x,
      y: state.effectActive.position.y,
      blendMode: 'transparent',
    });
  }
  
  return {
    background,
    overlays,
    transparentChar: '.',
  };
}

/**
 * Generate complete Pokemon battle layout with UI
 * 
 * This generates the full scene including sprites, status boxes, and UI panels
 * 
 * @param state - Pokemon battle state
 * @returns Complete scene as multi-line string
 */
export async function generatePokemonBattleLayout(state: PokemonBattleState): Promise<string> {
  const lines: string[] = [];
  
  // Top border
  lines.push('┌──────────────────────────────────────────────────────────────┐');
  lines.push('│                                                              │');
  
  // Enemy status box (top left)
  const enemyStatus = generatePokemonStatusBox(state.enemy, true);
  enemyStatus.forEach(line => {
    lines.push(`│  ${line.padEnd(60)}│`);
  });
  
  lines.push('│                                                              │');
  
  // Enemy sprite area (simplified - would be from scene composition)
  lines.push('│                          ▄███▄                               │');
  lines.push('│                         ███████                              │');
  lines.push('│                        ▀███████▀                             │');
  lines.push('│                         ███████                              │');
  lines.push('│                          ▀███▀                               │');
  lines.push('│                         ██▀ ▀██                              │');
  lines.push('│                        ███   ███                             │');
  lines.push('│                       ▀▀▀▀   ▀▀▀▀                            │');
  
  lines.push('│                                                              │');
  lines.push('│                                                              │');
  
  // Player sprite area
  lines.push('│         ▄▄▄                                                  │');
  lines.push('│       ▄█████▄                                                │');
  lines.push('│      ███▀█▀███                                               │');
  lines.push('│      ██ ███ ██                                               │');
  lines.push('│       ▀█████▀                                                │');
  lines.push('│        ██ ██                                                 │');
  lines.push('│       ███ ███                                                │');
  lines.push('│      ▀▀▀▀ ▀▀▀▀                                               │');
  
  lines.push('│                                                              │');
  
  // Player status box (bottom left)
  const playerStatus = generatePokemonStatusBox(
    { ...state.player },
    false
  );
  playerStatus.forEach(line => {
    lines.push(`│  ${line.padEnd(60)}│`);
  });
  
  lines.push('│                                                              │');
  
  // Bottom UI panel
  if (state.state === 'move_select') {
    const movePanel = generatePokemonMovePanel(state.moves);
    movePanel.forEach(line => {
      lines.push(`│ ${line}│`);
    });
  } else if (state.messageBox) {
    const msgBox = generatePokemonMessageBox(state.messageBox.lines);
    msgBox.forEach(line => {
      lines.push(`│ ${line}│`);
    });
  }
  
  // Bottom border
  lines.push('└──────────────────────────────────────────────────────────────┘');
  
  return lines.join('\n');
}

/**
 * Create Pokemon-style attack animation sequence
 * 
 * @param attacker - 'player' or 'enemy'
 * @param move - Move being used
 * @returns Array of scene states for animation frames
 */
export function generatePokemonAttackAnimation(
  attacker: 'player' | 'enemy',
  move: string
): Array<Partial<PokemonBattleState>> {
  const frames: Array<Partial<PokemonBattleState>> = [];
  
  // Frame 1: Prepare
  frames.push({
    messageBox: {
      lines: [`${attacker === 'player' ? 'YOUR' : 'ENEMY'} CULTIVATOR used ${move}!`],
      waitForInput: false,
    },
  });
  
  // Frame 2: Attack
  frames.push({
    effectActive: {
      type: 'hit',
      position: attacker === 'player' ? { x: 50, y: 8 } : { x: 15, y: 18 },
    },
  });
  
  // Frame 3: Impact (if critical, show crit stars)
  frames.push({
    effectActive: {
      type: 'hit',
      position: attacker === 'player' ? { x: 50, y: 8 } : { x: 15, y: 18 },
    },
    messageBox: {
      lines: ['A hit!'],
      waitForInput: false,
    },
  });
  
  // Frame 4: Result
  frames.push({
    messageBox: {
      lines: [
        `${attacker === 'player' ? 'ENEMY' : 'YOUR'} CULTIVATOR took damage!`,
      ],
      waitForInput: true,
    },
  });
  
  return frames;
}

/**
 * Example Pokemon battle state for testing
 */
export const EXAMPLE_POKEMON_BATTLE: PokemonBattleState = {
  player: {
    name: 'Your Cultivator',
    level: 42,
    hp: { current: 156, max: 180 },
    ae: { current: 85, max: 120 },
  },
  enemy: {
    name: 'Enemy Cultivator',
    level: 45,
    hp: { current: 165, max: 200 },
  },
  moves: [
    { id: '1', name: 'FLAME STRIKE', type: 'Fire', power: 85, aeCost: 45, selected: true },
    { id: '2', name: 'IRON DEFENSE', type: 'Steel', effect: '+DEF', aeCost: 30, selected: false },
    { id: '3', name: 'SPIRIT SLASH', type: 'Normal', power: 70, aeCost: 35, selected: false },
    { id: '4', name: 'HEAL PULSE', type: 'Heal', effect: 'Heal 60HP', aeCost: 40, selected: false },
  ],
  state: 'move_select',
  round: 1,
};
