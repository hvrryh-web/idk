# WUXUXIANXIA TTRPG - Game Development SRD History

## Document Information
- **Version**: 1.0
- **Date**: 2025-12-10
- **Purpose**: Track the evolution of system design from concept to current state
- **Related Documents**: See `/WUXUXIANXIA TTRPG/` for original design conversations

---

## Executive Summary

This document chronicles the development history of the WUXUXIANXIA TTRPG system, a hybrid Visual Novel + Tactical TTRPG inspired by Mutants & Masterminds 3e but redesigned for Xianxia/cultivation fiction. The system evolved through multiple iterations, refining core mechanics from a Power Level-based system to a Soul Core Level (SCL) framework that emphasizes "Power Draws Blood" - where optimization comes with mechanical costs.

---

## Phase 1: Initial Concept and Foundation (Early Development)

### Design Goals Established
The project began with ambitious design goals synthesizing multiple influences:
- **Mutants & Masterminds 3e** - Power Level caps, effect-based powers, tactical depth
- **Fire Emblem series** - Turn-based tactical combat with meaningful positioning
- **Xianxia fiction** (Cradle, I Shall Seal the Heavens, etc.) - Cultivation progression, soul/spirit mechanics
- **Visual Novel presentation** - Story-driven interface with character portraits and dialogue

### Core Design Pillars Identified
1. **Cultivation-based progression** replacing generic leveling
2. **Three conflict types** (Violence, Influence, Revelation) as equally viable approaches
3. **Resource management** with multiple interlocking systems
4. **Tactical combat** with meaningful action economy
5. **Cost for optimization** - "Power Draws Blood" philosophy

### Initial Mechanical Framework
- Started with M&M 3e Power Level (PL) as balance mechanism
- Proposed traditional RPG stats (Strength, Dexterity, Constitution, etc.)
- Combat focused on hit points and damage reduction
- Single conflict type (physical combat only)

**Key Documents**: 
- Initial conversations establishing tone and influences
- Early drafts of combat mechanics

---

## Phase 2: Power Level to Soul Core Level Transformation

### Major Design Decision: PL → SCL
**Rationale**: Power Level (PL) felt too generic for Xianxia setting. Needed cultivation-themed progression system that conveyed "how crystallized your Aether Core is."

### Soul Core Level (SCL) Framework Established
**Formula**: `SCL = Core Level (CL) + Soul Level (SL)`

Where:
- **Core Level (CL)** = Material refinement (Mind + Body + Soul Core averaged)
- **Soul Level (SL)** = Spiritual awakening (Control + Fate + Spirit averaged)

**Design Intent**:
- SCL functions mechanically like M&M's PL (caps attack + effect ≈ 2 × SCL)
- Fictional interpretation: Higher SCL = more terrifying presence, not just stronger punches
- SL represents "how awake your soul is"
- CL represents "how hardened your body/mind core is"

### Sequence Band System Introduced
Cultivation tiers mapped to SCL ranges:

| Sequence Band | SCL Range | Fictional Tier |
|---------------|-----------|----------------|
| **Cursed-Sequence** | 1-2 | Collapsing souls, cursed mortals |
| **Low-Sequence** | 3-4 | Street-level empowered, unstable rookies |
| **Mid-Sequence** | 5-7 | Professional operatives, city-level threats |
| **High-Sequence** | 8-10 | National heroes, demigods, angels |
| **Transcendent** | 11+ | Great Old Ones, True Gods, cosmic entities |

**Key Documents**:
- `Wuxianxia Game Chat Start (long).md` - SCL system formalization
- `Wuxianxia Game Full Chat Context.md` - Complete SCL mechanics (lines 1-200)

---

## Phase 3: Stats Architecture Overhaul

### Problem Identified
Original M&M-style ability scores led to "double-paying for numbers" - players bought abilities, then separately bought defenses that should derive from those abilities.

### Solution: Three-Layer Stat System

#### Layer 1: Primary Stats (9 Stats, Range -1 to +11)
**Soul Cluster:**
- Essence - Raw soul potency, aura presence
- Resolve - Grit, conviction, refusal to yield
- Presence - Charisma, command, how entities perceive you

**Body Cluster:**
- Strength - Physical force, striking power
- Endurance - Toughness, stamina
- Agility - Reflexes, movement, fine control

**Mind Cluster:**
- Technique - Learned skill, combat forms
- Willpower - Mental resilience, focus under pressure
- Focus - Precision, channeling without bleed

**Design Note**: These replace M&M's ability scores as the main PP sink.

