"""
SRD Diagnostics Module

This module provides diagnostic and troubleshooting tools for the
SRD-informed combat engine and character profile systems.

Reference: docs/wuxiaxian-reference/SRD_UNIFIED.md
Patch: ALPHA-0.3-20251212
"""

import json
import logging
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple

from app.core.srd_constants import (
    SRD_VERSION,
    SRD_PATCH_ID,
    SRD_DATE,
    get_sequence_band,
    calculate_off_cap,
    calculate_def_cap,
    calculate_thp,
    calculate_max_ae,
    calculate_ae_regen,
    calculate_max_strain,
    calculate_prc,
    calculate_mrc,
    calculate_src,
    get_dr_reduction,
    generate_boss_baseline,
    PDBProfile,
)


# =============================================================================
# Logging Configuration
# =============================================================================

logger = logging.getLogger("srd_diagnostics")


# =============================================================================
# Diagnostic Types
# =============================================================================

class DiagnosticLevel(str, Enum):
    """Diagnostic severity level."""
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class DiagnosticCategory(str, Enum):
    """Category of diagnostic issue."""
    SCL_CALCULATION = "scl_calculation"
    CAP_VALIDATION = "cap_validation"
    RESOURCE_CALCULATION = "resource_calculation"
    DURABILITY = "durability"
    COMBAT_STATE = "combat_state"
    BOSS_SCALING = "boss_scaling"
    META_CURRENCY = "meta_currency"
    COST_TRACK = "cost_track"
    INTEGRATION = "integration"


@dataclass
class DiagnosticEntry:
    """A single diagnostic entry."""
    timestamp: str
    level: DiagnosticLevel
    category: DiagnosticCategory
    code: str
    message: str
    context: Dict[str, Any] = field(default_factory=dict)
    suggestion: Optional[str] = None
    
    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        return {
            "timestamp": self.timestamp,
            "level": self.level.value,
            "category": self.category.value,
            "code": self.code,
            "message": self.message,
            "context": self.context,
            "suggestion": self.suggestion,
        }


@dataclass 
class DiagnosticReport:
    """Complete diagnostic report."""
    srd_version: str = SRD_VERSION
    srd_patch_id: str = SRD_PATCH_ID
    generated_at: str = ""
    entries: List[DiagnosticEntry] = field(default_factory=list)
    summary: Dict[str, int] = field(default_factory=dict)
    
    def __post_init__(self):
        if not self.generated_at:
            self.generated_at = datetime.now(timezone.utc).isoformat()
    
    def add_entry(
        self,
        level: DiagnosticLevel,
        category: DiagnosticCategory,
        code: str,
        message: str,
        context: Optional[Dict] = None,
        suggestion: Optional[str] = None
    ):
        """Add a diagnostic entry."""
        self.entries.append(DiagnosticEntry(
            timestamp=datetime.now(timezone.utc).isoformat(),
            level=level,
            category=category,
            code=code,
            message=message,
            context=context or {},
            suggestion=suggestion,
        ))
        
        # Update summary
        level_key = level.value
        self.summary[level_key] = self.summary.get(level_key, 0) + 1
    
    def has_errors(self) -> bool:
        """Check if report has error or critical entries."""
        return (
            self.summary.get("error", 0) > 0 or
            self.summary.get("critical", 0) > 0
        )
    
    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        return {
            "srd_version": self.srd_version,
            "srd_patch_id": self.srd_patch_id,
            "generated_at": self.generated_at,
            "entries": [e.to_dict() for e in self.entries],
            "summary": self.summary,
            "has_errors": self.has_errors(),
        }
    
    def to_json(self) -> str:
        """Convert to JSON string."""
        return json.dumps(self.to_dict(), indent=2)


# =============================================================================
# SCL Diagnostics
# =============================================================================

