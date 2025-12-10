# WUXUXIANXIA TTRPG - SRD Alpha Structure

## Document Information
- **Type**: System Reference Document (SRD) - Alpha Structure/Template
- **Version**: Alpha v0.0 (Structure Definition)
- **Date**: 2025-12-10
- **Purpose**: Define comprehensive SRD structure for WUXUXIANXIA TTRPG
- **Status**: Template - To be populated in subsequent patches

---

## What is an SRD?

A **System Reference Document (SRD)** is a comprehensive, rules-complete reference for a tabletop roleplaying game. It serves as:

1. **Player Reference** - All rules needed to create characters and play the game
2. **GM Reference** - Guidelines for running sessions, creating encounters, adjudicating edge cases
3. **Designer Reference** - Core mechanics for creating compatible content
4. **Legal Document** - Defines what is "open content" vs. proprietary

### SRD vs. Core Rulebook
- **SRD**: Mechanics-focused, reference format, often open license
- **Core Rulebook**: Includes flavor text, examples, art, tutorials, setting details

This SRD Alpha will be mechanics-focused with essential flavor for Xianxia context.

---

## SRD Structure Overview

The WUXUXIANXIA SRD will follow this structure:

```
0. INTRODUCTION & CORE CONCEPTS
1. CHARACTER CREATION
2. STATS & SOUL CORE LEVEL
3. COMBAT RESOURCES & ACTION ECONOMY
4. CONFLICT TYPES & CONDITIONS
5. TECHNIQUES & EFFECTS
6. EQUIPMENT & ITEMS
7. CULTIVATION & ADVANCEMENT
8. COMBAT RULES
9. NON-COMBAT RULES (Influence, Revelation)
10. GAME MASTER GUIDELINES
11. SETTING & COSMOLOGY (Essential)
12. APPENDICES (Tables, Quick Reference, Glossary)
```

Each section detailed below.

---

## Section 0: Introduction & Core Concepts

### Purpose
Establish what the game is, who it's for, and fundamental principles.

### Contents

#### 0.1 Welcome to WUXUXIANXIA
- **Genre**: Xianxia tactical TTRPG
- **Influences**: Mutants & Masterminds 3e, Fire Emblem, cultivation novels
- **Core Experience**: Tactical combat + cultivation progression + visual novel storytelling

#### 0.2 What You Need to Play
- **Players**: 3-5 recommended, 1 Game Master (GM)
- **Materials**: Character sheets, dice (d20), tokens/miniatures (optional)
- **Time**: 2-4 hours per session

#### 0.3 Core Mechanics Summary
- **D20 Roll Resolution**: Roll d20 + modifier vs. DC or opposed roll
- **Balance Dial**: Soul Core Level (SCL) caps power
- **Resource Management**: THP, AE, Strain, Guard in combat
- **Condition Ladders**: Progressive degradation (4 steps)
- **Cost Tracks**: Blood, Fate, Stain accumulate as optimization consequences

#### 0.4 Key Terminology
- **SCL (Soul Core Level)**: Main balance cap (like Power Level in M&M)
- **CL (Core Level)**: Material refinement (Body + Mind + Soul)
- **SL (Soul Level)**: Spiritual awakening (Control + Fate + Spirit)
- **Sequence**: Cultivation tier/band (Cursed, Low, Mid, High, Transcendent)
- **Pillar**: Conflict type (Violence, Influence, Revelation)
- **PP (Power Points)**: Character creation currency

#### 0.5 Design Philosophy
- **"Power Draws Blood"**: Optimization has costs
- **Simple and Fast**: Complex builds, streamlined play
- **Three Pillars Equal**: Violence, social, and horror equally viable
- **Fiction-First**: Mechanics support story, don't replace it

---

## Section 1: Character Creation

### Purpose
Step-by-step process to create a WUXUXIANXIA character.

### Contents

#### 1.1 Character Creation Overview
**Step 1**: Choose concept and cultivation path
**Step 2**: Determine SCL and Power Point budget
**Step 3**: Purchase Primary Stats (9 stats)
**Step 4**: Purchase Aether Stats (3 stats)
**Step 5**: Calculate derived stats (Core Stats, CL, SL, SCL)
**Step 6**: Choose Power Profile per pillar (Balanced/Blood-Forward/Ward-Forward)
**Step 7**: Distribute offense/defense bands per pillar
**Step 8**: Select techniques and effects
**Step 9**: Choose starting equipment
**Step 10**: Finalize background and details

#### 1.2 Power Point Budget by SCL
Table showing PP allocation at each SCL tier:
- SCL 1: X PP
- SCL 2: X PP
- ...
- SCL 10: X PP
- SCL 11+: X PP

