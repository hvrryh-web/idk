"""
Tests for ADR-0006 through ADR-0013 implementations.

Tests cover:
- Effect resolution (ADR-0006)
- Economy system (ADR-0007)
- Action economy (ADR-0008/0011)
- Domains and clocks (ADR-0009/0012)
- Adversary construction (ADR-0010/0013)
"""

import pytest
from typing import Dict

from app.core.srd_constants import Pillar
from app.core.effect_resolution import (
    CoreEffectType,
    ConditionRung,
    WardState,
    VIOLENCE_LADDER,
    INFLUENCE_LADDER,
    REVELATION_LADDER,
    get_condition_from_ladder,
    get_debilitate_name,
    compute_resistance_tn,
    compute_fail_deg,
)
from app.core.economy import (
    TrackType,
    PoolType,
    CostTrack,
    MetaPool,
    CharacterEconomy,
    SpendType,
    GainTrigger,
    calculate_track_max,
    calculate_strain_threshold,
    calculate_reset_value,
    calculate_meta_max,
    get_strain_effect,
    get_overflow_effect,
    resolve_push,
    apply_push_cost,
)
from app.core.action_economy import (
    SpeedBand,
    RoundStage,
    ActionType,
    ReactionTier,
    ActionBudget,
    RoundState,
    calculate_seq_lvl_base_from_scl,
    calculate_seq_lvl,
    calculate_seq_lvl_band,
    calculate_action_budget,
    get_reaction_tier,
    create_initiative_entry,
)
from app.core.domains import (
    DomainState,
    ClockType,
    PressureType,
    Clock,
    Domain,
    StageShiftPackage,
    StagedConflict,
    CultivationProject,
    tick_clock_from_dos,
    calculate_manifest_tn,
    validate_stage_package,
    create_cultivation_project,
)
from app.core.adversary import (
    AdversaryType,
    ThreatLevel,
    PillarStats,
    CharacterCombatRatings,
    NPCStatBlock,
    PartyBaseline,
    calculate_pillar_ocr,
    calculate_pillar_dcr,
    calculate_party_baseline,
    calculate_threat_level,
    generate_npc_from_template,
    validate_legality,
    ADVERSARY_TEMPLATES,
)


# =============================================================================
# ADR-0006: Effect Resolution Tests
# =============================================================================

class TestConditionLadders:
    """Tests for condition ladders."""

    def test_violence_ladder_has_five_rungs(self):
        assert len(VIOLENCE_LADDER) == 5

    def test_influence_ladder_has_five_rungs(self):
        assert len(INFLUENCE_LADDER) == 5

    def test_revelation_ladder_has_five_rungs(self):
        assert len(REVELATION_LADDER) == 5

    def test_ladder_rung_0_is_no_effect(self):
        assert VIOLENCE_LADDER[0].name == "No Effect"
        assert VIOLENCE_LADDER[0].penalty == 0

    def test_ladder_rung_4_is_taken_out(self):
        assert VIOLENCE_LADDER[4].taken_out is True
        assert INFLUENCE_LADDER[4].taken_out is True
        assert REVELATION_LADDER[4].taken_out is True

    def test_ladder_rung_3_is_incapacitated(self):
        assert VIOLENCE_LADDER[3].incapacitated is True
        assert INFLUENCE_LADDER[3].incapacitated is True
        assert REVELATION_LADDER[3].incapacitated is True

    def test_get_condition_from_ladder(self):
        condition = get_condition_from_ladder("Strike", Pillar.VIOLENCE, 2)
        assert condition.name == "Maimed"
        assert condition.penalty == -2

    def test_get_condition_clamps_to_valid_range(self):
        condition = get_condition_from_ladder("Strike", Pillar.VIOLENCE, 10)
        assert condition.rung == 4

    def test_get_debilitate_name(self):
        assert get_debilitate_name(Pillar.VIOLENCE, 1) == "Slowed"
        assert get_debilitate_name(Pillar.INFLUENCE, 2) == "Censured"
        assert get_debilitate_name(Pillar.REVELATION, 3) == "Unraveling"


