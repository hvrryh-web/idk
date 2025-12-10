# Wuxiaxian TTRPG - Design Summary

## Executive Summary

The Wuxiaxian TTRPG is a hybrid system combining Visual Novel storytelling with deep tactical TTRPG combat mechanics, inspired by Mutants & Masterminds 3e but tailored for Xianxia/cultivation fiction. The system emphasizes **power at a cost**, cultivation progression, and three distinct conflict pillars: Violence, Influence, and Revelation.

### Core Design Philosophy

The system is built on the principle that **"Power Draws Blood"** - specialization and optimization come with mechanical costs through cost tracks (Blood, Fate, Stain/Shadow). Characters progress through cultivation stages marked by their Soul Core Level (SCL), which determines their capability bands similar to M&M's Power Level but with distinct cultivation flavor.

## Core Stats and Resources

### Primary Stats (9 Stats, Range: -1 to +11)

**Soul Cluster:**
- **Essence**: Raw soul potency, aura presence, mystic pressure
- **Resolve**: Grit, conviction, refusal to yield
- **Presence**: Charisma, command, how entities perceive you

**Body Cluster:**
- **Strength**: Physical force, striking power
- **Endurance**: Toughness, stamina, wear resistance
- **Agility**: Reflexes, movement, fine control

**Mind Cluster:**
- **Technique**: Learned skill, combat forms, power optimization
- **Willpower**: Mental resilience, focus under pressure
- **Focus**: Precision, channeling without bleed

### Core Stats (3 Derived Stats)

These are **derived, not purchased** to avoid double-paying:
- **Body Core** = round((Strength + Endurance + Agility) / 3)
- **Mind Core** = round((Technique + Willpower + Focus) / 3)
- **Soul Core** = round((Essence + Resolve + Presence) / 3)

### Aether Stats (3 Purchased Stats)

High-tier cultivation stats:
- **Control**: Command over power output, stability at high ranks
- **Fate**: Destiny entanglement, luck, story weight
- **Spirit**: Spiritual potency, celestial/cursed energy capacity

## Soul Core Level (SCL) System

### SCL Calculation

**SCL = CL + SL**

Where:
- **Core Level (CL)** = ⌊(Body Core + Mind Core + Soul Core) / 3⌋ - Material refinement
- **Soul Level (SL)** = ⌊(Control + Fate + Spirit) / 3⌋ - Spiritual awakening
- **Sequence Rank (Seq)** ≈ SCL - The in-world label for cultivation stage

### SCL as Balance Dial

Like M&M's Power Level:
- **Attack bonus + Effect rank ≈ 2 × SCL** per conflict pillar
- **Defense + Resilience ≈ 2 × SCL** per conflict pillar
- Individual stats ≤ SCL + 2

### Sequence Bands (Cultivation Tiers)

| Sequence Band | SCL Range | Fictional Tier |
|---------------|-----------|----------------|
| **Cursed-Sequence** | 1-2 | Collapsing souls, cursed mortals, broken powers |
| **Low-Sequence** | 3-4 | Street-level empowered, unstable rookies |
| **Mid-Sequence** | 5-7 | Professional operatives, city-level threats |
| **High-Sequence** | 8-10 | National/global heroes, demigods, angels |
| **Transcendent** | 11+ | Great Old Ones, True Gods, cosmic entities |

## Combat Resources

### Primary Resources

1. **THP (Total Hit Points)**: Health pool, goes to 0 = unconscious/dying
2. **AE (Action Energy)**: Resource for techniques, regenerates each round
3. **Strain**: Accumulates from overexertion, leads to death at maximum
4. **Guard**: Temporary damage absorption, resets between encounters

### Damage Routing

Three routing types for techniques:
- **THP Routing**: Damage → DR reduction → THP damage
- **Guard Routing**: Damage → Guard → overflow to THP
- **Strain Routing**: Direct strain accumulation

### SPD Bands (3-Stage Combat)

For advanced turn ordering:
- **Fast**: Acts in Stage 1 (Quick Actions) and Stage 2 (Major Actions)
- **Normal**: Acts in Stage 2 only
- **Slow**: Acts in Stage 2 and Stage 3 (Quick Actions)

## Three Conflict Pillars

### 1. Violence Conflicts

**Target**: Body Defense (BD)
**Mechanics**: Physical combat, destructive powers
**Condition Track**: Wounded → Crippled → Downed → Ruined Body

### 2. Influence Conflicts

**Target**: Mind Defense (MD)
**Mechanics**: Social, political, psychological pressure
**Condition Track**: Shaken → Compromised → Subjugated → Shattered/Broken

### 3. Revelation Conflicts

**Target**: Soul Defense (SD)
**Mechanics**: Horror, forbidden knowledge, metaphysical strain
**Condition Track**: Disturbed → Fractured → Unhinged → Shattered/Broken

**Note**: Mind and Soul share the 4th-degree "Shattered/Broken" state, requiring major narrative intervention (exorcisms, interventions, reputation campaigns) to reverse.

## Skills, Attacks, and Techniques

### Technique Structure

Techniques are the primary mechanical unit of combat actions:

