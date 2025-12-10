# WUXUXIANXIA TTRPG - System Reference Document

## SRD ALPHA - PATCH 0.2

### Document Information
- **Version**: Alpha v0.2
- **Patch ID**: ALPHA-0.2-20251210
- **Date**: 2025-12-10
- **Status**: Alpha Release - Sections 3-4 Complete
- **Coverage**: Combat Resources & Action Economy, Conflict Types & Conditions
- **Previous Patch**: 0.1 covered Introduction, Character Creation, Stats & SCL
- **Next Patch**: 0.3 will add Techniques & Effects, Equipment, Cultivation & Advancement

### Patch Notes
**What's New in 0.2:**
- Complete Combat Resources (THP, AE, Strain, Guard) system
- Full Action Economy (1-Beat and 3-Stage Combat modes)
- SPD Bands and turn ordering
- Quick Actions (all 7 types)
- Three Conflict Pillars (Violence, Influence, Revelation)
- 4-Step Condition Ladders for each pillar
- Condition application and recovery mechanics

**What's Coming in 0.3:**
- Technique System and Effect Framework
- Equipment and Artifacts
- Cultivation and Advancement mechanics
- Breakthrough and Tribulation systems

---

# Section 3: Combat Resources & Action Economy

## 3.1 Combat Resources Overview

WUXUXIANXIA uses **four interlocking resources** to create tactical depth and meaningful choices in combat.

**Design Philosophy**: Unlike simple HP systems, these four resources force you to balance:
- **Offense** (spending AE for techniques)
- **Defense** (building Guard, avoiding Strain)
- **Sustainability** (conserving AE, managing Strain)
- **Risk/Reward** (powerful techniques vs. resource depletion)

The four resources are:
1. **THP (Total Hit Points)** - Health pool
2. **AE (Action Energy)** - Technique fuel
3. **Strain** - Overexertion penalty
4. **Guard** - Temporary armor

---

## 3.2 THP (Total Hit Points)

### What THP Represents

Your **Total Hit Points (THP)** is your health pool - physical integrity, stamina, and ability to continue fighting.