#### 1.3 Starting Cultivation Stage
Map SCL to Sequence band:
- Cursed-Sequence (SCL 1-2)
- Low-Sequence (SCL 3-4)
- Mid-Sequence (SCL 5-7) ← Default starting range
- High-Sequence (SCL 8-10)
- Transcendent (SCL 11+)

#### 1.4 Concept and Path Selection
- **Concept**: One-sentence character idea
- **Cultivation Path**: Orthodox, Demonic, Celestial, Natural, Artifice
- **Background**: Origin, motivation, sect affiliation (if any)

#### 1.5 Playbooks (Optional)
Pre-configured templates:
- Sword Saint
- Body Refiner
- Spirit Channeler
- Fate Weaver
- Shadow Cultivator
- Array Master
- Beast Sovereign
- Pill Alchemist

Each playbook includes:
- Recommended stat distribution
- Starting techniques
- Cultivation path suggestion
- Advancement milestones

---

## Section 2: Stats & Soul Core Level

### Purpose
Define all character statistics and how SCL is calculated.

### Contents

#### 2.1 Primary Stats (9 Stats)
**Range**: -1 to +11
**Cost**: Variable PP per rank based on starting SCL

**Soul Cluster:**
- **Essence**: Raw soul potency, aura presence, mystic pressure
- **Resolve**: Grit, conviction, refusal to yield
- **Presence**: Charisma, command, how people perceive you

**Body Cluster:**
- **Strength**: Lifting, striking power, force output
- **Endurance**: Toughness, stamina, resistance to wear
- **Agility**: Reflexes, movement, fine physical control

**Mind Cluster:**
- **Technique**: Learned skill, trained combat forms, power optimization
- **Willpower**: Mental resilience, focus under pressure, resisting influence
- **Focus**: Precision, aim, channeling without bleed

**Uses**: Primary stats are used for skill checks, resistance saves, and derived calculations.

#### 2.2 Core Stats (3 Derived Stats)
**Not purchased** - Automatically derived:

- **Body Core** = round((Strength + Endurance + Agility) / 3)
- **Mind Core** = round((Technique + Willpower + Focus) / 3)
- **Soul Core** = round((Essence + Resolve + Presence) / 3)

**Uses**: Defense calculations, resistance checks, CL calculation.

#### 2.3 Aether Stats (3 Purchased Stats)
**Range**: -1 to +11
**Cost**: Variable PP per rank (typically higher than Primary Stats)

- **Control**: Command over power output, stability at high ranks
- **Fate**: Destiny entanglement, luck manipulation, story weight
- **Spirit**: Spiritual potency, capacity for celestial/cursed energies

**Uses**: High-tier techniques, supernatural effects, SL calculation.

#### 2.4 Soul Core Level (SCL) Calculation

**Formula**:
```
CL = floor((Body Core + Mind Core + Soul Core) / 3)
SL = floor((Control + Fate + Spirit) / 3)
SCL = CL + SL
```

**Example**:
- Body Core 5, Mind Core 6, Soul Core 4 → CL = 5
- Control 3, Fate 2, Spirit 4 → SL = 3
- SCL = 5 + 3 = 8 (High-Sequence)

#### 2.5 Sequence Rank
SCL determines Sequence band (narrative cultivation tier):

| Sequence Band | SCL Range | Description |
|---------------|-----------|-------------|
| Cursed-Sequence | 1-2 | Collapsing souls, cursed mortals, broken powers |
| Low-Sequence | 3-4 | Street-level empowered, unstable rookies |
| Mid-Sequence | 5-7 | Professional operatives, city-level threats |
| High-Sequence | 8-10 | National heroes, demigods, angels |
| Transcendent | 11+ | Great Old Ones, True Gods, cosmic beings |

#### 2.6 Balance Caps
SCL enforces power limits:

**Per Pillar (Violence, Influence, Revelation):**
- Attack + Effect ≤ 2 × SCL (before Power Profile adjustments)
- Defense + Resilience ≤ 2 × SCL (before Power Profile adjustments)
- Individual stats ≤ SCL + 2

**Omni-Defensive Restriction:**
- Only ONE pillar at full 2 × SCL defense
- At least one other pillar ≤ 1.5 × SCL total defense

---

## Section 3: Combat Resources & Action Economy

### Purpose
Define resources used in combat and action types.

### Contents

#### 3.1 Combat Resources

##### 3.1.1 THP (Total Hit Points)
- **Purpose**: Health pool
- **Reaching 0**: Unconscious/dying
- **Calculation**: Base + (Endurance × modifier) + bought ranks
- **Recovery**: Rest, healing techniques, medical treatment

