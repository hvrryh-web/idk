"""
SRD Constants Module

This module contains all game constants derived from the Unified SRD (v0.4).
These constants define the core mechanical rules for character creation,
combat, and progression.

Reference: docs/wuxiaxian-reference/SRD_UNIFIED.md
ADRs: docs/adr/ADR-0001, ADR-0002, ADR-0003, ADR-0004
Patch: ALPHA-0.4-20251212
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

# =============================================================================
# SRD Version Information
# =============================================================================

SRD_VERSION = "0.4.0"
SRD_PATCH_ID = "ALPHA-0.4-20251212"
SRD_DATE = "2025-12-12"


# =============================================================================
# Sequence Bands (Cultivation Tiers)
# =============================================================================

class SequenceBand(str, Enum):
    """Cultivation tier based on SCL range."""
    CURSED = "Cursed-Sequence"      # SCL 1-2
    LOW = "Low-Sequence"            # SCL 3-4
    MID = "Mid-Sequence"            # SCL 5-7
    HIGH = "High-Sequence"          # SCL 8-10
    TRANSCENDENT = "Transcendent"   # SCL 11+


SEQUENCE_BAND_RANGES: Dict[SequenceBand, Tuple[int, int]] = {
    SequenceBand.CURSED: (1, 2),
    SequenceBand.LOW: (3, 4),
    SequenceBand.MID: (5, 7),
    SequenceBand.HIGH: (8, 10),
    SequenceBand.TRANSCENDENT: (11, 99),  # 99 as practical upper bound
}


def get_sequence_band(scl: int) -> SequenceBand:
    """Get the Sequence Band for a given SCL."""
    for band, (min_scl, max_scl) in SEQUENCE_BAND_RANGES.items():
        if min_scl <= scl <= max_scl:
            return band
    return SequenceBand.TRANSCENDENT


# =============================================================================
# Power Draws Blood (PDB) Profiles
# =============================================================================

class PDBProfile(str, Enum):
    """Power Draws Blood profile types for cap adjustments."""
    BALANCED = "Balanced"
    BLOOD_FORWARD = "Blood-Forward"  # Glass cannon
    WARD_FORWARD = "Ward-Forward"    # Bulwark


@dataclass
class PDBModifiers:
    """Cap modifiers for a PDB profile."""
    off_cap_modifier: int = 0
    def_cap_modifier: int = 0
    cost_track_on_4th_degree: str = ""  # Track marked when hitting 4th degree


PDB_PROFILES: Dict[PDBProfile, PDBModifiers] = {
    PDBProfile.BALANCED: PDBModifiers(
        off_cap_modifier=0,
        def_cap_modifier=0,
        cost_track_on_4th_degree=""
    ),
    PDBProfile.BLOOD_FORWARD: PDBModifiers(
        off_cap_modifier=2,
        def_cap_modifier=-2,
        cost_track_on_4th_degree="blood"  # Mark blood when taking 4th degree
    ),
    PDBProfile.WARD_FORWARD: PDBModifiers(
        off_cap_modifier=-2,
        def_cap_modifier=2,
        cost_track_on_4th_degree="blood"  # Mark blood when dealing 4th degree
    ),
}


# =============================================================================
# Cap Formulas (M&M-style rescaled)
# =============================================================================

# Base cap multiplier (4 × SCL for finer granularity than 2 × SCL)
CAP_MULTIPLIER = 4

# Individual stat cap offset (any stat ≤ SCL + this value)
INDIVIDUAL_CAP_OFFSET = 2


def calculate_off_cap(scl: int, profile: PDBProfile = PDBProfile.BALANCED) -> int:
    """Calculate Offense Cap for given SCL and PDB profile."""
    base_cap = CAP_MULTIPLIER * scl
    modifier = PDB_PROFILES[profile].off_cap_modifier
    return base_cap + modifier


def calculate_def_cap(scl: int, profile: PDBProfile = PDBProfile.BALANCED) -> int:
    """Calculate Defense Cap for given SCL and PDB profile."""
    base_cap = CAP_MULTIPLIER * scl
    modifier = PDB_PROFILES[profile].def_cap_modifier
    return base_cap + modifier


def calculate_individual_cap(scl: int) -> int:
    """Calculate individual stat cap (max value for any single stat)."""
    return scl + INDIVIDUAL_CAP_OFFSET


# =============================================================================
# SCP (Soul Core Points) Budget
# =============================================================================

# SCP per SCL
SCP_PER_SCL = 30

# Stat costs
PRIMARY_STAT_COST = 2   # Cost per rank of Primary stats
AETHER_STAT_COST = 3    # Cost per rank of Aether stats

# After creation costs (advancement)
PRIMARY_STAT_ADVANCEMENT_COST = 3
AETHER_STAT_ADVANCEMENT_COST = 5


def calculate_scp_budget(scl: int) -> int:
    """Calculate total SCP budget for character creation."""
    return SCP_PER_SCL * scl


# =============================================================================
# Combat Resources
# =============================================================================

# THP (Total Hit Points)
THP_BASE = 10
THP_PER_ENDURANCE = 5
THP_PER_PURCHASED_RANK = 10
THP_PURCHASED_RANK_COST = 1  # SCP cost

# AE (Action Energy)
AE_BASE = 10
AE_PER_WILLPOWER = 2
AE_PER_PURCHASED_RANK = 5
AE_PURCHASED_RANK_COST = 1  # SCP cost
AE_REGEN_BASE = 1
AE_REGEN_WILLPOWER_DIVISOR = 3

# Strain
STRAIN_PER_ENDURANCE = 10

# Guard from Block action
GUARD_PER_ENDURANCE = 2


def calculate_thp(endurance: int, purchased_ranks: int = 0) -> int:
    """Calculate THP from stats."""
    return THP_BASE + (endurance * THP_PER_ENDURANCE) + (purchased_ranks * THP_PER_PURCHASED_RANK)


def calculate_max_ae(willpower: int, purchased_ranks: int = 0) -> int:
    """Calculate max AE from stats."""
    return AE_BASE + (willpower * AE_PER_WILLPOWER) + (purchased_ranks * AE_PER_PURCHASED_RANK)


def calculate_ae_regen(willpower: int) -> int:
    """Calculate AE regeneration per round."""
    return AE_REGEN_BASE + (willpower // AE_REGEN_WILLPOWER_DIVISOR)


def calculate_max_strain(endurance: int) -> int:
    """Calculate maximum Strain."""
    return endurance * STRAIN_PER_ENDURANCE


def calculate_block_guard(endurance: int) -> int:
    """Calculate Guard gained from Block action."""
    return endurance * GUARD_PER_ENDURANCE


# =============================================================================
# Durability Model - DR Tiers
# =============================================================================

@dataclass
class DRTier:
    """Damage Reduction tier configuration."""
    tier: int
    reduction: float
    description: str


DR_TIERS: List[DRTier] = [
    DRTier(0, 0.00, "Default - No reduction"),
    DRTier(1, 0.10, "Basic protection"),
    DRTier(2, 0.20, "Moderate protection"),
    DRTier(3, 0.30, "Strong protection"),
    DRTier(4, 0.40, "Elite protection"),
    DRTier(5, 0.50, "Maximum mundane"),
    DRTier(6, 0.60, "Supernatural protection"),
]


def get_dr_reduction(tier: int) -> float:
    """Get DR reduction percentage for a tier."""
    if tier < 0:
        return 0.0
    if tier >= len(DR_TIERS):
        return DR_TIERS[-1].reduction
    return DR_TIERS[tier].reduction


# =============================================================================
# Durability Model - Resolve Charges
# =============================================================================

# SCL bonus for Resolve Charges
RESOLVE_CHARGE_SCL_BONUSES = {
    (1, 4): 0,
    (5, 7): 1,
    (8, 10): 2,
    (11, 99): 3,
}


def get_resolve_charge_scl_bonus(scl: int) -> int:
    """Get bonus Resolve Charges from SCL."""
    for (min_scl, max_scl), bonus in RESOLVE_CHARGE_SCL_BONUSES.items():
        if min_scl <= scl <= max_scl:
            return bonus
    return 3


def calculate_prc(endurance: int, scl: int) -> int:
    """Calculate Physical Resolve Charges."""
    return (endurance // 2) + get_resolve_charge_scl_bonus(scl)


def calculate_mrc(willpower: int, scl: int) -> int:
    """Calculate Mental Resolve Charges."""
    return (willpower // 2) + get_resolve_charge_scl_bonus(scl)


def calculate_src(resolve: int, scl: int) -> int:
    """Calculate Spiritual Resolve Charges."""
    return (resolve // 2) + get_resolve_charge_scl_bonus(scl)


# Knockout Save
KNOCKOUT_THRESHOLD_BASE = 5


def calculate_knockout_threshold(core_stat: int) -> int:
    """Calculate knockout threshold for a given Core stat."""
    return KNOCKOUT_THRESHOLD_BASE + core_stat


# =============================================================================
# Resolve Recovery
# =============================================================================

RESOLVE_SHORT_REST_RECOVERY = 1  # Charges per type
RESOLVE_LONG_REST_RECOVERY = "full"  # All charges
SRC_LONG_REST_LIMIT = 1  # SRC only recovers this many per long rest


# =============================================================================
# Meta-Currencies
# =============================================================================

FURY_MAX = 10
CLOUT_MAX = 10
INSIGHT_MAX = 10
INSIGHT_DANGER_THRESHOLD = 8  # At this level, GM may introduce Revelation threats


@dataclass
class MetaCurrencySpend:
    """Meta-currency spend option."""
    cost: int
    effect: str


FURY_SPENDS: List[MetaCurrencySpend] = [
    MetaCurrencySpend(1, "Reroll failed attack"),
    MetaCurrencySpend(2, "+2 to attack roll"),
    MetaCurrencySpend(3, "Auto-succeed Body Resilience check"),
    MetaCurrencySpend(5, "Add extra effect to attack"),
]

CLOUT_SPENDS: List[MetaCurrencySpend] = [
    MetaCurrencySpend(1, "Reroll failed Influence attack"),
    MetaCurrencySpend(2, "+2 to Influence attack"),
    MetaCurrencySpend(3, "Auto-succeed Mind Resilience check"),
    MetaCurrencySpend(5, "Call in favor from NPC"),
]

INSIGHT_SPENDS: List[MetaCurrencySpend] = [
    MetaCurrencySpend(1, "Reroll failed Revelation attack"),
    MetaCurrencySpend(2, "+2 to Revelation attack"),
    MetaCurrencySpend(3, "Auto-succeed Soul Resilience check"),
    MetaCurrencySpend(5, "Ask GM one question about hidden truth"),
]


# =============================================================================
# Cost Tracks (Blood/Fate/Stain)
# =============================================================================

COST_TRACK_BASE_BOXES = 5
COST_TRACK_SCL_DIVISOR = 2

# Thresholds as percentages
COST_TRACK_THRESHOLDS = [0.25, 0.50, 0.75, 1.00]

# Threshold effects
COST_TRACK_THRESHOLD_EFFECTS = [
    "Minor narrative complication",
    "Mechanical penalty (-1 to related actions)",
    "Significant complication, potential lasting effect",
    "Major narrative consequence, possible character change",
]


def calculate_cost_track_boxes(scl: int) -> int:
    """Calculate number of boxes in a cost track."""
    return COST_TRACK_BASE_BOXES + (scl // COST_TRACK_SCL_DIVISOR)


def get_cost_track_threshold_effect(current_marks: int, max_boxes: int) -> str:
    """Get the current threshold effect based on marks."""
    if max_boxes == 0:
        return ""
    percentage = current_marks / max_boxes
    for i, threshold in enumerate(COST_TRACK_THRESHOLDS):
        if percentage <= threshold:
            if i == 0 and percentage < threshold:
                return ""  # Below first threshold
            return COST_TRACK_THRESHOLD_EFFECTS[i]
    return COST_TRACK_THRESHOLD_EFFECTS[-1]


# =============================================================================
# Boss Scaling
# =============================================================================

@dataclass
class BossRankConfig:
    """Configuration for a boss rank."""
    rank: int
    thp_multiplier: float
    resolve_charges: int
    dr_tier: int
    action_count: int
    phases: int
    description: str


BOSS_RANKS: List[BossRankConfig] = [
    BossRankConfig(1, 1.5, 3, 1, 1, 1, "Minor Boss - 1-2 party members equivalent"),
    BossRankConfig(2, 2.0, 5, 2, 2, 1, "Standard Boss - 2-3 party members equivalent"),
    BossRankConfig(3, 3.0, 8, 3, 3, 1, "Major Boss - Full party equivalent"),
    BossRankConfig(4, 4.0, 12, 4, 3, 2, "Elite Boss - Full party + challenge (2 phases)"),
    BossRankConfig(5, 5.0, 15, 5, 4, 3, "Apex Boss - Full party major challenge (3 phases)"),
]


def get_boss_rank_config(rank: int) -> BossRankConfig:
    """Get boss configuration for a given rank."""
    if rank < 1:
        rank = 1
    if rank > 5:
        rank = 5
    return BOSS_RANKS[rank - 1]


def generate_boss_baseline(party_scl: int, boss_rank: int) -> dict:
    """
    Generate recommended boss baseline stats.

    Args:
        party_scl: Average SCL of the party
        boss_rank: Boss rank (1-5)

    Returns:
        dict with recommended bands, HP, charges, DR profile
    """
    config = get_boss_rank_config(boss_rank)

    base_thp = 50 + (party_scl * 20)
    total_thp = int(base_thp * config.thp_multiplier)

    return {
        "recommended_bands": {
            "offense_min": party_scl * 3,
            "offense_max": party_scl * 4 + boss_rank,
            "defense_min": party_scl * 3,
            "defense_max": party_scl * 4 + boss_rank,
        },
        "health_pool": {
            "base_thp": base_thp,
            "multiplier": config.thp_multiplier,
            "total_thp": total_thp,
        },
        "resolve_charges": config.resolve_charges,
        "dr_tier": config.dr_tier,
        "dr_reduction": get_dr_reduction(config.dr_tier),
        "action_count": config.action_count,
        "phases": config.phases,
        "description": config.description,
    }


# =============================================================================
# Condition Degrees
# =============================================================================

class ConditionDegree(str, Enum):
    """Condition severity degrees."""
    FIRST = "1st Degree"
    SECOND = "2nd Degree"
    THIRD = "3rd Degree"
    FOURTH = "4th Degree"


# Resistance failure to degree mapping
CONDITION_DEGREE_THRESHOLDS = {
    (1, 4): ConditionDegree.FIRST,
    (5, 9): ConditionDegree.SECOND,
    (10, 14): ConditionDegree.THIRD,
    (15, 99): ConditionDegree.FOURTH,
}


def get_condition_degree(failure_amount: int) -> ConditionDegree:
    """Get condition degree based on resistance failure amount."""
    for (min_fail, max_fail), degree in CONDITION_DEGREE_THRESHOLDS.items():
        if min_fail <= failure_amount <= max_fail:
            return degree
    return ConditionDegree.FOURTH


# =============================================================================
# Quick Actions
# =============================================================================

class QuickAction(str, Enum):
    """Available quick actions in combat."""
    STRIKE = "Strike"
    BLOCK = "Block"
    PRESSURE = "Pressure"
    WEAKEN = "Weaken"
    EMPOWER = "Empower"
    SHIELD = "Shield"
    REPOSITION = "Reposition"


@dataclass
class QuickActionConfig:
    """Configuration for a quick action."""
    action: QuickAction
    ae_cost: int
    strain_cost: int
    effect: str
    target: str  # "self", "ally", "enemy"


QUICK_ACTIONS: Dict[QuickAction, QuickActionConfig] = {
    QuickAction.STRIKE: QuickActionConfig(
        QuickAction.STRIKE, 0, 0,
        "Basic attack: 1d6 + STR/AGI damage",
        "enemy"
    ),
    QuickAction.BLOCK: QuickActionConfig(
        QuickAction.BLOCK, 0, 1,
        f"Gain Guard = END × {GUARD_PER_ENDURANCE}, 50% damage reduction",
        "self"
    ),
    QuickAction.PRESSURE: QuickActionConfig(
        QuickAction.PRESSURE, 0, 0,
        "Enemy -2 to attack rolls until your next turn",
        "enemy"
    ),
    QuickAction.WEAKEN: QuickActionConfig(
        QuickAction.WEAKEN, 0, 0,
        "Enemy -2 to defense until your next turn",
        "enemy"
    ),
    QuickAction.EMPOWER: QuickActionConfig(
        QuickAction.EMPOWER, 0, 0,
        "Ally +2 to attack rolls until your next turn",
        "ally"
    ),
    QuickAction.SHIELD: QuickActionConfig(
        QuickAction.SHIELD, 0, 0,
        "Ally +2 to defense until your next turn",
        "ally"
    ),
    QuickAction.REPOSITION: QuickActionConfig(
        QuickAction.REPOSITION, 0, 0,
        "Move half speed, break engagement",
        "self"
    ),
}


# =============================================================================
# SPD Bands
# =============================================================================

class SPDBand(str, Enum):
    """Speed band for 3-stage combat turn ordering."""
    FAST = "Fast"
    NORMAL = "Normal"
    SLOW = "Slow"


# SPD thresholds
SPD_FAST_THRESHOLD = 6
SPD_SLOW_THRESHOLD = 2


def get_spd_band(spd: int) -> SPDBand:
    """Get SPD band from raw SPD value."""
    if spd >= SPD_FAST_THRESHOLD:
        return SPDBand.FAST
    if spd < SPD_SLOW_THRESHOLD:
        return SPDBand.SLOW
    return SPDBand.NORMAL


# =============================================================================
# ADR-0002: Canonical Stat Model
# =============================================================================

class Pillar(str, Enum):
    """The three conflict pillars."""
    VIOLENCE = "Violence"
    INFLUENCE = "Influence"
    REVELATION = "Revelation"


# Pillar -> Defense/Resilience mapping per ADR-0002
PILLAR_DEFENSE_MAPPING = {
    Pillar.VIOLENCE: "BodyDefense",
    Pillar.INFLUENCE: "SoulDefense",
    Pillar.REVELATION: "MindDefense",
}

PILLAR_RESILIENCE_MAPPING = {
    Pillar.VIOLENCE: "BodyResilience",
    Pillar.INFLUENCE: "SoulResilience",
    Pillar.REVELATION: "MindResilience",
}

PILLAR_ATTACK_MAPPING = {
    Pillar.VIOLENCE: "ViolenceAttack",
    Pillar.INFLUENCE: "InfluenceAttack",
    Pillar.REVELATION: "RevelationAttack",
}


def calculate_cl(body: int, mind: int, soul: int) -> int:
    """
    Calculate Core Level (CL) per ADR-0002.

    CL = floor((Body + Mind + Soul) / 3)
    """
    return (body + mind + soul) // 3


def calculate_sl(control: int, fate: int, spirit: int) -> int:
    """
    Calculate Soul Level (SL) per ADR-0002.

    SL = floor((Control + Fate + Spirit) / 3)
    """
    return (control + fate + spirit) // 3


def calculate_scl_from_stats(body: int, mind: int, soul: int,
                              control: int, fate: int, spirit: int) -> int:
    """
    Calculate Soul Core Level (SCL) per ADR-0002.

    SCL = CL + SL
    """
    return calculate_cl(body, mind, soul) + calculate_sl(control, fate, spirit)


def get_martial_rank(cl: int) -> int:
    """
    Get Martial Rank per ADR-0002.

    MartialRank = CL
    """
    return cl


def get_sorcery_rank(sl: int) -> int:
    """
    Get Sorcery Rank per ADR-0002.

    SorceryRank = SL
    """
    return sl


# Root stat cost per ADR-0002
ROOT_STAT_COST = 2  # SCP per +1 (Body, Mind, Soul, Control, Fate, Spirit)

# Pillar trait cost per ADR-0002
PILLAR_TRAIT_COST = 1  # SCP per +1 (Attack, Defense, Resilience)


# =============================================================================
# ADR-0003: Contest Types and Bonus Composition
# =============================================================================

class ContestType(str, Enum):
    """Contest types per ADR-0003."""
    ATTACK = "Attack"
    COUNTER_NEGATE = "Counter_Negate"
    COUNTER_RESIST = "Counter_Resist"
    ENDURANCE = "Endurance"
    SOCIAL_CONTEST = "Social_Contest"
    SOCIAL_DUEL = "Social_Duel"
    INVESTIGATION = "Investigation"
    SEARCH_VS_CONCEALMENT = "Search_vs_Concealment"
    OBSTACLE_TASK = "Obstacle_Task"


class TraitRole(str, Enum):
    """Which trait is used in a contest."""
    ATTACK = "Attack"
    DEFENSE = "Defense"
    RESILIENCE = "Resilience"


# Contest type -> Actor trait mapping
CONTEST_ACTOR_TRAIT: Dict[ContestType, TraitRole] = {
    ContestType.ATTACK: TraitRole.ATTACK,
    ContestType.COUNTER_NEGATE: TraitRole.DEFENSE,
    ContestType.COUNTER_RESIST: TraitRole.RESILIENCE,
    ContestType.ENDURANCE: TraitRole.RESILIENCE,
    ContestType.SOCIAL_CONTEST: TraitRole.ATTACK,
    ContestType.SOCIAL_DUEL: TraitRole.ATTACK,
    ContestType.INVESTIGATION: TraitRole.ATTACK,
    ContestType.SEARCH_VS_CONCEALMENT: TraitRole.ATTACK,
    ContestType.OBSTACLE_TASK: TraitRole.ATTACK,  # Varies by context
}

# Contest type -> Opposition trait mapping
CONTEST_OPP_TRAIT: Dict[ContestType, TraitRole] = {
    ContestType.ATTACK: TraitRole.DEFENSE,
    ContestType.COUNTER_NEGATE: TraitRole.ATTACK,
    ContestType.COUNTER_RESIST: TraitRole.ATTACK,
    ContestType.ENDURANCE: TraitRole.ATTACK,  # Or static potency
    ContestType.SOCIAL_CONTEST: TraitRole.DEFENSE,
    ContestType.SOCIAL_DUEL: TraitRole.ATTACK,
    ContestType.INVESTIGATION: TraitRole.DEFENSE,
    ContestType.SEARCH_VS_CONCEALMENT: TraitRole.ATTACK,
    ContestType.OBSTACLE_TASK: TraitRole.DEFENSE,  # TN mode
}


def get_actor_trait_for_contest(contest_type: ContestType, pillar: Pillar) -> str:
    """Get the trait name the actor uses for a contest type."""
    role = CONTEST_ACTOR_TRAIT.get(contest_type, TraitRole.ATTACK)

    if role == TraitRole.ATTACK:
        return PILLAR_ATTACK_MAPPING[pillar]
    elif role == TraitRole.DEFENSE:
        return PILLAR_DEFENSE_MAPPING[pillar]
    else:
        return PILLAR_RESILIENCE_MAPPING[pillar]


def get_opp_trait_for_contest(contest_type: ContestType, pillar: Pillar) -> str:
    """Get the trait name the opposition uses for a contest type."""
    role = CONTEST_OPP_TRAIT.get(contest_type, TraitRole.DEFENSE)

    if role == TraitRole.ATTACK:
        return PILLAR_ATTACK_MAPPING[pillar]
    elif role == TraitRole.DEFENSE:
        return PILLAR_DEFENSE_MAPPING[pillar]
    else:
        return PILLAR_RESILIENCE_MAPPING[pillar]


# =============================================================================
# ADR-0004: Skills
# =============================================================================

class SkillID(str, Enum):
    """Canonical skill list per ADR-0004."""
    # Violence-anchored
    ATHLETICS = "Athletics"
    ARMS = "Arms"
    STEALTH = "Stealth"
    SURVIVAL = "Survival"

    # Influence-anchored
    COMMAND = "Command"
    DECEIVE = "Deceive"
    RAPPORT = "Rapport"
    ETIQUETTE = "Etiquette"

    # Revelation-anchored
    OBSERVE = "Observe"
    INVESTIGATE = "Investigate"
    OCCULT = "Occult"
    ARTIFICE = "Artifice"


# Skill -> Default pillar mapping
SKILL_PILLAR_MAPPING: Dict[SkillID, Pillar] = {
    # Violence-anchored
    SkillID.ATHLETICS: Pillar.VIOLENCE,
    SkillID.ARMS: Pillar.VIOLENCE,
    SkillID.STEALTH: Pillar.VIOLENCE,
    SkillID.SURVIVAL: Pillar.VIOLENCE,
    # Influence-anchored
    SkillID.COMMAND: Pillar.INFLUENCE,
    SkillID.DECEIVE: Pillar.INFLUENCE,
    SkillID.RAPPORT: Pillar.INFLUENCE,
    SkillID.ETIQUETTE: Pillar.INFLUENCE,
    # Revelation-anchored
    SkillID.OBSERVE: Pillar.REVELATION,
    SkillID.INVESTIGATE: Pillar.REVELATION,
    SkillID.OCCULT: Pillar.REVELATION,
    SkillID.ARTIFICE: Pillar.REVELATION,
}

# Skill descriptions
SKILL_DESCRIPTIONS: Dict[SkillID, str] = {
    SkillID.ATHLETICS: "Movement, climbing, jumps, grapples, pursuit",
    SkillID.ARMS: "Weapon forms, martial discipline, drills, disarms",
    SkillID.STEALTH: "Infiltration, ambush, conceal presence",
    SkillID.SURVIVAL: "Tracking, navigation, harsh terrain, fieldcraft",
    SkillID.COMMAND: "Authority, intimidation, coercive presence",
    SkillID.DECEIVE: "Lies, feints, disguise, misdirection",
    SkillID.RAPPORT: "Charm, empathy, bargaining, reading the room",
    SkillID.ETIQUETTE: "Protocol, faction politics, court maneuver",
    SkillID.OBSERVE: "Awareness, scouting, threat read",
    SkillID.INVESTIGATE: "Analysis, research, deduction",
    SkillID.OCCULT: "Cultivation theory, spirits, seals, metaphysics",
    SkillID.ARTIFICE: "Alchemy, talismans, arrays, medicine-as-technique",
}

# Skill costs and caps per ADR-0004
SKILL_COST_PER_RANK = 1  # 1 SCP per +1
SPECIALTY_COST = 1       # 1 SCP for +2 in narrow specialty
SPECIALTY_BONUS = 2      # Specialty grants +2

SKILL_RATING_MIN = 0
SKILL_RATING_MAX = 6
SKILL_CAP_OFFSET = 2     # SkillRating <= SCL + 2


def calculate_skill_cap(scl: int) -> int:
    """Calculate maximum skill rating for a given SCL."""
    return scl + SKILL_CAP_OFFSET


def validate_skill_rating(rating: int, scl: int) -> bool:
    """Check if a skill rating is valid for a given SCL."""
    return SKILL_RATING_MIN <= rating <= min(SKILL_RATING_MAX, calculate_skill_cap(scl))


# =============================================================================
# ADR-0004: Tags
# =============================================================================

class TagType(str, Enum):
    """Tag types per ADR-0004."""
    TECHNIQUE = "Technique"
    GEAR = "Gear"
    CHARACTER = "Character"
    SCENE = "Scene"
    COMPLICATION = "Complication"


class InvokeEffect(str, Enum):
    """What invoking a tag provides."""
    REROLL = "Reroll"
    PLUS_THREE = "+3"
    BOTH = "Both"


# Tag invocation costs and limits per ADR-0004
TAG_INVOKE_COST = 1           # Meta-currency cost per invoke
TAG_INVOKE_BONUS = 3          # +3 bonus when invoking for bonus
MAX_TAG_INVOKES_PER_CHECK = 2 # Maximum invokes per check


@dataclass
class TagOverrides:
    """Optional tag override fields per ADR-0004."""
    approach_override: Optional[str] = None  # "Martial" or "Sorcerous"
    pillar_override: Optional[str] = None    # "Violence", "Influence", "Revelation"
    contest_type_override: Optional[str] = None
    skill_allow_in_combat: bool = False


@dataclass
class Tag:
    """Tag data structure per ADR-0004."""
    tag_id: str
    tag_type: TagType
    name: str
    description: str = ""
    pillar: Optional[Pillar] = None
    stack_group: Optional[str] = None
    invoke_allowed: bool = True
    invoke_effect: InvokeEffect = InvokeEffect.BOTH
    passive_mods: List[Dict] = field(default_factory=list)
    virtual_ranks: int = 0
    overrides: Optional[TagOverrides] = None
    free_invoke_count: int = 0


def create_scene_tag_from_advantage(dos: int, tag_name: str, target: str) -> Tag:
    """
    Create a tag from a Create Advantage action per ADR-0004.

    Args:
        dos: Degrees of Success from the contest
        tag_name: Name for the new tag
        target: What the tag attaches to

    Returns:
        Tag object (Scene or Complication type)
    """
    if dos >= 1:
        # Success - create Scene Tag
        free_invokes = 2 if dos >= 3 else 1
        return Tag(
            tag_id=f"scene_{tag_name.lower().replace(' ', '_')}",
            tag_type=TagType.SCENE,
            name=tag_name,
            description=f"Created by advantage action on {target}",
            invoke_allowed=True,
            invoke_effect=InvokeEffect.BOTH,
            free_invoke_count=free_invokes
        )
    else:
        # Failure - create Complication Tag (for opposition)
        return Tag(
            tag_id=f"complication_{tag_name.lower().replace(' ', '_')}",
            tag_type=TagType.COMPLICATION,
            name=tag_name,
            description=f"Complication from failed advantage on {target}",
            invoke_allowed=True,
            invoke_effect=InvokeEffect.BOTH,
            free_invoke_count=1
        )