#### Layer 2: Core Stats (3 Derived Stats)
- **Body Core** = round((Strength + Endurance + Agility) / 3)
- **Mind Core** = round((Technique + Willpower + Focus) / 3)
- **Soul Core** = round((Essence + Resolve + Presence) / 3)

**Design Note**: Derived, not purchased, avoiding "double payment". Used for defenses and resistance.

#### Layer 3: Aether Stats (3 Purchased Stats)
High-tier cultivation stats:
- **Control** - Command over power output, stability at high ranks
- **Fate** - Destiny entanglement, luck, story weight
- **Spirit** - Spiritual potency, celestial/cursed energy capacity

**Design Note**: Primarily for demigod/immortal tiers and supernatural powers.

**Key Documents**:
- `Wuxianxia Game Chat Start (long).md` (lines 54-145) - Stats architecture
- `Wuxianxia Game Full Chat Context.md` - Complete stat system

---

## Phase 4: Three Conflict Pillars Framework

### Expansion Beyond Combat
Recognition that Xianxia stories involve more than physical violence - social manipulation, existential horror, and destiny battles are equally important.

### Three Pillars Established

#### 1. Violence Pillar (Body-based)
- **Target**: Body Defense
- **Mechanics**: Physical combat, destructive powers
- **Conditions**: Injured → Maimed → Mortally Wounded → Ruined Body
- **Resource**: Fury (positive pool)

#### 2. Influence Pillar (Soul-based)
- **Target**: Mind Defense
- **Mechanics**: Social pressure, political maneuvering, reputation attacks
- **Conditions**: Rattled → Discredited → Isolated → Shattered/Broken
- **Resource**: Clout (positive pool)

#### 3. Revelation Pillar (Mind-based)
- **Target**: Soul Defense
- **Mechanics**: Existential horror, forbidden knowledge, sanity assaults
- **Conditions**: Shaken → Haunted → Deranged → Shattered/Broken
- **Resource**: Insight (positive pool)

### 4-Step Condition Ladders
Each pillar has progressive degradation:
- **1st Degree**: Minor penalties, easily recovered
- **2nd Degree**: Significant impairment, requires intervention
- **3rd Degree**: Severe degradation, major consequences
- **4th Degree**: Taken out of conflict - requires narrative solution, not just recovery rolls

**Design Philosophy**: 4th-degree conditions (Ruined Body, Shattered/Broken) require major narrative actions (exorcisms, interventions, existential bargains) - not a single recovery roll.

**Key Documents**:
- `Wuxianxia Game Chat Start (2).md` - Conflict pillars introduction
- Design discussions on equal viability of non-combat approaches

---

## Phase 5: "Power Draws Blood" - Cost Track System

### Core Philosophy Codified
**"Power Draws Blood"** - Specialization and optimization come with mechanical costs.

### Power Draws Blood Profiles (Build-Time Choice)
For each pillar, choose one profile at character creation:

1. **Balanced**
   - Offense: Attack + Power ≤ 2 × SCL
   - Defense: Defense + Resilience ≤ 2 × SCL

2. **Blood-Forward (Glass Cannon)**
   - Offense: Attack + Power ≤ 2 × SCL + 2
   - Defense: Defense + Resilience ≤ 2 × SCL - 2

3. **Ward-Forward (Bulwark)**
   - Defense: Defense + Resilience ≤ 2 × SCL + 2
   - Offense: Attack + Power ≤ 2 × SCL - 2

### Cost Tracks Introduced
Three character-wide tracks that accumulate as consequences:

#### Blood Track
- **Nature**: Physical strain, bodily self-harm
- **Triggered By**: Glass cannon builds, overexertion, physical techniques beyond limits
- **Effects**: Cumulative physical penalties
- **Theme**: "Your body breaks down from the strain"

#### Fate Track
- **Nature**: Destiny debt, cosmic/political obligations
- **Triggered By**: Luck manipulation, oath-breaking, reality-warping effects
- **Effects**: Narrative consequences, obligation accumulation
- **Theme**: "You owe the universe, and it will collect"

#### Stain Track (also called Shadow Track)
- **Nature**: Corruption, moral erosion, spiritual degradation
- **Triggered By**: Forbidden techniques, soul-damaging powers, violation of principles
- **Effects**: Personality shifts, loss of self
- **Theme**: "Power corrupts, and corruption has consequences"

**Design Note**: Tracks mark when using harsh, reality-warping, or reputation-shredding effects, or when hitting 3rd-4th degree conditions.

**Key Documents**:
- `Wuxianxia Game Chat Start (2).md` (lines 62-118) - Cost track framework
- Balance taxonomy discussions

---

## Phase 6: Combat Resources and Action Economy

### Multi-Resource Combat System
Moved beyond simple HP to interlocking resource system:

