I’ll split this into two big pieces:

1. Concrete mechanics right now (PCs, Patriarch, tracks, extra stage).

2. Critical review: what’s missing / incoherent and how to steer the project back to the original phased plan.

I’ll lean into shorthand you can drop straight into drafts.

---

## **1\. Concrete Mechanics Layer**

### **1.1 Baseline Assumptions (so the numbers are clear)**

* **SCL→PL mapping**:

  * SCL 2 ≈ PL 4 (street-level starting PC).

  * SCL 4 ≈ PL 8 (classic “hero baseline”).

  * In general: **PL ≈ 2 × SCL**.

* **Caps (per pillar, pre–Power Draws Blood)**:

  * Offense band: **Attack bonus \+ Effect rank ≤ 2 × SCL**.

  * Defense band: **Pillar Defense \+ Pillar Resilience ≤ 2 × SCL**.

* **Power Draws Blood (PDB) profiles** (per pillar):

  * **Balanced**: Offense band ≤ 2×SCL; Defense band ≤ 2×SCL.

  * **Blood-Forward**: Offense band ≤ 2×SCL \+ 2; Defense band ≤ 2×SCL − 2\.

  * **Ward-Forward**: Offense band ≤ 2×SCL − 2; Defense band ≤ 2×SCL \+ 2\.

* **Champions-style incentive**:

  * Taking **Blood-Forward or Ward-Forward** on a pillar counts as a **Limitation** on your sheet:

    * You get a **\~15% SCP discount** on powers tied to that pillar (Violence / Influence / Revelation), because you’ve structurally agreed to live inside that skewed band.

* **Tracks**:

  * Three shared cost tracks: **Blood**, **Fate**, **Stain**.

  * Filling them is both **a cost** (mechanical/narrative fallout) and **an investment** (they unlock discounts & special effects; see review section).

I’m going to assume the “sample party vs Gu Cult Patriarch” we were circling: SCL 2 PCs vs SCL 6 boss.

---

## **1.2 Track Lengths & Domain Interaction**

You asked for explicit values per SCL and per Domain. Here’s a workable, table-usable pattern:

### **1.2.1 Base Track Length per SCL**

For any character of SCL **N**:

* **Blood track** (body/Violence cost): `3 + N` boxes.

* **Fate track** (destiny/pact cost): `2 + ⌈N/2⌉` boxes.

* **Stain track** (corruption/sanity cost): `2 + ⌈N/2⌉` boxes.

Example:

* SCL 2 PC:

  * Blood 5, Fate 3, Stain 3\.

* SCL 6 Patriarch:

  * Blood 9, Fate 5, Stain 5\.

### **1.2.2 Domain Specialisation**

Each character has **1–2 Domains** (e.g. Gu, Violence, Influence, Revelation, Ratings, etc.).

For each Domain, choose a **primary track** and a **secondary track**:

* Primary track: **\+2 boxes**.

* Secondary track: **\+1 box**.

* Non-domain tracks remain base.

Example:

* **Body-lean Gu Brawler (Domain: Gu/Violence)**

  * Primary: Blood (+2) → Blood 7\.

  * Secondary: Fate (+1) → Fate 4\.

  * Stain stays 3\.

* **Patriarch (Domains: Gu / Revelation / Influence)**

  * Gu/Violence Domain: primary Blood (+2), secondary Stain (+1).

  * Revelation Domain: primary Stain (+2), secondary Fate (+1).

  * Influence Domain: primary Fate (+2), secondary Stain (+1).

  * (You can stack bonuses; cap at, say, \+4 per track to prevent absurd pools.)

You can formalise stacking later; for now I’ll bake explicit numbers into the stat blocks.

---

## **1.3 Sample SCL 2 Party – Mechanical Write-Ups**

I’ll give each PC:

* Short stat frame (SCL, CL/SL vibe).

* PDB profile per pillar.

* Tracks (with concrete box counts).

* Core power suite using the **Strike / Debilitate / Drain / Ward / Influence / Revelation / Movement / Utility** notation.

* Rough caps check.

These are not full PP-by-PP builds; they’re “design skeletons” that demonstrate how to hit the bands.

---

### **PC 1 – Body-Lean Gu Brawler (Violence Pillar Carry)**

**Role:** Front-line melee & Gu bruiser.  
 **SCL:** 2 (≈ PL 4).  
 **Profile:**

* **CL \> SL** (focus on Body/Mind; low Aether).

