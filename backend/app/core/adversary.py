"""
Adversary and Encounter Module

Implements ADR-0010: Adversary Construction, Encounter Budgets, and Conflict Sheets
Implements ADR-0013: OCR/DCR Ratings and Encounter Calibration

This module provides:
- Adversary tier templates (Minion, Rival, Elite, Boss, Hazard)
- NPC stat block schema
- OCR/DCR calculations and validation
- Encounter sheets and multi-front conflicts
- Party baseline calculations

Reference: docs/adr/ADR-0010-adversary-construction-encounters.md
Reference: docs/adr/ADR-0013-ocr-dcr-encounter-calibration.md
Patch: ALPHA-0.4-20251212
"""

from dataclasses import dataclass, field
from enum import Enum
from statistics import median
from typing import Dict, List, Optional, Tuple

from app.core.action_economy import SpeedBand, calculate_seq_lvl
from app.core.domains import Clock, ClockType, Domain, StageShiftPackage
from app.core.srd_constants import CAP_MULTIPLIER, PDB_PROFILES, PDBProfile, Pillar

# =============================================================================
# Adversary Type Enum
# =============================================================================

class AdversaryType(str, Enum):
    """Adversary types per ADR-0010."""
    MINION = "Minion"
    RIVAL = "Rival"
    ELITE = "Elite"
    BOSS = "Boss"
    HAZARD = "Hazard"


# =============================================================================
# Threat Level Enum
# =============================================================================

class ThreatLevel(str, Enum):
    """Encounter threat levels per ADR-0010/0013."""
    FAVORABLE = "Favorable"
    EVEN = "Even"
    PRESSURING = "Pressuring"
    OVERWHELMING = "Overwhelming"


# =============================================================================
# Pillar Combat Ratings
# =============================================================================

@dataclass
class PillarStats:
    """Stats for a single pillar."""
    attack: int = 0
    defense: int = 0
    resilience: int = 0
    max_effect_rank: int = 0
    virtual_ranks: int = 0
    ward_active_bonus: int = 0

    @property
    def ocr(self) -> int:
        """Offensive Combat Rating for this pillar."""
        return self.attack + self.max_effect_rank + self.virtual_ranks

    @property
    def dcr(self) -> int:
        """Defensive Combat Rating for this pillar."""
        return self.defense + self.resilience + self.ward_active_bonus


@dataclass
class CharacterCombatRatings:
    """Full OCR/DCR ratings for a character."""
    violence: PillarStats = field(default_factory=PillarStats)
    influence: PillarStats = field(default_factory=PillarStats)
    revelation: PillarStats = field(default_factory=PillarStats)

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

    def get_pillar_stats(self, pillar: Pillar) -> PillarStats:
        """Get stats for a specific pillar."""
        return {
            Pillar.VIOLENCE: self.violence,
            Pillar.INFLUENCE: self.influence,
            Pillar.REVELATION: self.revelation,
        }[pillar]


# =============================================================================
# OCR/DCR Calculation Functions
# =============================================================================

def calculate_pillar_ocr(
    attack: int,
    effect_rank: int,
    virtual_ranks: int = 0
) -> int:
    """Calculate OCR for a pillar."""
    return max(attack + effect_rank, attack + virtual_ranks)


def calculate_pillar_dcr(
    defense: int,
    resilience: int,
    ward_bonus: int = 0
) -> int:
    """Calculate DCR for a pillar."""
    return defense + resilience + ward_bonus


def create_combat_ratings(
    pillar_stats: Dict[Pillar, PillarStats]
) -> CharacterCombatRatings:
    """Create full combat ratings from pillar stats."""
    return CharacterCombatRatings(
        violence=pillar_stats.get(Pillar.VIOLENCE, PillarStats()),
        influence=pillar_stats.get(Pillar.INFLUENCE, PillarStats()),
        revelation=pillar_stats.get(Pillar.REVELATION, PillarStats()),
    )


# =============================================================================
# Legality Validation
# =============================================================================

