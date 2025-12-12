# SRD WUXIANXIA TTRPG PATCH NOTES

## Overview

This directory contains all patch notes for the Wuxianxia TTRPG system and combat UI implementation. Each patch is tagged with a unique ID for tracking changes.

## Current Live Version

**Version**: ALPHA-0.4.0
**Date**: 2025-12-12
**Status**: 🟢 LIVE

## Patch ID System

Patch IDs follow the format: `PATCH-YYYYMMDD-NNN`

- `YYYYMMDD`: Date of the patch (ISO format)
- `NNN`: Sequential number for patches on the same day (001, 002, etc.)

## Patch Categories

Patches are categorized by type:
- **FEATURE**: New features or major additions
- **ENHANCEMENT**: Improvements to existing functionality
- **BUGFIX**: Bug fixes and corrections
- **BALANCE**: Game balance adjustments
- **DOCS**: Documentation updates
- **SYSTEM**: Core system changes

## Patch Index

| Patch ID | Date | Category | Description | Status |
|----------|------|----------|-------------|--------|
| PATCH-20251212-002 | 2025-12-12 | SYSTEM | ADR Integration - Resolution Engine, Stats, Skills, Techniques, Effects | 🟢 LIVE |
| PATCH-20251212-001 | 2025-12-12 | DOCS | Unified SRD Alpha v0.3 - Complete mechanical systems | 📦 Archived |
| PATCH-20251210-001 | 2025-12-10 | FEATURE | Combat UI Implementation - Initial Release | ✅ Active |

## Patch 0.4 Documentation

The latest release includes Architecture Decision Records:

| Document | Description |
|----------|-------------|
| [PATCH-20251212-002.md](./PATCH-20251212-002.md) | Technical change log for v0.4 |
| [ADR-0001](../adr/ADR-0001-core-resolution-engine.md) | Core Resolution Engine |
| [ADR-0002](../adr/ADR-0002-canonical-stat-model.md) | Canonical Stat Model |
| [ADR-0003](../adr/ADR-0003-bonus-composition-contest-roles.md) | Bonus Composition and Contest Roles |
| [ADR-0004](../adr/ADR-0004-skill-layer-tagging.md) | Skill Layer and Tagging |
| [ADR-0005](../adr/ADR-0005-technique-tag-taxonomy.md) | Technique Tag Taxonomy |
| [ADR-0006](../adr/ADR-0006-effect-resolution-condition-ladders.md) | Effect Resolution and Condition Ladders |
| [ADR-0007](../adr/ADR-0007-tracks-strain-metacurrency.md) | Tracks, Strain, and Meta-Currency |

## Patch 0.3 Documentation

The latest release includes comprehensive documentation:

| Document | Description |
|----------|-------------|
| [PATCH-20251212-001.md](./PATCH-20251212-001.md) | Technical change log |
| [PATCH-20251212-001_ANNOUNCEMENT.md](./PATCH-20251212-001_ANNOUNCEMENT.md) | Community announcement |
| [SRD_v0.3_DEV_DISCUSSION.md](../wuxiaxian-reference/SRD_v0.3_DEV_DISCUSSION.md) | Design rationale & dev notes |

## How to Add a Patch

1. Create a new markdown file: `PATCH-YYYYMMDD-NNN.md`
2. Use the template below
3. Update the index table above
4. Commit with descriptive message

## Patch Template

```markdown
# Patch ID: PATCH-YYYYMMDD-NNN

**Date**: YYYY-MM-DD
**Category**: [FEATURE/ENHANCEMENT/BUGFIX/BALANCE/DOCS/SYSTEM]
**Status**: [ACTIVE/DEPRECATED/SUPERSEDED]

## Summary
Brief one-line description of the patch.

## Changes
- Detailed list of changes
- With specific file paths and modifications

## Affected Systems
- List of affected game systems
- Combat, UI, Backend, etc.

## Testing Notes
- How to test these changes
- Expected behavior

## Migration Notes
- Any breaking changes
- Required updates to existing content

## Related Patches
- Links to related or dependent patches
```
