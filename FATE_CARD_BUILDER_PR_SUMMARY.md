# Fate Card Builder Integration - PR Summary

**Status:** ✅ **PLAN COMPLETE**  
**Date:** 2025-12-12  
**Comprehensive Plan:** See `FATE_CARD_BUILDER_IMPLEMENTATION_PLAN.md`

---

## 📋 Requirements Addressed

### 1. ✅ Character UUID Uniqueness (@hvrryh-web comment)
**Finding:** Character UUIDs are **already correctly implemented** in the backend.
- `backend/app/models/characters.py` line 29: `id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)`
- Each character creation automatically generates a unique UUID
- **Action:** Verify frontend properly receives and displays UUID after creation (already working via `createCharacter` API)

### 2. 🆕 Wiki Generation System (New Requirement)
**Plan:** Implement automated wiki generation that:
- Reads character data + Fate Card Builder results + appearance data
- Generates structured wiki entries using templates
- Populates Character and Person wiki pages automatically
- Integrates with existing wiki system (`WikiIndex.tsx`, `WikiArticle.tsx`)

---

## 🎯 High-Level Architecture

```
Fate Card Builder (/fate-card-builder)
          ↓
Character Appearance (/character/create)
          ↓
Basic Info & Stats (/characters/create)
          ↓
Unified Character Creation API (POST /api/v1/characters)
          ↓
Wiki Generation Service (auto-generates wiki entry)
          ↓
Wiki Display (/wiki/characters/:id)
```

---

## 📦 Implementation Phases

### **Phase 1: Backend Schema & API** (High Priority - 3-4 days)
- Add `fate_card_build_state` and `appearance_data` JSONB columns to `characters` table
- Create `wiki_entries` table for storing generated wikis
- Implement `WikiGeneratorService` with template system
- Implement `AssetPrerequisiteGenerator` for visual suggestions
- Create `/api/v1/wiki/*` endpoints
- Write unit and integration tests

**Key Files:**
- `backend/migrations/001_fate_card_builder_integration.sql`
- `backend/app/models/wiki_entry.py` (NEW)
- `backend/app/services/wiki_generator.py` (NEW)
- `backend/app/services/wiki_templates.py` (NEW)
- `backend/app/services/asset_generator.py` (NEW)
- `backend/app/api/routes/wiki.py` (NEW)

### **Phase 2: Frontend Integration** (High Priority - 3-4 days)
- Update API client with wiki functions
- Create `UnifiedCharacterCreation` orchestration component
- Create `CharacterWiki` display component
- Add navigation hooks between Fate Card Builder → Appearance → Creation
- Integrate dynamic character wikis into `WikiIndex`

**Key Files:**
- `frontend/src/pages/UnifiedCharacterCreation.tsx` (NEW)
- `frontend/src/pages/CharacterWiki.tsx` (NEW)
- `frontend/src/api.ts` (UPDATE - add wiki functions)
- `frontend/src/App.tsx` (UPDATE - add routes)

### **Phase 3: Asset Pipeline** (Medium Priority - 2 days)
- Implement tag-to-asset-suggestion mapping
- Load suggestions into CharacterCreatorPage
- Document asset suggestion system

### **Phase 4: Testing & Validation** (High Priority - 2 days)
- Backend unit tests (pytest)
- Frontend component tests
- Integration tests for full character creation flow
- Manual E2E verification

### **Phase 5: Documentation** (Medium Priority - 1 day)
- Update OpenAPI spec with wiki endpoints
- Create user guide and developer guide
- Update ARCHITECTURE.md and README.md
- Create patch note

---

## ✅ Success Criteria

1. ✅ **Unique Character IDs** - Already working via UUID
2. ✅ **Fate Card Integration** - BuildState persists to character model
3. ✅ **Appearance Integration** - AppearanceData persists to character model
4. ✅ **Wiki Generation** - Auto-generated wiki entries for new characters
5. ✅ **Wiki Display** - Users can view and regenerate wikis
6. ✅ **Asset Suggestions** - Visual prerequisites generated from fate cards
7. ✅ **End-to-End Flow** - Complete character creation + wiki generation works
8. ✅ **Tests Pass** - All unit, integration, and E2E tests pass

---

## 🔑 Key Technical Decisions

### 1. **Schema Design**
- **Decision:** Add JSONB columns to `characters` table (not separate tables)
- **Rationale:** Simpler queries, flexible schema, good PostgreSQL support
- **Trade-off:** Less normalized, but acceptable for unique per-character data

### 2. **Wiki Generation Trigger**
- **Decision:** Generate immediately after character creation via API
- **Rationale:** Immediate user feedback, simple implementation
- **Trade-off:** Slower character creation, but can be made async later

