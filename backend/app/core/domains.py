"""
Domain and Clock Module

Implements ADR-0009: Domains, Clocks, and Multi-Stage Conflict Architecture
Implements ADR-0012: Domains as Cultivation Power Sources and Scene Procedures

This module provides:
- Domain object model and lifecycle
- Domain manifestation and invocation
- Clock system (Progress and Danger clocks)
- Stage packages and multi-stage conflicts
- Domain cultivation projects

Reference: docs/adr/ADR-0009-domains-clocks-staged-conflict.md
Reference: docs/adr/ADR-0012-domains-cultivation-scene-procedures.md
Patch: ALPHA-0.4-20251212
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

from app.core.resolution_engine import resolve_tn
from app.core.srd_constants import Pillar

# =============================================================================
# Constants (ADR-0009/0012 Locked)
# =============================================================================

DOMAIN_MANIFEST_TN_BASE = 10
MAX_DOMAIN_RANK = 4
DOMAIN_SCP_COST_PER_RANK = 3
DEFAULT_STRAIN_CLOCK_SEGMENTS = 6


# =============================================================================
# Domain State Enum
# =============================================================================

class DomainState(str, Enum):
    """Domain states per ADR-0009."""
    DORMANT = "Dormant"
    ATTUNED = "Attuned"
    MANIFESTED = "Manifested"
    COLLAPSED = "Collapsed"


# =============================================================================
# Clock Type Enum
# =============================================================================

class ClockType(str, Enum):
    """Clock types per ADR-0009."""
    PROGRESS = "Progress"
    DANGER = "Danger"


# =============================================================================
# Pressure Type Enum
# =============================================================================

class PressureType(str, Enum):
    """Pressure types per ADR-0012."""
    PASSIVE = "Passive"      # Penalties/bonuses to rolls
    THRESHOLD = "Threshold"  # Extra clock ticks on condition thresholds
    RULE = "Rule"            # Limited rule-space clause


# =============================================================================
# Clock
# =============================================================================

@dataclass
class Clock:
    """A progress or danger clock."""
    clock_id: str
    name: str
    clock_type: ClockType
    segments: int = 6  # 4, 6, or 8
    filled: int = 0
    threshold_trigger: Optional[str] = None  # What happens at specific thresholds

    @property
    def is_complete(self) -> bool:
        """Whether the clock is full."""
        return self.filled >= self.segments

    @property
    def remaining(self) -> int:
        """Segments remaining."""
        return max(0, self.segments - self.filled)

    def tick(self, amount: int) -> int:
        """
        Tick the clock by amount.

        Returns overflow (segments beyond capacity).
        """
        self.filled += amount
        overflow = max(0, self.filled - self.segments)
        self.filled = min(self.filled, self.segments)
        return overflow

    def clear(self, amount: int = 1) -> int:
        """Clear segments from the clock. Returns amount actually cleared."""
        actual = min(amount, self.filled)
        self.filled -= actual
        return actual

    def reset(self) -> None:
        """Reset clock to empty."""
        self.filled = 0


def tick_clock_from_dos(clock: Clock, dos: int) -> int:
    """
    Tick a clock based on DoS per ADR-0009.

    Progress clocks: tick by DoS (1-4) if positive
    Danger clocks: tick by min(3, abs(DoS)) if negative

    Returns the number of ticks applied.
    """
    if clock.clock_type == ClockType.PROGRESS:
        if dos > 0:
            ticks = min(4, dos)
            clock.tick(ticks)
            return ticks
    else:  # DANGER
        if dos < 0:
            ticks = min(3, abs(dos))
            clock.tick(ticks)
            return ticks
    return 0


# =============================================================================
# Domain
# =============================================================================

@dataclass
class Domain:
    """A cultivated power domain."""
    domain_id: str
    name: str
    form: str  # e.g., "Sword Domain", "Mirror Domain"
    primary_pillar: Pillar
    secondary_pillar: Optional[Pillar] = None
    dom_r: int = 0  # 0-4

    # State
    state: DomainState = DomainState.DORMANT

    # Strain clock
    strain_clock_segments: int = DEFAULT_STRAIN_CLOCK_SEGMENTS
    strain_clock_filled: int = 0

    # Scene tag (when manifested)
    scene_tag_id: Optional[str] = None
    free_invoke_count: int = 0

    # Potency tracking
    potency_uses_this_scene: int = 0

    # Pressure profile
    pressure_type: Optional[PressureType] = None
    pressure_rank: int = 0

    # Domain clocks
    domain_clocks: List[Clock] = field(default_factory=list)

    # Tags and permissions
    domain_tags: List[str] = field(default_factory=list)
    unlocked_techniques: List[str] = field(default_factory=list)

    @property
    def scp_cost(self) -> int:
        """SCP cost for this domain rank."""
        return self.dom_r * DOMAIN_SCP_COST_PER_RANK

    @property
    def max_potency_uses(self) -> int:
        """Max Domain Potency uses per scene."""
        return 1 + (self.dom_r // 2)

    @property
    def potency_uses_remaining(self) -> int:
        """Remaining Domain Potency uses."""
        return max(0, self.max_potency_uses - self.potency_uses_this_scene)

    @property
    def is_collapsed(self) -> bool:
        """Whether the domain has collapsed from strain."""
        return self.strain_clock_filled >= self.strain_clock_segments

    @property
    def strain_remaining(self) -> int:
        """Strain segments remaining before collapse."""
        return max(0, self.strain_clock_segments - self.strain_clock_filled)

    def mark_strain(self, amount: int = 1) -> bool:
        """
        Mark strain on the domain.

        Returns True if domain collapsed.
        """
        self.strain_clock_filled += amount
        if self.is_collapsed:
            self.state = DomainState.COLLAPSED
            return True
        return False

    def use_potency(self) -> bool:
        """
        Use Domain Potency.

        Returns True if successful, False if no uses remaining.
        """
        if self.potency_uses_remaining <= 0:
            return False
        self.potency_uses_this_scene += 1
        self.mark_strain(1)
        return True

    def reset_scene(self) -> None:
        """Reset per-scene state."""
        self.potency_uses_this_scene = 0
        self.strain_clock_filled = 0
        self.scene_tag_id = None
        self.free_invoke_count = 0
        if self.state == DomainState.COLLAPSED:
            self.state = DomainState.DORMANT


# =============================================================================
# Domain Manifestation
# =============================================================================

@dataclass
class ManifestResult:
    """Result of manifesting a domain."""
    success: bool
    dos: int
    scene_tag_created: bool = False
    scene_tag_id: Optional[str] = None
    free_invoke_count: int = 0
    complication_created: bool = False
    complication_tag_id: Optional[str] = None


def calculate_manifest_tn(scene_tier: int) -> int:
    """Calculate TN for domain manifestation."""
    return DOMAIN_MANIFEST_TN_BASE + scene_tier


def manifest_domain(
    domain: Domain,
    actor_bonus: int,
    actor_rank: int,
    scene_tier: int = 0,
    apply_nat_shifts: bool = True
) -> ManifestResult:
    """
    Attempt to manifest a domain per ADR-0009.

    Args:
        domain: The domain to manifest
        actor_bonus: Actor's pillar attack + skill + mods
        actor_rank: Actor's rank for rank dice
        scene_tier: Scene tier (0-4) for TN calculation
        apply_nat_shifts: Whether to apply nat 20/1 shifts

    Returns:
        ManifestResult with success/failure and tag info
    """
    tn = calculate_manifest_tn(scene_tier)
    resolution = resolve_tn(actor_bonus, actor_rank, tn, apply_nat_shifts)
    dos = resolution.final_dos

    if dos >= 1:
        # Success - create scene tag
        free_invokes = 2 if dos >= 3 else 1
        scene_tag_id = f"domain_{domain.domain_id}_{domain.name.lower().replace(' ', '_')}"

        domain.state = DomainState.MANIFESTED
        domain.scene_tag_id = scene_tag_id
        domain.free_invoke_count = free_invokes

        return ManifestResult(
            success=True,
            dos=dos,
            scene_tag_created=True,
            scene_tag_id=scene_tag_id,
            free_invoke_count=free_invokes
        )
    else:
        # Failure - create complication
        complication_id = f"domain_backlash_{domain.domain_id}"
        return ManifestResult(
            success=False,
            dos=dos,
            complication_created=True,
            complication_tag_id=complication_id
        )


# =============================================================================
# Stage Shift Package
# =============================================================================

@dataclass
class StageShiftPackage:
    """A stage shift package for multi-stage conflicts."""
    stage_index: int
    stage_name: str = ""

    # Stat deltas
    ocr_delta: Dict[Pillar, int] = field(default_factory=dict)
    dcr_delta: Dict[Pillar, int] = field(default_factory=dict)
    seq_lvl_delta: int = 0  # Via Over-SCL band

    # Tag modifications
    add_scene_tags: List[str] = field(default_factory=list)
    remove_scene_tags: List[str] = field(default_factory=list)
    add_free_invokes: Dict[str, int] = field(default_factory=dict)

    # Clock modifications
    replace_clocks: Dict[str, Clock] = field(default_factory=dict)
    add_clocks: List[Clock] = field(default_factory=list)
    remove_clock_ids: List[str] = field(default_factory=list)

    # Domain permissions
    allow_domain_overclock: bool = False

    # Compensating weakness (required if any delta >= +3)
    weakness_clock: Optional[Clock] = None


def validate_stage_package(package: StageShiftPackage) -> Tuple[bool, List[str]]:
    """
    Validate a stage package per ADR-0009/0010.

    Returns (is_valid, list_of_errors).
    """
    errors = []

    # Check if any delta >= +3 requires a weakness clock
    max_ocr_delta = max(package.ocr_delta.values()) if package.ocr_delta else 0
    max_dcr_delta = max(package.dcr_delta.values()) if package.dcr_delta else 0

    if max_ocr_delta >= 3 or max_dcr_delta >= 3:
        if package.weakness_clock is None:
            errors.append(
                f"Stage {package.stage_index}: Delta of +3 or more requires a weakness clock"
            )

    return len(errors) == 0, errors


# =============================================================================
# Staged Conflict
# =============================================================================

@dataclass
class StagedConflict:
    """A multi-stage conflict."""
    conflict_id: str
    name: str

    # Stage management
    current_stage: int = 0
    stage_packages: List[StageShiftPackage] = field(default_factory=list)

    # Clocks
    stage_clock: Optional[Clock] = None
    parallel_clocks: List[Clock] = field(default_factory=list)

    # Active stat modifiers (accumulated from stage packages)
    active_ocr_mods: Dict[Pillar, int] = field(default_factory=dict)
    active_dcr_mods: Dict[Pillar, int] = field(default_factory=dict)
    active_seq_lvl_mod: int = 0

    def check_stage_transition(self) -> bool:
        """Check if stage clock is complete and transition should occur."""
        return self.stage_clock is not None and self.stage_clock.is_complete

    def advance_stage(self) -> Optional[StageShiftPackage]:
        """
        Advance to next stage if possible.

        Returns the applied stage package, or None if no transition.
        """
        if not self.check_stage_transition():
            return None

        self.current_stage += 1
        if self.current_stage >= len(self.stage_packages):
            return None  # No more stages

        package = self.stage_packages[self.current_stage]

        # Apply stat deltas
        for pillar, delta in package.ocr_delta.items():
            current = self.active_ocr_mods.get(pillar, 0)
            self.active_ocr_mods[pillar] = current + delta

        for pillar, delta in package.dcr_delta.items():
            current = self.active_dcr_mods.get(pillar, 0)
            self.active_dcr_mods[pillar] = current + delta

        self.active_seq_lvl_mod += package.seq_lvl_delta

        # Reset stage clock
        if self.stage_clock:
            self.stage_clock.reset()

        # Handle clock modifications
        for clock_id in package.remove_clock_ids:
            self.parallel_clocks = [
                c for c in self.parallel_clocks if c.clock_id != clock_id
            ]

        for clock_id, new_clock in package.replace_clocks.items():
            self.parallel_clocks = [
                new_clock if c.clock_id == clock_id else c
                for c in self.parallel_clocks
            ]

        self.parallel_clocks.extend(package.add_clocks)

        return package


# =============================================================================
# Domain Cultivation (Downtime Project)
# =============================================================================

CULTIVATION_SEGMENT_REQUIREMENTS: Dict[Tuple[int, int], int] = {
    (0, 1): 4,   # DomR 0->1: 4 segments
    (1, 2): 6,   # DomR 1->2: 6 segments
    (2, 3): 8,   # DomR 2->3: 8 segments
    (3, 4): 8,   # DomR 3->4: 8 segments + breakthrough event
}


@dataclass
class CultivationProject:
    """A long-term project to improve a domain."""
    project_id: str
    domain_id: str
    target_rank: int
    progress_clock: Clock
    requires_breakthrough: bool = False
    breakthrough_complete: bool = False

    @property
    def is_complete(self) -> bool:
        """Whether the project is complete."""
        if self.requires_breakthrough and not self.breakthrough_complete:
            return False
        return self.progress_clock.is_complete


def create_cultivation_project(
    domain: Domain,
    target_rank: int
) -> CultivationProject:
    """Create a cultivation project for a domain."""
    current_rank = domain.dom_r
    segments = CULTIVATION_SEGMENT_REQUIREMENTS.get(
        (current_rank, target_rank), 8
    )
    requires_breakthrough = target_rank == 4

    return CultivationProject(
        project_id=f"cultivate_{domain.domain_id}_{target_rank}",
        domain_id=domain.domain_id,
        target_rank=target_rank,
        progress_clock=Clock(
            clock_id=f"cultivation_{domain.domain_id}",
            name=f"Cultivate {domain.name} to Rank {target_rank}",
            clock_type=ClockType.PROGRESS,
            segments=segments
        ),
        requires_breakthrough=requires_breakthrough
    )


def process_cultivation_action(
    project: CultivationProject,
    dos: int
) -> int:
    """
    Process a downtime cultivation action.

    Returns number of segments ticked.
    """
    return tick_clock_from_dos(project.progress_clock, dos)


def complete_cultivation(
    domain: Domain,
    project: CultivationProject,
    new_technique_permission: Optional[str] = None
) -> bool:
    """
    Complete a cultivation project and upgrade the domain.

    Returns True if successful.
    """
    if not project.is_complete:
        return False

    domain.dom_r = project.target_rank
    if new_technique_permission:
        domain.unlocked_techniques.append(new_technique_permission)

    return True
