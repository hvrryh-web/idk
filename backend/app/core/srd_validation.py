"""
SRD Validation Module

This module provides validation utilities for character profiles
against SRD rules. Validates caps, budgets, and mechanical constraints.

Reference: docs/wuxiaxian-reference/SRD_UNIFIED.md
Patch: ALPHA-0.3-20251212
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

from app.core.srd_constants import (
    PDBProfile,
    calculate_off_cap,
    calculate_def_cap,
    calculate_individual_cap,
    calculate_scp_budget,
    PRIMARY_STAT_COST,
    AETHER_STAT_COST,
    get_sequence_band,
)


# =============================================================================
# Validation Result Types
# =============================================================================

class ValidationSeverity(str, Enum):
    """Severity level for validation issues."""
    ERROR = "error"      # Character is invalid
    WARNING = "warning"  # Character is valid but suboptimal
    INFO = "info"        # Informational note


@dataclass
class ValidationIssue:
    """A single validation issue."""
    severity: ValidationSeverity
    code: str
    message: str
    field: Optional[str] = None
    current_value: Optional[float] = None
    limit_value: Optional[float] = None
    suggestion: Optional[str] = None


@dataclass
class ValidationResult:
    """Complete validation result for a character."""
    is_valid: bool
    issues: List[ValidationIssue] = field(default_factory=list)
    stats_summary: Dict = field(default_factory=dict)
    
    def add_error(self, code: str, message: str, **kwargs):
        """Add an error issue."""
        self.issues.append(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code=code,
            message=message,
            **kwargs
        ))
        self.is_valid = False
    
    def add_warning(self, code: str, message: str, **kwargs):
        """Add a warning issue."""
        self.issues.append(ValidationIssue(
            severity=ValidationSeverity.WARNING,
            code=code,
            message=message,
            **kwargs
        ))
    
    def add_info(self, code: str, message: str, **kwargs):
        """Add an info issue."""
        self.issues.append(ValidationIssue(
            severity=ValidationSeverity.INFO,
            code=code,
            message=message,
            **kwargs
        ))
    
    def get_errors(self) -> List[ValidationIssue]:
        """Get all error-level issues."""
        return [i for i in self.issues if i.severity == ValidationSeverity.ERROR]
    
    def get_warnings(self) -> List[ValidationIssue]:
        """Get all warning-level issues."""
        return [i for i in self.issues if i.severity == ValidationSeverity.WARNING]


# =============================================================================
# Character Stats Interface
# =============================================================================

@dataclass
class CharacterStats:
    """Character stats for validation (interface)."""
    # Primary Stats (9)
    strength: int = 0
    endurance: int = 0
    agility: int = 0
    technique: int = 0
    willpower: int = 0
    focus: int = 0
    essence: int = 0
    resolve: int = 0
    presence: int = 0
    
    # Aether Stats (3)
    control: int = 0
    fate: int = 0
    spirit: int = 0
    
    # Per-pillar combat stats
    violence_ovr: int = 0
    violence_dvr: int = 0
    violence_effect_rank: int = 0
    violence_resilience: int = 0
    violence_pdb: PDBProfile = PDBProfile.BALANCED
    
    influence_ovr: int = 0
    influence_dvr: int = 0
    influence_effect_rank: int = 0
    influence_resilience: int = 0
    influence_pdb: PDBProfile = PDBProfile.BALANCED
    
    revelation_ovr: int = 0
    revelation_dvr: int = 0
    revelation_effect_rank: int = 0
    revelation_resilience: int = 0
    revelation_pdb: PDBProfile = PDBProfile.BALANCED
    
    # Techniques with effect ranks
    technique_effects: List[Tuple[str, int, int]] = field(default_factory=list)  # (name, attack_bonus, effect_rank)


# =============================================================================
# Core Stat Calculations
# =============================================================================

def calculate_body_core(stats: CharacterStats) -> int:
    """Calculate Body Core from primary stats."""
    return round((stats.strength + stats.endurance + stats.agility) / 3)


def calculate_mind_core(stats: CharacterStats) -> int:
    """Calculate Mind Core from primary stats."""
    return round((stats.technique + stats.willpower + stats.focus) / 3)


def calculate_soul_core(stats: CharacterStats) -> int:
    """Calculate Soul Core from primary stats."""
    return round((stats.essence + stats.resolve + stats.presence) / 3)


def calculate_cl(stats: CharacterStats) -> int:
    """Calculate Core Level (CL)."""
    body_core = calculate_body_core(stats)
    mind_core = calculate_mind_core(stats)
    soul_core = calculate_soul_core(stats)
    return (body_core + mind_core + soul_core) // 3


def calculate_sl(stats: CharacterStats) -> int:
    """Calculate Soul Level (SL)."""
    return (stats.control + stats.fate + stats.spirit) // 3


def calculate_scl(stats: CharacterStats) -> int:
    """Calculate Soul Core Level (SCL)."""
    return calculate_cl(stats) + calculate_sl(stats)


# =============================================================================
# Cap Validation
# =============================================================================

def validate_pillar_caps(
    stats: CharacterStats,
    scl: int,
    pillar: str,
    ovr: int,
    dvr: int,
    effect_rank: int,
    resilience: int,
    pdb: PDBProfile
) -> List[ValidationIssue]:
    """Validate caps for a single pillar."""
    issues = []
    
    off_cap = calculate_off_cap(scl, pdb)
    def_cap = calculate_def_cap(scl, pdb)
    ind_cap = calculate_individual_cap(scl)
    
    # Offense band: OVR + Effect Rank <= OffCap
    offense_total = ovr + effect_rank
    if offense_total > off_cap:
        issues.append(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code=f"{pillar.upper()}_OFFENSE_CAP_EXCEEDED",
            message=f"{pillar} offense band exceeds cap: {offense_total} > {off_cap}",
            field=f"{pillar}_offense",
            current_value=offense_total,
            limit_value=off_cap,
            suggestion=f"Reduce OVR or Effect Rank by {offense_total - off_cap}"
        ))
    
    # Defense band: DVR + Resilience <= DefCap
    defense_total = dvr + resilience
    if defense_total > def_cap:
        issues.append(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code=f"{pillar.upper()}_DEFENSE_CAP_EXCEEDED",
            message=f"{pillar} defense band exceeds cap: {defense_total} > {def_cap}",
            field=f"{pillar}_defense",
            current_value=defense_total,
            limit_value=def_cap,
            suggestion=f"Reduce DVR or Resilience by {defense_total - def_cap}"
        ))
    
    # Individual caps
    if ovr > ind_cap:
        issues.append(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code=f"{pillar.upper()}_OVR_CAP_EXCEEDED",
            message=f"{pillar} OVR exceeds individual cap: {ovr} > {ind_cap}",
            field=f"{pillar}_ovr",
            current_value=ovr,
            limit_value=ind_cap,
            suggestion=f"Reduce OVR by {ovr - ind_cap}"
        ))
    
    if dvr > ind_cap:
        issues.append(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code=f"{pillar.upper()}_DVR_CAP_EXCEEDED",
            message=f"{pillar} DVR exceeds individual cap: {dvr} > {ind_cap}",
            field=f"{pillar}_dvr",
            current_value=dvr,
            limit_value=ind_cap,
            suggestion=f"Reduce DVR by {dvr - ind_cap}"
        ))
    
    if effect_rank > ind_cap:
        issues.append(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code=f"{pillar.upper()}_EFFECT_CAP_EXCEEDED",
            message=f"{pillar} Effect Rank exceeds individual cap: {effect_rank} > {ind_cap}",
            field=f"{pillar}_effect_rank",
            current_value=effect_rank,
            limit_value=ind_cap,
            suggestion=f"Reduce Effect Rank by {effect_rank - ind_cap}"
        ))
    
    return issues


def validate_omni_defensive(stats: CharacterStats, scl: int) -> List[ValidationIssue]:
    """Validate omni-defensive restriction (only one pillar at full defense)."""
    issues = []
    
    # Calculate defense totals for each pillar
    pillars = [
        ("violence", stats.violence_dvr + stats.violence_resilience, stats.violence_pdb),
        ("influence", stats.influence_dvr + stats.influence_resilience, stats.influence_pdb),
        ("revelation", stats.revelation_dvr + stats.revelation_resilience, stats.revelation_pdb),
    ]
    
    # Count how many pillars are at full defense cap
    full_defense_count = 0
    for pillar, defense_total, pdb in pillars:
        def_cap = calculate_def_cap(scl, pdb)
        if defense_total >= def_cap:
            full_defense_count += 1
    
    # Only one pillar can be at full defense cap
    if full_defense_count > 1:
        issues.append(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code="OMNI_DEFENSIVE_VIOLATION",
            message=f"Only ONE pillar can be at full defense cap. {full_defense_count} pillars at full defense.",
            suggestion="Reduce defense in at least one pillar to ≤ 75% of cap"
        ))
    
    return issues


# =============================================================================
# SCP Budget Validation
# =============================================================================

def calculate_spent_scp(stats: CharacterStats) -> Dict[str, int]:
    """Calculate SCP spent on stats."""
    primary_stats = [
        stats.strength, stats.endurance, stats.agility,
        stats.technique, stats.willpower, stats.focus,
        stats.essence, stats.resolve, stats.presence
    ]
    
    aether_stats = [stats.control, stats.fate, stats.spirit]
    
    primary_cost = sum(max(0, s) * PRIMARY_STAT_COST for s in primary_stats)
    aether_cost = sum(max(0, s) * AETHER_STAT_COST for s in aether_stats)
    
    return {
        "primary_cost": primary_cost,
        "aether_cost": aether_cost,
        "total_stat_cost": primary_cost + aether_cost,
    }


def validate_scp_budget(stats: CharacterStats, scl: int) -> List[ValidationIssue]:
    """Validate SCP budget."""
    issues = []
    
    budget = calculate_scp_budget(scl)
    spent = calculate_spent_scp(stats)
    
    if spent["total_stat_cost"] > budget:
        issues.append(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code="SCP_BUDGET_EXCEEDED",
            message=f"SCP budget exceeded: {spent['total_stat_cost']} > {budget}",
            current_value=spent["total_stat_cost"],
            limit_value=budget,
            suggestion=f"Reduce stats to save {spent['total_stat_cost'] - budget} SCP"
        ))
    elif spent["total_stat_cost"] < budget * 0.9:
        remaining = budget - spent["total_stat_cost"]
        issues.append(ValidationIssue(
            severity=ValidationSeverity.INFO,
            code="SCP_BUDGET_UNDERUTILIZED",
            message=f"{remaining} SCP remaining. Consider spending on stats or techniques.",
            current_value=spent["total_stat_cost"],
            limit_value=budget
        ))
    
    return issues


# =============================================================================
# Tradeoff Advisor
# =============================================================================

def get_tradeoff_suggestions(
    pillar: str,
    ovr: int,
    dvr: int,
    effect_rank: int,
    resilience: int,
    scl: int,
    pdb: PDBProfile
) -> List[str]:
    """Get suggestions for fixing cap violations."""
    suggestions = []
    
    off_cap = calculate_off_cap(scl, pdb)
    def_cap = calculate_def_cap(scl, pdb)
    
    offense_total = ovr + effect_rank
    defense_total = dvr + resilience
    
    if offense_total > off_cap:
        excess = offense_total - off_cap
        suggestions.append(f"Reduce {pillar} OVR by {excess} (accuracy-leaning trade)")
        suggestions.append(f"Reduce {pillar} Effect Rank by {excess} (power-leaning trade)")
        if pdb == PDBProfile.BALANCED:
            suggestions.append("Consider Blood-Forward profile for +2 OffCap (costs -2 DefCap)")
    
    if defense_total > def_cap:
        excess = defense_total - def_cap
        suggestions.append(f"Reduce {pillar} DVR by {excess} (evasion-leaning trade)")
        suggestions.append(f"Reduce {pillar} Resilience by {excess} (toughness-leaning trade)")
        if pdb == PDBProfile.BALANCED:
            suggestions.append("Consider Ward-Forward profile for +2 DefCap (costs -2 OffCap)")
    
    return suggestions


# =============================================================================
# Main Validation Function
# =============================================================================

def validate_character(stats: CharacterStats) -> ValidationResult:
    """
    Validate a character against SRD rules.
    
    Returns ValidationResult with all issues and whether character is valid.
    """
    result = ValidationResult(is_valid=True)
    
    # Calculate SCL
    scl = calculate_scl(stats)
    cl = calculate_cl(stats)
    sl = calculate_sl(stats)
    
    # Store summary
    result.stats_summary = {
        "scl": scl,
        "cl": cl,
        "sl": sl,
        "sequence_band": get_sequence_band(scl).value,
        "body_core": calculate_body_core(stats),
        "mind_core": calculate_mind_core(stats),
        "soul_core": calculate_soul_core(stats),
    }
    
    # Validate SCP budget
    for issue in validate_scp_budget(stats, scl):
        result.issues.append(issue)
        if issue.severity == ValidationSeverity.ERROR:
            result.is_valid = False
    
    # Validate Violence pillar
    for issue in validate_pillar_caps(
        stats, scl, "violence",
        stats.violence_ovr, stats.violence_dvr,
        stats.violence_effect_rank, stats.violence_resilience,
        stats.violence_pdb
    ):
        result.issues.append(issue)
        if issue.severity == ValidationSeverity.ERROR:
            result.is_valid = False
    
    # Validate Influence pillar
    for issue in validate_pillar_caps(
        stats, scl, "influence",
        stats.influence_ovr, stats.influence_dvr,
        stats.influence_effect_rank, stats.influence_resilience,
        stats.influence_pdb
    ):
        result.issues.append(issue)
        if issue.severity == ValidationSeverity.ERROR:
            result.is_valid = False
    
    # Validate Revelation pillar
    for issue in validate_pillar_caps(
        stats, scl, "revelation",
        stats.revelation_ovr, stats.revelation_dvr,
        stats.revelation_effect_rank, stats.revelation_resilience,
        stats.revelation_pdb
    ):
        result.issues.append(issue)
        if issue.severity == ValidationSeverity.ERROR:
            result.is_valid = False
    
    # Validate omni-defensive restriction
    for issue in validate_omni_defensive(stats, scl):
        result.issues.append(issue)
        if issue.severity == ValidationSeverity.ERROR:
            result.is_valid = False
    
    return result


def recalculate_build(stats: CharacterStats) -> Dict:
    """
    Recalculate build and return full status.
    
    Returns dict with spentSCP, remainingSCP, capStatus, trackHooks.
    """
    scl = calculate_scl(stats)
    budget = calculate_scp_budget(scl)
    spent = calculate_spent_scp(stats)
    
    validation = validate_character(stats)
    
    return {
        "scl": scl,
        "cl": calculate_cl(stats),
        "sl": calculate_sl(stats),
        "sequence_band": get_sequence_band(scl).value,
        "spent_scp": spent["total_stat_cost"],
        "remaining_scp": budget - spent["total_stat_cost"],
        "total_budget": budget,
        "cap_status": {
            "is_valid": validation.is_valid,
            "errors": [
                {
                    "code": i.code,
                    "message": i.message,
                    "field": i.field,
                    "current": i.current_value,
                    "limit": i.limit_value,
                    "suggestion": i.suggestion,
                }
                for i in validation.get_errors()
            ],
            "warnings": [
                {
                    "code": i.code,
                    "message": i.message,
                }
                for i in validation.get_warnings()
            ],
        },
        "track_hooks": {
            "violence_pdb": stats.violence_pdb.value,
            "influence_pdb": stats.influence_pdb.value,
            "revelation_pdb": stats.revelation_pdb.value,
        },
    }