class TestResistanceTN:
    """Tests for resistance TN calculation."""

    def test_base_tn_is_10(self):
        assert compute_resistance_tn(0, 0) == 10

    def test_tn_increases_with_effect_rank(self):
        assert compute_resistance_tn(3, 0) == 13
        assert compute_resistance_tn(5, 0) == 15

    def test_tn_increases_with_potency(self):
        assert compute_resistance_tn(3, 2) == 15


class TestFailDegComputation:
    """Tests for FailDeg computation."""

    def test_zero_dos_resist_zero_dos_contact_gives_zero(self):
        # Need at least DoS_contact > 0 to get to Step B
        # But if we're testing the formula: base_fail_deg = max(0, -0) = 0
        # amplify = max(0, 1 - 1) = 0 (assuming DoS_contact = 1)
        assert compute_fail_deg(0, 1) == 0

    def test_negative_dos_resist_gives_base_fail_deg(self):
        # DoS_resist = -2, DoS_contact = 1
        # base_fail_deg = max(0, -(-2)) = 2
        # amplify = max(0, 1 - 1) = 0
        assert compute_fail_deg(-2, 1) == 2

    def test_amplify_from_high_contact(self):
        # DoS_resist = 0, DoS_contact = 3
        # base_fail_deg = 0
        # amplify = max(0, 3 - 1) = 2
        assert compute_fail_deg(0, 3) == 2

    def test_fail_deg_capped_at_4(self):
        # DoS_resist = -4, DoS_contact = 4
        # base_fail_deg = 4
        # amplify = 3
        # uncapped = 7, but should be 4
        assert compute_fail_deg(-4, 4) == 4


class TestWardState:
    """Tests for Ward mechanics."""

    def test_ward_bonus_when_active(self):
        ward = WardState(pillar=Pillar.VIOLENCE, rank=3, is_active=True)
        assert ward.bonus == 3

    def test_ward_bonus_when_inactive(self):
        ward = WardState(pillar=Pillar.VIOLENCE, rank=3, is_active=False)
        assert ward.bonus == 0

    def test_aura_bonus(self):
        ward = WardState(pillar=Pillar.VIOLENCE, rank=4, has_aura=True)
        assert ward.aura_bonus() == 2  # floor(4/2) = 2

    def test_hardened_reduces_fail_deg_1_to_0(self):
        ward = WardState(pillar=Pillar.VIOLENCE, rank=3, has_hardened=True)
        result = ward.apply_hardened(effect_rank=2, fail_deg=1)
        assert result == 0
        assert ward.hardened_uses_remaining == 2

    def test_hardened_does_not_affect_higher_fail_deg(self):
        ward = WardState(pillar=Pillar.VIOLENCE, rank=3, has_hardened=True)
        result = ward.apply_hardened(effect_rank=2, fail_deg=2)
        assert result == 2

    def test_fragile_collapses_on_fail_deg_2(self):
        ward = WardState(pillar=Pillar.VIOLENCE, rank=3, has_fragile=True)
        ward.check_fragile(2)
        assert ward.is_active is False


# =============================================================================
# ADR-0007: Economy Tests
# =============================================================================

class TestTrackCalculations:
    """Tests for track calculations."""

    def test_track_max_formula(self):
        # TrackMax = 3 + SCL
        assert calculate_track_max(2) == 5
        assert calculate_track_max(4) == 7

    def test_track_max_with_pillar_forward(self):
        # +2 if pillar forward
        assert calculate_track_max(2, pillar_forward=True) == 7

    def test_strain_threshold(self):
        # ceil(track_max / 2)
        assert calculate_strain_threshold(5) == 3
        assert calculate_strain_threshold(6) == 3

    def test_reset_value(self):
        # floor(track_max / 2)
        assert calculate_reset_value(5) == 2
        assert calculate_reset_value(6) == 3

    def test_meta_max_formula(self):
        # MetaMax = 3 + SCL
        assert calculate_meta_max(2) == 5
        assert calculate_meta_max(4) == 7


