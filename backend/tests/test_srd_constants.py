"""
Tests for SRD Constants Module

Tests the game constants and calculation functions defined in srd_constants.py
Reference: docs/wuxiaxian-reference/SRD_UNIFIED.md
"""

import pytest
from app.core.srd_constants import (
    # Version info
    SRD_VERSION,
    SRD_PATCH_ID,
    
    # Enums
    SequenceBand,
    PDBProfile,
    QuickAction,
    SPDBand,
    ConditionDegree,
    
    # Sequence functions
    get_sequence_band,
    
    # Cap functions
    CAP_MULTIPLIER,
    INDIVIDUAL_CAP_OFFSET,
    calculate_off_cap,
    calculate_def_cap,
    calculate_individual_cap,
    
    # SCP functions
    SCP_PER_SCL,
    calculate_scp_budget,
    
    # Resource functions
    calculate_thp,
    calculate_max_ae,
    calculate_ae_regen,
    calculate_max_strain,
    calculate_block_guard,
    
    # Resolve Charges
    calculate_prc,
    calculate_mrc,
    calculate_src,
    calculate_knockout_threshold,
    
    # DR
    get_dr_reduction,
    
    # Cost tracks
    calculate_cost_track_boxes,
    get_cost_track_threshold_effect,
    
    # Boss scaling
    get_boss_rank_config,
    generate_boss_baseline,
    
    # Conditions
    get_condition_degree,
    
    # SPD
    get_spd_band,
)


class TestVersionInfo:
    """Test SRD version information."""
    
    def test_version_format(self):
        """Version should be in X.Y format."""
        parts = SRD_VERSION.split(".")
        assert len(parts) == 2
        assert parts[0].isdigit()
        assert parts[1].isdigit()
    
    def test_patch_id_format(self):
        """Patch ID should follow ALPHA-X.Y-YYYYMMDD format."""
        assert SRD_PATCH_ID.startswith("ALPHA-")
        assert "-2025" in SRD_PATCH_ID  # Date component


class TestSequenceBands:
    """Test Sequence Band determination."""
    
    def test_cursed_sequence(self):
        """SCL 1-2 should be Cursed-Sequence."""
        assert get_sequence_band(1) == SequenceBand.CURSED
        assert get_sequence_band(2) == SequenceBand.CURSED
    
    def test_low_sequence(self):
        """SCL 3-4 should be Low-Sequence."""
        assert get_sequence_band(3) == SequenceBand.LOW
        assert get_sequence_band(4) == SequenceBand.LOW
    
    def test_mid_sequence(self):
        """SCL 5-7 should be Mid-Sequence."""
        assert get_sequence_band(5) == SequenceBand.MID
        assert get_sequence_band(6) == SequenceBand.MID
        assert get_sequence_band(7) == SequenceBand.MID
    
    def test_high_sequence(self):
        """SCL 8-10 should be High-Sequence."""
        assert get_sequence_band(8) == SequenceBand.HIGH
        assert get_sequence_band(9) == SequenceBand.HIGH
        assert get_sequence_band(10) == SequenceBand.HIGH
    
    def test_transcendent(self):
        """SCL 11+ should be Transcendent."""
        assert get_sequence_band(11) == SequenceBand.TRANSCENDENT
        assert get_sequence_band(15) == SequenceBand.TRANSCENDENT
        assert get_sequence_band(100) == SequenceBand.TRANSCENDENT


class TestCapCalculations:
    """Test cap calculation functions."""
    
    def test_balanced_caps(self):
        """Balanced profile should have equal OffCap and DefCap."""
        for scl in [3, 5, 7, 10]:
            off_cap = calculate_off_cap(scl, PDBProfile.BALANCED)
            def_cap = calculate_def_cap(scl, PDBProfile.BALANCED)
            assert off_cap == def_cap == CAP_MULTIPLIER * scl
    
    def test_blood_forward_caps(self):
        """Blood-Forward should have +2 OffCap, -2 DefCap."""
        scl = 5
        off_cap = calculate_off_cap(scl, PDBProfile.BLOOD_FORWARD)
        def_cap = calculate_def_cap(scl, PDBProfile.BLOOD_FORWARD)
        
        balanced_cap = CAP_MULTIPLIER * scl
        assert off_cap == balanced_cap + 2
        assert def_cap == balanced_cap - 2
    
    def test_ward_forward_caps(self):
        """Ward-Forward should have -2 OffCap, +2 DefCap."""
        scl = 5
        off_cap = calculate_off_cap(scl, PDBProfile.WARD_FORWARD)
        def_cap = calculate_def_cap(scl, PDBProfile.WARD_FORWARD)
        
        balanced_cap = CAP_MULTIPLIER * scl
        assert off_cap == balanced_cap - 2
        assert def_cap == balanced_cap + 2
    
    def test_individual_cap(self):
        """Individual cap should be SCL + 2."""
        for scl in [3, 5, 7, 10]:
            assert calculate_individual_cap(scl) == scl + INDIVIDUAL_CAP_OFFSET
    
    def test_cap_multiplier_is_four(self):
        """Cap multiplier should be 4 (not 2 as in older versions)."""
        assert CAP_MULTIPLIER == 4


