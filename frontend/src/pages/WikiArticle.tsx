import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Sample article content - in production, this would come from a CMS or markdown files
const articleData: Record<string, { title: string; content: string; relatedArticles: string[] }> = {
  "cultivation-basics": {
    title: "Cultivation Basics",
    content: `# Cultivation Basics

## What is Cultivation?

Cultivation is the process of refining your body, mind, and spirit to ascend beyond mortal limitations. Through diligent practice, you absorb and refine qi (vital energy) from the world around you, strengthening your Soul Core and advancing through cultivation stages.

## Key Concepts

### Soul Core
Your Soul Core is the center of your cultivation. It stores refined qi and determines your abilities. Each cultivator's Soul Core is unique, reflecting their Domain Source and personal dao (path).

### Domain Source
Your Domain Source is the fundamental concept or element you manipulate. Examples include:
- **Eternal Flame**: Fire and vitality
- **Frozen Void**: Ice and stillness
- **Thunder Sovereign**: Lightning and power
- **Mountain Heart**: Earth and endurance

### Cultivation Stages
1. **Qi Gathering**: Learn to sense and absorb qi
2. **Foundation Establishment**: Form your Soul Core
3. **Core Formation**: Solidify your cultivation base
4. **Nascent Soul**: Project your will into the world
5. **Transcendence**: Break through mortal limits

## How to Cultivate

During gameplay, cultivation happens through:
- Completing challenges and overcoming tribulations
- Studying techniques and insights
- Meditating on your dao
- Surviving combat and learning from defeat

Each milestone brings you closer to the next cultivation stage.`,
    relatedArticles: ["soul-core", "cultivation-stages", "domain-source"],
  },
  "soul-core": {
    title: "Soul Core System",
    content: `# Soul Core System

## Overview

Your Soul Core is the manifestation of your cultivation path. It defines your unique abilities, techniques, and how you interact with qi.

## Core Components

### Core Type
Each Soul Core has a type that determines its fundamental nature:
- **Elemental**: Mastery of a natural element
- **Conceptual**: Control over abstract concepts
- **Martial**: Perfect martial technique
- **Spirit**: Connection to spiritual entities

### Core Abilities
Your Soul Core grants you special abilities:
- **Passive Effects**: Always-active bonuses
- **Active Techniques**: Qi-powered attacks and skills
- **Ultimate Technique**: Your most powerful ability

### Core Advancement
As you cultivate, your Soul Core grows stronger:
1. Unlock new abilities at each cultivation stage
2. Improve existing techniques through practice
3. Discover hidden aspects of your Domain Source

## Using Your Soul Core

In combat, you spend **Action Energy (AE)** to activate Soul Core techniques. Plan carefully—powerful techniques cost more AE!`,
    relatedArticles: ["cultivation-basics", "techniques", "action-economy"],
  },
  "combat-system": {
    title: "Combat System",
    content: `# Combat System

## Turn Structure

Combat uses a turn-based system with two modes:

### 1-Beat Mode (Simple)
- PCs act (in any order)
- Boss/NPCs act
- Repeat each round

### 3-Stage Mode (Advanced)
- **Stage 1**: Fast actors perform Quick Actions
- **Stage 2**: All actors perform Major Actions
- **Stage 3**: Slow actors perform Quick Actions

## Core Stats

### Total HP (THP)
Your life total. Reduced to 0 = defeated.

### Action Energy (AE)
Spend AE to use techniques. Regenerates each round.

### Defense Rating (DR)
Percentage of damage reduced. Example: DR 0.3 = reduce damage by 30%.

### Guard
Temporary shield that absorbs damage before HP.

### Strain
Builds up from blocking attacks. High Strain reduces effectiveness.

## Actions

### Major Actions
- Attack with a technique
- Use a special ability
- Defend (gain Guard)

### Quick Actions (3-Stage Mode only)
- Guard Shift: +Guard
- Dodge: +DR temporarily
- Brace: +Guard and +DR
- AE Pulse: +AE
- Strain Vent: -Strain
- Stance Switch: Change DR
- Counter Prep: Ready a counter-attack`,
    relatedArticles: ["quick-actions", "techniques", "action-economy"],
  },
  "quick-actions": {
    title: "Quick Actions",
    content: `# Quick Actions

Quick Actions are special moves available in 3-Stage Combat Mode. They're fast, low-cost actions that can turn the tide of battle.

## Available Quick Actions

### Guard Shift
- **Effect**: Increase Guard value
- **Use When**: Expecting a big attack

### Dodge
- **Effect**: Temporarily boost DR
- **Use When**: Need to avoid damage for one round

### Brace
- **Effect**: Increase both Guard and DR
- **Use When**: Preparing for sustained assault

### AE Pulse
- **Effect**: Gain extra AE
- **Use When**: Need energy for a big technique

### Strain Vent
- **Effect**: Reduce accumulated Strain
- **Use When**: Strain is getting too high

### Stance Switch
- **Effect**: Adjust DR (offensive/defensive)
- **Use When**: Adapting to combat situation

### Counter Prep
- **Effect**: Prepare for counter-attacks
- **Use When**: Anticipating enemy technique

## Timing

Quick Actions occur in Stage 1 (Fast actors) and Stage 3 (Slow actors) of 3-Stage Combat. Plan your SPD band to match your strategy!`,
    relatedArticles: ["combat-system", "action-economy"],
  },
  "techniques": {
    title: "Techniques Guide",
    content: `# Techniques Guide

## What are Techniques?

Techniques are special abilities powered by your Soul Core. They consume Action Energy (AE) and can deal damage, provide buffs, or create unique effects.

## Technique Types

### Basic Techniques
- Low AE cost (3-5)
- Reliable damage or utility
- Usable frequently

### Advanced Techniques
- Medium AE cost (8-12)
- Higher damage or stronger effects
- Require strategic timing

### Ultimate Techniques
- High AE cost (15+)
- Game-changing effects
- Use sparingly for maximum impact

### Innate Techniques
- Unique to your Soul Core
- Reflect your Domain Source
- Often have special conditions

## Learning Techniques

1. **Character Creation**: Start with 1-2 basic techniques
2. **Cultivation**: Unlock new techniques as you advance
3. **Training**: Learn from masters or study scrolls
4. **Discovery**: Develop new techniques through play

## Using Techniques Effectively

- Match technique to situation
- Manage your AE carefully
- Combo techniques for synergy
- Consider enemy weaknesses`,
    relatedArticles: ["soul-core", "action-economy", "combat-system"],
  },
  "domain-source": {
    title: "Domain Sources",
    content: `# Domain Sources

## What is a Domain Source?

Your Domain Source is the fundamental essence you manipulate as a cultivator. It's not just an element or concept—it's a piece of universal truth that resonates with your soul.

## Example Domain Sources

### Eternal Flame
Fire and vitality. Burns with life itself. Techniques focus on damage over time and regeneration.

### Frozen Void
Ice and stillness. The cold between stars. Techniques focus on control and slowing enemies.

### Thunder Sovereign
Lightning and dominance. Pure destructive force. Techniques focus on burst damage and speed.

### Mountain Heart
Earth and endurance. Immovable stability. Techniques focus on defense and persistence.

### Shadow Whisper
Darkness and secrets. Hidden knowledge. Techniques focus on deception and debuffs.

## Creating Your Domain Source

Work with your GM to create a Domain Source that fits your character concept. Consider:
- **Element/Concept**: What do you manipulate?
- **Philosophy**: What does it represent?
- **Manifestation**: How does it appear?
- **Strengths**: What is it good at?
- **Weaknesses**: What are its limitations?

## Domain Source Techniques

Your Domain Source determines your **Source Sequence Technique**—your ultimate ability that embodies your cultivation path.`,
    relatedArticles: ["cultivation-basics", "soul-core", "techniques"],
  },
  "cultivation-stages": {
    title: "Cultivation Stages",
    content: `# Cultivation Stages

## The Path of Cultivation

Cultivation is divided into major stages, each representing a fundamental transformation.

## Stage 1: Qi Gathering
**Mortal → Cultivator**
- Learn to sense qi in the world
- Practice basic qi circulation
- Build foundation for future growth
- Most new cultivators are here

## Stage 2: Foundation Establishment
**Cultivator → Adept**
- Form your Soul Core
- Choose your Domain Source
- Lock in your cultivation path
- Gain first true techniques

## Stage 3: Core Formation
**Adept → Expert**
- Solidify and refine your Soul Core
- Advanced techniques become available
- Project qi externally
- Recognized as a true master

## Stage 4: Nascent Soul
**Expert → Grandmaster**
- Soul Core gains semi-autonomy
- Can survive fatal wounds (once)
- Domain Source fully manifests
- Techniques reach incredible power

## Stage 5: Transcendence
**Grandmaster → Immortal**
- Break through mortal limitations
- Reshape reality with your will
- Achieve true immortality
- Few ever reach this stage

## Advancement

Progress between stages by:
- Accumulating insights and breakthroughs
- Surviving tribulations
- Completing cultivation milestones
- Role-playing your character's growth`,
    relatedArticles: ["cultivation-basics", "soul-core"],
  },
};

