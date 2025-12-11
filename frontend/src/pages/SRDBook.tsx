import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Full SRD content as a "book"
const srdContent = `# WuXuxian TTRPG - System Reference Document

## ⚠️ ALPHA DOCUMENTATION AVAILABLE

**NEW**: Comprehensive SRD Alpha documentation is now available in \`/docs/wuxiaxian-reference/\`

### Complete SRD Alpha Patches:
- **SRD History**: Evolution of game design from concept to current state
- **SRD Alpha Structure**: Complete 12-section SRD framework
- **Patch 0.1**: Introduction, Character Creation, Stats & Soul Core Level
- **Patch 0.2**: Combat Resources, Action Economy, Conflict Types & Conditions

**Coverage**: 42% complete (5 of 12 sections)
**Status**: Alpha - Rules may change based on playtesting

**Access these documents in the repository:**
- docs/wuxiaxian-reference/SRD_HISTORY.md
- docs/wuxiaxian-reference/SRD_ALPHA_STRUCTURE.md
- docs/wuxiaxian-reference/SRD_ALPHA_PATCH_0.1.md
- docs/wuxiaxian-reference/SRD_ALPHA_PATCH_0.2.md

---

## Quick Reference (Legacy)

This is the original abbreviated SRD. For complete rules, see Alpha patches above.

## Table of Contents
1. Introduction
2. Character Creation
3. Cultivation System
4. Combat Mechanics
5. Techniques
6. Setting & Lore

---

## 1. Introduction

Welcome to WuXuxian, a Fire Emblem-inspired, xianxia-themed tactical RPG. This System Reference Document (SRD) contains all the rules you need to play.

### Core Concepts
- **Soul Core Level (SCL)**: Your power cap (replaces Power Level from M&M 3e)
- **Cultivation**: Refining your body, mind, and spirit through Sequence bands
- **Three Pillars**: Violence, Influence, and Revelation conflicts are all equally viable
- **Power Draws Blood**: Optimization comes with cost track penalties
- **Techniques**: Special abilities powered by Action Energy (AE)

---

## 2. Character Creation

### 10-Step Process

**Step 1**: Choose concept and cultivation path
**Step 2**: Determine starting SCL (recommended: 5 for Mid-Sequence)
**Step 3**: Purchase 9 Primary Stats (Soul, Body, Mind clusters)
**Step 4**: Purchase 3 Aether Stats (Control, Fate, Spirit)
**Step 5**: Calculate derived stats (Core Stats, CL, SL, SCL)
**Step 6**: Choose Power Profile per pillar (Balanced/Blood-Forward/Ward-Forward)
**Step 7**: Distribute offense/defense bands per pillar
**Step 8**: Calculate combat resources (THP, AE, Strain, Guard)
**Step 9**: Select techniques and effects
**Step 10**: Choose equipment and finalize background

### Playbooks (Quick Start)
- Sword Saint (weapon specialist)
- Body Refiner (tank)
- Spirit Channeler (caster)
- Fate Weaver (luck manipulator)
- Shadow Cultivator (assassin)
- Array Master (controller)
- Beast Sovereign (summoner)
- Pill Alchemist (support)

**See Patch 0.1 for complete details**

---

## 3. Cultivation System

### Soul Core Level (SCL)
\`\`\`
SCL = Core Level (CL) + Soul Level (SL)
CL = floor((Body Core + Mind Core + Soul Core) / 3)
SL = floor((Control + Fate + Spirit) / 3)
\`\`\`

### Sequence Bands
- **Cursed-Sequence** (SCL 1-2): Broken, collapsing powers
- **Low-Sequence** (SCL 3-4): Street-level cultivators
- **Mid-Sequence** (SCL 5-7): Professional operatives ⭐ Default start
- **High-Sequence** (SCL 8-10): National heroes, demigods
- **Transcendent** (SCL 11+): True Gods, cosmic entities

### Cultivation Paths
- **Orthodox**: Traditional sect methods (balanced)
- **Demonic**: Fast but corrupting (marks Stain Track)
- **Celestial**: Pure but slow (reduced cost tracks)
- **Natural**: Environment-based (flexible)
- **Artifice**: Technology + cultivation (preparation)

Advancement happens through **breakthroughs** (major narrative milestones) and **tribulations** (challenges from heaven, inner demons, or karma).

**See Patch 0.1 for complete stats and SCL system**

---

## 4. Combat Mechanics

### Combat Resources (Four Interlocking Systems)
1. **THP (Total Hit Points)**: Health pool, death at 0
2. **AE (Action Energy)**: Technique fuel, regenerates per round
3. **Strain**: Overexertion tracker, death at max
4. **Guard**: Temporary damage absorption, resets per encounter

### Action Economy

**1-Beat Combat** (Simple):
1. PCs act (any order)
2. NPCs act
3. Round ends

**3-Stage Combat** (Advanced):
1. **Stage 1**: Fast SPD → Quick Actions
2. **Stage 2**: All → Major Actions (techniques)
3. **Stage 3**: Slow SPD → Quick Actions

### Seven Quick Actions
- **Strike**: Basic attack (1d6 + stat)
- **Block**: Gain Guard, reduce damage 50%, +1 Strain
- **Pressure**: Enemy -2 attack until your next turn
- **Weaken**: Enemy -2 defense until your next turn
- **Empower**: Ally +2 attack until your next turn
- **Shield**: Ally +2 defense until your next turn
- **Reposition**: Move half speed, break engagement

### Damage Routing
- **THP Routing**: Damage → DR → Guard → THP
- **Guard Routing**: Damage → Guard → THP (no DR)
- **Strain Routing**: Direct Strain (bypasses all)

**See Patch 0.2 for complete combat resource mechanics**

---

## 5. Techniques

### Three Conflict Pillars

**Violence (Physical)**:
- Target: Body Defense
- Resistance: Body Resilience
- Pool: Fury
- Conditions: Injured → Maimed → Mortally Wounded → Ruined Body

**Influence (Social)**:
- Target: Mind Defense
- Resistance: Mind Resilience
- Pool: Clout
- Conditions: Rattled → Discredited → Isolated → Shattered/Broken

**Revelation (Horror/Existential)**:
- Target: Soul Defense
- Resistance: Soul Resilience
- Pool: Insight
- Conditions: Shaken → Haunted → Deranged → Shattered/Broken

### 4-Step Condition Ladders
Each pillar has progressive degradation:
- **1st-2nd Degree**: Recoverable with rest/treatment
- **3rd Degree**: Requires extended care
- **4th Degree**: Requires narrative resolution (taken out)

### Technique Structure
- **Name**: Xianxia-flavored title
- **Type**: Basic (1-3 AE), Advanced (4-7 AE), Ultimate (8-12 AE), Forbidden (variable + cost tracks)
- **Attack Bonus**: Added to d20 roll
- **Effect Rank**: Resistance DC 10 + rank
- **Pillar**: Violence, Influence, or Revelation

**Balance Cap**: Attack + Effect ≤ 2 × SCL (per pillar)

**See Patch 0.2 for complete conflict mechanics**

---

## 6. Setting & Lore

### The Realms
- **Mortal Realm**: Where most play occurs (SCL 1-10)
- **Spirit Realm**: Higher plane of existence
- **Celestial Realm**: Domain of immortals and gods
- **Cursed Realm**: Corruption and forbidden powers
- **Void Between**: Mysterious spaces between realms

### Major Factions
- **Sects**: Traditional cultivation schools
- **Clans**: Bloodline-based power structures
- **Courts**: Political/social power centers
- **Secret Societies**: Hidden agendas, forbidden knowledge

### Cosmology
The Supreme World Tree connects all realms. Cultivators ascend through cultivation stages, breaking through mortal limitations to reach higher planes. Heaven responds to excessive power with tribulations.

---

## Cost Tracks: "Power Draws Blood"

Three accumulating penalties for optimization:

**Blood Track**: Physical strain from glass cannon builds, overexertion
**Fate Track**: Destiny debt from luck manipulation, reality-warping
**Stain Track**: Corruption from forbidden techniques, principle violations

**Thresholds**:
- 5 marks: Minor penalties
- 10 marks: Significant complications
- 15 marks: Major consequences
- 20+ marks: Campaign-defining events

Cost tracks can be reduced through narrative actions (redemption, sacrifices, spiritual cleansing).

---

*This is an abbreviated reference. For complete rules, see SRD Alpha Patches 0.1 and 0.2 in \`/docs/wuxiaxian-reference/\`*

**Next Patches**:
- **Patch 0.3**: Technique system, equipment, cultivation advancement
- **Patch 0.4**: Combat rules, non-combat rules
- **Patch 0.5**: GM guidelines, setting, appendices

**Playtest Note**: This is ALPHA content. Rules may change based on testing.`;

