# ASCII Combat System - Visual Display Specification

## Overview
The ASCII generation system must provide real-time visual representation of combat encounters, displaying combatants, techniques, effects, and status changes in an intuitive and dynamic way.

## Combat System Analysis

### Current Combat Features (from codebase)
- **Combatant States**: THP, AE, DR, Guard, Strain
- **3-Stage Combat**: Quick Actions, Normal Actions, Slow Actions based on SPD bands
- **Techniques**: Offensive, defensive, support abilities with AE costs
- **Status Effects**: Buffs, debuffs, conditions
- **Combat Log**: Text-based event history

### Visual Requirements for Combat

## 1. Combat Scene Layout

### Arena Configuration
```
┌────────────────────────────────────────────────────────────┐
│                     COMBAT ARENA                           │
│  [PLAYER PARTY]              VS              [ENEMIES]     │
│                                                            │
│   PC1    PC2    PC3                    Enemy1    Enemy2   │
│  [███]  [███]  [███]                   [███]    [███]     │
│  HP:85  HP:92  HP:78                   HP:120   HP:95     │
│  AE:45  AE:38  AE:52                   AE:80    AE:60     │
│                                                            │
│  [ACTIVE EFFECTS/TECHNIQUES DISPLAY]                      │
│                                                            │
│  ══════════════ COMBAT LOG ══════════════                 │
│  > Player1 uses [Technique] on Enemy1                     │
│  > Enemy1 takes 25 damage (95 → 70 HP)                    │
└────────────────────────────────────────────────────────────┘
```

### Key Visual Elements
1. **Combatant Positioning**: Clear spatial arrangement (party left, enemies right)
2. **Health/Resource Bars**: Visual HP/AE/Strain indicators
3. **Active Turn Indicator**: Highlight whose turn it is
4. **Technique Animations**: Show attack trajectories/effects
5. **Status Effects**: Visual indicators for buffs/debuffs
6. **Impact Indicators**: Damage numbers, healing, critical hits

## 2. Combatant Visualization

### Character States
```
IDLE STATE:
   O
  /|\
  / \
 [PC1]

ATTACKING STATE:
   O→
  /|≫
  / \
 [PC1]

DEFENDING STATE:
  ╔O╗
  ║|║
  ║ ║
 [PC1]

DAMAGED STATE:
   O
  \|/
  ╱ ╲
 [PC1]

DEFEATED STATE:
   ×
  ╱│╲
 ╱   ╲
 [PC1]
```

### Status Bars
```
HP: [████████░░] 85/100
AE: [██████░░░░] 60/100
ST: [██░░░░░░░░] 20/100

With color coding:
HP: [████████░░] (green/yellow/red based on %)
AE: [██████░░░░] (cyan)
ST: [██░░░░░░░░] (orange/red)
```

### Status Effect Icons
```
🛡️ Guard Active
⚡ Empowered
🔥 Burning
❄️ Frozen
💫 Stunned
🩹 Regenerating
⬆️ Buffed
⬇️ Debuffed
```

## 3. Technique Visualization

### Attack Types

**Melee Attack:**
```
  PC1 ─────→ Enemy
   O         ╔O╗
  /|≫  ─→   ║|║
  / \        ║ ║
```

**Ranged Attack:**
```
  PC1 ════⇒ Enemy
   O    ═════→  ╔O╗
  /|\          ║|║
  / \          ║ ║
```

**AoE Attack:**
```
  PC1 ╔════╗
   O  ║ ⚡ ║  ← affects multiple
  /|\ ║════║
  / \ ╚════╝ → E1, E2, E3
```

**Buff/Heal:**
```
  PC1
   O    ✨ ← sparkle effect
  /|\  ╱│╲
  / \ ╱ │ ╲
      ☆ ☆ ☆
```

### Animation Frames
```
Frame 1: [ PC ] ─     ─ [Enemy]
Frame 2: [ PC ]  ─   ─  [Enemy]
Frame 3: [ PC ]   ─ ─   [Enemy]
Frame 4: [ PC ]    ×    [Enemy] ← impact
Frame 5: [ PC ]         [Enemy] ← damage shown
```

## 4. Combat Flow Visualization

### Turn Sequence Display
```
╔═══════════════ ROUND 3 ═══════════════╗
║  QUICK ACTIONS → NORMAL → SLOW         ║
║                                        ║
║  [PC1] → [PC3] → [E1] → [PC2] → [E2] ║
║   ✓      ►       ○      ○      ○      ║
╚════════════════════════════════════════╝
```

### SPD Band Indicators
```
⚡ QUICK:  [PC1] [E1]
⚙️ NORMAL: [PC2] [PC3] [E2]
🐌 SLOW:   [Boss]
```

## 5. Asset Requirements

### Core Combat Assets

**Backgrounds:**
- `arena_stone.txt` - Stone combat arena
- `arena_forest.txt` - Forest clearing
- `arena_void.txt` - Dimensional space
- `arena_temple.txt` - Sacred temple grounds

**Character Poses:**
- `character_idle.txt` - Standing ready
- `character_attack.txt` - Attacking pose
- `character_defend.txt` - Defensive stance
- `character_hurt.txt` - Taking damage
- `character_dead.txt` - Defeated state
- `character_cast.txt` - Casting technique

**Boss Variations:**
- `boss_idle.txt` - Large imposing figure
- `boss_attack.txt` - Aggressive pose
- `boss_special.txt` - Ultimate technique

**Effects:**
- `attack_slash.txt` - Melee strike
- `attack_pierce.txt` - Piercing attack
- `attack_blast.txt` - Energy blast
- `effect_heal.txt` - Healing effect
- `effect_buff.txt` - Enhancement aura
- `effect_debuff.txt` - Weakening effect
- `effect_explosion.txt` - Large impact
- `effect_shield.txt` - Protective barrier

