"""
Tests for Core Resolution Engine Module

Tests the resolution functions defined in resolution_engine.py per ADR-0001.
Reference: docs/adr/ADR-0001-core-resolution-engine.md
"""

import pytest
from app.core.resolution_engine import (
    # Constants
    K,
    DOS_MIN,
    DOS_MAX,
    
    # Approach enum
    Approach,
    
    # Rank dice functions
    get_rank_dice_pool,
    roll_rank_dice,
    roll_rank_dice_detailed,
    get_rank_dice_notation,
    
    # DoS functions
    compute_dos,
    get_dos_band,
    
    # Nat shift functions
    nat_shift,
    apply_nat_shift,
    
    # Total computation
    compute_total,
    roll_total,
    
    # Resolution functions
    resolve_opposed,
    resolve_tn,
    
    # Utilities
    get_rank_from_approach,
    interpret_dos,
)


class TestConstants:
    """Test ADR-0001 locked constants."""
    
    def test_k_is_four(self):
        """K must be 4 (locked per ADR-0001)."""
        assert K == 4
    
    def test_dos_range(self):
        """DoS range must be [-4, +4]."""
        assert DOS_MIN == -4
        assert DOS_MAX == 4


class TestRankDiceMapping:
    """Test rank dice pool mapping per ADR-0001."""
    
    def test_rank_0(self):
        """Rank 0 -> 1d4."""
        x, y = get_rank_dice_pool(0)
        assert x == 1
        assert y == 4
        assert get_rank_dice_notation(0) == "1d4"
    
    def test_rank_1(self):
        """Rank 1 -> 1d6."""
        x, y = get_rank_dice_pool(1)
        assert x == 1
        assert y == 6
        assert get_rank_dice_notation(1) == "1d6"
    
    def test_rank_2(self):
        """Rank 2 -> 2d8."""
        x, y = get_rank_dice_pool(2)
        assert x == 2
        assert y == 8
        assert get_rank_dice_notation(2) == "2d8"
    
    def test_rank_3(self):
        """Rank 3 -> 2d10."""
        x, y = get_rank_dice_pool(3)
        assert x == 2
        assert y == 10
        assert get_rank_dice_notation(3) == "2d10"
    
    def test_rank_4(self):
        """Rank 4 -> 3d12."""
        x, y = get_rank_dice_pool(4)
        assert x == 3
        assert y == 12
        assert get_rank_dice_notation(4) == "3d12"
    
    def test_rank_5(self):
        """Rank 5 -> 3d12 (die size capped at 12)."""
        x, y = get_rank_dice_pool(5)
        assert x == 3
        assert y == 12
        assert get_rank_dice_notation(5) == "3d12"
    
    def test_rank_6_and_beyond(self):
        """Higher ranks still cap at d12."""
        for rank in [6, 7, 10]:
            x, y = get_rank_dice_pool(rank)
            assert y == 12, f"Rank {rank} die size should cap at 12"
            # X continues to grow
            expected_x = 1 + (rank // 2)
            assert x == expected_x
    
    def test_negative_rank_treated_as_zero(self):
        """Negative ranks should be treated as rank 0."""
        x, y = get_rank_dice_pool(-1)
        assert x == 1
        assert y == 4


class TestRankDiceRolling:
    """Test rank dice rolling functions."""
    
    def test_roll_rank_dice_returns_valid_value(self):
        """Roll result should be within die bounds."""
        for _ in range(50):
            result = roll_rank_dice(2)  # 2d8
            assert 1 <= result <= 8
    
    def test_roll_rank_dice_detailed(self):
        """Detailed roll should return all components."""
        kept, rolls, dice_count, die_size = roll_rank_dice_detailed(3)  # 2d10
        
        assert dice_count == 2
        assert die_size == 10
        assert len(rolls) == 2
        assert kept == max(rolls)
        assert all(1 <= r <= 10 for r in rolls)
    
    def test_roll_rank_0_produces_d4(self):
        """Rank 0 rolls should be in d4 range."""
        for _ in range(50):
            result = roll_rank_dice(0)
            assert 1 <= result <= 4


class TestDoSComputation:
    """Test Degrees of Success computation per ADR-0001 band table."""
    
    def test_margin_zero_gives_dos_zero(self):
        """margin == 0 -> DoS = 0 (tie)."""
        assert compute_dos(0) == 0
    
    def test_positive_margin_1_to_4(self):
        """Margins +1 to +4 -> DoS = +1."""
        for margin in [1, 2, 3, 4]:
            assert compute_dos(margin) == 1, f"Margin {margin} should give DoS +1"
    
    def test_positive_margin_5_to_8(self):
        """Margins +5 to +8 -> DoS = +2."""
        for margin in [5, 6, 7, 8]:
            assert compute_dos(margin) == 2, f"Margin {margin} should give DoS +2"
    
    def test_positive_margin_9_to_12(self):
        """Margins +9 to +12 -> DoS = +3."""
        for margin in [9, 10, 11, 12]:
            assert compute_dos(margin) == 3, f"Margin {margin} should give DoS +3"
    
    def test_positive_margin_13_plus(self):
        """Margins +13 and above -> DoS = +4 (capped)."""
        for margin in [13, 14, 20, 50, 100]:
            assert compute_dos(margin) == 4, f"Margin {margin} should give DoS +4 (capped)"
    
    def test_negative_margin_minus1_to_minus4(self):
        """Margins -1 to -4 -> DoS = -1."""
        for margin in [-1, -2, -3, -4]:
            assert compute_dos(margin) == -1, f"Margin {margin} should give DoS -1"
    
    def test_negative_margin_minus5_to_minus8(self):
        """Margins -5 to -8 -> DoS = -2."""
        for margin in [-5, -6, -7, -8]:
            assert compute_dos(margin) == -2, f"Margin {margin} should give DoS -2"
    
    def test_negative_margin_minus9_to_minus12(self):
        """Margins -9 to -12 -> DoS = -3."""
        for margin in [-9, -10, -11, -12]:
            assert compute_dos(margin) == -3, f"Margin {margin} should give DoS -3"
    
    def test_negative_margin_minus13_below(self):
        """Margins -13 and below -> DoS = -4 (capped)."""
        for margin in [-13, -14, -20, -50, -100]:
            assert compute_dos(margin) == -4, f"Margin {margin} should give DoS -4 (capped)"
    
    def test_dos_never_exceeds_bounds(self):
        """DoS should always be in [-4, +4]."""
        for margin in range(-100, 101):
            dos = compute_dos(margin)
            assert -4 <= dos <= 4


class TestDoSBands:
    """Test DoS band calculation."""
    
    def test_band_for_tie(self):
        """Band for margin 0 should be (0, 0, 0)."""
        dos, band_min, band_max = get_dos_band(0)
        assert dos == 0
        assert band_min == 0
        assert band_max == 0
    
    def test_band_for_dos_1(self):
        """Band for DoS +1 should be margins 1-4."""
        dos, band_min, band_max = get_dos_band(3)  # Any margin in +1..+4
        assert dos == 1
        assert band_min == 1
        assert band_max == 4


class TestNatShift:
    """Test Natural 20/1 DoS shift per ADR-0001."""
    
    def test_nat_shift_20(self):
        """Natural 20 gives +1 shift."""
        assert nat_shift(20) == 1
    
    def test_nat_shift_1(self):
        """Natural 1 gives -1 shift."""
        assert nat_shift(1) == -1
    
    def test_nat_shift_other_values(self):
        """Other values give 0 shift."""
        for roll in range(2, 20):
            assert nat_shift(roll) == 0
    
    def test_apply_nat_shift_actor_nat_20(self):
        """Actor's nat 20 improves DoS by 1."""
        # Base DoS 0, actor nat 20, opp normal -> final DoS +1
        assert apply_nat_shift(0, 20, 10) == 1
        
        # Base DoS +2, actor nat 20, opp normal -> final DoS +3
        assert apply_nat_shift(2, 20, 10) == 3
    
    def test_apply_nat_shift_actor_nat_1(self):
        """Actor's nat 1 worsens DoS by 1."""
        # Base DoS 0, actor nat 1, opp normal -> final DoS -1
        assert apply_nat_shift(0, 1, 10) == -1
        
        # Base DoS +2, actor nat 1, opp normal -> final DoS +1
        assert apply_nat_shift(2, 1, 10) == 1
    
    def test_apply_nat_shift_opp_nat_20(self):
        """Opposition's nat 20 worsens actor's DoS by 1."""
        # Base DoS +2, actor normal, opp nat 20 -> final DoS +1
        assert apply_nat_shift(2, 10, 20) == 1
    
    def test_apply_nat_shift_opp_nat_1(self):
        """Opposition's nat 1 improves actor's DoS by 1."""
        # Base DoS 0, actor normal, opp nat 1 -> final DoS +1
        assert apply_nat_shift(0, 10, 1) == 1
    
    def test_apply_nat_shift_both_nat_20(self):
        """Both nat 20s cancel out."""
        # Base DoS 0, both nat 20 -> final DoS 0
        assert apply_nat_shift(0, 20, 20) == 0
    
    def test_apply_nat_shift_both_nat_1(self):
        """Both nat 1s cancel out."""
        # Base DoS 0, both nat 1 -> final DoS 0
        assert apply_nat_shift(0, 1, 1) == 0
    
    def test_apply_nat_shift_actor_20_opp_1(self):
        """Actor nat 20 vs opp nat 1 gives +2 shift."""
        # Base DoS 0, actor 20 (+1), opp 1 (-1 to them = +1 to actor) -> +2
        assert apply_nat_shift(0, 20, 1) == 2
    
    def test_apply_nat_shift_actor_1_opp_20(self):
        """Actor nat 1 vs opp nat 20 gives -2 shift."""
        # Base DoS 0, actor 1 (-1), opp 20 (+1 to them = -1 to actor) -> -2
        assert apply_nat_shift(0, 1, 20) == -2
    
    def test_apply_nat_shift_clamping_high(self):
        """Final DoS should clamp to +4."""
        # Base DoS +4, actor nat 20 -> should clamp to +4
        assert apply_nat_shift(4, 20, 10) == 4
    
    def test_apply_nat_shift_clamping_low(self):
        """Final DoS should clamp to -4."""
        # Base DoS -4, actor nat 1 -> should clamp to -4
        assert apply_nat_shift(-4, 1, 10) == -4
    
    def test_apply_nat_shift_tn_mode(self):
        """In TN mode, opp d20 is 0 (no nat shift from opp)."""
        # Actor nat 20, no opponent roll
        assert apply_nat_shift(0, 20, 0) == 1
        
        # Actor nat 1, no opponent roll
        assert apply_nat_shift(0, 1, 0) == -1


class TestTieBehavior:
    """Test tie behavior per ADR-0001: Defender wins ties."""
    
    def test_margin_zero_is_tie(self):
        """Margin 0 produces DoS 0 which is a tie."""
        assert compute_dos(0) == 0
    
    def test_resolution_tie_detection(self):
        """Resolution result should detect ties."""
        # Force a tie by setting totals equal (mocked scenario)
        # We'll test the is_tie property through resolve_tn
        # where we can control the outcome more precisely
        pass  # Tested in resolution tests below


class TestTotalComputation:
    """Test total computation per ADR-0001."""
    
    def test_total_formula(self):
        """Total = d20 + Bonus + KeptRankDie."""
        assert compute_total(10, 5, 3) == 18
        assert compute_total(1, 0, 0) == 1
        assert compute_total(20, 10, 12) == 42
    
    def test_roll_total_returns_valid_result(self):
        """roll_total should return a valid RollResult."""
        result = roll_total(bonus=5, rank=2)
        
        assert 1 <= result.d20 <= 20
        assert result.bonus == 5
        assert result.kept_rank_die >= 1
        assert result.total == result.d20 + result.bonus + result.kept_rank_die


class TestOpposedResolution:
    """Test opposed check resolution."""
    
    def test_resolve_opposed_returns_complete_result(self):
        """Opposed resolution should return all components."""
        result = resolve_opposed(
            actor_bonus=5,
            actor_rank=2,
            opp_bonus=3,
            opp_rank=1
        )
        
        assert result.actor_result is not None
        assert result.opp_result is not None
        assert result.opp_tn is None  # Not TN mode
        assert -4 <= result.final_dos <= 4
        assert isinstance(result.actor_wins, bool)
        assert isinstance(result.is_tie, bool)
    
    def test_resolve_opposed_actor_wins_on_positive_dos(self):
        """Actor wins when final DoS > 0."""
        # Run multiple times to get various outcomes
        wins = 0
        for _ in range(100):
            result = resolve_opposed(10, 3, 0, 0)  # Actor has big advantage
            if result.final_dos > 0:
                assert result.actor_wins is True
                wins += 1
        
        # With such advantage, actor should win most of the time
        assert wins > 50
    
    def test_resolve_opposed_without_nat_shifts(self):
        """Can disable nat shifts."""
        result = resolve_opposed(5, 2, 5, 2, apply_nat_shifts=False)
        assert result.nat_shift_applied == 0
        assert result.base_dos == result.final_dos


class TestTNResolution:
    """Test TN (static opposition) mode resolution."""
    
    def test_resolve_tn_returns_complete_result(self):
        """TN resolution should return all components."""
        result = resolve_tn(
            actor_bonus=5,
            actor_rank=2,
            tn=15
        )
        
        assert result.actor_result is not None
        assert result.opp_result is None  # No opponent roll
        assert result.opp_tn == 15
        assert -4 <= result.final_dos <= 4
    
    def test_resolve_tn_nat_shift_only_from_actor(self):
        """In TN mode, only actor's nat 20/1 affects DoS."""
        # This is tested implicitly - opp_d20 is passed as 0 internally
        result = resolve_tn(5, 2, 15, apply_nat_shifts=True)
        
        # The nat shift should only come from actor's d20
        expected_shift = nat_shift(result.actor_result.d20)
        assert result.nat_shift_applied == expected_shift


class TestApproachSelection:
    """Test approach-based rank selection per ADR-0002/0003."""
    
    def test_martial_approach_uses_cl(self):
        """Martial approach uses MartialRank = CL."""
        rank = get_rank_from_approach(Approach.MARTIAL, martial_rank=5, sorcery_rank=3)
        assert rank == 5
    
    def test_sorcerous_approach_uses_sl(self):
        """Sorcerous approach uses SorceryRank = SL."""
        rank = get_rank_from_approach(Approach.SORCEROUS, martial_rank=5, sorcery_rank=3)
        assert rank == 3


class TestDoSInterpretation:
    """Test human-readable DoS interpretation."""
    
    def test_interpret_tie(self):
        """DoS 0 should describe tie/defender wins."""
        result = interpret_dos(0)
        assert "tie" in result.lower() or "defender" in result.lower()
    
    def test_interpret_positive_dos(self):
        """Positive DoS should describe success levels."""
        assert "minor" in interpret_dos(1).lower()
        assert "moderate" in interpret_dos(2).lower()
        assert "major" in interpret_dos(3).lower()
        assert "critical" in interpret_dos(4).lower()
    
    def test_interpret_negative_dos(self):
        """Negative DoS should describe failure levels."""
        assert "failure" in interpret_dos(-1).lower()
        assert "failure" in interpret_dos(-2).lower()
        assert "failure" in interpret_dos(-3).lower()
        assert "failure" in interpret_dos(-4).lower()


class TestEdgeCases:
    """Test edge cases and boundary conditions."""
    
    def test_zero_bonus_and_rank(self):
        """Should handle zero bonus and rank gracefully."""
        result = roll_total(bonus=0, rank=0)
        assert result.total >= 2  # Minimum: d20=1 + d4=1
    
    def test_high_bonus_values(self):
        """Should handle high bonus values."""
        total = compute_total(d20=10, bonus=100, kept_rank_die=12)
        assert total == 122
    
    def test_negative_bonus(self):
        """Should handle negative bonuses."""
        total = compute_total(d20=10, bonus=-5, kept_rank_die=5)
        assert total == 10
    
    def test_very_high_rank(self):
        """Should handle very high ranks (beyond table)."""
        x, y = get_rank_dice_pool(10)
        assert y == 12  # Die size capped
        assert x == 6   # 1 + 10//2 = 6 dice


class TestDefenderWinsTies:
    """Test the defender wins ties rule explicitly."""
    
    def test_dos_zero_means_no_actor_win(self):
        """When DoS = 0, actor_wins should be False."""
        # Create a result where base DoS is 0 and no nat shift
        from app.core.resolution_engine import ResolutionResult, RollResult
        
        # Manually construct a tie scenario
        actor = RollResult(d20=10, bonus=5, kept_rank_die=5, rank_dice_rolls=[5], total=20)
        opp = RollResult(d20=10, bonus=5, kept_rank_die=5, rank_dice_rolls=[5], total=20)
        
        # Compute manually
        margin = actor.total - opp.total  # 0
        base_dos = compute_dos(margin)    # 0
        final_dos = apply_nat_shift(base_dos, actor.d20, opp.d20)  # 0 (no shifts)
        
        result = ResolutionResult(
            actor_result=actor,
            opp_result=opp,
            opp_tn=None,
            margin=margin,
            base_dos=base_dos,
            final_dos=final_dos,
            nat_shift_applied=0,
            actor_wins=final_dos > 0,
            is_tie=final_dos == 0
        )
        
        assert result.is_tie is True
        assert result.actor_wins is False
        assert result.defender_wins_tie is True
