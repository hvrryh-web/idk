# Actionable Improvements for Wuxiaxian TTRPG Alpha

This document provides concrete, immediately actionable improvements prioritized by impact and organized by system area.

## Priority 1: Data Model Enhancements (Foundation)

### 1.1 Expand Character Model with Full Stat System

**What to Change:**
Add fields to `backend/app/models/characters.py` for the complete Wuxiaxian stat system.

**Why It Helps:**
- Enables SCL-based cap enforcement
- Supports cultivation progression mechanics
- Aligns with design intent for derived stats
- Allows proper Sequence band labeling

**Files to Touch:**
- `backend/app/models/characters.py` - Add stat fields
- `backend/schema.sql` - Update DDL
- `backend/app/api/routes/characters.py` - Update Pydantic schemas
- `frontend/src/types.ts` - Update Character interface

**Concrete Changes:**

```python
# backend/app/models/characters.py

class Character(Base):
    # ... existing fields ...
    
    # PRIMARY STATS (9 stats, range -1 to +11)
    # Soul Cluster
    essence = Column(Integer, nullable=True, default=0)
    resolve = Column(Integer, nullable=True, default=0)
    presence = Column(Integer, nullable=True, default=0)
    
    # Body Cluster
    strength = Column(Integer, nullable=True, default=0)
    endurance = Column(Integer, nullable=True, default=0)
    agility = Column(Integer, nullable=True, default=0)
    
    # Mind Cluster
    technique = Column(Integer, nullable=True, default=0)
    willpower = Column(Integer, nullable=True, default=0)
    focus = Column(Integer, nullable=True, default=0)
    
    # AETHER STATS (3 stats)
    control = Column(Integer, nullable=True, default=0)
    fate = Column(Integer, nullable=True, default=0)
    spirit = Column(Integer, nullable=True, default=0)
    
    # DERIVED STATS (calculated properties)
    @property
    def body_core(self) -> int:
        """Body Core = round((Strength + Endurance + Agility) / 3)"""
        return round((self.strength + self.endurance + self.agility) / 3)
    
    @property
    def mind_core(self) -> int:
        """Mind Core = round((Technique + Willpower + Focus) / 3)"""
        return round((self.technique + self.willpower + self.focus) / 3)
    
    @property
    def soul_core(self) -> int:
        """Soul Core = round((Essence + Resolve + Presence) / 3)"""
        return round((self.essence + self.resolve + self.presence) / 3)
    
    @property
    def core_level(self) -> int:
        """Core Level (CL) = floor((Body + Mind + Soul Core) / 3)"""
        return (self.body_core + self.mind_core + self.soul_core) // 3
    
    @property
    def soul_level(self) -> int:
        """Soul Level (SL) = floor((Control + Fate + Spirit) / 3)"""
        return (self.control + self.fate + self.spirit) // 3
    
    @property
    def scl(self) -> int:
        """Soul Core Level (SCL) = CL + SL"""
        return self.core_level + self.soul_level
    
    @property
    def sequence_band(self) -> str:
        """Return Sequence band label based on SCL"""
        if self.scl <= 2:
            return "Cursed-Sequence"
        elif self.scl <= 4:
            return "Low-Sequence"
        elif self.scl <= 7:
            return "Mid-Sequence"
        elif self.scl <= 10:
            return "High-Sequence"
        else:
            return "Transcendent"
```

**Migration SQL** (add to `backend/schema.sql` or create migration):

```sql
-- Add Primary Stats columns
ALTER TABLE characters ADD COLUMN essence INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN resolve INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN presence INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN strength INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN endurance INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN agility INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN technique INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN willpower INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN focus INTEGER DEFAULT 0;

-- Add Aether Stats columns
ALTER TABLE characters ADD COLUMN control INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN fate INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN spirit INTEGER DEFAULT 0;
```

**Estimated Impact:** High - Foundation for all other improvements
**Estimated Effort:** 2-3 hours
**Risk:** Low - Additive changes, backward compatible

---

### 1.2 Add Condition Tracking to Character Model

**What to Change:**
Add condition tracks to Character and CombatantState models.

