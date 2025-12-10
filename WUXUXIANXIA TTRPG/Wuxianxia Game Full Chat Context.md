# Start

Alright, let’s lock in the spine of this thing.

I’ll treat your latest message as hard directives for Phase 2, not just ideas.

---

## **1\. Renaming PL → SCL and the Core Concept**

### **1.1 Soul Core Level (SCL)**

**Mechanic (what it does):**

* **PL is now SCL – Soul Core Level.**

* SCL is the **hidden numeric “power band”** that:

  * Sets **caps** on attack bonus \+ effect rank.

  * Constrains defenses and save DCs.

  * Defines roughly how dangerous a character is.

**Structure:**

* You defined:

   **SCL \= SL (Soul Level) \+ CL (Core Level)**

We will treat:

* **Core Level (CL)** – how refined your **Mind \+ Body \+ control over power** are.

* **Soul Level (SL)** – how potent your **Soul \+ destiny \+ metaphysics** are.

* **SCL** is their sum, used like hidden PL.

We will refine the exact formula tying CL/SL to stats later; for now:

**Designer Note:** For math purposes, SCL still fulfills the M\&M-style role:  
 **attack bonus \+ effect rank ≈ 2 × SCL**,  
 and defenses/save DCs are similarly banded.

**Fiction (how it feels):**

* SCL reads as “how crystallized your Aether Core is.”

* SL is how “awake” your soul is; CL is how “hardened” your body/mind core is.

* Higher SCL \= more terrifying presence in the setting, not just stronger punches.

---

## **2\. Stats Architecture**

You gave us a big schema; I’m going to normalize it into **layers** so it’s usable at the table and supports your “simple and fast” goal.

### **2.1 Layers Overview**

We’ll have:

1. **Primary Stats (9)** – these are the **M\&M-style ability scores**, bought with PP.

2. **Core Stats (3)** – **Mind, Body, Soul**, automatically derived from the 9 primaries.

3. **Aether Stats (3)** – **Control, Fate, Spirit**, bought separately; they drive high-end power and Sequence.

All stats share:

* **Range:** \-1 to \+11.

* **Modifier \= stat value** (no secondary mod math).

#### **2.1.1 Primary Stats (9) – “Ability Layer”**

These are the main “ability scores” players spend PP on.

* **Soul Cluster:**

  * **Essence** – raw soul potency, aura presence, mystic pressure.

  * **Resolve** – grit, conviction, refusal to yield.

  * **Presence** – charisma, command, how people and entities “feel” you.

* **Body Cluster:**

  * **Strength** – lifting, striking power, force output.

  * **Endurance** – toughness, stamina, resistance to wear and tear.

  * **Agility** – reflexes, movement, fine physical control.

* **Mind Cluster:**

  * **Technique** – learned skill, trained combat forms, optimization of power usage.

  * **Willpower** – mental resilience, focus under pressure, resisting influence.

  * **Focus** – precision, aim, ability to channel powers without bleed.

These **replace M\&M’s Abilities**, and are where you do your ability optimization.

#### **2.1.2 Core Stats (3) – Mind, Body, Soul**

These are **derived, not purchased**, to avoid “paying for numbers twice” (aligning with your Character Guide philosophy).

We define:

* **Mind Core \= round( (Technique \+ Willpower \+ Focus) / 3 )**

* **Body Core \= round( (Strength \+ Endurance \+ Agility) / 3 )**

* **Soul Core \= round( (Essence \+ Resolve \+ Presence) / 3 )**

These three:

* Are used directly as:

  * Part of **defenses/resistances**.

  * Part of **caps** (attack \+ effect).

* Feed into CL and SL (see SCL section).

**Designer Note:** Categorization here keeps the *feel* of M\&M’s Abilities \+ Derived Defenses, but turns derived values into clean averages rather than separate PP sinks, fixing “double-paying for numbers”.

#### **2.1.3 Aether Stats (3) – Control, Fate, Spirit**

These are **purchased “second layer” stats**, especially relevant for supernatural/xianxia/higher-tier play:

* **Control** – how well you command your power output and Aether Core (stability, precision at high ranks).

* **Fate** – how entangled you are with destiny, luck, and pathways; the “weight” of your story.

* **Spirit** – spiritual potency, connection to higher realms, capacity to channel celestial/cursed energies.

We will use these primarily for:

* **Demigod / Immortal tiers**,

* Certain **techniques, curses, and celestial powers**,

* **Sequence/AetherCore** progression.

---

## **3\. Sequence, SCL, and Progression Tiers**

You gave Xianxia-flavored tiers:

* **Cursed-Sequence:** 10–11

* **Low-Sequence:** 9–8

* **Mid-Sequence:** 7–5

* **High-Sequence:** 4–1 (Demigods and above)

* **Transcendent:** “Great Old One” (beyond Sequence \-1, etc.)

We’ll integrate that as the **fictional label layer on top of SCL.**

### **3.1 AetherCore Sequence Rank (Seq)**

You proposed:

AetherCore Sequence (Seq) Rank: Calculated as (Aether Stats \+ Core Stats) / 3\.

We’ll interpret that as:

* Let **CoreSum \= Mind Core \+ Body Core \+ Soul Core** (3 values).

* Let **AetherSum \= Control \+ Fate \+ Spirit** (3 values).

* Define:

  * **Seq Raw \= floor( (CoreSum \+ AetherSum) / 3 )**

Then:

* For **Mortal Realm PC play**:

  * Seq Raw ≈ **1–11** (maps cleanly to your Sequence 1–11).

* For **table use**, we present **Sequence bands**:

| Sequence Band | Approx Seq Raw | Fictional Tier |
| ----- | ----- | ----- |
| Cursed-Sequence | 1–2 | Collapsing souls, cursed mortals, broken powers |
| Low-Sequence | 3–4 | Street-level empowered, unstable rookies |
| Mid-Sequence | 5–7 | Professional operatives, city-level threats |
| High-Sequence | 8–10 | National/global heroes, demigods, angels, saints |
| Transcendent | 11+ | Great Old Ones, True Gods, cosmics beyond arcs |

**Designer Note:** This mapping is a **first-pass heuristic**. In the actual rulebook we’ll calibrate exact ranges so that “hero default” sits where you want (likely Mid-Sequence 5–7).

### **3.2 Connecting Seq and SCL**

For core balance:

* We define **SCL** as the hidden “PL-like” integer used in caps.

* We tie SCL to Sequence by picking a **simple linear mapping**. For example:

**SCL \= Seq Raw** (for most practical purposes).

Then:

* **Attack bonus \+ effect rank ≈ 2 × SCL**

* Defenses & save DCs also fall into bands keyed off **SCL** (and modified per conflict type by Core Stats).

We keep your **SCL \= SL \+ CL** statement as the *internal breakdown:*

* **CL** \= round( (Mind Core \+ Body Core \+ Control) / 3 )

* **SL** \= round( (Soul Core \+ Spirit \+ Fate) / 3 )

* **SCL \= CL \+ SL**, then we **normalize SCL** back into the Sequence band scale (e.g., by dividing by 2 and clamping).

That lets us maintain:

* A **crunchy internal relationship** for high-op players to explore.

* A **simple external dial**: GM picks the Sequence band for the campaign, which sets SCL.

---

## **4\. Defenses, Conflict Types, and Conditions**

You chose:

* **Keep the triad, but cleaned-up**, AND

* **Conflict-type-based defenses** tied to the three pillars.

So:

### **4.1 Defenses / Resistances (Triad)**

We define three **resistance defenses**, mapping closely to M\&M’s Toughness / Fortitude / Will, but aligned to your new stats and conflict pillars:

1. **Body Defense** (BD) – physical harm.

   * Replaces: Toughness \+ Fortitude.

   * Derived from: **Body Core \+ Endurance \+ relevant powers/armor**.

2. **Mind Defense** (MD) – social, mental, and political influence.

   * Replaces: Will, and social “defense” equivalents.

   * Derived from: **Mind Core \+ Willpower \+ Presence** (for reputation/authority).

3. **Soul Defense** (SD) – horror, revelation, cosmic/corruptive harm.

   * New but conceptually overlaps with parts of Fortitude \+ Will in M\&M.

   * Derived from: **Soul Core \+ Resolve \+ Spirit**.

These three are rolled as:

* **d20 \+ Defense vs 10 \+ Effect Rank**, with degrees of failure mapping to **condition ladders**.

### **4.2 Conflict Types**

We define **three conflict types**, each primarily hitting one defense:

1. **Violence Conflicts** – physical combat, destructive powers.

   * Attacks target **Body Defense**; conditions \= Wounded, Staggered, Incapacitated, etc.

2. **Influence Conflicts** – social, political, psychological pressure.

   * Attacks (Threaten, Persuade, Blackmail, Propaganda) target **Mind Defense**; conditions \= Hesitant, Swayed, Compelled, Discredited, etc.

3. **Revelation Conflicts** – horror, forbidden knowledge, metaphysical strain.

   * Attacks target **Soul Defense**; conditions \= Shaken, Fractured, Cracked, Broken, etc.

**Designer Note:**

* This preserves the **M\&M-style triad** (three core saves) while making the **political/social/horror** pillars mechanically real.

* All three conflict types use **the same degrees logic** (1–4 degrees of failure → progressively worse conditions).

We will prune and rename messy conditions from M\&M, focusing on **short, punchy ladders per conflict type** in a later phase.

---

## **5\. Hybrid Non-Combat System (Social / Investigation / Media)**

You chose **Hybrid**:

* PC-scale conflicts use attack/defense.

* Big-picture threats use clocks.

### **5.1 Character-Scale Social/Political/Media Scenes**

Mechanically:

* Use **Influence or Revelation conflict** rules:

  * **Attack:** d20 \+ appropriate skill/Power vs **Mind Defense or Soul Defense**.

  * Degrees of success apply **social or revelation conditions**.

* Examples:

  * Exposing a politician’s scandal (Attack vs Mind Defense; on 2+ degrees, apply Discredited).

  * Interrogating a cultist (Attack vs Soul Defense; conditions like Cracked lead to them revealing truths).

### **5.2 Fronts, Clocks, and “Seasonal Weather”**

For **wider arcs** (media cycles, political crises, creeping horror), we use **fronts and clocks**:

* Each front has one or more **clocks**:

  * e.g. “City Panic” (4 segments), “Cult Ascension” (6 segments), “Media Backlash” (4 segments).

* When PCs succeed on relevant Influence or Revelation actions:

  * Their **degrees of success** tick these clocks in their favor (or reduce the enemy’s clocks).

* When they fail or the GM spends threat resources:

  * Front clocks advance against them (panic rises, cult progresses, media turns hostile).

**Designer Note:**  
 This keeps **table resolution unified** (degrees → segments), while giving seasonal play a visible pacing mechanism without a second mini-system.

---

## **6\. Character Build Method: Strong Playbooks \+ Point-Buy**

You chose **Strong playbooks overlaid on point-buy**.

### **6.1 Under-the-Hood**

* **Core chassis is still PP-based**, like M\&M:

  * You get **X PP** based on SCL/Sequence band.

  * You buy **Primary Stats, Aether Stats, Skills, Powers** within caps that reference SCL and Core Stats.

### **6.2 Playbooks (Front-End)**

Each **Playbook** (e.g. “Dream-Scarred Investigator”, “Cursed Sequence Enforcer”, “Media Oracle”) provides:

1. **Identity & Role**

   * Concept, typical themes, core fantasy.

2. **Recommended Band**

   * “Designed for **Mid-Sequence** (SCL \~6–8)” etc.

3. **Stat Skeleton**

   * Starting spreads or **menus**:

     * e.g. “Pick one Soul focus: (High Essence / High Resolve / High Presence)”

     * “Allocate \+6 across Body cluster with at most \+3 in any Stat.”

4. **Unique Moves / Subsystems**

   * 2–4 **signature rules hooks**:

     * e.g. a special way to gain/convert Hero Points.

     * A custom way to interact with one of the clocks (media, politics, horror).

     * A discount or alternate build pattern for certain effects (Balanced, not Overpowered).

5. **Build Guidance**

   * Suggested **power sets** and **Balanced / Niche option picks** from the effect list.

Players can:

* **Follow the playbook strictly** for quick character generation.

* **Use it as a scaffold** and then dive into full point-buy.

* **Ignore playbooks entirely** if they’re M\&M veterans and want freeform builds.

**Balance Note:**

* Playbooks will be tuned toward **Balanced to Strong** in capability, avoiding Overpowered/Broken combos.

* Pure free-build is allowed, but the text will explicitly flag known Overpowered/Broken patterns using your taxonomy.

---

## **7\. Meta-Currency: Evolved Hero Points \+ Cost Tracks**

You picked **A. Evolved Hero Points**.

### **7.1 Positive Currency (Hero Points 2.0)**

We’ll rename them later (e.g. **Edge, Spark, Core Charge**), but functionally:

* **Earned by:**

  * Playing to Complications.

  * Accepting GM hard moves (horror revelations, media fallout, political losses).

  * Taking voluntary risks or costly pushes (“Power Draws Blood” moments).

* **Spent for:**

  * **Rerolls** with advantage (as in M\&M’s Hero Points).

  * **Power stunts** (temporary Alternate Effects or strong narrative uses).

  * **Resisting or downgrading conditions** (especially Soul/Mind conditions).

### **7.2 Cost / Threat Tracks**

To support “Power Draws Blood” and Seasons of Escalating Threat, we’ll add **separate negative tracks**; each character (and/or front) can track:

* **Trauma** – accumulated Mind/Soul damage from horror and stress.

* **Corruption** – influence of cursed/celestial techniques, external entities, or moral decay.

* **Exposure** – media/political vulnerability, blackmail material, public image cracks.

Mechanically:

* Certain strong moves (**Strong / Overpowered effects** in old M\&M terms rebalanced to **Strong but costly**) will explicitly say:

  * “On use, mark **Corruption \+1**” or “Advance **Exposure** by 1–2 steps on the city’s clock.”

* Some conditions or thresholds on these tracks:

  * Unlock **new power** (Niche or Strong options),

  * But also impose **permanent complications** or **playbook changes** (tragedy-forward arcs).

**Designer Note:**  
 This lets you keep Hero Points as the **player-friendly** resource while letting “Power Draws Blood” live in **structured cost tracks**, not just GM fiat.

---

## **8\. Phase 2 – Decisions & Open Questions**

### **Decisions Made (Phase 2\)**

* **Core engine:**

  * d20 \+ modifier vs DC with graded degrees of success/failure.

  * Hidden **SCL** (Soul Core Level) acts as PL-equivalent cap.

* **SCL / Seq integration:**

  * SCL \= SL \+ CL under the hood; for practical caps SCL is normalized and effectively ≈ Sequence Rank.

  * **Sequence bands** (Cursed, Low, Mid, High, Transcendent) define **fictional tiers** and rough SCL ranges.

* **Stats:**

  * **Primary Stats (9):** Essence, Resolve, Presence; Strength, Endurance, Agility; Technique, Willpower, Focus (M\&M-style abilities).

  * **Core Stats (3):** Mind, Body, Soul – derived averages of the nine primaries.

  * **Aether Stats (3):** Control, Fate, Spirit – purchased, used for high-tier play and Sequence.

* **Defenses & conflicts:**

  * **Defenses:** Body Defense, Mind Defense, Soul Defense (triad), derived from Core \+ relevant Primaries.

  * **Conflict types:** Violence → Body; Influence → Mind; Revelation → Soul.

  * All use **the same degrees and condition ladder logic**, with tailored condition names.

* **Non-combat system:**

  * **Hybrid model:**

    * PC-scale social/political/horror scenes use attack/defense \+ conditions.

    * Big fronts (media, politics, cults) use **clocks** tied to degrees outcomes.

* **Build method:**

  * **PP-based** core (point-buy) with **strong playbooks** layered on top, giving:

    * Stat skeletons, unique moves, and themed guidance.

* **Meta-currency:**

  * **Evolved Hero Points** (renamed later) as positive player currency.

  * **Cost tracks**: Trauma, Corruption, Exposure (at minimum) to enforce “Power Draws Blood”.

### **Open Questions / Options (for Phase 3+)**

* Exact **numeric mapping** between Seq, CL, SL, and SCL (we’ll finalize when we design caps and power ranks).

* Final **names and ladders** for conditions in Violence / Influence / Revelation.

* Final **names and exact mechanics** for the positive meta-currency and each cost track.

* How strongly the **Immortal/Transcendent** tiers are baked into the core book vs left for an “Immortal Realm” expansion.

---

Next, in **Phase 3 – Powers, Effects, and Balance**, I’ll:

* Propose a **trimmed, rebalanced effect list** grounded in your Character Guide categories (Broken → Useless).

* Show how **SCL \+ Core/Soul** stats define caps for each conflict type.

* Draft the **Power Design Manifesto** and an example power set, tuned to this SCL/Sequence \+ stat architecture.

Below I’ll first ask the clarifying questions you requested (with my current working assumptions baked in), then go straight into Phase 3: trimmed effect list, SCL \+ caps, manifesto, and an example power set.

---

## **1\. Clarifying questions for Phase 3+ open items**

I’ll phrase each as: question \+ what I’ll assume for now if you don’t override it.

### **1.1 Mapping between Seq, CL, SL, and SCL**

**Q1.** Do you want CL and SL to be *derived from stats* or *chosen as dials* that then constrain stats?

* **Option A – Derived from stats (my default assumption):**

  * Let the six stats be:

    * Core: **Body, Mind, Soul**

    * Aether: **Control, Fate, Spirit**

  * Define:

    * **CL (Core Level)** \= ⌊(Body \+ Mind \+ Soul) / 3⌋

    * **SL (Soul Level)** \= ⌊(Control \+ Fate \+ Spirit) / 3⌋

    * **SCL (Soul Core Level)** \= CL \+ SL

    * **Seq (Sequence Rank)** \= ⌊(Body \+ Mind \+ Soul \+ Control \+ Fate \+ Spirit) / 3⌋

  * Ignoring rounding, **Seq ≈ SCL**, which matches your “AetherCore Sequence \= (Aether \+ Core) / 3” statement.

* **Option B – Chosen dials:**

  * GM sets campaign **SCL** (e.g. SCL 8).

  * Each character chooses **CL \+ SL \= SCL** as a build profile (e.g. CL 5 / SL 3).

  * Stats must then fit caps derived from CL/SL (e.g. no Core stat above CL+2, no Aether stat above SL+2).

**Working assumption:** Option A (derived from stats), because it ties nicely into your “Sequence” cosmology and keeps “Level \= what you’ve actually cultivated”.

---

### **1.2 Condition ladders for Violence / Influence / Revelation**

We already agreed on three conflict pillars; here’s a concrete proposal and question.

**Q2.** For each pillar, are you happy with a **4-step track** where Degree 4 is always a “taken out / Shattered” state, with Mind and Soul sharing the same 4th-degree text?

**Draft ladders (names can be reskinned):**

1. **Violence (Body Track)** – physical harm

   * **1st Degree – Wounded:** −2 to Body actions (attacks, physical skills, Body Defense). Narratively: bruised, bleeding, winded.

   * **2nd Degree – Crippled:** Wounded penalties; plus Hindered/Imbalanced; certain movement/combat options locked.

   * **3rd Degree – Downed:** You are physically taken out *for the current scene* (unconscious, pinned, dying, or otherwise unable to act).

   * **4th Degree – Ruined Body:** Permanent or campaign-scale injury: maiming, severe trauma, or death unless intense intervention occurs.

2. **Influence (Soul / Social Track)** – social, political, spiritual authority

   * **1st Degree – Shaken:** −2 to Soul-based social actions (Persuasion, Command, Presence-equivalents).

   * **2nd Degree – Compromised:** Ongoing penalties; GM may “lean” on you with soft compulsions and reputation fallout.

   * **3rd Degree – Subjugated:** You are effectively **Controlled** socially/politically in this sphere (mouthpiece, puppet, or persona non grata with no leverage).

   * **4th Degree – Shattered/Broken (Shared):**

      You are “mentally/spiritually taken out” in the current context: publicly ruined, emotionally disconnected, mentally frayed, politically sidelined, or fully controlled as a mouthpiece; or spiritually taken out (catatonia, fugue state, complete compromise to an entity/pathway, etc.). Reversal *requires major narrative actions*: exorcisms, interventions, existential deals, campaigns to rebuild reputation. Not just “roll to recover”.

3. **Revelation (Mind / Sanity Track)** – reality-fracturing insight and horror

   * **1st Degree – Disturbed:** −2 to Mind-based checks (analysis, investigation, perception vs illusions).

   * **2nd Degree – Fractured:** Severe penalties; intrusive visions; difficulty distinguishing safe vs unsafe.

   * **3rd Degree – Unhinged:** You lose effective agency for the scene: panic, fugue, or obsessive behaviour; GM and player collaborate on how.

   * **4th Degree – Shattered/Broken (Shared):** Same shared 4th-degree text as above.

**Working assumption:** Use these ladders, with the shared **4th Degree – Shattered/Broken** for Mind & Soul, and a parallel **Ruined Body** for Violence.

---

### **1.3 Positive meta-currency and cost tracks**

You want “power at a cost” to be real, mechanically.

**Q3.** Do you want a **single positive meta-currency** plus **three cost tracks**, or multiple different currencies?

* **Option A – Single meta-currency \+ three cost tracks (my default):**

  * **Positive currency:** e.g. **Momentum** (or “Gu Favour”, “Edge”, etc.). Used for re-rolls, power stunts, scene edits—success-facing.

  * **Cost tracks:**

    * **Blood** (Body strain, injury, self-harm risk).

    * **Fate** (entangled destiny, debt to entities, bad-luck futures).

    * **Shadow** or **Stain** (corruption, loss of self, moral/spiritual erosion).

  * Power can give you \+2 Offense/Defense, extra ranks, or scene-breaking stunts **if** you mark cost on these tracks.

* **Option B – Several named “currencies”:** e.g. Blood Tokens, Karma, Gu Resonance; more flavour, more cognitive load.

**Working assumption:** Option A – one positive pool (**Momentum**) and three named cost tracks (**Blood / Fate / Stain**), to keep table play manageable.

---

### **1.4 Immortal / Transcendent tiers in the core book**

**Q4.** For the core rulebook, do you prefer:

* **Option A – Mortal-first core, Immortal teased, expanded later (my default):**

  * Core book fully supports **Cursed / Low / Mid-Sequence** (street-level to “S-class” heroes).

  * **High-Sequence, True God, Great Old One** tiers exist as preview sidebars and conversion notes but are not fully detailed.

  * A later **Immortal Realm** book unlocks new SCL bands, effects (e.g. reality rewriting), and altered caps.

* **Option B – Core book bakes Immortals in:**

  * Same core engine, but it includes full rules for Great Old Ones, demigods, and god-logic from day one.

**Working assumption:** **Option A** – mortal-focused core with explicit hooks for an **Immortal Realm expansion** that unlocks wilder SCL bands and looser caps.

---

## **2\. Phase 3 – Powers, Effects, and Balance**

Now into the meat: effects list, SCL \+ stat caps, the “power at a cost” trade, and an example power set.

### **2.1 Core frame recap**

* Resolution: **d20 \+ modifier vs DC, with degrees of success/failure**, à la M\&M 3e.

* Three pillars of conflict:

  1. **Violence (Body)** – physical combat, injury, environmental hazards.

  2. **Influence (Soul)** – social, political, spiritual leverage.

  3. **Revelation (Mind)** – knowledge, sanity, eldritch truths.

* Conditions: each pillar has a **4-step track**, with **shared 4th-degree Shattered/Broken** for Mind & Soul, and **Ruined Body** for Violence.

* Balance taxonomy: **Broken / Overpowered / Strong / Balanced / Niche / Weak / Useless**, directly inherited from the Character Guide.

---

## **3\. SCL, stats, and caps (including ±2 “Power Draws Blood” trade)**

### **3.1 Proposed numeric mapping**

**Stats:**

* **Core Stats:** Body, Mind, Soul.

* **Aether Stats:** Control, Fate, Spirit.

* **Range:** −1 to \+11 (as you specified).