def diagnose_scl_calculation(
    primary_stats: Dict[str, int],
    aether_stats: Dict[str, int],
    expected_scl: Optional[int] = None
) -> DiagnosticReport:
    """
    Diagnose SCL calculation from stats.
    
    Args:
        primary_stats: Dict with strength, endurance, agility, technique, 
                      willpower, focus, essence, resolve, presence
        aether_stats: Dict with control, fate, spirit
        expected_scl: If provided, compare calculated SCL to expected
        
    Returns:
        DiagnosticReport with calculation steps and any issues
    """
    report = DiagnosticReport()
    
    # Validate input
    required_primary = ["strength", "endurance", "agility", "technique", 
                        "willpower", "focus", "essence", "resolve", "presence"]
    required_aether = ["control", "fate", "spirit"]
    
    for stat in required_primary:
        if stat not in primary_stats:
            report.add_entry(
                DiagnosticLevel.ERROR,
                DiagnosticCategory.SCL_CALCULATION,
                "MISSING_PRIMARY_STAT",
                f"Missing primary stat: {stat}",
                {"stat": stat},
                f"Add {stat} to primary_stats dict"
            )
    
    for stat in required_aether:
        if stat not in aether_stats:
            report.add_entry(
                DiagnosticLevel.ERROR,
                DiagnosticCategory.SCL_CALCULATION,
                "MISSING_AETHER_STAT",
                f"Missing aether stat: {stat}",
                {"stat": stat},
                f"Add {stat} to aether_stats dict"
            )
    
    if report.has_errors():
        return report
    
    # Calculate Core Stats
    body_core = round((
        primary_stats["strength"] + 
        primary_stats["endurance"] + 
        primary_stats["agility"]
    ) / 3)
    
    mind_core = round((
        primary_stats["technique"] + 
        primary_stats["willpower"] + 
        primary_stats["focus"]
    ) / 3)
    
    soul_core = round((
        primary_stats["essence"] + 
        primary_stats["resolve"] + 
        primary_stats["presence"]
    ) / 3)
    
    report.add_entry(
        DiagnosticLevel.DEBUG,
        DiagnosticCategory.SCL_CALCULATION,
        "CORE_STATS_CALCULATED",
        f"Core Stats: Body={body_core}, Mind={mind_core}, Soul={soul_core}",
        {
            "body_core": body_core,
            "mind_core": mind_core,
            "soul_core": soul_core,
            "body_components": [
                primary_stats["strength"],
                primary_stats["endurance"],
                primary_stats["agility"]
            ],
            "mind_components": [
                primary_stats["technique"],
                primary_stats["willpower"],
                primary_stats["focus"]
            ],
            "soul_components": [
                primary_stats["essence"],
                primary_stats["resolve"],
                primary_stats["presence"]
            ],
        }
    )
    
    # Calculate CL
    cl = (body_core + mind_core + soul_core) // 3
    
    report.add_entry(
        DiagnosticLevel.DEBUG,
        DiagnosticCategory.SCL_CALCULATION,
        "CL_CALCULATED",
        f"Core Level (CL) = floor(({body_core}+{mind_core}+{soul_core})/3) = {cl}",
        {"cl": cl}
    )
    
    # Calculate SL
    sl = (
        aether_stats["control"] + 
        aether_stats["fate"] + 
        aether_stats["spirit"]
    ) // 3
    
    report.add_entry(
        DiagnosticLevel.DEBUG,
        DiagnosticCategory.SCL_CALCULATION,
        "SL_CALCULATED",
        f"Soul Level (SL) = floor(({aether_stats['control']}+{aether_stats['fate']}+{aether_stats['spirit']})/3) = {sl}",
        {"sl": sl}
    )
    
    # Calculate SCL
    scl = cl + sl
    sequence_band = get_sequence_band(scl)
    
    report.add_entry(
        DiagnosticLevel.INFO,
        DiagnosticCategory.SCL_CALCULATION,
        "SCL_CALCULATED",
        f"SCL = CL({cl}) + SL({sl}) = {scl} ({sequence_band.value})",
        {
            "scl": scl,
            "cl": cl,
            "sl": sl,
            "sequence_band": sequence_band.value,
        }
    )
    
    # Compare to expected if provided
    if expected_scl is not None and expected_scl != scl:
        report.add_entry(
            DiagnosticLevel.WARNING,
            DiagnosticCategory.SCL_CALCULATION,
            "SCL_MISMATCH",
            f"Calculated SCL ({scl}) differs from expected ({expected_scl})",
            {"calculated": scl, "expected": expected_scl},
            "Review stat values or expected SCL"
        )
    
    return report


# =============================================================================
# Resource Diagnostics
# =============================================================================

