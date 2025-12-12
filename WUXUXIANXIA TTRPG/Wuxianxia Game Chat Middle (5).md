Below is a self-contained SRD-style section **2.6 Meta-Currencies & Cost Tracks** that plugs cleanly into your existing spine (2.5 SCL & caps, 3.3 Effects, 4.x Character Creation, 6.3 Bosses).

It is written to:

* Echo the **economy logic** of Champions (Limitations reduce real cost, Advantages increase it) while keeping M\&M-style caps and Hero Point–like rerolls and stunts.  
* Integrate **Power Draws Blood** as a structural, priced choice, not just flavour.  
* Make **Blood / Fate / Stain** feel like real levers, not passive clocks.

You can paste this as-is into Chapter 2\.

---

# **2.6 Meta-Currencies & Cost Tracks**

## **2.6.0 Overview**

**2.6.0.1 What This Section Covers**

1. **Player-facing currencies** you actively manage:  
   * **Fury** – Violence pillar momentum.  
   * **Clout** – Influence pillar leverage.  
   * **Insight** – Revelation pillar clarity.  
2. **Cost tracks** that record the **price of power**:  
   * **Blood** – Physical and material self-destruction.  
   * **Fate** – Entanglements, bad luck, and social debt.  
   * **Stain** – Spiritual taint, corruption, and cosmic residue.  
3. How **Power Draws Blood (PDB)** profiles provide:  
   * **Mechanical cap shifts** (2.5.3).  
   * **SCP discounts** that mirror Limitations in a point-buy game.  
4. How **overflow** on tracks triggers:  
   * Conditions, penalties, or scene-level twists.

**2.6.0.2 Design Intent**

1. Power is **not free**:  
   * High caps and flexible effects demand **front-loaded build commitments** and **ongoing in-play costs**.  
2. Players are incentivised to:  
   * Take **risky PDB profiles** and cost-linked Flaws **because they get more build efficiency** (more SCP).  
   * Then manage Blood/Fate/Stain and meta-currency at the table to survive.  
3. GMs gain:  
   * **Clear dials** for pacing escalation (track overflow).  
   * **Fair levers** for high-op builds that still respect SCL caps.

---

## **2.6.1 Fury, Clout, Insight (Positive Meta-Currencies)**

**2.6.1.1 Definitions**

1. **Fury** – Violence pillar meta-currency.  
   * Represents adrenaline, pain-fury, martial flow.  
2. **Clout** – Influence pillar meta-currency.  
   * Represents social leverage, public sympathy, political capital.  
3. **Insight** – Revelation pillar meta-currency.  
   * Represents flashes of understanding, prophetic alignment, lucid horror.

Each is stored as a **pool of points**; PCs and some bosses may have access to one or more pools.

**2.6.1.2 Starting Values**

1. By default, each PC starts sessions with:  
   * **1 point** in their **primary pillar’s** pool (Fury/Clout/Insight).  
   * **0** in others, unless a playbook dictates otherwise.  
2. Maximum recommended pool size:  
   * **3 \+ SCL** per pool; additional gains beyond this can:  
     * Be converted to other benefits (e.g., overflow spending), or  
     * Be lost if unspent (GM’s choice per campaign tone).

**2.6.1.3 Gaining Meta-Currency**

PCs gain Fury/Clout/Insight when:

1. **Complications hit**:  
   * When a Complication relevant to a pillar meaningfully complicates a scene, the PC gains **1 point** in that pillar’s pool.  
   * Example: a Violence-flavoured Rival showing up → Fury; public scandal hitting home → Clout; prophetic nightmares intruding → Insight.  
2. **Track alignment**:  
   * When a cost track fills or crosses a threshold in that pillar (2.6.3.3), the GM may award **1–2 points** in the matching pool as a “power spike” before the crash.  
3. **Heroic gambles**:  
   * PCs who make a **high-stakes choice** strongly aligned with a pillar:  
     * e.g., charging a superior foe (Violence), sacrificing reputation (Influence), or staring down cosmic truth (Revelation),  
     * may earn 1 Fury/Clout/Insight at GM discretion.

**2.6.1.4 Spending Meta-Currency**

Each pool has **standard uses** and **pillar-specific stunts**.

1. **Standard Uses (Any Pool)**  
   1. **Reroll**: Spend 1 to reroll a d20 you rolled; keep the better result.  
   2. **Boost**: Spend 1 to add **\+3** to any roll after seeing the result but before degrees are determined.  
   3. **Shake It Off**: Spend 1 to downgrade a **1st-degree condition** on you in that pillar (Injured → cleared, Rattled → cleared, Shaken → cleared).  