##### 3.1.2 AE (Action Energy)
- **Purpose**: Technique fuel
- **Regeneration**: X AE per round (based on stats)
- **Maximum**: Purchased at character creation
- **Uses**: Activate techniques, boost effects

##### 3.1.3 Strain
- **Purpose**: Overexertion tracker
- **Maximum**: Based on Endurance
- **Accumulation**: Blocking, forbidden techniques, exceeding limits
- **Reaching Max**: Death/permanent injury
- **Recovery**: Slow (rest between encounters)

##### 3.1.4 Guard
- **Purpose**: Temporary damage absorption
- **Gained From**: Block action, defensive techniques
- **Duration**: Until depleted or encounter ends
- **Mechanics**: Absorbs damage before THP

#### 3.2 Action Economy

##### 3.2.1 Combat Modes

**1-Beat Combat (Simple)**
1. PCs act (any order)
2. NPCs/Boss acts
3. Round ends

**3-Stage Combat (Advanced)**
1. **Stage 1**: Fast SPD actors take Quick Actions
2. **Stage 2**: All actors take Major Actions
3. **Stage 3**: Slow SPD actors take Quick Actions

##### 3.2.2 Action Types

**Major Action** (1 per round, Stage 2):
- Use a technique
- Make a complex maneuver
- Full defense

**Quick Action** (Fast: Stage 1, Slow: Stage 3):
- Strike (basic attack)
- Block (gain Guard, reduce damage)
- Pressure (debuff enemy offense)
- Weaken (debuff enemy defense)
- Empower (buff ally offense)
- Shield (buff ally defense)
- Reposition (move/stance change)

**Free Action** (Unlimited, any time):
- Speak briefly
- Drop held item
- Sustain ongoing effect

#### 3.3 SPD Bands

**Determination**: Based on Agility and techniques
- **Fast**: Acts in Stages 1 and 2
- **Normal**: Acts in Stage 2 only
- **Slow**: Acts in Stages 2 and 3

---

## Section 4: Conflict Types & Conditions

### Purpose
Define three conflict pillars and condition systems.

### Contents

#### 4.1 Three Pillars Overview

**Design Principle**: Violence, Influence, and Revelation are mechanically equal and thematically distinct.

#### 4.2 Violence Pillar (Physical Conflict)

##### 4.2.1 Mechanics
- **Attack Roll**: Violence Attack vs. Body Defense
- **Resistance**: Body Resilience vs. DC 10 + Effect Rank
- **Resource**: Fury pool (positive)
- **Target**: THP, physical conditions

##### 4.2.2 Violence Conditions (4-Step Ladder)
1. **Injured** (1st Degree): -1 to physical actions, recovers with brief rest
2. **Maimed** (2nd Degree): -2 to physical actions, reduced movement, needs medical treatment
3. **Mortally Wounded** (3rd Degree): -3 to physical actions, dying without stabilization
4. **Ruined Body** (4th Degree): Dead, crippled, or maimed beyond ordinary repair

**Recovery**: 
- 1st-2nd Degree: Short rest, healing techniques
- 3rd Degree: Stabilization + extended care
- 4th Degree: Resurrection magic, cybernetics, or narrative resolution

#### 4.3 Influence Pillar (Social Conflict)

##### 4.3.1 Mechanics
- **Attack Roll**: Influence Attack vs. Mind Defense
- **Resistance**: Mind Resilience vs. DC 10 + Effect Rank
- **Resource**: Clout pool (positive)
- **Target**: Reputation, social standing

##### 4.3.2 Influence Conditions (4-Step Ladder)
1. **Rattled** (1st Degree): -1 to social actions, minor reputation damage
2. **Discredited** (2nd Degree): -2 to social actions, publicly questioned
3. **Isolated** (3rd Degree): -3 to social actions, socially exiled
4. **Shattered/Broken** (4th Degree): Publicly ruined, emotionally disconnected, politically sidelined

**Recovery**:
- 1st-2nd Degree: Public apology, favor repayment, time
- 3rd Degree: Major social campaign, powerful ally intervention
- 4th Degree: Narrative resolution (redemption arc, exile, reinvention)

#### 4.4 Revelation Pillar (Horror/Existential Conflict)

##### 4.4.1 Mechanics
- **Attack Roll**: Revelation Attack vs. Soul Defense
- **Resistance**: Soul Resilience vs. DC 10 + Effect Rank
- **Resource**: Insight pool (positive)
- **Target**: Sanity, worldview, spiritual integrity

