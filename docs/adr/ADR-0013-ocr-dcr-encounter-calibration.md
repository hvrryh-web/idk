# ADR-0013: OCR/DCR Ratings and Encounter Calibration

**Status**: Accepted

**Date**: 2025-12-12

**Patch**: ALPHA-0.4-20251212

---

## Context

The system needs encounter math that:
- Remains compatible with SCL caps/bands and the "Power Draws Blood" profiles
- Maps cleanly to point-buy budgeting (notably the SCL 2 baseline budget and trait/effect costing expectations)
- Supports web implementation with fast validation ("is this NPC legal for this scene?") and stable difficulty forecasting

---

## Decision

### D1. Define OCR and DCR (Canonical, Per Pillar and Aggregated)

For each pillar **P ∈ {Violence, Influence, Revelation}**:

```
OCR_P (Offensive Combat Rating) = max(Attack_P + EffectRank_P, Attack_P + VirtualEffect_P)
DCR_P (Defensive Combat Rating) = Defense_P + Resilience_P
```

Where VirtualEffect_P includes Domain-provided VirtualRanks and any other explicitly virtualized ranks, but only if they apply to the action being evaluated.

**Aggregates:**
```
OCR = max(OCR_P across pillars)
DCR = max(DCR_P across pillars)
```

This yields two fast, legible numbers:
- "How hard you can hit (in your best pillar)"
- "How hard you are to put down (in your best defense pillar)"

### D2. Legality Checks (Build Validation)

