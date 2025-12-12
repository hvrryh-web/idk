# WUXUXIANXIA TTRPG - Unified System Reference Document

## Document Information
- **Version**: Alpha v0.3
- **Patch ID**: ALPHA-0.3-20251212
- **Date**: 2025-12-12
- **Status**: Alpha Release - Unified SRD
- **Completeness**: 55% (7 of 12 sections)
- **Purpose**: Unified, comprehensive game reference combining all alpha patches

---

# Patch Notes History

## Live Patch: ALPHA-0.3-20251212

**Status**: 🟢 LIVE

### What's New in v0.3
- **Unified SRD**: Combined all previous patches into single comprehensive document
- **Complete Cap System**: Full OffCap/DefCap math with 4×SCL formula
- **Power Draws Blood Profiles**: Balanced, Blood-Forward, Ward-Forward options
- **Layered Durability**: Resolve Charges + DR Tiers system
- **Meta-Currency System**: Fury/Clout/Insight pools with spend/generate rules
- **Cost Track Integration**: Blood/Fate/Stain tracks with box counts
- **Boss Scaling**: Ranks 1-5 with multipliers and multi-stage support
- **OVR/DVR Mapping**: HERO-style combat values for to-hit/to-be-hit

### Changes from v0.2
- Rescaled cap formula from 2×SCL to 4×SCL for finer granularity
- Added Resolve Charges as damage buffer layer
- Formalized SCP (Soul Core Points) as character creation currency
- Added OVR/DVR terminology alongside Attack/Defense

---

## Patch History Index

| Patch ID | Date | Status | Sections | Description |
|----------|------|--------|----------|-------------|
| ALPHA-0.3-20251212 | 2025-12-12 | 🟢 LIVE | 0-8 + Appendices | Unified SRD with caps, durability, meta-currencies |
| ALPHA-0.2-20251210 | 2025-12-10 | 📦 Archived | 3-4 | Combat Resources, Conflict Types |
| ALPHA-0.1-20251210 | 2025-12-10 | 📦 Archived | 0-2 | Introduction, Character Creation, Stats |
| ALPHA-0.0-20251210 | 2025-12-10 | 📦 Archived | Structure | SRD Structure Definition |

### Archived Patch Locations
- `SRD_ALPHA_PATCH_0.1.md` - Original Sections 0-2
- `SRD_ALPHA_PATCH_0.2.md` - Original Sections 3-4
- `SRD_ALPHA_STRUCTURE.md` - Structure template

---

## Upcoming Patches

| Patch ID | Target | Sections | Description |
|----------|--------|----------|-------------|
| ALPHA-0.4 | TBD | 9-10 | Techniques & Effects, Equipment |
| ALPHA-0.5 | TBD | 11-12 | GM Guidelines, Setting & Cosmology |
| BETA-1.0 | TBD | All | Full playtest release |

---

# Table of Contents

