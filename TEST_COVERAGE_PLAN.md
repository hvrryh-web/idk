# Testing Coverage Plan

## Backend (Python)
- Add `pytest-cov` to `requirements-dev.txt`:
  ```
  pytest-cov
  ```
- Run tests with coverage:
  ```bash
  pytest --cov=app --cov-report=term-missing
  ```
- Set up CI to fail if coverage < 80% (see .github/workflows/).
- Expand tests in `backend/tests/` for character creation, combat, and error cases.

## Frontend (React)
- Add coverage to Vitest config:
  ```bash
  npm install --save-dev vitest @vitest/coverage-v8
  ```
- Add to `vite.config.ts`:
  ```ts
  import { defineConfig } from 'vite';
  import coverage from '@vitest/coverage-v8';
  export default defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
    plugins: [coverage()],
  });
  ```
- Run frontend coverage:
  ```bash
  npm run coverage
  ```
- Expand tests for character creation, combat actions, and UI flows in `frontend/src/__tests__/`.

## CI Enforcement
- Add coverage checks to CI workflows (GitHub Actions or similar).
- Fail builds if coverage drops below threshold.