**Why It Helps:**
- Supports condition ladder mechanics from design docs
- Enables progressive degradation in combat
- Allows narrative consequences of conditions
- Required for three-pillar conflict system

**Files to Touch:**
- `backend/app/models/characters.py`
- `backend/app/simulation/combat_state.py`
- `backend/schema.sql`

**Concrete Changes:**

```python
# backend/app/models/characters.py

class ConditionType(str, enum.Enum):
    # Violence conditions
    wounded = "wounded"
    crippled = "crippled"
    downed = "downed"
    ruined_body = "ruined_body"
    
    # Influence conditions
    shaken = "shaken"
    compromised = "compromised"
    subjugated = "subjugated"
    
    # Revelation conditions
    disturbed = "disturbed"
    fractured = "fractured"
    unhinged = "unhinged"
    
    # Shared 4th degree
    shattered_broken = "shattered_broken"

class Character(Base):
    # ... existing fields ...
    
    # Condition tracking (JSON arrays)
    violence_conditions = Column(JSON, nullable=True, default=list)
    influence_conditions = Column(JSON, nullable=True, default=list)
    revelation_conditions = Column(JSON, nullable=True, default=list)
    
    def add_condition(self, pillar: str, condition: ConditionType):
        """Add a condition to the appropriate track"""
        if pillar == "violence":
            if self.violence_conditions is None:
                self.violence_conditions = []
            if condition.value not in self.violence_conditions:
                self.violence_conditions.append(condition.value)
        # Similar for influence and revelation
    
    def get_condition_degree(self, pillar: str) -> int:
        """Get highest condition degree (1-4) for a pillar"""
        conditions_map = {
            "violence": self.violence_conditions or [],
            "influence": self.influence_conditions or [],
            "revelation": self.revelation_conditions or []
        }
        conditions = conditions_map.get(pillar, [])
        
        # Map to degrees
        degree_map = {
            "wounded": 1, "shaken": 1, "disturbed": 1,
            "crippled": 2, "compromised": 2, "fractured": 2,
            "downed": 3, "subjugated": 3, "unhinged": 3,
            "ruined_body": 4, "shattered_broken": 4
        }
        
        max_degree = 0
        for cond in conditions:
            degree = degree_map.get(cond, 0)
            if degree > max_degree:
                max_degree = degree
        return max_degree
```

**Estimated Impact:** High - Enables condition system
**Estimated Effort:** 1-2 hours
**Risk:** Low - New fields, no breaking changes

---

### 1.3 Add Cost Tracks to Character Model

**What to Change:**
Implement Blood, Fate, and Stain cost tracks.

**Why It Helps:**
- Enforces "Power Draws Blood" design pillar
- Creates mechanical consequences for optimization
- Adds narrative depth to power usage
- Supports glass cannon vs tank trade-offs

**Files to Touch:**
- `backend/app/models/characters.py`
- `backend/schema.sql`

**Concrete Changes:**

```python
# backend/app/models/characters.py

class Character(Base):
    # ... existing fields ...
    
    # Cost tracks (0-10 scale)
    blood_track = Column(Integer, nullable=True, default=0)
    fate_track = Column(Integer, nullable=True, default=0)
    stain_track = Column(Integer, nullable=True, default=0)
    
    def mark_blood(self, amount: int = 1):
        """Mark Blood track (physical strain)"""
        self.blood_track = min(10, self.blood_track + amount)
        if self.blood_track >= 3:
            # Auto-apply Wounded condition at threshold
            self.add_condition("violence", ConditionType.wounded)
    
    def mark_fate(self, amount: int = 1):
        """Mark Fate track (destiny debt)"""
        self.fate_track = min(10, self.fate_track + amount)
    
    def mark_stain(self, amount: int = 1):
        """Mark Stain track (corruption)"""
        self.stain_track = min(10, self.stain_track + amount)
    
    def clear_cost_track(self, track: str, amount: int = 1):
        """Clear marks from a cost track (requires narrative action)"""
        if track == "blood":
            self.blood_track = max(0, self.blood_track - amount)
        elif track == "fate":
            self.fate_track = max(0, self.fate_track - amount)
        elif track == "stain":
            self.stain_track = max(0, self.stain_track - amount)
```