* **PDB profiles:**

  * Violence: **Blood-Forward** (+2 Off, −2 Def).

  * Influence: **Balanced**.

  * Revelation: **Ward-Forward** (he’s hard to crack spiritually, low offensive revelation).

* **Domain:** Gu / Violence (body cultivation through Gu).

#### **Tracks**

Base SCL 2:

* Blood 5, Fate 3, Stain 3\.

Domain bonuses (Gu/Violence):

* Blood primary: \+2 → **Blood 7**.

* Fate secondary: \+1 → **Fate 4**.

* Stain stays 3\.

#### **Defenses & Bands (Violence pillar)**

Assume:

* **Body Core** \~ 3 (street-level but trained).

* **Mind Core** 1, **Soul Core** 1\.

Violence band (PDB: Blood-Forward):

* Target Offense band: `2×SCL + 2 = 6`.

* Target Defense band: `2×SCL − 2 = 2`.

Choose:

* **Body Defense 0**, **Body Resilience 2** (Endurance \+ light armor).

* **Violence Defense band**: 0 \+ 2 \= 2 (at cap).

Main attack:

* **Gu-Claw Strike**: Attack \+4, Effect rank 2 → Offense band 6 (at cap).

So he hits hard but is fragile vs hit-back.

#### **Power Suite (Effects)**

1. **Gu-Claw Strike** *(Violence)*

   * Type: **Strike 2** (Balanced)

   * Attack: \+4 vs Body Defense.

   * Tags: **Melee, Brutal, Gu**

   * Write-up:

     * Base: Strike 2 (simple physical damage).

     * Extras:

       * **Multiattack (Niche)** – flurries of claw strikes.

       * **Gu Resonance (+0)** – counts as both material and cursed for interacting with defenses.

     * Flaws:

       * **Side Effect (Strong)** – On 2+ degrees of failure on your attack roll against you (critical miss / backlash), mark **1 Blood**.

   * **Interaction with PDB / tracks:**

     * Because Violence is **Blood-Forward**, Gu-Claw can be bought at a **15% SCP discount** (Limitation: “Power Draws Blood – Violence”).

     * Using the optional “Overclock” clause: the GM can allow the Brawler to push Strike 2 as if it were Strike 3 once per scene by **marking 2 Blood** (temporary overrank, but still within Offense band visually).

2. **Bone-Stack Guard** *(Violence / Ward)*

   * Type: **Ward 2** (Balanced)

   * Effect: \+2 Body Resilience (up to the Violence defense band cap).

   * Tags: **Passive, Gu Armor**

   * Extras:

     * **Sustained** – can be dropped/re-applied.

   * Flaws:

     * **Requires Gu Feed** – after every scene where you took 2+ physical hits, mark 1 Blood or the Ward drops until you “feed” the Gu during downtime.

3. **Gu Burst Lunge** *(Movement)*

   * Type: **Movement (Leaping 1, Short-Burst Dash)**

   * Used to close distance in cramped arenas.

4. **Domain Technique – “Meat for the Mill”** *(Utility / Cost)*

   * Once per session, you may **convert 2 Blood → \+1 Hero Point / Momentum** at the start of a fight by opening yourself to the Gu, but you start the fight with a minor **Wounded** condition.

---

### **PC 2 – Soul-Lean Contract Exorcist (Revelation Pillar Carry)**

**Role:** Anti-cult, Revelation nuker, Fate-heavy.  
 **SCL:** 2 (≈ PL 4).  
 **Profile:**

* **SL \> CL** (high Aether, lower physical core).

* PDB profiles:

  * Violence: **Ward-Forward** (+2 Def, −2 Off) – stays out of the worst physical danger.

  * Influence: **Balanced**.

  * Revelation: **Blood-Forward** (+2 Off, −2 Def) – pushes soul too hard when exorcising.

* Domain: **Pact / Revelation**.

#### **Tracks**

Base:

* Blood 5, Fate 3, Stain 3\.

Domain (Pact/Revelation):

* Primary: **Stain** (+2) → Stain 5\.

* Secondary: **Fate** (+1) → Fate 4\.

* Blood stays 5\.

#### **Defenses & Bands**

Assume:

* Soul Core 3, Mind Core 2, Body Core 1\.

Violence (Ward-Forward):

* Offense band cap: 2×SCL − 2 \= 2\.

* Defense band cap: 2×SCL \+ 2 \= 6\.

  * Choose Body Defense 2, Body Resilience 3 → 5 (under cap).

  * Mostly defensive.

