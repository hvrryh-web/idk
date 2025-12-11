/**
 * Status Bar Generator for Combat Display
 * 
 * Creates dynamic ASCII health bars, resource bars, and status indicators
 */

export interface BarConfig {
  current: number;
  max: number;
  width: number;
  style: 'blocks' | 'segments' | 'minimal';
  showText: boolean;
  color?: 'green' | 'yellow' | 'red' | 'cyan' | 'orange';
}

/**
 * Generate a visual status bar
 * 
 * @param config - Bar configuration
 * @returns ASCII bar string
 */
export function generateBar(config: BarConfig): string {
  const percent = Math.max(0, Math.min(1, config.current / config.max));
  const filled = Math.floor(config.width * percent);
  const empty = config.width - filled;
  
  let bar = '';
  
  switch (config.style) {
    case 'blocks':
      bar = '█'.repeat(filled) + '░'.repeat(empty);
      break;
    
    case 'segments':
      bar = '▓'.repeat(filled) + '░'.repeat(empty);
      break;
    
    case 'minimal':
      bar = '='.repeat(filled) + '-'.repeat(empty);
      break;
  }
  
  if (config.showText) {
    return `[${bar}] ${config.current}/${config.max}`;
  }
  
  return `[${bar}]`;
}

/**
 * Generate health bar with color coding
 */
export function generateHealthBar(current: number, max: number, width: number = 10): string {
  const percent = current / max;
  let color: 'green' | 'yellow' | 'red';
  
  if (percent > 0.6) {
    color = 'green';
  } else if (percent > 0.3) {
    color = 'yellow';
  } else {
    color = 'red';
  }
  
  return generateBar({
    current,
    max,
    width,
    style: 'blocks',
    showText: true,
    color,
  });
}

/**
 * Generate AE (Action Energy) bar
 */
export function generateAEBar(current: number, max: number, width: number = 10): string {
  return generateBar({
    current,
    max,
    width,
    style: 'blocks',
    showText: true,
    color: 'cyan',
  });
}

/**
 * Generate Strain bar
 */
export function generateStrainBar(current: number, max: number = 100, width: number = 10): string {
  return generateBar({
    current,
    max,
    width,
    style: 'segments',
    showText: false,
    color: 'orange',
  });
}

/**
 * Generate Guard indicator
 */
export function generateGuardIndicator(guard: number): string {
  if (guard === 0) return '';
  return `🛡️ ${guard}`;
}

/**
 * Generate compact status display for small resolutions
 */
export function generateCompactStatus(combatant: {
  hp: { current: number; max: number };
  ae: { current: number; max: number };
}): string {
  const hpPercent = Math.floor((combatant.hp.current / combatant.hp.max) * 100);
  const aePercent = Math.floor((combatant.ae.current / combatant.ae.max) * 100);
  
  return `HP:${hpPercent}% AE:${aePercent}%`;
}

/**
 * Generate full status panel for combatant
 */
export function generateStatusPanel(combatant: {
  name: string;
  hp: { current: number; max: number };
  ae: { current: number; max: number };
  strain: number;
  guard: number;
  effects: string[];
}, width: number = 30): string {
  const lines: string[] = [];
  
  // Name
  lines.push(` ${combatant.name}`.padEnd(width, ' '));
  
  // HP bar
  const hpBar = generateHealthBar(combatant.hp.current, combatant.hp.max, width - 10);
  lines.push(` HP: ${hpBar}`);
  
  // AE bar
  const aeBar = generateAEBar(combatant.ae.current, combatant.ae.max, width - 10);
  lines.push(` AE: ${aeBar}`);
  
  // Strain if > 0
  if (combatant.strain > 0) {
    const stBar = generateStrainBar(combatant.strain, 100, width - 10);
    lines.push(` ST: ${stBar}`);
  }
  
  // Guard if > 0
  if (combatant.guard > 0) {
    lines.push(` ${generateGuardIndicator(combatant.guard)}`);
  }
  
  // Effects
  if (combatant.effects.length > 0) {
    lines.push(` ${combatant.effects.join(' ')}`);
  }
  
  return lines.join('\n');
}

/**
 * Generate damage/healing number overlay
 */
export function generateDamageNumber(
  value: number,
  type: 'damage' | 'heal' | 'critical'
): string {
  const prefix = type === 'heal' ? '+' : '-';
  const marker = type === 'critical' ? '!' : '';
  
  return `${prefix}${Math.abs(value)}${marker}`;
}

/**
 * Generate status effect icon
 */
export function getStatusEffectIcon(effect: string): string {
  const icons: Record<string, string> = {
    empowered: '⚡',
    protected: '🛡️',
    burning: '🔥',
    frozen: '❄️',
    stunned: '💫',
    poisoned: '☠️',
    regenerating: '🩹',
    buffed: '⬆️',
    debuffed: '⬇️',
    blinded: '👁️',
    silenced: '🔇',
    hasted: '⚡⚡',
    slowed: '🐌',
  };
  
  return icons[effect.toLowerCase()] || '●';
}

/**
 * Generate turn order display
 */
export function generateTurnOrder(
  combatants: Array<{ id: string; name: string; spdBand: string; isActive: boolean }>,
  width: number = 60
): string {
  const lines: string[] = [];
  
  // Group by speed band
  const quick = combatants.filter(c => c.spdBand === 'quick');
  const normal = combatants.filter(c => c.spdBand === 'normal');
  const slow = combatants.filter(c => c.spdBand === 'slow');
  
  // Quick actions
  if (quick.length > 0) {
    const names = quick.map(c => c.isActive ? `[${c.name}]` : c.name).join(' → ');
    lines.push(`⚡ QUICK:  ${names}`);
  }
  
  // Normal actions
  if (normal.length > 0) {
    const names = normal.map(c => c.isActive ? `[${c.name}]` : c.name).join(' → ');
    lines.push(`⚙️ NORMAL: ${names}`);
  }
  
  // Slow actions
  if (slow.length > 0) {
    const names = slow.map(c => c.isActive ? `[${c.name}]` : c.name).join(' → ');
    lines.push(`🐌 SLOW:   ${names}`);
  }
  
  return lines.join('\n');
}

/**
 * Generate combat log entry
 */
export function generateLogEntry(
  actor: string,
  action: string,
  target: string,
  result: { damage?: number; heal?: number; critical?: boolean; effect?: string }
): string {
  let entry = `> ${actor} ${action}`;
  
  if (target) {
    entry += ` → ${target}`;
  }
  
  if (result.damage) {
    const crit = result.critical ? ' (CRITICAL!)' : '';
    entry += ` - ${result.damage} damage${crit}`;
  }
  
  if (result.heal) {
    entry += ` + ${result.heal} healing`;
  }
  
  if (result.effect) {
    entry += ` [${result.effect}]`;
  }
  
  return entry;
}

/**
 * Generate arena header
 */
export function generateArenaHeader(
  round: number,
  phase: string,
  width: number = 60
): string {
  const title = `COMBAT ARENA - ROUND ${round}`;
  const phaseText = `${phase.toUpperCase()} PHASE`;
  
  const padding = Math.floor((width - title.length) / 2);
  const line1 = '═'.repeat(width);
  const line2 = '║' + ' '.repeat(padding) + title + ' '.repeat(width - padding - title.length - 2) + '║';
  const line3 = '║' + ' '.repeat(Math.floor((width - phaseText.length) / 2)) + phaseText + ' '.repeat(width - Math.floor((width - phaseText.length) / 2) - phaseText.length - 2) + '║';
  const line4 = '═'.repeat(width);
  
  return `${line1}\n${line2}\n${line3}\n${line4}`;
}