def diagnose_combat_resources(
    endurance: int,
    willpower: int,
    resolve: int,
    scl: int,
    purchased_hp_ranks: int = 0,
    purchased_ae_ranks: int = 0,
) -> DiagnosticReport:
    """
    Diagnose combat resource calculations.
    
    Returns report with calculated THP, AE, Strain, Resolve Charges.
    """
    report = DiagnosticReport()
    
    # THP
    thp = calculate_thp(endurance, purchased_hp_ranks)
    report.add_entry(
        DiagnosticLevel.INFO,
        DiagnosticCategory.RESOURCE_CALCULATION,
        "THP_CALCULATED",
        f"THP = 10 + ({endurance} × 5) + ({purchased_hp_ranks} × 10) = {thp}",
        {
            "thp": thp,
            "endurance": endurance,
            "purchased_ranks": purchased_hp_ranks,
        }
    )
    
    # AE
    max_ae = calculate_max_ae(willpower, purchased_ae_ranks)
    ae_regen = calculate_ae_regen(willpower)
    report.add_entry(
        DiagnosticLevel.INFO,
        DiagnosticCategory.RESOURCE_CALCULATION,
        "AE_CALCULATED",
        f"Max AE = {max_ae}, Regen = {ae_regen}/round",
        {
            "max_ae": max_ae,
            "ae_regen": ae_regen,
            "willpower": willpower,
            "purchased_ranks": purchased_ae_ranks,
        }
    )
    
    # Strain
    max_strain = calculate_max_strain(endurance)
    report.add_entry(
        DiagnosticLevel.INFO,
        DiagnosticCategory.RESOURCE_CALCULATION,
        "STRAIN_CALCULATED",
        f"Max Strain = {endurance} × 10 = {max_strain}",
        {"max_strain": max_strain, "endurance": endurance}
    )
    
    # Resolve Charges
    prc = calculate_prc(endurance, scl)
    mrc = calculate_mrc(willpower, scl)
    src = calculate_src(resolve, scl)
    report.add_entry(
        DiagnosticLevel.INFO,
        DiagnosticCategory.RESOURCE_CALCULATION,
        "RESOLVE_CHARGES_CALCULATED",
        f"Resolve Charges: PRC={prc}, MRC={mrc}, SRC={src}",
        {
            "prc": prc,
            "mrc": mrc,
            "src": src,
            "scl": scl,
        }
    )
    
    return report


# =============================================================================
# Combat State Diagnostics
# =============================================================================

def diagnose_combat_state(
    combatant_data: Dict[str, Any],
) -> DiagnosticReport:
    """
    Diagnose a combatant's combat state.
    
    Args:
        combatant_data: Dict with thp, ae, strain, guard, dr, etc.
        
    Returns:
        DiagnosticReport with state analysis
    """
    report = DiagnosticReport()
    
    # Check THP
    thp = combatant_data.get("thp", 0)
    max_thp = combatant_data.get("max_thp", 100)
    if thp <= 0:
        report.add_entry(
            DiagnosticLevel.WARNING,
            DiagnosticCategory.COMBAT_STATE,
            "COMBATANT_DOWN",
            "Combatant has 0 or less THP (unconscious/dying)",
            {"thp": thp, "max_thp": max_thp}
        )
    elif thp < max_thp * 0.25:
        report.add_entry(
            DiagnosticLevel.INFO,
            DiagnosticCategory.COMBAT_STATE,
            "THP_CRITICAL",
            f"THP critically low: {thp}/{max_thp} ({thp*100//max_thp}%)",
            {"thp": thp, "max_thp": max_thp}
        )
    
    # Check Strain
    strain = combatant_data.get("strain", 0)
    endurance = combatant_data.get("endurance", 5)
    max_strain = endurance * 10
    if strain >= max_strain:
        report.add_entry(
            DiagnosticLevel.CRITICAL,
            DiagnosticCategory.COMBAT_STATE,
            "STRAIN_DEATH",
            f"Strain at maximum ({strain}/{max_strain}) - combatant should be dead",
            {"strain": strain, "max_strain": max_strain}
        )
    elif strain >= max_strain * 0.75:
        report.add_entry(
            DiagnosticLevel.WARNING,
            DiagnosticCategory.COMBAT_STATE,
            "STRAIN_HIGH",
            f"Strain dangerously high: {strain}/{max_strain} ({strain*100//max_strain}%)",
            {"strain": strain, "max_strain": max_strain}
        )
    
    # Check AE
    ae = combatant_data.get("ae", 0)
    max_ae = combatant_data.get("max_ae", 20)
    if ae <= 0:
        report.add_entry(
            DiagnosticLevel.INFO,
            DiagnosticCategory.COMBAT_STATE,
            "AE_DEPLETED",
            "AE depleted - can only use Quick Actions",
            {"ae": ae, "max_ae": max_ae}
        )
    
    # Check DR
    dr = combatant_data.get("dr", 0.0)
    if dr > 0.5:
        report.add_entry(
            DiagnosticLevel.INFO,
            DiagnosticCategory.COMBAT_STATE,
            "HIGH_DR",
            f"Very high DR: {dr*100:.0f}% reduction",
            {"dr": dr}
        )
    
    return report