**SQL Migration:**

```sql
ALTER TABLE characters ADD COLUMN blood_track INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN fate_track INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN stain_track INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN violence_conditions JSON DEFAULT '[]';
ALTER TABLE characters ADD COLUMN influence_conditions JSON DEFAULT '[]';
ALTER TABLE characters ADD COLUMN revelation_conditions JSON DEFAULT '[]';
```

**Estimated Impact:** Medium-High - Key design pillar
**Estimated Effort:** 1 hour
**Risk:** Low - Additive only

---

## Priority 2: Combat Engine Refactoring (Data-Driven)

### 2.1 Refactor Technique System for Attack/Effect Separation

**What to Change:**
Split `base_damage` into `attack_bonus` and `effect_rank`, add conflict type.

**Why It Helps:**
- Matches M&M-style accuracy vs power trade-offs
- Supports SCL-based cap enforcement (Attack + Effect ≤ 2 × SCL)
- Enables hit chance calculations
- Allows separate tuning of to-hit and damage

**Files to Touch:**
- `backend/app/models/techniques.py`
- `backend/app/simulation/engine.py`
- `backend/schema.sql`

**Concrete Changes:**

```python
# backend/app/models/techniques.py

class ConflictType(str, enum.Enum):
    violence = "violence"
    influence = "influence"
    revelation = "revelation"

class Technique(Base):
    # ... existing fields ...
    
    # OLD: base_damage = Column(Integer, nullable=True)
    # NEW: Separate attack and effect
    attack_bonus = Column(Integer, nullable=True, default=0)
    effect_rank = Column(Integer, nullable=True, default=0)
    
    conflict_type = Column(
        Enum(ConflictType, name="conflict_type"),
        nullable=False,
        default=ConflictType.violence
    )
    
    # SCL requirement
    min_scl = Column(Integer, nullable=True, default=1)
    
    def validate_against_scl(self, character_scl: int) -> bool:
        """Check if technique meets SCL caps"""
        if self.min_scl > character_scl:
            return False
        
        # Attack + Effect ≤ 2 × SCL
        if self.attack_bonus + self.effect_rank > 2 * character_scl:
            return False
        
        # Each individually ≤ SCL + 2
        if self.attack_bonus > character_scl + 2:
            return False
        if self.effect_rank > character_scl + 2:
            return False
        
        return True
    
    def calculate_damage(self) -> int:
        """Base damage from effect rank (rough conversion)"""
        # Effect rank → damage mapping (design this based on playtesting)
        return self.effect_rank * 5  # Placeholder: 1 rank = 5 damage
```

**Migration:**

```sql
ALTER TABLE techniques ADD COLUMN attack_bonus INTEGER DEFAULT 0;
ALTER TABLE techniques ADD COLUMN effect_rank INTEGER DEFAULT 0;
ALTER TABLE techniques ADD COLUMN conflict_type VARCHAR(20) DEFAULT 'violence';
ALTER TABLE techniques ADD COLUMN min_scl INTEGER DEFAULT 1;

-- Migrate existing techniques: split base_damage
-- This is approximate; adjust based on your balance targets
UPDATE techniques
SET attack_bonus = FLOOR(base_damage / 5),
    effect_rank = FLOOR(base_damage / 5)
WHERE base_damage IS NOT NULL;
```

**Estimated Impact:** High - Core combat mechanic alignment
**Estimated Effort:** 2-3 hours
**Risk:** Medium - Requires data migration and combat rebalancing

---

### 2.2 Extract Reusable Combat Functions from Simulation Engine

**What to Change:**
Refactor `backend/app/simulation/engine.py` to separate:
- Combat initialization
- Single turn execution
- Action resolution
- State updates

**Why It Helps:**
- Enables player-controlled combat (not just Monte Carlo)
- Makes combat logic testable in isolation
- Reduces code duplication
- Supports multiple combat modes (player, AI, simulation)

**Files to Touch:**
- `backend/app/simulation/engine.py` - Refactor
- Create `backend/app/simulation/combat_actions.py` - NEW FILE
- Create `backend/app/simulation/player_combat.py` - NEW FILE

**Concrete Changes:**