Revelation (Blood-Forward):

* Offense band cap: 2×SCL \+ 2 \= 6\.

* Defense band cap: 2×SCL − 2 \= 2\.

  * Choose Soul Defense 0, Soul Resilience 2 → 2 (at cap).

  * High risk: he’s fragile vs horror pointed back at him.

Main Revelation attack:

* Attack \+4, Effect 2 → 6 (at cap).

#### **Power Suite**

1. **Severing Oath – Exorcism Ray** *(Revelation)*

   * Type: **Revelation Attack 2** (Strong)

   * Attack: \+4 vs Soul Defense.

   * Tags: **Ranged, Spiritual, Anti-Entity**

   * Base effect:

     * On hit, target suffers Soul damage (like Strike vs Soul), and on 2+ degrees, it also **Debilitates** one of their Revelation powers (reducing its rank by 1 until end of scene).

   * Extras:

     * **Accurate 1** – focus training.

     * **Linked Debilitate (Niche/Strong)** – vs entities with a specific Domain tag (Gu, Curse, Demon), Debilitate counts as \+1 rank.

   * Flaws:

     * **Costs 1 Fate on use vs named entities** (those bound into long-running arcs).

     * **Backlash** – on a natural 1, mark 1 Stain (entity lashes back).

   * PDB:

     * Because Revelation is Blood-Forward, this is under a **15% SCP discount**, but the GM should also allow a special Overclock:

       * Once per scene, you may **boost the effect to rank 3** and add **Multi-target (small Area)** by immediately marking **2 Stain \+ 1 Blood** and gaining a temporary **Haunted** condition after the scene.

2. **Circle of Warding Script** *(Ward / Revelation)*

   * Type: **Ward 2** (Balanced / Niche)

   * Effect: \+2 Soul Resilience to allies inside a drawn circle; they gain advantage vs mind control from entities you’ve named.

   * Extras:

     * **Area (Ritual Circle, Fixed)** – must inscribe sigils; 1 full action.

   * Flaws:

     * **Limited: Entities & Revelation attacks only.**

     * **Immobilising Focus** – while maintaining the circle, you can’t move more than a step from its edge.

3. **Fate-Laced Bargain** *(Influence / Utility)*

   * Once per scene, you may ask a named NPC (or entity) for aid:

     * Roll an Influence attack vs Mind Defense.

     * On success with 2+ degrees, you gain **1 Hero Point and 1 temporary Boon** (GM chooses).

     * On any success, mark **1 Fate**.

     * On a failure with 2+ degrees, mark **2 Fate** and the GM sets up a future complication.

---

### **PC 3 – Mind-Lean Media Oracle (Influence Pillar Carry)**

**Role:** Ratings witch, social frontline, city-clock manipulator.  
 **SCL:** 2 (≈ PL 4).  
 **Profile:**

* CL ≈ SL (balanced but tilted to Mind).

* PDB:

  * Violence: Balanced (has to survive).

  * Influence: **Blood-Forward** (burns reputation and mental health for reach).

  * Revelation: Balanced.

* Domain: **Media / Influence**.

#### **Tracks**

Base:

* Blood 5, Fate 3, Stain 3\.

Domain (Media/Influence):

* Primary: **Fate** (+2) → Fate 5\.

* Secondary: **Stain** (+1) → Stain 4\.

* Blood stays 5\.

#### **Defenses & Bands**

Assume:

* Mind Core 3, Soul Core 2, Body Core 1\.

Influence pillar (Blood-Forward):

* Offense band cap: 2×SCL \+ 2 \= 6\.

* Defense band cap: 2×SCL − 2 \= 2\.

  * Choose Mind Defense 0, Mind Resilience 2 → 2 (at cap).

  * Main Influence attack: Attack \+4, Effect 2 → 6 (at cap).

#### **Power Suite**

