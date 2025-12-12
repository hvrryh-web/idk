# Fate Card Builder - Full Integration Implementation Plan

**Date:** 2025-12-12  
**PR Purpose:** Integrate Fate Card Builder with character creation and implement automated wiki generation  
**Status:** Planning Phase

---

## Executive Summary

This plan addresses the integration of the Fate Card Builder feature with the character creation backend and implements a wiki generation system that automatically populates character entries. The implementation ensures unique character IDs (already provided via UUID), connects the Fate Card Builder to character persistence, and creates an extensible wiki template system.

---

## Requirements Summary

### 1. Comments to Address
- ✅ **@hvrryh-web**: "review and make sure player characters after entering character creation produce a new unique character model and receive a new unique character ID"
  - **Current Status**: Backend already auto-generates UUID via `backend/app/models/characters.py` (line 29)
  - **Action Required**: Verify frontend properly receives and stores UUID after creation

### 2. New Requirement: Wiki Generation System
- Read new character data and Fate Card Builder results
- Generate visual asset prerequisites (using existing CharacterCreatorPage patterns)
- Populate wiki templates for Character and Person pages
- Integrate with existing wiki system (`WikiIndex.tsx`, `WikiArticle.tsx`)

---

## Current State Analysis

### ✅ Already Implemented
- **Fate Card Builder Core**: Types, state management, token decks (6 categories, 72 tokens)
- **Seeded RNG**: Reproducible token draws with localStorage persistence
- **Basic UI**: `/fate-card-builder` route with 9-step stepper interface
- **Character UUID**: Backend auto-generates unique UUIDs via SQLAlchemy
- **Character Creation API**: `POST /api/v1/characters` endpoint functional
- **Character Appearance System**: CharacterCreatorPage with asset pipeline

### ⚠️ Gaps to Fill
1. **Fate Card Builder → Backend Connection**: No API integration yet
2. **Character Data Enrichment**: Fate Card results not stored in character model
3. **Wiki Generation**: No automated wiki template system exists
4. **Visual Asset Integration**: No connection between Fate Card results and appearance generation
5. **Data Flow**: Three separate systems don't communicate

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User Journey                                 │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  1. FATE CARD BUILDER (/fate-card-builder)                          │
│     - Foundation Chat (Action/Problem statements)                    │
│     - 6 Categories × 4 Questions = 24 answers                        │
│     - Output: BuildState with answers, complications, seed           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  2. CHARACTER APPEARANCE (/character/create)                         │
│     - Base model selection (male/female)                             │
│     - 5 Categories: Hair, Eyes, Brows, Mouth, Outfit                 │
│     - Color swatches (skin, hair, fabric)                            │
│     - Output: AppearanceData JSON                                    │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  3. CHARACTER CREATION (/characters/create)                          │
│     - Basic info (name, type, description)                           │
│     - Stats allocation (9 primary + 3 aether)                        │
│     - Legacy fate card picker (to be deprecated)                     │
│     - Output: CharacterCreationData                                  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  4. UNIFIED CHARACTER CREATION API                                   │
│     POST /api/v1/characters                                          │
│     - Accepts: name, type, stats, description                        │
│     - NEW: fateCardBuildState, appearance, wikiMetadata              │
│     - Generates: UUID, computes SCL, initializes conditions/tracks   │
│     - Returns: Character with UUID                                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  5. WIKI GENERATION SERVICE                                          │
│     - Reads: Character + BuildState + Appearance                     │
│     - Generates: Wiki entry from template                            │
│     - Stores: In database (new wiki_entries table)                   │
│     - Surfaces: Via /wiki/characters/:id route                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

See detailed sections below for:
- Phase 1: Backend Schema & API Extensions
- Phase 2: Frontend Integration  
- Phase 3: Visual Asset Pipeline Integration
- Phase 4: Testing & Validation
- Phase 5: Documentation & Polish

---

## Implementation Checklist

### Phase 1: Backend (High Priority)
- [ ] Create migration script `001_fate_card_builder_integration.sql`
- [ ] Apply migration to database
- [ ] Create `WikiEntry` model (`backend/app/models/wiki_entry.py`)
- [ ] Update `Character` model with new fields
- [ ] Create `WikiGeneratorService` (`backend/app/services/wiki_generator.py`)
- [ ] Create `CharacterWikiTemplate` (`backend/app/services/wiki_templates.py`)
- [ ] Create `AssetPrerequisiteGenerator` (`backend/app/services/asset_generator.py`)
- [ ] Create wiki routes (`backend/app/api/routes/wiki.py`)
- [ ] Update character routes to accept new fields
- [ ] Register wiki router in `main.py`
- [ ] Write backend unit tests
- [ ] Write integration tests