```python
# backend/app/simulation/combat_actions.py (NEW)

from typing import Dict, Optional
from app.simulation.combat_state import CombatState, CombatantState
from app.models.techniques import Technique

def execute_technique(
    combat_state: CombatState,
    attacker: CombatantState,
    technique: Technique,
    target: CombatantState
) -> Dict[str, any]:
    """
    Execute a technique attack.
    
    Returns:
        {
            "hit": bool,
            "damage": int,
            "conditions_applied": List[str],
            "attacker_strain": int,
            "target_state": CombatantState
        }
    """
    # Check AE cost
    if attacker.ae < technique.ae_cost:
        return {"hit": False, "reason": "Insufficient AE"}
    
    # Apply AE cost
    attacker.apply_ae_cost(technique.ae_cost)
    
    # Apply self-strain
    attacker.apply_strain(technique.self_strain)
    
    # Calculate hit: d20 + attack_bonus vs 10 + target defense
    # (Simplified; implement full defense system later)
    import random
    roll = random.randint(1, 20)
    to_hit = roll + technique.attack_bonus
    defense = 10 + target.get_defense_for_conflict(technique.conflict_type)
    
    hit = to_hit >= defense
    
    if not hit:
        return {
            "hit": False,
            "roll": roll,
            "to_hit": to_hit,
            "defense": defense
        }
    
    # Calculate damage
    base_damage = technique.calculate_damage()
    
    # Apply DR
    effective_dr = target.get_effective_dr()
    reduced_damage = int(base_damage * (1 - effective_dr))
    
    # Apply damage based on routing
    actual_damage = target.apply_damage(reduced_damage, technique.damage_routing)
    
    # Track damage dealt
    combat_state.record_damage(attacker.id, actual_damage)
    
    # Apply conditions based on degrees of success
    degrees = (to_hit - defense) // 5  # Every 5 points = 1 degree
    conditions_applied = apply_conditions_for_degrees(
        target,
        technique.conflict_type,
        degrees
    )
    
    return {
        "hit": True,
        "roll": roll,
        "to_hit": to_hit,
        "defense": defense,
        "damage": actual_damage,
        "conditions_applied": conditions_applied,
        "attacker_strain": attacker.strain,
        "target_state": target
    }

def apply_conditions_for_degrees(
    target: CombatantState,
    conflict_type: str,
    degrees: int
) -> List[str]:
    """Apply conditions based on degrees of success"""
    if degrees < 1:
        return []
    
    condition_ladders = {
        "violence": ["wounded", "crippled", "downed", "ruined_body"],
        "influence": ["shaken", "compromised", "subjugated", "shattered_broken"],
        "revelation": ["disturbed", "fractured", "unhinged", "shattered_broken"]
    }
    
    ladder = condition_ladders.get(conflict_type, [])
    applied = []
    
    for i in range(min(degrees, len(ladder))):
        condition = ladder[i]
        # Apply condition logic here
        applied.append(condition)
    
    return applied
```

**Estimated Impact:** High - Enables player combat UI
**Estimated Effort:** 3-4 hours
**Risk:** Medium - Refactoring, needs thorough testing

---

### 2.3 Make Quick Action Selection Data-Driven

**What to Change:**
Move quick action definitions from code to data structure.

**Why It Helps:**
- Easier to add new quick actions
- Supports UI generation from data
- Enables balancing without code changes
- Better testability

**Files to Touch:**
- Create `backend/app/data/quick_actions.json` - NEW FILE
- Modify `backend/app/simulation/quick_actions.py`

**Concrete Changes:**

```json
// backend/app/data/quick_actions.json (NEW)
{
  "quick_actions": [
    {
      "id": "guard_shift",
      "name": "Guard Shift",
      "icon": "🛡️",
      "description": "Increase Guard value by SCL/2",
      "effect": {
        "type": "modify_stat",
        "stat": "guard",
        "formula": "scl / 2"
      },
      "condition": "guard < max_guard"
    },
    {
      "id": "dodge",
      "name": "Dodge",
      "icon": "⚡",
      "description": "Temporarily boost DR by 10%",
      "effect": {
        "type": "temp_modifier",
        "stat": "dr",
        "value": 0.1,
        "duration": "next_hit"
      }
    },
    {
      "id": "ae_pulse",
      "name": "AE Pulse",
      "icon": "💫",
      "description": "Gain extra AE equal to AE_reg",
      "effect": {
        "type": "modify_stat",
        "stat": "ae",
        "formula": "ae_reg"
      },
      "cost": {
        "type": "strain",
        "value": 1
      }
    }
    // ... more quick actions
  ]
}
```