A creature is **legal** at a given SCL if it satisfies:
- Pillar cap constraints (per the system's banding, including profile shifts)
- OCR/DCR do not exceed the pillar's allowed maxima after applying the character's Power Draws Blood profile

### D3. Encounter Calibration Targets (SCL-Banded Heuristics)

Use **SCL** as the primary difficulty dial; OCR/DCR provide the quick forecast.

#### Baseline Targets (Balanced Profile Assumptions)

| Foe Type | OCR | DCR |
|----------|-----|-----|
| **Standard foe** | ≈ 2×SCL | ≈ 2×SCL (distributed; typically only one pillar peaked) |
| **Elite** | ≈ 2×SCL + 1–2 in one pillar (via Blood-Forward) | Compensating DCR reduction in that pillar |
| **Boss** | Near-cap OCR in 2 pillars or near-cap DCR in 2 pillars | Must have explicit boss rules (extra stages, tracks, or rule-space pressure) |

### D4. Integrate OCR/DCR into SCP Budgeting Outputs

When generating or validating a character from point-buy:
- Compute OCR/DCR automatically from purchased traits, effects, and declared always-on defenses
- Report:
  - **SCL**, **SCP spent** (e.g., SCL 2 PCs at 60 SCP baseline)
  - **OCR/DCR**
  - **Peaked pillar(s)** (which pillar is contributing the max OCR and max DCR)

### D5. Encounter "Fair Fight" Bands (Party vs Opposition)

For an encounter at party average **SCL_party**:

| Condition | Definition |
|-----------|------------|
| **"Fair" fight** | Opponent OCR within ±1 of party OCR (±2 for boss), AND Opponent DCR within ±1 of party DCR (±2 for boss) |
| **Over-tuned** | Both OCR and DCR exceed party values by 2+ | Must grant compensators (terrain, allies, clock advantage, constrained boss window) |

---

## Consequences

- OCR/DCR become the SRD's and codebase's shared "combat stat line," enabling:
  - Fast legality validation
  - Predictable encounter tuning
  - Automated warnings during content authoring
- Encounter difficulty becomes explainable without exposing full internal build math to players

---

## Canonical OCR/DCR Appendix (SRD + Codebase Reference)

### OCR/DCR Calculation

```python
@dataclass
class PillarCombatRatings:
    """Combat ratings for a single pillar."""
    attack: int = 0
    defense: int = 0
    resilience: int = 0
    effect_rank: int = 0
    virtual_effect: int = 0
    ward_bonus: int = 0
    
    @property
    def ocr(self) -> int:
        """Offensive Combat Rating for this pillar."""
        return max(
            self.attack + self.effect_rank,
            self.attack + self.virtual_effect
        )
    
    @property
    def dcr(self) -> int:
        """Defensive Combat Rating for this pillar."""
        return self.defense + self.resilience + self.ward_bonus


@dataclass
class CharacterCombatRatings:
    """Full combat ratings for a character."""
    violence: PillarCombatRatings = field(default_factory=PillarCombatRatings)
    influence: PillarCombatRatings = field(default_factory=PillarCombatRatings)
    revelation: PillarCombatRatings = field(default_factory=PillarCombatRatings)
    
    @property
    def ocr(self) -> int:
        """Aggregate OCR (max across pillars)."""
        return max(self.violence.ocr, self.influence.ocr, self.revelation.ocr)
    
    @property
    def dcr(self) -> int:
        """Aggregate DCR (max across pillars)."""
        return max(self.violence.dcr, self.influence.dcr, self.revelation.dcr)
    
    @property
    def peaked_ocr_pillar(self) -> Pillar:
        """Which pillar contributes max OCR."""
        ocrs = {
            Pillar.VIOLENCE: self.violence.ocr,
            Pillar.INFLUENCE: self.influence.ocr,
            Pillar.REVELATION: self.revelation.ocr,
        }
        return max(ocrs, key=ocrs.get)
    
    @property
    def peaked_dcr_pillar(self) -> Pillar:
        """Which pillar contributes max DCR."""
        dcrs = {
            Pillar.VIOLENCE: self.violence.dcr,
            Pillar.INFLUENCE: self.influence.dcr,
            Pillar.REVELATION: self.revelation.dcr,
        }
        return max(dcrs, key=dcrs.get)


def calculate_ocr_dcr(
    pillar_stats: Dict[Pillar, PillarStats],
    virtual_effects: Optional[Dict[Pillar, int]] = None
) -> CharacterCombatRatings:
    """Calculate full OCR/DCR ratings from pillar stats."""
    virtual_effects = virtual_effects or {}
    
    violence = PillarCombatRatings(
        attack=pillar_stats.get(Pillar.VIOLENCE, PillarStats()).attack,
        defense=pillar_stats.get(Pillar.VIOLENCE, PillarStats()).defense,
        resilience=pillar_stats.get(Pillar.VIOLENCE, PillarStats()).resilience,
        effect_rank=pillar_stats.get(Pillar.VIOLENCE, PillarStats()).max_effect_rank,
        virtual_effect=virtual_effects.get(Pillar.VIOLENCE, 0),
        ward_bonus=pillar_stats.get(Pillar.VIOLENCE, PillarStats()).ward_active_bonus,
    )
    
    influence = PillarCombatRatings(
        attack=pillar_stats.get(Pillar.INFLUENCE, PillarStats()).attack,
        defense=pillar_stats.get(Pillar.INFLUENCE, PillarStats()).defense,
        resilience=pillar_stats.get(Pillar.INFLUENCE, PillarStats()).resilience,
        effect_rank=pillar_stats.get(Pillar.INFLUENCE, PillarStats()).max_effect_rank,
        virtual_effect=virtual_effects.get(Pillar.INFLUENCE, 0),
        ward_bonus=pillar_stats.get(Pillar.INFLUENCE, PillarStats()).ward_active_bonus,
    )
    
    revelation = PillarCombatRatings(
        attack=pillar_stats.get(Pillar.REVELATION, PillarStats()).attack,
        defense=pillar_stats.get(Pillar.REVELATION, PillarStats()).defense,
        resilience=pillar_stats.get(Pillar.REVELATION, PillarStats()).resilience,
        effect_rank=pillar_stats.get(Pillar.REVELATION, PillarStats()).max_effect_rank,
        virtual_effect=virtual_effects.get(Pillar.REVELATION, 0),
        ward_bonus=pillar_stats.get(Pillar.REVELATION, PillarStats()).ward_active_bonus,
    )
    
    return CharacterCombatRatings(
        violence=violence,
        influence=influence,
        revelation=revelation
    )
```

### Legality Validation

```python
def validate_legality(
    ratings: CharacterCombatRatings,
    scl: int,
    pdb_profile: PDBProfile
) -> Tuple[bool, List[str]]:
    """Validate that OCR/DCR are within legal caps for SCL."""
    errors = []
    
    # Calculate caps
    base_cap = 4 * scl
    modifiers = PDB_PROFILES[pdb_profile]
    off_cap = base_cap + modifiers.off_cap_modifier
    def_cap = base_cap + modifiers.def_cap_modifier
    
    # Check each pillar
    for pillar, pillar_ratings in [
        (Pillar.VIOLENCE, ratings.violence),
        (Pillar.INFLUENCE, ratings.influence),
        (Pillar.REVELATION, ratings.revelation),
    ]:
        if pillar_ratings.ocr > off_cap:
            errors.append(f"{pillar.value} OCR {pillar_ratings.ocr} exceeds OffCap {off_cap}")
        if pillar_ratings.dcr > def_cap:
            errors.append(f"{pillar.value} DCR {pillar_ratings.dcr} exceeds DefCap {def_cap}")
    
    return len(errors) == 0, errors
```

### Encounter Calibration

```python
def calculate_encounter_threat_level(
    party_ocr_med: int,
    party_dcr_med: int,
    enemy_ocr: int,
    enemy_dcr: int
) -> str:
    """Determine threat level of an encounter."""
    ocr_delta = enemy_ocr - party_dcr_med
    dcr_delta = enemy_dcr - party_ocr_med
    
    if ocr_delta >= 3 or dcr_delta >= 3:
        return "Overwhelming"
    elif ocr_delta >= 2 or dcr_delta >= 2:
        return "Pressuring"
    elif abs(ocr_delta) <= 1 and abs(dcr_delta) <= 1:
        return "Even"
    else:
        return "Favorable"
```

---

## References

- ADR-0002: Canonical Stat Model
- ADR-0008: Turn Structure, Action Economy
- ADR-0010: Adversary Construction, Encounter Budgets