1. **Trending Curse – Viral Narrative** *(Influence)*

   * Type: **Influence Attack 2** (Strong)

   * Attack: \+4 vs Mind Defense (or vs “Public Opinion” clock in abstract).

   * Tags: **Broadcast, Social, Media**

   * Effect:

     * On PC-scale targets: imposes **Influence conditions**:

       * 1 degree: Shaken (social penalty vs you/your allies).

       * 2–3 degrees: Compromised (GM can impose disadvantage on social actions in your favour).

       * 4 degrees: Discredited (Shattered/Broken at social scale).

     * On clocks: 1–3 ticks depending on degrees of success.

   * Extras:

     * **Area (Audience)** – can hit groups via broadcast; costed like an Area extra.

   * Flaws:

     * **Costs 1 Fate on use if you target an ally, patron, or sponsor.**

     * **Requires Platform** – must be “on camera” (phone, stream, or ritual prism).

   * PDB:

     * Gets **15% SCP discount** for being tied to Influence pillar with Blood-Forward PDB.

     * Optional Overclock: “Ruin Campaign” – once per episode, you may treat a 2-degree success as 4 degrees vs an organisation or public figure by marking **2 Fate \+ 1 Stain** (you’ve sold out hard).

2. **Parasocial Shield** *(Ward / Influence)*

   * Type: **Ward 2** (Balanced)

   * Effect: \+2 Mind Resilience vs public shaming / social debuffs as long as your following still loves you.

   * Extras:

     * **Group Ward** – also grants \+1 to nearby allies if they’re in your “squad” image.

   * Flaws:

     * **Breakable** – when your own Stain track hits its last box, this ward collapses and inverts: enemies gain \+1 vs you until you repair your brand.

3. **Ratings Oracle – “Cut to Commercial”** *(Utility / Influence)*

   * Once per session, you can declare an **Interrupt**:

     * Spend 1 Hero Point and mark 1 Stain.

     * You insert a “commercial break” montage: the scene hard-cuts, giving the party a micro-downtime (reset 1 minor condition each, rearrange positions) while one Front clock of your choice ticks forward by 1 (it progresses off-screen).

---

## **1.4 Gu Cult Patriarch – Multi-Stage Boss (SCL 6\)**

**Concept:** High-Sequence Gu Patriarch operating at SCL 6 (≈ PL 12), starting as Revelation/Influence horror and shifting into Violence monster when cornered.

### **1.4.1 Global Frame**

* **SCL:** 6 (≈ PL 12).

* Expected party: three SCL 2 PCs. He is a **Boss** at \~300–350% of a single PC’s total SCP and operates under boss rules:

  * Extra actions (e.g. 2 turns/round).

  * Two stages (Revelation / Violence).

  * Higher caps by design, but still respecting SCL math.

* **Domains:** Gu, Revelation, Influence.

* **PDB profiles by stage:**

  * **Stage 1 (Revelation Master):**

    * Violence: Ward-Forward (he’s hard to hurt physically, low offense).

    * Influence: Blood-Forward.

    * Revelation: Blood-Forward (primary kill pillar).

  * **Stage 2 (Cornered Beast):**

    * Violence: **Blood-Forward** (switches) – physical monster.

    * Influence: Ward-Forward (more guarded socially, less offensive).

    * Revelation: Balanced (most big revelations already discharged).

### **1.4.2 Tracks**

Base SCL 6:

* Blood 9, Fate 5, Stain 5\.

Domains (Gu/Revelation/Influence) – stacking:

* Gu/Violence primary: Blood \+2, Stain \+1.

* Revelation primary: Stain \+2, Fate \+1.

* Influence primary: Fate \+2, Stain \+1.

Result (cap stacking at \+4):

* **Blood:** 9 \+ 2 \= **11**.

* **Fate:** 5 \+ 1 \+ 2 \= **8** (capped at \+4 total: 5+4=9 if you prefer; I’ll hold at 8 to be conservative).

* **Stain:** 5 \+ 1 \+ 2 \+ 1 \= 9 (again, feel free to cap at 9/10).

So: **Blood 11 / Fate 8 / Stain 9** is a believable boss-level capacity.

### **1.4.3 Stage 1 – Whispering Patriarch (Revelation / Influence)**

**Defenses & bands (SCL 6):**

* Base caps (per pillar) without PDB:

  * Offense band ≤ 12; Defense band ≤ 12\.

* Apply Stage 1 PDB:

  * Violence: Ward-Forward → Offense ≤ 10, Defense ≤ 14\.

  * Influence: Blood-Forward → Offense ≤ 14, Defense ≤ 10\.

  * Revelation: Blood-Forward → Offense ≤ 14, Defense ≤ 10\.

Assume Cores:

* Body Core 4, Mind Core 5, Soul Core 6 (he’s tilted to Soul/Mind, still above-human Body).

Pick actual bands:

* **Violence**:

  * Body Defense 6, Body Resilience 8 → 14 (at def cap).

  * Violence attacks mostly minor: Attack \+4, Effect 4 → 8 (\<10 cap).

