import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Full SRD content as a "book"
const srdContent = `# WuXuxian TTRPG - System Reference Document

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
- **Cultivation**: Refining your body, mind, and spirit to ascend
- **Soul Core**: The center of your power
- **Domain Source**: Your unique essence
- **Techniques**: Special abilities powered by Action Energy

---

## 2. Character Creation

### Step 1: Choose Your Concept
Think about what kind of cultivator you want to play. Are you a fiery berserker? A calculating ice mage? A steadfast defender?

### Step 2: Select Your Domain Source
Work with your GM to create or choose a Domain Source that fits your concept.

### Step 3: Determine Starting Stats
- **Total HP (THP)**: Usually 80-120 for starting characters
- **Action Energy (AE)**: Usually 15-25 max AE
- **Defense Rating (DR)**: Usually 0.2-0.4
- **Speed Band (SPD)**: Fast, Medium, or Slow

### Step 4: Choose Starting Techniques
Select 2-3 basic techniques that fit your Domain Source.

---

## 3. Cultivation System

Cultivation is the process of advancing through power stages:

**Stage 1: Qi Gathering** - Learn to sense qi
**Stage 2: Foundation Establishment** - Form your Soul Core
**Stage 3: Core Formation** - Solidify your power
**Stage 4: Nascent Soul** - Project your will
**Stage 5: Transcendence** - Achieve immortality

Advancement happens through role-play, completing milestones, and surviving tribulations.

---

## 4. Combat Mechanics

### 1-Beat Combat (Simple Mode)
1. PCs act (in any order)
2. Boss/NPCs act
3. Round ends, repeat

### 3-Stage Combat (Advanced Mode)
1. **Stage 1**: Fast actors use Quick Actions
2. **Stage 2**: All actors use Major Actions
3. **Stage 3**: Slow actors use Quick Actions

### Core Stats
- **THP**: Hit points
- **AE**: Action Energy for techniques
- **DR**: Defense Rating (damage reduction %)
- **Guard**: Temporary shield
- **Strain**: Penalty from blocking

### Damage Flow
1. Calculate base damage
2. Apply DR (damage × (1 - DR))
3. Subtract from Guard first
4. Excess damage goes to THP
5. Blocking builds Strain

---

## 5. Techniques

### Technique Structure
- **Name**: What it's called
- **Cost**: AE required
- **Effect**: What it does
- **Type**: Basic, Advanced, or Ultimate

### Technique Categories
- **Offensive**: Deal damage
- **Defensive**: Protect yourself
- **Support**: Help allies
- **Utility**: Special effects

### Using Techniques
1. Declare which technique you're using
2. Pay the AE cost
3. Resolve effects (damage, buffs, etc.)
4. Describe the narrative action

---

## 6. Setting & Lore

### The World
WuXuxian is a world where cultivation is everything. Sects compete for resources, ancient treasures lie hidden, and those who reach the highest stages can reshape reality itself.

### Major Factions
(To be detailed by your GM)

### Cosmology
Heaven, Earth, and the Mortal Realm exist in harmony. Cultivators seek to ascend from Earth to Heaven, breaking through mortal limitations.

---

*This is an abbreviated SRD. Full rules and setting details are available in the complete rulebook.*`;

export default function SRDBook() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');

  const renderContent = () => {
    if (viewMode === 'raw') {
      return <pre className="raw-content">{srdContent}</pre>;
    }

    // Simple markdown-like rendering
    return (
      <div className="rendered-content">
        {srdContent.split('\n').map((line, index) => {
          if (line.startsWith('# ')) {
            return <h1 key={index}>{line.substring(2)}</h1>;
          } else if (line.startsWith('## ')) {
            return <h2 key={index}>{line.substring(3)}</h2>;
          } else if (line.startsWith('### ')) {
            return <h3 key={index}>{line.substring(4)}</h3>;
          } else if (line.startsWith('- ')) {
            return <li key={index}>{line.substring(2)}</li>;
          } else if (line.trim() === '---') {
            return <hr key={index} />;
          } else if (line.trim() === '') {
            return <br key={index} />;
          } else if (line.startsWith('**') && line.includes('**')) {
            const parts = line.split('**');
            return (
              <p key={index}>
                {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
              </p>
            );
          } else if (line.startsWith('*') && line.endsWith('*')) {
            return <p key={index} className="italic">{line.slice(1, -1)}</p>;
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
            className={viewMode === 'rendered' ? 'active' : ''}
            onClick={() => setViewMode('rendered')}
          >
            📖 Rendered
          </button>
          <button
            className={viewMode === 'raw' ? 'active' : ''}
            onClick={() => setViewMode('raw')}
          >
            📝 Raw Markdown
          </button>
        </div>
      </header>

      <div className="srd-content">
        {renderContent()}
      </div>

      <nav className="srd-navigation">
        <button onClick={() => navigate('/wiki')}>← Back to Wiki</button>
        <button onClick={() => navigate('/')}>🏠 Game Room</button>
      </nav>
    </div>
  );
}
