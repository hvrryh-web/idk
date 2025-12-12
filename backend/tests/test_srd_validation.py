"""
Tests for SRD Validation Module

Tests the character validation functions against SRD rules.
Reference: docs/wuxiaxian-reference/SRD_UNIFIED.md
"""

import pytest
from app.core.srd_constants import PDBProfile
from app.core.srd_validation import (
    # Types
    CharacterStats,
    ValidationResult,
    ValidationSeverity,
    
    # Calculation functions
    calculate_body_core,
    calculate_mind_core,
    calculate_soul_core,
    calculate_cl,
    calculate_sl,
    calculate_scl,
    
    # Validation functions
    validate_pillar_caps,
    validate_omni_defensive,
    validate_scp_budget,
    validate_character,
    recalculate_build,
    
    # Helpers
    calculate_spent_scp,
    get_tradeoff_suggestions,
)


class TestCoreStatCalculations:
    """Test Core Stat calculation functions."""
    
    @pytest.fixture
    def sample_stats(self):
        """Create sample character stats."""
        return CharacterStats(
            strength=4, endurance=3, agility=5,
            technique=5, willpower=3, focus=4,
            essence=2, resolve=3, presence=2,
            control=2, fate=1, spirit=2,
        )
    
    def test_body_core_calculation(self, sample_stats):
        """Body Core = round((STR + END + AGI) / 3)."""
        # (4 + 3 + 5) / 3 = 4.0 -> 4
        assert calculate_body_core(sample_stats) == 4
    
    def test_mind_core_calculation(self, sample_stats):
        """Mind Core = round((TEC + WIL + FOC) / 3)."""
        # (5 + 3 + 4) / 3 = 4.0 -> 4
        assert calculate_mind_core(sample_stats) == 4
    
    def test_soul_core_calculation(self, sample_stats):
        """Soul Core = round((ESS + RES + PRE) / 3)."""
        # (2 + 3 + 2) / 3 = 2.33 -> 2
        assert calculate_soul_core(sample_stats) == 2
    
    def test_cl_calculation(self, sample_stats):
        """CL = floor((Body + Mind + Soul Core) / 3)."""
        # (4 + 4 + 2) / 3 = 3.33 -> 3
        assert calculate_cl(sample_stats) == 3
    
    def test_sl_calculation(self, sample_stats):
        """SL = floor((Control + Fate + Spirit) / 3)."""
        # (2 + 1 + 2) / 3 = 1.67 -> 1
        assert calculate_sl(sample_stats) == 1
    
    def test_scl_calculation(self, sample_stats):
        """SCL = CL + SL."""
        # 3 + 1 = 4
        assert calculate_scl(sample_stats) == 4


class TestSCLEdgeCases:
    """Test SCL calculation edge cases."""
    
    def test_zero_stats(self):
        """Zero stats should result in SCL 0."""
        stats = CharacterStats()  # All defaults to 0
        assert calculate_scl(stats) == 0
    
    def test_high_stats(self):
        """High stats should calculate correctly."""
        stats = CharacterStats(
            strength=10, endurance=10, agility=10,
            technique=10, willpower=10, focus=10,
            essence=10, resolve=10, presence=10,
            control=10, fate=10, spirit=10,
        )
        # Body/Mind/Soul Core = 10 each
        # CL = 10
        # SL = 10
        # SCL = 20
        assert calculate_scl(stats) == 20
    
    def test_asymmetric_stats(self):
        """Asymmetric stat distribution should floor correctly."""
        stats = CharacterStats(
            strength=1, endurance=1, agility=1,  # Body Core = 1
            technique=1, willpower=1, focus=1,    # Mind Core = 1
            essence=1, resolve=1, presence=1,     # Soul Core = 1
            control=0, fate=0, spirit=0,          # SL = 0
        )
        # CL = floor((1+1+1)/3) = 1
        # SL = 0
        # SCL = 1
        assert calculate_scl(stats) == 1