* **Influence**:

  * Mind Defense 4, Mind Resilience 4 → 8 (under 10).

  * Influence attacks: Attack \+8, Effect 6 → 14 (at off cap).

* **Revelation**:

  * Soul Defense 4, Soul Resilience 6 → 10 (at def cap).

  * Revelation attacks: Attack \+8, Effect 6 → 14 (at off cap).

#### **Stage 1 Powers**

1. **“Gu of Whispering Mouths” – Revelation Beam**

   * Type: **Revelation Attack 6** (Strong+)

   * Attack: \+8 vs Soul Defense.

   * Tags: **Ranged, Horror, Gu, Sanity**

   * Base effect:

     * Target suffers Revelation conditions by degrees:

       * 1: Disturbed.

       * 2: Fractured.

       * 3: Unhinged (lose effective agency).

       * 4: Shattered/Broken – soul compromised by Gu; GM may treat target as a temporary NPC until cleansed.

   * Extras:

     * **Secondary Effect (Niche/Strong)** – on the next round, target must save again at −2 vs same rank or suffer 1 more degree.

     * **Selective Area (Cone)** vs minions only (he can sweep cult fodder).

   * Flaws:

     * **Costs 1 Stain on any hit vs a PC** – he must commit further to the Gu.

     * **Costs 2 Stain on a 3+ degree success** (soul-deep reversal).

   * PDB / discounts:

     * Revelation Blood-Forward → **\~15% SCP discount**.

     * Because this is a “boss signature”, it also **unlocks a Stage Transition trigger**:

       * When his **Stain reaches 6+**, he can choose to **trigger Stage 2** immediately after using this power.

2. **“Words in the Wire” – Influence Attack**

   * Type: **Influence Attack 6**

   * Attack: \+8 vs Mind Defense of a PC or vs the **“Public Panic” clock**.

   * Effect:

     * PC-scale: imposes Influence conditions (Hesitant → Compromised → Subjugated → Shattered/Broken social position).

     * Clock-scale: 1–3 ticks on City Panic / Cult Ascension clocks.

   * Extras:

     * **Area (Broadcast)** – he can speak through any Gu-infested medium in the scene.

   * Flaws:

     * **Costs 1 Fate on use vs city-scale clocks** – he entangles himself further into fate.

     * **Costs 1 Stain on a 3+ degree success vs PCs**.

3. **“Cocoon of Whispering Resin” – Revelation/Violence Ward**

   * Type: **Ward 6**

   * Effect: \+6 Soul Resilience or \+3 Body Resilience to self; may instead bubble the arena in Gu Resin providing cover.

   * Extras:

     * **Reaction (Niche/Strong)** – can trigger once per round when first attacked by Revelation or Violence, up to his Defense band cap.

   * Flaws:

     * **Costs 1 Blood each time it soaks a 3+ degree hit**.

     * On the round he triggers it, his next attack is at −2 (has to maintain).

4. **Boss Passive – “Gu Hive Mind”**

   * Once per round, when any cultist is taken out, he can:

     * Recover **1 Blood** (absorbing their meat) **or**

     * Convert **1 Blood → 1 Hero Point–equivalent “Boss Momentum”**, up to a small cap.

---

### **1.4.4 Stage 2 – Rotted Gu Titan (Violence Focus)**

Trigger: When **Stain ≥ 6** or he drops below 50% HP-equivalent, the Gu cocoon bursts; the Patriarch’s body mutates into a four-armed monster.

**PDB profiles now:**

* Violence: **Blood-Forward**.

* Influence: **Ward-Forward**.

* Revelation: Balanced.

Caps (SCL 6):

* Violence: Off ≤ 14, Def ≤ 10\.

* Influence: Off ≤ 10, Def ≤ 14\.

* Revelation: Off ≤ 12, Def ≤ 12\.

Adjust bands:

* Violence:

  * Body Defense 4, Body Resilience 6 → 10 (at def cap).

  * Main Strike: Attack \+8, Effect 6 → 14 (at off cap).

* Influence:

  * Mind Defense 6, Mind Resilience 8 → 14\.

  * Influence attacks drop to Attack \+4, Effect 4 → 8 (\<10).

* Revelation:

  * Soul Defense 4, Soul Resilience 6 → 10 (under off/def caps).

#### **Stage 2 Powers**