1. [Introduction & Core Concepts](#section-0-introduction--core-concepts)
2. [Character Creation](#section-1-character-creation)
3. [Stats & Soul Core Level](#section-2-stats--soul-core-level)
4. [Combat Resources & Action Economy](#section-3-combat-resources--action-economy)
5. [Conflict Types & Conditions](#section-4-conflict-types--conditions)
6. [Caps, Tradeoffs & Power Draws Blood](#section-5-caps-tradeoffs--power-draws-blood)
7. [Durability Model & Damage Reduction](#section-6-durability-model--damage-reduction)
8. [Meta-Currencies & Cost Tracks](#section-7-meta-currencies--cost-tracks)
9. [Boss Scaling Guidelines](#section-8-boss-scaling-guidelines)
10. [Quick Reference Tables](#appendix-a-quick-reference-tables)
11. [Glossary](#appendix-b-glossary)

---

# Section 0: Introduction & Core Concepts

## 0.1 Welcome to WUXUXIANXIA

### What Is This Game?

**WUXUXIANXIA** is a hybrid Visual Novel + Tactical TTRPG that combines:
- **Deep tactical combat** inspired by Fire Emblem and Mutants & Masterminds 3e
- **Cultivation progression** from Xianxia literature (Cradle, I Shall Seal the Heavens, etc.)
- **Visual Novel storytelling** with character-driven narratives
- **Three conflict types** - Violence, social intrigue, and existential horror are all equally viable

### Genre and Setting

You play as **cultivators** - individuals who refine their body, mind, and soul to transcend mortal limitations. Through discipline, tribulation, and the accumulation of spiritual power, cultivators climb from street-level empowered individuals to national heroes, demigods, and eventually cosmic entities that reshape reality itself.

### Core Experience

**At the table, you will:**
- Build complex characters with unique cultivation paths
- Engage in tactical turn-based combat with meaningful resource management
- Progress through cultivation stages, each breakthrough a hard-won achievement
- Face violence, social manipulation, and existential horror
- Pay costs for power - optimization comes with consequences
- Tell stories of ambition, sacrifice, and transcendence

---

## 0.2 What You Need to Play

### People
- **3-5 Players** recommended (can work with 2-6)
- **1 Game Master (GM)** to run the world and opposition

### Materials
- **Character Sheets** (provided or digital)
- **D20 dice** (one per player minimum, multiple recommended)
- **Tokens or miniatures** (optional but helpful for tactical combat)
- **Combat tracking sheet** (for THP, AE, Strain, Guard)

### Time
- **Session Length**: 2-4 hours per session
- **Campaign Length**: Varies - short arcs (4-6 sessions) or long campaigns (20+ sessions)

---

## 0.3 Core Mechanics Summary

### Roll Resolution

**d20 + modifier vs. Difficulty Class (DC)**

- **Natural 1**: Always failure (even if total exceeds DC)
- **Natural 20**: Always success (even if total below DC)
- **Success by 5+**: Extra success (critical hit, or additional effect)
- **Failure by 5+**: Extra failure (fumble, or worsened consequence)

**Opposed Rolls**: Both sides roll d20 + modifier; highest wins.

### The Balance Dial: Soul Core Level (SCL)

**SCL is the hidden number that caps your power.**

Similar to Mutants & Masterminds' Power Level (PL), SCL determines:
- How high your attack and effect ranks can be
- What your maximum defenses can reach
- Roughly how dangerous you are compared to others

**Key Formula**: `Attack Bonus + Effect Rank ≈ 2 × SCL` per conflict type

**SCL ranges**:
- SCL 1-2: Cursed-Sequence (broken, collapsing)
- SCL 3-4: Low-Sequence (street-level)
- SCL 5-7: Mid-Sequence (professional, city-level)
- SCL 8-10: High-Sequence (national heroes, demigods)
- SCL 11+: Transcendent (gods, cosmic entities)

### HERO-Style Combat Values

The system uses **OVR/DVR ratings** inspired by HERO System's OCV/DCV:

| Term | Full Name | Meaning | HERO Analogue |
|------|-----------|---------|---------------|
| **OVR** | Offense Value Rating | To-hit bonus / attack accuracy | OCV |
| **DVR** | Defense Value Rating | Defense / evade value | DCV |
| **MCV** | Mental Combat Value | Mental attack/defense | OMCV/DMCV |

**OVR and DVR** are calculated per pillar (Violence, Influence, Revelation) and work within the cap system.

---

## 0.4 Key Terminology

### Character Statistics

**Primary Stats (9 total)**:
- **Soul Cluster**: Essence, Resolve, Presence
- **Body Cluster**: Strength, Endurance, Agility
- **Mind Cluster**: Technique, Willpower, Focus
- Range: -1 to +11

**Core Stats (3 total)**:
- **Body Core**, **Mind Core**, **Soul Core**
- Automatically derived (average of their cluster's Primary Stats)

**Aether Stats (3 total)**:
- **Control**, **Fate**, **Spirit**
- High-tier cultivation stats, purchased separately

### Progression Terms

**SCL (Soul Core Level)**:
- Main balance cap
- Formula: `SCL = CL + SL`
- Determines power band

**CL (Core Level)**:
- Formula: `CL = floor((Body Core + Mind Core + Soul Core) / 3)`
- Represents material refinement

**SL (Soul Level)**:
- Formula: `SL = floor((Control + Fate + Spirit) / 3)`
- Represents spiritual awakening

---

## 0.5 Design Philosophy

### "Power Draws Blood"

**Core principle**: Optimization and specialization come with mechanical costs.

You can build a glass cannon (high attack, low defense), but you'll mark your **Blood Track** and face consequences. You can manipulate fate for guaranteed success, but you'll mark your **Fate Track** and owe the universe. You can use forbidden demonic techniques for massive power, but you'll mark your **Stain Track** and risk corruption.

### Three Pillars Are Equal

**Violence, Influence, and Revelation are mechanically equivalent.**

A social manipulator is as mechanically viable as a martial artist or an eldritch horror cultist. Each conflict type:
- Has its own attack/defense stats (OVR/DVR)
- Uses the same resolution mechanics
- Has 4-step condition ladders
- Can take out opponents at 4th degree

---

# Section 1: Character Creation

## 1.1 Character Creation Overview

Creating a WUXUXIANXIA character is a **10-step process**:

**Step 1**: Choose concept and cultivation path
**Step 2**: Determine starting SCL and SCP (Soul Core Points) budget
**Step 3**: Purchase Primary Stats (9 stats)
**Step 4**: Purchase Aether Stats (3 stats)
**Step 5**: Calculate derived stats (Core Stats, CL, SL, SCL)
**Step 6**: Choose Power Draws Blood (PDB) Profile per pillar
**Step 7**: Distribute OVR/DVR per pillar within caps
**Step 8**: Calculate combat resources (THP, AE, Strain max, Guard)
**Step 9**: Select techniques and effects
**Step 10**: Choose starting equipment and finalize background

---

## 1.2 SCP Budget by SCL

Characters are built using **Soul Core Points (SCP)**. Your starting SCP depends on your starting SCL.

### SCP Budget Formula

```
Total SCP = 30 × SCL
```

### SCP Budget Table

| Starting SCL | Total SCP | Typical Tier |
|--------------|-----------|--------------|
| 1 | 30 SCP | Tutorial/cursed start |
| 2 | 60 SCP | Rookie cultivator |
| 3 | 90 SCP | Street-level hero |
| 4 | 120 SCP | Experienced adept |
| **5** | **150 SCP** | **Professional (Recommended)** |
| 6 | 180 SCP | Elite operative |
| 7 | 210 SCP | City-level threat |
| 8 | 240 SCP | National hero |
| 9 | 270 SCP | Demigod |
| 10 | 300 SCP | Ascended immortal |
| 11+ | 330+ SCP | Transcendent being |

### Spending SCP

- **Primary Stats**: 2 SCP per rank
- **Aether Stats**: 3 SCP per rank (higher cost reflects their power)
- **Techniques**: Variable (see Effects section)
- **Equipment**: 1-5 SCP for significant items
- **Advantages**: 1 SCP per advantage

---

## 1.3 Starting Cultivation Stage

| Sequence Band | SCL Range | Description | Power Scope |
|---------------|-----------|-------------|-------------|
| **Cursed-Sequence** | 1-2 | Collapsing souls, cursed mortals | Personal survival |
| **Low-Sequence** | 3-4 | Street-level empowered | Block/neighborhood |
| **Mid-Sequence** | 5-7 | Professional operatives ⭐ | City/region |
| **High-Sequence** | 8-10 | National heroes, demigods | Nation/continent |
| **Transcendent** | 11+ | Gods, cosmic entities | Multiverse |

---

## 1.4 Concept and Path Selection

### Cultivation Paths

**Orthodox Cultivation**: Traditional sect methods, steady progression
**Demonic Cultivation**: Fast but marks Stain Track frequently
**Celestial Cultivation**: Slow but pure (reduced cost track marking)
**Natural Cultivation**: Environment-dependent bonuses
**Artifice Cultivation**: Technology + cultivation hybrid

---

## 1.5 Playbooks (Quick Start Templates)

Pre-configured templates for faster character creation:

- **Sword Saint** - Weapon specialist, technique-focused
- **Body Refiner** - Physical enhancement, endurance-based tank
- **Spirit Channeler** - Energy manipulation, control-focused
- **Fate Weaver** - Luck/destiny manipulation, narrative power
- **Shadow Cultivator** - Stealth, assassination, forbidden techniques
- **Array Master** - Environmental control, preparation-based
- **Beast Sovereign** - Companion/summon specialist
- **Pill Alchemist** - Support, crafting, transformation

---

# Section 2: Stats & Soul Core Level

## 2.1 Primary Stats (9 Stats)

Primary Stats are the foundation of your character.

### Soul Cluster
- **Essence**: Raw soul potency, aura presence, mystic pressure
- **Resolve**: Grit, conviction, refusal to yield
- **Presence**: Charisma, command, how people perceive you

### Body Cluster
- **Strength**: Lifting capacity, striking power, physical force
- **Endurance**: Toughness, stamina, resistance to wear
- **Agility**: Reflexes, movement, fine physical control

### Mind Cluster
- **Technique**: Learned skill, trained combat forms, optimization
- **Willpower**: Mental resilience, focus under pressure
- **Focus**: Precision, aim, channeling without bleed

### Stat Range and Cost
- **Range**: -1 to +11
- **Cost at Creation**: 2 SCP per rank
- **Cost After Creation**: 3 SCP per rank

---

## 2.2 Core Stats (3 Derived Stats)

Core Stats are **not purchased** - they are automatically calculated.

**Body Core** = round((Strength + Endurance + Agility) / 3)
**Mind Core** = round((Technique + Willpower + Focus) / 3)
**Soul Core** = round((Essence + Resolve + Presence) / 3)

---

## 2.3 Aether Stats (3 Purchased Stats)

High-tier cultivation stats:

- **Control**: Command over power output, stability at high ranks
- **Fate**: Destiny entanglement, luck manipulation, story weight
- **Spirit**: Spiritual potency, capacity for celestial/cursed energies

### Aether Stat Cost
- **At Creation**: 3 SCP per rank
- **After Creation**: 5 SCP per rank

---

## 2.4 Soul Core Level (SCL) Calculation

### The Formula

**Step 1**: Calculate Core Level (CL)
```
CL = floor((Body Core + Mind Core + Soul Core) / 3)
```

**Step 2**: Calculate Soul Level (SL)
```
SL = floor((Control + Fate + Spirit) / 3)
```

**Step 3**: Calculate SCL
```
SCL = CL + SL
```

### Detailed Example

**Character**: "Crimson Blade", Sword Saint

**Primary Stats**:
- Strength 4, Endurance 3, Agility 5 → Body Core = 4
- Technique 5, Willpower 3, Focus 4 → Mind Core = 4
- Essence 2, Resolve 3, Presence 2 → Soul Core = 2

**Aether Stats**:
- Control 2, Fate 1, Spirit 2 → SL = 1

**Calculation**:
- CL = (4 + 4 + 2) / 3 = 3
- SL = 1
- **SCL = 4** (Low-Sequence)

---

# Section 3: Combat Resources & Action Economy

## 3.1 Combat Resources Overview

WUXUXIANXIA uses **four interlocking resources**:

1. **THP (Total Hit Points)** - Health pool
2. **AE (Action Energy)** - Technique fuel
3. **Strain** - Overexertion penalty
4. **Guard** - Temporary damage absorption

---

## 3.2 THP (Total Hit Points)

### Calculating THP
```
THP = 10 + (Endurance × 5) + purchased HP ranks
```

**Purchased HP ranks**: 1 SCP per 10 THP

### THP Recovery
- **Short Rest** (10 minutes): Recover Endurance × 5 THP
- **Long Rest** (8 hours): Recover to full THP

---

## 3.3 AE (Action Energy)

### Calculating Maximum AE
```
Max AE = 10 + (Willpower × 2) + purchased AE ranks
```

**Purchased AE ranks**: 1 SCP per 5 AE

### AE Regeneration
```
AE Regeneration = 1 + floor(Willpower / 3) per round
```

---

## 3.4 Strain

### Maximum Strain
```
Max Strain = Endurance × 10
```

**At Maximum Strain**: Death or permanent injury. No save.

### Strain Thresholds
- **Below 50%**: No penalties
- **50-75%**: -1 to physical actions
- **75-90%**: -2 to physical actions
- **90-100%**: -3 to physical actions, imminent death

### Strain Recovery
- **Long Rest** (8 hours): Recover Endurance Strain
- **Extended Rest** (full day): Recover Endurance × 3 Strain

---

## 3.5 Guard

### Guard Mechanics
- **Starting Guard**: 0
- **Gaining Guard**: Block action = Endurance × 2
- **Duration**: Until depleted or encounter ends

### Damage Routing
1. Damage → Guard first
2. Guard reaches 0 → Overflow to THP
3. Guard cannot go negative

---

## 3.6 Action Economy

### 1-Beat Combat (Simple Mode)
1. **PC Phase**: All PCs act in any order
2. **NPC Phase**: All NPCs/enemies act
3. **Round Ends**: Regenerate AE, repeat

### 3-Stage Combat (Advanced Mode)
1. **Stage 1 (Fast Actions)**: Fast SPD characters take Quick Actions
2. **Stage 2 (Major Actions)**: All characters take Major Actions
3. **Stage 3 (Slow Actions)**: Slow SPD characters take Quick Actions

### SPD Bands
- **Fast**: SPD 6+ (acts Stage 1 and 2)
- **Normal**: SPD 2-5 (acts Stage 2 only)
- **Slow**: SPD 0-1 (acts Stage 2 and 3)

---

## 3.7 Quick Actions (7 Types)

| Action | Effect | Cost |
|--------|--------|------|
| **Strike** | Basic attack: 1d6 + STR/AGI damage | 0 AE |
| **Block** | Gain Guard = END × 2, 50% damage reduction | +1 Strain |
| **Pressure** | Enemy -2 to attack rolls | 0 AE |
| **Weaken** | Enemy -2 to defense | 0 AE |
| **Empower** | Ally +2 to attack rolls | 0 AE |
| **Shield** | Ally +2 to defense | 0 AE |
| **Reposition** | Move half speed, break engagement | 0 AE |

---

# Section 4: Conflict Types & Conditions

## 4.1 Three Pillars Overview

**Violence Pillar** - Physical conflict (Body-based)
**Influence Pillar** - Social conflict (Mind-based)
**Revelation Pillar** - Horror/existential conflict (Soul-based)

---

## 4.2 Violence Pillar

### Attack Resolution
```
d20 + Violence OVR vs. target's Body DVR
```
If hit:
```
d20 + Body Resilience vs. DC 10 + Effect Rank
```

### Violence Conditions (4-Step Ladder)
1. **Injured** (1st Degree): -1 to physical actions
2. **Maimed** (2nd Degree): -2 to physical actions, half movement
3. **Mortally Wounded** (3rd Degree): -3 to physical, dying
4. **Ruined Body** (4th Degree): Dead/crippled, narrative resolution required

### Resource: Fury Pool
- **Gaining**: Critical hit (+1), take 10+ damage (+1), ally downed (+2)
- **Spending**: 1 = reroll attack, 2 = +2 attack, 3 = auto-succeed resilience
- **Maximum**: 10 Fury

---

## 4.3 Influence Pillar

### Attack Resolution
```
d20 + Influence OVR vs. target's Mind DVR
```

### Influence Conditions (4-Step Ladder)
1. **Rattled** (1st Degree): -1 to social actions
2. **Discredited** (2nd Degree): -2 to social, reputation questioned
3. **Isolated** (3rd Degree): -3 to social, socially exiled
4. **Shattered/Broken** (4th Degree): Publicly ruined, narrative resolution

### Resource: Clout Pool
- Persists between encounters (represents reputation)
- **Maximum**: 10 Clout

---

## 4.4 Revelation Pillar

### Attack Resolution
```
d20 + Revelation OVR vs. target's Soul DVR
```

### Revelation Conditions (4-Step Ladder)
1. **Shaken** (1st Degree): -1 to mental actions
2. **Haunted** (2nd Degree): -2 to mental, persistent visions
3. **Deranged** (3rd Degree): -3 to mental, reality distortion
4. **Shattered/Broken** (4th Degree): Catatonia/madness, narrative resolution

### Resource: Insight Pool
- Persists between encounters
- **Maximum**: 10 Insight
- **Warning**: At 8+ Insight, GM may introduce Revelation threats

---

## 4.5 Condition Application

**Resistance Failure Degrees**:
- Failure by 1-4: 1st Degree
- Failure by 5-9: 2nd Degree
- Failure by 10-14: 3rd Degree
- Failure by 15+: 4th Degree

**Condition Stacking**:
- Same type → Advance to next degree
- Different types → Both apply, penalties stack

---

# Section 5: Caps, Tradeoffs & Power Draws Blood

## 5.1 Standard Balance Caps

### Per Pillar Caps
SCL enforces **power caps** for each conflict pillar:

**Offense Cap (OffCap)**:
```
OVR + Effect Rank ≤ 4 × SCL
```

**Defense Cap (DefCap)**:
```
DVR + Resilience ≤ 4 × SCL
```

**Individual Caps**:
```
Any single stat ≤ SCL + 2
```

### Example (SCL 5, Balanced)
- **OffCap**: OVR + Effect ≤ 20
- **DefCap**: DVR + Resilience ≤ 20
- **Individual cap**: Any stat ≤ 7

---

## 5.2 Power Draws Blood (PDB) Profiles

For **each pillar**, choose ONE profile at character creation:

### Balanced Profile
- **OffCap**: 4 × SCL
- **DefCap**: 4 × SCL
- **Cost Track**: No penalties

**Best For**: Well-rounded characters, new players

### Blood-Forward Profile (Glass Cannon)
- **OffCap**: 4 × SCL **+ 2**
- **DefCap**: 4 × SCL **- 2**
- **Cost Track**: Mark **Blood Track** when taking 4th degree condition

**Best For**: High-damage specialists, ranged attackers, hit-and-run

### Ward-Forward Profile (Bulwark)
- **OffCap**: 4 × SCL **- 2**
- **DefCap**: 4 × SCL **+ 2**
- **Cost Track**: Mark **Blood Track** when dealing 4th degree condition

**Best For**: Tanks, defenders, support characters

### PDB Profile Examples (SCL 5)

| Profile | OffCap | DefCap |
|---------|--------|--------|
| Balanced | 20 | 20 |
| Blood-Forward | 22 | 18 |
| Ward-Forward | 18 | 22 |

---

## 5.3 Within-Band Tradeoffs

Within your offense or defense band, you can trade +2 for -2:

### Offense Tradeoffs
- **Accuracy-Leaning**: +2 OVR, -2 Effect Rank (hit more, less impact)
- **Power-Leaning**: +2 Effect Rank, -2 OVR (hit less, more impact)

### Defense Tradeoffs
- **Evasion-Leaning**: +2 DVR, -2 Resilience (dodge more, hurt more when hit)
- **Toughness-Leaning**: +2 Resilience, -2 DVR (hit more often, hurt less)

---

## 5.4 Omni-Defensive Restriction

To prevent "untouchable" characters:

**Rule**: Only ONE pillar at full defense cap. At least one other pillar ≤ 0.75 × DefCap.

**Allowed configurations**:
- Two pillars at full, one low
- One pillar at full, two moderate
- All three moderate

---

## 5.5 Cap Validation

Characters must pass validation before play:

### Offense Band Rule
```
OVR + Effect Rank (+ virtual ranks from extras) ≤ OffCap
```

### Defense Band Rule
```
DVR + Resilience (+ wards/bonuses) ≤ DefCap
```

### Validation Errors
If caps are exceeded, the character is **invalid**. The system should provide:
- Human-readable errors identifying which cap is violated
- Tradeoff advisor suggesting what to reduce

---

# Section 6: Durability Model & Damage Reduction

## 6.1 Layered Durability Overview

WUXUXIANXIA uses a **layered durability model** with multiple defensive pools:

### Health Pools
- **THP (Total Hit Points)**: Physical health
- **MHP (Mental Hit Points)**: Mental/social health (optional rule)
- **SP (Soul Points)**: Spiritual integrity (optional rule)

### Resolve Charge Layers
- **PRC (Physical Resolve Charges)**: Buffer for physical damage
- **MRC (Mental Resolve Charges)**: Buffer for mental/social damage
- **SRC (Spiritual Resolve Charges)**: Buffer for soul damage

---

## 6.2 Resolve Charges

### Calculating Resolve Charges
```
PRC = floor(Endurance / 2) + SCL bonus
MRC = floor(Willpower / 2) + SCL bonus
SRC = floor(Resolve / 2) + SCL bonus
```

**SCL Bonus**:
| SCL | Bonus |
|-----|-------|
| 1-4 | +0 |
| 5-7 | +1 |
| 8-10 | +2 |
| 11+ | +3 |

### Resolve Charge Function
- While charges exist, damage is **reduced by DR tiers**
- Charges are **depleted first** by base damage (before DR)
- When charges = 0, damage goes directly to health pool

---

## 6.3 Damage Reduction (DR) Tiers

### DR Tier Table

| DR Tier | Reduction | Required Investment |
|---------|-----------|---------------------|
| **Tier 0** | 0% | Default |
| **Tier 1** | 10% | Basic protection |
| **Tier 2** | 20% | Moderate protection |
| **Tier 3** | 30% | Strong protection |
| **Tier 4** | 40% | Elite protection |
| **Tier 5** | 50% | Maximum mundane |
| **Tier 6+** | 60%+ | Supernatural only |

### DR Application
1. Calculate raw damage from attack
2. If Resolve Charges > 0:
   - Apply DR tier reduction to damage
   - Deplete charges equal to raw damage (before DR)
   - Remaining reduced damage goes to health pool
3. If Resolve Charges = 0:
   - No DR reduction (unless from other sources)
   - Full damage to health pool

### Example
- Attack deals 20 raw damage
- Defender has 5 PRC and DR Tier 3 (30%)
- PRC depleted by 20 → Now 0 PRC (5 used, 15 "wasted")
- Damage reduced: 20 × 0.7 = 14
- 14 damage to THP

---

## 6.4 Knockout Save

When Resolve Charges hit 0 and further damage is taken:

### Knockout Save Trigger
- Occurs when Resolve Charges = 0 AND damage exceeds threshold
- Threshold = 5 + (relevant Core stat)

### Save Resolution
```
d20 + relevant Resilience vs. DC 10 + (damage - threshold)
```

**Success**: Remain conscious, take damage normally
**Failure**: Knocked out (Violence) / Stunned (Influence) / Dazed (Revelation)

---

## 6.5 Recovery Cadence

### Resolve Charge Recovery
- **Short Rest** (10 minutes): Recover 1 charge of each type
- **Long Rest** (8 hours): Recover all charges
- **SRC Recovery**: Slowest; only recovers 1 per long rest unless special technique used

### Tuning Constants (Data-Driven)

These values are constants in one configuration file for easy tuning:

```yaml
durability_tuning:
  dr_tiers:
    tier_0: 0.00
    tier_1: 0.10
    tier_2: 0.20
    tier_3: 0.30
    tier_4: 0.40
    tier_5: 0.50
  
  resolve_recovery:
    short_rest_charges: 1
    long_rest_charges: "full"
    src_long_rest_limit: 1
  
  knockout_threshold_base: 5
```

---

# Section 7: Meta-Currencies & Cost Tracks

## 7.1 Meta-Currency Pools

### The Three Meta-Currencies

| Currency | Pillar | Nature | Persistence |
|----------|--------|--------|-------------|
| **Fury** | Violence | Rage, momentum | Resets per encounter |
| **Clout** | Influence | Reputation, leverage | Persists between encounters |
| **Insight** | Revelation | Forbidden knowledge | Persists between encounters |

### Session Start Defaults

| Currency | Start | Maximum |
|----------|-------|---------|
| Fury | 0 | 10 |
| Clout | 0 (or previous session) | 10 |
| Insight | 0 (or previous session) | 10 |

---

## 7.2 Fury (Violence Resource)

### Generating Fury
- **Critical Hit** (natural 20 on attack): +1 Fury
- **Take Damage**: +1 Fury per 10 damage taken
- **Ally Downed**: +2 Fury when ally reaches 0 THP
- **Technique Generates**: Some techniques grant Fury

### Spending Fury
| Cost | Effect |
|------|--------|
| 1 Fury | Reroll a failed attack roll |
| 2 Fury | +2 to attack roll (before rolling) |
| 3 Fury | Auto-succeed Body Resilience check |
| 5 Fury | Add extra effect to successful attack |

### Special: Push the Limits (Fury)
- **Cost**: 3 Fury + Mark Blood Track
- **Effect**: Temporarily raise OffCap by +2 for one attack
- **Duration**: One action

---

## 7.3 Clout (Influence Resource)

### Generating Clout
- **Critical Success** on Influence attack: +1 Clout
- **Public Victory**: +1 Clout per major social win
- **Reputation Boost**: +2 Clout for major social milestone

### Spending Clout
| Cost | Effect |
|------|--------|
| 1 Clout | Reroll a failed Influence attack |
| 2 Clout | +2 to Influence attack (before rolling) |
| 3 Clout | Auto-succeed Mind Resilience check |
| 5 Clout | Call in favor from NPC or organization |

### Special: Social Pressure (Clout)
- **Cost**: 3 Clout + Mark Fate Track
- **Effect**: Force target to reroll a successful defense
- **Duration**: One action

---

## 7.4 Insight (Revelation Resource)

### Generating Insight
- **Forbidden Knowledge**: +1 Insight when learning dangerous truth
- **Survive Horror**: +1 Insight per Revelation conflict survived
- **Entity Contact**: +2 Insight when communicating with eldritch entity

### Spending Insight
| Cost | Effect |
|------|--------|
| 1 Insight | Reroll a failed Revelation attack |
| 2 Insight | +2 to Revelation attack (before rolling) |
| 3 Insight | Auto-succeed Soul Resilience check |
| 5 Insight | Ask GM one question about hidden truth |

### Warning: High Insight
At 8+ Insight, GM may introduce Revelation threats. The forbidden knowledge attracts unwanted attention.

---

## 7.5 Cost Tracks

### The Three Cost Tracks

| Track | Nature | Triggered By |
|-------|--------|--------------|
| **Blood** | Physical strain | Glass cannon builds, overexertion, self-harm techniques |
| **Fate** | Destiny debt | Luck manipulation, oath-breaking, reality-warping |
| **Stain** | Corruption | Forbidden techniques, soul damage, principle violations |

### Box Counts

Cost tracks have **boxes** that get marked:

```
Base Boxes = 5 + floor(SCL / 2)
```

| SCL | Base Boxes |
|-----|------------|
| 1-2 | 6 |
| 3-4 | 7 |
| 5-6 | 8 |
| 7-8 | 9 |
| 9-10 | 10 |
| 11+ | 11+ |

### Track Thresholds

| Boxes Marked | Consequence |
|--------------|-------------|
| 25% | Minor narrative complication |
| 50% | Mechanical penalty (-1 to related actions) |
| 75% | Significant complication, potential lasting effect |
| 100% | Major narrative consequence, possible character change |

### Technique-Based Marking

Certain Flaws reduce SCP cost but mark tracks:

| Flaw | Track Marked | SCP Discount |
|------|--------------|--------------|
| **Tiring** | Blood | -1 SCP/rank |
| **Backlash** | Stain | -2 SCP/rank |
| **Fate-Bound** | Fate | -1 SCP/rank |

### Track Recovery

Cost tracks can be reduced through narrative actions:
- **Blood**: Extended rest, healing intervention, sacrifice
- **Fate**: Fulfilling obligations, repaying debts, significant gifts
- **Stain**: Redemption arcs, purification rituals, spiritual cleansing

---

## 7.6 Rules Event Bus

All meta-currency spends and cost track marks are represented as events:

### Event Types
```typescript
type RulesEvent = 
  | { type: "FURY_GAINED"; amount: number; source: string }
  | { type: "FURY_SPENT"; amount: number; effect: string }
  | { type: "CLOUT_GAINED"; amount: number; source: string }
  | { type: "CLOUT_SPENT"; amount: number; effect: string }
  | { type: "INSIGHT_GAINED"; amount: number; source: string }
  | { type: "INSIGHT_SPENT"; amount: number; effect: string }
  | { type: "TRACK_MARKED"; track: "blood" | "fate" | "stain"; source: string }
  | { type: "TRACK_CLEARED"; track: "blood" | "fate" | "stain"; amount: number };
```

Narrative/UI can subscribe to these events for display and tracking.

---

# Section 8: Boss Scaling Guidelines

## 8.1 Boss Ranks Overview

Bosses use a **rank system** (1-5) that scales with party SCL:

| Boss Rank | Threat Level | Action Count | Party Equivalence |
|-----------|--------------|--------------|-------------------|
| **Rank 1** | Minor Boss | 1 action/round | 1-2 party members |
| **Rank 2** | Standard Boss | 2 actions/round | 2-3 party members |
| **Rank 3** | Major Boss | 2-3 actions/round | Full party |
| **Rank 4** | Elite Boss | 3 actions/round + phase | Full party + challenge |
| **Rank 5** | Apex Boss | 3+ actions/round + multi-phase | Full party, major challenge |

---

## 8.2 Boss Multipliers

### Health Multiplier by Rank

```
Boss THP = Base THP × Rank Multiplier × SCL Modifier
```

| Rank | THP Multiplier |
|------|----------------|
| 1 | 1.5× |
| 2 | 2.0× |
| 3 | 3.0× |
| 4 | 4.0× |
| 5 | 5.0× |

### SCL Modifier
```
SCL Modifier = 1.0 + (party_average_SCL - boss_base_SCL) × 0.1
```

### DR Profile by Rank

| Rank | DR Tier | Resolve Charges |
|------|---------|-----------------|
| 1 | Tier 1 (10%) | 3 |
| 2 | Tier 2 (20%) | 5 |
| 3 | Tier 3 (30%) | 8 |
| 4 | Tier 4 (40%) | 12 |
| 5 | Tier 5 (50%) | 15 |

---

## 8.3 Multi-Stage Bosses (Ranks 4-5)

### Phase Mechanics

Rank 4-5 bosses have **multiple stages**:

**Rank 4**: 2 phases
- Phase 1: Standard boss behavior
- Phase 2: Triggered at 50% HP, gains new abilities

**Rank 5**: 3 phases
- Phase 1: Standard boss behavior (100%-66% HP)
- Phase 2: Escalation (66%-33% HP), new abilities
- Phase 3: Desperation (33%-0% HP), ultimate abilities

### Phase Transition Effects
- Full Resolve Charge refresh
- DR tier may increase
- New techniques unlocked
- Possible minion summoning

---

## 8.4 Boss Builder Helper

### Function Signature
```typescript
function generateBossBaseline(
  partySCL: number,
  bossRank: 1 | 2 | 3 | 4 | 5
): BossTemplate {
  return {
    recommendedBands: {
      offenseMin: partySCL * 3,
      offenseMax: partySCL * 4 + bossRank,
      defenseMin: partySCL * 3,
      defenseMax: partySCL * 4 + bossRank
    },
    healthPool: {
      baseTHP: 50 + (partySCL * 20),
      multiplier: [1.5, 2.0, 3.0, 4.0, 5.0][bossRank - 1],
      totalTHP: (50 + partySCL * 20) * multiplier
    },
    resolveCharges: [3, 5, 8, 12, 15][bossRank - 1],
    drTier: bossRank,
    actionCount: bossRank <= 2 ? bossRank : bossRank + 1,
    phases: bossRank <= 3 ? 1 : bossRank - 2
  };
}
```

### Example Output (Party SCL 5, Rank 3)

```json
{
  "recommendedBands": {
    "offenseMin": 15,
    "offenseMax": 23,
    "defenseMin": 15,
    "defenseMax": 23
  },
  "healthPool": {
    "baseTHP": 150,
    "multiplier": 3.0,
    "totalTHP": 450
  },
  "resolveCharges": 8,
  "drTier": 3,
  "actionCount": 4,
  "phases": 1
}
```

---

## 8.5 Boss Combat Modifications

### Multiple Actions
- Bosses act multiple times per round based on rank
- Each action can be Major or Quick Action
- Actions distributed across combat stages

### Legendary Resistance
- Auto-succeed on saves (limited uses)
- Uses per encounter: Rank + 1

### Phase Transitions
- Occur at HP thresholds
- May change boss abilities, stats, or behavior
- Can include minion spawning or environmental changes

### Environmental Powers
- Bosses may manipulate battlefield
- Zone effects, hazards, or terrain changes
- Scale with boss rank

---

# Appendix A: Quick Reference Tables

## SCL Quick Calculation

```
Body Core = (STR + END + AGI) / 3, round
Mind Core = (TEC + WIL + FOC) / 3, round
Soul Core = (ESS + RES + PRE) / 3, round

CL = (Body Core + Mind Core + Soul Core) / 3, floor
SL = (Control + Fate + Spirit) / 3, floor

SCL = CL + SL
```

## Combat Resources Quick Calc

```
THP = 10 + (Endurance × 5) + bought ranks
Max AE = 10 + (Willpower × 2) + bought ranks
AE Regen = 1 + floor(Willpower / 3) per round
Max Strain = Endurance × 10
Block Guard = Endurance × 2
```

## Cap Formulas (M&M-style rescaled)

| Profile | OffCap | DefCap |
|---------|--------|--------|
| Balanced | 4 × SCL | 4 × SCL |
| Blood-Forward | 4 × SCL + 2 | 4 × SCL - 2 |
| Ward-Forward | 4 × SCL - 2 | 4 × SCL + 2 |

## Condition Degrees

| Failure By | Degree | Severity |
|------------|--------|----------|
| 1-4 | 1st | Minor |
| 5-9 | 2nd | Moderate |
| 10-14 | 3rd | Severe |
| 15+ | 4th | Critical (narrative resolution) |

## Meta-Currency Costs

| Action | Fury | Clout | Insight |
|--------|------|-------|---------|
| Reroll | 1 | 1 | 1 |
| +2 Bonus | 2 | 2 | 2 |
| Auto-succeed save | 3 | 3 | 3 |
| Special effect | 5 | 5 | 5 |

---

# Appendix B: Glossary

## Core Terms

| Term | Definition |
|------|------------|
| **AE** | Action Energy - technique fuel |
| **CL** | Core Level - material refinement |
| **DVR** | Defense Value Rating - to-be-hit rating |
| **OVR** | Offense Value Rating - to-hit rating |
| **PDB** | Power Draws Blood - cap shift profiles |
| **SCP** | Soul Core Points - character creation currency |
| **SCL** | Soul Core Level - main balance cap |
| **SL** | Soul Level - spiritual awakening |

## Combat Terms

| Term | Definition |
|------|------------|
| **Fury** | Violence meta-currency, resets per encounter |
| **Clout** | Influence meta-currency, persists |
| **Insight** | Revelation meta-currency, persists |
| **Guard** | Temporary damage absorption |
| **Strain** | Overexertion tracker, death at max |
| **THP** | Total Hit Points - health pool |

## Progression Terms

| Term | Definition |
|------|------------|
| **Sequence** | Cultivation tier/band |
| **Breakthrough** | Moment of SCL advancement |
| **Tribulation** | Challenge during breakthrough |
| **Pillar** | Conflict type (Violence/Influence/Revelation) |

## Cost Tracks

| Track | Nature |
|-------|--------|
| **Blood** | Physical strain, bodily self-harm |
| **Fate** | Destiny debt, cosmic obligations |
| **Stain** | Corruption, moral erosion |

---

# Implementation Notes

## Design Contradictions Resolved

### CL/SL Formula
**Source Conflict**: Early documents showed `CL = (Body + Mind + Soul) / 3` while later documents specified Core Stats.
**Resolution**: Implemented Core Stats version as it's the more refined, later design.

### Cap Math Scaling
**Source Conflict**: Some docs used `2 × SCL` while others used `4 × SCL`.
**Resolution**: Implemented `4 × SCL` as it provides finer granularity for tradeoffs.

### Meta-Currency Persistence
**Source Conflict**: Early versions had all currencies reset; later added persistence for Clout/Insight.
**Resolution**: Fury resets per encounter; Clout and Insight persist.

---

**Document Status**: Unified SRD Alpha v0.3
**Completeness**: 55% (Sections 0-8, Appendices)
**Next Steps**: 
- Section 9: Techniques & Effects (Patch 0.4)
- Section 10: Equipment & Artifacts (Patch 0.4)
- Section 11: GM Guidelines (Patch 0.5)
- Section 12: Setting & Cosmology (Patch 0.5)

---

**END OF UNIFIED SRD ALPHA v0.3**