**Levels:**

1. **Core Level (CL):**

   * CL \= ⌊(Body \+ Mind \+ Soul) / 3⌋.

2. **Soul Level (SL):**

   * SL \= ⌊(Control \+ Fate \+ Spirit) / 3⌋.

3. **Soul Core Level (SCL):**

   * SCL \= CL \+ SL.

   * This is the **primary balance dial**, replacing PL.

4. **Sequence Rank (Seq):**

   * Seq \= ⌊(Body \+ Mind \+ Soul \+ Control \+ Fate \+ Spirit) / 3⌋.

   * Algebraically, without rounding, **Seq \= SCL**; with rounding, they’re usually within ±1.

   * For **mechanical caps**, use **SCL** (integer). For **fluff/realm names**, use Seq.

**Designer Note:** Treat SCL as “hidden PL”; Seq is the **in-world label** (“10th Sequence”, “High-Sequence 2”, etc.). Mechanically, they’re the same number 95% of the time.

---

### **3.2 Offensive bands (per pillar)**

For each pillar, you have:

* **Attack** (to-hit) for that pillar.

* **Power** (effect rank) for that pillar.

**Base cap (Balanced profile):**

* **Attack \+ Power ≤ 2 × SCL** (per pillar).

* Each individually **≤ SCL \+ 2**.

Example at **SCL 8**:

* Balanced fighter: Attack 8 / Power 8 (8 \+ 8 \= 16 \= 2 × 8).

* Or Attack 10 / Power 6, etc., as long as both ≤ 10 and sum ≤ 16\.

---

### **3.3 Defensive bands (critique \+ simplification)**

You proposed several defense bands; here’s a critical look and a simplified version.

#### **Your proposal (summary)**

* **Material & Physical band:**

  * Body Defense \+ Body Resilience ≤ 2 × SCL.

* **Sanity / Abstract band:**

  * Mind Defense \+ Mind Resilience ≤ 2 × SCL.

* **Social / Spiritual band:**

  * Soul Defense \+ Soul Resilience ≤ 2 × SCL.

* **MIMP band:**

  * Mind Defense \+ Soul Defense \+ Mind Resilience \+ Soul Resilience ≤ 4 × SCL.

* **Actual defense band (Body \+ MIMP \+ both Resiliences)** with some unknown multiplier.

**Critical analysis:**

1. **Per-pillar bands at 2 × SCL** are great: they mirror the classic Dodge/Toughness and Will/Fortitude PL caps one-for-one, just mapped to Body/Mind/Soul.

2. The **MIMP band** (sum of all Mind/Soul defense \+ resilience ≤ 4 × SCL) is redundant **if** each pillar is already capped at 2 × SCL: the sum cannot exceed 4 × SCL anyway.

3. The proposed **“Actual defense band”** (Body Defense \+ MIMP Defense \+ Soul Resilience \+ Body Resilience ≤ k × SCL) risks:

   * **Double-counting** some values.

   * Creating a **fourth cap layer** that’s hard to track at the table.

   * Providing little extra balance value compared to simply saying “pick one pillar to be your primary defense, the others trail slightly”.

**Simplified proposal:**

* **Primary defense caps (per pillar):**

  * **Violence:** Body Defense \+ Body Resilience ≤ 2 × SCL.

  * **Influence:** Soul Defense \+ Soul Resilience ≤ 2 × SCL.

  * **Revelation:** Mind Defense \+ Mind Resilience ≤ 2 × SCL.

* **Hard individual caps:**

  * Any single **Defense** or **Resilience** stat ≤ SCL \+ 2\.

* **Optional high-op guidance instead of MIMP band:**

  * “Across all three pillars, no character can have more than **one pillar at the full 2 × SCL band**.  
     At least one other pillar must be **at or below 1.5 × SCL**, to avoid omni-defensive builds.”

**Working assumption:** Use the **per-pillar 2 × SCL caps** plus the “only one pillar fully maxed” rule, and drop the explicit MIMP/Actual summed bands from the core text (they can come back as optional GM tools for high-op campaigns).

---

### **3.4 “Power Draws Blood” ±2 trade**

To realize your “power at a cost” motif in crunchy terms:

**Baseline (Balanced profile):**

* Offense band: Attack \+ Power ≤ 2 × SCL (Attack, Power ≤ SCL \+ 2).

* Defense band: Defense \+ Resilience ≤ 2 × SCL (each ≤ SCL \+ 2).

**Power Draws Blood option (per pillar, at character build):**

For each pillar (Violence, Influence, Revelation), choose one of three **profiles**:

1. **Balanced:**

   * Caps as above (Attack, Power, Defense, Resilience all ≤ SCL \+ 2, sums ≤ 2 × SCL).

2. **Blood-Forward (Glass Cannon):**

   * **Offense Band:** Attack \+ Power ≤ 2 × SCL **\+ 2**.

   * **Defense Band:** Defense \+ Resilience ≤ 2 × SCL **− 2**.

   * Narratively: you hit harder / more reliably because you let power draw blood from your defenses.

3. **Ward-Forward (Bulwark):**

   * **Defense Band:** Defense \+ Resilience ≤ 2 × SCL **\+ 2**.

   * **Offense Band:** Attack \+ Power ≤ 2 × SCL **− 2**.

   * You’re a shield-first build; your power invests in survivability.

Mechanically:

* This is the **±2 trade** you described, structured as a **build-time choice**.

* For each ±2 you take, you must also define a **corresponding Cost Track hook**, e.g.:

  * Blood-Forward Violence: when you use full Offense, mark **Blood**.

  * Blood-Forward Revelation: at high Revelation Offense, mark **Stain** (corruption).

  * Ward-Forward Influence: heavy use marks **Fate** (oaths, obligations, cosmic IOUs).

**Designer Note:** You can later add **scene-based pushes** (temporarily shifting another ±2 mid-combat by paying extra cost on a track), but the core rule should be: **you chose your trade-offs at build, and they define how your power hurts you.**

---

## **4\. Trimmed, rebalanced effect list**

This list is intentionally **smaller and sharper** than RAW M\&M, grounded in the Character Guide’s analysis of Balanced/Strong/Broken options.

I’ll group them into categories.

### **4.1 Core attack effects**

These are the “combat engine”:

1. **Strike (Damage)** – Balanced

   * Straight hit-point analogue vs **Body Resilience**.

   * Default violence effect. Area and Multiattack are allowed as **Extras** but are costed and capped tightly (e.g. max rank \= SCL).

2. **Debilitate (Affliction)** – Balanced with curated conditions

   * Uses the three condition tracks: Violence, Influence, Revelation.

   * For this game, **ban / rewrite** the problematic conditions the Guide flags as too strong (Compelled, Controlled, some uses of Transformed, etc.) and fold them into the **4th-degree Shattered/Broken** result instead of being freely available mid-track.

   * Example patterns:

     * Violence Debilitate: Wounded → Crippled → Downed → Ruined Body.

     * Influence Debilitate: Shaken → Compromised → Subjugated → Shattered/Broken.

     * Revelation Debilitate: Disturbed → Fractured → Unhinged → Shattered/Broken.

3. **Drain (Weaken)** – Niche→Balanced when constrained

   * Used to reduce specific stats (Defense, Resilience, Offense) with hard limits:

     * Cannot reduce any stat below **−1** without GM sign-off.

     * No “all traits” Weaken; always nail down a narrow subset.

4. **Push / Pull (Move Object-based attack)** – Balanced

   * A Violence-aligned effect that uses a Move Object core to do knockback, reposition, or grappling plus light damage.

   * Explicitly forbidden from being a full “telekinetic everything” build unless heavily limited.

### **4.2 Mobility and positioning**

5. **Flight** – Strong but declared “Gold Standard”

   * We follow the Guide’s stance: Flight is a bit too good vs other movement options, but that’s acceptable if we treat it as the **baseline** and emulate others via limits and descriptors.

   * Leaping, Speed, Wall-crawling, etc. are built as **Flawed Flight variants**.

6. **Teleport** – Strong, tightly limited

   * Requires:

     * Either **short range** (within line-of-sight/scene) or

     * Significant **Costs** (Blood/Fate) for long-range jumps.

   * No “perfect tactical teleport spam” without strong narrative costs.

### **4.3 Defense, mitigation, and control**

7. **Armor / Wards (Resilience boosts)** – Balanced

   * Mechanically: like Protection and similar toughness powers, but with the Character Guide’s advice applied—prefer Resilience via Stats \+ specific powers over easily-nullified Protection.

   * You can tag Armor to one pillar (Physical, Social, Sanity) or MIMP-style cross-attacks at higher Seq.

8. **Guard (Deflect-lite)** – Niche→Balanced

   * A simplified Deflect variant:

     * Only protects a **small group/zone**.

     * Cannot combine **Reaction** \+ **Selective** nonsense.

     * Encouraged to be Linked to your own attacks so you’re not giving up your whole turn.

   * This is your “parry bullets for allies” or “counter-curse” effect.

9. **Barrier (Create-lite)** – Balanced

   * A Create derivative that explicitly **only makes static barriers/cover**, not arbitrary objects.

   * Great for “Gu walls”, cursed sigil domes, etc.

10. **Immunity (narrow)** – Niche→Balanced

    * Restricted to:

      * Very narrow, **rare** descriptors (e.g. your own Pathway backlash, your personal Gu, a uniquely keyed curse).

      * Or partial mitigation (e.g. treat X as one degree lower).

    * No broad “Immunity to all Mental Effects” type picks.

### **4.4 Senses, information, and influence**

11. **Enhanced Senses / Super-Senses** – Balanced

    * Keep RAW-style sense packages but cap total “perception advantage” vs others.

12. **Mind Pierce (Mind Reading-lite)** – Strong, restricted

    * Single-target, requires contested rolls and/or explicit cost (Fate or Stain).

    * Cannot be Area; cannot be completely undetectable.

13. **Illusion / Glamour** – Niche→Balanced

    * Built as Affecting Perception (penalties, misdirection) rather than reality-editing.

    * Influences relevant pillars: Influence (social perception), Revelation (sanity-damaging illusions).

### **4.5 “Removed or rewritten” high-risk mechanics**

Following the Character Guide’s verdicts:

* **Metamorph:**

  * Listed as **Broken**. Remove as a discrete mechanic. Shape-change is done as **Arrays** with descriptive forms, or as **Summon**\-like externalization.

* **Broad Transform-as-Variable:**

  * Treat **Transform** as a strictly **debuff effect** (e.g. turn weapons brittle, bodies into statues with clear drawbacks) or as a templated alternate form with fixed stats. No “Transform anything into anything” engines.

* **Luck Control (Negate Fiat / Force Reroll / infinite HP loops):**

  * Allow only **self-only reroll** style, or scene-limited support with strict per-scene uses.

  * Explicitly ban any pattern that allows “overriding GM Fiat” or infinite Momentum loops.

* **Minions / Sidekicks:**

  * Summon/Minion mechanics are either **removed from PCs** or tightly scoped (e.g. one named companion at PC-tier cost). The Character Guide flags multi-characters as strongly problematic.

**Designer Note:** This is where we are most aggressively forking from standard M\&M: we inherit the *analysis* but not the dangerous toys.

---

## **5\. Power Design Manifesto (draft)**

**1\. Effect-based, fiction-first, but balance-conscious.**  
 All powers are built from a **small core effect list** (Strike, Debilitate, Drain, Mobility, Barrier, Guard, Senses, narrow Immunities). You describe them as cursed techniques, Gu contracts, divine blessings, etc.—but you pay for what they do, not what they look like. The Character Guide’s balance judgments are treated as **rules guidance**, not mere suggestions. Broken / Overpowered patterns are either removed or rewritten as carefully-scoped effects.

**2\. SCL governs everything; Core and Aether decide *how* you’re powerful.**  
 Your six stats (Body, Mind, Soul, Control, Fate, Spirit) determine your **CL, SL, and SCL**. SCL is the hidden PL that sets your caps; CL and SL tell us whether your strength is more material vs immaterial. Attack and Defense bands for each conflict pillar are tied directly to SCL, and the game expects you to pick where you are strong and where you are vulnerable.

**3\. Power always has a cost, structurally.**  
 Through **Power Draws Blood** profiles and the **Blood / Fate / Stain** cost tracks, specializing your offense or defense gives you **\+2 in one band at the cost of −2 in its inverse**, and hooks into long-term consequences: injury, entanglement, corruption. Mind and Soul can be Shattered/Broken in ways that require exorcisms, interventions, and campaigns to repair, not just a recovery roll. This binds your optimization mini-game directly to tragedy-forward, horror-adjacent fiction.

---

## **6\. Example power set (SCL-tuned)**

Let’s build an example for a **SCL 8, CL 4, SL 4** character – street-level but very dangerous.

### **6.1 Character snapshot**

* Core Stats: Body 5, Mind 3, Soul 4 → CL \= ⌊(5+3+4)/3⌋ \= 4\.

* Aether Stats: Control 4, Fate 4, Spirit 4 → SL \= ⌊(4+4+4)/3⌋ \= 4\.

* SCL \= 8\.

* Profile choices:

  * **Violence:** Blood-Forward (Glass Cannon).

  * **Influence:** Balanced.

  * **Revelation:** Balanced.

### **6.2 Caps for this character**

* **Violence Offense (Blood-Forward):**

  * Attack\_V \+ Power\_V ≤ 2 × 8 \+ 2 \= 18\.

  * Attack\_V, Power\_V ≤ SCL \+ 2 \= 10\.

* **Violence Defense (Blood-Forward penalty):**

  * Defense\_V \+ Resilience\_V ≤ 2 × 8 − 2 \= 14\.

* **Influence / Revelation (Balanced):**

  * Attack/Power ≤ caps with sum ≤ 16\.

  * Defense/Resilience ≤ caps with sum ≤ 16\.

Assume we assign:

* Violence Attack 10, Power 8 (18 total – maxed offense).

* Violence Defense 6, Resilience 8 (14 total – somewhat fragile).

* Influence & Revelation around Attack 8/Power 8 and Defense 8/Resilience 8 (balanced).

### **6.3 “Gu-Swarm Cursed Technique” – sample power set**

**Theme:** Your Soul Core is bound to microscopic Gu-quarks that consume Qi and excrete lethal, reality-twisting fields.

**Power Set: “Gu-Swarm Cursed Technique” (Violence \+ Revelation)**

1. **Gu Fangs (Strike – Damage 8\)**

   * Type: Violence effect.

   * Mechanics:

     * Strike 8 (close, physical, maybe Penetrating 2).

     * Uses Violence Attack (10) vs target Body Defense; DC 23 vs Body Resilience.

   * Balance: Straightforward **Balanced Damage** core attack.

2. **Swarming Dissection (Debilitate – Violence track)**

   * Type: Violence Debilitate.

   * Build:

     * Debilitate 8 (Violence): On failure: Wounded → Crippled → Downed → Ruined Body.

     * Extra: Multiattack (limited to targets already Wounded).

   * Notes:

     * Uses Violence Attack 8 vs Body Defense (slightly lower than pure Strike).

     * Classified **Balanced→Strong**; multiattack is carefully gated to targets already weakened.

3. **Gu Husk (Armor/Ward – Resilience boost)**

   * Type: Body Resilience buff.

   * Build:

     * \+2 Body Resilience (up to cap), descriptor: hardened Gu carapace.

   * Because of Blood-Forward, this character can’t push both Defense and Resilience to 10; they sit at Defense 6 / Resilience 8 with this up.

   * Balance: **Balanced** – the Guide prefers Resilience via stats and powers, but we avoid making this strictly better than Stamina-equivalents.

4. **Hive Wall (Barrier)**

   * Type: Barrier / Create-lite.

   * Build:

     * Barrier 8 (medium area, blocks line of effect / line of sight, Medium Toughness).

     * Can be Shaped, but always static, non-moving.

   * Use: Control the battlefield, break line-of-fire, or wall off eldritch entities.

5. **Insight of the Hive (Revelation Debilitate)**

   * Type: Mind/Revelation Debilitate.

   * Build:

     * Debilitate 8 (Revelation):

       * 1st: Disturbed – −2 to Mind checks.

       * 2nd: Fractured – more severe penalties, hallucinations of the Gu.

       * 3rd: Unhinged – taken out of scene by panic/obsession.

       * 4th: Shattered/Broken – mind surrendered to the Hive.

   * Balance: Debuff-focused; no immediate one-shot mind control; “Controlled” is folded into the 4th-degree Shattered state, which is rare and story-significant.

6. **Blood Price (Power Draws Blood hook)**

   * Rule snippet for this character:

     * Whenever you roll using **Violence Offense greater than SCL** (i.e. Attack or Power \> 8), you **mark 1 Blood** on your cost track.

     * At 3 Blood, you auto-gain a **Violence track degree** (Wounded) at the end of the scene (your own power eating you).

     * At 4+ Blood, you are at risk of **Ruined Body** if you keep pushing without healing / purging rituals.

This example shows:

* SCL and the trade-off structure in action.

* How condition ladders, cost tracks, and a trimmed effect list interlock.

* How the character is **optimised** without being allowed into the Broken/Overpowered territory that the Guide warns about.

---

## **7\. Decisions Made vs Open Questions**

### **Decisions Made (working defaults)**

* **Seq / CL / SL / SCL mapping:**

  * Six stats → CL & SL via averages → SCL \= CL \+ SL; Seq ≈ SCL.

* **Caps:**

  * Per-pillar Offense: Attack \+ Power ≤ 2 × SCL (with ±2 via Power Draws Blood profiles).

  * Per-pillar Defense: Defense \+ Resilience ≤ 2 × SCL, with only one pillar allowed to be fully maxed; others trail slightly.

* **Power Draws Blood:**

  * Implemented as build-time **profiles** per pillar (Balanced, Blood-Forward, Ward-Forward) with ±2 band shifts.

  * Hooks into **Blood / Fate / Stain** cost tracks.

* **Conditions:**

  * Three 4-step ladders (Violence, Influence, Revelation), with **shared 4th-degree Shattered/Broken** for Mind & Soul, and **Ruined Body** for Violence.

  * 4th degree always requires major narrative action to reverse.

* **Effect list:**

  * Core set: Strike, Debilitate (afflictions tied to ladders), Drain, Move-Object-based Push/Pull, Flight-as-baseline mobility, Teleport (limited), Armor/Wards, Guard (Deflect-lite), Barrier (Create-lite), narrow Immunities, Senses, Mind Pierce, Illusions.

  * Explicit removal or heavy rewrite of Metamorph, broad Transform-as-Variable, dangerous Luck Control modes, and multi-character abuses.

* **Immortal tiers:**

  * Mortal-focused core (Cursed / Low / Mid-Seq) with hooks for an **Immortal Realm** supplement.

### **Open Questions / Options**

* **Q1:** Do you want CL and SL to be *derived* from stats (as proposed) or *chosen as dials* that constrain stats?

* **Q2:** Are you satisfied with the proposed **condition names** and shared **Shattered/Broken** text, or do you want different naming vibes (more Xianxia, more modern horror, etc.)?

* **Q3:** Are you comfortable with **one positive meta-currency \+ three cost tracks**, or would you prefer multiple named currencies tied to different power sources?

* **Q4:** Should the ±2 **Power Draws Blood profiles** be **purely build-time** choices, or also have a **scene-based “overclock”** version (temporarily shifting an extra ±2 by paying immediate cost on a track)?

* **Q5:** For the core book, do you want **any** fully-playable High-Sequence/Immortal examples, or should they be strictly GM-only / teaser content?

If you confirm or adjust these, the next natural step is to drill deeper into **specific effect write-ups** (with page-ready text) and start outlining **playbooks/archetypes** that package these choices into easy character templates.

I’ll keep this tight and structured so you can pick options and then immediately know how to proceed.

---

## **Q1 – Relationship between Stats, CL/SL, and SCL**

**Question:** Do you want CL and SL to be derived from stats, or chosen as dials that then constrain stats?

### **Option 1A – Fully Derived (Simulationist Cultivation)**

* **How it works:**

  * CL \= ⌊(Body \+ Mind \+ Soul) / 3⌋

  * SL \= ⌊(Control \+ Fate \+ Spirit) / 3⌋

  * SCL \= CL \+ SL (≈ Seq)

* **Pros:**

  * Very “cultivation” in feel: your Level is purely what you’ve actually cultivated.

  * No double-paying; stats and levels stay aligned automatically.

  * Optimizers get a clear, mathy progression path.

* **Cons:**

  * Less direct “I choose my build profile” feel—Level is a result, not a dial.

### **Option 1B – Hybrid: Derived, but Snapped to Bands**

* **How it works:**

  * Compute CL/SL as in 1A, but then “snap” them to bands (Cursed / Low / Mid / High).

  * You can’t raise stats so unevenly that your band jumps without GM approval.

* **Pros:**

  * Keeps cultivation feel but gives GM control over band timing.

  * Easier to present in-level-up milestones.

* **Cons:**

  * Slightly more book-keeping: you track both raw stats and the “snapped” band.

### **Option 1C – Dial-Based (Build Profile First)**

* **How it works:**

  * GM sets SCL for the campaign.

  * Player chooses CL \+ SL \= SCL as build sliders (e.g. CL 3 / SL 5).

  * Stats have caps based on CL/SL (e.g. Body/Mind/Soul ≤ CL+2; Control/Fate/Spirit ≤ SL+2).

* **Pros:**

  * Very player-facing: “I am more body-world vs soul-world” is a conscious choice.

  * Easy to eyeball builds: profile first, details second.

* **Cons:**

  * Less “organic cultivation”; Level is more meta than in-world.

---

## **Q2 – Condition Names & Shattered/Broken Vibes**

**Question:** Keep current names or push them into a specific aesthetic?

### **Option 2A – Current Names, Mildly Darkened**

* **Violence:** Wounded → Crippled → Downed → Ruined Body

* **Influence:** Shaken → Compromised → Subjugated → Shattered/Broken

* **Revelation:** Disturbed → Fractured → Unhinged → Shattered/Broken

* **Pros:**

  * Clear and easy to parse at the table.

  * Feels like modern dark supers / horror—fits broad audiences.

* **Cons:**

  * Less explicitly Xianxia; more “generic dark superhero” vibe.

### **Option 2B – Xianxia / Cultivation-Flavoured**

* **Violence:** Bruised Meridian → Torn Meridian → Shattered Vessel → Ruined Body

* **Influence:** Shaken Reputation → Tainted Name → Fallen House → Shattered Fate

* **Revelation:** Flickering Dao → Fractured Dao → Lost Dao → Shattered Dao

* **Shared 4th Degree text** still covers mental/spiritual “taken out”, but uses realm/cultivation language.

* **Pros:**

  * Strong thematic identity; screams “cultivation \+ horror”.

  * Conditions themselves help worldbuild (meridians, Dao, Fate).

* **Cons:**

  * Slightly less accessible for players unfamiliar with cultivation tropes.

### **Option 2C – Modern Horror / Sanity-Focused**

* **Violence:** Injured → Maimed → Mortally Wounded → Ruined Body

* **Influence:** Rattled → Discredited → Isolated → Shattered/Broken

* **Revelation:** Shaken → Haunted → Deranged → Shattered/Broken

* **Pros:**

  * Very intuitive for players with Call of Cthulhu / horror media background.

  * Plays nicely in modern/urban settings.

* **Cons:**

  * Less “mythic”; Xianxia flavour becomes mostly a skin, not built-in.

---

## **Q3 – Meta-Currency & Cost Tracks**

**Question:** One main positive meta-currency and three cost tracks, or more complex?

### **Option 3A – One Positive Pool \+ Three Cost Tracks (Default)**

* **Positive:** **Momentum** (rename later to fit flavour).

* **Cost Tracks:**

  * **Blood** – bodily strain and injury.

  * **Fate** – destiny entanglements, oaths, prophecy hooks.

  * **Stain** – corruption, loss of self, spiritual taint.

* **Pros:**

  * Clean: one “good” pool, three “bad” counters.

  * Easy to map: Violence → Blood, Influence → Fate, Revelation → Stain (by default).

* **Cons:**

  * Power sources (Beastial, Cursed, Divine, etc.) will share the same basic tracks unless further customized.