1. **“Gu Devouring Maul” – Violence Strike**

   * Type: **Strike 6** (Strong)

   * Attack: \+8 vs Body Defense.

   * Tags: **Melee, Brutal, Gu, Devour**

   * Effect:

     * Degrees → Violence conditions (Wounded → Crippled → Downed → Ruined Body).

   * Extras:

     * **Multiattack** – multiple claw slashes.

     * **Grab-Based Drain (Linked)** – on 2+ degrees, he also **Drains 1 rank of Body Resilience** until target is freed.

   * Flaws:

     * **Costs 1 Blood per attack vs PCs; 2 Blood on 3+ degree successes.**

   * PDB:

     * Violence Blood-Forward → **15% SCP discount**; Stage 2 is *cheaper* because it’s incredibly dangerous to run.

2. **“Gu Spore Cloud” – Area Debilitate / Revelation**

   * Type: **Debilitate 4** (Balanced)

   * Condition:

     * On failed Soul Defense, targets gain a stacking −1 to all physical actions and −1 to Soul Defense (to max −4).

   * Extras:

     * **Cloud Area** – lingers for a few rounds.

   * Flaws:

     * **Costs 1 Stain each use.**

   * Synergy:

     * This sets up Gu Devouring Maul to hit harder, and also pushes PCs closer to Shattered/Broken.

3. **Stage Trait – “Desperate Gu Bargain”**

   * Once per stage, when reduced to 0 HP-equivalent but before Ruined Body, he can:

     * Spend **3 Blood \+ 2 Fate** to stay up at 1 HP-equivalent and gain one extra full round of actions before finally going down unless the PCs deliberately exorcise/cleanse him.

---

## **2\. Critical Review & Project Steering**

Now: where the design is shaky, where it’s coherent, and how to get back to the original multi-phase plan.

### **2.1 Current State of the Project**

You currently have:

1. **A clear engine decision**:

   * d20 vs DC with degrees of success.

   * Hidden **SCL** as PL-equivalent.

   * **Three conflict pillars** (Violence / Influence / Revelation).

   * **Three cost tracks** (Blood / Fate / Stain).

   * **Power Draws Blood** as a **±2 Off/Def profile** per pillar.

2. **A stat and level scaffolding**:

   * Core stats (Body / Mind / Soul).

   * Aether stats (Control / Fate / Spirit).

   * CL/SL/SCL mapping, though still a bit hand-wavy in exact formulas.

   * SCL → PL mapping now clarified: SCL 2 ≈ PL 4; SCL 4 ≈ PL 8\.

3. **A trimmed effects philosophy**:

   * You’ve conceptually settled on a small effect list (Strike, Debilitate, Drain, Ward, Influence, Revelation, Movement, Utility, Summon/Conjure).

   * Each effect is tagged with balance category (Balanced / Niche / Strong, with Broken/Overpowered used as design warnings).

4. **Boss design direction**:

   * Bosses at **150–350% PC strength**, with stages and additional actions.

   * A concrete exemplar (Gu Patriarch) including multi-pillar play and PDB shifts.

5. **Meta structure intent**:

   * Strong playbooks on top of point-buy.

   * Use of Champions-style **Advantages/Limitations logic** as inspiration (PDB and cost tracks as Disadvantages that give you more build power).

What’s missing or drifting:

* **Exact math for stats ↔ SCL ↔ SCP**:  
   CL/SL/SCL relationships exist, but they are not yet pinned down as actual equations that output SCP budgets and cap ladders per SCL.

* **Formalised effect list with Extras/Flaws tables**:  
   You started, but it’s not yet in a book-ready matrix with clear PP/SCP values.

* **Cost track economy**:

  * You have a great motif (“Power Draws Blood”) and three tracks, but the **structural incentives** à la Champions (real discounts, not just RP tax) need to be written into the math.

* **Consistency between “ban list” and “costed flexibility”**:

  * You want to remove Broken stuff (Metamorph, broad Transform-as-Variable, Luck Control, etc.), but you also want “power at a cost”. Those should converge: the “banned” things should return as **highly-costed, highly-limited, high-track-cost options**, not disappear entirely.

* **Phase discipline**:

  * The conversation jumped from Phase 2 → Phase 3 → Boss design and samples before the **core PC build loop and power list were fully locked**.

---

### **2.2 Design Flaws / Gaps (and Fixes)**

I’ll keep to the three big structural gaps you highlighted yourself and formalise their fixes.

#### **Gap 1 – Cost Tracks as Tax, Not Investment**