export default function WikiArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<(typeof articleData)[string] | null>(null);

  useEffect(() => {
    if (id && articleData[id]) {
      setArticle(articleData[id]);
    } else {
      setArticle(null);
    }
  }, [id]);

  if (!article) {
    return (
      <div className="wiki-article error">
        <h1>Article Not Found</h1>
        <p>The article "{id}" does not exist.</p>
        <button onClick={() => navigate("/wiki")}>← Back to Wiki</button>
      </div>
    );
  }

  return (
    <div className="wiki-article">
      <header className="article-header">
        <button className="back-button" onClick={() => navigate("/wiki")}>
          ← Wiki Index
        </button>
        <h1>{article.title}</h1>
      </header>

      <div className="article-content">
        {/* Simple markdown-like rendering */}
        {article.content.split("\n").map((line, index) => {
          if (line.startsWith("# ")) {
            return <h1 key={index}>{line.substring(2)}</h1>;
          } else if (line.startsWith("## ")) {
            return <h2 key={index}>{line.substring(3)}</h2>;
          } else if (line.startsWith("### ")) {
            return <h3 key={index}>{line.substring(4)}</h3>;
          } else if (line.startsWith("- ")) {
            return <li key={index}>{line.substring(2)}</li>;
          } else if (line.match(/^\d+\. /)) {
            return <li key={index}>{line.substring(line.indexOf(" ") + 1)}</li>;
          } else if (line.trim() === "") {
            return <br key={index} />;
          } else if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <p key={index}>
                <strong>{line.slice(2, -2)}</strong>
              </p>
            );
          } else {
            return <p key={index}>{line}</p>;
          }
        })}
      </div>

      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <section className="related-articles">
          <h2>See Also</h2>
          <ul>
            {article.relatedArticles.map((relatedId) => (
              <li key={relatedId}>
                <button onClick={() => navigate(`/wiki/${relatedId}`)}>
                  {articleData[relatedId]?.title || relatedId}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="article-navigation">
        <button onClick={() => navigate("/wiki")}>← Back to Wiki</button>
        <button onClick={() => navigate("/help")}>🔍 Search</button>
      </nav>
    </div>
  );
}