class TestCostTrack:
    """Tests for CostTrack class."""

    def test_track_starts_empty(self):
        track = CostTrack(TrackType.BLOOD, maximum=5)
        assert track.current == 0

    def test_mark_increases_current(self):
        track = CostTrack(TrackType.BLOOD, maximum=5)
        track.mark(2)
        assert track.current == 2

    def test_strain_threshold_detection(self):
        track = CostTrack(TrackType.BLOOD, maximum=6)  # strain at 3
        strain_crossed, _ = track.mark(3)
        assert strain_crossed is True
        assert track.is_strained is True

    def test_overflow_detection(self):
        track = CostTrack(TrackType.BLOOD, maximum=5)
        _, overflow = track.mark(5)
        assert overflow is True
        assert track.is_overflowing is True

    def test_resolve_overflow_resets_to_half(self):
        track = CostTrack(TrackType.BLOOD, maximum=6, current=6)
        track.resolve_overflow()
        assert track.current == 3


class TestMetaPool:
    """Tests for MetaPool class."""

    def test_pool_starts_empty(self):
        pool = MetaPool(PoolType.FURY, maximum=5)
        assert pool.current == 0

    def test_gain_increases_current(self):
        pool = MetaPool(PoolType.FURY, maximum=5)
        gained = pool.gain(2)
        assert gained == 2
        assert pool.current == 2

    def test_gain_capped_at_maximum(self):
        pool = MetaPool(PoolType.FURY, current=4, maximum=5)
        gained = pool.gain(3)
        assert gained == 1
        assert pool.current == 5

    def test_spend_decreases_current(self):
        pool = MetaPool(PoolType.FURY, current=3, maximum=5)
        success = pool.spend(2)
        assert success is True
        assert pool.current == 1

    def test_spend_fails_if_insufficient(self):
        pool = MetaPool(PoolType.FURY, current=1, maximum=5)
        success = pool.spend(2)
        assert success is False
        assert pool.current == 1


class TestCharacterEconomy:
    """Tests for CharacterEconomy class."""

    def test_economy_initializes_from_scl(self):
        economy = CharacterEconomy(scl=2, primary_pillar=Pillar.VIOLENCE)
        assert economy.blood.maximum == 5  # 3 + 2
        assert economy.fury.maximum == 5

    def test_primary_pillar_pool_starts_at_1(self):
        economy = CharacterEconomy(scl=2, primary_pillar=Pillar.VIOLENCE)
        assert economy.fury.current == 1
        assert economy.clout.current == 0
        assert economy.insight.current == 0


class TestPushMechanics:
    """Tests for Push mechanics."""

    def test_push_spends_pool_and_increases_cap(self):
        pool = MetaPool(PoolType.FURY, current=2, maximum=5)
        track = CostTrack(TrackType.BLOOD, maximum=5)

        result = resolve_push(pool, track, current_off_cap=8)

        assert result.success is True
        assert result.new_off_cap == 10  # +2
        assert pool.current == 1

    def test_push_fails_if_no_pool(self):
        pool = MetaPool(PoolType.FURY, current=0, maximum=5)
        track = CostTrack(TrackType.BLOOD, maximum=5)

        result = resolve_push(pool, track, current_off_cap=8)

        assert result.success is False
        assert result.new_off_cap == 8

    def test_push_cost_marks_track(self):
        track = CostTrack(TrackType.BLOOD, maximum=5)
        strain_crossed, overflow = apply_push_cost(track)
        assert track.current == 1


# =============================================================================
# ADR-0008/0011: Action Economy Tests
# =============================================================================

class TestSeqLVLCalculations:
    """Tests for SeqLVL calculations."""

    def test_seq_lvl_base_formula(self):
        # seqLVL_base = 3 × max(1, SCL − 1)
        assert calculate_seq_lvl_base_from_scl(2) == 3  # Base3
        assert calculate_seq_lvl_base_from_scl(3) == 6  # Base6
        assert calculate_seq_lvl_base_from_scl(5) == 12  # Base12

    def test_seq_lvl_with_speed_band(self):
        # +3 per speed band level
        assert calculate_seq_lvl(2, SpeedBand.FAST) == 6  # 3 + 3
        assert calculate_seq_lvl(2, SpeedBand.VERY_FAST) == 9  # 3 + 6

    def test_seq_lvl_with_over_scl_band(self):
        assert calculate_seq_lvl(2, SpeedBand.NORMAL, over_scl_band=1) == 6

    def test_seq_lvl_band(self):
        assert calculate_seq_lvl_band(3) == 1
        assert calculate_seq_lvl_band(6) == 2
        assert calculate_seq_lvl_band(12) == 4