2. **Violence-Specific Uses (Fury)**  
   1. **Push the Limits**: Spend 1 Fury to temporarily treat your **Violence OffCap** as **\+2 higher** for one roll (Attack \+ Effect \+ virtual ranks may exceed OffCap by up to 2). After the roll, immediately mark **\+1 Blood**.  
   2. **Last Stand**: Spend 2 Fury to fight through **Mortally Wounded** for one round: you can act normally but suffer −2 to all rolls; if you take another degree, you may collapse into Ruined Body at GM discretion.  
3. **Influence-Specific Uses (Clout)**  
   1. **Spin the Narrative**: Spend 1 Clout to retroactively establish a minor relationship or reputation detail (e.g., “I’ve worked with this journalist before”) that grants advantage/bonus on an Influence roll.  
   2. **Public Sympathy**: Spend 1 Clout to downgrade a 2nd-degree **Discredited** result to 1st-degree **Rattled** for the scene (you keep some legitimacy).  
4. **Revelation-Specific Uses (Insight)**  
   1. **Connect the Dots**: Spend 1 Insight to ask the GM a **focused question** about a mystery; the GM must answer truthfully within the scope of what your PC could infer from existing clues.  
   2. **Hold the Pattern**: Spend 1 Insight to delay the onset of a Revelation condition by one round or one scene (GM’s call), giving you time to act before **Haunted/Deranged** take full effect.

---

## **2.6.2 Power Draws Blood as Structural Discount**

**2.6.2.1 PDB Recap**

1. In 2.5.3.3, each pillar chooses a **Power Draws Blood** profile:  
   * Balanced, Blood-Forward, or Ward-Forward.  
2. These adjust OffCap/DefCap by ±2 in that pillar.

**2.6.2.2 SCP Discount by PDB**

To reflect that Blood-Forward / Ward-Forward are **Limitation-like** commitments, you may optionally (or by default) apply:

1. **Pillar Discount**:  
   * For each pillar where the PC is **not Balanced** (Blood-Forward or Ward-Forward):  
     1. All effects whose **primary pillar** matches that pillar receive a **10–20% SCP discount** on their total cost.  
2. Recommended standard:  
   * **15% discount**, round in favour of the PC.  
   * Process:  
     1. Compute total SCP cost of the effect (Base \+ Extras – Flaws).  
     2. If the effect’s primary pillar matches a non-Balanced PDB choice:  
        * Multiply by 0.85 (or subtract 15%).  
        * Round to nearest ½ SCP.

**2.6.2.3 Limits on Discount**

1. To avoid abuse:  
   * Apply PDB discount to at most **three pillar-appropriate effects** per character (primary, secondary, one utility).  
   * Or apply it only once per **distinct effect line** (e.g., your main Strike line, your main Revelation line).  
2. Bosses:  
   * May receive the discount conceptually for flavour but **do not need exact SCP accounting**; use it mainly to justify why they have multiple strong pillar powers.

---

## **2.6.3 Cost Tracks: Blood, Fate, Stain**

**2.6.3.1 Track Structure**

1. Each PC has three tracks:  
   * **Blood** (Violence).  
   * **Fate** (Influence).  
   * **Stain** (Revelation).  
2. Each track is a set of **boxes**:  
   * Base: `3 + SCL` boxes.  
   * Optionally, if a pillar is **Blood-Forward**:  
     * That pillar’s cost track may gain **\+2 boxes** for that PC (table option; recommended for slightly more survivability).  
3. Track boxes are marked when:  
   * You use powers with Flaws like **Tiring (Blood)**, **Backlash (Stain)**, or other track-linked effects.  
   * The GM rules that a fictionally heavy action exacts a cost.

**2.6.3.2 Thresholds**

By default, each track has two key thresholds:

1. **Strain Threshold**:  
   * At **half track** (rounded up), e.g., 4/7 boxes filled:  
     * You are **on the edge**; conditions and penalties begin.  
2. **Overflow Threshold**:  
   * When the track is **full**:  
     * A strong fallout occurs, determined by pillar.

**2.6.3.3 Effects at Strain**

When **Blood** crosses Strain:

1. You gain:  
   * −1 to Body-based rolls from exhaustion, pain, or lingering injury (stacks with Injured).  
2. At GM discretion, you may:  
   * Auto-earn 1 Fury as your body rebels and surges with adrenaline.

When **Fate** crosses Strain:

1. The GM increases the **unfavourable odds**:  
   * −1 to Influence rolls, or  
   * Clocks representing debts, enemies, or obligations advance faster.  