### **Option 3B – Positive Pool Split by Pillar**

* **Pools:**

  * **Fury** (Violence), **Clout** (Influence), **Insight** (Revelation).

* **Costs:** Still Blood / Fate / Stain, but different pillars fill/spend them differently.

* **Pros:**

  * Allows each pillar to have its own “push” flavour.

  * Lets playbooks lean hard into one pillar’s meta-economy.

* **Cons:**

  * More overhead; 3 currencies \+ 3 tracks is a lot to track.

### **Option 3C – Power-Source-Linked Cost Tracks**

* **Positive:** 1 global pool (Momentum).

* **Costs:** Named/coloured by origin/type, e.g.:

  * Cursed → **Blight** track; Demonic → **Sin**; Heavenly → **Karma**; Beastial → **Hunger**, etc.

* **Pros:**

  * Big flavour win; every origin “pays” differently.

  * Same structure (3 tracks per character) but names/tags differ.

* **Cons:**

  * More writing and cross-referencing in the book.

  * Harder to generalize advice; each source plays slightly differently.

---

## **Q4 – Power Draws Blood: Build-Time Only vs Overclock**

**Question:** Are ±2 profiles only picked in build, or can you push them in play?

### **Option 4A – Build-Time Only**

* **How it works:**

  * Per pillar you pick Balanced, Blood-Forward, or Ward-Forward.

  * Those define your permanent offense/defense band for that pillar.

* **Pros:**

  * Very easy to track.

  * Strongly defines character archetypes; good for playbooks.

* **Cons:**

  * “Moment of desperation” scenes are handled more narratively than mechanically.

### **Option 4B – Build-Time Profile \+ Once-Per-Scene Overclock**

* **How it works:**

  * You still pick a profile per pillar.

  * Additionally, **once per scene**, you may “Overclock”:

    * Temporarily gain an extra **\+2 to either Offense or Defense band**,

    * Immediately mark 1–2 on a relevant cost track (Blood/Fate/Stain),

    * And potentially auto-suffer a 1st-degree condition.

* **Pros:**

  * Strongly supports “Power at a cost” climaxes.

  * Concrete button to push when players say, “I go all in.”

* **Cons:**

  * Extra rule per pillar to remember.

  * Risk of overuse if costs are not tuned harshly enough.

### **Option 4C – No Fixed Profiles, Only Overclocks**

* **How it works:**

  * Drop static ±2 profiles. Everybody starts Balanced.

  * You instead can **temporarily shift ±2** up to a maximum band by paying cost, whenever you choose.

* **Pros:**

  * Super dynamic; constantly making decisions about risk vs reward.

  * No “permanent build lock-in” if you misjudge a concept.

* **Cons:**

  * More mental load; constant temptation to overclock.

  * Harder to express clear archetypes (“I am a permanent glass cannon”).

---

## **Q5 – High-Sequence / Immortal Tier Presence in Core**

**Question:** How much playable Immortal content is in the core?

### **Option 5A – Mortal-Focused Core \+ GM-Only Immortal Teasers**

* **Core:** Cursed / Low / Mid-Sequence fully playable.

* **High/Transcendent:**

  * Guidelines for GMs to build bosses and entities.

  * A page or two of sample stat blocks and what changes at those scales.

* **Pros:**

  * Keeps core book focused and manageable.

  * Leaves room for a later Immortal Realm expansion as its own product.

* **Cons:**

  * Players hungry for god-tier play must wait or homebrew.

### **Option 5B – Mortal Core \+ One Playable High-Seq Archetype**

* **Core:** Same as 5A, but also:

  * One high-Seq “example playbook” (e.g. an Angel or Demigod archetype) as a fully playable, but strongly caveated, option.

* **Pros:**

  * Showcase what “endgame” looks like; test the immortal rules early.

  * Good marketing hook and design stress-test.

* **Cons:**

  * Can distract groups into starting too high.

  * Requires extra design and page space in core.

### **Option 5C – Full Band Coverage in Core, But Clearly Partitioned**

* **Core:**

  * Entire SCL/Seq band from Cursed 11 to High-Seq 1+ is written.

  * The book explicitly flags “this half is advanced play” in a separate section.

* **Pros:**

  * Complete toolbox in one volume.

  * Great for power fantasy fans from day one.

* **Cons:**

  * Core book becomes denser, more intimidating.

  * More moving parts to balance from the start.

---

## **After You Pick: 3 Strong Next Prompts**

Once you’ve chosen your preferred options for Q1–Q5, here are three high-value directions to move the design forward. Pick one of these as your next ask, or move through them in order.

### **Next Prompt 1 – Lock the Effect Chassis & Write Power Entries**

“Using the options I chose for Q1–Q5, finalize the trimmed effect list into a page-ready section:  
 – Give each core effect (Strike, Debilitate, Drain, etc.) a short rules block, a balance tag (Balanced / Niche / Strong), and 1–2 example descriptors.  
 – Show how Power Draws Blood and cost tracks are referenced in specific effect write-ups (e.g., when Debilitate can escalate to Shattered/Broken, when an Overclock is allowed, etc.).”

Use this when you’re ready to turn the conceptual list into concrete, copy-pastable rule text.

---

### **Next Prompt 2 – Design 3–5 Prototype Playbooks**

“Design 3–5 example playbooks for the system (e.g. Cursed Sequence Enforcer, Dream-Scarred Investigator, Media Oracle, Gu Cultivator, Heavenly Spear). For each:  
 – Show starting SCL/Seq band and a recommended CL/SL profile based on Q1.  
 – Provide a stat skeleton (Primary stats, Aether stats, suggested caps) using the final caps rules.  
 – Give 2–3 unique moves / techniques that hook into cost tracks and condition ladders.  
 – Outline a sample power set built from the finalized effect list.”

Use this to see how the system feels when players actually make characters.

---

### **Next Prompt 3 – Build the Conflict & Clock Procedures**

“Using the chosen options for Q1–Q5, fully specify the procedures for:  
 – Running a Violence conflict step-by-step (initiative, actions, degrees, condition application, Overclocks).  
 – Running an Influence conflict (social/political/media) with the same teeth as combat, including example conditions and how they affect fronts.  
 – Running a Revelation conflict (horror/sanity) and how it interacts with cost tracks like Stain and the shared Shattered/Broken condition.  
 – Building and advancing seasonal ‘weather’ clocks (media cycles, political crises, cult ascensions), including how PC actions and GM Threat feed into them.”

Use this when you want the actual *play loop* and GM procedures nailed down.

---

If you tell me your picks for Q1–Q5, I can immediately act as though those are canonical and take you through whichever of the three next prompts you want first.

1\) Modified \*Option 1A\* \+ Extra – Fully Derived \*PLUS added aspect dial\* (Simulationist Cultivation) with SCL bonus dial Points awarded per SCL for Point-Buy pre-set dial aspects players can choose from.

\- How it works:  
• CL \= ⌊(Body \+ Mind \+ Soul) / 3⌋  
• SL \= ⌊(Control \+ Fate \+ Spirit) / 3⌋  
• SCL \= CL \+ SL (≈ Seq)

\- Pros:  
• Very “cultivation” in feel: your Level is purely what you’ve actually cultivated.  
• No double-paying; stats and levels stay aligned automatically.  
• Optimizers get a clear, mathy progression path.

2\) Option 2C – Modern Horror / Sanity-Focused  
• Violence: Injured → Maimed → Mortally Wounded → Ruined Body  
• Influence: Rattled → Discredited → Isolated → Shattered/Broken  
• Revelation: Shaken → Haunted → Deranged → Shattered/Broken

3\) Option 3B – Positive Pool Split by Pillar  
\- Pools:  
• Fury (Violence)  
• Clout (Influence)  
• Insight (Revelation).  
\> Costs: Still Blood / Fate / Stain, but different pillars fill/spend them differently.

\- Pros:  
• Allows each pillar to have its own “push” flavour.  
• Lets playbooks lean hard into one pillar’s meta-economy.

4\) Option 4A – Build-Time Only  
• Character Creation sets Profile per pillar preferences/leans you pick Balanced, Blood-Forward, or Ward-Forward.  
• Those define your permanent offense/defense band for that pillar.

5\) Option 5B – Mortal Core \+ One Playable High-Seq Archetype  
\- Core: Same as 5A, but also:  
• One high-Seq “example playbook” (e.g. an Angel or Demigod archetype) as a fully playable, but strongly caveated, option.  
\- Pros:  
• Showcase what “endgame” looks like; test the immortal rules early.  
• Good marketing hook and design stress-test.

Using the options I chose for Q1–Q5, finalize the trimmed effect list into a page-ready section:  
– Give each core effect (Strike, Debilitate, Drain, etc.) a short rules block, a balance tag (Balanced / Niche / Strong), and 1–2 example descriptors.  
– Show how Power Draws Blood and cost tracks are referenced in specific effect write-ups (e.g., when Debilitate can escalate to Shattered/Broken, when an Overclock is allowed, etc.).

Below is a “rulebook-ready” effects section built around your chosen options for Q1–Q5 and the Power Draws Blood / cost-track motif.

You can drop this straight into a draft and expand examples as needed.

---

# **Core Effects Framework**

### **SCL, CL, SL and Bands (Reference)**

* **Core Level (CL)** \= ⌊(Body \+ Mind \+ Soul) / 3⌋

* **Soul Level (SL)** \= ⌊(Control \+ Fate \+ Spirit) / 3⌋

* **Soul Core Level (SCL)** \= CL \+ SL

* **Sequence Rank (Seq)** ≈ SCL (used for Realm/Tier naming)

SCL is the **hidden “power level” cap** the GM tracks; players mostly see it indirectly through bands and Sequence naming.

### **Conflict Pillars & Conditions**

* **Violence (Body pillar)**

  * Conditions: **Injured → Maimed → Mortally Wounded → Ruined Body**

* **Influence (Soul pillar)**

  * Conditions: **Rattled → Discredited → Isolated → Shattered/Broken**

* **Revelation (Mind pillar)**

  * Conditions: **Shaken → Haunted → Deranged → Shattered/Broken**

At **4th degree** in Influence or Revelation you are **Shattered/Broken**:

You are mentally and/or spiritually taken out in this context: publicly ruined, emotionally disconnected, mentally frayed, politically sidelined, or fully controlled as a mouthpiece; or spiritually taken out (catatonia, fugue state, total compromise to an entity/pathway, etc.). Reversal normally requires major narrative actions (exorcisms, interventions, existential bargains, sustained social campaigns), not a single recovery roll.

At 4th degree in Violence you are **Ruined Body** (dead, crippled, or maimed beyond ordinary medical repair without serious intervention).

### **Offense & Defense Bands**

Per pillar (Violence, Influence, Revelation):

* **Offense Band:**

  * Attack \+ Power Rank ≤ **2 × SCL** (before Power Draws Blood adjustment)

  * Each individually ≤ **SCL \+ 2**

* **Defense Band:**

  * Defense \+ Resilience ≤ **2 × SCL**

  * Each individually ≤ **SCL \+ 2**

* A character may have **only one pillar** at its full 2 × SCL Defense Band; at least one other pillar must be ≤ **1.5 × SCL** total, to avoid omni-defensive builds.

**Resilience** is the “soak” or durability component of a pillar (e.g. Body Resilience from Endurance \+ Armor, Soul Resilience from Resolve \+ Wards, etc.).

### **Power Draws Blood Profiles (Build-Time Only)**

For **each pillar**, at character creation you choose **one profile**:

1. **Balanced**

   * Offense Band: Attack \+ Power ≤ 2 × SCL

   * Defense Band: Defense \+ Resilience ≤ 2 × SCL

2. **Blood-Forward (Glass Cannon)**

   * Offense Band: Attack \+ Power ≤ 2 × SCL **\+ 2**

   * Defense Band: Defense \+ Resilience ≤ 2 × SCL **− 2**

3. **Ward-Forward (Bulwark)**

   * Defense Band: Defense \+ Resilience ≤ 2 × SCL **\+ 2**

   * Offense Band: Attack \+ Power ≤ 2 × SCL **− 2**

Within a band, you can further specialize:

* **Accuracy-leaning:** \+2 Attack, −2 Power (still within Offense Band).

* **Power-leaning:** \+2 Power, −2 Attack.

* **Evasion-leaning:** \+2 Defense, −2 Resilience.

* **Toughness-leaning:** \+2 Resilience, −2 Defense.

This is how the “+/- 2 to Offensive and Defensive Measures” manifests mechanically.

### **Meta-Currencies & Cost Tracks**

* **Positive Pools (per pillar):**

  * **Fury** – Violence pillar.

  * **Clout** – Influence pillar.

  * **Insight** – Revelation pillar.

* **Cost Tracks (per character):**

  * **Blood** – bodily strain, physical self-harm.

  * **Fate** – entanglement with oaths, obligations, cosmic or political debt.

  * **Stain** – corruption, loss of self, spiritual/moral erosion.

Effects may let you:

* **Spend Fury / Clout / Insight** for bonuses (rerolls, \+2 to a roll, minor narrative shifts).

* **Mark Blood / Fate / Stain** when using especially harsh, reality-warping, or reputation-shredding versions of effects, or when hitting 3rd–4th degree conditions.

---

# **Trimmed Core Effects List**

For each effect below:

* **Balance Tag** uses your taxonomy: Balanced / Niche / Strong (Broken/Overpowered are excluded here by design).

* Costs are given in **PP per rank**; modifiers (Extras/Flaws) can be added later.

---

## **1\. Offensive & Debuff Effects**

### **1.1 Strike (Core Damage)**

**Balance Tag:** Balanced  
 **Pillar:** Typically **Violence** (can be adapted to other pillars as stress effects).

**Rules Block**

* **Type:** Attack; Standard Action; Single Target.

* **Base Cost:** 1 PP per rank.

* **Roll:** Violence Attack vs target’s **Body Defense**.

* **Effect:** Target resists with **Body Resilience** vs DC **10 \+ Strike rank**.

  * Failure by 1–4: **Injured**

  * Failure by 5–9: **Maimed**

  * Failure by 10–14: **Mortally Wounded**

  * Failure by 15+: **Ruined Body** (GM may gate this behind special circumstances)

**Descriptors (examples)**

* “Gu Fangs” – a swarm of microscopic Gu-teeth shredding flesh.

* “Cursed Blade” – soul-eating sword-strokes.

**Power Draws Blood & Costs**

* Strike is the **baseline Violence effect** for **Blood-Forward builds**.

* Being Blood-Forward in Violence lets you have **Attack \+ Strike rank up to 2 × SCL \+ 2**, but your Violence Defense Band is 2 × SCL − 2\.

* No automatic cost-track mark for a normal Strike; however, the GM may rule that attacks which **intentionally aim for Ruined Body** in non-lethal contexts mark **Stain** or **Fate**.

---

### **1.2 Debilitate (Affliction by Pillar)**

**Balance Tag:** Balanced → Strong (depending on rank, extras, and ladder depth)  
 **Pillar:** Violence, Influence, or Revelation depending on track targeted.

**Rules Block**

* **Type:** Attack; Standard Action; Single Target (Area is possible but should be capped tightly and often mark costs).

* **Base Cost:** 1 PP per rank.

* **Roll:** Relevant pillar Attack vs target’s corresponding **Defense**.

* **Effect:** Target resists with the corresponding **Resilience** vs DC **10 \+ Debilitate rank**.

  * **Violence Debilitate**:

    * Failure 1–4: **Injured**

    * 5–9: **Maimed**

    * 10–14: **Mortally Wounded**

    * 15+: **Ruined Body**

  * **Influence Debilitate:**

    * Failure 1–4: **Rattled**

    * 5–9: **Discredited**

    * 10–14: **Isolated**

    * 15+: **Shattered/Broken**

  * **Revelation Debilitate:**

    * Failure 1–4: **Shaken**

    * 5–9: **Haunted**

    * 10–14: **Deranged**

    * 15+: **Shattered/Broken**

**Descriptors (examples)**

* Violence: “Bone-locking Curse”, “Meridian Needle Technique”.

* Influence: “Smear Campaign”, “Divine Censure”, “Gu Whisper” (rumours and fear).

* Revelation: “Show the Gu-Quark Truth”, “Open the Celestial Ledger”.

**Power Draws Blood & Costs**

* **Strong use:** If a Debilitate effect is built to **routinely reach 3rd or 4th degree** at-tier (e.g., high rank \+ Accurate \+ Area), it should:

  * Either be flagged **Strong** and gated by a **cost** (e.g. mark **Fate** or **Stain** on every use that pushes to 3rd degree),

  * Or be restricted to **limited uses per scene**.

* As a general rule:

  * **Influence Debilitate** that causes **Isolated** or **Shattered/Broken** tends to mark **Fate** (burned bridges, oaths broken, reputations shattered).

  * **Revelation Debilitate** that drives someone **Deranged / Shattered** often marks **Stain** (you stare into the abyss with them).

---

### **1.3 Drain (Weaken / Strip)**

**Balance Tag:** Niche → Balanced (when tightly scoped)  
 **Pillar:** Any (applied to numerical stats, defenses, or bands).

**Rules Block**

* **Type:** Attack; Standard Action; Single Target.

* **Base Cost:** 1 PP per rank.

* **Roll:** Appropriate pillar Attack vs target Defense.

* **Effect:** On a failed Resilience check vs DC **10 \+ Drain rank**, reduce a **narrow trait** by 1 rank per degree (up to a defined maximum).

  * Traits might include: one Defense, one Resilience, one type of Attack, or one specific stat (e.g., Endurance).

**Descriptors (examples)**

* “Qi Suppression Seal”.

* “Scandal Excavation” (draining Clout).

* “Mind Leech Gu”.

**Power Draws Blood & Costs**

* Drain that hits **meta-economy** (e.g., directly draining **Fury/Clout/Insight**) should be considered **Strong** and:

  * Cost extra PP per rank,

  * And/or mark **Fate/Stain** when used aggressively (you unmake someone’s luck or destiny).

---

### **1.4 Push / Pull (Kinetic Control)**

**Balance Tag:** Balanced  
 **Pillar:** Violence (primary); can be skinned as Influence (social repositioning) or Revelation (mind dislocation) in some builds.

**Rules Block**

* **Type:** Attack; Standard Action; Single Target or small group.

* **Base Cost:** 1 PP per rank.

* **Roll:** Violence Attack vs Body Defense (or other pillar vs its Defense, with GM approval).

* **Effect:** On failed Resilience check:

  * Target is moved a distance based on degrees of failure (short → medium → long → slammed into hazard), possibly with **Injured/Maimed** if they hit something dangerous.

**Descriptors (examples)**

* “Gu Swarm Lift” – microscopic Gu carry or slam targets.

* “Telekinetic Throw”.

* Influence-flavoured: “Dragged out of the Room” via political leverage.

**Power Draws Blood & Costs**

* If Push/Pull is used to cause **high-speed impacts or environmental Ruined Body results**, repeated use may mark **Blood** (physical self-stress) or **Stain** (using inherently cruel tactics).

---

## **2\. Movement & Positioning Effects**

### **2.1 Flight (Movement Suite Baseline)**

**Balance Tag:** Strong (intentionally the “gold standard” movement effect)

**Rules Block**

* **Type:** Movement; Sustained or Continuous; personal.

* **Base Cost:** 2 PP per rank (or 1 PP with tighter caps, depending on how strong you want it).

* **Effect:** Grants high-speed, 3D movement. Higher ranks allow longer distances per move and environmental advantages.

**Descriptors**

* “Gu Wings”, “Cursed Sword Levitation”, “Celestial Wind Steps”.

**Power Draws Blood & Costs**

* Flight itself does **not** mark cost tracks.

* However, **Blood-Forward Violence builds** that rely heavily on Flight for defence (evasion) should be encouraged to take **lower Body Resilience**—their evasion is great, but if hit, they suffer.

---

### **2.2 Dash (Ground Speed / Blink Step)**

**Balance Tag:** Balanced

**Rules Block**

* **Type:** Movement; personal.

* **Base Cost:** 1 PP per rank.

* **Effect:** Enhanced Speed or short **Step**/teleports-in-line-of-sight, letting you rapidly reposition without full Teleport freedom.

**Descriptors**

* “Shadow Step”, “Lightning Meridian Stride”.

**Power Draws Blood & Costs**

* Rarely marks cost on its own; it is a **mobility tax** that Balanced builds pay instead of Flight.

---

### **2.3 Teleport (Short-Range)**

**Balance Tag:** Strong (heavily restricted)

**Rules Block**

* **Type:** Movement; personal; Standard or Move Action.

* **Base Cost:** 2 PP per rank.

* **Effect:** You vanish from one point and reappear in another within a maximum distance defined by rank (short-range within the scene by default).

**Restrictions & Costs**

* Long-range or **blind** Teleport:

  * Requires **GM permission and/or Extra**,

  * And **always marks Stain or Fate** when used at maximum range (you are tearing through reality or dealing with pathwalkers).

**Descriptors**

* “Gu Tunneling”, “Domain Shift”, “Heavenly Flash”.

---

## **3\. Defense, Mitigation, and Control Effects**

### **3.1 Armor / Wards (Resilience Boosts)**

**Balance Tag:** Balanced

**Rules Block**

* **Type:** Passive or Sustained; personal.

* **Base Cost:** 1 PP per rank.

* **Effect:** Adds to a pillar’s **Resilience** (Body, Mind, or Soul), up to the relevant band cap (Defense \+ Resilience ≤ band).

**Descriptors**

* Body: “Reinforced Gu Carapace”, “Blessed Plate”.

* Mind: “Mental Ward Seals”.

* Soul: “Ancestor Veil”, “Cursed Halo”.

**Power Draws Blood & Costs**

* For **Ward-Forward builds**, Armor/Wards are where you spend your extra \+2 Defense Band.

* Excessive, layered Wards that shrug off Revelation or Influence for free should be flagged **Strong** and may:

  * Require rare materials/rituals (fictional cost),

  * Or slowly mark **Stain** (your soul hides behind too many walls).

---

### **3.2 Guard (Deflect-lite)**

**Balance Tag:** Niche → Balanced (with tight limits)

**Rules Block**

* **Type:** Reaction or Standard Action; short range; affects one ally or small group.

* **Base Cost:** 1 PP per rank.

* **Effect:**

  * Allows you to roll a **Guard check** (d20 \+ Guard rank) to replace an ally’s Defense vs one incoming attack, OR

  * Provides a **flat \+2/+5** bonus to Defenses in a small zone for one round (depending on how you want to scale it).

**Constraints**

* Cannot be built with “stack all the Extras” patterns:

  * No Reaction \+ Area \+ Selective \+ unlimited uses.

  * Typically limited to **1–2 uses per round**.

**Descriptors**

* “Gu Shield Swarm”, “Interposed Cursed Blade”, “Celestial Counterspell”.

**Power Draws Blood & Costs**

* If Guard is used as a **hard counter** to big Violence or Revelation effects, the GM can rule that:

  * On a critical success, you may mark **Blood** to also reflect some harm back.

  * On a critical failure, you mark **Blood or Stain** as the backlash hits you instead.

---

### **3.3 Barrier (Create-lite, Static)**

**Balance Tag:** Balanced

**Rules Block**

* **Type:** Standard Action; creates one or more static terrain features.

* **Base Cost:** 1 PP per rank.

* **Effect:**

  * Creates a **Barrier** with a certain Toughness/Resilience (usually equal to rank) that blocks movement, line of sight, or line of effect.

  * Climbing, breaking, or bypassing it requires checks vs its Resilience.

**Descriptors**

* “Gu Hive Wall”, “Stone Talisman Dome”, “Media Firewall” (data barriers in a more modern setting).

**Power Draws Blood & Costs**

* Generally does not mark cost tracks by itself.

* If Barrier is used to trap someone in a **lethal or sanity-destroying situation**, repeated such uses may mark **Fate** or **Stain**.

---

### **3.4 Narrow Immunity**

**Balance Tag:** Niche → Balanced (if kept very narrow)

**Rules Block**

* **Type:** Passive.