##### 4.4.2 Revelation Conditions (4-Step Ladder)
1. **Shaken** (1st Degree): -1 to mental actions, disturbing dreams
2. **Haunted** (2nd Degree): -2 to mental actions, persistent visions
3. **Deranged** (3rd Degree): -3 to mental actions, reality distortion
4. **Shattered/Broken** (4th Degree): Catatonia, fugue state, total compromise to entity/pathway

**Recovery**:
- 1st-2nd Degree: Meditation, mental healing techniques, therapy
- 3rd Degree: Exorcism, intervention, existential bargain
- 4th Degree: Narrative resolution (spiritual cleansing, entity bargaining, acceptance)

#### 4.5 Condition Mechanics

##### 4.5.1 Applying Conditions
- Failed resistance check → Apply condition based on degree of failure
- Failure by 1-4: 1st Degree
- Failure by 5-9: 2nd Degree
- Failure by 10-14: 3rd Degree
- Failure by 15+: 4th Degree

##### 4.5.2 Condition Stacking
- Same condition type → Advance to next degree
- Different condition types → Apply both (cumulative penalties)

##### 4.5.3 Death Spiral Prevention
- Conditions cap at 4th Degree (no further progression)
- Penalties apply to specific action types only (not universal)
- Recovery options always available (never "stuck")

---

## Section 5: Techniques & Effects

### Purpose
Define technique structure and core effect framework.

### Contents

#### 5.1 Technique Structure

##### 5.1.1 Technique Anatomy
Every technique has:
- **Name**: Evocative Xianxia-flavored title
- **Type**: Basic / Advanced / Ultimate / Forbidden
- **Cost**: AE required to activate
- **Action**: Major Action / Quick Action / Free Action
- **Range**: Close / Short / Medium / Long / Extreme
- **Target**: Single / Area / Cone / Line / Self
- **Effect**: Mechanical result (damage, condition, buff, etc.)
- **Attack Bonus**: Added to d20 roll
- **Effect Rank**: Difficulty to resist
- **Duration**: Instant / Sustained / Permanent
- **Description**: Narrative flavor

##### 5.1.2 Technique Categories
- **Basic Techniques**: Low AE cost (1-3), bread-and-butter moves
- **Advanced Techniques**: Moderate AE cost (4-7), specialized effects
- **Ultimate Techniques**: High AE cost (8-12), game-changing powers
- **Forbidden Techniques**: Variable cost + mark cost tracks, extremely powerful but dangerous

##### 5.1.3 Building Techniques
Techniques are built from:
- **Base Effect** (Strike, Affliction, Protection, etc.)
- **Extras** (Increased range, area, duration) - Increase cost
- **Flaws** (Reduced range, self-damage, activation time) - Decrease cost
- **Descriptors** (Fire, Ice, Lightning, Shadow, etc.) - Flavor only

#### 5.2 Core Effects Framework

##### 5.2.1 Offensive Effects

**Strike**
- **Balance**: Balanced
- **Pillar**: Violence (adaptable to others)
- **Type**: Attack; Standard Action; Single Target
- **Cost**: 1 PP per rank
- **Mechanics**: Attack vs. Defense → Resistance vs. DC 10 + Rank → Apply condition
- **Degrees**: Injured → Maimed → Mortally Wounded → Ruined Body

**Affliction**
- **Balance**: Balanced to Strong (depends on conditions applied)
- **Type**: Attack; Standard Action; Single/Area Target
- **Cost**: 1-2 PP per rank (varies by condition severity)
- **Mechanics**: Attack vs. Defense → Resistance vs. DC 10 + Rank → Apply custom condition
- **Examples**: Paralysis, Blindness, Fear, Charm

**Weaken**
- **Balance**: Balanced
- **Type**: Attack; Standard Action; Single Target
- **Cost**: 1 PP per rank
- **Mechanics**: Attack vs. Defense → Target's specified trait reduced by rank
- **Examples**: Weaken Strength, Weaken Defense, Weaken Resilience

**Damage**
- **Balance**: Strong (direct THP damage bypasses resistance)
- **Type**: Attack; Standard Action; Single/Area Target
- **Cost**: 2 PP per rank
- **Mechanics**: Attack vs. Defense → Direct THP damage equal to rank (no resistance roll)
- **Use Case**: High burst damage, glass cannon builds

##### 5.2.2 Defensive Effects

**Protection**
- **Balance**: Balanced
- **Type**: Passive/Sustained
- **Cost**: 1 PP per rank
- **Mechanics**: Reduce incoming damage by rank before applying to THP
- **Stacks**: With armor and natural defenses