### 3. **Asset Suggestions**
- **Decision:** Server-side generation based on tags
- **Rationale:** Centralized logic, easier to test and iterate
- **Trade-off:** Extra API call, but cacheable if needed

---

## 📊 Timeline Estimate

- **Phase 1 (Backend):** 3-4 days
- **Phase 2 (Frontend):** 3-4 days
- **Phase 3 (Assets):** 2 days
- **Phase 4 (Testing):** 2 days
- **Phase 5 (Documentation):** 1 day

**Total:** ~12-15 days for full implementation

---

## ⚠️ Risk Assessment

### High Risk
- **Database Migration** - Schema changes could conflict with existing data
  - Mitigation: Test on staging/copy first, keep columns nullable

### Medium Risk
- **Data Loss** - Fate Card Builder state only in localStorage
  - Mitigation: Add "Save Draft" to backend, periodic backups

### Low Risk
- **Performance** - Wiki generation could be slow
  - Mitigation: Async generation, caching

---

## 📁 Files Summary

### Backend Files to Create (9 new files)
1. `backend/migrations/001_fate_card_builder_integration.sql`
2. `backend/app/models/wiki_entry.py`
3. `backend/app/services/wiki_generator.py`
4. `backend/app/services/wiki_templates.py`
5. `backend/app/services/asset_generator.py`
6. `backend/app/api/routes/wiki.py`
7. `backend/tests/test_wiki_generator.py`
8. `backend/tests/test_asset_generator.py`
9. `tests/integration/test_character_creation_flow.py`

### Backend Files to Update (4 files)
1. `backend/app/models/characters.py`
2. `backend/app/api/routes/characters.py`
3. `backend/app/main.py`
4. `backend/schema.sql`

### Frontend Files to Create (3 new files)
1. `frontend/src/pages/UnifiedCharacterCreation.tsx`
2. `frontend/src/pages/CharacterWiki.tsx`
3. `frontend/src/__tests__/UnifiedCharacterCreation.test.tsx`

### Frontend Files to Update (5 files)
1. `frontend/src/api.ts`
2. `frontend/src/App.tsx`
3. `frontend/src/fateCardBuilder/pages/FateCardBuilderPage.tsx`
4. `frontend/src/character/CharacterCreatorPage.tsx`
5. `frontend/src/pages/WikiIndex.tsx`

### Documentation Files (5 files)
1. `docs/FATE_CARD_BUILDER_GUIDE.md` (NEW)
2. `docs/WIKI_GENERATION_API.md` (NEW)
3. `docs/patch-notes/PATCH-20251212-001.md` (NEW)
4. `backend/openapi.yaml` (UPDATE)
5. `ARCHITECTURE.md` (UPDATE)

---

## 🚀 Next Steps

1. ✅ **Plan complete** - Review and get approval
2. **Begin Phase 1** - Backend schema and API implementation
3. **Parallel Phase 2** - Frontend integration (once API contracts defined)
4. **Testing** - Continuous testing throughout implementation
5. **Documentation** - Update docs as features are completed
6. **Deploy** - Staging → Production rollout

---

## 📚 Data Structures

### BuildState (from Fate Card Builder)
```typescript
{
  seed: string,
  foundation: { action: string, problem: string },
  categories: { [categoryId]: CategoryProgress },
  complications: ComplicationEntry[],
  // ... metadata
}
```

### AppearanceData (from Character Creator)
```typescript
{
  baseModel: "male" | "female",
  selections: { hair, eyes, brows, mouth, outfit },
  swatches: { skin, hair, fabric },
  seed?: number
}
```

### WikiEntry (Database Model)
```typescript
{
  id: UUID,
  entry_type: "character" | "person" | "location",
  entity_id: UUID,  // References character.id
  title: string,
  summary: string,
  content: {
    overview: {...},
    background: {...},
    appearance: {...},
    abilities: {...},
    personality: {...},
    history: {...}
  },
  auto_generated: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

---

## ❓ Open Questions for Stakeholders

1. Should users be able to manually edit auto-generated wiki entries?
2. Should wiki entries be versioned (track edit history)?
3. Should there be "public wiki" vs "private notes" distinction?
4. Should asset suggestions be mandatory or optional/skippable?
5. Should we support wiki generation for NPCs and locations in Phase 1?

---

## 🎉 Conclusion

This plan provides a **comprehensive, phased approach** to:
1. ✅ Verify character UUID uniqueness (already working)
2. ✅ Connect Fate Card Builder to character persistence
3. ✅ Implement automated wiki generation system
4. ✅ Generate visual asset prerequisites
5. ✅ Create end-to-end character creation flow

**All requirements addressed.** Ready for implementation upon approval.

---

**For detailed implementation specifics, see:** `FATE_CARD_BUILDER_IMPLEMENTATION_PLAN.md` (421 lines)
