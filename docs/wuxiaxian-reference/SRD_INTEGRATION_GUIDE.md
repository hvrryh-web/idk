# SRD Integration Guide

## Overview

This document describes how to integrate the Unified SRD (v0.3) with the combat engine and character profile systems. It includes troubleshooting guides and diagnostic tool usage.

**Reference Documents:**
- `docs/wuxiaxian-reference/SRD_UNIFIED.md` - Full SRD rules
- `docs/patch-notes/PATCH-20251212-001.md` - Patch notes for SRD v0.3

## Architecture

### Module Structure

```
backend/app/core/
├── srd_constants.py     # All game constants from SRD
├── srd_validation.py    # Character validation against caps
└── srd_diagnostics.py   # Diagnostic and troubleshooting tools

backend/app/simulation/
├── engine.py            # Combat simulation engine
├── combat_state.py      # Combat state management
├── player_combat.py     # Player turn handling
└── quick_actions.py     # Quick action implementations

frontend/src/
├── types.ts             # TypeScript types (includes SRD-aligned types)
└── character/
    └── state/           # Character creation state management
```

---

## Integration Points

### 1. Character Model Integration

The `Character` model in `backend/app/models/characters.py` needs alignment with SRD stats.

#### Current State
The model has legacy stats (`strength`, `dexterity`, `constitution`, etc.) that don't match the SRD 9-stat system.

#### SRD-Aligned Stats

**Primary Stats (9):**
| SRD Stat | Current Field | Action Needed |
|----------|---------------|---------------|
| Strength | `strength` | ✅ Exists |
| Endurance | `constitution` | Rename or alias |
| Agility | `dexterity` | Rename or alias |
| Technique | `intelligence` | Rename or alias |
| Willpower | `wisdom` | ✅ Rename |
| Focus | `perception` | Rename or alias |
| Essence | N/A | Add field |
| Resolve | `resolve` | ✅ Exists |
| Presence | `presence` | ✅ Exists |

**Aether Stats (3):**
| SRD Stat | Current Field | Action Needed |
|----------|---------------|---------------|
| Control | N/A | Add field (or map from `aether_fire`) |
| Fate | N/A | Add field (or map from `aether_ice`) |
| Spirit | N/A | Add field (or map from `aether_void`) |

#### Integration Code

```python
from app.core.srd_validation import (
    CharacterStats,
    calculate_scl,
    validate_character,
    recalculate_build,
)

def get_srd_stats(character: Character) -> CharacterStats:
    """Convert Character model to SRD CharacterStats."""
    return CharacterStats(
        # Map current fields to SRD fields
        strength=character.strength or 0,
        endurance=character.constitution or 0,  # Alias
        agility=character.dexterity or 0,       # Alias
        technique=character.intelligence or 0,  # Alias
        willpower=character.wisdom or 0,        # Alias
        focus=character.perception or 0,        # Alias
        essence=character.charisma or 0,        # Temporary alias
        resolve=character.resolve or 0,
        presence=character.presence or 0,
        
        # Aether stats
        control=character.aether_fire or 0,     # Temporary alias
        fate=character.aether_ice or 0,         # Temporary alias
        spirit=character.aether_void or 0,      # Temporary alias
    )

def validate_character_against_srd(character: Character) -> dict:
    """Validate character against SRD rules."""
    stats = get_srd_stats(character)
    result = validate_character(stats)
    return result.to_dict() if hasattr(result, 'to_dict') else asdict(result)
```

---

### 2. Combat Engine Integration

The combat engine needs updates to use SRD constants for:
- Damage Reduction (DR) tiers
- Resolve Charges as damage buffer
- Meta-currency tracking

#### DR Tier Integration

```python
from app.core.srd_constants import get_dr_reduction, DR_TIERS

def apply_damage_with_dr_tiers(
    target: CombatantState,
    raw_damage: int,
    dr_tier: int
) -> int:
    """Apply damage using SRD DR tier system."""
    dr_reduction = get_dr_reduction(dr_tier)
    final_damage = int(raw_damage * (1.0 - dr_reduction))
    target.thp = max(0, target.thp - final_damage)
    return final_damage
```

#### Resolve Charge Integration

```python
from app.core.srd_constants import (
    calculate_prc,
    calculate_knockout_threshold,
)

@dataclass
class CombatantState:
    # ... existing fields ...
    
    # Add Resolve Charges
    prc: int = 0  # Physical Resolve Charges
    mrc: int = 0  # Mental Resolve Charges
    src: int = 0  # Spiritual Resolve Charges
    
    def apply_damage_with_resolve(
        self,
        damage: int,
        pillar: str = "violence"
    ) -> int:
        """Apply damage with Resolve Charge buffer."""
        resolve_charges = getattr(self, f"{pillar[0].lower()}rc", 0)
        
        if resolve_charges > 0:
            # Deplete charges first
            charges_depleted = min(resolve_charges, damage)
            setattr(self, f"{pillar[0].lower()}rc", 
                    resolve_charges - charges_depleted)
            
            # Apply DR reduction
            dr_reduction = get_dr_reduction(self.dr_tier)
            final_damage = int(damage * (1.0 - dr_reduction))
            self.thp = max(0, self.thp - final_damage)
            return final_damage
        else:
            # No charges, full damage
            self.thp = max(0, self.thp - damage)
            return damage
```

