# Testing
_Last updated: 2026-04-16 (after Phase 2 — Responsive Reader)_

## Current Testing State
**No automated tests exist in the codebase.** There is no test runner configured, no test files present, and no test-related dependencies in `package.json`.

## What Exists
- **ESLint** (`eslint.config.js`) — static analysis
  - `eslint-plugin-react-hooks` — enforces hooks rules
  - `eslint-plugin-react-refresh` — enforces HMR-safe component exports
- **Manual UAT** — described in `STATE.md` via `/gsd-verify-work` workflow

## Testing Gaps (High Priority Before Phase 3)
| Area | Risk | Suggested Test Type |
|---|---|---|
| `useBookDimensions` layout logic | Responsive breakpoint bugs — had regressions in Phase 2 | Unit (Vitest + jsdom) |
| `useReadingProgress` sync | Firestore writes / localStorage interaction | Integration (mock Firebase) |
| `useImagePreloader` LRU cache | Unbounded memory growth | Unit |
| `FlipbookReader` page windowing `useMemo` | Pages not rendering at edges | Unit |
| `GoldCarousel` swipe detection | Gesture thresholds | Unit |
| `WebtoonMode` virtualisation sync | Scroll desync on mode switch | E2E (Playwright) |

## Recommended Testing Stack
```
Vitest + @testing-library/react  →  unit + component tests
Playwright                        →  E2E reader flows (read, zoom, swipe, progress save)
```

## Priority Test Cases to Write First
1. `useBookDimensions` — given container size X, assert correct `singlePageWidth/Height` and breakpoint flags
2. Progress persistence — writes to localStorage immediately; writes to Firestore after 3s debounce
3. Volume loading flow — metadata.json fetch → numPages set → dimensions computed
4. Auth gate — unauthenticated user sees AuthModal, authenticated user enters reader

## Linting
```bash
npm run lint
```
Runs ESLint 9 against all `src/` files.

## Build Validation
```bash
npm run build:fast   # Vite build only (skips PDF conversion)
```
Used as a smoke test — TypeScript errors would surface here if TS were added.