def validate_legality(
    ratings: CharacterCombatRatings,
    scl: int,
    pdb_profile: PDBProfile
) -> Tuple[bool, List[str]]:
    """
    Validate that OCR/DCR are within legal caps for SCL.

    Returns (is_legal, list_of_errors).
    """
    errors = []

    # Calculate caps
    base_cap = CAP_MULTIPLIER * scl
    modifiers = PDB_PROFILES[pdb_profile]
    off_cap = base_cap + modifiers.off_cap_modifier
    def_cap = base_cap + modifiers.def_cap_modifier

    # Check each pillar
    for pillar in [Pillar.VIOLENCE, Pillar.INFLUENCE, Pillar.REVELATION]:
        pillar_stats = ratings.get_pillar_stats(pillar)
        if pillar_stats.ocr > off_cap:
            errors.append(
                f"{pillar.value} OCR {pillar_stats.ocr} exceeds OffCap {off_cap}"
            )
        if pillar_stats.dcr > def_cap:
            errors.append(
                f"{pillar.value} DCR {pillar_stats.dcr} exceeds DefCap {def_cap}"
            )

    return len(errors) == 0, errors


# =============================================================================
# NPC Stat Block
# =============================================================================

@dataclass
class NPCStatBlock:
    """Canonical NPC stat block per ADR-0010."""
    # Identity
    npc_id: str
    name: str
    adversary_type: AdversaryType

    # Tiering
    scl_target: int
    speed_band: SpeedBand = SpeedBand.NORMAL
    over_scl_band: int = 0  # Boss/Elite only

    # Pillar stats
    pillar_stats: Dict[Pillar, PillarStats] = field(default_factory=dict)

    # Techniques
    techniques: List[str] = field(default_factory=list)

    # Domain (optional)
    domain: Optional[Domain] = None

    # Clocks
    stage_clock: Optional[Clock] = None  # Boss mandatory
    parallel_clocks: List[Clock] = field(default_factory=list)
    danger_clocks: List[Clock] = field(default_factory=list)

    # Stage packages (for Boss/Elite)
    stage_packages: List[StageShiftPackage] = field(default_factory=list)

    @property
    def seq_lvl_base(self) -> int:
        """Base sequence level from SCL."""
        return 3 * max(1, self.scl_target - 1)

    @property
    def seq_lvl(self) -> int:
        """Effective sequence level."""
        return calculate_seq_lvl(
            self.scl_target, self.speed_band, self.over_scl_band
        )

    @property
    def combat_ratings(self) -> CharacterCombatRatings:
        """Get full combat ratings."""
        return create_combat_ratings(self.pillar_stats)

    @property
    def ocr(self) -> int:
        """Aggregate OCR."""
        return self.combat_ratings.ocr

    @property
    def dcr(self) -> int:
        """Aggregate DCR."""
        return self.combat_ratings.dcr


# =============================================================================
# Party Baselines
# =============================================================================

@dataclass
class PartyBaseline:
    """Party baseline stats for encounter building."""
    ocr_med: int
    dcr_med: int
    seq_band_med: int
    scl_med: int
    member_count: int