---

### 3. Meta-Currency Integration

The combat system needs event-based meta-currency tracking.

#### Rules Event Bus

```python
from dataclasses import dataclass
from enum import Enum
from typing import List, Callable, Any

class RulesEventType(str, Enum):
    FURY_GAINED = "fury_gained"
    FURY_SPENT = "fury_spent"
    CLOUT_GAINED = "clout_gained"
    CLOUT_SPENT = "clout_spent"
    INSIGHT_GAINED = "insight_gained"
    INSIGHT_SPENT = "insight_spent"
    TRACK_MARKED = "track_marked"
    TRACK_CLEARED = "track_cleared"

@dataclass
class RulesEvent:
    event_type: RulesEventType
    source: str
    amount: int = 0
    track: str = ""
    extra: dict = None

class RulesEventBus:
    """Event bus for meta-currency and cost track events."""
    
    def __init__(self):
        self._subscribers: List[Callable[[RulesEvent], None]] = []
        self._events: List[RulesEvent] = []
    
    def subscribe(self, callback: Callable[[RulesEvent], None]):
        """Subscribe to rules events."""
        self._subscribers.append(callback)
    
    def emit(self, event: RulesEvent):
        """Emit a rules event to all subscribers."""
        self._events.append(event)
        for callback in self._subscribers:
            callback(event)
    
    def get_history(self) -> List[RulesEvent]:
        """Get event history."""
        return self._events.copy()
```

---

### 4. Frontend Integration

The frontend TypeScript types already include SRD-aligned fields. Ensure consistency:

```typescript
// frontend/src/types.ts

// SRD-aligned Character interface additions
export interface SRDCharacterStats {
  // Primary Stats (9)
  strength: number;
  endurance: number;   // Was constitution
  agility: number;     // Was dexterity
  technique: number;   // Was intelligence
  willpower: number;   // Was wisdom
  focus: number;       // Was perception
  essence: number;     // New
  resolve: number;
  presence: number;
  
  // Aether Stats (3)
  control: number;     // Was aether_fire
  fate: number;        // Was aether_ice
  spirit: number;      // Was aether_void
  
  // Derived
  scl: number;
  cl: number;
  sl: number;
  sequence_band: string;
}

export interface CapStatus {
  violence: PillarCapStatus;
  influence: PillarCapStatus;
  revelation: PillarCapStatus;
}

export interface PillarCapStatus {
  ovr: number;
  dvr: number;
  effect_rank: number;
  resilience: number;
  off_cap: number;
  def_cap: number;
  offense_valid: boolean;
  defense_valid: boolean;
  pdb_profile: 'Balanced' | 'Blood-Forward' | 'Ward-Forward';
}
```

---

## Troubleshooting Guide

### Common Issues

#### Issue: SCL Calculation Mismatch

**Symptom:** Calculated SCL doesn't match expected value.

**Diagnosis:**
```python
from app.core.srd_diagnostics import diagnose_scl_calculation

report = diagnose_scl_calculation(
    primary_stats={
        "strength": 4, "endurance": 3, "agility": 5,
        "technique": 5, "willpower": 3, "focus": 4,
        "essence": 2, "resolve": 3, "presence": 2,
    },
    aether_stats={
        "control": 2, "fate": 1, "spirit": 2,
    },
    expected_scl=5
)
print(report.to_json())
```

**Common Causes:**
1. Using wrong stat names
2. Using floor() vs round() incorrectly
3. Missing Aether stats

---

#### Issue: Cap Validation Errors

**Symptom:** Character failing cap validation.

**Diagnosis:**
```python
from app.core.srd_validation import validate_character, CharacterStats

stats = CharacterStats(
    # ... stats ...
    violence_ovr=8,
    violence_effect_rank=7,
    violence_pdb=PDBProfile.BALANCED,
)

result = validate_character(stats)
for error in result.get_errors():
    print(f"Error: {error.code}")
    print(f"  {error.message}")
    print(f"  Suggestion: {error.suggestion}")
```

**Common Causes:**
1. OVR + Effect Rank > OffCap
2. DVR + Resilience > DefCap
3. Individual stat > SCL + 2
4. Multiple pillars at full defense (omni-defensive)

---

#### Issue: Combat Resources Incorrect

**Symptom:** THP, AE, or Strain calculated wrong.

**Diagnosis:**
```python
from app.core.srd_diagnostics import diagnose_combat_resources

report = diagnose_combat_resources(
    endurance=5,
    willpower=4,
    resolve=3,
    scl=5,
    purchased_hp_ranks=2,
    purchased_ae_ranks=1,
)
print(report.to_json())
```