class TestActionBudget:
    """Tests for action budget calculations."""

    def test_base3_budget(self):
        budget = calculate_action_budget(3)
        assert budget.major == 1
        assert budget.minor == 1
        assert budget.bonus == 1

    def test_base6_budget(self):
        budget = calculate_action_budget(6)
        assert budget.major == 1
        assert budget.minor == 1
        assert budget.bonus == 2  # +1 bonus

    def test_base9_budget(self):
        budget = calculate_action_budget(9)
        assert budget.major == 1
        assert budget.minor == 2  # +1 minor
        assert budget.bonus == 2

    def test_base12_budget(self):
        budget = calculate_action_budget(12)
        assert budget.major == 2  # +1 major
        assert budget.minor == 2
        assert budget.bonus == 2

    def test_base15_budget(self):
        budget = calculate_action_budget(15)
        assert budget.major == 2
        assert budget.minor == 2
        assert budget.bonus == 3  # +1 bonus again

    def test_very_fast_grants_nuance(self):
        budget = calculate_action_budget(6, has_very_fast=True)
        assert budget.nuance == 1


class TestReactionTier:
    """Tests for reaction tier."""

    def test_normal_speed_has_basic_reactions(self):
        assert get_reaction_tier(SpeedBand.NORMAL) == ReactionTier.BASIC

    def test_fast_has_improved_reactions(self):
        assert get_reaction_tier(SpeedBand.FAST) == ReactionTier.IMPROVED

    def test_very_fast_has_improved_plus(self):
        assert get_reaction_tier(SpeedBand.VERY_FAST) == ReactionTier.IMPROVED_PLUS


class TestRoundState:
    """Tests for round state machine."""

    def test_initial_state(self):
        state = RoundState()
        assert state.round_number == 1
        assert state.current_stage == RoundStage.START_OF_ROUND

    def test_advance_stage(self):
        state = RoundState()
        stage = state.advance_stage()
        assert stage == RoundStage.BONUS_STAGE

    def test_advance_through_all_stages(self):
        state = RoundState()
        state.advance_stage()  # -> BONUS
        state.advance_stage()  # -> MINOR
        state.advance_stage()  # -> MAJOR
        state.advance_stage()  # -> END_OF_ROUND
        assert state.current_stage == RoundStage.END_OF_ROUND

    def test_end_of_round_advances_to_next_round(self):
        state = RoundState()
        state.current_stage = RoundStage.END_OF_ROUND
        state.advance_stage()
        assert state.round_number == 2
        assert state.current_stage == RoundStage.START_OF_ROUND


# =============================================================================
# ADR-0009/0012: Domain and Clock Tests
# =============================================================================

class TestClocks:
    """Tests for clock system."""

    def test_clock_starts_empty(self):
        clock = Clock(clock_id="test", name="Test", clock_type=ClockType.PROGRESS)
        assert clock.filled == 0
        assert clock.is_complete is False

    def test_tick_fills_clock(self):
        clock = Clock(clock_id="test", name="Test", clock_type=ClockType.PROGRESS, segments=6)
        clock.tick(3)
        assert clock.filled == 3

    def test_tick_returns_overflow(self):
        clock = Clock(clock_id="test", name="Test", clock_type=ClockType.PROGRESS, segments=6)
        overflow = clock.tick(8)
        assert overflow == 2
        assert clock.filled == 6

    def test_progress_clock_ticks_on_positive_dos(self):
        clock = Clock(clock_id="test", name="Test", clock_type=ClockType.PROGRESS, segments=6)
        ticks = tick_clock_from_dos(clock, 3)
        assert ticks == 3
        assert clock.filled == 3

    def test_progress_clock_no_tick_on_negative_dos(self):
        clock = Clock(clock_id="test", name="Test", clock_type=ClockType.PROGRESS, segments=6)
        ticks = tick_clock_from_dos(clock, -2)
        assert ticks == 0

    def test_danger_clock_ticks_on_negative_dos(self):
        clock = Clock(clock_id="test", name="Test", clock_type=ClockType.DANGER, segments=6)
        ticks = tick_clock_from_dos(clock, -2)
        assert ticks == 2

    def test_danger_clock_caps_at_3(self):
        clock = Clock(clock_id="test", name="Test", clock_type=ClockType.DANGER, segments=6)
        ticks = tick_clock_from_dos(clock, -4)
        assert ticks == 3


