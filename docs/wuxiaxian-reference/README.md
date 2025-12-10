# Wuxiaxian TTRPG Design Reference Documentation

This directory contains comprehensive analysis and design documentation for the Wuxiaxian TTRPG project, synthesized from the original design documents in the `WUXUXIANXIA TTRPG/` folder.

## Purpose

These documents serve as:
1. **Source of truth** for design intent and mechanical pillars
2. **Implementation roadmap** for aligning code with design vision
3. **Reference guide** for understanding Wuxiaxian concepts and terminology
4. **Planning documentation** for combat UI and system improvements

## Documents Overview

### 1. [DESIGN_SUMMARY.md](./DESIGN_SUMMARY.md)

**Comprehensive system design summary extracted from design documents.**

**Contents:**
- Core stats and resources (9 Primary Stats, 3 Core Stats, 3 Aether Stats)
- Soul Core Level (SCL) system and calculation
- Sequence bands (Cursed/Low/Mid/High/Transcendent)
- Combat resources (THP, AE, Strain, Guard)
- Three conflict pillars (Violence, Influence, Revelation)
- Condition ladders (4-step degradation tracks)
- Cost tracks (Blood, Fate, Stain)
- Technique system and Quick Actions
- Key mechanical pillars and design constraints

**Read this first** to understand the complete Wuxiaxian system design.

---

### 2. [REPO_ARCHITECTURE_ANALYSIS.md](./REPO_ARCHITECTURE_ANALYSIS.md)

**Detailed analysis of current codebase structure and design alignment.**

**Contents:**
- Repository structure breakdown
- Architectural patterns (backend layered, frontend component-based)
- Location of combat/system logic (simulation engine, data models)
- Location of VN/UI logic (React pages, components)
- What's implemented vs. what's missing
- Critical mismatches between design and implementation
- Technical debt and code quality assessment
- Recommendations for alignment

**Read this second** to understand the current state and gaps.

---

### 3. [COMBAT_UI_DESIGN.md](./COMBAT_UI_DESIGN.md)

**Comprehensive combat UI design for VN + TTRPG hybrid.**

**Contents:**
- UX flow for a typical combat encounter
- Component breakdown (existing to reuse, new to create)
- Technical implementation details
- API integration requirements
- Phased implementation plan
- Concrete code examples (React + TypeScript)
- Styling approach recommendations

**Read this third** to understand how to build the combat UI.

---

### 4. [ACTIONABLE_IMPROVEMENTS.md](./ACTIONABLE_IMPROVEMENTS.md)

**Prioritized, concrete improvements with code examples.**

**Contents:**
- **Priority 1**: Data model enhancements (stat system, conditions, cost tracks)
- **Priority 2**: Combat engine refactoring (data-driven techniques, reusable functions)
- **Priority 3**: Terminology alignment (SCL, Wuxiaxian glossary)
- **Priority 4**: UI/UX improvements (character sheets, condition display)
- **Priority 5**: Testing and documentation
- Effort estimates and implementation order

**Read this fourth** to get actionable next steps.

---

## Quick Reference: Key Concepts

### Stats Hierarchy

```
9 Primary Stats (purchased with PP)
  ├─ Soul Cluster: Essence, Resolve, Presence
  ├─ Body Cluster: Strength, Endurance, Agility
  └─ Mind Cluster: Technique, Willpower, Focus
           ↓ (averages)
3 Core Stats (derived)
  ├─ Body Core
  ├─ Mind Core
  └─ Soul Core
           ↓
Core Level (CL) = avg(Body, Mind, Soul Core)

3 Aether Stats (purchased separately)
  ├─ Control
  ├─ Fate
  └─ Spirit
           ↓
Soul Level (SL) = avg(Control, Fate, Spirit)

SCL = CL + SL  ← Main balance dial
Sequence ≈ SCL ← Narrative label
```

### Combat Resources

- **THP**: Health (death at 0)
- **AE**: Technique fuel (regenerates per round)
- **Strain**: Overexertion tracker (death at max)
- **Guard**: Temporary armor

### Conflict Types

1. **Violence** → Body Defense → Physical conditions
2. **Influence** → Mind Defense → Social conditions
3. **Revelation** → Soul Defense → Horror conditions

### Cost Tracks

- **Blood**: Physical toll (glass cannon penalty)
- **Fate**: Destiny debt (luck manipulation cost)
- **Stain**: Corruption (moral erosion)

### Sequence Bands

| Band | SCL | Tier |
|------|-----|------|
| Cursed-Sequence | 1-2 | Broken/collapsing |
| Low-Sequence | 3-4 | Street-level |
| Mid-Sequence | 5-7 | Professional |
| High-Sequence | 8-10 | Demigod |
| Transcendent | 11+ | True God |

---

## How to Use These Documents

### For Developers

1. **Starting new work?**
   - Read DESIGN_SUMMARY.md for context
   - Check REPO_ARCHITECTURE_ANALYSIS.md for current state
   - Pick an item from ACTIONABLE_IMPROVEMENTS.md

2. **Building combat UI?**
   - Follow COMBAT_UI_DESIGN.md implementation plan
   - Start with Phase 1 (core display components)
   - Reference provided code examples