# =============================================================================
# Boss Scaling Diagnostics
# =============================================================================

def diagnose_boss_scaling(
    party_scl: int,
    boss_rank: int,
    actual_boss_stats: Optional[Dict] = None
) -> DiagnosticReport:
    """
    Diagnose boss scaling and compare to SRD recommendations.
    
    Args:
        party_scl: Average party SCL
        boss_rank: Boss rank (1-5)
        actual_boss_stats: If provided, compare to recommendations
        
    Returns:
        DiagnosticReport with scaling analysis
    """
    report = DiagnosticReport()
    
    # Generate baseline
    baseline = generate_boss_baseline(party_scl, boss_rank)
    
    report.add_entry(
        DiagnosticLevel.INFO,
        DiagnosticCategory.BOSS_SCALING,
        "BASELINE_GENERATED",
        f"Generated Rank {boss_rank} boss baseline for party SCL {party_scl}",
        {
            "party_scl": party_scl,
            "boss_rank": boss_rank,
            "baseline": baseline,
        }
    )
    
    # Compare if actual stats provided
    if actual_boss_stats:
        actual_thp = actual_boss_stats.get("thp", 0)
        recommended_thp = baseline["health_pool"]["total_thp"]
        
        if actual_thp < recommended_thp * 0.75:
            report.add_entry(
                DiagnosticLevel.WARNING,
                DiagnosticCategory.BOSS_SCALING,
                "BOSS_THP_LOW",
                f"Boss THP ({actual_thp}) significantly below recommendation ({recommended_thp})",
                {"actual": actual_thp, "recommended": recommended_thp},
                f"Increase boss THP to at least {int(recommended_thp * 0.75)}"
            )
        elif actual_thp > recommended_thp * 1.5:
            report.add_entry(
                DiagnosticLevel.WARNING,
                DiagnosticCategory.BOSS_SCALING,
                "BOSS_THP_HIGH",
                f"Boss THP ({actual_thp}) significantly above recommendation ({recommended_thp})",
                {"actual": actual_thp, "recommended": recommended_thp},
                "Consider reducing THP for balanced encounter"
            )
    
    return report


# =============================================================================
# Integration Health Check
# =============================================================================

