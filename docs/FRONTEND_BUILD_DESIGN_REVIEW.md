# Frontend Build Design Review Report

**Date:** 2025-12-12  
**Repository:** hvrryh-web/idk  
**Scope:** Full Frontend Build System Analysis

---

## Executive Summary

This report provides a comprehensive analysis of the WuXuxian TTRPG frontend build system, identifying critical issues, and outlining actionable fixes to ensure:
1. The Game is always displayed on the Landing Page
2. Testing is much more accessible
3. The build system is robust and reliable

### Current Status: ❌ FAILING BUILD

The frontend build (`npm run build`) currently fails with **32 TypeScript errors** across 16 files.

---

## 1. Architecture Overview

### Frontend Structure
```
frontend/
├── src/
│   ├── App.tsx              # Main router
│   ├── main.tsx             # Entry point
│   ├── api.ts               # API client
│   ├── character/           # Character creator module
│   │   ├── CharacterCreatorPage.tsx  # BROKEN IMPORTS
│   │   ├── components/      # UI components
│   │   ├── state/           # Zustand store
│   │   ├── data/            # Types and config
│   │   └── rendering/       # Compositor
│   ├── components/          # Shared components
│   ├── pages/               # Page components
│   └── screens/             # Screen components
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
└── tsconfig.json            # TypeScript configuration
```

### Landing Page Structure
```
landing/
├── index.html               # Control panel
├── game.html                # Game interface
└── assets/
    ├── css/styles.css
    └── js/app.js, game.js
```

---

## 2. Critical Issues Identified

### 2.1 Build-Breaking TypeScript Errors (32 total)

| Category | Count | Severity |
|----------|-------|----------|
| Import path errors (character module) | 7 | Critical |
| Unused imports/variables | 18 | Medium |
| Missing type definitions | 4 | Medium |
| API signature mismatches | 3 | Medium |

#### 2.1.1 Critical: Character Creator Module Import Paths

**File:** `src/character/CharacterCreatorPage.tsx`

The imports use incorrect relative paths `../` instead of `./`:

```typescript
// BROKEN - goes to parent directory
import { useCharacterCreatorStore } from "../state/useCharacterCreatorStore";
import { PreviewPane } from "../components/PreviewPane";

// CORRECT - stays in character/ directory
import { useCharacterCreatorStore } from "./state/useCharacterCreatorStore";
import { PreviewPane } from "./components/PreviewPane";
```

#### 2.1.2 Medium: ErrorBoundary Missing Props Type

**File:** `src/ErrorBoundary.tsx`

The component doesn't define `children` in its props:

```typescript
// BROKEN
export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState>

// FIXED
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState>
```

#### 2.1.3 Medium: Unused Imports Violating `noUnusedLocals`

Multiple files have unused imports that violate TypeScript strict mode settings.

---

### 2.2 Landing Page Issues

The current landing page (`landing/index.html`) is a **control panel** that:
- Requires manual server start/stop
- Doesn't show the game by default
- Uses mock mode that doesn't interact with the actual React app

**Problem:** Users on GitHub Pages see a control panel, not the game.

**Solution:** 
1. Update GitHub Pages deployment to deploy the built React app
2. Configure Vite with correct `base` path for GitHub Pages

---

### 2.3 Testing Accessibility Issues

#### Current Test Commands
```json
"test": "vitest run",           // Run once
"test:watch": "vitest"          // Watch mode
```

#### Missing Commands
- No coverage reporting command
- No debug mode
- No single-file test command documented

---

## 3. Recommendations and Fixes

### 3.1 Fix Critical Build Errors

1. **Fix CharacterCreatorPage.tsx imports** - Change `../` to `./`
2. **Add children prop to ErrorBoundary** - Add proper TypeScript interface
3. **Remove unused imports** - Clean up files with unused imports
4. **Fix API signature mismatch** - Update `fetchAsciiArt` call in GameScreen

### 3.2 Enable GitHub Pages Game Deployment

1. **Update vite.config.ts** with GitHub Pages base path
2. **Update deploy-pages.yml** to build React app and deploy

### 3.3 Improve Testing Accessibility

1. Add coverage script
2. Add UI test runner command
3. Add documentation for test patterns

---

## 4. Implementation Plan

### Phase 1: Fix Build (Critical)
- [ ] Fix CharacterCreatorPage.tsx import paths
- [ ] Fix ErrorBoundary children prop type
- [ ] Remove unused imports from affected files
- [ ] Fix API signature mismatches

### Phase 2: GitHub Pages Game Deployment
- [ ] Configure Vite for GitHub Pages base path
- [ ] Update deploy-pages.yml to build React app

### Phase 3: Testing Improvements
- [ ] Add comprehensive test scripts to package.json
- [ ] Update testing documentation

---

## 5. Appendix: Full Error List

```
src/character/CharacterCreatorPage.tsx:8 - Cannot find module '../state/useCharacterCreatorStore'
src/character/CharacterCreatorPage.tsx:9 - Cannot find module '../components/PreviewPane'
src/character/CharacterCreatorPage.tsx:10 - Cannot find module '../components/CategoryTabs'
src/character/CharacterCreatorPage.tsx:11 - Cannot find module '../components/OptionGrid'
src/character/CharacterCreatorPage.tsx:12 - Cannot find module '../components/SwatchPicker'
src/character/CharacterCreatorPage.tsx:13 - Cannot find module '../data/types'
src/character/CharacterCreatorPage.tsx:14 - Cannot find module '../rendering/compositor'
src/ErrorBoundary.tsx:34 - Property 'children' does not exist on type 'Readonly<{}>'
src/pages/GameScreen.tsx:20 - Expected 0 arguments, but got 1 (fetchAsciiArt call)
+ 23 unused import/variable warnings
```

---

*Report generated as part of the Frontend Build Design Review initiative.*