**Formula Verification:**
- THP = 10 + (Endurance × 5) + (purchased_ranks × 10)
- Max AE = 10 + (Willpower × 2) + (purchased_ranks × 5)
- Max Strain = Endurance × 10
- AE Regen = 1 + floor(Willpower / 3)

---

### Diagnostic Commands

Run integration health check:
```bash
cd backend
python -m app.core.srd_diagnostics
```

Expected output:
```
SRD Diagnostics - Version 0.3
Patch: ALPHA-0.3-20251212
Date: 2025-12-12
==================================================

Running integration health check...

Results: 6 diagnostic entries
Summary: {'info': 5, 'debug': 1}
ℹ️ [INFO] SRD_CONSTANTS_LOADED: SRD constants module loaded (version 0.3)
ℹ️ [INFO] SRD_VALIDATION_LOADED: SRD validation module loaded
ℹ️ [INFO] CAP_CALCULATION_OK: Cap calculation functions verified
ℹ️ [INFO] RESOURCE_CALCULATION_OK: Resource calculation functions verified
ℹ️ [INFO] HEALTH_CHECK_PASSED: Integration health check PASSED

==================================================
STATUS: PASSED
```

---

## API Endpoints

### Character Validation Endpoint

```python
# backend/app/api/routes/characters.py

from fastapi import APIRouter, Depends
from app.core.srd_validation import validate_character, CharacterStats

@router.post("/validate")
def validate_character_endpoint(stats: CharacterStats):
    """Validate character against SRD rules."""
    result = validate_character(stats)
    return {
        "is_valid": result.is_valid,
        "errors": [asdict(e) for e in result.get_errors()],
        "warnings": [asdict(e) for e in result.get_warnings()],
        "stats_summary": result.stats_summary,
    }

@router.post("/recalculate")
def recalculate_build_endpoint(stats: CharacterStats):
    """Recalculate character build with SCP accounting."""
    from app.core.srd_validation import recalculate_build
    return recalculate_build(stats)
```

### Diagnostics Endpoint

```python
# backend/app/api/routes/diagnostics.py

from fastapi import APIRouter
from app.core.srd_diagnostics import run_integration_health_check

router = APIRouter(prefix="/diagnostics", tags=["diagnostics"])

@router.get("/health")
def health_check():
    """Run SRD integration health check."""
    report = run_integration_health_check()
    return report.to_dict()
```

---

## Testing

### Unit Tests

```python
# backend/tests/test_srd_constants.py

import pytest
from app.core.srd_constants import (
    calculate_off_cap,
    calculate_def_cap,
    calculate_thp,
    PDBProfile,
)

def test_balanced_caps():
    """Test Balanced profile caps."""
    assert calculate_off_cap(5, PDBProfile.BALANCED) == 20
    assert calculate_def_cap(5, PDBProfile.BALANCED) == 20

def test_blood_forward_caps():
    """Test Blood-Forward profile caps."""
    assert calculate_off_cap(5, PDBProfile.BLOOD_FORWARD) == 22
    assert calculate_def_cap(5, PDBProfile.BLOOD_FORWARD) == 18

def test_thp_calculation():
    """Test THP calculation."""
    assert calculate_thp(5, 0) == 35  # 10 + (5*5) + 0
    assert calculate_thp(5, 2) == 55  # 10 + (5*5) + 20
```

### Integration Tests

```python
# backend/tests/test_srd_integration.py

import pytest
from app.core.srd_validation import (
    CharacterStats,
    validate_character,
    calculate_scl,
)
from app.core.srd_constants import PDBProfile

def test_full_character_validation():
    """Test complete character validation flow."""
    stats = CharacterStats(
        strength=4, endurance=3, agility=5,
        technique=5, willpower=3, focus=4,
        essence=2, resolve=3, presence=2,
        control=2, fate=1, spirit=2,
        violence_ovr=5, violence_dvr=5,
        violence_effect_rank=5, violence_resilience=5,
        violence_pdb=PDBProfile.BALANCED,
    )
    
    scl = calculate_scl(stats)
    assert scl == 4
    
    result = validate_character(stats)
    assert result.is_valid
```

---

## Migration Checklist

- [ ] Update Character model with SRD-aligned stat names
- [ ] Add Resolve Charges to CombatantState
- [ ] Implement DR Tier system in damage calculation
- [ ] Add Rules Event Bus for meta-currencies
- [ ] Update frontend types for SRD alignment
- [ ] Add validation endpoint to API
- [ ] Add diagnostics endpoint to API
- [ ] Write unit tests for SRD constants
- [ ] Write integration tests for validation
- [ ] Update API documentation

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.3 | 2025-12-12 | Initial integration guide |

---

**Last Updated:** 2025-12-12
**SRD Version:** ALPHA-0.3-20251212