#### Primary Combat Resources
1. **THP (Total Hit Points)**: Health pool - unconscious/dying at 0
2. **AE (Action Energy)**: Technique fuel - regenerates each round
3. **Strain**: Overexertion accumulator - death at maximum
4. **Guard**: Temporary damage absorption - resets between encounters

### Damage Routing System
Three routing types for techniques:
- **THP Routing**: Damage → DR reduction → THP damage
- **Guard Routing**: Damage → Guard → overflow to THP
- **Strain Routing**: Direct strain accumulation (bypasses DR and Guard)

### SPD Bands and 3-Stage Combat
Advanced turn ordering system:

**Stage 1**: Fast SPD characters take Quick Actions
**Stage 2**: Everyone takes Major Actions (techniques)
**Stage 3**: Slow SPD characters take Quick Actions

**Design Intent**: Creates tactical depth - Fast characters can set up before main action phase, Slow characters can respond after.

### Quick Actions System (7 Types)
1. **Strike** - Basic attack
2. **Block** - Reduce incoming damage, build Guard
3. **Pressure** - Debuff enemy offense
4. **Weaken** - Debuff enemy defense
5. **Empower** - Buff ally offense
6. **Shield** - Buff ally defense
7. **Reposition** - Tactical movement/stance change

**Balance**: Quick Actions have lower impact than Major Actions (techniques) but provide tactical flexibility.

**Key Documents**:
- `Wuxianxia Game Full Chat Context.md` - Complete combat resource system
- Design discussions on action economy balance

---

## Phase 7: Technique System and Effect Framework

### Technique Structure Evolution
Moved from simple "damage" to M&M-style attack + effect separation:

**Original**: `base_damage` (single value)
**Current**: `attack_bonus + effect_rank` (follows 2 × SCL cap)

### Core Effects Framework
Built around M&M-style effects with Xianxia flavor:

#### Offensive Effects
- **Strike** - Core damage (Violence pillar)
- **Affliction** - Status conditions
- **Weaken** - Stat/defense reduction
- **Damage** - Direct HP loss

#### Defensive Effects
- **Protection** - Damage reduction
- **Immunity** - Negation of specific effects
- **Regeneration** - HP recovery over time
- **Enhanced Defense** - Defense bonus

#### Support Effects
- **Boost** - Stat enhancement
- **Healing** - HP restoration
- **Sustained** - Buff/debuff duration
- **Area** - Multiple target effects

### Technique Categories
- **Basic Techniques**: Low AE cost, bread-and-butter moves
- **Advanced Techniques**: Moderate AE cost, specialized effects
- **Ultimate Techniques**: High AE cost, game-changing powers
- **Forbidden Techniques**: Mark cost tracks, extremely powerful but dangerous

**Key Documents**:
- `Wuxianxia Game Chat Part (3).md` - Effect framework
- `SoulCore_Effects_and_Playbooks.xlsx` - Technique data

---

## Phase 8: Balance Taxonomy and Design Philosophy

### M&M 3e Character Guide Taxonomy Adopted
From weakest to strongest:

1. **Useless** - Never take
2. **Weak** - Rarely worth taking
3. **Niche** - Situational but valuable
4. **Balanced** - Core design target ⭐
5. **Strong** - Above baseline (limited)
6. **Overpowered** - Clearly superior (GM approval)
7. **Broken** - Game-breaking (banned)

**Design Goal**: Keep core system in "Balanced" range, allow "Strong" builds with cost track penalties.

### Non-Negotiable Design Constraints
1. **SCL caps must be enforced** - No free power increases
2. **Cost tracks must matter** - Optimization has consequences
3. **4th-degree conditions require story** - Not just a recovery roll
4. **Three pillars are equal** - Violence, Influence, Revelation all viable
5. **Xianxia flavor is essential** - Cultivation, Sequence, soul-based powers

### Design Principles Codified
- **Simple and fast at table** - Complex builds, streamlined play
- **Fiction-first** - Mechanics support narrative, not replace it
- **Meaningful choices** - Trade-offs matter
- **Tactical depth** - Multiple viable strategies
- **Cultivation progression** - Advancement feels earned and significant

**Key Documents**:
- Balance taxonomy discussions throughout design documents
- GM guidance sections

---

## Phase 9: Boss Design and Encounter Framework

### Boss Template System
Recognition that enemies need different mechanics than PCs:

**Boss-Specific Mechanics**:
- **Multiple Actions per Round**: Bosses can act multiple times
- **Legendary Resistances**: Auto-succeed on critical saves (limited uses)
- **Phase Transitions**: Bosses change tactics/abilities at HP thresholds
- **Minion Support**: Subordinates that support boss actions
- **Environmental Powers**: Bosses can manipulate the battlefield