**Core Properties:**
- **Damage Type**: THP, Guard, or Strain routing
- **AE Cost**: Energy expenditure
- **Self-Strain**: Cost to user's strain track
- **Effect Rank**: Power level (capped by SCL)
- **Attack Bonus**: To-hit modifier (capped by SCL)
- **Special Effects**: DR debuffs, conditions, buffs

### Quick Actions (3-Stage Combat)

Strategic options available in Quick Action phases:
1. **Guard Shift**: Increase Guard value
2. **Dodge**: Temporarily boost DR
3. **Brace**: Increase both Guard and DR
4. **AE Pulse**: Gain extra AE
5. **Strain Vent**: Reduce Strain
6. **Stance Switch**: Adjust DR (offensive/defensive)
7. **Counter Prep**: Prepare for counter-attacks

### Technique Design Categories

From strongest to weakest (M&M Character Guide taxonomy):
- **Broken**: Game-breaking, banned in balanced play
- **Overpowered**: Clearly superior, needs GM approval
- **Strong**: Above baseline, limited availability
- **Balanced**: Core design target
- **Niche**: Situational but valuable
- **Weak**: Rarely worth taking
- **Useless**: Never take

## Cultivation Concepts

### Aether Core Sequence

The Aether Core represents a character's cultivation refinement level, calculated from their combined stats. It's both a mechanical rating and a narrative marker of their place in the cultivation hierarchy.

### Cost Tracks: Power Draws Blood

**Blood Track**: Physical strain, self-harm, bodily toll
- Marks when using Blood-Forward combat profiles
- High Blood → auto-apply Wounded condition
- Represents "body breaks before the battle ends"

**Fate Track**: Destiny debt, bad luck, entity obligations
- Marks when manipulating probability or taking destiny shortcuts
- High Fate → narrative complications, entity interventions
- Represents "the universe settles accounts"

**Stain/Shadow Track**: Corruption, moral erosion, loss of self
- Marks when using morally questionable powers or forbidden techniques
- High Stain → personality shifts, corruption manifestations
- Represents "power changes who you are"

### Power Profiles (±2 Trade-offs)

Each conflict pillar allows choosing an offensive/defensive balance:

**Blood-Forward (Glass Cannon):**
- Offense cap: 2 × SCL + 2
- Defense cap: 2 × SCL - 2
- Mark Blood track when exceeding standard caps

**Ward-Forward (Tank):**
- Offense cap: 2 × SCL - 2
- Defense cap: 2 × SCL + 2
- Mark Fate track (destiny protects you)

**Balanced:**
- Both at 2 × SCL standard

## Key Mechanical Pillars

1. **SCL-Based Caps**: All offensive and defensive stats scale with Soul Core Level
2. **Stance and Positioning**: SPD bands and Quick Actions create tactical depth
3. **Tempo Management**: AE regeneration, Strain accumulation, Guard cycling
4. **Cultivation Stages**: Clear progression through Sequence bands
5. **Cost Tracks**: Power optimization comes with narrative and mechanical costs
6. **Three Conflict Types**: Violence, Influence, and Revelation are equally supported
7. **Condition Ladders**: 4-step degradation tracks per conflict type
8. **Risk-Reward**: Glass cannon builds are powerful but fragile

## Non-Negotiable Design Constraints

### Balance Philosophy
- No "Broken" or "Overpowered" effects in core balanced play
- Specialization through ±2 trade-offs, not through stacking bonuses
- Cost tracks must matter mechanically and narratively
- 4th-degree conditions require major story beats to resolve

### Cultivation Fiction
- Higher SCL must feel like terrifying presence, not just bigger numbers
- Sequence bands must map to narrative weight in the world
- Aether stats unlock high-tier play without invalidating Core stats

### Power at Cost
- Optimization is allowed but comes with Blood/Fate/Stain marks
- No "free" power increases beyond SCL-based caps
- Cost tracks create long-term consequences, not just scene-level penalties

### Unified Resolution
- All three conflict pillars use d20 + modifier vs DC
- Degrees of success determine condition application
- Same mechanical framework for combat, social, and horror

### Playbook Accessibility
- Strong playbooks with build guidance for quick character creation
- Pure point-buy available for M&M veterans
- Playbooks tuned to Balanced/Strong power level, not Overpowered

## Design Intent vs. Implementation Needs

The system requires:
1. **Data-Driven Techniques**: Techniques should be defined in JSON/database, not hardcoded
2. **Clear Terminology**: Use Wuxiaxian terms (SCL, AE, Strain) consistently
3. **Separation of Concerns**: VN narrative layer separate from TTRPG simulation engine
4. **Extensibility**: Easy to add new techniques, cultivation stages, cost track types
5. **Testability**: Combat engine functions should be deterministic and unit-testable
6. **Monte Carlo Support**: Simulation engine for balance testing party compositions

## Summary: The Wuxiaxian Feel

This is a game about:
- **Cultivation as optimization puzzle**: Building your character within SCL constraints
- **Power's terrible price**: Blood, Fate, and Stain tracks enforce consequences
- **Three pillars of conflict**: Combat, social, and horror are equally dangerous
- **Narrative stakes**: 4th-degree conditions reshape character arcs
- **Xianxia tropes**: Sequence hierarchies, cultivation stages, soul-based powers
- **Tactical combat**: SPD bands, Quick Actions, resource management
- **Risk-reward combat**: Glass cannons vs tanks, all viable but different
