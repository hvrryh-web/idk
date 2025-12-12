# Architecture Decision Records (ADRs)

## Overview

This directory contains Architecture Decision Records for the WUXUXIANXIA TTRPG system. ADRs document important architectural decisions, their context, and consequences. They serve as the canonical source of truth for core game mechanics and system design.

## ADR Format

ADRs follow the [Nygard-style](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) headings:

- **Title**: ADR-NNNN descriptive title
- **Status**: Proposed | Accepted | Deprecated | Superseded
- **Context**: The issue motivating this decision
- **Decision**: The change being proposed
- **Consequences**: What becomes easier or more difficult

## Immutability Rule

ADRs are immutable records. Once accepted, they cannot be silently edited. Future changes must be made via superseding ADRs that explicitly reference and replace earlier decisions.

## ADR Index

| ADR ID | Title | Status | Date |
|--------|-------|--------|------|
| [ADR-0001](./ADR-0001-core-resolution-engine.md) | Core Resolution Engine (Opposed d20 + Rank Dice, ±4 DoS) | Accepted | 2025-12-12 |
| [ADR-0002](./ADR-0002-canonical-stat-model.md) | Canonical Stat Model and Pillar→Defense Mapping | Accepted | 2025-12-12 |
| [ADR-0003](./ADR-0003-bonus-composition-contest-roles.md) | Bonus Composition and Contest Roles | Accepted | 2025-12-12 |
| [ADR-0004](./ADR-0004-skill-layer-tagging.md) | Skill Layer and Tagging | Accepted | 2025-12-12 |
| [ADR-0005](./ADR-0005-technique-tag-taxonomy.md) | Technique Tag Taxonomy and Validation Rules | Accepted | 2025-12-12 |
| [ADR-0006](./ADR-0006-effect-resolution-condition-ladders.md) | Effect Resolution and Condition Ladders | Accepted | 2025-12-12 |
| [ADR-0007](./ADR-0007-tracks-strain-metacurrency.md) | Tracks, Strain, Overflow, and Meta-Currency Spends | Accepted | 2025-12-12 |

## Relationship to SRD

- ADRs define the canonical mechanical rules
- The Unified SRD references ADRs for core mechanics
- SRD chapters must not introduce alternative core procedures without a superseding ADR
- Implementation code must align with ADR specifications

## Future ADRs

| ADR ID | Title | Status |
|--------|-------|--------|
| ADR-0008 | Equipment and Gear Tags | Proposed |
| ADR-0009 | GM Guidelines and Scene Structure | Proposed |
