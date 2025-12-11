# Dueling System - High-Detail ASCII Specification

## Overview
Dueling system provides enhanced ASCII visualization for 1v1 combat encounters with significantly higher detail than general combat scenes. Optimized for dramatic confrontations with cinematic presentation.

## Dueling vs General Combat

### Key Differences

| Aspect | General Combat | Dueling |
|--------|---------------|---------|
| Participants | 3v3, 3v1, party battles | Strictly 1v1 |
| Character Size | 3x3 chars (simple) | 7x9 chars (detailed) |
| Arena Size | 63x8 (compact) | 100x25 (expansive) |
| Detail Level | Low (efficiency) | High (drama) |
| Effects | Simple (3x3) | Complex (9x9) |
| Update Rate | 5 FPS | 10 FPS |
| Animation Frames | 3-4 per action | 6-8 per action |

## High-Detail Character Design

### Detailed Character Poses (7x9)

**Idle Stance:**
```
    ___
   /   \
  |  o  |
   \ ^ /
    |H|
   /|||\\
  / ||| \\
    | |
   /| |\\
  / | | \\
```

**Attack Pose:**
```
    ___
   /   \
  |  o→→→
   \═══╗
    |H║≫
   /║║║\\
  /═║║║═\\
    ║ ║
   /║ ║\\
  /═║═║═\\
```

**Defensive Stance:**
```
  ╔═════╗
  ║  ___║
  ║ /   \
  ║| [◘] |
  ║ \═══/
  ║  |H|
  ║ /|||\\
  ║/ ||| \\
  ║  | |
  ╚══╧═╧═╝
```

**Charging Technique:**
```
    ⚡___⚡
  ✦/   \✦
 ✦| ◉ ◉ |✦
  ✦\|█|/✦
   ✦|H|✦
  ✦/|||\\✦
 ✦/ ||| \\✦
   ✦| |✦
  ✦/| |\\✦
```

**Taking Damage:**
```
    ___
   /XXX\
  | >O< |
   \VVV/
    ║H║
   /\\|//\\
  ╱ \\|// ╲
    ╱ ╲
   // \\\\
  //   \\\\
```

**Victorious:**
```
  ★ ___ ★
   /\\O/\\
  | \\|/ |
   \\_|_/
  ══|H|══
   /|||\\
  / |║| \\
    |║|
   /|║|\\
  ★ | | ★
```

**Defeated:**
```
    ___
   /×××\\
  |  ×  |
   \\_×_/
     ╳
    /╳\\
   / ╳ \\
   ╱ ╳ ╲
  ╱     ╲
 ════════
```

## Dueling Arena Design (100x25)

### Full Arena Layout
```
════════════════════════════════════════════════════════════════════════════════════════════════════
║                                    ⚔  DUEL ARENA  ⚔                                            ║
║                                                                                                 ║
║  ╔══════════════╗                                                        ╔══════════════╗      ║
║  ║  CHALLENGER  ║                                                        ║   DEFENDER   ║      ║
║  ║              ║                                                        ║              ║      ║
║  ║   HP: ████   ║                                                        ║   HP: ████   ║      ║
║  ║   AE: ████   ║                                                        ║   AE: ████   ║      ║
║  ║   ST: ██░░   ║                                                        ║   ST: ██░░   ║      ║
║  ╚══════════════╝                                                        ╚══════════════╝      ║
║                                                                                                 ║
║      ___                                                                        ___             ║
║     /   \                                                                      /   \            ║
║    |  o  |                                                                    |  o  |           ║
║     \ ^ /                        ═════════════                                 \ ^ /            ║
║      |H|                                                                        |H|             ║
║     /|||\\                                                                      /|||\\            ║
║    / ||| \\                                                                    / ||| \\           ║
║      | |                                                                        | |             ║
║     /| |\\                                                                      /| |\\            ║
║    / | | \\                                                                    / | | \\           ║
║                                                                                                 ║
║                                    [ROUND 1]                                                    ║
║                                                                                                 ║
════════════════════════════════════════════════════════════════════════════════════════════════════
```

### Compact Duel View (80x20) - For tablet/smaller screens
```
════════════════════════════════════════════════════════════════════════════════
║                        ⚔  DUEL  ⚔                                          ║
║  ┌────────────┐                                      ┌────────────┐        ║
║  │ CHALLENGER │                                      │  DEFENDER  │        ║
║  │ HP: ████   │                                      │ HP: ████   │        ║
║  │ AE: ████   │                                      │ AE: ████   │        ║
║  └────────────┘                                      └────────────┘        ║
║                                                                             ║
║     ___                                                    ___              ║
║    /   \                                                  /   \             ║
║   |  o  |               ═══════════                      |  o  |            ║
║    \^/                                                     \^/              ║
║     |H|                                                     |H|             ║
║    /|||\\                                                   /|||\\            ║
║                                                                             ║
║                            [ROUND 1]                                        ║
║                                                                             ║
════════════════════════════════════════════════════════════════════════════════
```