class TestCapValidation:
    """Test cap validation functions."""
    
    def test_valid_balanced_build(self):
        """Valid balanced build should pass validation."""
        stats = CharacterStats(
            strength=4, endurance=4, agility=4,
            technique=4, willpower=4, focus=4,
            essence=4, resolve=4, presence=4,
            control=3, fate=3, spirit=3,
            violence_ovr=5, violence_dvr=5,
            violence_effect_rank=5, violence_resilience=5,
            violence_pdb=PDBProfile.BALANCED,
        )
        scl = calculate_scl(stats)  # Should be ~5
        
        issues = validate_pillar_caps(
            stats, scl, "violence",
            stats.violence_ovr, stats.violence_dvr,
            stats.violence_effect_rank, stats.violence_resilience,
            stats.violence_pdb
        )
        
        # Should have no errors
        errors = [i for i in issues if i.severity == ValidationSeverity.ERROR]
        assert len(errors) == 0
    
    def test_offense_cap_exceeded(self):
        """Exceeding offense cap should generate error."""
        stats = CharacterStats()
        scl = 5  # OffCap = 20 for Balanced
        
        issues = validate_pillar_caps(
            stats, scl, "violence",
            ovr=12, dvr=5,
            effect_rank=10, resilience=5,  # 12 + 10 = 22 > 20
            pdb=PDBProfile.BALANCED
        )
        
        errors = [i for i in issues if i.severity == ValidationSeverity.ERROR]
        assert len(errors) > 0
        assert any("offense" in e.code.lower() for e in errors)
    
    def test_defense_cap_exceeded(self):
        """Exceeding defense cap should generate error."""
        stats = CharacterStats()
        scl = 5  # DefCap = 20 for Balanced
        
        issues = validate_pillar_caps(
            stats, scl, "violence",
            ovr=5, dvr=12,
            effect_rank=5, resilience=10,  # 12 + 10 = 22 > 20
            pdb=PDBProfile.BALANCED
        )
        
        errors = [i for i in issues if i.severity == ValidationSeverity.ERROR]
        assert len(errors) > 0
        assert any("defense" in e.code.lower() for e in errors)
    
    def test_individual_cap_exceeded(self):
        """Exceeding individual cap should generate error."""
        stats = CharacterStats()
        scl = 5  # Individual cap = 7
        
        issues = validate_pillar_caps(
            stats, scl, "violence",
            ovr=8, dvr=5,  # OVR 8 > 7
            effect_rank=5, resilience=5,
            pdb=PDBProfile.BALANCED
        )
        
        errors = [i for i in issues if i.severity == ValidationSeverity.ERROR]
        assert len(errors) > 0
        assert any("ovr" in e.code.lower() for e in errors)
    
    def test_blood_forward_allows_higher_offense(self):
        """Blood-Forward should allow +2 offense."""
        stats = CharacterStats()
        scl = 5  # OffCap = 22 for Blood-Forward
        
        issues = validate_pillar_caps(
            stats, scl, "violence",
            ovr=7, dvr=5,
            effect_rank=7, resilience=4,  # 7 + 7 = 14 < 22
            pdb=PDBProfile.BLOOD_FORWARD
        )
        
        errors = [i for i in issues if i.severity == ValidationSeverity.ERROR]
        # Should be valid (within Blood-Forward caps)
        assert not any("offense" in e.code.lower() and "cap" in e.code.lower() for e in errors)


class TestOmniDefensiveValidation:
    """Test omni-defensive restriction."""
    
    def test_single_full_defense_allowed(self):
        """One pillar at full defense should be allowed."""
        stats = CharacterStats(
            strength=4, endurance=4, agility=4,
            technique=4, willpower=4, focus=4,
            essence=4, resolve=4, presence=4,
            control=3, fate=3, spirit=3,
            violence_dvr=10, violence_resilience=10,  # Full
            influence_dvr=5, influence_resilience=5,   # Reduced
            revelation_dvr=5, revelation_resilience=5, # Reduced
        )
        scl = 5
        
        issues = validate_omni_defensive(stats, scl)
        errors = [i for i in issues if i.severity == ValidationSeverity.ERROR]
        assert len(errors) == 0
    
    def test_multiple_full_defense_not_allowed(self):
        """Multiple pillars at full defense should fail."""
        stats = CharacterStats(
            strength=4, endurance=4, agility=4,
            technique=4, willpower=4, focus=4,
            essence=4, resolve=4, presence=4,
            control=3, fate=3, spirit=3,
            violence_dvr=10, violence_resilience=10,    # Full (20)
            influence_dvr=10, influence_resilience=10,  # Full (20)
            revelation_dvr=5, revelation_resilience=5,  # Reduced
        )
        scl = 5
        
        issues = validate_omni_defensive(stats, scl)
        errors = [i for i in issues if i.severity == ValidationSeverity.ERROR]
        assert len(errors) > 0
        assert any("omni" in e.code.lower() for e in errors)