class TestSCPBudget:
    """Test SCP budget calculations."""
    
    def test_scp_formula(self):
        """SCP budget should be 30 × SCL."""
        assert SCP_PER_SCL == 30
        
        for scl in [1, 5, 10]:
            assert calculate_scp_budget(scl) == 30 * scl
    
    def test_scp_budget_examples(self):
        """Test specific SCP budget values from SRD."""
        assert calculate_scp_budget(1) == 30
        assert calculate_scp_budget(5) == 150
        assert calculate_scp_budget(10) == 300


class TestResourceCalculations:
    """Test combat resource calculations."""
    
    def test_thp_formula(self):
        """THP = 10 + (Endurance × 5) + (purchased × 10)."""
        # Base case
        assert calculate_thp(0, 0) == 10
        
        # With endurance
        assert calculate_thp(5, 0) == 10 + (5 * 5)  # 35
        assert calculate_thp(10, 0) == 10 + (10 * 5)  # 60
        
        # With purchased ranks
        assert calculate_thp(5, 2) == 10 + 25 + 20  # 55
    
    def test_ae_formula(self):
        """AE = 10 + (Willpower × 2) + (purchased × 5)."""
        # Base case
        assert calculate_max_ae(0, 0) == 10
        
        # With willpower
        assert calculate_max_ae(5, 0) == 10 + (5 * 2)  # 20
        assert calculate_max_ae(10, 0) == 10 + (10 * 2)  # 30
        
        # With purchased ranks
        assert calculate_max_ae(5, 2) == 10 + 10 + 10  # 30
    
    def test_ae_regen_formula(self):
        """AE Regen = 1 + floor(Willpower / 3)."""
        assert calculate_ae_regen(0) == 1
        assert calculate_ae_regen(3) == 2
        assert calculate_ae_regen(6) == 3
        assert calculate_ae_regen(9) == 4
        assert calculate_ae_regen(4) == 2  # floor(4/3) = 1
    
    def test_strain_formula(self):
        """Max Strain = Endurance × 10."""
        assert calculate_max_strain(0) == 0
        assert calculate_max_strain(5) == 50
        assert calculate_max_strain(10) == 100
    
    def test_block_guard_formula(self):
        """Block Guard = Endurance × 2."""
        assert calculate_block_guard(0) == 0
        assert calculate_block_guard(5) == 10
        assert calculate_block_guard(10) == 20


class TestResolveCharges:
    """Test Resolve Charge calculations."""
    
    def test_prc_formula(self):
        """PRC = floor(Endurance / 2) + SCL bonus."""
        # Low SCL (no bonus)
        assert calculate_prc(4, 3) == 2 + 0  # 2
        assert calculate_prc(5, 4) == 2 + 0  # 2
        
        # Mid SCL (+1 bonus)
        assert calculate_prc(4, 5) == 2 + 1  # 3
        assert calculate_prc(6, 7) == 3 + 1  # 4
        
        # High SCL (+2 bonus)
        assert calculate_prc(4, 8) == 2 + 2  # 4
        
        # Transcendent (+3 bonus)
        assert calculate_prc(4, 11) == 2 + 3  # 5
    
    def test_knockout_threshold(self):
        """Knockout threshold = 5 + Core stat."""
        assert calculate_knockout_threshold(0) == 5
        assert calculate_knockout_threshold(5) == 10
        assert calculate_knockout_threshold(10) == 15