## High-Detail Effects

### Sword Slash (9x9)
```
    ╲    ╱
     ╲  ╱
   ═══╲╱═══
      ╳╳
     ╱╳╳╲
    ╱  ╳  ╲
   ╱   ╳   ╲
  ═════╳═════
       ╳
```

### Energy Blast (9x9)
```
   ⚡════⚡
  ⚡  ╔══╗  ⚡
 ⚡  ║▓▓▓▓║  ⚡
⚡   ║▓█▓▓║   ⚡
⚡   ║▓▓█▓║   ⚡
⚡   ║▓▓▓▓║   ⚡
 ⚡  ╚══╝  ⚡
  ⚡      ⚡
   ⚡════⚡
```

### Critical Hit Impact (11x11)
```
  ★ ═══════ ★
 ╱ ╲  ███  ╱ ╲
★   ★ ███ ★   ★
 ╲ ╱ █████ ╲ ╱
  ★ ███████ ★
 ═══███████═══
  ★ ███████ ★
 ╱ ╲ █████ ╱ ╲
★   ★ ███ ★   ★
 ╲ ╱  ███  ╲ ╱
  ★ ═══════ ★
```

### Healing Aura (9x9)
```
  ✧ ╱ │ ╲ ✧
 ✧ ╱  │  ╲ ✧
✧ │   ♥   │ ✧
 ✧ ╲  │  ╱ ✧
  ✧ ╲ │ ╱ ✧
 ✧ ── ♥ ── ✧
✧ │   │   │ ✧
 ✧ ╲  │  ╱ ✧
  ✧ ╲ │ ╱ ✧
```

## Enhanced Status Display

### Detailed Status Panel
```
╔══════════════════════════════════╗
║        COMBATANT NAME           ║
╠══════════════════════════════════╣
║ HP: ████████████████░░░░ 240/300║
║ AE: ████████████░░░░░░░░ 180/250║
║ ST: ████░░░░░░░░░░░░░░░░  40/200║
║ GD: ████████░░░░░░░░░░░░  80/150║
╠══════════════════════════════════╣
║ ATK: 85  │ DEF: 72  │ SPD: 68  ║
║ DR: 0.35 │ Crit: 15%│ Eva: 10% ║
╠══════════════════════════════════╣
║ STATUS EFFECTS:                  ║
║ ⚡ Empowered (3 rounds)          ║
║ 🛡️ Fortified (2 rounds)          ║
╚══════════════════════════════════╝
```

### Damage Number Overlay
```
       ╔═══════╗
       ║ -125  ║  ← Damage dealt
       ║ CRIT! ║  ← Critical indicator
       ╚═══════╝
           ↓
         [Enemy]
```

## Animation Sequences

### Attack Animation (8 frames @ 100ms each)
```
Frame 1: [Attacker]    Idle          [Defender]    Idle
Frame 2: [Attacker]    Wind-up       [Defender]    Idle
Frame 3: [Attacker]    Lunge    →    [Defender]    Idle
Frame 4: [Attacker]    Strike   ═══→ [Defender]    Brace
Frame 5: [Attacker]    Impact   ×××→ [Defender]    Hit!
Frame 6: [Attacker]    Recoil   ←    [Defender]    Damage
Frame 7: [Attacker]    Recover       [Defender]    Hurt
Frame 8: [Attacker]    Idle          [Defender]    Idle
```

### Technique Cast Animation (6 frames @ 150ms each)
```
Frame 1: Character idle
Frame 2: Character raises arms, sparkles appear
Frame 3: Energy gathers (glow effect)
Frame 4: Maximum charge (bright aura)
Frame 5: Release (projectile/effect travels)
Frame 6: Impact and resolution
```

## Duel-Specific Features

### 1. Dramatic Camera Focus
- Zoom in on active combatant during their turn
- Highlight active character with border/glow
- Dim inactive character slightly

### 2. Cinematic Effects
- Screen shake on critical hits
- Slow-motion text for dramatic moments
- Victory/defeat screen transitions