3. **Refactoring existing code?**
   - Check REPO_ARCHITECTURE_ANALYSIS.md for mismatches
   - Prioritize based on ACTIONABLE_IMPROVEMENTS.md
   - Align terminology with DESIGN_SUMMARY.md

### For Designers

1. **Understanding the system?**
   - DESIGN_SUMMARY.md has the complete mechanical framework
   - Look for "Design Intent" and "Non-Negotiable" sections

2. **Checking implementation fidelity?**
   - REPO_ARCHITECTURE_ANALYSIS.md lists all mismatches
   - Section "Mismatches Between Design Intent and Implementation"

3. **Planning new features?**
   - COMBAT_UI_DESIGN.md shows how mechanics translate to UI
   - ACTIONABLE_IMPROVEMENTS.md shows extensibility patterns

### For Product/Project Managers

1. **Estimating work?**
   - ACTIONABLE_IMPROVEMENTS.md has effort estimates
   - Total: 19-27 hours for all Priority 1-5 items

2. **Prioritizing features?**
   - Priority 1 items are foundation (required first)
   - Quick wins listed at bottom of ACTIONABLE_IMPROVEMENTS.md
   - Combat UI needs Priority 1 + Priority 2 items

3. **Understanding technical debt?**
   - REPO_ARCHITECTURE_ANALYSIS.md section "Technical Debt"
   - Current strengths vs. gaps clearly listed

---

## Related Files in Repository

### Design Documents (Source Material)

Located in `/WUXUXIANXIA TTRPG/`:
- `Wuxianxia Game Full Chat Context.md` - Complete system design (5816 lines)
- `Wuxianxia Game Chat Start (long).md` - Initial design phase (2343 lines)
- `Wuxianxia Game Chat Start (2).md` through `(6).md` - Design iterations
- Various Excel files with SoulCore mechanics and boss designs

### Implementation Files

**Backend (Python/FastAPI)**:
- `backend/app/models/characters.py` - Character data model
- `backend/app/models/techniques.py` - Technique data model
- `backend/app/simulation/engine.py` - Monte Carlo simulation
- `backend/app/simulation/combat_state.py` - Combat state management
- `backend/app/simulation/quick_actions.py` - Quick action logic

**Frontend (React/TypeScript)**:
- `frontend/src/pages/GameRoom.tsx` - Main VN launcher
- `frontend/src/pages/ProfileSheet.tsx` - Character profile
- `frontend/src/components/` - Reusable UI components
- `frontend/src/types.ts` - TypeScript type definitions

**Database**:
- `backend/schema.sql` - PostgreSQL schema
- Tables: characters, techniques, boss_templates, simulations

---

## Implementation Status

### ✅ Completed

- Basic combat simulation engine (1-beat and 3-stage)
- Resource management (THP, AE, Strain, Guard)
- Quick Actions (all 7 types)
- Monte Carlo simulation for balance testing
- Database schema and API endpoints
- Visual Novel page structure

### 🔄 Partial

- Character stats (generic "level" instead of full SCL system)
- Technique system (base_damage instead of attack/effect separation)
- Combat (only Violence pillar, no Influence/Revelation)
- UI (VN pages exist but no combat UI)

### ❌ Not Started

- Full 12-stat system with SCL calculation
- Condition tracking (4-step ladders)
- Cost tracks (Blood, Fate, Stain)
- Player-controlled combat UI
- Social and horror conflict mechanics
- Playbook/archetype system

---

## Next Steps

### Immediate (Week 1)

1. Implement Priority 1 improvements from ACTIONABLE_IMPROVEMENTS.md
   - Expand Character model with full stat system
   - Add condition tracking
   - Add cost tracks

2. Start Combat UI Phase 1 from COMBAT_UI_DESIGN.md
   - Create CombatView.tsx skeleton
   - Create CombatantCard.tsx with resource bars
   - Set up routing for `/combat/:encounterId`

### Short Term (Weeks 2-4)

1. Complete Priority 2 improvements
   - Refactor technique system (attack/effect separation)
   - Extract reusable combat functions
   - Make quick actions data-driven

2. Complete Combat UI Phases 2-3
   - Add action selection (techniques, quick actions)
   - Add target selection
   - Add combat result screen

### Medium Term (Months 2-3)

1. Implement Influence and Revelation conflict types
2. Build character creation wizard with playbooks
3. Add social and horror mechanics
4. Comprehensive testing and balance tuning

---

## Questions or Feedback?

If you have questions about:
- **System design**: See DESIGN_SUMMARY.md or original design docs
- **Current implementation**: See REPO_ARCHITECTURE_ANALYSIS.md
- **UI/UX**: See COMBAT_UI_DESIGN.md
- **What to do next**: See ACTIONABLE_IMPROVEMENTS.md

For technical questions, check:
- `README.md` in repository root
- `ARCHITECTURE.md` for system architecture
- `CONTRIBUTING.md` for development guidelines

---

## Document Maintenance

These documents should be updated when:
- Design intent changes significantly
- Major implementation milestones are reached
- Mismatches are resolved
- New features are added

**Last Updated**: 2025-12-10
**Generated From**: Design documents in `WUXUXIANXIA TTRPG/` folder
**Status**: Initial comprehensive analysis complete