### Phase 2: Frontend (High Priority)
- [ ] Update `api.ts` with new types and functions
- [ ] Create `UnifiedCharacterCreation` component
- [ ] Create `CharacterWiki` display component
- [ ] Update `FateCardBuilderPage` with export hook
- [ ] Update `CharacterCreatorPage` with continue hook
- [ ] Update `WikiIndex.tsx` to include dynamic character entries
- [ ] Add routes to `App.tsx`
- [ ] Write frontend component tests

### Phase 3: Asset Pipeline (Medium Priority)
- [ ] Implement asset prerequisite generation logic
- [ ] Add asset suggestion loading in `CharacterCreatorPage`
- [ ] Test tag-to-asset mapping
- [ ] Document asset suggestion system

### Phase 4: Testing & Validation (High Priority)
- [ ] Run all backend tests (`pytest`)
- [ ] Run all frontend tests (`npm test`)
- [ ] Run integration tests
- [ ] Manual E2E testing of full flow
- [ ] Verify UUID generation and uniqueness

### Phase 5: Documentation (Medium Priority)
- [ ] Update `openapi.yaml` with new schemas
- [ ] Create user guide (`FATE_CARD_BUILDER_GUIDE.md`)
- [ ] Create developer guide (`WIKI_GENERATION_API.md`)
- [ ] Update `ARCHITECTURE.md`
- [ ] Update `README.md` with new features
- [ ] Create patch note in `docs/patch-notes/`

---

## Success Criteria

1. ✅ **Unique Character IDs**: Every character has a unique UUID (already working)
2. ✅ **Fate Card Integration**: Fate Card Builder state persists to character model
3. ✅ **Appearance Integration**: Character appearance data persists to character model
4. ✅ **Wiki Generation**: Wiki entries are automatically created for new characters
5. ✅ **Wiki Display**: Users can view auto-generated wiki entries
6. ✅ **Asset Suggestions**: Visual asset prerequisites are generated from fate cards
7. ✅ **End-to-End Flow**: Users can complete full character creation and see wiki
8. ✅ **Tests Pass**: All unit, integration, and E2E tests pass

---

## Timeline Estimate

- **Phase 1 (Backend)**: 3-4 days
- **Phase 2 (Frontend)**: 3-4 days
- **Phase 3 (Assets)**: 2 days
- **Phase 4 (Testing)**: 2 days
- **Phase 5 (Documentation)**: 1 day

**Total**: ~12-15 days for full implementation

---

## Risk Assessment

### High Risk
- **Database Migration**: Schema changes could fail if existing characters have conflicting data
  - **Mitigation**: Test migration on copy of production data first
  - **Rollback**: Keep old columns as nullable, add new columns separately

### Medium Risk
- **Data Loss**: Fate Card Builder state stored only in localStorage could be lost
  - **Mitigation**: Add periodic server-side backups during build process
  - **Mitigation**: Add "Save Draft" button that persists to backend

### Low Risk
- **Performance**: Wiki generation could be slow for complex characters
  - **Mitigation**: Generate asynchronously with job queue
  - **Mitigation**: Cache generated wikis

---

## Key Technical Decisions

### 1. Schema Design
**Decision**: Add `fate_card_build_state` and `appearance_data` as JSONB columns to `characters` table rather than separate tables.

**Rationale**: 
- Simpler queries (no JOINs needed)
- JSONB supports flexible schema evolution
- PostgreSQL JSONB has excellent indexing and query performance
- Character data is always loaded together

**Trade-offs**:
- Less normalized (duplicate data if shared across characters)
- Harder to enforce schema constraints at DB level
- Acceptable for this use case since each character's fate card results are unique

### 2. Wiki Generation Trigger
**Decision**: Generate wiki entry immediately after character creation via API call.

**Rationale**:
- Immediate feedback to user
- Simple implementation (no job queue needed initially)
- Can be made async later if performance is an issue

**Trade-offs**:
- Character creation endpoint becomes slower
- Could fail if wiki generation has bugs
- Mitigation: Make wiki generation optional/retryable

### 3. Asset Suggestion System
**Decision**: Generate suggestions server-side based on tags, provide as API response.

**Rationale**:
- Centralizes business logic
- Easier to test and iterate
- Frontend remains thin presentation layer

**Trade-offs**:
- Extra API call for suggestions
- Could cache suggestions in character model if performance is critical

---

## Data Structures Reference

