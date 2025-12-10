# SRD WUXIANXIA TTRPG PATCH NOTES

## Overview

This directory contains all patch notes for the Wuxianxia TTRPG system and combat UI implementation. Each patch is tagged with a unique ID for tracking changes.

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

| Patch ID | Date | Category | Description |
|----------|------|----------|-------------|
| PATCH-20251210-001 | 2025-12-10 | FEATURE | Combat UI Implementation - Initial Release |

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