* **Base Cost:** Typically 1–2 PP per **very narrow** Immunity; broader ones cost more and should be rare.

* **Effect:** You ignore a specific, controlled category of harm, such as:

  * Your own Gu,

  * The backlash from your personal Cursed Technique,

  * A single environmental hazard.

**Descriptors**

* “Immune to my own Domain collapse.”

* “Immune to the Gu breed that lives in my body.”

**Power Draws Blood & Costs**

* Very broad immunities (e.g. “immune to all mental effects”) should be banned or rewritten.

* Some narrow immunities can be paired with **Stain**: you are immune because you are becoming that threat.

---

## **4\. Information, Influence & Illusion Effects**

### **4.1 Enhanced Senses**

**Balance Tag:** Balanced

**Rules Block**

* **Type:** Passive or Sustained.

* **Base Cost:** 1 PP per level of enhanced sense package.

* **Effect:** Expanded perception: see in darkness, sense Gu auras, read intent, perceive lies, etc.

**Descriptors**

* “Gu-Sense”, “Celestial Insight Sight”, “Media Feed Overlay”.

**Power Draws Blood & Costs**

* If tied into Revelation (seeing truths humans shouldn’t):

  * May **mark Stain** when repeatedly used to pierce cosmic veils.

---

### **4.2 Mind Pierce (Mind Reading-lite)**

**Balance Tag:** Strong (strictly controlled)

**Rules Block**

* **Type:** Revelation attack vs Soul or Mind; Standard Action; single target.

* **Base Cost:** 2 PP per rank (premium pricing).

* **Roll:** Revelation Attack vs Mind or Soul Defense.

* **Effect:** On failed Resilience check, you read surface thoughts; additional degrees reveal deeper memories or hidden fears, subject to GM veto.

**Constraints**

* Must be **Limited**: no Area, no infinite-range, no “you never know I tried”.

* Ideally requires **eye contact, ritual, or consent**, or costs extra PP.

**Descriptors**

* “Open the Gu Ledger”, “Celestial Audit”, “Dream-Reading”.

**Power Draws Blood & Costs**

* Every use that digs beyond surface thoughts (2nd+ degree success) should **mark Stain** (you’re not meant to rummage in souls for free).

* Some playbooks may instead mark **Fate** (you become entangled with what you learn).

---

### **4.3 Glamour / Veil (Illusion)**

**Balance Tag:** Niche → Balanced

**Rules Block**

* **Type:** Influence/Revelation hybrid; Standard Action; Area or single target.

* **Base Cost:** 1 PP per rank.

* **Effect:** Create illusory sensory data that:

  * Inflicts penalties to Perception or Insight,

  * Or forces targets to resist with Mind or Soul Resilience to avoid **Shaken/Haunted** conditions when the illusions are horror-flavoured.

**Descriptors**

* “Gu Mirage”, “Media Spin Filter”, “Hall of Mirrors Domain”.

**Power Draws Blood & Costs**

* Simple glamours (cosmetic disguises) are usually cost-free.

* Horror illusions that push toward **Haunted / Deranged** should, on repeated use, **mark Stain**.

---

### **4.4 Blessing / Hex (Long-Term Buff/Debuff)**

**Balance Tag:** Niche

**Rules Block**

* **Type:** Utility; extended action; target single person or small group.

* **Base Cost:** 1 PP per rank (buff or debuff magnitude).

* **Effect:**

  * Buff: temporarily boosts a stat or trait by 1–2 ranks (still respecting caps) for a session or arc.

  * Hex: applies a mild, ongoing penalty or vulnerability to a specific type of effect.

**Descriptors**

* “Gu Contract”, “Heavenly Blessing Seal”, “Cursed Hashtag Campaign” (media).

**Power Draws Blood & Costs**

* Blessings often mark **Fate** (obligations to the entity granting them).

* Hexes, especially those that ride on Revelation or Influence, mark **Stain** or **Fate** depending on flavour.

---

## **5\. Excluded or Heavily Rewritten Mechanics**

These are **not** part of the core effect list. If they appear, they should be treated as advanced, GM-only, or entirely rewritten variants.

1. **Metamorph / Multi-form “I am many character sheets”**

   * Flagged as **Broken** in the underlying analysis.

   * Replaced by:

     * **Arrays of effects** within a single statline, or

     * Summoning one named companion (with strict PP limits).

2. **Broad Transform-as-Variable**

   * No “Transform anything into anything” economy engines.

   * Transform, if used, is:

     * Either a **Debilitate** variant (e.g. turn people into statues with a clear condition ladder), or

     * A tightly-defined alternate form whose stats are explicitly costed.

3. **Luck Control that overrides GM fiat or creates infinite loops**

   * No effects that:

     * Force any roll to be rerolled indefinitely,

     * Or negate consequences after the fact without cost.

   * Limited, self-targeted rerolls are represented via **Fury/Clout/Insight spends**, not separate powers.

4. **Omni-minion swarms / wide Summon**

   * Minion mechanics are restricted to:

     * Narrative assets, or

     * One or two statted companions at **PC-appropriate PP costs**.

   * Massive armies are handled via **clocks and fronts**, not as on-sheet powers.

---

This gives you a **tight, effect-based chassis** where:

* SCL, CL, SL and your nine stats define caps and bands.

* Power Draws Blood manifests in build-time Offense/Defense and Accuracy/Power / Defense/Resilience profiles.

* Fury/Clout/Insight give each pillar a distinct way to “push”.

* Blood/Fate/Stain ensure that the biggest moves and harshest outcomes carry meaningful long-term consequences.

If you want, next we can:

* Turn each of these effect write-ups into **full rule text with Extras/Flaws** tables, or

* Build a few **example playbooks** that show how different Power Draws Blood profiles \+ effect choices create distinct archetypes in play.

Continue onto the next two tasks, the creation of two sheets with the appropriate tabs for:

1\) • Turn each of these effect write-ups into full rule text with Extras/Flaws tables, 

&

• Building 40 example playbooks that show how different Power Draws Blood profiles \+ effect choices create distinct archetypes in play. tabling in its own tabs per soul mind body lean with hybrids of each and balanced contained within.

2\) Create a Document and Sheet that tables and outlines the below: 

• Balance bosses as between effectively 5 levels between 150-350% Player Characters (PC) strength (balanced around 3 player characters fighting a boss encounter, or 1 player character overleveled with 2 NPCs can manage as well but hard to achieve); with the highest 3 all being at the cap 350% PC strength but the highest two ranks of bosses have an additional boss stage (boss resurrects or transforms or continues the fight however is appropriate) between 1-2 extra stages for rank 4 & 5 Bosses that are rivals for the players in a nemesis styled system, outlined and templates provided within, including NPC minions and Elites a in between Boss level and roughly 5 levels between 100-150% Player Character strength)  
• Tabling scaling and example builds per SCL level. With explanations for how to build bosses.

Printing the appropriate Word Documents and Excel Documents of the relevant documents below

**Soul Core Boss Design Summary**

**Summary of the Boss Design Spreadsheets**

The Boss Design spreadsheet is structured to help you create, scale, and build encounters for non-player characters (NPCs) and boss-level threats. Its key components include:

* **Boss Tiers:** This tab defines **5 Boss Ranks** with clear strength guidelines, typically scaled against a party of three Player Characters (PCs).  
  * Ranks range from **Rank 1 Boss** (100–150% of party strength) to **Rank 5 Nemesis** (up to 350%+).  
  * Ranks 4 and 5 are designed as multi-stage encounters, requiring 1–2 extra boss stages (resurrection, transformation, or phase change).  
* **Minions/Elites:** This section outlines the supporting NPC roles for encounters:  
  * **Minions** are simple threats, roughly 50–75% of a PC’s effective strength.  
  * **Elites** serve as tougher lieutenants, bridging the gap between PCs and bosses at 100–150% of a PC’s strength.  
* **SCL Scaling:** This table provides numerical baselines across Sequence Class Levels (SCL) 4–12, detailing reference Offense/Defense bands and strength multipliers for different Boss Ranks to ensure numerical balance is maintained across all levels of play.

**Soul Core Effects and Playbooks Summary**

**Summary of the Effects and Playbooks Spreadsheets**

This summary covers the system's core mechanics and the character templates built from them.

* **Effects (Active Sheet):** This sheet lists all core in-game effects (e.g., Strike, Flight, Drain). Each entry includes a **Rule Summary** detailing its mechanics and a **Balance Tag** (e.g., Balanced, Strong, Niche) indicating its relative power and utility.  
* **Extras/Flaws:** A separate tab in the effects workbook is dedicated to defining universal modifiers that can be applied to the core effects. These include bonuses (**Extras**) like *Accurate* and *Powerful*, and limitations (**Flaws**) such as *Limited* and *Tiring*.  
* **Playbooks:** The workbook contains four tabs dedicated to character archetypes:  
  * Playbooks\_Body  
  * Playbooks\_Soul  
  * Playbooks\_Mind  
  * Playbooks\_Hybrid  
  * These tabs collectively outline **40 example archetypes** (10 for each category) that demonstrate how different combinations of **Pillar Leans** (Violence, Influence, Revelation), **SCL Bands**, and **Power Draws Blood Profiles** (e.g., Blood-Forward, Ward-Forward) can create distinct, playable characters. Each entry maps the archetype to its **Signature Effects** and **Primary Cost Track Hooks** (Blood, Fate, Stain).

# Start context

Below is a “rulebook-ready” effects section built around your chosen options for Q1–Q5 and the Power Draws Blood / cost-track motif.

You can drop this straight into a draft and expand examples as needed.

---

# **Core Effects Framework**

### **SCL, CL, SL and Bands (Reference)**

* **Core Level (CL)** \= ⌊(Body \+ Mind \+ Soul) / 3⌋

* **Soul Level (SL)** \= ⌊(Control \+ Fate \+ Spirit) / 3⌋

* **Soul Core Level (SCL)** \= CL \+ SL

* **Sequence Rank (Seq)** ≈ SCL (used for Realm/Tier naming)

SCL is the **hidden “power level” cap** the GM tracks; players mostly see it indirectly through bands and Sequence naming.

### **Conflict Pillars & Conditions**

* **Violence (Body pillar)**

  * Conditions: **Injured → Maimed → Mortally Wounded → Ruined Body**

* **Influence (Soul pillar)**

  * Conditions: **Rattled → Discredited → Isolated → Shattered/Broken**

* **Revelation (Mind pillar)**

  * Conditions: **Shaken → Haunted → Deranged → Shattered/Broken**

At **4th degree** in Influence or Revelation you are **Shattered/Broken**:

You are mentally and/or spiritually taken out in this context: publicly ruined, emotionally disconnected, mentally frayed, politically sidelined, or fully controlled as a mouthpiece; or spiritually taken out (catatonia, fugue state, total compromise to an entity/pathway, etc.). Reversal normally requires major narrative actions (exorcisms, interventions, existential bargains, sustained social campaigns), not a single recovery roll.

At 4th degree in Violence you are **Ruined Body** (dead, crippled, or maimed beyond ordinary medical repair without serious intervention).

### **Offense & Defense Bands**

Per pillar (Violence, Influence, Revelation):

* **Offense Band:**

  * Attack \+ Power Rank ≤ **2 × SCL** (before Power Draws Blood adjustment)

  * Each individually ≤ **SCL \+ 2**

* **Defense Band:**

  * Defense \+ Resilience ≤ **2 × SCL**

  * Each individually ≤ **SCL \+ 2**

* A character may have **only one pillar** at its full 2 × SCL Defense Band; at least one other pillar must be ≤ **1.5 × SCL** total, to avoid omni-defensive builds.

**Resilience** is the “soak” or durability component of a pillar (e.g. Body Resilience from Endurance \+ Armor, Soul Resilience from Resolve \+ Wards, etc.).

### **Power Draws Blood Profiles (Build-Time Only)**

For **each pillar**, at character creation you choose **one profile**:

1. **Balanced**

   * Offense Band: Attack \+ Power ≤ 2 × SCL

   * Defense Band: Defense \+ Resilience ≤ 2 × SCL

2. **Blood-Forward (Glass Cannon)**

   * Offense Band: Attack \+ Power ≤ 2 × SCL **\+ 2**

   * Defense Band: Defense \+ Resilience ≤ 2 × SCL **− 2**

3. **Ward-Forward (Bulwark)**

   * Defense Band: Defense \+ Resilience ≤ 2 × SCL **\+ 2**

   * Offense Band: Attack \+ Power ≤ 2 × SCL **− 2**

Within a band, you can further specialize:

* **Accuracy-leaning:** \+2 Attack, −2 Power (still within Offense Band).

* **Power-leaning:** \+2 Power, −2 Attack.

* **Evasion-leaning:** \+2 Defense, −2 Resilience.

* **Toughness-leaning:** \+2 Resilience, −2 Defense.

This is how the “+/- 2 to Offensive and Defensive Measures” manifests mechanically.

### **Meta-Currencies & Cost Tracks**

* **Positive Pools (per pillar):**

  * **Fury** – Violence pillar.

  * **Clout** – Influence pillar.

  * **Insight** – Revelation pillar.

* **Cost Tracks (per character):**

  * **Blood** – bodily strain, physical self-harm.

  * **Fate** – entanglement with oaths, obligations, cosmic or political debt.

  * **Stain** – corruption, loss of self, spiritual/moral erosion.

Effects may let you:

* **Spend Fury / Clout / Insight** for bonuses (rerolls, \+2 to a roll, minor narrative shifts).

* **Mark Blood / Fate / Stain** when using especially harsh, reality-warping, or reputation-shredding versions of effects, or when hitting 3rd–4th degree conditions.

  ---

  # **Trimmed Core Effects List**

For each effect below:

* **Balance Tag** uses your taxonomy: Balanced / Niche / Strong (Broken/Overpowered are excluded here by design).

* Costs are given in **PP per rank**; modifiers (Extras/Flaws) can be added later.

  ---

  ## **1\. Offensive & Debuff Effects**

  ### **1.1 Strike (Core Damage)**

**Balance Tag:** Balanced  
 **Pillar:** Typically **Violence** (can be adapted to other pillars as stress effects).

**Rules Block**

* **Type:** Attack; Standard Action; Single Target.

* **Base Cost:** 1 PP per rank.

* **Roll:** Violence Attack vs target’s **Body Defense**.

* **Effect:** Target resists with **Body Resilience** vs DC **10 \+ Strike rank**.

  * Failure by 1–4: **Injured**

  * Failure by 5–9: **Maimed**

  * Failure by 10–14: **Mortally Wounded**

  * Failure by 15+: **Ruined Body** (GM may gate this behind special circumstances)

**Descriptors (examples)**

* “Gu Fangs” – a swarm of microscopic Gu-teeth shredding flesh.

* “Cursed Blade” – soul-eating sword-strokes.

**Power Draws Blood & Costs**

* Strike is the **baseline Violence effect** for **Blood-Forward builds**.

* Being Blood-Forward in Violence lets you have **Attack \+ Strike rank up to 2 × SCL \+ 2**, but your Violence Defense Band is 2 × SCL − 2\.

* No automatic cost-track mark for a normal Strike; however, the GM may rule that attacks which **intentionally aim for Ruined Body** in non-lethal contexts mark **Stain** or **Fate**.

  ---

  ### **1.2 Debilitate (Affliction by Pillar)**

**Balance Tag:** Balanced → Strong (depending on rank, extras, and ladder depth)  
 **Pillar:** Violence, Influence, or Revelation depending on track targeted.

**Rules Block**

* **Type:** Attack; Standard Action; Single Target (Area is possible but should be capped tightly and often mark costs).

* **Base Cost:** 1 PP per rank.

* **Roll:** Relevant pillar Attack vs target’s corresponding **Defense**.

* **Effect:** Target resists with the corresponding **Resilience** vs DC **10 \+ Debilitate rank**.

  * **Violence Debilitate**:

    * Failure 1–4: **Injured**

    * 5–9: **Maimed**

    * 10–14: **Mortally Wounded**

    * 15+: **Ruined Body**

  * **Influence Debilitate:**

    * Failure 1–4: **Rattled**

    * 5–9: **Discredited**

    * 10–14: **Isolated**

    * 15+: **Shattered/Broken**

  * **Revelation Debilitate:**

    * Failure 1–4: **Shaken**

    * 5–9: **Haunted**

    * 10–14: **Deranged**

    * 15+: **Shattered/Broken**

**Descriptors (examples)**

* Violence: “Bone-locking Curse”, “Meridian Needle Technique”.

* Influence: “Smear Campaign”, “Divine Censure”, “Gu Whisper” (rumours and fear).

* Revelation: “Show the Gu-Quark Truth”, “Open the Celestial Ledger”.

**Power Draws Blood & Costs**

* **Strong use:** If a Debilitate effect is built to **routinely reach 3rd or 4th degree** at-tier (e.g., high rank \+ Accurate \+ Area), it should:

  * Either be flagged **Strong** and gated by a **cost** (e.g. mark **Fate** or **Stain** on every use that pushes to 3rd degree),

  * Or be restricted to **limited uses per scene**.

* As a general rule:

  * **Influence Debilitate** that causes **Isolated** or **Shattered/Broken** tends to mark **Fate** (burned bridges, oaths broken, reputations shattered).

  * **Revelation Debilitate** that drives someone **Deranged / Shattered** often marks **Stain** (you stare into the abyss with them).

  ---

  ### **1.3 Drain (Weaken / Strip)**

**Balance Tag:** Niche → Balanced (when tightly scoped)  
 **Pillar:** Any (applied to numerical stats, defenses, or bands).

**Rules Block**

* **Type:** Attack; Standard Action; Single Target.

* **Base Cost:** 1 PP per rank.

* **Roll:** Appropriate pillar Attack vs target Defense.

* **Effect:** On a failed Resilience check vs DC **10 \+ Drain rank**, reduce a **narrow trait** by 1 rank per degree (up to a defined maximum).

  * Traits might include: one Defense, one Resilience, one type of Attack, or one specific stat (e.g., Endurance).

**Descriptors (examples)**

* “Qi Suppression Seal”.

* “Scandal Excavation” (draining Clout).

* “Mind Leech Gu”.

**Power Draws Blood & Costs**

* Drain that hits **meta-economy** (e.g., directly draining **Fury/Clout/Insight**) should be considered **Strong** and:

  * Cost extra PP per rank,

  * And/or mark **Fate/Stain** when used aggressively (you unmake someone’s luck or destiny).

  ---

  ### **1.4 Push / Pull (Kinetic Control)**

**Balance Tag:** Balanced  
 **Pillar:** Violence (primary); can be skinned as Influence (social repositioning) or Revelation (mind dislocation) in some builds.

**Rules Block**

* **Type:** Attack; Standard Action; Single Target or small group.

* **Base Cost:** 1 PP per rank.

* **Roll:** Violence Attack vs Body Defense (or other pillar vs its Defense, with GM approval).

* **Effect:** On failed Resilience check:

  * Target is moved a distance based on degrees of failure (short → medium → long → slammed into hazard), possibly with **Injured/Maimed** if they hit something dangerous.

**Descriptors (examples)**

* “Gu Swarm Lift” – microscopic Gu carry or slam targets.

* “Telekinetic Throw”.

* Influence-flavoured: “Dragged out of the Room” via political leverage.

**Power Draws Blood & Costs**

* If Push/Pull is used to cause **high-speed impacts or environmental Ruined Body results**, repeated use may mark **Blood** (physical self-stress) or **Stain** (using inherently cruel tactics).

  ---

  ## **2\. Movement & Positioning Effects**

  ### **2.1 Flight (Movement Suite Baseline)**

**Balance Tag:** Strong (intentionally the “gold standard” movement effect)

**Rules Block**

* **Type:** Movement; Sustained or Continuous; personal.

* **Base Cost:** 2 PP per rank (or 1 PP with tighter caps, depending on how strong you want it).

* **Effect:** Grants high-speed, 3D movement. Higher ranks allow longer distances per move and environmental advantages.

**Descriptors**

* “Gu Wings”, “Cursed Sword Levitation”, “Celestial Wind Steps”.

**Power Draws Blood & Costs**

* Flight itself does **not** mark cost tracks.

* However, **Blood-Forward Violence builds** that rely heavily on Flight for defence (evasion) should be encouraged to take **lower Body Resilience**—their evasion is great, but if hit, they suffer.

  ---

  ### **2.2 Dash (Ground Speed / Blink Step)**

**Balance Tag:** Balanced

**Rules Block**

* **Type:** Movement; personal.

* **Base Cost:** 1 PP per rank.

* **Effect:** Enhanced Speed or short **Step**/teleports-in-line-of-sight, letting you rapidly reposition without full Teleport freedom.

**Descriptors**

* “Shadow Step”, “Lightning Meridian Stride”.

**Power Draws Blood & Costs**

* Rarely marks cost on its own; it is a **mobility tax** that Balanced builds pay instead of Flight.

  ---

  ### **2.3 Teleport (Short-Range)**

**Balance Tag:** Strong (heavily restricted)

**Rules Block**

* **Type:** Movement; personal; Standard or Move Action.

* **Base Cost:** 2 PP per rank.

* **Effect:** You vanish from one point and reappear in another within a maximum distance defined by rank (short-range within the scene by default).

**Restrictions & Costs**

* Long-range or **blind** Teleport:

  * Requires **GM permission and/or Extra**,

  * And **always marks Stain or Fate** when used at maximum range (you are tearing through reality or dealing with pathwalkers).

**Descriptors**

* “Gu Tunneling”, “Domain Shift”, “Heavenly Flash”.

  ---

  ## **3\. Defense, Mitigation, and Control Effects**

  ### **3.1 Armor / Wards (Resilience Boosts)**

**Balance Tag:** Balanced

**Rules Block**

* **Type:** Passive or Sustained; personal.

* **Base Cost:** 1 PP per rank.

* **Effect:** Adds to a pillar’s **Resilience** (Body, Mind, or Soul), up to the relevant band cap (Defense \+ Resilience ≤ band).

**Descriptors**

* Body: “Reinforced Gu Carapace”, “Blessed Plate”.

* Mind: “Mental Ward Seals”.

* Soul: “Ancestor Veil”, “Cursed Halo”.

**Power Draws Blood & Costs**

* For **Ward-Forward builds**, Armor/Wards are where you spend your extra \+2 Defense Band.

* Excessive, layered Wards that shrug off Revelation or Influence for free should be flagged **Strong** and may:

  * Require rare materials/rituals (fictional cost),

  * Or slowly mark **Stain** (your soul hides behind too many walls).

  ---

  ### **3.2 Guard (Deflect-lite)**

**Balance Tag:** Niche → Balanced (with tight limits)

**Rules Block**

* **Type:** Reaction or Standard Action; short range; affects one ally or small group.

* **Base Cost:** 1 PP per rank.

* **Effect:**

  * Allows you to roll a **Guard check** (d20 \+ Guard rank) to replace an ally’s Defense vs one incoming attack, OR

  * Provides a **flat \+2/+5** bonus to Defenses in a small zone for one round (depending on how you want to scale it).

**Constraints**

* Cannot be built with “stack all the Extras” patterns:

  * No Reaction \+ Area \+ Selective \+ unlimited uses.

  * Typically limited to **1–2 uses per round**.

**Descriptors**

* “Gu Shield Swarm”, “Interposed Cursed Blade”, “Celestial Counterspell”.

**Power Draws Blood & Costs**

* If Guard is used as a **hard counter** to big Violence or Revelation effects, the GM can rule that:

  * On a critical success, you may mark **Blood** to also reflect some harm back.

  * On a critical failure, you mark **Blood or Stain** as the backlash hits you instead.

  ---

  ### **3.3 Barrier (Create-lite, Static)**

**Balance Tag:** Balanced

**Rules Block**

* **Type:** Standard Action; creates one or more static terrain features.

* **Base Cost:** 1 PP per rank.

* **Effect:**

  * Creates a **Barrier** with a certain Toughness/Resilience (usually equal to rank) that blocks movement, line of sight, or line of effect.

  * Climbing, breaking, or bypassing it requires checks vs its Resilience.

**Descriptors**

* “Gu Hive Wall”, “Stone Talisman Dome”, “Media Firewall” (data barriers in a more modern setting).