class TestDomains:
    """Tests for domain system."""

    def test_domain_scp_cost(self):
        domain = Domain(domain_id="test", name="Test", form="Sword", primary_pillar=Pillar.VIOLENCE, dom_r=3)
        assert domain.scp_cost == 9  # 3 × 3

    def test_domain_max_potency_uses(self):
        domain = Domain(domain_id="test", name="Test", form="Sword", primary_pillar=Pillar.VIOLENCE, dom_r=4)
        assert domain.max_potency_uses == 3  # 1 + floor(4/2)

    def test_domain_use_potency(self):
        domain = Domain(domain_id="test", name="Test", form="Sword", primary_pillar=Pillar.VIOLENCE, dom_r=2)
        success = domain.use_potency()
        assert success is True
        assert domain.potency_uses_this_scene == 1
        assert domain.strain_clock_filled == 1

    def test_domain_collapse_on_strain_full(self):
        domain = Domain(domain_id="test", name="Test", form="Sword", primary_pillar=Pillar.VIOLENCE, dom_r=2)
        domain.mark_strain(6)
        assert domain.is_collapsed is True
        assert domain.state == DomainState.COLLAPSED

    def test_manifest_tn_calculation(self):
        assert calculate_manifest_tn(0) == 10
        assert calculate_manifest_tn(2) == 12


class TestStagePackages:
    """Tests for stage packages."""

    def test_validate_package_requires_weakness_clock_for_big_delta(self):
        package = StageShiftPackage(
            stage_index=1,
            ocr_delta={Pillar.VIOLENCE: 3}
        )
        is_valid, errors = validate_stage_package(package)
        assert is_valid is False
        assert len(errors) == 1

    def test_validate_package_passes_with_weakness_clock(self):
        package = StageShiftPackage(
            stage_index=1,
            ocr_delta={Pillar.VIOLENCE: 3},
            weakness_clock=Clock(clock_id="weakness", name="Weakness", clock_type=ClockType.PROGRESS)
        )
        is_valid, errors = validate_stage_package(package)
        assert is_valid is True


class TestCultivationProjects:
    """Tests for cultivation projects."""

    def test_create_cultivation_project(self):
        domain = Domain(domain_id="test", name="Test", form="Sword", primary_pillar=Pillar.VIOLENCE, dom_r=1)
        project = create_cultivation_project(domain, target_rank=2)
        assert project.progress_clock.segments == 6  # 1->2 requires 6 segments

    def test_cultivation_project_rank_3_to_4_requires_breakthrough(self):
        domain = Domain(domain_id="test", name="Test", form="Sword", primary_pillar=Pillar.VIOLENCE, dom_r=3)
        project = create_cultivation_project(domain, target_rank=4)
        assert project.requires_breakthrough is True


# =============================================================================
# ADR-0010/0013: Adversary and OCR/DCR Tests
# =============================================================================

class TestOCRDCRCalculations:
    """Tests for OCR/DCR calculations."""

    def test_pillar_ocr(self):
        # OCR = max(attack + effect_rank, attack + virtual_ranks)
        assert calculate_pillar_ocr(4, 3, 0) == 7
        assert calculate_pillar_ocr(4, 3, 5) == 9  # virtual_ranks > effect_rank

    def test_pillar_dcr(self):
        # DCR = defense + resilience + ward_bonus
        assert calculate_pillar_dcr(4, 3, 0) == 7
        assert calculate_pillar_dcr(4, 3, 2) == 9

    def test_character_combat_ratings(self):
        violence = PillarStats(attack=4, defense=3, resilience=2, max_effect_rank=3)
        influence = PillarStats(attack=2, defense=4, resilience=3, max_effect_rank=1)
        revelation = PillarStats(attack=1, defense=2, resilience=2, max_effect_rank=0)

        ratings = CharacterCombatRatings(
            violence=violence,
            influence=influence,
            revelation=revelation
        )

        assert ratings.violence.ocr == 7  # 4 + 3
        assert ratings.violence.dcr == 5  # 3 + 2
        assert ratings.ocr == 7  # max across pillars
        assert ratings.dcr == 7  # influence: 4 + 3
        assert ratings.peaked_ocr_pillar == Pillar.VIOLENCE
        assert ratings.peaked_dcr_pillar == Pillar.INFLUENCE