**THP is NOT**:
- Just physical wounds (though that's part of it)
- Pure hit points like D&D

**THP IS**:
- Physical health + stamina + will to fight + minor wounds + exhaustion + luck
- An abstraction of "ability to keep going"

**At 0 THP**: You are **unconscious and dying** (not dead yet, but will die without stabilization).

### Calculating THP

**Base THP Formula**:
```
THP = 10 + (Endurance × 5) + purchased HP ranks
```

**Purchased HP ranks**: 
- Cost: 1 PP per 10 THP
- Most characters buy 0-3 ranks (0-30 additional THP)

**Example**:
- Endurance 4
- Purchased: 2 ranks (20 THP)
- THP = 10 + (4 × 5) + 20 = 10 + 20 + 20 = **50 THP**

**Typical THP Ranges by SCL**:

| SCL | Endurance Range | Typical THP | Role |
|-----|-----------------|-------------|------|
| 1-2 | 1-2 | 20-35 THP | Fragile rookie |
| 3-4 | 2-4 | 35-60 THP | Competent fighter |
| 5-7 | 3-6 | 50-85 THP | Professional |
| 8-10 | 5-8 | 75-120 THP | Legendary warrior |
| 11+ | 7-11 | 105-175 THP | Transcendent being |

### THP Damage and Recovery

**Taking Damage**:
1. Check if Guard absorbs damage (see Section 3.5)
2. Apply DR (Damage Reduction) if THP-routed
3. Subtract remaining damage from THP
4. Check for conditions (see Section 4)

**Recovering THP**:
- **Short Rest** (10 minutes): Recover Endurance × 5 THP (once per encounter)
- **Long Rest** (8 hours): Recover to full THP (if safe and treated)
- **Healing Techniques**: Instant recovery (varies by technique)
- **Medical Treatment**: Speeds recovery, removes conditions

**Death and Dying**:
- **At 0 THP**: Unconscious, dying (3 rounds to death without stabilization)
- **Stabilization**: Medicine check (DC 15) or healing technique
- **Negative THP**: Not tracked - 0 is the floor

**Resurrection**:
- Extremely difficult (High-Sequence techniques, plot devices, heavy costs)
- Typically requires narrative justification and cost track marking

---

## 3.3 AE (Action Energy)

### What AE Represents

**Action Energy (AE)** is your technique fuel - the refined spiritual energy you channel into special abilities.

**AE is**:
- Cultivated qi/mana/spiritual power
- Limited but regenerating resource
- The "MP/Mana" equivalent

**Without AE**: You can still fight (basic attacks, Quick Actions) but can't use techniques.

### Calculating Maximum AE

**Base AE Formula**:
```
Max AE = 10 + (Willpower × 2) + purchased AE ranks
```

**Purchased AE ranks**:
- Cost: 1 PP per 5 AE
- Most characters buy 1-4 ranks (5-20 additional AE)

**Example**:
- Willpower 4
- Purchased: 2 ranks (10 AE)
- Max AE = 10 + (4 × 2) + 10 = 10 + 8 + 10 = **28 AE**

**Typical AE Ranges by SCL**:

| SCL | Willpower Range | Typical Max AE | Technique Uses |
|-----|-----------------|----------------|----------------|
| 1-2 | 1-2 | 15-20 AE | 3-5 techniques/fight |
| 3-4 | 2-4 | 20-30 AE | 4-7 techniques/fight |
| 5-7 | 3-6 | 25-40 AE | 5-10 techniques/fight |
| 8-10 | 5-8 | 35-55 AE | 7-14 techniques/fight |
| 11+ | 7-11 | 50-75 AE | 10-20+ techniques/fight |

### AE Regeneration

**Per Round**: Regenerate AE at the start of your turn
```
AE Regeneration = 1 + floor(Willpower / 3)
```

**Example**:
- Willpower 4: Regenerate 1 + floor(4/3) = 1 + 1 = **2 AE per round**
- Willpower 7: Regenerate 1 + floor(7/3) = 1 + 2 = **3 AE per round**

**Between Encounters**: Recover to full AE after short rest (10 minutes)

**Zero AE**: You can still act (basic attacks, Quick Actions), just can't use techniques that cost AE.

### Spending AE

**Technique Costs**:
- **Basic Techniques**: 1-3 AE
- **Advanced Techniques**: 4-7 AE
- **Ultimate Techniques**: 8-12 AE
- **Forbidden Techniques**: Variable (may cost AE + cost track marks)

**Strategic Considerations**:
- **Burst Damage**: Spend all AE early for overwhelming offense
- **Sustained Combat**: Spend AE ≤ regeneration rate for unlimited fighting
- **Resource Denial**: Force enemies to burn AE, then exploit when empty

---

## 3.4 Strain

### What Strain Represents

**Strain** is your overexertion tracker - accumulated fatigue, internal damage, and bodily stress from pushing beyond limits.

**Strain represents**:
- Blocking too much damage (your body absorbs the shock)
- Overusing forbidden techniques (tearing yourself apart)
- Pushing past exhaustion (ignoring your limits)
- Physical corruption from demonic techniques

**Strain is dangerous**: Unlike THP (which recovers quickly), Strain accumulates across encounters and can kill you.

### Strain Mechanics

**Maximum Strain**:
```
Max Strain = Endurance × 10
```

**Example**:
- Endurance 4: Max Strain = 40
- Endurance 6: Max Strain = 60

**Accumulating Strain**:
- **Blocking**: +1 Strain per Block action
- **Forbidden Techniques**: Variable (technique-specific)
- **Overexertion**: GM-called when pushing beyond limits
- **Strain-Routed Damage**: Some techniques deal direct Strain

**At Maximum Strain**: You **die** or suffer permanent injury. No save. This is the price of overexertion.

**Strain Thresholds**:
- **Below 50%**: No penalties
- **50-75%**: -1 to physical actions (Body cluster checks)
- **75-90%**: -2 to physical actions, -1 to Endurance for THP calculations
- **90-100%**: -3 to physical actions, -2 to Endurance, imminent death

### Strain Recovery

**Strain recovers SLOWLY**:
- **Short Rest** (10 minutes): Recover 0 Strain (does not help)
- **Long Rest** (8 hours): Recover Endurance Strain
- **Extended Rest** (full day): Recover Endurance × 3 Strain
- **Medical Treatment**: Can double recovery rate
- **Healing Techniques**: Most don't affect Strain (check technique description)

**Design Intent**: Strain is a **campaign resource**, not per-encounter. Accumulating too much Strain forces you to take downtime or risk death.

**Strategic Implications**:
- **Don't over-block**: Blocking is powerful but expensive long-term
- **Avoid forbidden techniques**: Strain costs persist
- **Plan downtime**: Take extended rests between dangerous missions

---

## 3.5 Guard

### What Guard Represents

**Guard** is temporary damage absorption - shields, defensive stances, protective techniques, or momentary hardening.

**Guard represents**:
- Energy shields
- Hardened skin (temporary)
- Parrying stance
- Defensive formations
- Temporary armor conjured by techniques

**Guard is ephemeral**: Resets between encounters (doesn't persist).

### Guard Mechanics

**Starting Guard**: Most characters start combat with 0 Guard

**Gaining Guard**:
- **Block Quick Action**: Gain Guard = Endurance × 2
- **Defensive Techniques**: Variable (technique-specific)
- **Ally Support**: Shield Quick Action grants ally Guard

**Example**:
- Endurance 4, use Block action
- Gain Guard = 4 × 2 = **8 Guard**

**Guard Absorbs Damage**:
1. When hit, subtract damage from Guard first
2. Guard reaches 0 → Overflow damage goes to THP
3. Guard cannot go negative

**Example**:
- You have 8 Guard, 50 THP
- Enemy deals 12 damage
- Guard absorbs 8, you lose 8 Guard (now 0 Guard)
- Overflow 4 damage → THP (now 46 THP)

**Guard Limits**:
- **Maximum Guard**: No hard cap, but stacking becomes inefficient
- **Duration**: Until depleted or encounter ends
- **Between Encounters**: Guard resets to 0

### Block Action Details

**Block** is a Quick Action that:
1. Grants Guard = Endurance × 2
2. Reduces incoming damage by 50% this round (stacks with Guard)
3. Accumulates 1 Strain

**When to Block**:
- **Big Attack Incoming**: Reduce massive damage
- **Low THP**: Need buffer before healing
- **Protecting Ally**: Stand between ally and enemy (if GM allows)

**Block Limitations**:
- Costs Quick Action (Fast SPD: Stage 1, Slow SPD: Stage 3)
- Accumulates Strain (can't spam indefinitely)
- 50% reduction applies to one attack (GM discretion for multiple)

---

## 3.6 Resource Interactions

### Damage Routing

**Three routing types** exist for techniques:

#### THP Routing (Standard)
1. Roll attack vs. defense
2. If hit, calculate damage
3. Apply DR (Damage Reduction) if character has it
4. Subtract from Guard first
5. Overflow goes to THP

**Example**:
- Attack deals 20 damage
- Target has DR 0.3 (30% reduction) → Damage = 20 × 0.7 = 14
- Target has 8 Guard → Guard absorbs 8, overflow 6 to THP
- Result: Guard 8 → 0, THP 50 → 44

#### Guard Routing
1. Roll attack vs. defense
2. If hit, calculate damage
3. **Skip DR** (goes straight to Guard)
4. Subtract from Guard
5. Overflow goes to THP (no DR on overflow either)

**Used by**: Techniques that specifically target defenses, bypass armor

#### Strain Routing
1. Roll attack vs. defense
2. If hit, calculate Strain
3. **Skip DR and Guard entirely**
4. Add directly to Strain

**Used by**: Forbidden techniques, overexertion effects, corruption attacks

### Resource Priority

**When to spend what**:

**AE**: 
- Spend freely in early rounds (regenerates)
- Save some for defensive techniques if threatened
- Burn all AE if finishing fight this turn

**Guard**:
- Use Block early if expecting big hits
- Don't over-stack (diminishing returns)
- Guard resets after fight (use it or lose it)

**Strain**:
- Avoid accumulating if possible
- Track total across campaign
- Rest when approaching 50%

**THP**:
- Last line of defense
- Recovers quickly (short rest)
- Death at 0 (protect at all costs)

---

## 3.7 Action Economy

Combat in WUXUXIANXIA offers two modes: **1-Beat Combat** (simple) and **3-Stage Combat** (advanced).

### 1-Beat Combat (Simple Mode)

**Recommended for**:
- New players learning the system
- Simple encounters (trash mobs)
- Fast-paced sessions
- One-shot games

**Turn Order**:
1. **PC Phase**: All PCs act in any order (players decide)
2. **NPC Phase**: All NPCs/enemies act (GM decides order)
3. **Round Ends**: Regenerate AE, check conditions, repeat

**Initiative**: No initiative rolls. PCs always go first (GM may rule otherwise for ambushes).

**Duration**: Faster than 3-Stage, less tactical depth.

### 3-Stage Combat (Advanced Mode)

**Recommended for**:
- Experienced players
- Important boss fights
- Tactical showcases
- Campaign climaxes

**Turn Order**:
1. **Stage 1 (Fast Actions)**: Fast SPD characters take Quick Actions
2. **Stage 2 (Major Actions)**: All characters take Major Actions (techniques)
3. **Stage 3 (Slow Actions)**: Slow SPD characters take Quick Actions

**Initiative**: Determined by SPD band (see below).

**Duration**: Longer, more tactical, more cinematic.

---

## 3.8 SPD Bands and Turn Ordering

### Determining SPD Band

**SPD (Speed)** determines when you act in 3-Stage Combat.

**Base SPD Calculation**:
```
SPD = Agility + technique bonuses/penalties
```

**SPD Bands**:
- **Fast**: SPD 6+ (or SPD 4+ with "Quick" technique modifier)
- **Normal**: SPD 2-5
- **Slow**: SPD 0-1 (or SPD 2-5 with "Heavy" technique modifier)

**What Each Band Gets**:

| SPD Band | Stage 1 | Stage 2 | Stage 3 | Total Actions |
|----------|---------|---------|---------|---------------|
| **Fast** | Quick Action | Major Action | - | 2 actions |
| **Normal** | - | Major Action | - | 1 action |
| **Slow** | - | Major Action | Quick Action | 2 actions |

**Key Insight**: Fast and Slow bands get the **same number of actions** (2), but at **different times**.

### Tactical Implications

**Fast SPD Advantages**:
- **Act first**: Set up combos, debuff enemies before they act
- **Pressure early**: Force enemies to react
- **Escape**: Reposition before enemy Major Actions

**Slow SPD Advantages**:
- **React**: See what enemies do in Stage 2, then respond
- **Counter**: Use Quick Action to undo enemy setups
- **Cleanup**: Finish off weakened enemies

**Normal SPD**:
- **Middle ground**: Act during main phase with everyone
- **One action**: Focus on high-impact Major Actions
- **Less tactical complexity**: Easier to play

### Changing SPD Band

**Techniques can modify SPD**:
- **"Quick" modifier**: +2 PP cost, increases SPD band by one step
- **"Heavy" modifier**: -1 PP cost, decreases SPD band by one step

**Reposition Quick Action**: Can change stance to trade SPD for other benefits (GM discretion).

---

## 3.9 Action Types

### Major Action

**Major Action** = Your main combat action (taken in Stage 2 of 3-Stage Combat, or during PC/NPC phase in 1-Beat Combat)

**Major Action options**:
- **Use Technique**: Activate purchased technique (costs AE)
- **Full Defense**: +2 to all defenses until your next turn (no AE cost)
- **Complex Maneuver**: GM-adjudicated special action
- **Help Ally**: Grant ally +2 to their next roll

**Most rounds**: You'll use a technique.

### Quick Action

**Quick Action** = Low-impact tactical action (taken in Stage 1 or 3 of 3-Stage Combat)

**Seven Quick Action Types**:

1. **Strike** - Basic attack
2. **Block** - Gain Guard, reduce damage
3. **Pressure** - Debuff enemy offense
4. **Weaken** - Debuff enemy defense
5. **Empower** - Buff ally offense
6. **Shield** - Buff ally defense
7. **Reposition** - Move/change stance

**Quick Actions**:
- Do NOT cost AE
- Have lower impact than techniques
- Provide tactical flexibility
- Can combo with Major Actions

### Free Action

**Free Action** = Negligible action (can be done anytime)

**Free Action examples**:
- **Speak**: Brief dialogue (1-2 sentences)
- **Drop Item**: Release held object
- **Sustain**: Maintain ongoing effect (if already activated)

**Limit**: GM may limit excessive free actions.

---

## 3.10 Quick Actions Detailed

### 1. Strike (Basic Attack)

**Effect**: Make a basic attack using a weapon or unarmed strike.

**Attack Roll**:
```
d20 + (Strength OR Agility) vs. target's Body Defense
```

**Damage** (if hit):
```
1d6 + (Strength OR Agility) damage to THP (THP-routed)
```

**AE Cost**: 0 (free)

**Use Case**: When out of AE, need to conserve resources, or finish low-HP enemy.

**Example**:
- Strength 4 character uses Strike
- Rolls d20 + 4 vs. enemy Body Defense 15
- Rolls 13, total 17 → Hit!
- Damage: 1d6 + 4 = (rolls 3) = 7 damage to enemy THP

### 2. Block (Defensive Stance)

**Effect**: Gain Guard and reduce incoming damage.

**Guard Gained**:
```
Guard = Endurance × 2
```

**Damage Reduction**: 50% reduction to one incoming attack this round (GM discretion)

**Strain Cost**: +1 Strain

**AE Cost**: 0 (free)

**Use Case**: Big attack incoming, need buffer, protecting low THP.

**Example**:
- Endurance 5 character uses Block
- Gains Guard = 5 × 2 = 10 Guard
- Next incoming attack deals 20 damage → Reduced to 10 damage → Guard absorbs all 10
- Accumulates 1 Strain

### 3. Pressure (Debuff Enemy Offense)

**Effect**: Target one enemy within Close range. Enemy suffers -2 to attack rolls until your next turn.

**No Attack Roll**: Automatic success (targets are aware you're pressuring them).

**AE Cost**: 0 (free)

**Use Case**: Enemy is about to attack your fragile ally, you lack defensive techniques.

**Example**:
- You use Pressure on Boss
- Boss was going to attack (Attack Bonus +8)
- Boss now attacks at +6 until your next turn

### 4. Weaken (Debuff Enemy Defense)

**Effect**: Target one enemy within Close range. Enemy suffers -2 to defense until your next turn.

**No Attack Roll**: Automatic success (targets are aware you're threatening them).

**AE Cost**: 0 (free)

**Use Case**: Set up ally's big attack, exploit opening.

**Example**:
- You use Weaken on Boss (Defense 18)
- Ally attacks Boss at Defense 16 instead
- Boss returns to Defense 18 on your next turn

### 5. Empower (Buff Ally Offense)

**Effect**: Target one ally within Close range. Ally gains +2 to attack rolls until your next turn.

**No Attack Roll**: Automatic success.

**AE Cost**: 0 (free)

**Use Case**: Support role, set up ally's finishing blow.

**Example**:
- Ally has Attack Bonus +6
- You use Empower on ally
- Ally attacks at +8 until your next turn

### 6. Shield (Buff Ally Defense)

**Effect**: Target one ally within Close range. Ally gains +2 to defense until your next turn.

**Optional**: May also grant small amount of Guard (GM discretion, typically Endurance × 1).

**AE Cost**: 0 (free)

**Use Case**: Protect fragile caster, block for injured ally.

**Example**:
- Ally has Defense 14
- Enemy about to attack ally
- You use Shield on ally
- Ally's Defense becomes 16 for this attack

### 7. Reposition (Move/Stance Change)

**Effect**: Move up to half your speed, change stance, or break engagement without opportunity attacks.

**Movement**:
```
Half Speed = (Agility × 5 feet) / 2
```

**Example**: Agility 4 = 20 feet per round, Reposition = 10 feet

**Stance Change**: Trade SPD for Defense (+2 Defense, -1 SPD band) or vice versa (GM discretion).

**Break Engagement**: Disengage from melee without provoking opportunity attacks.

**AE Cost**: 0 (free)

**Use Case**: Get to better position, escape melee, change tactics.

---

## 3.11 Combat Round Example (3-Stage)

**Scenario**: PCs (Fast Sword Saint, Normal Body Refiner, Slow Spirit Channeler) vs. Boss (Normal)

**Stage 1 (Fast Actions)**:
- **Sword Saint** (Fast SPD, Quick Action): Uses **Weaken** on Boss (Boss Defense -2)

**Stage 2 (Major Actions)**:
- **Sword Saint** (Major Action): Uses **Severing Strike** technique (AE 6) → Attacks Boss
- **Body Refiner** (Major Action): Uses **Crushing Blow** technique (AE 4) → Attacks Boss (benefits from Weaken)
- **Boss** (Major Action): Uses **Devastating Sweep** technique → Attacks all PCs
- **Spirit Channeler** (Major Action): Uses **Spirit Bolt** technique (AE 3) → Attacks Boss

**Stage 3 (Slow Actions)**:
- **Spirit Channeler** (Slow SPD, Quick Action): Uses **Block** → Gains Guard (too late to block Boss's Devastating Sweep, but prepares for next round)

**Round Ends**: Regenerate AE, check conditions, Boss's Weaken debuff expires

---

# Section 4: Conflict Types & Conditions

## 4.1 Three Pillars Overview

WUXUXIANXIA has **three equally viable conflict types**, called **Pillars**:

1. **Violence Pillar** (Physical Conflict)
2. **Influence Pillar** (Social Conflict)
3. **Revelation Pillar** (Horror/Existential Conflict)

**Design Philosophy**: All three are mechanically equivalent. A social manipulator is as viable as a martial artist or horror cultist.

**Mechanical Equivalence**:
- Each pillar has its own Attack and Defense stats
- Each uses the same resolution mechanics (d20 + modifier vs. DC)
- Each has 4-step condition ladders
- Each can "take out" opponents at 4th degree condition

**Thematic Distinctness**:
- Violence targets **Body Defense**, causes physical harm
- Influence targets **Mind Defense**, causes social/reputation harm
- Revelation targets **Soul Defense**, causes mental/spiritual harm

---

## 4.2 Violence Pillar (Physical Conflict)

### Violence Overview

**Violence** is physical conflict - combat, martial arts, destructive techniques.

**Target**: **Body Defense**
**Resistance**: **Body Resilience**
**Resource Pool**: **Fury** (positive pool, spent for bonuses)
**Primary Stats**: Strength, Agility (attack), Endurance (defense/resilience)

### Violence Attack Resolution

**Step 1: Attack Roll**
```
d20 + Violence Attack Bonus vs. target's Body Defense
```

**Step 2: Resistance Roll** (if hit)
```
d20 + Body Resilience vs. DC 10 + Effect Rank
```

**Step 3: Determine Condition** (if resistance fails)
- Failure by 1-4: **Injured** (1st Degree)
- Failure by 5-9: **Maimed** (2nd Degree)
- Failure by 10-14: **Mortally Wounded** (3rd Degree)
- Failure by 15+: **Ruined Body** (4th Degree)

### Violence Conditions (4-Step Ladder)

#### 1st Degree: Injured
**Effect**: -1 to physical actions (attacks, athletics, etc.)
**Description**: Bruised, winded, minor cuts, fatigue
**Recovery**: Short rest (10 minutes) or healing technique

#### 2nd Degree: Maimed
**Effect**: -2 to physical actions, movement reduced by half
**Description**: Broken bones, deep wounds, severe bruising
**Recovery**: Long rest (8 hours) + medical treatment, or healing technique (Advanced+)

#### 3rd Degree: Mortally Wounded
**Effect**: -3 to physical actions, movement reduced to 10 feet/round, dying
**Description**: Life-threatening injuries, massive blood loss, organ damage
**Recovery**: Stabilization (DC 15 medicine check or healing technique) + extended rest (days/weeks) + medical treatment

#### 4th Degree: Ruined Body
**Effect**: **Dead, crippled, or maimed beyond ordinary repair**
**Description**: Decapitated, heart destroyed, body shattered, burned to ash
**Recovery**: Resurrection magic (High-Sequence technique, extremely rare), cybernetic replacement (Artifice cultivation), or narrative resolution (divine intervention, deal with entity)

**Note**: 4th Degree = **taken out of conflict**. Cannot be recovered with normal healing.

### Fury Pool (Violence Resource)

**Fury** is a positive resource pool that accumulates during Violence conflicts.

**Gaining Fury**:
- **Critical Hit** (natural 20 on attack): +1 Fury
- **Take Damage**: +1 Fury per 10 damage taken (round down)
- **Ally Downed**: +2 Fury when ally reaches 0 THP or 4th degree condition
- **Technique Generates**: Some techniques grant Fury

**Spending Fury**:
- **1 Fury**: Reroll a failed attack roll
- **2 Fury**: +2 to attack roll (before rolling)
- **3 Fury**: Automatically succeed on a Body Resilience check
- **5 Fury**: Add extra effect to successful attack (GM adjudicated)

**Maximum Fury**: 10 Fury

**Duration**: Fury resets to 0 at end of encounter

---

## 4.3 Influence Pillar (Social Conflict)

### Influence Overview

**Influence** is social conflict - persuasion, intimidation, deception, reputation attacks, political maneuvering.

**Target**: **Mind Defense**
**Resistance**: **Mind Resilience**
**Resource Pool**: **Clout** (positive pool, spent for bonuses)
**Primary Stats**: Presence, Essence (attack), Willpower (defense/resilience)

**When to Use Influence**:
- Sect politics
- Persuading/intimidating NPCs
- Reputation attacks
- Social combat at galas/courts
- Mass persuasion

### Influence Attack Resolution

**Step 1: Attack Roll**
```
d20 + Influence Attack Bonus vs. target's Mind Defense
```

**Step 2: Resistance Roll** (if hit)
```
d20 + Mind Resilience vs. DC 10 + Effect Rank
```

**Step 3: Determine Condition** (if resistance fails)
- Failure by 1-4: **Rattled** (1st Degree)
- Failure by 5-9: **Discredited** (2nd Degree)
- Failure by 10-14: **Isolated** (3rd Degree)
- Failure by 15+: **Shattered/Broken** (4th Degree)

### Influence Conditions (4-Step Ladder)

#### 1st Degree: Rattled
**Effect**: -1 to social actions (persuasion, deception, etc.)
**Description**: Flustered, caught off-guard, minor reputation damage
**Recovery**: Short rest + successful social recovery (compliment, apology), or time (day)

#### 2nd Degree: Discredited
**Effect**: -2 to social actions, reputation questioned publicly
**Description**: Caught in lie, embarrassed publicly, allies doubt you
**Recovery**: Long rest + social repair campaign (favors, public success), or time (week)

#### 3rd Degree: Isolated
**Effect**: -3 to social actions, socially exiled from circles
**Description**: Reputation shattered, allies abandon you, doors close
**Recovery**: Major social campaign (gather new allies, perform great deed, powerful patron intervention), or time (month+)

#### 4th Degree: Shattered/Broken (Social)
**Effect**: **Publicly ruined, emotionally disconnected, politically sidelined, or fully controlled as mouthpiece**
**Description**: Name is mud, completely isolated, or mind-controlled puppet
**Recovery**: Narrative resolution (redemption arc, exile and reinvention, exorcism if mind-controlled, bargain with powerful entity)

**Note**: 4th Degree Influence = **taken out of social conflicts**. Cannot rejoin society without major narrative work.

### Clout Pool (Influence Resource)

**Clout** is a positive resource pool that accumulates during Influence conflicts.

**Gaining Clout**:
- **Critical Success** (natural 20 on Influence attack): +1 Clout
- **Public Victory**: +1 Clout per major social win
- **Reputation Boost**: +2 Clout when achieving major social milestone
- **Technique Generates**: Some techniques grant Clout

**Spending Clout**:
- **1 Clout**: Reroll a failed Influence attack
- **2 Clout**: +2 to Influence attack (before rolling)
- **3 Clout**: Automatically succeed on Mind Resilience check (social pressure)
- **5 Clout**: Call in favor from NPC or organization

**Maximum Clout**: 10 Clout

**Duration**: Clout persists between encounters (represents ongoing reputation)

---

## 4.4 Revelation Pillar (Horror/Existential Conflict)

### Revelation Overview

**Revelation** is horror/existential conflict - forbidden knowledge, eldritch entities, spiritual corruption, sanity attacks.

**Target**: **Soul Defense**
**Resistance**: **Soul Resilience**
**Resource Pool**: **Insight** (positive pool, spent for bonuses)
**Primary Stats**: Essence, Focus (attack), Resolve (defense/resilience)

**When to Use Revelation**:
- Eldritch horror encounters
- Forbidden knowledge exposure
- Spiritual corruption
- Sanity-based conflicts
- Existential/philosophical attacks

### Revelation Attack Resolution

**Step 1: Attack Roll**
```
d20 + Revelation Attack Bonus vs. target's Soul Defense
```

**Step 2: Resistance Roll** (if hit)
```
d20 + Soul Resilience vs. DC 10 + Effect Rank
```

**Step 3: Determine Condition** (if resistance fails)
- Failure by 1-4: **Shaken** (1st Degree)
- Failure by 5-9: **Haunted** (2nd Degree)
- Failure by 10-14: **Deranged** (3rd Degree)
- Failure by 15+: **Shattered/Broken** (4th Degree)

### Revelation Conditions (4-Step Ladder)

#### 1st Degree: Shaken
**Effect**: -1 to mental actions (focus, willpower checks, etc.), disturbing dreams
**Description**: Unsettled by what you witnessed, lingering unease
**Recovery**: Short rest + meditation/mental healing technique, or time (night's sleep)

#### 2nd Degree: Haunted
**Effect**: -2 to mental actions, persistent visions/nightmares
**Description**: Can't unsee what you learned, visions haunt waking hours
**Recovery**: Long rest + therapy/exorcism/meditation, or time (week)

#### 3rd Degree: Deranged
**Effect**: -3 to mental actions, reality distortion, personality shifts
**Description**: Sanity fraying, can't distinguish reality from hallucination
**Recovery**: Exorcism, intervention by High-Sequence cultivator, existential bargain, or narrative resolution (months of therapy, spiritual cleansing)

#### 4th Degree: Shattered/Broken (Mental)
**Effect**: **Catatonia, fugue state, total compromise to entity/pathway, or permanent madness**
**Description**: Mind/soul shattered beyond ordinary repair, puppet of entity, or completely mad
**Recovery**: Narrative resolution (spiritual cleansing by god/demon, entity bargaining, acceptance of madness, sacrifice to restore mind)

**Note**: 4th Degree Revelation = **taken out of mental/spiritual conflicts**. Mind is gone or controlled.

### Insight Pool (Revelation Resource)

**Insight** is a positive resource pool that accumulates during Revelation conflicts.

**Gaining Insight**:
- **Forbidden Knowledge**: +1 Insight when learning dangerous truth
- **Survive Horror**: +1 Insight per Revelation conflict survived
- **Entity Contact**: +2 Insight when communicating with eldritch entity
- **Technique Generates**: Some techniques grant Insight

**Spending Insight**:
- **1 Insight**: Reroll a failed Revelation attack
- **2 Insight**: +2 to Revelation attack (before rolling)
- **3 Insight**: Automatically succeed on Soul Resilience check
- **5 Insight**: Ask GM one question about hidden truth (must answer honestly)

**Maximum Insight**: 10 Insight

**Duration**: Insight persists between encounters (represents accumulated forbidden knowledge)

**Danger**: High Insight attracts attention from entities. At 8+ Insight, GM may introduce Revelation threats.

---

## 4.5 Condition Mechanics

### Applying Conditions

**When hit by an attack**:
1. Roll resistance (d20 + Resilience vs. DC 10 + Effect Rank)
2. Determine degree of failure
3. Apply condition based on degree

**Condition Ladder**:
- Failure by 1-4: 1st Degree
- Failure by 5-9: 2nd Degree
- Failure by 10-14: 3rd Degree
- Failure by 15+: 4th Degree

**Natural 1 on Resistance**: Automatic failure, minimum 2nd Degree condition
**Natural 20 on Resistance**: Automatic success, no condition

### Condition Stacking

**Same Condition Type**:
- Advance to next degree
- Example: Already Injured, get hit again → Maimed

**Different Condition Types**:
- Apply both, penalties stack
- Example: Injured (-1 physical) + Rattled (-1 social) = both active

**Different Pillars**:
- Each pillar's conditions are tracked separately
- Can be Injured (Violence), Discredited (Influence), and Haunted (Revelation) simultaneously

### Condition Recovery

**1st-2nd Degree**: Short/long rest + appropriate treatment
**3rd Degree**: Extended care + intervention
**4th Degree**: Narrative resolution required

**Recovery Methods**:
- **Rest**: Heals lower-degree conditions over time
- **Healing Techniques**: Instant or accelerated recovery
- **Medical/Social/Spiritual Treatment**: Required for higher degrees
- **Narrative Actions**: Required for 4th Degree

**4th Degree Recovery Examples**:
- **Ruined Body**: Resurrection magic, cybernetics, divine intervention
- **Shattered/Broken (Social)**: Redemption arc, exile and reinvention, powerful patron
- **Shattered/Broken (Mental)**: Exorcism, entity bargaining, acceptance, spiritual cleansing

---

## 4.6 Multi-Pillar Conflicts

### Using Multiple Pillars

Characters can attack using different pillars in the same encounter:
- Round 1: Violence attack (physical strike)
- Round 2: Influence attack (intimidate enemy)
- Round 3: Back to Violence

**Strategic Reasons**:
- **Exploit Weaknesses**: Enemy has low Mind Defense, use Influence
- **Tactical Variety**: Mix physical and social attacks
- **Story Moments**: Dramatic social attack mid-combat

### Target Defenses

Each character has **three separate defense stats**:

**Body Defense**: vs. Violence attacks
**Mind Defense**: vs. Influence attacks
**Soul Defense**: vs. Revelation attacks

**Building Defense**:
- **Balanced**: All three defenses moderate
- **Specialized**: One defense high, others low
- **Omni-Defensive**: Two defenses high (requires one low per restriction)

### Combo Attacks

**Violence + Influence**:
- Physically dominate while verbally breaking them
- Example: Pin enemy (Violence), then intimidate for information (Influence)

**Influence + Revelation**:
- Socially isolate, then expose to forbidden knowledge
- Example: Discredit rival publicly (Influence), then reveal sect's dark secret (Revelation)

**Violence + Revelation**:
- Physical pain + existential horror
- Example: Torture (Violence) while forcing victim to witness eldritch entity (Revelation)

---

## Section 4 Summary

**You now understand**:
- **Four Combat Resources**: THP, AE, Strain, Guard
- **Action Economy**: 1-Beat (simple) vs. 3-Stage (advanced)
- **SPD Bands**: Fast, Normal, Slow
- **Seven Quick Actions**: Strike, Block, Pressure, Weaken, Empower, Shield, Reposition
- **Three Conflict Pillars**: Violence (Body), Influence (Mind), Revelation (Soul)
- **4-Step Condition Ladders**: Each pillar has progressive degradation
- **Resource Pools**: Fury (Violence), Clout (Influence), Insight (Revelation)
- **4th Degree Conditions**: Require narrative resolution, not just recovery rolls

**Next Patch (0.3) will cover**:
- Techniques and Effect Framework
- Equipment and Artifacts
- Cultivation and Advancement
- Breakthrough and Tribulation systems

---

# End of Patch 0.2

**Sections Complete**: 0, 1, 2, 3, 4
**Sections Remaining**: 5-12
**Total Completeness**: 42% (5 of 12 sections)

**Next Patch**: ALPHA-0.3-[DATE] will add Sections 5-7 (Techniques, Equipment, Cultivation)

**Questions or Feedback**: See `/docs/wuxiaxian-reference/README.md` for related documents or `/WUXUXIANXIA TTRPG/` for original design conversations.

**Playtest Note**: This is ALPHA content. Rules may change based on testing. Report issues to GM or design team.

---

## Appendix B: Quick Reference (Patch 0.2 Content)

### Combat Resources Quick Calc

```
THP = 10 + (Endurance × 5) + bought ranks
Max AE = 10 + (Willpower × 2) + bought ranks
AE Regen = 1 + floor(Willpower / 3) per round
Max Strain = Endurance × 10
Block Guard = Endurance × 2
```

### Quick Action Summary

| Action | Effect | AE Cost | Notes |
|--------|--------|---------|-------|
| Strike | 1d6 + STR/AGI damage | 0 | Basic attack |
| Block | Guard = END × 2, 50% reduction | 0 | +1 Strain |
| Pressure | Enemy -2 attack | 0 | Until your next turn |
| Weaken | Enemy -2 defense | 0 | Until your next turn |
| Empower | Ally +2 attack | 0 | Until your next turn |
| Shield | Ally +2 defense | 0 | Until your next turn |
| Reposition | Move half speed | 0 | Break engagement |

### Condition Degrees

**Violence**: Injured → Maimed → Mortally Wounded → Ruined Body
**Influence**: Rattled → Discredited → Isolated → Shattered/Broken
**Revelation**: Shaken → Haunted → Deranged → Shattered/Broken

**Resistance Failure**:
- 1-4: 1st Degree
- 5-9: 2nd Degree
- 10-14: 3rd Degree
- 15+: 4th Degree

---

**END OF PATCH 0.2**
