# SRD v0.3 - Developer Discussion & Design Rationale

**Document Type**: Developer Notes
**Version**: ALPHA-0.3.0-20251212
**Date**: 2025-12-12
**Author**: Development Team

---

## Executive Summary

This document provides the design rationale, developer discussion points, and implementation notes for the unified SRD v0.3 release. It serves as a companion to the technical patch notes and explains *why* decisions were made.

---

## 1. Why Unify the SRD?

### Problem Statement

Prior to v0.3, the SRD was fragmented across multiple patch files:
- `SRD_ALPHA_PATCH_0.1.md` - Sections 0-2
- `SRD_ALPHA_PATCH_0.2.md` - Sections 3-4
- `SRD_ALPHA_STRUCTURE.md` - Template

This caused several issues:
1. **Discovery burden**: New users had to read multiple files
2. **Cross-reference difficulty**: Rules spanning sections required file switching
3. **Maintenance overhead**: Updates required coordinating across files
4. **Versioning confusion**: Which patch contained which rules?

### Solution: Single Source of Truth

The unified SRD (`SRD_UNIFIED.md`) consolidates all content into one comprehensive document with:
- Internal navigation via Table of Contents
- Live patch indicator showing current version
- Archived patch index for historical reference
- Self-contained rules with no external dependencies

### Design Decision

**Chosen**: Single unified document with patch history section
**Rejected**: Multi-file with shared index, Wiki-style linked pages
**Rationale**: TTRPG SRDs are typically single documents for printing/offline use

---

## 2. Cap Formula Change: 2×SCL → 4×SCL

### Problem Statement

The original M&M 3e formula uses `2 × PL` for attack + effect caps:
- At PL 10: Attack + Effect ≤ 20

This worked well for M&M's range (PL 1-20), but our SCL range is narrower (typically 1-10 for most play). This created granularity issues:
- At SCL 5: Attack + Effect ≤ 10 (only 11 possible distributions)
- Tradeoffs too coarse (every +1/-1 was 10% of total budget)

### Solution: 4× Multiplier

By using `4 × SCL`:
- At SCL 5: Attack + Effect ≤ 20 (21 possible distributions)
- Finer granularity for tradeoffs
- Power Draws Blood profiles can use ±2 without massive impact

### Trade-offs Considered

| Formula | At SCL 5 | At SCL 10 | Granularity |
|---------|----------|-----------|-------------|
| 2×SCL | 10 | 20 | Coarse |
| 3×SCL | 15 | 30 | Medium |
| **4×SCL** | **20** | **40** | **Fine** ✓ |
| 5×SCL | 25 | 50 | Too fine |

### Design Decision

**Chosen**: 4×SCL
**Rationale**: Matches M&M's PL 10 feel at SCL 5 (our recommended starting level), provides fine granularity without excessive number inflation

---

## 3. Power Draws Blood Profiles

### Design Philosophy

The core philosophy "Power Draws Blood" means:
> Optimization and specialization come with mechanical costs.

PDB Profiles codify this into the build system:

### Profile Design

**Balanced** (Default):
- No bonuses or penalties
- No cost track triggers
- Recommended for new players

**Blood-Forward** (Glass Cannon):
- +2 OffCap / -2 DefCap
- Marks Blood Track when taking 4th degree condition
- For aggressive damage dealers

**Ward-Forward** (Bulwark):
- -2 OffCap / +2 DefCap
- Marks Blood Track when *dealing* 4th degree condition
- For tanks and protectors

### Why Per-Pillar?

Players choose a profile for *each* pillar independently:
- A character might be Blood-Forward in Violence but Balanced in Influence
- Creates diverse builds without complex multi-profile interactions
- Maintains "three pillars are equal" design principle

### Rejected Alternatives

- **Single global profile**: Too restrictive, reduces build diversity
- **Sliding scale**: Too complex, analysis paralysis
- **More profile options**: Diminishing returns, three covers major archetypes

---

## 4. Layered Durability Model

### Problem Statement

Simple HP systems create "bag of hit points" gameplay:
- All damage is equivalent
- No tactical decisions around damage type
- Death spirals are abrupt

### Solution: Three Layers

**Layer 1: Resolve Charges**
- Deplete first, provide damage buffer
- Separate pools per pillar (PRC/MRC/SRC)
- Enable DR while active

**Layer 2: DR Tiers (0-6)**
- Percentage-based reduction (0-60%)
- Only active while Resolve Charges remain
- Creates "armor breaking" tactical gameplay

**Layer 3: Health Pool (THP/MHP/SP)**
- Final damage destination
- 0 = incapacitated

### Tactical Implications

This creates interesting decisions:
- "Should I focus fire to break their Resolve Charges?"
- "Should I spread damage to prevent charge depletion?"
- "High DR targets need chip damage to deplete charges first"

### Tuning Philosophy

All durability values are data-driven constants in `srd_constants.py`:
```python
DR_TIERS = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
RESOLVE_CHARGE_SCL_BONUSES = {(1,4): 0, (5,7): 1, (8,10): 2, (11,99): 3}
```

This allows balance tuning without code changes.

---

## 5. Meta-Currencies (Fury/Clout/Insight)

### Design Goals

1. **Pillar parity**: Each conflict type has equal meta-resource support
2. **Risk-reward**: Earning requires engagement, spending creates impact
3. **Session rhythm**: Some reset per encounter, some persist

### Currency Design

| Currency | Pillar | Resets | Thematic Feel |
|----------|--------|--------|---------------|
| Fury | Violence | Per encounter | Building rage, combat momentum |
| Clout | Influence | Persists | Reputation, accumulated leverage |
| Insight | Revelation | Persists (danger) | Forbidden knowledge, cosmic awareness |