### 3. Move Preview
```
╔═══════════════════════════════════╗
║  TECHNIQUE: Heavenly Sword Strike ║
╠═══════════════════════════════════╣
║  Cost: 45 AE                      ║
║  Damage: 85-120 (Physical)        ║
║  Routing: THP                     ║
║  Effect: 30% chance to stun       ║
╠═══════════════════════════════════╣
║  [CONFIRM]      [CANCEL]          ║
╚═══════════════════════════════════╝
```

### 4. Combo Counter
```
╔══════════╗
║  COMBO!  ║
║   x3     ║
╚══════════╝
```

### 5. Round Transition
```
════════════════════════════════════
         ROUND 2 BEGIN!
════════════════════════════════════
```

## Performance Targets

### Dueling-Specific Metrics
- **Character detail**: 7x9 (63 chars) vs 3x3 (9 chars) standard
- **Effect detail**: 9x9 (81 chars) vs 3x3 (9 chars) standard
- **Arena size**: 100x25 (2,500 chars) vs 63x8 (504 chars) standard
- **Animation FPS**: 10 FPS (smooth) vs 5 FPS (standard)
- **Frame generation**: Target <15ms per frame
- **Total scene size**: ~3,000 characters
- **Update latency**: Target <30ms
- **Asset preload**: All duel assets loaded at duel start (~200ms)

## Responsive Breakpoints

### Desktop (100x25) - Full Detail
- High-detail characters (7x9)
- Large arena with ornate borders
- Complete status panels
- Full effect animations

### Tablet (80x20) - Medium Detail
- Medium-detail characters (5x7)
- Compact arena
- Condensed status panels
- Simplified effects

### Mobile (60x15) - Low Detail
- Simple characters (3x3)
- Minimal arena
- Basic status bars only
- Essential effects only

## Asset Requirements for Dueling

### Character Sets (Per Fighter)
1. `duel_char_{name}_idle_hd.txt` (7x9)
2. `duel_char_{name}_attack_hd.txt` (7x9)
3. `duel_char_{name}_defend_hd.txt` (7x9)
4. `duel_char_{name}_cast_hd.txt` (7x9)
5. `duel_char_{name}_hurt_hd.txt` (7x9)
6. `duel_char_{name}_victory_hd.txt` (7x9)
7. `duel_char_{name}_defeat_hd.txt` (7x9)

### Effect Sets
1. `duel_effect_slash_hd.txt` (9x9)
2. `duel_effect_pierce_hd.txt` (9x9)
3. `duel_effect_blast_hd.txt` (9x9)
4. `duel_effect_explosion_hd.txt` (11x11)
5. `duel_effect_heal_hd.txt` (9x9)
6. `duel_effect_buff_hd.txt` (9x9)
7. `duel_effect_crit_hd.txt` (11x11)

### Arena Backgrounds
1. `duel_arena_sacred.txt` (100x25)
2. `duel_arena_void.txt` (100x25)
3. `duel_arena_forest.txt` (100x25)
4. `duel_arena_throne.txt` (100x25)

### UI Elements
1. `duel_statusbar_detailed.txt`
2. `duel_damage_overlay.txt`
3. `duel_combo_indicator.txt`
4. `duel_round_banner.txt`

## Integration with Combat System

### Duel Detection
```typescript
function isDuelScenario(combatState: CombatState): boolean {
  const playerCount = combatState.playerParty.filter(p => p.isAlive()).length;
  const enemyCount = combatState.enemies.filter(e => e.isAlive()).length;
  return playerCount === 1 && enemyCount === 1;
}
```

### Automatic Switching
```typescript
if (isDuelScenario(combatState)) {
  return generateDuelScene(combatState, resolution);
} else {
  return generateStandardCombatScene(combatState, resolution);
}
```

## Success Criteria

1. **Visual Impact**: Duels should feel significantly more dramatic than general combat
2. **Performance**: Maintain 10 FPS animation even with high detail
3. **Clarity**: Enhanced detail should improve readability, not clutter
4. **Responsiveness**: Smooth transitions between frames
5. **Scalability**: Graceful degradation on smaller screens

## Implementation Priority

### Phase 1: Core Dueling System (Current)
1. ✅ High-detail character poses (7x9)
2. ✅ Enhanced effect library (9x9, 11x11)
3. ✅ Duel-specific arena (100x25)
4. ✅ Detailed status panels

### Phase 2: Animation & Polish
1. Multi-frame attack sequences (8 frames)
2. Smooth transitions
3. Camera effects
4. Screen shake

### Phase 3: Advanced Features
1. Combo counter
2. Move preview system
3. Victory/defeat cinematics
4. Replay system