### BuildState (from Fate Card Builder)
```typescript
{
  seed: string,
  mode: "standard" | "quick" | "custom",
  step: BuildStep,
  foundation: {
    action: string,
    problem: string
  },
  categories: {
    prior_life_demise?: CategoryProgress,
    relife_vessel?: CategoryProgress,
    cursed_technique_core?: CategoryProgress,
    technique_mechanism?: CategoryProgress,
    binding_vows_costs?: CategoryProgress,
    growth_awakening?: CategoryProgress
  },
  complications: ComplicationEntry[],
  complicationCount: number,
  drawHistory: any[],
  createdAt: number,
  lastModified: number
}
```

### AppearanceData (from Character Creator)
```typescript
{
  version: "1.0.0",
  baseModel: "male" | "female",
  selections: {
    hair: string,
    eyes: string,
    brows: string,
    mouth: string,
    outfit: string
  },
  swatches: {
    skin: string,
    hair: string,
    fabric: string
  },
  seed?: number
}
```

### WikiEntry Content Structure
```typescript
{
  overview: {
    name: string,
    type: string,
    lineage: string,
    level: number,
    scl: number
  },
  background: {
    action_statement: string,
    problem_statement: string,
    prior_life: string,
    reincarnation: string,
    cursed_technique: {
      core: string,
      mechanism: string,
      costs: string,
      growth: string
    }
  },
  appearance: {
    base_model: string,
    selections: Record<string, string>,
    swatches: Record<string, string>
  },
  abilities: {
    stats: {
      primary: Record<string, number>,
      aether: Record<string, number>
    },
    techniques: string[]
  },
  personality: {
    traits: string[]
  },
  history: {
    created_at: string,
    major_events: any[]
  }
}
```

---

## Implementation Details

### Backend Files to Create
1. `backend/migrations/001_fate_card_builder_integration.sql` - DB migration
2. `backend/app/models/wiki_entry.py` - WikiEntry model
3. `backend/app/services/wiki_generator.py` - Wiki generation service
4. `backend/app/services/wiki_templates.py` - Template rendering
5. `backend/app/services/asset_generator.py` - Asset prerequisite generation
6. `backend/app/api/routes/wiki.py` - Wiki API endpoints
7. `backend/tests/test_wiki_generator.py` - Unit tests
8. `backend/tests/test_asset_generator.py` - Unit tests
9. `tests/integration/test_character_creation_flow.py` - Integration tests

### Backend Files to Update
1. `backend/app/models/characters.py` - Add fate_card_build_state, appearance_data fields
2. `backend/app/api/routes/characters.py` - Update CharacterCreate schema, add asset prereq endpoint
3. `backend/app/main.py` - Register wiki router
4. `backend/schema.sql` - Add columns and wiki_entries table

### Frontend Files to Create
1. `frontend/src/pages/UnifiedCharacterCreation.tsx` - Orchestration component
2. `frontend/src/pages/CharacterWiki.tsx` - Wiki display component
3. `frontend/src/__tests__/UnifiedCharacterCreation.test.tsx` - Component tests

### Frontend Files to Update
1. `frontend/src/api.ts` - Add wiki API functions, new types
2. `frontend/src/App.tsx` - Add new routes
3. `frontend/src/fateCardBuilder/pages/FateCardBuilderPage.tsx` - Add export hook
4. `frontend/src/character/CharacterCreatorPage.tsx` - Add continue hook, asset suggestions
5. `frontend/src/pages/WikiIndex.tsx` - Add dynamic character entries

### Documentation Files to Create
1. `docs/FATE_CARD_BUILDER_GUIDE.md` - User guide
2. `docs/WIKI_GENERATION_API.md` - Developer API guide
3. `docs/patch-notes/PATCH-20251212-001.md` - Patch note for this feature

### Documentation Files to Update
1. `backend/openapi.yaml` - Add wiki endpoints
2. `ARCHITECTURE.md` - Document wiki system
3. `README.md` - Mention new features

---

## Dependencies

### Backend
- ✅ SQLAlchemy (already installed)
- ✅ FastAPI (already installed)  
- ✅ pytest (for testing)
- ✅ PostgreSQL with UUID extension (already configured)

### Frontend
- ✅ React Router (already installed)
- ✅ Zustand (already installed)
- ✅ @testing-library/react (for tests)

**No new dependencies required** ✅

---

## Questions for Review

1. ✅ **Character UUID Generation**: Already working correctly via SQLAlchemy default
2. Should wiki entries support manual editing after auto-generation?
3. Should we version wiki entries (track edit history)?
4. Should asset suggestions be mandatory or can users skip?
5. Should we support wiki generation for NPCs/locations in Phase 1 or defer to Phase 2?

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Get approval** on technical decisions
3. **Begin Phase 1**: Backend schema and API implementation
4. **Parallel work**: Frontend can start once API contracts are defined
5. **Iterate**: Adjust plan based on feedback and discoveries during implementation

---

**End of Implementation Plan**