### Encounter Types
- **Solo Boss**: Single powerful enemy with multiple actions
- **Boss + Minions**: Main threat plus supporting forces
- **Multi-Stage**: Boss transforms or environment changes at thresholds
- **Swarm**: Many weaker enemies testing resource management

**Key Documents**:
- `SoulCore_Boss_Design.xlsx` - Boss templates and encounter design
- Boss mechanic discussions in chat logs

---

## Phase 10: Setting and Cosmology

### World Structure: Supreme World Tree
The cosmology expanded to include:

**Multiple Realms**:
- **Mortal Realm** - Where most play occurs (SCL 1-10)
- **Spirit Realm** - Higher plane of existence
- **Celestial Realm** - Domain of immortals and gods
- **Cursed Realm** - Corruption and forbidden powers
- **Void Between** - Space between realms

### Cultivation Paths
Multiple routes to power:
- **Orthodox Cultivation** - Traditional sect methods
- **Demonic Cultivation** - Fast but corrupting
- **Celestial Cultivation** - Divine/angelic powers
- **Natural Cultivation** - Harmony with environment
- **Artifice Cultivation** - Technology + cultivation hybrid

### Factions and Organizations
- **Sects** - Traditional cultivation schools
- **Clans** - Bloodline-based power structures
- **Courts** - Political/social power centers
- **Secret Societies** - Hidden agendas and forbidden knowledge

**Key Documents**:
- `on supreme world tree A SUMMARY.docx` - Cosmology
- `multi-path realm tree interconnected systems.docx` - Realm connections
- `a WUXIAN XIA story - GAME CONCEPT IDEAS DRAFT.docx` - Setting concepts

---

## Phase 11: Playbook System (In Development)

### Character Archetypes
Moving toward pre-configured starting templates:

**Planned Playbooks**:
- **Sword Saint** - Weapon specialist, technique-focused
- **Body Refiner** - Physical enhancement, endurance-based
- **Spirit Channeler** - Energy manipulation, control-focused
- **Fate Weaver** - Luck/destiny manipulation, narrative power
- **Shadow Cultivator** - Stealth, assassination, forbidden techniques
- **Array Master** - Environmental control, preparation-based
- **Beast Sovereign** - Companion/summon specialist
- **Pill Alchemist** - Support, crafting, transformation

**Design Intent**: Provide starting points that demonstrate system possibilities without restricting creativity.

**Key Documents**:
- `SoulCore_Effects_and_Playbooks.xlsx` - Playbook templates
- Ongoing design discussions

---

## Phase 12: Implementation and Alpha Testing

### Technical Implementation Begins
Translation of design to working code:

**Backend (FastAPI + Python)**:
- Character data models
- Combat simulation engine
- Technique system
- Monte Carlo simulation for balance testing

**Frontend (React + TypeScript)**:
- Visual Novel-style UI
- Character sheets and profiles
- Wiki/SRD browser
- Character management

**Database (PostgreSQL)**:
- Character storage
- Technique library
- Boss templates
- Simulation results

### Gap Analysis
Comprehensive analysis revealed:
- ✅ **Implemented**: Combat resources, Quick Actions, basic simulation
- 🔄 **Partial**: Character stats (generic "level" vs. full SCL), technique system
- ❌ **Missing**: Full 12-stat system, condition tracking, cost tracks, Influence/Revelation pillars

### Current State
- **Alpha status** - Core combat simulation works
- **MVP Goal** - Full stat system, player-controlled combat UI, condition tracking
- **v1.0 Goal** - All three conflict types, cost tracks, character creation wizard
- **v2.0 Goal** - Playbooks, combat replay, social/horror conflict UI, GM tools

**Key Documents**:
- `docs/wuxiaxian-reference/EXECUTIVE_SUMMARY.md` - Current status
- `docs/wuxiaxian-reference/REPO_ARCHITECTURE_ANALYSIS.md` - Implementation analysis
- `docs/wuxiaxian-reference/ACTIONABLE_IMPROVEMENTS.md` - Roadmap

---

## Design Evolution Summary

### What Changed and Why

#### Major Transformations
1. **Power Level → Soul Core Level**: Added cultivation flavor, split into material (CL) and spiritual (SL) components
2. **Single stat type → Three-layer stats**: Fixed "double payment" problem, added depth
3. **Combat-only → Three pillars**: Made social and horror conflicts mechanically equal to violence
4. **Simple HP → Multi-resource**: Added tactical depth, resource management, interesting choices
5. **Generic powers → Xianxia techniques**: Themed abilities to setting, added cultivation progression