**Immunity**
- **Balance**: Strong to Overpowered (depends on breadth)
- **Type**: Passive
- **Cost**: Variable (1-5 PP per rank depending on immunity type)
- **Mechanics**: Completely negate specified effect type
- **Examples**: Immunity to Fire, Immunity to Mind Control

**Regeneration**
- **Balance**: Balanced to Strong
- **Type**: Passive/Sustained
- **Cost**: 2 PP per rank
- **Mechanics**: Recover rank × 5 THP per round
- **Drawback**: Cannot regenerate 4th Degree conditions without narrative resolution

**Enhanced Defense**
- **Balance**: Balanced
- **Type**: Passive
- **Cost**: 1 PP per rank
- **Mechanics**: Increase specific defense by rank
- **Examples**: Enhanced Body Defense, Enhanced Mind Defense

##### 5.2.3 Support Effects

**Boost**
- **Balance**: Balanced
- **Type**: Standard Action; Single/Area Target
- **Cost**: 1 PP per rank
- **Mechanics**: Increase target's specified trait by rank for duration
- **Examples**: Boost Strength, Boost Attack, Boost Defense

**Healing**
- **Balance**: Balanced
- **Type**: Standard Action; Single/Area Target
- **Cost**: 2 PP per rank
- **Mechanics**: Target recovers rank × 10 THP
- **Limit**: Cannot heal 4th Degree conditions without additional effects

**Sustained**
- **Balance**: Niche (modifier for other effects)
- **Type**: Modifier
- **Cost**: +1 PP per rank (applied to base effect)
- **Mechanics**: Effect persists for duration without requiring additional actions

**Area**
- **Balance**: Strong (modifier for other effects)
- **Type**: Modifier
- **Cost**: +1 PP per rank (applied to base effect)
- **Mechanics**: Effect targets all entities within area
- **Shapes**: Burst (radius), Cone, Line, Shapeable

##### 5.2.4 Utility Effects

**Movement**
- **Balance**: Niche to Balanced
- **Type**: Various
- **Cost**: Variable
- **Examples**: Flight, Teleportation, Wall-Walking, Super-Speed

**Senses**
- **Balance**: Niche
- **Type**: Passive
- **Cost**: 1 PP per sense type
- **Examples**: Darkvision, Tremorsense, Mind Reading, Precognition

**Feature**
- **Balance**: Niche
- **Type**: Passive
- **Cost**: 1 PP
- **Examples**: Hidden Presence, Quick Change, Immortality (plot device)

#### 5.3 Technique Examples

##### 5.3.1 Basic Technique Example
**Crimson Fist Strike**
- **Type**: Basic
- **Cost**: 2 AE
- **Action**: Major Action
- **Range**: Close
- **Target**: Single enemy
- **Effect**: Strike (Violence pillar)
- **Attack Bonus**: +5
- **Effect Rank**: 3
- **Description**: Channel qi into your fist for a devastating close-range strike. Crimson energy flares around your hand as you strike.

##### 5.3.2 Advanced Technique Example
**Severing Void Blade**
- **Type**: Advanced
- **Cost**: 6 AE
- **Action**: Major Action
- **Range**: Medium
- **Target**: Line (5 targets max)
- **Effect**: Strike (Violence) + Weaken Defense
- **Attack Bonus**: +7
- **Effect Rank**: 5
- **Description**: Slash through space itself, creating a void blade that strikes all enemies in a line. Those hit have their defenses sundered.

##### 5.3.3 Ultimate Technique Example
**Heaven-Rending Emperor's Wrath**
- **Type**: Ultimate
- **Cost**: 12 AE
- **Action**: Major Action (Full Round to charge)
- **Range**: Extreme
- **Target**: Area (Large Burst)
- **Effect**: Damage + Affliction (Paralysis)
- **Attack Bonus**: +10
- **Effect Rank**: 8
- **Description**: Gather celestial energy and unleash it as a pillar of divine wrath. All enemies in the area take massive damage and may be paralyzed by the overwhelming power.

##### 5.3.4 Forbidden Technique Example
**Soul-Devouring Demonic Art**
- **Type**: Forbidden
- **Cost**: 8 AE + Mark Stain Track
- **Action**: Major Action
- **Range**: Close
- **Target**: Single enemy
- **Effect**: Damage + Drain (Steal THP)
- **Attack Bonus**: +12
- **Effect Rank**: 10
- **Description**: Forbidden demonic technique that devours the target's soul essence. Deal massive damage and steal their life force to heal yourself. Corrupts your soul with each use.
- **Warning**: Each use marks Stain track. At threshold, face personality corruption.

---

## Section 6: Equipment & Items

### Purpose
Define equipment, artifacts, and cultivation resources.