```python
# backend/app/simulation/quick_actions.py (refactored)

import json
from pathlib import Path
from typing import Dict, List

# Load quick actions from JSON
QUICK_ACTIONS_PATH = Path(__file__).parent.parent / "data" / "quick_actions.json"
with open(QUICK_ACTIONS_PATH) as f:
    QUICK_ACTIONS_DATA = json.load(f)["quick_actions"]

def get_available_quick_actions(combatant: CombatantState) -> List[Dict]:
    """Return list of available quick actions for this combatant"""
    available = []
    
    for action_data in QUICK_ACTIONS_DATA:
        # Check condition
        if "condition" in action_data:
            condition = action_data["condition"]
            # Evaluate condition (simple eval or parse)
            # For safety, use a whitelist of allowed operations
            if not eval_safe_condition(condition, combatant):
                continue
        
        available.append(action_data)
    
    return available

def execute_quick_action(
    combatant: CombatantState,
    action_id: str
) -> Dict[str, any]:
    """Execute a quick action and return the result"""
    action_data = next(
        (a for a in QUICK_ACTIONS_DATA if a["id"] == action_id),
        None
    )
    
    if not action_data:
        return {"success": False, "error": "Unknown action"}
    
    effect = action_data["effect"]
    effect_type = effect["type"]
    
    if effect_type == "modify_stat":
        stat = effect["stat"]
        formula = effect["formula"]
        value = eval_safe_formula(formula, combatant)
        
        if stat == "guard":
            combatant.guard += value
        elif stat == "ae":
            combatant.ae = min(combatant.max_ae, combatant.ae + value)
        # ... etc
        
        return {"success": True, "stat": stat, "value": value}
    
    # Handle other effect types...
```

**Estimated Impact:** Medium - Improves extensibility
**Estimated Effort:** 2-3 hours
**Risk:** Low - Additive, doesn't break existing code

---

## Priority 3: Terminology Alignment

### 3.1 Rename "level" to "scl" Throughout Codebase

**What to Change:**
Replace generic "level" with "scl" (Soul Core Level).

**Why It Helps:**
- Aligns with design document terminology
- Communicates Wuxiaxian flavor
- Avoids confusion with other level concepts
- Makes code self-documenting

**Files to Touch:**
- `backend/app/models/characters.py`
- `frontend/src/types.ts`
- All UI components displaying level
- Database schema

**Concrete Changes:**

```python
# backend/app/models/characters.py
# BEFORE:
# level = Column(Integer, nullable=True)

# AFTER:
scl = Column(Integer, nullable=True)  # Soul Core Level

# Add migration:
# ALTER TABLE characters RENAME COLUMN level TO scl;
```

```typescript
// frontend/src/types.ts
// BEFORE:
// level?: number;

// AFTER:
scl?: number;  // Soul Core Level
sequence_band?: string;  // "Cursed-Sequence", "Low-Sequence", etc.
```

**Estimated Impact:** Low - Cosmetic but important for design fidelity
**Estimated Effort:** 1 hour (find-and-replace + testing)
**Risk:** Low - Straightforward rename

---

### 3.2 Add Wuxiaxian Glossary to Frontend

**What to Change:**
Create a glossary/help system explaining Wuxiaxian terms.

**Why It Helps:**
- Helps players understand cultivation concepts
- Makes UI more accessible
- Reduces onboarding friction
- Enhances worldbuilding

**Files to Touch:**
- Create `frontend/src/data/glossary.json` - NEW
- Modify `frontend/src/pages/HelpPage.tsx`
- Create `frontend/src/components/GlossaryTooltip.tsx` - NEW

**Concrete Changes:**