**UI Elements:**
- `health_bar_full.txt` - Full HP bar segment
- `health_bar_empty.txt` - Empty bar segment
- `turn_indicator.txt` - Active turn marker
- `target_cursor.txt` - Target selection

## 6. Combat State Mapping

### State → Visual Mapping
```typescript
interface CombatVisualState {
  combatants: Array<{
    id: string;
    position: { x: number; y: number };
    pose: 'idle' | 'attack' | 'defend' | 'hurt' | 'dead';
    hp: { current: number; max: number };
    ae: { current: number; max: number };
    strain: number;
    effects: StatusEffect[];
    isActive: boolean; // current turn
    isTargeted: boolean;
  }>;
  activeEffects: Array<{
    type: 'attack' | 'heal' | 'buff' | 'debuff';
    source: string;
    target: string;
    frame: number; // animation frame
  }>;
  background: string;
  round: number;
  phase: 'quick' | 'normal' | 'slow';
}
```

## 7. Integration Points

### Combat State → ASCII Scene
```typescript
function combatStateToAsciiScene(combatState: CombatState): SceneSpec {
  return {
    background: selectArenaBackground(combatState.location),
    overlays: [
      ...combatState.playerParty.map((pc, i) => ({
        assetName: `character_${pc.pose}`,
        x: 15 + (i * 12),
        y: 6,
        blendMode: 'transparent',
      })),
      ...combatState.enemies.map((enemy, i) => ({
        assetName: `enemy_${enemy.pose}`,
        x: 50 + (i * 15),
        y: 6,
        blendMode: 'transparent',
      })),
      ...getActiveEffectOverlays(combatState.activeEffects),
      ...getStatusBarOverlays(combatState.combatants),
    ],
  };
}
```

### Real-time Updates
```typescript
// On combat action
websocket.send({
  type: 'combat_action',
  action: {
    actor: 'PC1',
    technique: 'Flame Strike',
    target: 'Enemy1',
    result: { damage: 45, critical: false },
  },
});

// Server generates animation sequence
const frames = generateCombatAnimation(action);
frames.forEach((frame, i) => {
  setTimeout(() => {
    broadcastScene(frame, `Combat action frame ${i + 1}`);
  }, i * 200); // 200ms per frame
});
```

## 8. Animation System

### Frame-based Animation
```typescript
interface CombatAnimation {
  id: string;
  type: 'attack' | 'technique' | 'effect';
  frames: string[]; // asset names
  duration: number; // ms per frame
  easing: 'linear' | 'ease-in' | 'ease-out';
}

const SLASH_ATTACK: CombatAnimation = {
  id: 'slash_attack',
  type: 'attack',
  frames: [
    'attack_slash_1',
    'attack_slash_2',
    'attack_slash_3',
    'attack_impact',
  ],
  duration: 150,
  easing: 'ease-out',
};
```

## 9. Performance Considerations

### Optimization Strategies
1. **Asset Preloading**: Load all combat assets on arena entry
2. **Frame Pooling**: Reuse animation frames
3. **Differential Updates**: Only update changed portions
4. **Resolution Scaling**: Adjust detail based on viewport size
5. **Effect Throttling**: Limit simultaneous animations

### Target Performance
- Frame generation: <10ms
- Animation smoothness: 5-10 FPS for ASCII
- State update latency: <50ms
- Full scene render: <30ms

## 10. Responsive Design

### Viewport Sizes
```
Small (mobile):  40x20 chars
Medium (tablet): 80x30 chars
Large (desktop): 120x40 chars
```

### Adaptive Detail
- **Small**: Simplified sprites, essential info only
- **Medium**: Standard sprites, abbreviated effects
- **Large**: Full detail, multiple status bars, extended log

## 11. Accessibility

### Text Alternatives
- Screen reader support for all visual states
- High contrast mode
- Colorblind-friendly indicators
- Text-only combat mode option

### Key Bindings
- `1-9`: Select technique
- `Q/E`: Cycle targets
- `Space`: Confirm action
- `Esc`: Cancel
- `Tab`: View full log

## Implementation Priority

### Phase 1: Core Combat Display
1. ✅ Basic combatant positioning
2. ✅ HP/AE status bars
3. ✅ Simple attack animations (3 frames)
4. ✅ Turn indicator

### Phase 2: Enhanced Visualization
1. Multiple character poses (idle, attack, defend, hurt, dead)
2. Technique-specific effects
3. Status effect indicators
4. Damage numbers overlay

### Phase 3: Advanced Features
1. Smooth animation interpolation
2. Particle effects
3. Screen shake on big hits
4. Victory/defeat sequences

### Phase 4: Polish
1. Sound effect triggers (for audio layer)
2. Camera focus/zoom
3. Replay system
4. Spectator mode

## Testing Requirements

### Visual Regression
- Snapshot tests for each combat pose
- Animation frame sequences
- Layout at different resolutions

### Combat Scenarios
- 1v1, 3v1, 3v3 configurations
- Long battles (10+ rounds)
- Rapid action sequences
- Defeat/victory states

### Performance Benchmarks
- 30 FPS minimum for animations
- <50ms latency for state updates
- <100ms full scene rerender

## Success Metrics

1. **Visual Clarity**: 95%+ tester comprehension of combat state
2. **Performance**: <50ms average frame generation
3. **Smoothness**: Consistent 5-10 FPS animation
4. **Engagement**: Positive feedback on visual impact
5. **Accessibility**: 100% screen reader compatible