def calculate_party_baseline(
    party_ratings: List[CharacterCombatRatings],
    party_seq_lvls: List[int],
    party_scls: List[int]
) -> PartyBaseline:
    """Calculate party baselines from member stats."""
    ocrs = [r.ocr for r in party_ratings]
    dcrs = [r.dcr for r in party_ratings]
    seq_bands = [s // 3 for s in party_seq_lvls]

    return PartyBaseline(
        ocr_med=int(median(ocrs)) if ocrs else 0,
        dcr_med=int(median(dcrs)) if dcrs else 0,
        seq_band_med=int(median(seq_bands)) if seq_bands else 1,
        scl_med=int(median(party_scls)) if party_scls else 2,
        member_count=len(party_ratings)
    )


# =============================================================================
# Threat Level Calculation
# =============================================================================

def calculate_threat_level(
    party_baseline: PartyBaseline,
    enemy_ocr: int,
    enemy_dcr: int
) -> ThreatLevel:
    """Determine threat level of an encounter."""
    ocr_delta = enemy_ocr - party_baseline.dcr_med
    dcr_delta = enemy_dcr - party_baseline.ocr_med

    if ocr_delta >= 3 or dcr_delta >= 3:
        return ThreatLevel.OVERWHELMING
    elif ocr_delta >= 2 or dcr_delta >= 2:
        return ThreatLevel.PRESSURING
    elif abs(ocr_delta) <= 1 and abs(dcr_delta) <= 1:
        return ThreatLevel.EVEN
    else:
        return ThreatLevel.FAVORABLE


# =============================================================================
# Adversary Tier Templates
# =============================================================================

@dataclass
class AdversaryTemplate:
    """Template for generating adversaries."""
    adversary_type: AdversaryType
    ocr_offset: int  # Relative to party DCR median
    dcr_offset: int  # Relative to party OCR median
    speed_band: SpeedBand
    over_scl_band: int
    technique_count_range: Tuple[int, int]
    domain_allowed: bool
    domain_rank_range: Tuple[int, int]
    requires_stage_clock: bool
    requires_parallel_clock: bool


ADVERSARY_TEMPLATES: Dict[AdversaryType, AdversaryTemplate] = {
    AdversaryType.MINION: AdversaryTemplate(
        adversary_type=AdversaryType.MINION,
        ocr_offset=0,
        dcr_offset=-2,
        speed_band=SpeedBand.NORMAL,
        over_scl_band=0,
        technique_count_range=(1, 2),
        domain_allowed=False,
        domain_rank_range=(0, 0),
        requires_stage_clock=False,
        requires_parallel_clock=False,
    ),
    AdversaryType.RIVAL: AdversaryTemplate(
        adversary_type=AdversaryType.RIVAL,
        ocr_offset=1,
        dcr_offset=0,
        speed_band=SpeedBand.FAST,
        over_scl_band=0,
        technique_count_range=(3, 5),
        domain_allowed=True,
        domain_rank_range=(1, 2),
        requires_stage_clock=False,
        requires_parallel_clock=False,
    ),
    AdversaryType.ELITE: AdversaryTemplate(
        adversary_type=AdversaryType.ELITE,
        ocr_offset=2,
        dcr_offset=1,
        speed_band=SpeedBand.FAST,
        over_scl_band=0,
        technique_count_range=(4, 6),
        domain_allowed=True,
        domain_rank_range=(2, 3),
        requires_stage_clock=False,
        requires_parallel_clock=True,  # Elite Advantage or Weakness Clock
    ),
    AdversaryType.BOSS: AdversaryTemplate(
        adversary_type=AdversaryType.BOSS,
        ocr_offset=2,
        dcr_offset=2,
        speed_band=SpeedBand.VERY_FAST,
        over_scl_band=1,
        technique_count_range=(5, 8),
        domain_allowed=True,
        domain_rank_range=(3, 4),
        requires_stage_clock=True,
        requires_parallel_clock=True,
    ),
    AdversaryType.HAZARD: AdversaryTemplate(
        adversary_type=AdversaryType.HAZARD,
        ocr_offset=0,
        dcr_offset=0,
        speed_band=SpeedBand.NORMAL,
        over_scl_band=0,
        technique_count_range=(0, 0),
        domain_allowed=False,
        domain_rank_range=(0, 0),
        requires_stage_clock=False,
        requires_parallel_clock=True,  # Hazards are clock-driven
    ),
}


def generate_npc_from_template(
    npc_id: str,
    name: str,
    adversary_type: AdversaryType,
    party_baseline: PartyBaseline,
    primary_pillar: Pillar,
    secondary_pillar: Optional[Pillar] = None
) -> NPCStatBlock:
    """Generate an NPC stat block from a template and party baseline."""
    template = ADVERSARY_TEMPLATES[adversary_type]

    # Calculate target OCR/DCR
    target_ocr = party_baseline.dcr_med + template.ocr_offset
    target_dcr = party_baseline.ocr_med + template.dcr_offset

    # Create pillar stats
    pillar_stats = {}

    # Primary pillar gets full ratings
    primary_attack = target_ocr // 2
    primary_effect = target_ocr - primary_attack
    primary_defense = target_dcr // 2
    primary_resilience = target_dcr - primary_defense

    pillar_stats[primary_pillar] = PillarStats(
        attack=primary_attack,
        defense=primary_defense,
        resilience=primary_resilience,
        max_effect_rank=primary_effect,
    )

    # Secondary pillar (if any) gets reduced ratings
    if secondary_pillar:
        secondary_offset = -1 if adversary_type == AdversaryType.RIVAL else 0
        secondary_target_ocr = target_ocr + secondary_offset
        secondary_target_dcr = target_dcr + secondary_offset

        pillar_stats[secondary_pillar] = PillarStats(
            attack=secondary_target_ocr // 2,
            defense=secondary_target_dcr // 2,
            resilience=secondary_target_dcr - (secondary_target_dcr // 2),
            max_effect_rank=secondary_target_ocr - (secondary_target_ocr // 2),
        )

    # Other pillars get minimal ratings (for minions, -2 offset)
    for pillar in [Pillar.VIOLENCE, Pillar.INFLUENCE, Pillar.REVELATION]:
        if pillar not in pillar_stats:
            if adversary_type == AdversaryType.MINION:
                pillar_stats[pillar] = PillarStats(
                    attack=max(0, target_ocr - 2) // 2,
                    defense=max(0, target_dcr - 2) // 2,
                    resilience=0,
                    max_effect_rank=0,
                )
            else:
                pillar_stats[pillar] = PillarStats()

    # Create clocks if required
    stage_clock = None
    parallel_clocks = []

    if template.requires_stage_clock:
        stage_clock = Clock(
            clock_id=f"{npc_id}_stage",
            name=f"{name} Stage Clock",
            clock_type=ClockType.PROGRESS,
            segments=6
        )

    if template.requires_parallel_clock:
        clock_name = "Weakness" if adversary_type == AdversaryType.ELITE else "Danger"
        parallel_clocks.append(Clock(
            clock_id=f"{npc_id}_parallel",
            name=f"{name} {clock_name} Clock",
            clock_type=ClockType.PROGRESS if clock_name == "Weakness" else ClockType.DANGER,
            segments=6
        ))

    return NPCStatBlock(
        npc_id=npc_id,
        name=name,
        adversary_type=adversary_type,
        scl_target=party_baseline.scl_med,
        speed_band=template.speed_band,
        over_scl_band=template.over_scl_band,
        pillar_stats=pillar_stats,
        stage_clock=stage_clock,
        parallel_clocks=parallel_clocks,
    )


# =============================================================================
# Encounter Sheet
# =============================================================================

@dataclass
class Front:
    """A conflict front in an encounter."""
    front_id: str
    name: str
    stakes: str
    clocks: List[Clock] = field(default_factory=list)
    primary_pillar: Optional[Pillar] = None


@dataclass
class EncounterSheet:
    """Canonical encounter sheet per ADR-0010."""
    encounter_id: str
    name: str
    scene_tier: int = 0  # 0-4

    # Actors
    pc_ids: List[str] = field(default_factory=list)
    npc_blocks: List[NPCStatBlock] = field(default_factory=list)

    # Fronts
    fronts: List[Front] = field(default_factory=list)

    # Stage management (for boss encounters)
    stage_index: int = 0
    stage_clock: Optional[Clock] = None
    parallel_clocks: List[Clock] = field(default_factory=list)
    stage_packages: List[StageShiftPackage] = field(default_factory=list)

    # Current modifiers from stage packages
    active_ocr_mods: Dict[str, Dict[Pillar, int]] = field(default_factory=dict)
    active_dcr_mods: Dict[str, Dict[Pillar, int]] = field(default_factory=dict)

    @property
    def is_boss_encounter(self) -> bool:
        """Whether this is a boss encounter."""
        return any(
            npc.adversary_type == AdversaryType.BOSS
            for npc in self.npc_blocks
        )

    def get_aggregate_threat(
        self,
        party_baseline: PartyBaseline
    ) -> ThreatLevel:
        """Get the aggregate threat level of this encounter."""
        if not self.npc_blocks:
            return ThreatLevel.EVEN

        max_ocr = max(npc.ocr for npc in self.npc_blocks)
        max_dcr = max(npc.dcr for npc in self.npc_blocks)

        return calculate_threat_level(party_baseline, max_ocr, max_dcr)

    def advance_stage(self) -> Optional[StageShiftPackage]:
        """Advance to next stage if stage clock is complete."""
        if not self.stage_clock or not self.stage_clock.is_complete:
            return None

        self.stage_index += 1
        if self.stage_index >= len(self.stage_packages):
            return None

        package = self.stage_packages[self.stage_index]

        # Apply to all NPCs
        for npc in self.npc_blocks:
            if npc.npc_id not in self.active_ocr_mods:
                self.active_ocr_mods[npc.npc_id] = {}
            if npc.npc_id not in self.active_dcr_mods:
                self.active_dcr_mods[npc.npc_id] = {}

            for pillar, delta in package.ocr_delta.items():
                current = self.active_ocr_mods[npc.npc_id].get(pillar, 0)
                self.active_ocr_mods[npc.npc_id][pillar] = current + delta

            for pillar, delta in package.dcr_delta.items():
                current = self.active_dcr_mods[npc.npc_id].get(pillar, 0)
                self.active_dcr_mods[npc.npc_id][pillar] = current + delta

        # Reset stage clock
        self.stage_clock.reset()

        return package