### Special Mechanics

**Fury**: Resets to 0 each encounter
- Prevents hoarding across sessions
- Encourages spending during combat

**Insight Danger Threshold**: At 8+ Insight, GM may introduce Revelation threats
- Creates risk-reward for Revelation focus
- Narrative hook for cosmic horror elements

### Event Bus Architecture

All currency changes emit events:
```python
bus.emit(RulesEvent("FURY_GAINED", amount=1, source="critical_hit"))
```

This enables:
- Combat log integration
- Achievement tracking
- Narrative triggers

---

## 6. Boss Scaling System

### Problem Statement

Bosses need different mechanics than PCs:
- Single target vs. party action economy
- Multi-phase encounters for dramatic pacing
- Tuning knobs for difficulty adjustment

### Rank System Design

| Rank | Actions | Phases | Party Equivalence |
|------|---------|--------|-------------------|
| 1 | 1 | 1 | 1-2 PCs |
| 2 | 2 | 1 | 2-3 PCs |
| 3 | 3 | 1 | Full party |
| 4 | 3 | 2 | Full party + challenge |
| 5 | 4 | 3 | Full party, major |

### Multiplier Philosophy

HP multipliers scale aggressively (1.5× to 5.0×) because:
- Bosses face entire party's damage output
- Multi-phase fights need health to span phases
- DR tiers provide damage reduction, requiring more base HP

### Generator Function

```python
baseline = generate_boss_baseline(party_scl=5, boss_rank=3)
# Returns recommended bands, HP, charges, DR profile
```

This provides starting points for GMs while allowing customization.

---

## 7. Backend Integration Rationale

### Why Integrate SRD with Code?

1. **Single source of truth**: Constants defined once, used everywhere
2. **Validation**: Character builder can enforce caps
3. **Diagnostics**: Debug tools for rule edge cases
4. **Testing**: Unit tests verify rule implementations

### Module Design

**srd_constants.py**: Pure data, no database dependencies
- Can be imported anywhere
- Easy to update values without code changes
- Serves as executable specification

**srd_validation.py**: Logic layer
- Takes stats, returns validation results
- Provides actionable error messages
- Tradeoff advisor suggests fixes

**srd_diagnostics.py**: Debug tools
- CLI for integration health check
- Detailed calculation breakdowns
- Combat state analysis

### Testing Philosophy

61 unit tests cover:
- Every calculation formula
- Edge cases (zero stats, max stats)
- Validation logic
- Boss scaling

Tests serve as executable documentation.

---

## 8. OVR/DVR Terminology

### Why Adopt HERO Terminology?

HERO System uses OCV/DCV (Offensive/Defensive Combat Value) which clearly express:
- **OCV**: Your ability to hit (to-hit rating)
- **DCV**: Your ability to avoid being hit (to-be-hit rating)

M&M uses "Attack" and "Defense" which are more intuitive but less precise.

### Our Solution: OVR/DVR

| Term | Meaning | HERO Analogue |
|------|---------|---------------|
| OVR | Offense Value Rating | OCV |
| DVR | Defense Value Rating | DCV |

### Alias Support

The code supports both terminologies:
- `violence_ovr` and `violence_attack` are aliases
- Documentation uses OVR/DVR consistently
- Frontend can display either based on user preference

---

## 9. Future Considerations

### Patch 0.4: Techniques & Effects

Key decisions needed:
- Effect taxonomy (from SoulCore_Effects_and_Playbooks.xlsx)
- Extras/Flaws system and cost modifiers
- Technique templates for quick building

### Patch 0.5: GM Guidelines

Key decisions needed:
- Encounter building formulas
- Narrative framework integration
- Setting-specific rules

### Beta 1.0: Integration

- Full frontend character builder
- Real-time cap validation
- Combat simulation UI integration

---

## 10. Lessons Learned

### What Worked Well

1. **Data-driven constants**: Easy tuning, clear specification
2. **Comprehensive testing**: Caught formula errors early
3. **Single unified document**: Reduced fragmentation
4. **Event-based currencies**: Clean UI integration

### What Could Improve

1. **Stat naming alignment**: Legacy field names need migration
2. **Frontend type sync**: TypeScript types should auto-generate from Python
3. **Playtest feedback loop**: Need structured collection mechanism

### Technical Debt

- Character model stat names don't match SRD (dexterity vs agility)
- Aether stat mapping is provisional (fire/ice/void → control/fate/spirit)
- Combat engine doesn't yet use Resolve Charges

---

## Appendix: Decision Log

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| 2025-12-12 | 4×SCL cap formula | Finer granularity | ✅ Implemented |
| 2025-12-12 | Per-pillar PDB profiles | Build diversity | ✅ Implemented |
| 2025-12-12 | 3-layer durability | Tactical depth | ✅ Implemented |
| 2025-12-12 | Insight danger threshold | Risk-reward | ✅ Implemented |
| 2025-12-12 | Rank-based boss scaling | Tuning flexibility | ✅ Implemented |
| 2025-12-12 | OVR/DVR terminology | HERO clarity | ✅ Implemented |
| 2025-12-12 | Unified SRD document | Single source | ✅ Implemented |

---

## Contact

For questions about design decisions:
- Review this document
- Check SRD_INTEGRATION_GUIDE.md for technical details
- Consult PATCH-20251212-001.md for change list

---

**Document Status**: Complete
**Last Updated**: 2025-12-12
**Related Documents**:
- SRD_UNIFIED.md
- SRD_INTEGRATION_GUIDE.md
- PATCH-20251212-001.md