2. You may gain 1 Clout from heightened stakes.

When **Stain** crosses Strain:

1. You suffer:  
   * −1 to Mind-based rolls or \+1 difficulty to resist Revelation.  
2. You may gain 1 Insight as your mind briefly aligns with the very forces corrupting you.

**2.6.3.4 Effects at Overflow**

When a track **fills completely**, immediately resolve a **cost crash**:

1. **Blood Overflow**  
   1. Choose one (or let GM choose):  
      * You immediately suffer a **Violence condition** at GM-chosen degree (usually 2nd or 3rd).  
      * You collapse, effectively **Mortally Wounded** (3rd degree).  
   2. Blood track then:  
      * Is **reset to half** its boxes (rounded down), or  
      * Partially clears after recovery downtime (GM call).  
   3. Optionally, award **1 Fury** for surviving this crash, then prevent further Fury gain from Blood until it drops below Strain.  
2. **Fate Overflow**  
   1. A major **twist** hits:  
      * Allies turn away at a critical moment (Isolated).  
      * A previously neutral faction becomes hostile.  
      * A major hard move in Influence terms.  
   2. The PC may:  
      * Lose all current **Clout**, or  
      * Be forced to spend Clout to mitigate the fallout (e.g., spend 2 Clout to downgrade).  
   3. Fate track is then reset to **half**.  
3. **Stain Overflow**  
   1. The PC suffers:  
      * A **Revelation condition** at GM-chosen degree (typically 3rd), or  
      * Immediate **Shattered/Broken (Mental/Spiritual)** if fictionally warranted (possession, domain collapse).  
   2. The GM may:  
      * Offer a bargain: accept a **permanent Complication or corruption** in exchange for partial Stain clearance.  
   3. Insight is usually **zeroed** or halved after such events.

**2.6.3.5 Clearing Tracks**

Tracks can be reduced by:

1. **Downtime & Recovery Scenes**  
   * Medical treatment, rest, safe training → reduce **Blood**.  
   * Making amends, paying debts, PR campaigns → reduce **Fate**.  
   * Exorcisms, therapy, rituals, acts of atonement → reduce **Stain**.  
2. **Deliberate Sacrifices**  
   * PCs may accept **permanent scars** (mechanical or narrative) to clear a chunk of track:  
     * e.g., −1 permanent Body to clear 2–3 Blood; gain a new “Haunted” Complication to clear 3 Stain.

---

## **2.6.4 GM Guidance: Using Meta & Tracks**

**2.6.4.1 Don’t Hoard, Don’t Spam**

1. Encourage players to **spend Fury/Clout/Insight**:  
   * Offer **clear opportunities**: “you can spend Fury here to push beyond your cap.”  
2. Use tracks to shape **pacing**:  
   * Strain: tension rises.  
   * Overflow: big turn—scene shifts, boss flips stage, or PC pays dearly.

**2.6.4.2 Bosses & Tracks**

1. Bosses may:  
   * Use **simplified tracks** where only Overflow matters (e.g., Gu Patriarch’s Stain triggers Stage 2).  
   * Use Fury/Clout/Insight sparingly as **“once per stage” cheats**.  
2. Boss track overflow should often:  
   * Trigger **Stage transitions** (see 6.3.5).  
   * Open windows for PC victory (boss becomes unstable or vulnerable).

**2.6.4.3 Table Dials**

The GM can adjust:

1. **Track length** (3+SCL is default; for grimmer games, use 2+SCL).  
2. **Discount percentage** for PDB (10% for conservative, 15–20% for more aggressive builds).  
3. **Meta-currency gain** (more for pulpy, less for horror).

---

This section now gives you:

* A coherent **meta-economy** that sits on top of SCL, bands, and Effects.  
* Explicit **PDB discounts** that reward risky profiles.  
* Clear **Blood/Fate/Stain behaviours** at Strain and Overflow.

From here, the next strong moves in the consultation would be:

1. Write a short **2.7 Examples & Worked Builds** section, showing:  
   * How a specific SCL 2 PC’s SCP cost shifts with Blood-Forward Violence.  
   * How track Strain/Overflow play out in one small encounter.  
2. In Chapter 5, design **procedural Influence and Revelation scenes** that explicitly reference:  
   * Clout/Insight spending.  
   * Fate/Stain thresholds.  
3. Expand **archetype playbooks** to bake in:  
   * Default PDB profiles,  
   * Track expectations,  
   * Recommended meta-currency usage patterns for each archetype.