**Power Draws Blood & Costs**

* Generally does not mark cost tracks by itself.

* If Barrier is used to trap someone in a **lethal or sanity-destroying situation**, repeated such uses may mark **Fate** or **Stain**.

  ---

  ### **3.4 Narrow Immunity**

**Balance Tag:** Niche → Balanced (if kept very narrow)

**Rules Block**

* **Type:** Passive.

* **Base Cost:** Typically 1–2 PP per **very narrow** Immunity; broader ones cost more and should be rare.

* **Effect:** You ignore a specific, controlled category of harm, such as:

  * Your own Gu,

  * The backlash from your personal Cursed Technique,

  * A single environmental hazard.

**Descriptors**

* “Immune to my own Domain collapse.”

* “Immune to the Gu breed that lives in my body.”

**Power Draws Blood & Costs**

* Very broad immunities (e.g. “immune to all mental effects”) should be banned or rewritten.

* Some narrow immunities can be paired with **Stain**: you are immune because you are becoming that threat.

  ---

  ## **4\. Information, Influence & Illusion Effects**

  ### **4.1 Enhanced Senses**

**Balance Tag:** Balanced

**Rules Block**

* **Type:** Passive or Sustained.

* **Base Cost:** 1 PP per level of enhanced sense package.

* **Effect:** Expanded perception: see in darkness, sense Gu auras, read intent, perceive lies, etc.

**Descriptors**

* “Gu-Sense”, “Celestial Insight Sight”, “Media Feed Overlay”.

**Power Draws Blood & Costs**

* If tied into Revelation (seeing truths humans shouldn’t):

  * May **mark Stain** when repeatedly used to pierce cosmic veils.

  ---

  ### **4.2 Mind Pierce (Mind Reading-lite)**

**Balance Tag:** Strong (strictly controlled)

**Rules Block**

* **Type:** Revelation attack vs Soul or Mind; Standard Action; single target.

* **Base Cost:** 2 PP per rank (premium pricing).

* **Roll:** Revelation Attack vs Mind or Soul Defense.

* **Effect:** On failed Resilience check, you read surface thoughts; additional degrees reveal deeper memories or hidden fears, subject to GM veto.

**Constraints**

* Must be **Limited**: no Area, no infinite-range, no “you never know I tried”.

* Ideally requires **eye contact, ritual, or consent**, or costs extra PP.

**Descriptors**

* “Open the Gu Ledger”, “Celestial Audit”, “Dream-Reading”.

**Power Draws Blood & Costs**

* Every use that digs beyond surface thoughts (2nd+ degree success) should **mark Stain** (you’re not meant to rummage in souls for free).

* Some playbooks may instead mark **Fate** (you become entangled with what you learn).

  ---

  ### **4.3 Glamour / Veil (Illusion)**

**Balance Tag:** Niche → Balanced

**Rules Block**

* **Type:** Influence/Revelation hybrid; Standard Action; Area or single target.

* **Base Cost:** 1 PP per rank.

* **Effect:** Create illusory sensory data that:

  * Inflicts penalties to Perception or Insight,

  * Or forces targets to resist with Mind or Soul Resilience to avoid **Shaken/Haunted** conditions when the illusions are horror-flavoured.

**Descriptors**

* “Gu Mirage”, “Media Spin Filter”, “Hall of Mirrors Domain”.

**Power Draws Blood & Costs**

* Simple glamours (cosmetic disguises) are usually cost-free.

* Horror illusions that push toward **Haunted / Deranged** should, on repeated use, **mark Stain**.

  ---

  ### **4.4 Blessing / Hex (Long-Term Buff/Debuff)**

**Balance Tag:** Niche

**Rules Block**

* **Type:** Utility; extended action; target single person or small group.

* **Base Cost:** 1 PP per rank (buff or debuff magnitude).

* **Effect:**

  * Buff: temporarily boosts a stat or trait by 1–2 ranks (still respecting caps) for a session or arc.

  * Hex: applies a mild, ongoing penalty or vulnerability to a specific type of effect.

**Descriptors**

* “Gu Contract”, “Heavenly Blessing Seal”, “Cursed Hashtag Campaign” (media).

**Power Draws Blood & Costs**

* Blessings often mark **Fate** (obligations to the entity granting them).

* Hexes, especially those that ride on Revelation or Influence, mark **Stain** or **Fate** depending on flavour.

  ---

  ## **5\. Excluded or Heavily Rewritten Mechanics**

These are **not** part of the core effect list. If they appear, they should be treated as advanced, GM-only, or entirely rewritten variants.

1. **Metamorph / Multi-form “I am many character sheets”**

   * Flagged as **Broken** in the underlying analysis.

   * Replaced by:

     * **Arrays of effects** within a single statline, or

     * Summoning one named companion (with strict PP limits).

2. **Broad Transform-as-Variable**

   * No “Transform anything into anything” economy engines.

   * Transform, if used, is:

     * Either a **Debilitate** variant (e.g. turn people into statues with a clear condition ladder), or

     * A tightly-defined alternate form whose stats are explicitly costed.

3. **Luck Control that overrides GM fiat or creates infinite loops**

   * No effects that:

     * Force any roll to be rerolled indefinitely,

     * Or negate consequences after the fact without cost.

   * Limited, self-targeted rerolls are represented via **Fury/Clout/Insight spends**, not separate powers.

4. **Omni-minion swarms / wide Summon**

   * Minion mechanics are restricted to:

     * Narrative assets, or

     * One or two statted companions at **PC-appropriate PP costs**.

   * Massive armies are handled via **clocks and fronts**, not as on-sheet powers.

   ---

This gives you a **tight, effect-based chassis** where:

* SCL, CL, SL and your nine stats define caps and bands.

* Power Draws Blood manifests in build-time Offense/Defense and Accuracy/Power / Defense/Resilience profiles.

* Fury/Clout/Insight give each pillar a distinct way to “push”.

* Blood/Fate/Stain ensure that the biggest moves and harshest outcomes carry meaningful long-term consequences.

If you want, next we can:

* Turn each of these effect write-ups into **full rule text with Extras/Flaws** tables, or

* Build a few **example playbooks** that show how different Power Draws Blood profiles \+ effect choices create distinct archetypes in play.

* 

# part 2

I’ve put together the structures you asked for and generated spreadsheets you can download and edit.

---

## **1\) Effects & Playbooks – Excel Workbook**

I created an Excel file with multiple tabs that organize the core effects, extras/flaws, and 40 playbooks by lean.

**Download:**  
 SoulCore\_Effects\_and\_Playbooks.xlsx

### **Tabs inside this workbook**

1. **Effects**  
    Columns:

   * Effect

   * Rule Summary

   * Balance Tag

2. Contains the trimmed list:

   * Strike

   * Debilitate

   * Drain

   * Push/Pull

   * Flight

   * Dash

   * Teleport

   * Armor/Wards

   * Guard

   * Barrier

   * Narrow Immunity

   * Enhanced Senses

   * Mind Pierce

   * Glamour/Veil

   * Blessing/Hex

3. These match the write-ups we did: each is a core effect that will get detailed rule text in your main rules document (action type, roll, resistance, degrees → conditions, etc.). You can now add full paragraphs under “Rule Summary” or split into additional columns as needed (Action, Target, Roll, Save, Degrees, Cost, Notes, etc.).

4. **Extras\_Flaws**  
    Columns:

   * Name

   * Description

   * Type (Extra / Flaw)

5. Entries (ready to expand into full rules text):

   * Accurate – \+2 Attack, counts as \+1 rank for Offense band (Extra)

   * Powerful – \+2 DC, counts as \+1 rank for Offense band (Extra)

   * Area (Burst/Line/Cone) – Multitarget, Offense rank capped by SCL (Extra)

   * Selective – Area spares allies (Extra)

   * Precise – Fine control, surgical targeting (Extra)

   * Limited – Only works under certain conditions (Flaw)

   * Tiring – Marks Blood/Fate/Stain when used (Flaw)

   * Slow – Longer action or extended activation (Flaw)

   * Unreliable – Limited uses or misfire risk (Flaw)

6. You can add columns for “Cost Adjustment” (+1/rank, −1/rank, \+Flat, −Flat) and “Recommended Pillars” for each Extra/Flaw.

7. **Playbooks\_Body**  
    Ten Body-lean archetypes (Violence pillar focus), columns:

   * Playbook Name

   * Theme/Concept

   * Primary Lean

   * SCL Band

   * CL/SL Emphasis

   * Violence Profile (Balanced / Blood-Forward / Ward-Forward)

   * Influence Profile

   * Revelation Profile

   * Signature Effects

   * Primary Cost Track Hooks

8. Examples included:

   * Gu-Swarm Enforcer

   * Bone-Breaker Boxer

   * Heavenly Spear

   * Cursed Blade Ronin

   * Titanic Warder

   * Sequence Butcher

   * Urban Juggernaut

   * Gu-Blood Berserker

   * Anchor Knight

   * Battlefield Conductor

9. **Playbooks\_Soul**  
    Ten Soul-lean archetypes (Influence pillar focus):

   * Media Oracle

   * Cursed Politician

   * Cult Shepherd

   * Heaven-Marked Saint

   * Spin Doctor

   * Social Gu Broker

   * Ruinous Idol

   * Court Inquisitor

   * Patron Demon

   * Civic Gu Architect

10. **Playbooks\_Mind**  
     Ten Mind-lean archetypes (Revelation pillar focus):

    * Occult Investigator

    * Gu Scholar

    * Doomed Prophet

    * Dream Hacker

    * Sanity Surgeon

    * Archivist of the End

    * Media Data Diver

    * Psychic Interlocutor

    * Sequence Auditor

    * Gu-Sanity Priest

11. **Playbooks\_Hybrid**  
     Ten hybrid/balanced archetypes, including a high-Seq “Angel of Ratings” as your **playable High-Sequence example**:

    * Gu Paladin

    * Shadow Broker

    * Heavenly Sniper

    * Media Exorcist

    * Sequence Marshal

    * Divine Regulator

    * Cursed Reporter

    * Urban Saint

    * Abyssal Duelist

    * Angel of Ratings (High-Seq example playbook)

Each playbook row already encodes:

* Pillar lean(s)

* SCL band

* CL/SL emphasis

* Power Draws Blood profile per pillar

* Signature effects (mapped to the Effects tab)

* Which cost tracks they lean on (Blood, Fate, Stain)

You can now flesh these out into full 1–2 page spreads per playbook in your rulebook while using the sheet as your mechanical skeleton.

---

## **2\) Boss Design – Excel Workbook**

I also created a second Excel file for boss design, scaling, and NPC roles.

**Download:**  
 SoulCore\_Boss\_Design.xlsx

### **Tabs inside this workbook**

1. **Boss\_Tiers**  
    Columns:

   * Boss Rank

   * Strength Guideline

   * SCL / Design Notes

2. Entries (summary):

   * **Rank 1 Boss**

     * 100–150% of 3-PC party strength.

     * Simple, single-stage boss.

     * SCL parity or \+1; minor band bonuses.

   * **Rank 2 Boss**

     * 150–200% of 3-PC party strength.

     * Adds minions or an environmental hazard.

     * SCL parity or \+2; one pillar might have a \+2 band over PCs.

   * **Rank 3 Boss**

     * 200–250% of 3-PC party strength.

     * Major mechanics; possible small transformation or resilience spike mid-fight.

     * SCL \+2–3; strong pillar focus.

   * **Rank 4 Boss**

     * 300–350% of 3-PC party strength.

     * At least one extra boss stage (resurrects/transforms/phase change).

     * SCL \+3–4; two-stage fight; explicit interactions with Blood/Fate/Stain.

   * **Rank 5 Nemesis**

     * Up to 350%+ of 3-PC party strength.

     * Rival nemesis with 1–2 extra stages and full narrative investment.

     * SCL \+4+; multi-stage; deeply tied to PCs’ Fate and Stain tracks.

You can add columns here for “Recommended Number of Minions/Elites”, “Boss Fury/Clout/Insight Pools”, and “Boss Cost-Track Behaviours” (how they mark Blood/Fate/Stain and how those change stages).

2. **Minions\_Elites**  
    Columns:

   * Type

   * Role & Strength

   * SCL / Design Notes

3. Entries:

   * **Minion**

     * \~50–75% of a PC’s effective strength.

     * Simple statblock; often drop in 1–2 solid hits.

     * SCL −1 to 0 relative to PCs; limited bands.

   * **Elite**

     * \~100–150% of a PC’s effective strength.

     * Tougher than minions; bridge between PCs and bosses.

     * SCL parity or \+1; one pillar advanced.

4. **SCL\_Scaling**  
    Columns:

   * SCL

   * Offense Band Ref

   * Defense Band Ref

   * Boss Rank 1 Multiplier

   * Boss Rank 3 Multiplier

   * Boss Rank 5 Multiplier

5. For SCL 4–12, this provides:

   * A reference Offense/Defense band (2 × SCL).

   * A rough multiplier for a Rank 1 boss, Rank 3 boss, and Rank 5 boss relative to a single PC’s “baseline strength”.

6. Example rows (you’ll see the exact numbers in the sheet):

   * At **SCL 4**:

     * Offense Band Ref: 8

     * Defense Band Ref: 8

     * Boss Rank 1 Multiplier: \~1.0× PC

     * Boss Rank 3 Multiplier: \~1.5× PC

     * Boss Rank 5 Multiplier: \~3.0× PC

   * At **SCL 8**:

     * Offense Band Ref: 16

     * Defense Band Ref: 16

     * Boss Rank 1 Multiplier: \~1.2× PC

     * Boss Rank 3 Multiplier: \~1.7× PC

     * Boss Rank 5 Multiplier: \~3.4× PC

You can refine these multipliers to hit your desired “150–350% of 3-PC party” feel, but the table gives you a starting skeleton to tune.

---

## **How to Use These with Your Rulebook**

1. **Effects & Extras/Flaws → Full Rules Text (Word/Docs)**

   * Copy the **Effects** tab into your main rules document.

   * For each effect, expand “Rule Summary” into structured rule text:

     * Action Type (Standard/Move/Reaction/Extended)

     * Target (Single / Area)

     * Attack Roll (Pillar and stat)

     * Resistance Roll (Defense/Resilience and pillar)

     * Degrees → Conditions mapping

     * How Fury/Clout/Insight and Blood/Fate/Stain may apply

     * Recommended Extras/Flaws from the Extras\_Flaws tab

   * Do the same for Extras/Flaws: give each one a 1–3 line crunch block plus examples.

2. **Playbooks → Character Creation Chapter**

   * Each row in the playbook tabs becomes:

     * One “Playbook” page with:

       * Flavour blurb

       * Starting SCL band and CL/SL emphasis

       * Pillar Power Draws Blood profiles

       * Recommended stat spreads

       * Signature effects and how they hook into Fury/Clout/Insight \+ cost tracks

   * You can further add columns in the sheet for:

     * “Starting PP”

     * “Recommended Primary Stats”

     * “Unique Moves/Abilities”

3. **Boss Design Workbook → GM Chapter**

   * Use **Boss\_Tiers** as your template for a GM section like “Designing Bosses by Rank”.

   * Use **Minions\_Elites** to create procedural guidance for encounter building:

     * Example: “Rank 3 boss \+ 2 elites \+ 4 minions is an ‘epic fight’ for a 3-PC party at SCL 7–8.”

   * Use **SCL\_Scaling** to keep numerical bands aligned with your SCL math.

---

If you’d like next, I can:

* Draft **page-ready rule text** for 2–3 of the core effects \+ their Extras/Flaws as a pattern, or

* Turn a subset of these playbooks (e.g., 4–8) into fully written archetype pages with advancement hooks, or

* Write the **GM-facing boss design procedure** step-by-step using the Boss\_Design workbook as the backbone.

# part 3

I’ll break this into three sections:

1. Page-ready rules text for core effects \+ Extras/Flaws pattern.

2. 6 fully written archetype playbooks with advancement hooks.

3. GM-facing boss design procedure.

You can copy these directly into your draft and then tweak language to fully match your book’s voice.

---

## **1\. Page-Ready Effect Rules \+ Extras/Flaws Pattern**

I’ll do three cornerstone effects—**Strike**, **Debilitate**, and **Flight**—plus a reusable template for **Extras & Flaws**.

### **1.1 Strike (Core Damage)**

**Type:** Offensive Effect – Violence Pillar  
 **Balance Tag:** Balanced  
 **Action:** Standard  
 **Range:** Close (default)  
 **Target:** One creature or object

**Effect:**  
 You make a **Violence attack** to inflict direct physical harm.

1. Roll **d20 \+ Violence Attack** vs the target’s **Body Defense**.

2. If you hit, the target rolls **d20 \+ Body Resilience** vs DC **10 \+ Strike rank**.

3. Compare the resistance result to the DC and apply **Violence conditions** based on degrees of failure:

* Failure by 1–4: **Injured**

  * You suffer minor harm. Take a −2 circumstance penalty on further Violence actions (Violence Attack and Body Defense) until you receive short-term recovery.

* Failure by 5–9: **Maimed**

  * As Injured, and you are **Hindered** (reduced movement and impaired fine actions) until you receive serious treatment.

* Failure by 10–14: **Mortally Wounded**

  * You are taken out of the scene by your injuries. You are dying, unconscious, or otherwise unable to meaningfully act.

* Failure by 15+: **Ruined Body**

  * You suffer catastrophic harm (maimed, dismembered, or killed) as appropriate to the fiction. Undoing this requires advanced medicine, powerful techniques, or metaphysical intervention.

**Caps & Power Draws Blood:**

* Your **Strike rank \+ Violence Attack** must not exceed your **Violence Offense Band**, determined by SCL and your Power Draws Blood profile.

* If you are **Blood-Forward (Violence)**, your Violence Offense Band is 2 × SCL \+ 2; your Violence Defense Band is 2 × SCL − 2\.

* If you are **Ward-Forward (Violence)**, your Offense Band is 2 × SCL − 2; your Defense Band is 2 × SCL \+ 2\.

* A **glass cannon** will typically run Strike at high rank with slightly lower Body Defense/Resilience, while a **bulwark** inverts this.

**Meta-Currencies & Costs:**

* You may spend **Fury** to reroll a missed Strike or add \+2 to a successful hit’s DC after the roll (GM may limit this to once per target per round).

* Strike does not inherently mark **Blood**, but:

  * Using Strike in a way clearly aiming at **Ruined Body** outside of lethal stakes may mark **Stain** or **Fate**, at GM discretion.

**Common Extras & Flaws for Strike:**

* **Accurate:** This Strike is especially easy to land.

* **Powerful:** This Strike hits abnormally hard.

* **Area (Close Burst or Line):** Your Strike hits multiple foes in reach; each resists separately.

* **Tiring (Flaw):** Each use marks **Blood 1** on your track; your own body pays for the damage.

---

### **1.2 Debilitate (Affliction by Pillar)**

**Type:** Offensive Effect – Violence / Influence / Revelation  
 **Balance Tag:** Balanced → Strong  
 **Action:** Standard  
 **Range:** Close or Ranged (descriptor-dependent)  
 **Target:** One creature (Area versions exist with strict limits)

**Effect:**  
 You attack a target’s ability to function along one pillar’s track: Violence (Body), Influence (Soul), or Revelation (Mind).

1. Choose one **Debilitate track** when you acquire this power:

   * **Violence Debilitate** – physical crippling on the Violence track.

   * **Influence Debilitate** – social/political ruin on the Influence track.

   * **Revelation Debilitate** – sanity/insight collapse on the Revelation track.

2. Roll **Attack** using the pillar associated with your Debilitate (Violence, Influence, or Revelation) vs the corresponding **Defense** (Body, Soul, or Mind).

3. On a hit, the target rolls a **Resilience** check for that pillar vs DC **10 \+ Debilitate rank**.

4. Compare the result and apply conditions for that track:

**Violence Debilitate – Track:** Injured → Maimed → Mortally Wounded → Ruined Body

* As per Strike, but framed as **crippling rather than pure damage** (nerve strikes, cursed ligatures, etc.).

**Influence Debilitate – Track:** Rattled → Discredited → Isolated → Shattered/Broken

* Failure by 1–4: **Rattled**

  * −2 on social Influence actions and related defenses; you are shaken by public doubt or personal doubt.

* Failure by 5–9: **Discredited**

  * You take Rattled penalties and suffer a situational penalty when leveraging your status; allies and NPCs treat your words with suspicion or contempt.

* Failure by 10–14: **Isolated**

  * You are socially cornered: allies abandon you, channels close, you may be suspended, ousted, or rendered persona non grata.

* Failure by 15+: **Shattered/Broken**

  * You are taken out in this social/political context: publicly ruined, sidelined, or reduced to a pawn. Reversing this requires major narrative action (campaigns to rebuild your reputation, interventions from powerful sponsors, etc.).

**Revelation Debilitate – Track:** Shaken → Haunted → Deranged → Shattered/Broken

* Failure by 1–4: **Shaken**

  * −2 to Mind-based checks (investigation, perception, sanity resistance); intrusive images begin.

* Failure by 5–9: **Haunted**

  * Persistent visions, nightmares, or auditory phenomena; further Revelation attacks gain \+2 vs you until recovered.

* Failure by 10–14: **Deranged**

  * You are taken out of the current scene by panic, psychotic breaks, or catatonia, described collaboratively.

* Failure by 15+: **Shattered/Broken**

  * Your Mind/Soul is “taken out”: a fugue state, full compromise to an entity, or total existential collapse. This is a campaign-scale consequence.

**Caps & Power Draws Blood:**

* **Debilitate rank \+ pillar Attack** must respect your pillar’s Offense Band.

* Builds designed to frequently reach 3rd degree or higher at-tier are considered **Strong**:

  * They should either be capped at moderate rank or come with **Flaws** and cost hooks.

**Meta-Currencies & Costs:**

* You may spend **Fury**, **Clout**, or **Insight** (depending on pillar) to:

  * Reroll a miss,

  * Or upgrade degrees by one step (from Rattled to Discredited, etc.),

  * Once per target per scene, GM permitting.

* Debilitate effects that:

  * Intentionally aim at **Isolated / Deranged / Shattered/Broken**

  * Or are built with high rank \+ Area \+ Accurate/Powerful

  * Should normally be **Tiring** or similar:

    * Each use that inflicts **3rd or 4th degree** condition marks **Fate** (Influence) or **Stain** (Revelation) on your cost tracks.

**Common Extras & Flaws for Debilitate:**

* **Accurate:** Debilitate is easier to apply, but eats more of your Offense band.

* **Area (Cone, Burst):** Affect multiple targets; keep rank modest.

* **Tiring (Flaw):** Each serious use marks **Fate** or **Stain**, representing the toll of breaking others.

* **Limited (Flaw):** Debilitate only applies to a defined subset (e.g. “officials of X faith”, “users of Gu”).

---

### **1.3 Flight (Baseline Movement Suite)**

**Type:** Utility Effect – Movement  
 **Balance Tag:** Strong  
 **Action:** Move (sustained use) or Free (for already-active Flight)  
 **Range:** Personal

**Effect:**  
 You move through three-dimensional space with supernatural ease.

* Each rank of **Flight** grants an increasing movement speed, as defined by the movement table in your rules (e.g. rank 4 \= fast running speed, rank 8 \= high-speed aerial travel, rank 12+ \= supersonic, etc.).

* You can move vertically with no penalty and ignore most ground-based difficult terrain.

* Flight allows repositioning into superior vantage points, flanking positions, or out of reach of most melee foes.

**Caps & Power Draws Blood:**

* Flight is inherently **Strong** compared to other movement effects: it is treated as the default high-end mobility baseline.

* Your Flight rank is still subject to SCL-based **movement caps** as defined in your travel tables.

* For **Blood-Forward (Violence)** characters, Flight often combos with high offensive bands but weaker Body Resilience: if you get tagged, you *really feel it*.

**Meta-Currencies & Costs:**

* You may spend **Fury** to:

  * Negate a forced movement effect that would crash you,

  * Or reposition after being attacked (e.g. “reactive dodge and reposition”).