export default function SRDBook() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"rendered" | "raw">("rendered");

  const renderContent = () => {
    if (viewMode === "raw") {
      return <pre className="raw-content">{srdContent}</pre>;
    }

    // Simple markdown-like rendering
    return (
      <div className="rendered-content">
        {srdContent.split("\n").map((line, index) => {
          if (line.startsWith("# ")) {
            return <h1 key={index}>{line.substring(2)}</h1>;
          } else if (line.startsWith("## ")) {
            return <h2 key={index}>{line.substring(3)}</h2>;
          } else if (line.startsWith("### ")) {
            return <h3 key={index}>{line.substring(4)}</h3>;
          } else if (line.startsWith("- ")) {
            return <li key={index}>{line.substring(2)}</li>;
          } else if (line.trim() === "---") {
            return <hr key={index} />;
          } else if (line.trim() === "") {
            return <br key={index} />;
          } else if (line.startsWith("**") && line.includes("**")) {
            const parts = line.split("**");
            return (
              <p key={index}>
                {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
              </p>
            );
          } else if (line.startsWith("*") && line.endsWith("*")) {
            return (
              <p key={index} className="italic">
                {line.slice(1, -1)}
              </p>
            );
          } else {
            return <p key={index}>{line}</p>;
          }
        })}
      </div>
    );
  };

  return (
    <div className="srd-book">
      <header className="srd-header">
        <h1>System Reference Document</h1>
        <div className="srd-controls">
          <button
            className={viewMode === "rendered" ? "active" : ""}
            onClick={() => setViewMode("rendered")}
          >
            📖 Rendered
          </button>
          <button className={viewMode === "raw" ? "active" : ""} onClick={() => setViewMode("raw")}>
            📝 Raw Markdown
          </button>
        </div>
      </header>

      <div className="srd-content">{renderContent()}</div>

      <nav className="srd-navigation">
        <button onClick={() => navigate("/wiki")}>← Back to Wiki</button>
        <button onClick={() => navigate("/")}>🏠 Game Room</button>
      </nav>
    </div>
  );
}
