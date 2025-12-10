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