* Generally, Flight does not mark cost tracks by itself.

  * Exception: if Flight’s descriptor is inherently taxing (e.g. “bloodjet propulsion” or “Gu burn”), you may apply **Tiring:** each round of high-speed Flight marks **Blood**.

**Common Extras & Flaws for Flight:**

* **Precise:** Fine control; hover in place, weave through tight spaces, or dodge through small openings.

* **Limited (Only While Empowered):** Flight only works under specific conditions (e.g. in your Domain, after spending Fury, under moonlight, etc.).

* **Slow (Flaw):** You must spend a full action to accelerate; you cannot instantly reach top speed.

* **Unreliable (Flaw):** Limited uses per scene or risk of stalling on a failed roll.

---

### **1.4 Generic Extras & Flaws Pattern (For Any Effect)**

You can present Extras/Flaws in a consistent mini-block like this:

**Accurate (Extra)**

* **Effect:** Add \+2 to this effect’s Attack roll.

* **Cost:** \+1 flat PP per rank (or \+1 rank-equivalent, depending on your build model).

* **Band Impact:** Treat the effect as **\+1 rank higher** when checking Offense Band caps.

* **Notes:** Ideal for concept builds whose attacks are hard to dodge (snipers, precise cursed techniques). Overuse of Accurate can crowd out Power and creates “hit often but not hard” profiles.

**Powerful (Extra)**

* **Effect:** Increase the effect’s DC by \+2.

* **Cost:** \+1 rank-equivalent.

* **Band Impact:** Counts as \+1 rank when checking Offense Band caps.

* **Notes:** Pairs well with builds that accept lower Accuracy in exchange for crushing hits.

**Area (Extra – Burst, Line, Cone)**

* **Effect:** Affect all valid targets within a defined template. Each target resists separately.

* **Cost:** Typically \+1 rank-equivalent (tune by template and rank).

* **Band & Balance:**

  * Offense ranks for Area effects are **capped more strictly** by SCL.

  * High-rank Area \+ Powerful should be considered **Strong** and may require Tiring or Limited.

**Tiring (Flaw)**

* **Effect:** Each use of the effect marks 1 on a relevant cost track (**Blood**, **Fate**, or **Stain**, depending on descriptor).

* **Benefit:** −1 rank-equivalent cost.

* **Notes:** This is the main mechanical expression of “Power Draws Blood” at the effect level: you can push an effect’s impact or utility in exchange for deepening your long-term costs.

You can mirror this format for Limited, Slow, Unreliable, Selective, etc.

---

## **2\. Archetype Playbooks (6 Fully Written)**

I’ll flesh out 6: two Body-lean, two Soul-lean, one Mind-lean, and one Hybrid High-Seq example.

Each follows a consistent template: Concept, Stat & SCL targets, Profiles, Core Moves, Advancement hooks.

### **2.1 Gu-Swarm Enforcer (Body / Violence Focus)**

**Role:** Frontline striker and battlefield controller

**Concept:**  
 Your Soul Core is fused with a colony of Gu-quarks—microscopic spirit-insects that consume Qi and rewrite flesh. You are a walking swarm in human shape, specializing in brutal melee and short-range devastation.

**Recommended Band:**

* **Sequence:** Mid-Seq (5–7)

* **SCL:** 6–8

* **CL \> SL:** You are more physically trained than metaphysically refined.

**Profiles (Power Draws Blood):**

* **Violence:** Blood-Forward (glass cannon).

* **Influence:** Balanced.

* **Revelation:** Balanced.

**Suggested Stat Emphasis:**

* **Primary:** Strength, Endurance, Technique.

* **Secondary:** Essence, Resolve.

* **Aether:** Control moderate (to shape Gu), Fate/Spirit lower.

**Signature Effects:**

* **Strike (Gu Fangs):** Close Strike 8–10 with Tiring (Blood) at the high end.

* **Debilitate (Gu Ligatures – Violence):** Violence Debilitate that escalates from Injured → Ruined Body via nerve-locking Gu.

* **Push/Pull (Swarm Shove):** Forces enemies into hazards or into your allies’ kill zones.

* **Armor/Wards (Gu Shell):** Body Resilience boost flavored as hardened carapace.

**Core Playbook Moves (Examples):**

1. **Swarm Overrun**

   * When you move through an enemy’s space using Dash or high-speed Swarm movement, you may make a free low-rank Strike against them. On a hit, you may choose to mark **Blood 1** to also inflict **Injured** automatically.

2. **Hive Fortification**

   * Once per scene, you may spend **Fury 1** to rapidly harden your Gu Shell:

     * Gain \+2 Body Resilience for one round,

     * But at the end of the round, mark **Blood 1** as the Gu feed on your vitality.

3. **Predatory Surge**

   * When an enemy in melee range becomes **Maimed** or worse, you may immediately move up to half your Speed and make a Strike against another foe, representing your swarm surging over the battlefield.

**Advancement Hooks:**

* **Low Tier:**

  * Boost Strike rank and Violence Attack to sit just under your Offense Band cap.

  * Add **Accurate** to Gu Fangs OR pick up Dash to close distance reliably.

* **Mid Tier:**

  * Add a **small Area** Extra to Debilitate (Violence) or Push/Pull.

  * Unlock a move that lets you **convert Blood into Fury** once per scene (self-harm for power).

* **High Tier:**

  * Gain a limited **self-regen** technique: spend **Fury 2** and mark **Stain 1** to clear Injured/Maimed conditions by letting the Gu rebuild you.

  * Begin flirting with Revelation effects: Gu-sight, horrific Gu illusions, etc.

---

### **2.2 Titanic Warder (Body / Defensive Violence)**

**Role:** Tank, protector, anchor point

**Concept:**  
 You are a walking fortress—a body tempered to stand between allies and annihilation. Whether Gu-hardened, cybernetically enhanced, or divinely armoured, your job is to soak damage and shape enemy lines.

**Recommended Band:**

* **Sequence:** Mid-Seq (5–7)

* **SCL:** 6–8

* **CL ≥ SL.**

**Profiles:**

* **Violence:** Ward-Forward.

* **Influence:** Balanced.

* **Revelation:** Balanced.

**Stat Emphasis:**

* **Primary:** Endurance, Strength, Technique.

* **Secondary:** Resolve, Presence.

**Signature Effects:**

* **Armor/Wards (Titan Shell):** High Body Resilience boost; often with **Precise** to permit selective protection.

* **Guard (Interpose):** Deflect-lite effect to replace allies’ Defenses or grant them big bonuses.

* **Barrier (Bulwark):** Static cover and chokepoints.

* **Strike (Heavy Counter):** Lower rank but punishing counter-attacks.

**Core Moves:**

1. **Stand in the Storm**

   * When an ally within close range would be hit by a Violence attack, you may **swap positions** and take the hit instead.

   * If you do, you gain **Fury 1**.

2. **Immovable**

   * When forced movement would move you, you may spend Fury to reduce the distance by SCL meters (or ignore it entirely on a high roll).

   * On a success, mark **Blood 1** as your body literally absorbs the impact.

3. **Guardian’s Glare**

   * Enemies who attempt to bypass you and attack your allies suffer −2 to their Attack if they are within your melee reach, reflecting your sheer pressure.

**Advancement Hooks:**

* **Low Tier:**

  * Push Body Resilience to your Violence Defense Band limit.

  * Add **Guard** with 1–2 uses per round.

* **Mid Tier:**

  * Gain a **Barrier** technique that can be deployed as a reaction to ranged fire.

  * Learn a limited **Influence Debilitate** focused on taunts (Rattled vs you).

* **High Tier:**

  * Unlock a move that lets you **redirect conditions** from allies to you (e.g., swap Injured or Rattled conditions at cost of Blood/Fate).

---

### **2.3 Media Oracle (Soul / Influence Focus)**

**Role:** Social controller, narrative manipulator, soft battlefield control

**Concept:**  
 You read public sentiment like others read weather reports. Through Gu-infested media, divine “feeds”, or prophetic insight, you twist narrative and reputation to your advantage.

**Recommended Band:**

* **Sequence:** Mid-Seq (5–7)

* **SCL:** 6–8

* **SL ≥ CL.**

**Profiles:**

* **Violence:** Balanced.

* **Influence:** Blood-Forward.

* **Revelation:** Balanced.

**Stat Emphasis:**

* **Primary:** Presence, Essence, Focus.

* **Secondary:** Willpower, Technique.

**Signature Effects:**

* **Debilitate (Influence – Public Spin):** Social/political condition inflictor (Rattled → Shattered/Broken).

* **Glamour/Veil (Media Filter):** Illusory spin; misdirects perception and adds penalties.

* **Mind Pierce (Audience Read):** Access to what people *really* think.

* **Blessing/Hex (Viral Trend):** Long-term buff/hex affecting public opinion.

**Core Moves:**

1. **Trend Seer**

   * Once per session, ask the GM: “What outcome is the current narrative driving toward?”

   * Gain **Insight 1** and a concrete predictive statement you can exploit.

2. **Weaponized Spotlight**

   * When you successfully **Discredit** or **Isolate** a foe with Debilitate (Influence), you may spend **Clout 1** to:

     * Either also apply **Rattled** to one of their allies,

     * Or mark **Fate 1** on them and declare a new Complication tied to their damaged reputation.

3. **Viral Shield**

   * When someone attacks your reputation or a close ally’s, you may respond with a Glamour/Veil effect: on success, the attack backfires, inflicting **Rattled** on the aggressor instead.

**Advancement Hooks:**

* **Low Tier:**

  * Build mid-rank Debilitate (Influence) with Accurate, keep DC modest.

  * Invest in Enhanced Senses to read social cues and data feeds.

* **Mid Tier:**

  * Add **Area (Broadcast)** to Debilitate or Glamour to affect groups.

  * Unlock a move that lets you **trade Stain for Clout** by staging increasingly manipulative stunts.

* **High Tier:**

  * Gain a limited **“Rewrite Narrative” ritual**: with extended action and heavy Fate cost, move an NPC from “Isolated” back to “Rattled” but tie them to you.

---

### **2.4 Cursed Politician (Soul / Influence Dark Side)**

**Role:** Deal-maker, manipulator, shadow law-writer

**Concept:**  
 You thrive in back rooms and smoky chambers. Cursed Techniques sit behind your legislation, and every deal has a clause written in blood.

**Recommended Band:**

* **Sequence:** Mid–High Seq (6–8)

* **SL ≥ CL.**

**Profiles:**

* **Violence:** Balanced.

* **Influence:** Blood-Forward.

* **Revelation:** Balanced.

**Stat Emphasis:**

* **Primary:** Presence, Resolve, Technique.

* **Secondary:** Fate, Spirit.

**Signature Effects:**

* **Blessing/Hex (Contracts):** Long-term deals that grant power at a cost.

* **Debilitate (Influence – Sanction):** Penalties to standing, office, or authority.

* **Narrow Immunity (Legal Shield):** Protection against specific kinds of political attack.

**Core Moves:**

1. **Signed in Red**

   * When you Bless or Hex someone via a formal agreement, you may set a specific **trigger** which, if broken, automatically inflicts **Discredited** and marks **Fate** on them.

2. **Backroom Gu Boon**

   * Once per session, you may call in a favour from a prior Blessing/Hex: gain **Clout 2** and mark **Stain 1** for taking what was “owed” in the worst possible way.

3. **Legal Labyrinth**

   * When targeted by Influence Debilitate or similar social attacks, you may force opponents to reroll at the cost of marking **Fate 1** on yourself (you expend political capital to tangle the attack).

**Advancement Hooks:**

* **Low Tier:**

  * Moderate Blessings/Hexes with clear hooks.

  * Moderate Debilitate (Influence) used in committee and negotiation scenes.

* **Mid Tier:**

  * Add small Area or multi-target capabilities: apply clauses to entire factions.

  * Gain a move to convert **Fate into Clout** when you outmanoeuvre rivals.

* **High Tier:**

  * Acquire a dramatic **“Rewrite Law” domain**: once per season, reframe a social reality (e.g. outlaw a group) at heavy Stain/Fate cost.

---

### **2.5 Occult Investigator (Mind / Revelation Focus)**

**Role:** Investigator, forensic mystic, sanity-risk specialist

**Concept:**  
 You dive into cursed crime scenes, Gu labs, and haunted domains. Knowledge is power, even when it should have stayed buried.

**Recommended Band:**

* **Sequence:** Low–Mid Seq (4–6)

* **CL ≥ SL.**

**Profiles:**

* **Violence:** Balanced.

* **Influence:** Balanced.

* **Revelation:** Blood-Forward.

**Stat Emphasis:**

* **Primary:** Focus, Technique, Willpower.

* **Secondary:** Essence, Endurance.

**Signature Effects:**

* **Debilitate (Revelation – Confront the Truth):** Horror-based “reveal” attacks.

* **Enhanced Senses (Forensic Sight):** See traces of magic/Qi/Gu.

* **Mind Pierce (Interrogation):** Carefully bounded mental probing.

**Core Moves:**

1. **Scene Read**

   * When you spend a few minutes examining a location, ask the GM two questions about:

     * “What happened here?”

     * “What is the most dangerous unseen thing here?”

   * Gain **Insight 1** for the scene.

2. **Shared Vision**

   * When you inflict **Haunted** or **Deranged** on a target, you may choose to share part of the vision:

     * You gain a clue or secret,

     * But must mark **Stain 1** as the revelation scars you too.

3. **Pattern Recognition**

   * When you act on information gathered through Enhanced Senses or Mind Pierce, you may spend **Insight** to gain \+2 on a relevant check or attack against the related entity/phenomenon.

**Advancement Hooks:**

* **Low Tier:**

  * Build moderate-rank Debilitate (Revelation) with Limited descriptors.

  * Enhance Investigation/Perception skill equivalents.

* **Mid Tier:**

  * Gain a move that lets you **downgrade Shaken/Haunted** in allies at the cost of **Stain or Blood**.

  * Expand Enhanced Senses to include “see imminent future glitch, one frame ahead”.

* **High Tier:**

  * Access partial **Revelation Domains**: temporary internal reality spaces for interrogations at severe Stain costs.

---

### **2.6 Angel of Ratings (Hybrid High-Seq Example Playbook)**

**Role:** High-Sequence nemesis / PC option, reality-warping media deity

**Concept:**  
 You are a celestial entity of public perception, sustained and shaped by viewership, belief, and emotional engagement. You are both god and product.

**Recommended Band:**

* **Sequence:** High Seq (9+)

* **SCL:** 10–12+

* **SL \> CL.**

**Profiles:**

* **Violence:** Balanced or Ward-Forward.

* **Influence:** Blood-Forward.

* **Revelation:** Blood-Forward.

**Stat Emphasis:**

* Elevated across the board, but with **Essence, Presence, Spirit, Fate** dominant.

**Signature Effects:**

* **Glamour/Veil (Broadcast Halo):** Large-area media illusions, framing reality like a show.

* **Debilitate (Influence/Revelation – Spectacle):** Social and psychological collapses through public humiliation and existential dread.

* **Blessing/Hex (Sponsorship):** Granting power and curses tied to “ratings”.

* **Narrow Immunity:** Immune to ordinary public opinion swings; only large, orchestrated campaigns can hurt you socially.

**Core Moves:**

1. **Ratings Spike**

   * When you orchestrate a dramatic, widely witnessed event, gain **Clout 2 and Insight 1**, but mark **Stain 1** as you become more dependent on spectacle.

2. **Season Finale**

   * Once per arc, you may declare a confrontation “Season Finale.”

   * During this scene:

     * All Debilitate (Influence/Revelation) you inflict can escalate one degree higher on a critical success,

     * But each 3rd or 4th-degree condition inflicted marks **Fate or Stain 1** on you, as the cosmic ledger tallies the cost.

3. **Renewal or Cancellation**

   * When you are reduced to **Shattered/Broken** or **Ruined Body**, you may “return next Season” by:

     * Spending accumulated **Fate and Stain** above a threshold,

     * Returning with a new form, altered playbook moves, and a changed relationship to the PCs.

**Advancement Hooks:**  
 Primarily narrative: they are as much a **living subsystem** as a character. Advancement is about:

* Changing your relationship to popularity and Stain.

* Unlocking new domain-scale effects that alter how entire arcs are structured.

---

## **3\. GM-Facing Boss Design Procedure**

Use this as a GM chapter section; it assumes the Boss\_Design workbook as a reference but does not require it at the table.

### **Step 1: Identify Party Band and Target Rank**

1. Determine the **PC party’s SCL band**:

   * Use the average SCL of the group (or standard playband like “Mid-Seq 6–8”).

2. Choose **Boss Rank** based on narrative stakes:

   * **Rank 1:** Serious but manageable episode threat (100–150% party strength).

   * **Rank 2:** Strong villain or arc opener (150–200%).

   * **Rank 3:** Major arc boss (200–250%).

   * **Rank 4:** Season Big Bad with at least one extra stage (300–350%).

   * **Rank 5 Nemesis:** Rival soul, final boss, or recurring season anchor with 1–2 extra stages (\~350%+).

Use the **Boss\_Tiers** tab as a memory aid for these guidelines.

---

### **Step 2: Set Boss SCL and Pillar Emphasis**

1. Decide Boss **SCL** relative to PCs:

   * Rank 1: SCL equal to or \+1 over PCs.

   * Rank 2: SCL parity to \+2.

   * Rank 3: SCL \+2–3.

   * Rank 4: SCL \+3–4.

   * Rank 5: SCL \+4 or more.

2. Choose **pillar emphasis**:

   * Pick **one primary pillar** where the boss is **above band** (Offense or Defense).

   * Optionally pick a **secondary pillar** where they are modestly ahead.

3. Assign **Power Draws Blood profiles**:

   * For the boss’s primary pillar, decide:

     * Glass Cannon (Blood-Forward), Bulwark (Ward-Forward), or Balanced.

   * For secondary pillars, usually Balanced.

Use the **SCL\_Scaling** tab to ensure Offense/Defense bands are correctly set.

---

### **Step 3: Define the Boss Concept and Signature Effects**

1. **Write a one-line concept:**

   * “Gu-Devouring Cult Patriarch”, “Media Angel of Ratings”, “Sequence Auditor gone rogue”, etc.

2. Based on concept and pillar emphasis, choose **3–5 signature effects** from the Effects list:

   * One or two primary offensive effects (Strike, Debilitate, Push/Pull, Revelation blasts).

   * One or two defensive/mitigation effects (Armor/Wards, Guard, Barrier, narrow Immunity).

   * One unique utility or narrative effect (Blessing/Hex, Glamour, Teleport, etc.).

3. Tune **ranks** so:

   * Primary pillar attacks/defenses sit near or at the boss’s band limits.

   * Other pillars are slightly under.

---

### **Step 4: Stage Design (for Rank 3–5 Bosses)**

For Rank 3+ bosses, design **stages**:

* **Rank 3:**

  * Usually 1.5 stages (minor mid-fight transformation).

  * At 50% condition threshold (e.g. when they become Maimed/Isolated/Haunted or lose a major asset):

    * Increase one effect’s rank,

    * Or swap one signature effect for a stronger or more dangerous variant.

* **Rank 4:**

  * **Two full stages.**

    * Stage 1: Normal form.

    * Stage 2: “Ascended” or “Desperate” form.

  * Trigger Stage 2 when:

    * A key condition hits (Mortally Wounded/Deranged),

    * Or a specific clock fills (cult almost succeeds, ratings spike, etc.).

* **Rank 5 Nemesis:**

  * **Two or three stages**:

    * Stage 1: Public persona / lesser form.

    * Stage 2: True form.

    * Optional Stage 3: Final avatar, allied with an external entity/pathway.

  * At each transition:

    * Alter **Power Draws Blood profiles** (becoming more glass cannon or more bulwark).

    * Have cost tracks (Blood/Fate/Stain) **explode** into the environment—hazards, domain shifts, revelation storms.

---

### **Step 5: Minions, Elites, and Encounter Composition**

Use the **Minions\_Elites** tab:

* **Minions:**

  * SCL −1 to parity with PCs, reduced bands, simple stat blocks.

  * Drop in 1–2 hits; used to frame the boss and create tactical pressure.

* **Elites:**

  * SCL parity to \+1 vs PCs, with one advanced pillar.

  * Function like “mini-bosses” or lieutenants.

For a 3-PC party, example encounter templates:

* **Medium Boss Fight (Rank 2):**

  * Rank 2 boss \+ 2–4 Minions

* **Hard Boss Fight (Rank 3):**

  * Rank 3 boss \+ 1–2 Elites \+ 2–4 Minions

* **Climactic Boss (Rank 4 or 5):**

  * Rank 4/5 boss (2+ stages) \+ 2–3 Elites OR environmental hazards in place of minions.

---

### **Step 6: Integrating Cost Tracks into Boss Behaviour**

Bosses should **actively interact with Blood, Fate, and Stain**:

* **Blood:**

  * Bosses may willingly mark Blood to:

    * Overclock their next attack (+2 DC),

    * Ignore the first degree of Injured/Maimed,

    * Or power a desperate self-heal.

* **Fate:**

  * Bosses can spend Fate to:

    * Call in reinforcements mid-fight,

    * Trigger a pre-planned contingency (exploding Gu nests, media smear pieces, legal traps).

* **Stain:**

  * When Stain fills for a boss:

    * They may gain a powerful, horrific new effect,

    * But also unlock vulnerabilities (e.g. their Gu become unstable, their ratings dependency makes them manipulable).

Use these structured costs to:

* Telegraph **escalation** (players see the boss paying costs),

* And give PCs multiple levers: damage them, socially erode them, or corrupt them.

---

### **Step 7: Example Boss Build Pass (Outline)**

For each major boss in your setting, make a **3-line mechanical snapshot**:

1. **Stats & Bands:**

   * SCL, pillar profiles, Offense/Defense band highlights.

2. **Signature Effects:**

   * Names \+ key ranks \+ key Extras/Flaws.

3. **Stage Triggers & Cost Logic:**

   * How stages change, when they trigger, and what cost tracks they hook.

Then expand into full stat blocks as needed.

---

If you’d like, next we can:

* Take one concrete boss (e.g. “Gu Cult Patriarch” or “Angel of Ratings”) and work up a full stat block with stages,

* Or drill down into one playbook and write its **full 2-page spread** (including sample builds, advancement trees, and in-play examples).

# part 4

Below is a self-contained design chunk you can drop into your draft: first the **bridged power-tier overview**, then a **worked Gu Cult Patriarch multi-stage boss** built using your SCL/Seq logic and the “Power Draws Blood” profile.

---

## **1\. Bridged Power Level Framework**

### **1.1 SCL ↔ M\&M / Aranth Mapping**

You specified:

* **Start of campaign:** SCL 2 ≈ **PL 4**.

* **Classic hero baseline:** SCL 4 ≈ **PL 8**.

* You still want Aranth/M\&M math (attack \+ rank ≈ 2×PL, defenses in similar bands) under the hood.

A simple, clean mapping that respects this:

* **PL ≈ 2 × SCL**

* **PP ≈ 30 × SCL** (since PL 10 heroes typically sit at \~150 PP in Aranth, so PL×15 ⇒ with PL=2×SCL gives 30×SCL).

So:

| SCL | Approx PL | PP Budget (per character) | Narrative Tier |
| ----- | ----- | ----- | ----- |
| 0–1 | PL 0–2 | 0–30 PP | Civilians / thugs |
| **2** | **PL 4** | \~60 PP | Starting PCs, street-tier |
| 3 | PL 6 | \~90 PP | Veteran agents / minor bosses |
| **4** | **PL 8** | \~120 PP | “Classic hero” baseline |
| 5 | PL 10 | \~150 PP | National-tier heroes / bosses |
| 6 | PL 12 | \~180 PP | Continental threats |
| 7+ | PL 14+ | 210+ PP | World / cosmic threats |

This also automatically gives you the **boss-scaling knob**:

* A single **SCL 5 boss (PL 10, \~150 PP)** is \~2.5× a **single SCL 2 PC (PL 4, \~60 PP)**.