def run_integration_health_check() -> DiagnosticReport:
    """
    Run a health check on SRD integration components.
    
    Returns DiagnosticReport with integration status.
    """
    report = DiagnosticReport()
    
    # Check SRD constants are loadable
    try:
        from app.core.srd_constants import SRD_VERSION
        report.add_entry(
            DiagnosticLevel.INFO,
            DiagnosticCategory.INTEGRATION,
            "SRD_CONSTANTS_LOADED",
            f"SRD constants module loaded (version {SRD_VERSION})",
            {"version": SRD_VERSION}
        )
    except ImportError as e:
        report.add_entry(
            DiagnosticLevel.ERROR,
            DiagnosticCategory.INTEGRATION,
            "SRD_CONSTANTS_MISSING",
            f"Failed to import SRD constants: {e}",
            suggestion="Ensure backend/app/core/srd_constants.py exists"
        )
    
    # Check SRD validation is loadable
    try:
        from app.core.srd_validation import validate_character
        report.add_entry(
            DiagnosticLevel.INFO,
            DiagnosticCategory.INTEGRATION,
            "SRD_VALIDATION_LOADED",
            "SRD validation module loaded",
        )
    except ImportError as e:
        report.add_entry(
            DiagnosticLevel.ERROR,
            DiagnosticCategory.INTEGRATION,
            "SRD_VALIDATION_MISSING",
            f"Failed to import SRD validation: {e}",
            suggestion="Ensure backend/app/core/srd_validation.py exists"
        )
    
    # Verify calculation functions work
    try:
        test_scl = 5
        off_cap = calculate_off_cap(test_scl, PDBProfile.BALANCED)
        def_cap = calculate_def_cap(test_scl, PDBProfile.BALANCED)
        
        if off_cap != 20:  # 4 * 5 = 20
            report.add_entry(
                DiagnosticLevel.ERROR,
                DiagnosticCategory.INTEGRATION,
                "CAP_CALCULATION_ERROR",
                f"OffCap calculation incorrect: expected 20, got {off_cap}",
                {"scl": test_scl, "result": off_cap, "expected": 20}
            )
        else:
            report.add_entry(
                DiagnosticLevel.INFO,
                DiagnosticCategory.INTEGRATION,
                "CAP_CALCULATION_OK",
                "Cap calculation functions verified",
                {"test_scl": test_scl, "off_cap": off_cap, "def_cap": def_cap}
            )
    except Exception as e:
        report.add_entry(
            DiagnosticLevel.ERROR,
            DiagnosticCategory.INTEGRATION,
            "CAP_CALCULATION_EXCEPTION",
            f"Cap calculation threw exception: {e}",
        )
    
    # Verify resource calculations
    try:
        thp = calculate_thp(5, 0)
        expected_thp = 10 + (5 * 5) + 0  # 35
        if thp != expected_thp:
            report.add_entry(
                DiagnosticLevel.ERROR,
                DiagnosticCategory.INTEGRATION,
                "THP_CALCULATION_ERROR",
                f"THP calculation incorrect: expected {expected_thp}, got {thp}",
            )
        else:
            report.add_entry(
                DiagnosticLevel.INFO,
                DiagnosticCategory.INTEGRATION,
                "RESOURCE_CALCULATION_OK",
                "Resource calculation functions verified",
            )
    except Exception as e:
        report.add_entry(
            DiagnosticLevel.ERROR,
            DiagnosticCategory.INTEGRATION,
            "RESOURCE_CALCULATION_EXCEPTION",
            f"Resource calculation threw exception: {e}",
        )
    
    # Summary
    if report.has_errors():
        report.add_entry(
            DiagnosticLevel.ERROR,
            DiagnosticCategory.INTEGRATION,
            "HEALTH_CHECK_FAILED",
            "Integration health check FAILED - see errors above",
        )
    else:
        report.add_entry(
            DiagnosticLevel.INFO,
            DiagnosticCategory.INTEGRATION,
            "HEALTH_CHECK_PASSED",
            "Integration health check PASSED",
        )
    
    return report


# =============================================================================
# CLI Interface
# =============================================================================

def main():
    """Run diagnostic checks from command line."""
    print(f"SRD Diagnostics - Version {SRD_VERSION}")
    print(f"Patch: {SRD_PATCH_ID}")
    print(f"Date: {SRD_DATE}")
    print("=" * 50)
    
    # Run integration health check
    print("\nRunning integration health check...")
    report = run_integration_health_check()
    
    print(f"\nResults: {len(report.entries)} diagnostic entries")
    print(f"Summary: {report.summary}")
    
    for entry in report.entries:
        level_icons = {
            "debug": "🔍",
            "info": "ℹ️",
            "warning": "⚠️",
            "error": "❌",
            "critical": "🔴",
        }
        icon = level_icons.get(entry.level.value, "•")
        print(f"{icon} [{entry.level.value.upper()}] {entry.code}: {entry.message}")
        if entry.suggestion:
            print(f"   → Suggestion: {entry.suggestion}")
    
    print("\n" + "=" * 50)
    if report.has_errors():
        print("STATUS: FAILED")
        sys.exit(1)
    else:
        print("STATUS: PASSED")
        sys.exit(0)


if __name__ == "__main__":
    main()