### Contents

#### 6.1 Mundane Equipment
- **Weapons**: Swords, spears, bows, etc. (mostly flavor in high-cultivation settings)
- **Armor**: Robes, plates, etc. (provide Protection effect)
- **Tools**: Crafting materials, poisons, talismans

#### 6.2 Cultivation Resources
- **Spirit Stones**: Currency and cultivation fuel
- **Pills/Elixirs**: Temporary bonuses, recovery items
- **Heavenly Treasures**: Rare materials for breakthroughs

#### 6.3 Artifacts (Magic Items)
- **Mortal-Grade**: Minor bonuses (+1-2)
- **Earth-Grade**: Moderate bonuses (+3-4)
- **Heaven-Grade**: Major bonuses (+5-6)
- **Divine-Grade**: Legendary bonuses (+7-8)

Each artifact has:
- **Type**: Weapon, Armor, Accessory, Consumable
- **Effect**: Mechanical benefit
- **Attunement**: May require resonance with user's cultivation
- **Quirks**: Personality or requirements

#### 6.4 Creating Custom Equipment
Guidelines for GMs to create balanced equipment:
- Equipment bonuses should not exceed SCL caps
- Artifacts can provide effects as "built-in techniques"
- Powerful artifacts should have drawbacks or costs

---

## Section 7: Cultivation & Advancement

### Purpose
Define character progression and breakthrough mechanics.

### Contents

#### 7.1 Experience and Milestones
- **XP-based**: Earn XP per session, spend to increase stats/buy techniques
- **Milestone-based**: Advance at story milestones (recommended)
- **Hybrid**: Combination of both

#### 7.2 Increasing SCL
**Process**:
1. Accumulate cultivation resources
2. Achieve narrative milestone (defeat rival, find treasure, survive tribulation)
3. Undergo breakthrough (mechanical and narrative)
4. Increase CL and/or SL
5. Recalculate SCL and adjust caps

**Breakthrough Challenges**:
- **Heaven Tribulation**: Survive attack from heavens (Violence conflict)
- **Dao Heart Tribulation**: Overcome inner demons (Revelation conflict)
- **Karmic Tribulation**: Resolve past debts (Influence conflict)

#### 7.3 Advancing Stats
- **Primary Stats**: Increase at SCL breakpoints or via training
- **Aether Stats**: Harder to increase, require special resources/techniques
- **Core Stats**: Automatically recalculated

#### 7.4 Learning New Techniques
- **Training**: Spend time and resources to learn from teacher/manual
- **Enlightenment**: Spontaneous insight during conflict
- **Inheritance**: Receive technique from master or treasure

#### 7.5 Cultivation Paths
Each path has unique advancement mechanics:
- **Orthodox**: Steady, balanced progression
- **Demonic**: Fast but marks Stain track
- **Celestial**: Slow but pure (no cost track penalties)
- **Natural**: Environment-dependent bonuses
- **Artifice**: Can craft equipment for bonuses

---

## Section 8: Combat Rules

### Purpose
Detailed combat resolution procedures.

### Contents

#### 8.1 Combat Overview
1. Determine surprise (if any)
2. Roll initiative (determine SPD bands)
3. Begin Round 1
4. Resolve stages/actions in order
5. Apply effects and check for end conditions
6. Begin next round

#### 8.2 Attack Resolution

**Step-by-Step**:
1. Attacker declares technique and target
2. Pay AE cost (if applicable)
3. Roll d20 + Attack Bonus
4. Compare to target's Defense
5. If hit, target rolls resistance (d20 + Resilience vs. DC 10 + Effect Rank)
6. Apply damage/condition based on degree of failure

#### 8.3 Damage Routing

**THP Routing** (most common):
- Damage × (1 - DR) → THP

**Guard Routing**:
- Damage → Guard first
- Overflow → THP

**Strain Routing**:
- Direct Strain accumulation (bypasses DR and Guard)
- Used for forbidden techniques or overexertion

#### 8.4 Quick Actions Details

**Strike**:
- Attack bonus: +Strength or +Agility
- Damage: Low (typically 1d6 + stat)
- No AE cost

**Block**:
- Gain Guard equal to (Endurance × 2)
- Reduce incoming damage by 50% this round
- Accumulate 1 Strain

**Pressure**:
- Target one enemy
- Enemy suffers -2 to attack rolls until your next turn

**Weaken**:
- Target one enemy
- Enemy suffers -2 to defense until your next turn

**Empower**:
- Target one ally
- Ally gains +2 to attack rolls until your next turn

**Shield**:
- Target one ally
- Ally gains +2 to defense until your next turn