* Against a **3-PC SCL 2 party (≈180 PP total)**, that boss is roughly on par in *raw points*, but “boss tools” (area, hard control, cost-track abuse, second stage) push its **effective threat factor** into the 150–250% band you wanted.

---

### **1.2 Bridging to Popular Power Scales**

Very high-level, approximate equivalence by *feel*, not strict feats:

| Your Tier | SCL / PL | Fictional Analogue (examples) | Notes |
| ----- | ----- | ----- | ----- |
| **Street / Early Cultivator** | SCL 2 (PL 4\) | Early **JJK** Grade 3–2 sorcerers; low-rank hunters in **Solo Leveling**; low-rank Gu Masters (1–2) in **Reverend Insanity**; early Spirit Realm (Qi Condensation/Foundation) in **I Shall Seal the Heavens** | PCs are scary to normies but very mortal to “real” bosses. |
| **City / Regional** | SCL 3–4 (PL 6–8) | **Grade 1** JJK sorcerers, some special grades; S-rank / National-level hunters’ weaker foes; rank 3–4 Gu Masters or early Gu Immortals; mid Spirit Realm → early Dao Realm cultivators | This is where most “pro” combatants live. |
| **National / Continental Boss** | **SCL 5–6 (PL 10–12)** | **Yonkō / Admirals** in One Piece, Kage / Biju and top Akatsuki in Naruto; Special Grade curses/sorcerers in JJK; National-level hunters and Monarchs in Solo Leveling; Sequence 5–3 Beyonders or Angels in Lord of Mysteries; rank 6–8 Gu Immortals; Dao Realm powerhouses in ISSTH | A single individual can tilt a war or annihilate a city. This is exactly where your early big bosses sit. |
| **Transcendent / Mythic** | SCL 7–8 (PL 14–16) | True Gods & Above Sequence entities in LotM; top constellations in ORV; Immortal Venerables in RI; high Dao Realm / Daosource in ISSTH; late-series Naruto god-tiers; “top of the setting” pirates in One Piece | Campaign or setting end-bosses. Not for core book PCs. |

Within this, your **SCL 2 start** is roughly “early JJK exorcists / S-class hopefuls / low-rank cultivators / Gu Masters.” Your **SCL 5 Gu Cult Patriarch** will sit in the **National/Continental Boss** band (roughly “disaster-class curse” or “small-country-killer Monarch”).

---

## **2\. Gu Cult Patriarch – Multi-Stage Boss**

### **2.1 Concept Summary**

**Gu Cult Patriarch (“Ancestor of the Thousand Lamps”)**

* **Role:** Multi-phase **Influence \+ Revelation boss** with brutal attrition tools and a violent “panic” fallback.

* **Intended Tier:**

  * PCs: **SCL 2** starters (PL 4\~), probably 3–4 players.

  * Boss: **SCL 5** (≈PL 10), roughly **2.5×** a single PC in raw budget, but with boss tools and stages to pressure the whole table.

* **Thematic hooks:**

  * A reverend-insanity-style **Gu master**, whose “lamps” are half-living Gu colonies storing fate, memories, and curses.

  * Cult leader using **media, belief, and contracts** to weaponize Influence (Clout) and Revelation (Insight) against PCs.

  * Stage 2 reveals his **broken lamp core**, shifting into a violent, body-horror swarm.

---

### **2.2 Mechanical Chassis**

#### **2.2.1 Tier & Budget**

* **SCL:** 5

  * **PL equivalent:** 10

  * **PP budget:** \~150 PP (single-entity).

* **Relative to PCs:**

  * SCL 2 PC ≈ PL 4, \~60 PP.

  * Boss ≈ 2.5× a single PC, but with:

    * Area and minion actions.

    * Strong control (Influence/Revelation).

    * Two stages.

This satisfies your “fight and grow into your ordained pathway” mandate: early PCs cannot *match* his statline; they must exploit tactics, cost tracks, and narrative leverage.

#### **2.2.2 Core & Aether Stats**

Using your **derived CL / SL** formula:

CL \= ⌊(Body \+ Mind \+ Soul) / 3⌋  
 SL \= ⌊(Control \+ Fate \+ Spirit) / 3⌋  
 SCL \= CL \+ SL

**Patriarch – Base Stats (both stages):**

* **Core (Material)**

  * Body 4 (hardened by Gu carapace)

  * Mind 3 (decades of scheming)

  * Soul 2 (strong but compromised)

  * ⇒ (4 \+ 3 \+ 2\) / 3 \= 3 ⇒ **CL 3**

* **Aether (Immaterial)**

  * Control 3 (precise Gu manipulation)

  * Fate 2 (ritually stolen luck)

  * Spirit 2 (cult devotion buffer)

  * ⇒ (3 \+ 2 \+ 2\) / 3 \= 2 ⇒ **SL 2**

* **Total:** CL 3 \+ SL 2 \= **SCL 5**

This keeps the boss at **Sequence-ish 5** in your schema, i.e. a scary but not yet “angelic” threat.

#### **2.2.3 Offense / Defense Caps & Power Draws Blood**

Base band per pillar (before profiles):

* **Offense band:** Attack bonus \+ Effect rank ≤ **2 × SCL \= 10**

* **Defense band:** Defense bonus \+ Resilience rank ≤ 10

Then apply **Power Draws Blood** profiles as you defined (build-time ±2):

* **Balanced:** OffCap 10, DefCap 10\.

* **Blood-Forward:** OffCap 12, DefCap 8\.

* **Ward-Forward:** OffCap 8, DefCap 12\.

Patriarch profiles by **conflict pillar**:

* **Violence (Body):** **Blood-Forward**

  * OffCap 12, DefCap 8\. He hits harder than he can take a straight brawl.

* **Influence (Soul):** **Ward-Forward**

  * OffCap 8, DefCap 12\. Hard to socially isolate or discredit; offense is more about attrition than spike.

* **Revelation (Mind):** **Balanced**

  * OffCap 10, DefCap 10\. His knowledge can wreck you, but his own sanity is fragile.

These profiles are *baked into the statline* – no scene-based overclock here per your selection.

---

### **2.3 Stage 1 – “Ancestor of the Thousand Lamps”**

**Face:** Calm, composed cult patriarch surrounded by hovering Gu-lamps.

#### **2.3.1 Snapshot**

* **SCL:** 5 (CL 3 / SL 2), same across stages.

* **Primary Pillars:**

  * **Influence primary**, **Revelation secondary**, **Violence tertiary**.

* **Positive pools:**

  * **Fury (Violence):** 1–2 per scene max; he does not lean here.

  * **Clout (Influence):** main pool; gains from public displays / converts.

  * **Insight (Revelation):** builds as he reveals trauma, secrets, or Gu lore.

#### **2.3.2 Defenses & Resilience**

Numbers below are “M\&Mish” but you can treat them as your system’s bands.

* **Violence / Body:**

  * Body Defense: \+4

  * Body Resilience (Toughness equivalent): \+4 (Gu carapace)

  * Total 8 \= at **Violence DefCap 8** (Blood-Forward).

* **Influence / Soul:**

  * Soul Defense: \+6 (media savvy, cult aura)

  * Soul Resilience: \+6 (fanatic devotion buffer)

  * Total 12 \= at **Influence DefCap 12** (Ward-Forward).

* **Revelation / Mind:**

  * Mind Defense: \+5 (compartmentalized thinking)

  * Mind Resilience: \+5 (layered self-delusion)

  * Total 10 \= at **Balanced DefCap**.

You can treat **MIMP composite** defense (vs weird hybrid attacks) as:

* **MIMP Defense:** \+5 (average of the three)

* **MIMP Resilience:** \+5

#### **2.3.3 Core Offense Suite (Stage 1\)**

All effects obey their pillar’s OffCap, and hook into cost tracks (Blood / Fate / Stain) and degree tracks (up to **Shattered/Broken**).

---

**1\. Gu Lamp Swarm (Violence)**

* **Type:** Close / Ranged Multiattack Damage (Violence)

* **Attack:** \+8 (Gu swarm lashes)

* **Damage Rank:** 4 (chipping / bleeding)

* **Band Check:** 8 \+ 4 \= 12 ⇒ hits **Violence OffCap 12** (Blood-Forward).

* **Special:**

  * On 2+ degrees of success, target must choose:

    * Take **1 Blood** on the Violence track (ongoing bleeding)

    * Or suffer **–2 Body Defense** vs this attack until end of scene (Gu infestation).

* **Fiction:** Clouds of Gu pour from lamps, chewing through armor, forcing PCs to accept **physical cost** or get swarmed.

---

**2\. Thousand-Lamp Sermon (Influence)**

* **Type:** Area Affliction (Influence) – Rattled → Discredited → Isolated → Shattered/Broken (social)

* **Attack:** Perception vs Soul Defense (no roll)

* **Effect Rank:** 6 (DC \= 16 \+ rank or equivalent)

* **Band Check:** OffCap is 8, so treat this as **rank 6 “safe”** but with strong support from Clout and circumstances.

* **On hit:**

  * 1 degree: **Rattled** – penalties to social actions vs him or his cult.

  * 2 degrees: **Discredited** – public narrative turns; PCs lose authority tags, access, or contacts.

  * 3 degrees: **Isolated** – allies won’t publicly support the PC; mechanical penalties to calling in help.

  * 4 degrees: **Shattered/Broken** – PC is politically/socially taken out in this context: canceled, stripped of platforms, or framed as a cult asset. Reversal requires major narrative work (exorcising the cult’s narrative, exposing deep evidence, etc.).

* **Cost / Reward:**

  * Each mass sermon spends **1 Clout**, but on any PC that reaches **Discredited**, he gains **1 Fate** (stolen future).

* **Fiction:** This is his **signature boss move** in social arcs – he turns the world against PCs using Gu-mediated propaganda.

---

**3\. Worm-Sight Revelation (Revelation)**

* **Type:** Single-target Affliction (Revelation) – Shaken → Haunted → Deranged → Shattered/Broken (shared with Soul)

* **Attack:** \+6 vs Mind Defense

* **Effect Rank:** 4

* **Band Check:** 6 \+ 4 \= 10 (meets Balanced OffCap 10).

* **On hit:**

  * 1 degree – **Shaken:** penalties to investigation / strategy checks.

  * 2 degrees – **Haunted:** Gu visions intrude; GM can compel “paranoia” or trauma hooks.

  * 3 degrees – **Deranged:** PC loses reliable reality testing; GM can impose disadvantage on Revelation defenses.

  * 4 degrees – **Shattered/Broken:** PC is mentally/spiritually taken out in this context – fugue, puppeted mouthpiece for the Gu hive, or complete collapse. Reversal needs rituals, exorcisms, or existential deals.

* **Cost / Reward:**

  * Every time he pushes a PC to **Haunted+**, he gains **1 Insight** and **1 Stain** (his own Revelation track ticking up).

* **Fiction:** Shows PCs the “Gu as quarks” cosmology until their minds slip; great excuse to drag in your esoteric physics / spin metaphysics.

---

**4\. Contract of the Captured Twins (Utility / Boss Tech)**

* **Type:** Binding pact mechanic (Influence \+ Revelation)

* **Effect:** PCs who accept a deal (e.g. to spare NPCs, or gain Gu knowledge) take:

  * **Ongoing Fate cost** (Influence track).

  * A clause he can **trigger once per scene** to impose a forced reroll or temporary Complication.

* **Fiction:** Ties into your “captured twins” idea and JJK-style cursed contracts.

---

### **2.4 Stage 2 – “Broken Lamp, Infinite Swarm”**

Triggered at \~0 HP body OR after spending a set amount of Clout+Insight+Bood.

**Face:** His core Gu lamp shatters; his body collapses into an amorphous mass of Gu and half-formed Domains.

#### **2.4.1 Stage Switch**

When Stage 1 “dies”:

* He immediately:

  * Clears all **Violence Blood** he has taken.

  * Takes **\+1 Stain** and **\+1 Fate** (he is digging deep).

  * Triggers **“Broken Lamp Domain”** (below).

You swap to a new stat block that **keeps the same SCL 5**, but **shifts pillar emphasis**:

* **Violence primary**, **Revelation still strong**, **Influence collapses** (his public mask is gone).

#### **2.4.2 Defenses & Resilience (Stage 2\)**

* **Violence / Body:**

  * Body Defense: \+6 (swarm evasiveness)

  * Body Resilience: \+3 (squishy but everywhere)

  * Total: 9 (just above prior 8; still in Blood-Forward band but biased toward Dodge-style Defense).

* **Influence / Soul:**

  * Soul Defense: \+3 (no more respectable patriarch mask)

  * Soul Resilience: \+3 (cult fracturing)

  * Total: 6 (below prior 12; he is socially exposed).

* **Revelation / Mind:**

  * Mind Defense: \+6

  * Mind Resilience: \+4

  * Total: 10 (unchanged; he doubles down on eldritch clarity).

#### **2.4.3 Stage 2 Offense Suite**

---

**1\. Gu Ocean Surge (Violence)**

* **Type:** Burst Area Damage \+ Debuff (Violence)

* **Attack:** Area (no attack roll) vs Body Resilience

* **Damage Rank:** 6 (up from 4\)

* **Band:** Uses his **Violence OffCap 12** as “budget”—area scaling instead of raw rank.

* **On failed save:**

  * HP / condition damage as normal.

  * On 2+ degrees failed, target gains **1 Blood** and suffers **–2 Body Defense** vs Gu attacks for the rest of the fight (unless they purge the infestation).

* **Fiction:** Ocean of Gu washes through the battlefield; good “second-phase opener”.

---

**2\. Swarm Split (Boss Action / Extra Turns)**

* **Type:** Boss action

* **Effect:** Once per round, at the end of an enemy’s turn, he can:

  * Move up to his normal speed as a swarm.

  * Or make a **basic Gu Lamp Swarm** attack against a PC who just acted.

This is his main **action-economy equalizer** vs 3–4 PCs.

---

**3\. Lamp of False Salvation (Revelation / Influence hybrid)**

* **Type:** Single-target save-or-deal (Revelation)

* **Attack:** \+7 vs Mind or Soul (target’s choice; good tactical decisions rewarded)

* **Effect Rank:** 5

* **On fail:**

  * PC may **instantly clear 1 point** on a chosen cost track (Blood, Fate, or Stain)…

  * …but the Patriarch gains **2 matching points** *and* can immediately impose a fitting Complication (e.g. your wounds knit wrong, you owe him in fate, you accept a false epiphany).

* **Fiction:** “I can take the pain from you. All you need is faith.” A trap heal that externalizes cost into him, then weaponizes it.

---

**4\. Broken Lamp Domain (Environmental)**

* **Type:** Environmental hazard (Revelation \+ Violence)

* **Effect:** While Stage 2 is active:

  * At the **start of each round**, each PC chooses:

    * Make a **Revelation defense** vs rank 4 DC:

      * On fail: gain **1 Stain** and a minor hallucination Complication for that round.

    * Or make a **Violence defense** vs rank 4 DC:

      * On fail: take minor chip damage and **1 Blood**.

  * When any PC hits **3+ total costs** across tracks in this domain, they become “marked”:

    * The Patriarch’s attacks against them gain **\+2 attack** (up to OffCap) for the next round.

**Domain goes away** when:

* The Patriarch is destroyed, or

* PCs perform a significant narrative counter-ritual (e.g. smashing anchor-lamps, using a counter-Gu, etc.).

---

## **3\. How This Tests Your System**

This single boss stress-tests multiple parts of your architecture:

1. **SCL / PL bridge:**

   * SCL 2 PCs vs SCL 5 boss shows that **derived SCL from stats** can produce a boss that feels national-tier by reference to other fiction (disaster-class curse, mid-Gu Immortal) while remaining mathematically consistent with your Aranth-derived PL/PP expectations.

2. **Power Draws Blood:**

   * Violence pillar uses **Blood-Forward** (hits cap 12 offense, 8 defense); Influence uses **Ward-Forward** (defense 12, low offense); Revelation stays Balanced.

   * This visibly creates a boss that is:

     * Soft in a straight beat-down (only Def 8 on Violence).

     * Very hard to topple socially (Def 12 on Influence).

     * Dangerous in sanity duels (Revelation balanced).

3. PCs can exploit whichever pillar they are best positioned to attack.

4. **Cost Tracks:**

   * Violence attacks feed **Blood**.

   * Sermon and contracts feed **Fate**.

   * Revelation attacks feed **Stain**.

   * Stage 2 Domain forces PCs to choose where they want to pay today.

5. **Degree-based conditions:**

   * Both **Thousand-Lamp Sermon** and **Worm-Sight Revelation** escalate smoothly into your shared **Shattered/Broken** 4th degree, matching your text: socially/mentally taken out, reversible only through major narrative work.

6. **Boss stages & action economy:**

   * Stage 1 tests **Influence/Revelation play** (media, politics, horror).

   * Stage 2 pivots to **Violence/Revelation** swarm horror with a boss action (Swarm Split) and an environmental Domain.

---

If you like this direction, the next natural design steps would be:

1. **Write the Gu Cult Patriarch as a 2–3 page spread**:

   * Lore, cult structure, Gu types, sample hooks.

   * The above stat blocks formatted to your final character sheet layout.

2. **Build a matching SCL 2 party sample**:

   * One Body-lean, one Soul-lean, one Mind-lean.

   * Show how their build choices (Power Draws Blood profiles, Domains, and cost tracks) give them different answers to this boss.

3. **Turn this into your “Boss Design Example” section**:

   * Annotate where caps were applied.

   * Show how SCL, stats, and PP budgets informed each design choice.

# part 5

Below I’ll do three things in order:

1. Give you an analytical report on Core/Aether stats, how much they’re “worth”, what SCL \-1 looks like, and how SCP maps to M\&M PP and HERO CP.

2. Use that as context to write a **Boss Design Example** section for a specific boss (Gu Cult Patriarch), annotated with caps and budgets.

3. Build a **matching SCL 2 party** of three PCs (Body / Soul / Mind leans) and show how their builds and Power Draws Blood profiles give different answers to that boss.

---

## **I. Analytical Report – Core Stats, Attributes, SCL and SCP**

### **1\. Sources and comparison frame**

This review is based on:

* Baseline Mutants & Masterminds 3e: PL \+ PP structure and the “15 PP per Power Level” guideline.

* World of Aranth implementation \+ house rules (ability rebalancing, assumed house rules, sample PL 2–12 statblocks).

* HERO System / Champions 6e standard superheroic build levels (400 Total Points with \~75 points in Complications, plus point-distribution guidelines).

Your system goals:

* SCL is the **hidden PL**:

  * SCL 2 ≈ M\&M PL 4 (starting PCs).

  * SCL 4 ≈ M\&M PL 8 (“classic” hero baseline in this game’s lane).

* Core stats (Body, Mind, Soul) \+ Aether stats (Control, Fate, Spirit) **take over most of PL’s job** (offense/defense caps, “how big can a number be”).

* SCP (Soul-Core Points) is the **build currency**, analogous to M\&M Power Points and HERO Character Points.

### **2\. M\&M 3e / Aranth: what one PP buys**

Key facts:

* In standard M\&M 3e, a PL 10 hero typically has \~150 PP, i.e., \~15 PP per PL.

* Aranth uses that structure, but a lot of the actual builds in the Masterdoc hover around:

  * PL 2 civilians and street threats \~15–30 PP.

  * PL 6–8 operatives, elite soldiers, costumed vigilantes \~90–120 PP.

  * PL 10+ heroes and heavy assets \~150–180+ PP.

House-rule ability rebalancing is important:

* Each Ability rank gives multiple downstream benefits; e.g.:

  * Stamina: \+1 Toughness, \+1 Fortitude (≈ 2 PP of value for a 2 PP rank).

  * Agility/Dexterity/Fighting: mix of attack bonus, defense, initiative, and skills that is often **better than** buying traits piecemeal.

* Attack bonus is treated as 1 PP per rank in general; Melee or Ranged only is 1 PP per 2 ranks.

* Guiding principle: **“Pay once for a function”** and avoid double-paying via both Abilities and direct traits.

Intuition: in Aranth, a **single PP** is roughly the value of:

* \+1 to a specific combat defense,

* \+1 to a specific attack bonus,

* \+1 rank to a focused effect (Damage, Affliction, etc.),

* Or a “small” utility/trick.

That’s the baseline your SCP should shadow.

### **3\. HERO / Champions 6e: what one CP buys**

In Champions / HERO 6e:

* Standard superhero: **400 Total Points**, typically with **75 points of Matching Complications**.

* “Superheroic” games generally expect that 400-point characters hit certain benchmarks for offensive dice, defenses, and skills.

* A 175-point Heroic character (no superpowers, just highly competent) sits far below that threshold.

Rough equivalence (by feel rather than strict math):

* A PL 10 / 150 PP M\&M hero is broadly comparable in table impact to a 350–400 point Champions superhero.

* That implies a rough mapping of **1 PP ≈ 2.5–3 HERO CP** (150 PP × \~2.7 ≈ 400 CP).

For our purposes, SCP can be treated as:

1 SCP ≈ 1 M\&M PP ≈ 2.5–3 Champions CP in “weight”.

The key design outcome: an SCL 4 / \~120 SCP hero should feel like a **standard Champions 400-point superhero** at the table.

### **4\. Proposed SCL → hidden PL and SCP budgets**

Given your constraints:

* SCL 2 ⇒ PL 4 (starting PCs).

* SCL 4 ⇒ PL 8 (classic hero baseline for this game’s “street-to-global horror” lane).

We can formalize:

* **Hidden PL \= 2 × SCL** (for PCs and near-PC threats in the mortal band).

  * SCL 2 ⇒ PL 4\.

  * SCL 3 ⇒ PL 6\.

  * SCL 4 ⇒ PL 8\.

* We keep the M\&M guideline of **15 PP per PL** and just convert PL → SCL:

SCP budget per SCL ≈ 30 × SCL, floored at 0 for low SCL.

So:

* SCL \-1: **0 SCP** (mundane baseline, no build currency).

* SCL 0: 0 SCP (still basically mundane).

* SCL 1: **30 SCP** (roughly PL 2 “dangerous human / early awakened”).

* SCL 2: **60 SCP** (PL 4 starting PCs).

* SCL 3: **90 SCP** (PL 6 dangerous mid-boss / elite).

* SCL 4: **120 SCP** (PL 8 classic supers).

This keeps the intuitive “30 points per SCL step” while hard-capping mortals at SCL 4 for the core book.

### **5\. Derived levels: CL, SL and SCL**

You specified:

* **CL (Core Level)** from \[Body, Mind, Soul\]

* **SL (Soul Level)** from \[Control, Fate, Spirit\]

* **SCL \= CL \+ SL**

We keep your simulationist cultivation:

CL \= ⌊(Body \+ Mind \+ Soul) / 3⌋  
 SL \= ⌊(Control \+ Fate \+ Spirit) / 3⌋  
 SCL \= CL \+ SL

Design use:

* **Build gate:** You cannot claim SCL N unless CL \+ SL \= N.

* **Advancement:** Each time CL \+ SL rises, your SCL rises and you unlock a new 30 SCP “band” of budget that you can spend on primaries, techniques, and powers.

* **Cultivation feel:** You raise stats; that raises CL/SL; that raises SCL; SCL increase then allows higher caps and new budget.

### **6\. Starting attributes for SCL \-1**

SCL \-1 is your **pre-awakening mortal baseline**.

Given your stat range of \-1 to \+11, and the desire for “Aether negative before awakening”, a clean baseline is:

* **Core stats** (material self):

  * Body 0, Mind 0, Soul 0\.

* **Aether stats** (immaterial self):

  * Control \-1, Fate \-1, Spirit \-1.

This gives:

* CL \= ⌊(0+0+0)/3⌋ \= 0\.

* SL \= ⌊(-1-1-1)/3⌋ \= \-1.

* SCL \= \-1.

Interpretation:

* Body/Mind/Soul 0 means “ordinary modern adult”.

* Control/Fate/Spirit \-1 \= “no conscious access to cultivation, cursed technique, or Dao; you are *beneath* the lowest Sequence in spiritual terms.”

No SCP is assigned at SCL \-1; any deviations from this are narrative (e.g., a fit soldier with Body 1 and some training) and can be treated as NPC templates.