```json
// frontend/src/data/glossary.json
{
  "terms": [
    {
      "term": "SCL",
      "full_name": "Soul Core Level",
      "definition": "Your cultivation refinement level. SCL = Core Level + Soul Level. Determines your caps on combat abilities.",
      "example": "A character with SCL 8 can have Attack + Power up to 16."
    },
    {
      "term": "Sequence",
      "full_name": "AetherCore Sequence",
      "definition": "Your position in the cultivation hierarchy. Ranges from Cursed-Sequence (1-2) to Transcendent (11+).",
      "example": "Mid-Sequence (5-7) characters are professional-level threats."
    },
    {
      "term": "AE",
      "full_name": "Action Energy",
      "definition": "Resource for using techniques. Regenerates each round based on AE_reg.",
      "example": "A technique costing 8 AE requires you to have at least 8 AE available."
    },
    {
      "term": "Strain",
      "full_name": "Strain",
      "definition": "Accumulates from overexertion. High strain can lead to exhaustion or death.",
      "example": "Using powerful techniques may inflict self-strain as a cost."
    },
    {
      "term": "Blood Track",
      "full_name": "Blood Cost Track",
      "definition": "Physical toll of power usage. Mark when using Blood-Forward combat profiles. High marks cause Wounded condition.",
      "example": "Glass cannon builds mark Blood when exceeding standard SCL caps."
    }
  ]
}
```

**Estimated Impact:** Low - Quality of life
**Estimated Effort:** 1-2 hours
**Risk:** None

---

## Priority 4: UI/UX Improvements

### 4.1 Create Character Sheet Page with Full Stats

**What to Change:**
Expand ProfileSheet to show all 12 stats + derived values.

**Why It Helps:**
- Players can see their full character build
- Visualization of Core/Aether stat structure
- Shows SCL calculation transparently
- Foundation for character builder

**Files to Touch:**
- `frontend/src/pages/ProfileSheet.tsx`
- `frontend/src/components/StatDisplay.tsx` - NEW

**Concrete Changes:**

```typescript
// frontend/src/components/StatDisplay.tsx (NEW)

interface StatDisplayProps {
  character: Character;
}

export default function StatDisplay({ character }: StatDisplayProps) {
  return (
    <div className="stat-display">
      <h2>Character Stats</h2>
      
      <div className="stat-section">
        <h3>Soul Cluster</h3>
        <div className="stat-row">
          <span>Essence:</span> <span>{character.essence}</span>
        </div>
        <div className="stat-row">
          <span>Resolve:</span> <span>{character.resolve}</span>
        </div>
        <div className="stat-row">
          <span>Presence:</span> <span>{character.presence}</span>
        </div>
        <div className="derived-stat">
          <strong>Soul Core:</strong> {character.soul_core}
        </div>
      </div>

      <div className="stat-section">
        <h3>Body Cluster</h3>
        <div className="stat-row">
          <span>Strength:</span> <span>{character.strength}</span>
        </div>
        <div className="stat-row">
          <span>Endurance:</span> <span>{character.endurance}</span>
        </div>
        <div className="stat-row">
          <span>Agility:</span> <span>{character.agility}</span>
        </div>
        <div className="derived-stat">
          <strong>Body Core:</strong> {character.body_core}
        </div>
      </div>

      <div className="stat-section">
        <h3>Mind Cluster</h3>
        <div className="stat-row">
          <span>Technique:</span> <span>{character.technique}</span>
        </div>
        <div className="stat-row">
          <span>Willpower:</span> <span>{character.willpower}</span>
        </div>
        <div className="stat-row">
          <span>Focus:</span> <span>{character.focus}</span>
        </div>
        <div className="derived-stat">
          <strong>Mind Core:</strong> {character.mind_core}
        </div>
      </div>

      <div className="stat-section">
        <h3>Aether Stats</h3>
        <div className="stat-row">
          <span>Control:</span> <span>{character.control}</span>
        </div>
        <div className="stat-row">
          <span>Fate:</span> <span>{character.fate}</span>
        </div>
        <div className="stat-row">
          <span>Spirit:</span> <span>{character.spirit}</span>
        </div>
      </div>

      <div className="cultivation-summary">
        <h3>Cultivation Level</h3>
        <div className="scl-breakdown">
          <div>Core Level (CL): {character.core_level}</div>
          <div>Soul Level (SL): {character.soul_level}</div>
          <div className="total-scl">
            <strong>Soul Core Level (SCL): {character.scl}</strong>
          </div>
          <div className="sequence-badge">
            {character.sequence_band}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Estimated Impact:** Medium - Better player experience
**Estimated Effort:** 2-3 hours
**Risk:** None

---

### 4.2 Add Condition Display to Combat UI

**What to Change:**
Show condition badges with tooltips explaining effects.

**Why It Helps:**
- Players understand their status
- Conditions become mechanically visible
- Supports tactical decision-making
- Visualizes progressive degradation

**Files to Touch:**
- Create `frontend/src/components/combat/ConditionBadge.tsx` - NEW
- Modify `frontend/src/components/combat/CombatantCard.tsx`

**Concrete Changes:**

```typescript
// frontend/src/components/combat/ConditionBadge.tsx