class TestThreatLevel:
    """Tests for threat level calculation."""

    def test_even_threat(self):
        baseline = PartyBaseline(ocr_med=7, dcr_med=7, seq_band_med=2, scl_med=2, member_count=4)
        level = calculate_threat_level(baseline, enemy_ocr=7, enemy_dcr=7)
        assert level == ThreatLevel.EVEN

    def test_pressuring_threat(self):
        baseline = PartyBaseline(ocr_med=7, dcr_med=7, seq_band_med=2, scl_med=2, member_count=4)
        level = calculate_threat_level(baseline, enemy_ocr=9, enemy_dcr=7)
        assert level == ThreatLevel.PRESSURING

    def test_overwhelming_threat(self):
        baseline = PartyBaseline(ocr_med=7, dcr_med=7, seq_band_med=2, scl_med=2, member_count=4)
        level = calculate_threat_level(baseline, enemy_ocr=10, enemy_dcr=7)
        assert level == ThreatLevel.OVERWHELMING


class TestAdversaryTemplates:
    """Tests for adversary templates."""

    def test_all_adversary_types_have_templates(self):
        for adv_type in AdversaryType:
            assert adv_type in ADVERSARY_TEMPLATES

    def test_minion_template_has_correct_offsets(self):
        template = ADVERSARY_TEMPLATES[AdversaryType.MINION]
        assert template.ocr_offset == 0
        assert template.dcr_offset == -2

    def test_boss_template_requires_stage_clock(self):
        template = ADVERSARY_TEMPLATES[AdversaryType.BOSS]
        assert template.requires_stage_clock is True


class TestNPCGeneration:
    """Tests for NPC generation."""

    def test_generate_minion(self):
        baseline = PartyBaseline(ocr_med=7, dcr_med=7, seq_band_med=2, scl_med=2, member_count=4)
        npc = generate_npc_from_template(
            npc_id="test_minion",
            name="Test Minion",
            adversary_type=AdversaryType.MINION,
            party_baseline=baseline,
            primary_pillar=Pillar.VIOLENCE
        )

        assert npc.adversary_type == AdversaryType.MINION
        assert npc.speed_band == SpeedBand.NORMAL

    def test_generate_boss_has_stage_clock(self):
        baseline = PartyBaseline(ocr_med=7, dcr_med=7, seq_band_med=2, scl_med=2, member_count=4)
        npc = generate_npc_from_template(
            npc_id="test_boss",
            name="Test Boss",
            adversary_type=AdversaryType.BOSS,
            party_baseline=baseline,
            primary_pillar=Pillar.VIOLENCE
        )

        assert npc.stage_clock is not None
        assert npc.speed_band == SpeedBand.VERY_FAST


class TestLegalityValidation:
    """Tests for legality validation."""

    def test_legal_build_passes(self):
        ratings = CharacterCombatRatings(
            violence=PillarStats(attack=4, defense=3, resilience=2, max_effect_rank=3),
            influence=PillarStats(attack=2, defense=2, resilience=2, max_effect_rank=1),
            revelation=PillarStats(attack=1, defense=2, resilience=2, max_effect_rank=0),
        )
        from app.core.srd_constants import PDBProfile
        is_legal, errors = validate_legality(ratings, scl=2, pdb_profile=PDBProfile.BALANCED)
        assert is_legal is True

    def test_illegal_ocr_fails(self):
        ratings = CharacterCombatRatings(
            violence=PillarStats(attack=6, defense=3, resilience=2, max_effect_rank=5),  # OCR = 11, exceeds 8
            influence=PillarStats(),
            revelation=PillarStats(),
        )
        from app.core.srd_constants import PDBProfile
        is_legal, errors = validate_legality(ratings, scl=2, pdb_profile=PDBProfile.BALANCED)
        assert is_legal is False
        assert len(errors) >= 1