### **7\. Value of a Core / Aether rank and attributes**

We now have to answer “how much is one rank worth” in SCP terms.

#### **7.1. Pillars and defenses**

We tie the three pillars to Core stats:

* **Violence (Material / Physical):**

  * Body Defense (dodge/parry equivalent).

  * Body Resilience (toughness/fortitude equivalent).

* **Revelation (Sanity / Abstract / Mystery):**

  * Mind Defense (mental / perception defense).

  * Mind Resilience (sanity/soul-shock resistance).

* **Influence (Social / Spiritual):**

  * Soul Defense (social/spiritual dodge).

  * Soul Resilience (reputation/faith/spirit armor).

We keep the classic PL cap logic, translated:

* **Violence caps:**

  * Violence Attack \+ Violence Effect ≤ 4 × SCL (baseline).

  * Body Defense \+ Body Resilience ≤ 4 × SCL (baseline).

* **Revelation caps:**

  * Revelation Attack \+ Revelation Effect ≤ 4 × SCL.

  * Mind Defense \+ Mind Resilience ≤ 4 × SCL.

* **Influence caps:**

  * Influence Attack \+ Influence Effect ≤ 4 × SCL.

  * Soul Defense \+ Soul Resilience ≤ 4 × SCL.

Power Draws Blood lets you flex ±2 on these bands by sacrificing the inverse (see below).

#### **7.2. Core/Aether rank functions**

For the mortal band, assign:

* **Each rank of Body:**

  * \+1 Violence Attack (melee / close).

  * \+1 Body Resilience (toughness/fortitude band).

* **Each rank of Mind:**

  * \+1 Revelation Attack (mystic/mental).

  * \+1 Mind Resilience (sanity/resistance).

* **Each rank of Soul:**

  * \+1 Influence Attack (social/cursed speech).

  * \+1 Soul Resilience (social/spiritual).

And:

* **Each rank of Control:**

  * \+1 maximum Fury pool,

  * \+1 cap to Violence Overclock effects and “safe” escalation before Blood ticks.

* **Each rank of Fate:**

  * \+1 maximum Clout pool,

  * \+1 reroll/bargain “capacity” before Fate track advances.

* **Each rank of Spirit:**

  * \+1 maximum Insight pool,

  * \+1 warding / Domain stability tier before Stain escalates.

Valuation:

* Each Core/Aether rank directly provides \~2 “PP-equivalent” benefits (one offensive, one defensive, or one pool \+ 1 meta-threshold).

* We therefore price:

**Core / Aether Rank Cost: 2 SCP per rank.**

This keeps them in line with M\&M Ability costs (2 PP/rank) while avoiding the more egregious value spikes of some original Abilities.

#### **7.3. Secondary attributes and traits**

Secondary stats (Strength, Endurance, Agility, Technique, Willpower, Focus, Essence, Resolve, Presence) and trait-like elements (skills, advantages, techniques) should each roughly be worth:

* **1 SCP per rank** when they give a single focused benefit (e.g., \+1 to a single attack, \+1 to a particular Resistance, \+2 skill ranks).

* More if they are multi-function (similar to how some Advantages or Powers in M\&M are under/over-costed in the Character Guide’s assessment).

Baseline guidance:

* \+1 to a specific attack bonus, defense, or resilience: 1 SCP.

* \+2 ranks in a skill/specialty: 1 SCP.

* \+1 rank of a standard “Strike”-style damage effect (per pillar) without extras: 1 SCP.

* Powers with strong Extras/Flaws are built as per your trimmed effect list and balanced against this 1 SCP “rank unit”.

### **8\. SCP budgets per SCL and where “Core stats are given by SCL upgrades” fits**

Given 30 SCP per SCL:

* **At SCL 2 (starting PCs):**

  * Total SCP budget: 60\.

  * Recommended baseline allocation:

    * 24 SCP → 12 ranks across Core \+ Aether (6 core \+ 6 aether; 2 SCP each).

    * 12 SCP → secondaries (skills, techniques, advantages).

    * 24 SCP → powers and Domains (actual supernatural effects).

This aligns reasonably with Champions “400-point guideline” where \~40% of points go to characteristics, \~25% to skills, and \~35% to powers. We just compress it to a narrower power band.

“Core stats are given by SCL upgrades” then becomes:

* **On each SCL increase**, you unlock an additional **30 SCP** AND a recommended **“Core Package”** of \+2 Core ranks and \+2 Aether ranks (costing 8 SCP) to keep CL and SL roughly tracking the new SCL.

* Players can deviate from this, but if CL \+ SL doesn’t reach the new SCL, they’re “under-cultivated” for their apparent tier; if CL \+ SL would push beyond the allotted SCL, they must wait narratively to “crystallize” the new SCL.

### **9\. Power Draws Blood – numeric layer**

Mechanically realizing “Power Draws Blood”:

For each pillar (Violence, Influence, Revelation) you choose at build time:

* **Balanced:**

  * Offense band: Attack \+ Effect ≤ 4 × SCL.

  * Defense band: Defense \+ Resilience ≤ 4 × SCL.

* **Blood-Forward:**

  * Offense band: Attack \+ Effect ≤ 4 × SCL \+ 2\.

  * Defense band: Defense \+ Resilience ≤ 4 × SCL − 2\.

  * Narrative: you hit harder / warp reality more, but your protections are thinned and Blood/Fate/Stain costs tick faster.

* **Ward-Forward:**

  * Offense band: Attack \+ Effect ≤ 4 × SCL − 2\.

  * Defense band: Defense \+ Resilience ≤ 4 × SCL \+ 2\.

  * Narrative: you turtle behind shells, domains, and social armor.

This ±2 trade is how specialization and cost tracks intersect with caps.

### **10\. Observations, intuitions, and design philosophy**

**Observations:**

* Aranth’s house rules already treat Attributes as “buckets” that buy multiple things at once, but it relies on careful GMing to avoid double-pay and broken combos.

* HERO’s 400-point standard superhero gives a very clear feel: you want **some** characteristic investment, **some** skills, **some** powers, and it uses a single currency to do that.

* Your cultivation framing wants **stats to be the truth** of a character’s level: CL and SL should not be arbitrary numbers; they should emerge from Body/Mind/Soul and Control/Fate/Spirit.

**Intuition:**

* SCL as CL+SL with 30 SCP per SCL gives you both: you track cultivation as stats, and you track “build currency” as SCP.

* Core/Aether at 2 SCP per rank gives them enough weight that they represent genuine investment, but not so much that they overshadow powers.

* Secondary stats and effects at 1 SCP per rank mirror M\&M’s 1 PP per \+1 pattern for focused traits.

**Design Philosophy Statement (for this part of the game):**

**Design Philosophy: Cultivated Cores, Measured Power.**

In this engine, a character’s true level is the sum of their cultivated Core and Aether – Body, Mind, Soul and Control, Fate, Spirit. These six stats define CL, SL, and SCL, which in turn set the numeric limits for all offensive and defensive traits. SCP (Soul-Core Points) is a single, transparent currency that buys traits, but it does so in a way that always respects SCL-driven caps. Inspired by Mutants & Masterminds’ PL+PP model and Champions’ point-based, characteristic-forward builds, the system aims for a “crunchy build, focused play” experience: strong character optimization games within clear bands of fairness. Power Draws Blood enforces the core motif: every push toward specialized offense or unbreakable defense comes at a visible cost to the inverse, tracked in both numbers and narrative scars.

---

## **II. Boss Design Example – Gu Cult Patriarch (SCL 3\)**

Now we apply this logic to a concrete boss and annotate where caps and budgets hit.

### **1\. Boss concept and tier**

**Gu Cult Patriarch** – SCL 3 Boss (Violence/Revelation hybrid)

* Role: Mid-season boss; apex of a city-scale Gu Cult arc.

* Hidden PL: 2 × SCL \= **PL 6**.

* SCP Budget: 30 × SCL \= **90 SCP** (≈ 150% of a single SCL 2 PC).

* Encounter assumption: 3 × SCL 2 PCs vs 1 Patriarch, plus a few minions.

### **2\. Power Draws Blood profiles**

* **Violence (Body pillar):** Balanced

  * Wants to survive long enough to use Revelation.

* **Revelation (Mind pillar):** Blood-Forward

  * He weaponizes cosmic insight at the expense of his own sanity.

* **Influence (Soul pillar):** Ward-Forward

  * He’s socially and spiritually hard to dislodge, even if his offense there is weaker.

Numerically, at SCL 3:

* Baseline cap: 4 × 3 \= 12\.

* **Violence (Balanced):**

  * Violence Attack \+ Effect ≤ 12

  * Body Defense \+ Body Resilience ≤ 12

* **Revelation (Blood-Forward):**

  * Revelation Attack \+ Effect ≤ 14

  * Mind Defense \+ Mind Resilience ≤ 10

* **Influence (Ward-Forward):**

  * Influence Attack \+ Effect ≤ 10

  * Soul Defense \+ Soul Resilience ≤ 14

### **3\. Core / Aether stats (SCP annotation)**

Allocate 24 SCP → Core/Aether (12 ranks @ 2 SCP):

* **Core:**

  * Body 2, Mind 3, Soul 1 (2+3+1 \= 6 → CL \= ⌊6/3⌋ \= 2\)

* **Aether:**

  * Control 2, Fate 1, Spirit 2 (2+1+2 \= 5 → SL \= ⌊5/3⌋ \= 1\)

* **SCL \= CL \+ SL \= 3** – matches target.

Narrative:

* Physically capable but truly terrifying in Revelation (Mind 3).

* Control/Spirit give him strong Fury/Insight management and Domain stability; Fate is weaker (his bargains are risky).

SCP spent so far: **24 / 90 SCP**.

### **4\. Derived bands and examples**

From stats \+ 1 SCP/rank trait buys, we build:

#### **Violence (Body pillar – Balanced)**

Target bands:

* Violence Attack \+ Effect ≤ 12\.

* Body Defense \+ Body Resilience ≤ 12\.

Sample allocation:

* Violence Attack: \+6

  * 2 from Body, \+4 from secondaries/powers (4 SCP).

* Violence Effect (Gu Claw Strike): rank 6 (6 SCP).

→ Offense band: 6 \+ 6 \= 12 (at cap).

* Body Defense (Dodge/Parry equivalent): \+5

* Body Resilience (Physical Toughness/Fortitude): \+7

→ Defense band: 5 \+ 7 \= 12 (at cap).

Violence SCP subtotal: \~10 SCP (4 attack-focused, 6 damage ranks).

#### **Revelation (Mind pillar – Blood-Forward)**

Target bands:

* Revelation Attack \+ Effect ≤ 14\.

* Mind Defense \+ Mind Resilience ≤ 10\.

Sample allocation:

* Revelation Attack (“Hex of Crawling Insight”): \+7

  * 3 from Mind, \+4 from traits (4 SCP).

* Revelation Effect (Affliction vs Sanity): rank 7 (7 SCP)

→ Offense band: 7 \+ 7 \= 14 (using the \+2 Blood-Forward flex).

* Mind Defense (resisting other mental powers): \+4

* Mind Resilience (sanity armor): \+6

→ Defense band: 4 \+ 6 \= 10 (down from 12 due to Blood-Forward profile).

Revelation SCP subtotal: \~11 SCP (4 attack, 7 effect).

This column is where he threatens to push PCs toward Haunted/Deranged/Shattered conditions.

#### **Influence (Soul pillar – Ward-Forward)**

Target bands:

* Influence Attack \+ Effect ≤ 10\.

* Soul Defense \+ Soul Resilience ≤ 14\.

Sample allocation:

* Influence Attack (“Cult-Voice Command”): \+4

  * 1 from Soul, \+3 from traits (3 SCP).

* Influence Effect (weaker Affliction vs social standing / compulsion): rank 6 (6 SCP).

→ Offense band: 4 \+ 6 \= 10 (two below baseline 12).

* Soul Defense (vs social/magical pressure): \+7

* Soul Resilience (spiritual/social armor): \+7

→ Defense band: 7 \+ 7 \= 14 (two above baseline 12).

Influence SCP subtotal: \~9 SCP (3 attack, 6 effect).

### **5\. Remaining budget: skills, techniques, and Gu powers**

We’ve used:

* 24 SCP (Core/Aether).

* \~30 SCP (Violence/Revelation/Influence bands).

Subtotal: \~54 SCP → **36 SCP left**.

We can invest that in:

* Gu Domain and special techniques (rough SCP sketch):

  * **Gu Hive Domain** (Area, ongoing minion pressure): 12 SCP.

  * **Self-Inflicted Gu Overclock** (once-per-scene self-buff that adds \+2 Effect to Revelation at immediate Blood/Fate cost): \~8 SCP as a limited extra.

  * **Gu Swarm Minions** (PL 2 / SCL \-1–0 equivalents as a small swarm array): \~10 SCP.

  * **Skills, rituals, cult network** (Investigation, Expertise \[Gu Lore\], Deception, etc.): \~6 SCP.

We stay within 90 SCP total, and **every pillar’s bands are clearly inside the allowed caps**.

---

## **III. Matching SCL 2 Party Sample (Body / Soul / Mind)**

Now, build three SCL 2 PCs (60 SCP each) whose Power Draws Blood profiles and Domains interact differently with the Gu Cult Patriarch.

All three:

* SCL 2 ⇒ hidden PL 4\.

* Caps baseline: 4 × 2 \= **8** (modified by PDB profiles).

* Core build budget: assume \~22–26 SCP into Core/Aether, remainder into traits/powers.

I will focus on the high-signal elements rather than exhaustively spending every point.

---

### **A. Body-Lean PC – “Cinder-Fist Remnant”**

**Concept:**  
 Former experimental subject who bonded with a fire-Gu swarm. Frontline striker who uses Violence to keep the Patriarch locked down.

#### **1\. SCL and stats**

* SCL: 2 (PL 4 equivalent).

* Core stats (14 SCP → 7 ranks):

  * Body 3, Mind 1, Soul 1 (3+1+1 \= 5 → CL \= ⌊5/3⌋ \= 1).

* Aether stats (12 SCP → 6 ranks):

  * Control 2, Fate 2, Spirit 0 (2+2+0 \= 4 → SL \= ⌊4/3⌋ \= 1).

* SCL \= CL \+ SL \= 2\.

Total SCP used on Core/Aether \= 26; remaining ≈ 34 SCP.

#### **2\. Power Draws Blood profile**

* **Violence:** Blood-Forward

* **Revelation:** Balanced

* **Influence:** Balanced

At SCL 2:

* Baseline: 4 × 2 \= 8\.

* Violence Attack \+ Effect ≤ 10, Body Defense \+ Body Resilience ≤ 6\.

* Other pillars remain at standard 8/8.

#### **3\. Violence bands vs Patriarch**

Spend \~16 SCP on Violence traits:

* Violence Attack (“Cinder Fist”): \+6

  * 3 from Body, \+3 from traits (3 SCP).

* Violence Effect (“Cinder Fist” Damage): rank 4 (4 SCP).

→ Offense band: 6 \+ 4 \= 10 (maxed for Blood-Forward at SCL 2).

* Body Defense: \+3 (Body 3; no extra SCP).

* Body Resilience: \+3 (Body 3; optionally \+0–1 more SCP).

→ Defense band: 3 \+ 3 \= 6 (matches lowered cap).

**At the table vs Patriarch:**

* Cinder-Fist can seriously threaten the Patriarch’s **Body Resilience 7** with a focused hit, especially if Fury is spent for rerolls/boosts.

* However, with only a 6-point defense band in Violence, he is very vulnerable to the Patriarch’s Violence 6/6 bands and Gu swarm dogpiling.

#### **4\. Domains and cost tracks**

* **Domain:** “Cinder-Gu Colony” – burning parasite insects in his blood.

* **Fury / Blood:**

  * High Control 2 means decent Fury pool and Overclock safety for Violence.

  * He accrues Blood quickly when nova-ing, risking long-term bodily and Gu-mutational consequences (Ruined Body if pushed too hard).

**Answer to boss:**  
 He is the **primary HP and defense shredder** for the party. His job is to drive the Patriarch into Violence conditions (Injured → Maimed → Mortally Wounded → Ruined Body) while trusting others to manage Revelation and Influence.

---

### **B. Soul-Lean PC – “Silk-Tongue Medium”**

**Concept:**  
 A Gu Contract Medium who brokered a deal with a “Court of Hungry Ancestors”. She fights via Influence – binding cultists, disrupting worship, and reshaping the Patriarch’s social/dominion footing.

#### **1\. SCL and stats**

* SCL: 2\.

* Core stats (14 SCP):

  * Body 0, Mind 1, Soul 3 (0+1+3 \= 4 → CL \= ⌊4/3⌋ \= 1).

* Aether stats (12 SCP):

  * Control 0, Fate 2, Spirit 2 (0+2+2 \= 4 → SL \= ⌊4/3⌋ \= 1).

* SCL \= 2\.

26 SCP on Core/Aether; \~34 SCP left.

#### **2\. Power Draws Blood profile**

* **Violence:** Ward-Forward (she avoids physical harm).

* **Revelation:** Balanced (she can confront weirdness but is not a Mind-alpha).

* **Influence:** Blood-Forward (she spends herself socially/spiritually).

At SCL 2:

* Influence Attack \+ Effect ≤ 10; Soul Defense \+ Soul Resilience ≤ 6\.

* Violence Attack \+ Effect ≤ 6; Body Defense \+ Body Resilience ≤ 10\.

#### **3\. Influence vs Patriarch**

Invest \~18 SCP in Influence:

* Influence Attack (“Ancestor-Court Edict” – social/spirit compulsion): \+5

  * 3 from Soul, \+2 from traits (2 SCP).

* Influence Effect (Affliction vs Shaken → Haunted → Deranged/Shattered in social/political space): rank 5 (5 SCP).

→ Offense band: 5 \+ 5 \= 10 (maxed with Blood-Forward).

* Soul Defense: \+2 (Soul 3, but some diverted into offense; effectively she accepts being “open” socially).

* Soul Resilience: \+4 (Soul 3 \+ 1 SCP invest).

→ Defense band: 2 \+ 4 \= 6 (Blood-Forward lowered cap).

**At the table vs Patriarch:**

* She directly contests the Patriarch’s Influence band (4/6 offense vs 7/7 defense/resilience). She won’t easily “win” head-on, but she can:

  * Target his **cultists**, stripping them away and weakening his Domain.

  * Force political/social conditions: Discredited → Isolated → Shattered/Broken (shared condition ladder for Mind/Soul at 4th degree).

With Fate 2 and Spirit 2, she has strong Clout and Insight pools:

* **Clout / Fate:** rerolls/bargains with the Gu Court and locals.

* **Blood / Stain:** taking Blood-Forward in Influence means she eats Stain quickly – social fractures, ancestral backlash, etc.

**Answer to boss:**  
 She is the **boss breaker via environment**: undermine the Patriarch’s narrative, cult, and support structure so the fight does not become a straight Revelation slugfest.

---

### **C. Mind-Lean PC – “Script-Eyed Analyst”**

**Concept:**  
 An occult analyst who treats Gu and Domains as data structures. He leans into Revelation to map, predict, and counter the Patriarch’s Gu Hive and cosmic patterns.

#### **1\. SCL and stats**

* SCL: 2\.

* Core stats (14 SCP):

  * Body 0, Mind 3, Soul 1 (0+3+1 \= 4 → CL \= ⌊4/3⌋ \= 1).

* Aether stats (12 SCP):

  * Control 1, Fate 1, Spirit 2 (1+1+2 \= 4 → SL \= 1).

* SCL \= 2; 26 SCP used, 34 left.

#### **2\. Power Draws Blood profile**

* **Violence:** Balanced (he is not focused here).

* **Revelation:** Blood-Forward (he pushes his mind hard).

* **Influence:** Ward-Forward (he is wary socially but well-defended spiritually).

At SCL 2:

* Revelation Attack \+ Effect ≤ 10; Mind Defense \+ Mind Resilience ≤ 6\.

* Influence Attack \+ Effect ≤ 6; Soul Defense \+ Soul Resilience ≤ 10\.

#### **3\. Revelation vs Patriarch**

Invest \~20 SCP in Revelation:

* Revelation Attack (“Script-Eye Gu Debugging” – targeted Revelation strike): \+6

  * 3 from Mind, \+3 from traits (3 SCP).

* Revelation Effect (Debilitate-type Affliction vs Gu / Domains – imposing Shaken → Haunted → Deranged / Shattered on Gu constructs themselves): rank 4 (4 SCP).

→ Offense band: 6 \+ 4 \= 10 (Blood-Forward cap).

* Mind Defense: \+3 (Mind 3).

* Mind Resilience: \+3 (invest 1 SCP).

→ Defense band: 3 \+ 3 \= 6 (Blood-Forward lowered).

He also invests in:

* **Gu System Diagnostics** (Senses: Detect Gu, Analyze Domains, etc.) – 6–8 SCP.

* **Counter-Rituals / Wards** (to protect party from Revelation splash) – 6–8 SCP.

* Skills: Expertise \[Gu Systems\], Investigation, Insight – 6–8 SCP.

**At the table vs Patriarch:**

* He is the **direct Revelation counterpoint**:

  * Patriarch Revelation band: 7/7 (14 offense) vs 4/6 (10 defense) – he outguns the Analyst.

  * But the Analyst can surgically target **Gu Hive Domain**, cutting bonuses, removing Gu from the Patriarch, and turning his self-inflicted Overclocks into real vulnerability.

* His Spirit 2 and Influence Ward-Forward make him relatively safe from the Patriarch’s social/spiritual assaults.

**Answer to boss:**  
 He is the **mage breaker / puzzle solver**, reading the Gu ritual, predicting when the Patriarch will Overclock, and giving the party the window to strike.

---

## **IV. How the trio’s builds answer the Gu Cult Patriarch**

Putting it together:

1. **Caps and SCL logic in play**

* PCs: SCL 2 → hidden PL 4 → baseline bands 8, flexed to 10 or 6 by PDB.

* Boss: SCL 3 → hidden PL 6 → baseline bands 12, flexed to 14 or 10 by PDB.

From a raw numeric standpoint, the Patriarch outclasses any individual PC in any pillar. But:

* He is **balanced, not spiking**, in Violence.

* He is **blood-forward and risky** in Revelation.

* He is **ward-forward and conservative** in Influence.

2. **Role answers**

* **Cinder-Fist Remnant (Body / Violence Blood-Forward)**

  * Takes the **Violence pillar head-on**, using Fury and Overclock to deliver PL 6-quality hits with a PL 4 body, at the cost of severe Blood ticks and low defense.

* **Silk-Tongue Medium (Soul / Influence Blood-Forward)**

  * Engages at the **Influence layer**, stripping away Gu followers, weakening Domains, pushing the Patriarch toward Shattered/Broken socially and politically.

* **Script-Eyed Analyst (Mind / Revelation Blood-Forward)**

  * Acts at the **Revelation layer**, debugging Gu systems, shortening the time the boss can safely sit at his Blood-Forward Revelation offense before mentally collapsing.

3. **Boss design example goals satisfied**

* **Caps applied:**

  * Every pillar’s Attack \+ Effect and Defense \+ Resilience is explicitly kept within 4×SCL ±2 per PDB profile for both boss and PCs.

* **SCL / stats / SCP budgets:**

  * SCL→hidden PL and SCP budgets are consistent with M\&M and Champions expectations for power bands.

  * Core/Aether ranks are costed at 2 SCP per rank and drive CL, SL, and thus SCL.

  * PCs at 60 SCP and boss at 90 SCP approximately implement the “150% boss strength vs one PC” heuristic and \~1.5× individual impact, with the action economy of three PCs balancing the encounter.

If you like this structure, the next layer would be:

* Full mechanical write-ups of each PC and the Patriarch in your effect-list notation (Strike / Debilitate / Drain, etc.),

* Explicit Blood/Fate/Stain track values per SCL and per Domain,

* And at least one additional boss stage where the Patriarch either shifts PDB profiles mid-fight or changes which pillar he emphasizes (e.g., Revelation → Violence when cornered).