**Reposition**:
- Move up to half speed
- Change stance (offensive/defensive/balanced)
- Break engagement without opportunity attack

#### 8.5 Movement and Positioning
- **Range Bands**: Close, Short, Medium, Long, Extreme
- **Movement Speeds**: Based on Agility
- **Difficult Terrain**: Half movement
- **Flying/Teleportation**: Ignore ground obstacles

#### 8.6 Teamwork and Coordination
- **Flanking**: +2 to attack when allies surround enemy
- **Assist Action**: Grant ally +2 to next roll
- **Combined Techniques**: Multiple characters can pool AE for powerful joint attack

#### 8.7 Boss Combat Modifications
- **Multiple Actions**: Bosses act multiple times per round
- **Legendary Resistance**: Auto-succeed on saves (limited uses)
- **Phase Transitions**: Change tactics at HP thresholds
- **Environmental Powers**: Manipulate battlefield

---

## Section 9: Non-Combat Rules (Influence, Revelation)

### Purpose
Rules for social and horror conflicts outside tactical combat.

### Contents

#### 9.1 Influence Conflicts

##### 9.1.1 Social Combat Overview
- Operates similarly to Violence combat but targets reputation/standing
- Uses Clout pool instead of Fury
- Conditions affect social standing, not physical health

##### 9.1.2 Influence Techniques
**Debate**: Logical argument (Mind-based)
**Intimidate**: Threaten/coerce (Presence-based)
**Persuade**: Diplomatic appeal (Presence-based)
**Deceive**: Lies and misdirection (Focus-based)
**Inspire**: Rally support (Presence-based)

##### 9.1.3 Influence Conflicts in Play
- **Political Intrigue**: Maneuvering within sect/court
- **Reputation Attacks**: Spreading rumors, discrediting rivals
- **Mass Persuasion**: Swaying crowds or organizations

#### 9.2 Revelation Conflicts

##### 9.2.1 Horror Combat Overview
- Attacks mental/spiritual stability
- Uses Insight pool
- Conditions reflect sanity degradation

##### 9.2.2 Revelation Triggers
- **Forbidden Knowledge**: Learning truths mortals shouldn't know
- **Eldritch Entities**: Encountering beings beyond comprehension
- **Spiritual Corruption**: Exposure to cursed/demonic energies
- **Existential Crises**: Questioning reality itself

##### 9.2.3 Revelation Techniques
**Mind Assault**: Direct mental attack
**Corruption Aura**: Passive sanity drain
**Truth Revelation**: Force understanding of horrific reality
**Madness Induction**: Drive target to derangement

#### 9.3 Clock System (Non-Tactical Conflicts)
For conflicts that shouldn't use turn-by-turn combat:
- **Progress Clock**: Track advancement toward goal
- **Segments**: 4, 6, or 8 based on difficulty
- **Filling Segments**: Successful skill checks or narrative actions
- **Complications**: Failed checks may add Complication Clocks

---

## Section 10: Game Master Guidelines

### Purpose
GM tools for running WUXUXIANXIA sessions.

### Contents

#### 10.1 Running Combat
- **Balancing Encounters**: Use SCL to match difficulty
- **Varying Challenges**: Mix combat types (Violence, Influence, Revelation)
- **Pacing**: When to use 1-beat vs. 3-stage combat
- **Boss Tactics**: How to make bosses challenging without being unfair

#### 10.2 Awarding Advancement
- **Milestones**: Major story beats (defeat major villain, complete arc)
- **Training Time**: How long between breakthroughs
- **XP Alternative**: 1-3 XP per session, 10 XP = 1 SCL increase

#### 10.3 Adjudicating Edge Cases
- **Combining Effects**: When effects interact unexpectedly
- **Creative Solutions**: Rewarding player ingenuity
- **Houserules**: Common modifications and their impacts

#### 10.4 Creating NPCs and Bosses
- **Quick NPCs**: Use stat blocks without full character creation
- **Boss Templates**: Pre-configured challenge ratings
- **Scaling**: Adjusting encounters on the fly

#### 10.5 Setting Difficulty Classes
**DC Guidelines**:
- Easy: DC 10
- Moderate: DC 15
- Hard: DC 20
- Heroic: DC 25
- Legendary: DC 30

#### 10.6 Handling Cost Tracks
- **When to Mark**: Overuse of glass cannon builds, forbidden techniques, violating principles
- **Thresholds**: At 5, 10, 15 marks, introduce consequences
- **Redemption**: Paths to reduce cost tracks through narrative

---

## Section 11: Setting & Cosmology (Essential)

### Purpose
Essential setting information for running WUXUXIANXIA campaigns.