#### Persistent Core Concepts
Despite evolution, these remained constant:
- **M&M 3e foundation**: Attack + effect caps, balance through restrictions
- **Tactical combat**: Turn-based with meaningful choices
- **Cost for optimization**: "Power Draws Blood" from earliest discussions
- **Cultivation progression**: Advancement through stages, not just numbers
- **Visual Novel presentation**: Story-driven UI with tactical depth

### Design Philosophy Consistency
The "simple and fast" goal remained throughout:
- Complex character builds (many options at creation)
- Streamlined play (roll attack, compare to defense, done)
- Front-loaded complexity (build-time choices, not per-turn calculations)

---

## Key Milestones Timeline

### Early Development
- Initial concept established
- M&M 3e selected as mechanical foundation
- Xianxia flavor identified as core theme

### Mid Development
- PL → SCL transformation
- Three-layer stat system designed
- Three conflict pillars introduced
- Cost track system conceptualized
- Combat resources expanded to 4 types

### Late Development
- Complete effect framework designed
- Boss mechanics differentiated from PCs
- Balance taxonomy adopted
- Setting and cosmology expanded
- Playbook system planned

### Implementation Phase
- Backend engine built
- Frontend UI created
- Database schema designed
- Monte Carlo simulation for testing
- Alpha testing begun

### Current Phase
- Gap analysis completed
- Implementation roadmap created
- MVP path defined
- Documentation synthesized

---

## Lessons Learned

### What Worked Well
1. **M&M 3e foundation**: Solid mechanical base that scales well
2. **Iterative refinement**: Multiple passes improved core concepts
3. **Clear design goals**: "Simple and fast" kept focus consistent
4. **Comprehensive documentation**: Extensive chat logs preserved design intent
5. **Balance taxonomy**: Clear language for discussing power level

### Challenges Encountered
1. **Scope creep**: Three conflict types added significant complexity
2. **Implementation lag**: Design outpaced coding capacity
3. **Terminology alignment**: "Level" vs. "SCL" confusion in codebase
4. **Cost track integration**: Still figuring out exact thresholds and consequences
5. **UI complexity**: VN + tactical combat is ambitious combination

### Future Considerations
1. **Playtesting needed**: Theoretical balance requires real table testing
2. **GM tools essential**: System complexity requires good GM support
3. **Gradual rollout**: Implement Violence pillar first, then others
4. **Tutorial needed**: Entry barrier is high, need good onboarding
5. **Community feedback**: External perspectives will reveal blind spots

---

## Related Documentation

### Design Documents
- `/WUXUXIANXIA TTRPG/Wuxianxia Game Full Chat Context.md` - Complete design (5816 lines)
- `/WUXUXIANXIA TTRPG/Wuxianxia Game Chat Start (long).md` - Initial design (2343 lines)
- All chat parts (1-6) - Design iterations

### Implementation Analysis
- `/docs/wuxiaxian-reference/DESIGN_SUMMARY.md` - System mechanics summary
- `/docs/wuxiaxian-reference/REPO_ARCHITECTURE_ANALYSIS.md` - Code structure
- `/docs/wuxiaxian-reference/COMBAT_UI_DESIGN.md` - UI implementation plan
- `/docs/wuxiaxian-reference/ACTIONABLE_IMPROVEMENTS.md` - Development roadmap
- `/docs/wuxiaxian-reference/EXECUTIVE_SUMMARY.md` - Current state overview

### Data Files
- `/WUXUXIANXIA TTRPG/SoulCore_Effects_and_Playbooks.xlsx` - Effects and playbooks
- `/WUXUXIANXIA TTRPG/SoulCore_Boss_Design.xlsx` - Boss templates
- Setting documents (.docx files)

---

## Conclusion

The WUXUXIANXIA TTRPG has evolved from a simple "Xianxia-flavored M&M" concept into a comprehensive tactical RPG system with:
- Unique Soul Core Level progression
- Three-layer stat architecture
- Three equally-viable conflict types
- Multi-resource combat system
- "Power Draws Blood" cost mechanics
- Rich cultivation-themed setting

The system maintains M&M 3e's strengths (effect-based powers, clear balance caps, tactical depth) while adding Xianxia flavor and addressing "double payment" problems. Current implementation is in alpha, with core combat working and roadmap established for reaching feature-complete v1.0.

The extensive design documentation ensures future development can maintain design intent while refining mechanics through playtesting and community feedback.

---

**Document Status**: Complete comprehensive history
**Next Document**: SRD Alpha structure and content
**Maintenance**: Update when major design changes occur