Right now, Blood/Fate/Stain are mostly written as “you mark these as you use powers, bad things happen later”.

**Why it’s a problem:**

* Optimisers will try to **avoid** them rather than engage with them.

* It weakens your **“Power Draws Blood”** pillar because the mechanical optimum is to build as if PDB is a penalty, not the core fantasy.

**Fix – Treat tracks like Disadvantages (Champions-style):**

1. **PDB profiles grant SCP discount**:

   * Per pillar, choosing **Blood-Forward or Ward-Forward** yields a **10–20% SCP discount** on:

     * Offense powers keyed to that pillar (if Blood-Forward).

     * Defense/ward powers keyed to that pillar (if Ward-Forward).

   * This discount is *on top of* the ±2 Off/Def band shift.

2. **Major track hooks:**

   * At **mid thresholds** (e.g. half-full), powers can **Overclock** for free rank boosts or extras.

   * At **high thresholds**, you unlock new **Strong/Niche techniques** that you can’t buy normally – they’re gated behind “you’ve paid enough blood”.

3. **Reversibility**:

   * Emptying tracks completely should be difficult and narratively demanding (rituals, arcs, favours), reinforcing the commitment.

Result: tracks feel like **investment choices** that give you **more SCP and more toys** in exchange for long-term risk.

---

#### **Gap 2 – Redundant CL/SL Mapping**

Right now CL and SL are essentially “fancy averages” of stats \+ Aether, without much **build consequence** except feeding SCL.

**Why it’s a problem:**

* Two extra numbers that don’t change how you buy powers are **noise**.

* Simulationist vibe is good, but you want CL/SL to guide optimisation **meaningfully**.

**Fix – Let CL/SL drive discounts and availability:**

1. **CL-skewed builds (CL \> SL):**

   * All **Violence and Influence** powers gain a **5% discount**.

   * You can buy **higher caps** (e.g. \+1 to Offense bands) on Violence/Influence at slightly reduced surcharge.

   * Certain “Martial” or “Tech” tagged powers are **only** available if CL ≥ a threshold.

2. **SL-skewed builds (SL \> CL):**

   * **Revelation** and **Soul-targeting** powers gain a **10% discount** or a free Niche Advantage (e.g. “Bypasses mundane Soul defenses”).

   * You get access to **soul-pact** or **domain** effects that others simply cannot buy.

3. **Balanced builds (CL \= SL ±1):**

   * Slightly higher base caps but fewer discounts; the “generalists” of the system.

Now CL/SL are not just fluff; they are a **specialisation dial** that interacts with your SCP efficiency.

---

#### **Gap 3 – High-Risk / High-Flex Powers Just Banned**

You currently “ban” or “rewrite” traditional problem effects: Metamorph, broad Transform-as-Variable, Luck Control, etc.

**Why it’s a problem:**

* Thematically, those are perfect examples of **“power with terrifying cost”**.

* Removing them entirely lowers ceiling fantasy for high-tier play.

**Fix – Define a Flexibility Score and a Cost Multiplier Ceiling:**

1. **Flexibility Score (FS):**

   * Each Advantage or “flex-extra” (Area, Selective, Variable, etc.) contributes to an FS.

   * E.g. Area \+1, Selective \+1, Variable \+2, Broad Targeting \+1, etc.

2. **FS Threshold:**

   * If FS ≤ 3: normal; buy as usual.

   * If FS 4–6: you **must** take **at least one Limitation** that maps directly into cost tracks (e.g. “Costs 2 Stain on use”, “Requires full scene ritual”).

   * If FS \> 6: only allowed at **High-Sequence / Immortal tiers** and must be:

     * Tied to a **Domain**.

     * Attach a **Point Cost Multiplier** (e.g. ×1.5 or ×2) and **ongoing track drain**.

3. **Metamorph/Transform/Luck Control**:

   * Move into this framework:

     * **Metamorph** – High FS, requires **Corruption/Stain engines**.

     * **Broad Transform** – High FS, only available as a **Gu/Entity Ritual** with scene or arc-long consequences.

     * **Luck Control** – burns **Fate** aggressively, with hard ceilings.

Now “banned” powers become the **top shelf** of the system, not removed, but locked behind meaningful cost and play weight.

---

### **2.3 How to Get Back to the Original Plan**

The original plan was:

1. Phase 0 – Design goals (done).

2. Phase 1 – Extract engine from M\&M / Aranth (done in broad strokes).

3. Phase 2 – Core architecture (nearly there, but some math missing).