### Contents

#### 11.1 The Mortal Realm
- **Physical World**: Where most play occurs
- **Sects and Clans**: Power structures
- **Cultivation Resources**: Spirit veins, treasures, pills

#### 11.2 The Realms
- **Spirit Realm**: Higher plane of existence
- **Celestial Realm**: Domain of immortals and gods
- **Cursed Realm**: Corruption and forbidden powers
- **Void Between**: Space between realms

#### 11.3 Cultivation Paths
- **Orthodox Cultivation**: Traditional methods, sect-based
- **Demonic Cultivation**: Fast but corrupting, often solitary
- **Celestial Cultivation**: Divine/angelic powers, heaven-aligned
- **Natural Cultivation**: Harmony with environment, druid-like
- **Artifice Cultivation**: Technology + cultivation hybrid

#### 11.4 Factions
- **Major Sects**: Dominant cultivation schools
- **Noble Clans**: Bloodline-based power
- **Rogue Cultivators**: Independent operators
- **Hidden Societies**: Secret agendas

#### 11.5 Cosmological Threats
- **Heaven Tribulation**: Automated universe response to power
- **Eldritch Entities**: Beings from outside reality
- **Demonic Invasions**: Cursed Realm incursions
- **Karmic Backlash**: Consequences of past actions

---

## Section 12: Appendices

### Purpose
Quick reference materials and supporting content.

### Contents

#### 12.1 Quick Reference Tables

**SCL and Sequence Bands**
| SCL | Sequence | Approximate Power Level |
|-----|----------|------------------------|
| 1-2 | Cursed | Broken mortals |
| 3-4 | Low | Street-level heroes |
| 5-7 | Mid | Professional operatives |
| 8-10 | High | National-level threats |
| 11+ | Transcendent | Gods and cosmic beings |

**Power Point Costs**
| Stat Rank | PP Cost | Cumulative |
|-----------|---------|------------|
| -1 | -1 | -1 |
| 0 | 0 | 0 |
| 1 | 1 | 1 |
| 2 | 2 | 3 |
| 3 | 3 | 6 |
| ... | ... | ... |

**Effect Costs**
| Effect Type | Base Cost | Notes |
|-------------|-----------|-------|
| Strike | 1 PP/rank | Balanced |
| Affliction | 1-2 PP/rank | Depends on condition |
| Protection | 1 PP/rank | Passive defense |
| Boost | 1 PP/rank | Temporary enhancement |

#### 12.2 Sample Characters
Pre-generated characters at SCL 3, 5, 7, 10 for quick play.

#### 12.3 Glossary

**AE**: Action Energy - technique fuel
**CL**: Core Level - material refinement
**PP**: Power Points - character creation currency
**SCL**: Soul Core Level - main balance cap
**SL**: Soul Level - spiritual awakening
**Sequence**: Cultivation tier/band
**Pillar**: Conflict type (Violence, Influence, Revelation)
**Cost Track**: Blood, Fate, or Stain accumulation
**Quick Action**: Low-impact tactical action
**Major Action**: Technique use or complex maneuver

#### 12.4 Index
Alphabetical index of all rules, terms, and mechanics.

#### 12.5 Designer Notes
Insights into design decisions:
- Why SCL replaces PL
- How "Power Draws Blood" emerged
- Balancing three pillars
- Xianxia genre influences

#### 12.6 Compatibility with M&M 3e
For groups familiar with M&M 3e:
- Conversion guidelines
- Mechanical differences
- Thematic differences
- Using M&M supplements

---

## Patch Schedule

This structure document (v0.0) defines WHAT the SRD should cover.

Subsequent patches will populate sections with actual content:

**Patch 0.1**: Sections 0-2 (Introduction, Character Creation, Stats & SCL)
**Patch 0.2**: Sections 3-4 (Combat Resources, Conflict Types & Conditions)
**Patch 0.3**: Sections 5-7 (Techniques, Equipment, Cultivation)
**Patch 0.4**: Sections 8-9 (Combat Rules, Non-Combat Rules)
**Patch 0.5**: Sections 10-12 (GM Guidelines, Setting, Appendices)

After all patches, comprehensive review for v1.0 (Full Edition SRD).

---

## Document Status

- **Type**: Structure Template
- **Completeness**: 100% (structure defined)
- **Content**: 0% (to be populated in patches)
- **Next Step**: Create Patch 0.1 with Sections 0-2

---

## Maintenance Notes

This structure may evolve as content is added:
- Sections may be split if too large
- New sections may be added if needed
- Ordering may be adjusted for clarity

**Update this document when structure changes significantly.**