class TestSCPBudgetValidation:
    """Test SCP budget validation."""
    
    def test_within_budget(self):
        """Stats within budget should pass."""
        # SCL 5 = 150 SCP budget
        # 9 primary stats at rank 4 = 9 * 4 * 2 = 72 SCP
        # 3 aether stats at rank 3 = 3 * 3 * 3 = 27 SCP
        # Total = 99 SCP < 150
        stats = CharacterStats(
            strength=4, endurance=4, agility=4,
            technique=4, willpower=4, focus=4,
            essence=4, resolve=4, presence=4,
            control=3, fate=3, spirit=3,
        )
        scl = 5
        
        issues = validate_scp_budget(stats, scl)
        errors = [i for i in issues if i.severity == ValidationSeverity.ERROR]
        assert len(errors) == 0
    
    def test_exceeds_budget(self):
        """Stats exceeding budget should fail."""
        # All stats at 10 would cost way more than budget
        stats = CharacterStats(
            strength=10, endurance=10, agility=10,
            technique=10, willpower=10, focus=10,
            essence=10, resolve=10, presence=10,
            control=10, fate=10, spirit=10,
        )
        scl = 5  # Budget = 150, but stats cost 9*10*2 + 3*10*3 = 180 + 90 = 270
        
        issues = validate_scp_budget(stats, scl)
        errors = [i for i in issues if i.severity == ValidationSeverity.ERROR]
        assert len(errors) > 0
        assert any("budget" in e.code.lower() for e in errors)


class TestFullCharacterValidation:
    """Test complete character validation."""
    
    def test_valid_character(self):
        """Valid character should pass all validation."""
        stats = CharacterStats(
            strength=4, endurance=4, agility=4,
            technique=4, willpower=4, focus=4,
            essence=4, resolve=4, presence=4,
            control=3, fate=3, spirit=3,
            violence_ovr=5, violence_dvr=5,
            violence_effect_rank=5, violence_resilience=5,
            violence_pdb=PDBProfile.BALANCED,
            influence_ovr=3, influence_dvr=3,
            influence_effect_rank=3, influence_resilience=3,
            influence_pdb=PDBProfile.BALANCED,
            revelation_ovr=3, revelation_dvr=3,
            revelation_effect_rank=3, revelation_resilience=3,
            revelation_pdb=PDBProfile.BALANCED,
        )
        
        result = validate_character(stats)
        
        assert result.is_valid
        assert len(result.get_errors()) == 0
    
    def test_invalid_character_returns_errors(self):
        """Invalid character should return specific errors."""
        # Create a character with caps exceeded for SCL 5
        # SCL 5 = OffCap 20, IndCap 7, but we set values higher
        stats = CharacterStats(
            strength=4, endurance=4, agility=4,
            technique=4, willpower=4, focus=4,
            essence=4, resolve=4, presence=4,
            control=3, fate=3, spirit=3,
            # With these stats, SCL ~5, so OffCap = 20, IndCap = 7
            violence_ovr=15, violence_dvr=15,  # 15 > 7 (individual cap)
            violence_effect_rank=15, violence_resilience=15,  # 15 + 15 = 30 > 20
            violence_pdb=PDBProfile.BALANCED,
        )
        
        result = validate_character(stats)
        
        assert not result.is_valid
        assert len(result.get_errors()) > 0
    
    def test_validation_includes_stats_summary(self):
        """Validation result should include stats summary."""
        stats = CharacterStats(
            strength=4, endurance=3, agility=5,
            technique=5, willpower=3, focus=4,
            essence=2, resolve=3, presence=2,
            control=2, fate=1, spirit=2,
        )
        
        result = validate_character(stats)
        
        assert "scl" in result.stats_summary
        assert "cl" in result.stats_summary
        assert "sl" in result.stats_summary
        assert "sequence_band" in result.stats_summary