4. Phase 3 – Powers, Effects, and Balance (partially done).

5. Phase 4 – Character Creation & Advancement.

6. Phase 5 – Subsystems & Genre Support.

7. Phase 6 – GM Tools & Play Materials.

You skipped ahead into **boss design (Phase 5–6)** before **Phase 3–4 were nailed down**.

**Best sequence of actions from here:**

1. **Lock the Level Math (Phase 2.5):**

   * Finalise:

     * Exact formulas for **CL, SL, SCL**.

     * **SCL → SCP budget** per tier (SCL −1 through, say, SCL 8+).

     * Exact **Offense/Defense caps per pillar**, including how PDB modifies them.

   * Output: one clean **“SCL Ladder & Caps” table**.

2. **Finish the Effect List & Extras/Flaws Tables (Phase 3 proper):**

   * For each core effect:

     * Final rank cost in SCP.

     * List of **standard Extras** (with SCP adjustments and balance tags).

     * List of **standard Flaws** (including track-based ones like “Costs 1 Blood”).

   * Output: **2–3 pages** of tightly edited tables.

3. **Write the Power Design Manifesto & Build Rules (Phase 3.5):**

   * One-page manifesto summarising:

     * “Power Draws Blood” as a design law.

     * How Flexibility Score and track-based Limitations work.

     * How to keep builds in **Balanced/Strong** range and avoid Broken.

   * Include:

     * “You may have at most **X Strong options** and **1 high-FS power** at SCL 4”, etc.

4. **Fix the Character Creation Loop (Phase 4):**

   * Turn all your decisions into a **7-step CC procedure**:

     * Choose SCL and CL/SL skew.

     * Choose Domains and PDB profiles.

     * Assign stats (with caps derived from SCL/CL/SL).

     * Buy powers from the effect list (spending SCP, applying discounts).

     * Set cost tracks and Complications.

     * Choose playbook (or fill in its mechanical hooks).

     * Finish gear, relationships, and hooks.

   * Output: **player-facing CC chapter skeleton** and **4–8 sample archetype pages**.

5. **Then return to Bosses & Subsystems (Phase 5–6):**

   * Rebuild the **Boss\_Design workbook** against your final SCL & SCP tables.

   * Refit the **Gu Cult Patriarch** numbers to match the cleaned math.

   * Then layer in:

     * Social/Media fronts,

     * Investigation frames,

     * Downtime & cultivation loops.

6. **Finally, Quickstart Package (Phase 6.5):**

   * Once the CC loop and effect tables are stable, the “SCL 2 party vs Patriarch Stage 1–2” can become your **Quickstart scenario**:

     * Pre-gen the three PCs above fully (with SCP costs).

     * Give a trimmed Patriarch stat block.

     * Run a one-episode “Gu Revelation” in a city sector.

---

### **2.4 What to Do Next, Concretely**

Given where you are right now, the immediate next moves that will pay off most:

1. **Lock SCL 2 → SCP budget and starting stat spreads**:

   * Decide:

     * “At SCL 2, PCs get **X SCP**, recommended spread: 3 primary stats at 2, 3 at 1, 3 at 0” etc.

     * How many ranks of Strike / Debilitate / Ward are typical at SCL 2 under Balanced vs PDB.

   * That lets all these skeleton characters become real builds.

2. **Write the Effect Tables for 3–5 key effects first**:

   * **Strike, Debilitate, Ward, Influence Attack, Revelation Attack**.

   * Include:

     * Base cost per rank.

     * 5–7 Extras, 5–7 Flaws, using the Champions-inspired “Advantages/Limitations” logic with track-based Flaws.

   * Use the Gu Patriarch and the 3 PCs to **sanity-check** your numbers.

3. **Formalise PDB and track thresholds**:

   * Decide:

     * Exactly what happens at **50% filled** and **90%+ filled** on each track.

     * E.g. at 50% Blood, you unlock Overclocks; at 90% Blood, you’re on the knife’s edge and a single big cost can push you into Ruined Body consequences.

Once those three are done, the rest of the game (playbooks, bosses, scenarios) is “just” content built on a solid chassis rather than a moving foundation.

If you like, next step we can do is:

* Draft the **SCL 2 SCP budget & suggested stat spreads**,

* And pick final **base costs** for Strike, Debilitate, Ward, Influence Attack, and Revelation Attack (with 3–5 Extras/Flaws each), using the Patriarch and the PCs we just built as live test cases.