class TestDRTiers:
    """Test Damage Reduction tiers."""
    
    def test_dr_tier_values(self):
        """DR tiers should have correct reduction percentages."""
        assert get_dr_reduction(0) == 0.0
        assert get_dr_reduction(1) == 0.1
        assert get_dr_reduction(2) == 0.2
        assert get_dr_reduction(3) == 0.3
        assert get_dr_reduction(4) == 0.4
        assert get_dr_reduction(5) == 0.5
        assert get_dr_reduction(6) == 0.6
    
    def test_dr_tier_bounds(self):
        """DR tiers should handle out-of-range values."""
        assert get_dr_reduction(-1) == 0.0  # Negative defaults to 0
        assert get_dr_reduction(10) == 0.6  # Above max uses max tier


class TestCostTracks:
    """Test cost track calculations."""
    
    def test_cost_track_boxes(self):
        """Cost track boxes = 5 + floor(SCL / 2)."""
        assert calculate_cost_track_boxes(1) == 5 + 0  # 5
        assert calculate_cost_track_boxes(2) == 5 + 1  # 6
        assert calculate_cost_track_boxes(5) == 5 + 2  # 7
        assert calculate_cost_track_boxes(10) == 5 + 5  # 10
    
    def test_threshold_effects(self):
        """Threshold effects should be returned at correct percentages."""
        max_boxes = 10
        
        # Below first threshold (less than 25%)
        assert get_cost_track_threshold_effect(2, max_boxes) == ""
        
        # At 25% threshold
        effect_25 = get_cost_track_threshold_effect(3, max_boxes)
        assert effect_25 != ""  # Should have some effect
        
        # At/above 50%
        effect_50 = get_cost_track_threshold_effect(5, max_boxes)
        assert "penalty" in effect_50.lower()


class TestBossScaling:
    """Test boss scaling calculations."""
    
    def test_boss_rank_configs(self):
        """Boss rank configs should have correct values."""
        rank_1 = get_boss_rank_config(1)
        assert rank_1.thp_multiplier == 1.5
        assert rank_1.phases == 1
        
        rank_5 = get_boss_rank_config(5)
        assert rank_5.thp_multiplier == 5.0
        assert rank_5.phases == 3
    
    def test_boss_rank_bounds(self):
        """Boss rank should be clamped to 1-5."""
        assert get_boss_rank_config(0).rank == 1  # Clamped to 1
        assert get_boss_rank_config(6).rank == 5  # Clamped to 5
    
    def test_generate_boss_baseline(self):
        """Generate boss baseline should return valid structure."""
        baseline = generate_boss_baseline(party_scl=5, boss_rank=3)
        
        assert "recommended_bands" in baseline
        assert "health_pool" in baseline
        assert "resolve_charges" in baseline
        assert "dr_tier" in baseline
        assert "phases" in baseline
        
        # Check specific values
        assert baseline["dr_tier"] == 3
        assert baseline["phases"] == 1  # Rank 3 = 1 phase


class TestConditionDegrees:
    """Test condition degree determination."""
    
    def test_condition_degree_mapping(self):
        """Failure amounts should map to correct degrees."""
        # 1-4: 1st Degree
        assert get_condition_degree(1) == ConditionDegree.FIRST
        assert get_condition_degree(4) == ConditionDegree.FIRST
        
        # 5-9: 2nd Degree
        assert get_condition_degree(5) == ConditionDegree.SECOND
        assert get_condition_degree(9) == ConditionDegree.SECOND
        
        # 10-14: 3rd Degree
        assert get_condition_degree(10) == ConditionDegree.THIRD
        assert get_condition_degree(14) == ConditionDegree.THIRD
        
        # 15+: 4th Degree
        assert get_condition_degree(15) == ConditionDegree.FOURTH
        assert get_condition_degree(20) == ConditionDegree.FOURTH


class TestSPDBands:
    """Test SPD band determination."""
    
    def test_spd_band_thresholds(self):
        """SPD should map to correct bands."""
        # Slow: 0-1
        assert get_spd_band(0) == SPDBand.SLOW
        assert get_spd_band(1) == SPDBand.SLOW
        
        # Normal: 2-5
        assert get_spd_band(2) == SPDBand.NORMAL
        assert get_spd_band(5) == SPDBand.NORMAL
        
        # Fast: 6+
        assert get_spd_band(6) == SPDBand.FAST
        assert get_spd_band(10) == SPDBand.FAST