class TestRecalculateBuild:
    """Test build recalculation function."""
    
    def test_recalculate_returns_scp_info(self):
        """Recalculate should return SCP spent and remaining."""
        stats = CharacterStats(
            strength=4, endurance=4, agility=4,
            technique=4, willpower=4, focus=4,
            essence=4, resolve=4, presence=4,
            control=3, fate=3, spirit=3,
        )
        
        result = recalculate_build(stats)
        
        assert "spent_scp" in result
        assert "remaining_scp" in result
        assert "total_budget" in result
        assert result["remaining_scp"] == result["total_budget"] - result["spent_scp"]
    
    def test_recalculate_includes_cap_status(self):
        """Recalculate should include cap validation status."""
        stats = CharacterStats()
        
        result = recalculate_build(stats)
        
        assert "cap_status" in result
        assert "is_valid" in result["cap_status"]
    
    def test_recalculate_includes_track_hooks(self):
        """Recalculate should include PDB profile info for track hooks."""
        stats = CharacterStats(
            violence_pdb=PDBProfile.BLOOD_FORWARD,
        )
        
        result = recalculate_build(stats)
        
        assert "track_hooks" in result
        assert result["track_hooks"]["violence_pdb"] == "Blood-Forward"


class TestTradeoffSuggestions:
    """Test tradeoff advisor suggestions."""
    
    def test_offense_exceeded_suggestions(self):
        """Should suggest reducing OVR or Effect Rank for offense violation."""
        suggestions = get_tradeoff_suggestions(
            "violence",
            ovr=10, dvr=5,
            effect_rank=15, resilience=5,  # 10 + 15 = 25 > 20
            scl=5,
            pdb=PDBProfile.BALANCED
        )
        
        assert len(suggestions) > 0
        assert any("OVR" in s for s in suggestions)
        assert any("Effect Rank" in s for s in suggestions)
    
    def test_defense_exceeded_suggestions(self):
        """Should suggest reducing DVR or Resilience for defense violation."""
        suggestions = get_tradeoff_suggestions(
            "violence",
            ovr=5, dvr=15,
            effect_rank=5, resilience=10,  # 15 + 10 = 25 > 20
            scl=5,
            pdb=PDBProfile.BALANCED
        )
        
        assert len(suggestions) > 0
        assert any("DVR" in s for s in suggestions)
        assert any("Resilience" in s for s in suggestions)
    
    def test_valid_build_no_suggestions(self):
        """Valid build should return no suggestions."""
        suggestions = get_tradeoff_suggestions(
            "violence",
            ovr=5, dvr=5,
            effect_rank=5, resilience=5,  # 10 <= 20, valid
            scl=5,
            pdb=PDBProfile.BALANCED
        )
        
        assert len(suggestions) == 0


class TestSpentSCPCalculation:
    """Test SCP spending calculation."""
    
    def test_primary_stat_cost(self):
        """Primary stats should cost 2 SCP per rank."""
        stats = CharacterStats(strength=5)  # 5 * 2 = 10 SCP
        spent = calculate_spent_scp(stats)
        assert spent["primary_cost"] == 10
    
    def test_aether_stat_cost(self):
        """Aether stats should cost 3 SCP per rank."""
        stats = CharacterStats(control=5)  # 5 * 3 = 15 SCP
        spent = calculate_spent_scp(stats)
        assert spent["aether_cost"] == 15
    
    def test_combined_cost(self):
        """Total should be sum of primary and aether costs."""
        stats = CharacterStats(
            strength=5,   # 10 SCP
            control=5,    # 15 SCP
        )
        spent = calculate_spent_scp(stats)
        assert spent["total_stat_cost"] == 25
    
    def test_negative_stats_not_counted(self):
        """Negative stats should not add to cost."""
        stats = CharacterStats(strength=-1)
        spent = calculate_spent_scp(stats)
        assert spent["primary_cost"] == 0