interface ConditionBadgeProps {
  condition: string;
  pillar: "violence" | "influence" | "revelation";
}

const CONDITION_DATA = {
  wounded: {
    label: "Wounded",
    degree: 1,
    effect: "-2 to Body actions",
    color: "#ff6b6b"
  },
  crippled: {
    label: "Crippled",
    degree: 2,
    effect: "Wounded penalties + Hindered",
    color: "#ee5a52"
  },
  downed: {
    label: "Downed",
    degree: 3,
    effect: "Taken out for the scene",
    color: "#cc4b3c"
  },
  // ... more conditions
};

export default function ConditionBadge({ condition, pillar }: ConditionBadgeProps) {
  const data = CONDITION_DATA[condition] || { label: condition, color: "#999" };
  
  return (
    <div
      className="condition-badge"
      style={{ backgroundColor: data.color }}
      title={`${data.label} (Degree ${data.degree}): ${data.effect}`}
    >
      {data.label}
    </div>
  );
}
```

**Estimated Impact:** Medium - Improves combat clarity
**Estimated Effort:** 1-2 hours
**Risk:** None

---

## Priority 5: Testing & Documentation

### 5.1 Add Unit Tests for Derived Stats

**What to Change:**
Test SCL calculation, Core Stats, Sequence bands.

**Why It Helps:**
- Ensures derived stats work correctly
- Catches regressions when formulas change
- Documents expected behavior
- Builds confidence in foundation

**Files to Touch:**
- Create `backend/tests/test_stats_calculations.py` - NEW

**Concrete Changes:**

```python
# backend/tests/test_stats_calculations.py

import pytest
from app.models.characters import Character

def test_core_stat_calculations():
    """Test that Core stats are calculated correctly"""
    char = Character(
        name="Test",
        type="pc",
        # Body cluster
        strength=6, endurance=4, agility=5,  # Body Core = round(15/3) = 5
        # Mind cluster
        technique=7, willpower=5, focus=6,   # Mind Core = round(18/3) = 6
        # Soul cluster
        essence=8, resolve=7, presence=6     # Soul Core = round(21/3) = 7
    )
    
    assert char.body_core == 5
    assert char.mind_core == 6
    assert char.soul_core == 7

def test_scl_calculation():
    """Test SCL = CL + SL"""
    char = Character(
        name="Test",
        type="pc",
        # Primary stats sum to Core stats: Body=5, Mind=6, Soul=7
        strength=6, endurance=4, agility=5,
        technique=7, willpower=5, focus=6,
        essence=8, resolve=7, presence=6,
        # Aether stats
        control=4, fate=3, spirit=5  # SL = floor(12/3) = 4
    )
    
    # CL = floor((5+6+7)/3) = floor(18/3) = 6
    assert char.core_level == 6
    
    # SL = floor((4+3+5)/3) = floor(12/3) = 4
    assert char.soul_level == 4
    
    # SCL = 6 + 4 = 10
    assert char.scl == 10

