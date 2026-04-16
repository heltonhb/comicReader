# Conventions
_Last updated: 2026-04-16 (after Phase 2 — Responsive Reader)_

## Language & Syntax
- **JavaScript only** — no TypeScript
- **ES Modules** (`"type": "module"` in package.json)
- **JSX** for all React components (`.jsx` extension)
- Non-component JS uses `.js` extension (hooks, store, utils)

## Component Conventions
- **Functional components only** — no class components
- **Default exports** for all components
- **Named exports** for hooks and store slices
- **`React.memo`** used for list-item components (`ThumbnailItem`, `WebtoonPage`, `VolumeThumbnail`)
- `displayName` set on memoed components for DevTools clarity
- Components receive props via destructuring at function signature level

## File Naming
| Type | Convention | Example |
|---|---|---|
| Components | PascalCase `.jsx` | `FlipbookReader.jsx` |
| Hooks | camelCase `use*` `.js` | `useImagePreloader.js` |
| Stores | camelCase `.js` | `useReaderStore.js`, `authStore.js` |
| Utilities | camelCase `.js` | `analytics.js`, `volumes.js` |

## Styling
- **Tailwind CSS utility classes** are the primary styling mechanism
- **Inline `style={{}}` props** for dynamic values (dimensions, transforms, opacity from state)
- Tailwind **custom theme** defined in `tailwind.config.js` (not inspected — likely extends colors with `primary`, `background`)
- **`index.css`** handles:
  - Tailwind import (`@tailwind base/components/utilities`)
  - Global resets (touch-action, overscroll, user-select)
  - Dark color scheme defaults
  - Custom scrollbar for WebKit
  - `.stf__wrapper` mobile override for react-pageflip
  - `.reader-container` transition for smooth orientation changes
  - `@keyframes shimmer` + `.animate-shimmer` utility
  - Safe-area inset support for notched devices

## Design Tokens (from `index.css` + THEME constant)
| Token | Value | Usage |
|---|---|---|
| background | `#0a0f1c` | App root background |
| text default | `#F3F4F6` | Body text |
| gold | `#D4AF37` | Primary accent (carousel, progress, active states) |
| silver | `#C0C0C0` | Secondary text |
| red/crimson | `#8B0000` → `#B22222` | CTA buttons, active indicators |
| Font family | Montserrat, Roboto, system-ui | Loaded from CSS `font-family` (no Google Fonts CDN — browser fallback) |

## State Management Conventions
- **Zustand** stores are created with `create()` in separate files under `src/store/`
- Store slices are kept **flat** (no nested state objects except `pdfDimensions`)
- **`reset()`** action on `useReaderStore` for cleanup on volume close
- **`initAuth()`** returns unsubscribe function; called in `useEffect` with proper cleanup

## Hooks Conventions
- All custom hooks in `src/hooks/`
- Hooks use `useCallback` and `useMemo` for stable references / expensive computations
- `useRef` used heavily for mutable state that doesn't trigger re-renders (timers, cached sets, imperatives)
- `useEffect` cleanup functions always implemented for timers and event listeners

## Analytics Conventions
- **Never import `gtag` directly** — always use `trackEvent(name, params)` from `analytics.js`
- Event names use `snake_case`
- Every event includes contextual params (e.g., `volume_id`, `page_number`)

## Import Order (observed, not enforced by linter)
1. React and React hooks
2. Third-party libraries
3. Local components
4. Local hooks
5. Local store
6. Local utils / data

## Comments
- JSDoc-style comments on hooks (e.g., `useBookDimensions`, `useImagePreloader`)
- Inline comments explain `why`, not `what`, for non-obvious code
- `// eslint-disable-line` used sparingly (1 instance in analytics.js)
- Portuguese-language comments appear in some areas (matching the Brazilian target audience)

## Error Handling
- `try/catch` with console.error for Firebase calls
- Graceful degradation: if `metadata.json` fails, reader still mounts (handles null `numPages`)
- `ErrorBoundary` at app root for hard crashes
- Fullscreen API wrapped in try/catch (browser compatibility)