def test_sequence_band_labels():
    """Test Sequence band classification"""
    # Cursed-Sequence
    char1 = Character(name="Cursed", type="npc", scl=2)
    assert char1.sequence_band == "Cursed-Sequence"
    
    # Low-Sequence
    char2 = Character(name="Low", type="npc", scl=4)
    assert char2.sequence_band == "Low-Sequence"
    
    # Mid-Sequence
    char3 = Character(name="Mid", type="pc", scl=6)
    assert char3.sequence_band == "Mid-Sequence"
    
    # High-Sequence
    char4 = Character(name="High", type="npc", scl=9)
    assert char4.sequence_band == "High-Sequence"
    
    # Transcendent
    char5 = Character(name="Transcendent", type="boss", scl=12)
    assert char5.sequence_band == "Transcendent"
```

**Estimated Impact:** Medium - Quality assurance
**Estimated Effort:** 1 hour
**Risk:** None

---

### 5.2 Document API with Wuxiaxian Terminology

**What to Change:**
Update API documentation to use Wuxiaxian terms and explain mechanics.

**Why It Helps:**
- Developers understand design intent
- API becomes self-documenting
- Reduces onboarding time
- Aligns code and design

**Files to Touch:**
- `backend/openapi.yaml`
- All route files (add better docstrings)

**Concrete Changes:**

```python
# backend/app/api/routes/characters.py

@router.post("/", response_model=CharacterOut)
async def create_character(character: CharacterIn, db: Session = Depends(get_db)):
    """
    Create a new character.
    
    ## Stat System
    
    Characters have 12 base stats:
    - **Primary Stats (9)**: Essence, Resolve, Presence (Soul cluster), 
      Strength, Endurance, Agility (Body cluster), 
      Technique, Willpower, Focus (Mind cluster)
    - **Aether Stats (3)**: Control, Fate, Spirit
    
    ## Derived Stats
    
    The system automatically calculates:
    - **Core Stats**: Body Core, Mind Core, Soul Core (averages of clusters)
    - **Core Level (CL)**: Average of three Core stats (material refinement)
    - **Soul Level (SL)**: Average of three Aether stats (spiritual awakening)
    - **SCL (Soul Core Level)**: CL + SL (power band, replaces PL from M&M)
    - **Sequence Band**: Label based on SCL (Cursed/Low/Mid/High/Transcendent)
    
    ## SCL-Based Caps
    
    Techniques must satisfy:
    - Attack bonus + Effect rank ≤ 2 × SCL
    - Each individually ≤ SCL + 2
    
    ## Combat Resources
    
    - **THP**: Total Hit Points (health)
    - **AE**: Action Energy (technique resource, regenerates)
    - **Strain**: Overexertion accumulator (causes death at max)
    - **Guard**: Temporary damage absorption
    """
    # ... implementation
```

**Estimated Impact:** Low - Developer quality of life
**Estimated Effort:** 2 hours
**Risk:** None

---

## Summary of Priorities

| Priority | Category | Items | Total Effort | Impact | Risk |
|----------|----------|-------|--------------|--------|------|
| 1 | Data Models | 3 improvements | 4-6 hours | High | Low-Medium |
| 2 | Combat Engine | 3 refactors | 7-10 hours | High | Medium |
| 3 | Terminology | 2 cleanups | 2-3 hours | Medium | Low |
| 4 | UI/UX | 2 enhancements | 3-5 hours | Medium | None |
| 5 | Testing/Docs | 2 additions | 3 hours | Medium | None |

**Total Estimated Effort**: 19-27 hours of focused development

**Recommended Implementation Order**:
1. Start with Priority 1 (Data Models) - Foundation for everything else
2. Do Priority 3.1 (terminology rename) - Quick win while models bake
3. Implement Priority 2 (Combat Engine) - Enables player combat
4. Add Priority 4 (UI/UX) - Make it visible to players
5. Fill in Priority 5 (Testing/Docs) - Ensure quality

**Quick Wins** (< 2 hours each, high visibility):
- 1.3: Add cost tracks
- 3.1: Rename level to SCL
- 3.2: Add glossary
- 4.2: Add condition badges
- 5.1: Add stat calculation tests

**Foundation Work** (enables other improvements):
- 1.1: Expand character model (blocks almost everything else)
- 2.2: Extract combat functions (enables player UI)
- 2.1: Refactor technique system (required for SCL caps)
