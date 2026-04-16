# Stack
_Last updated: 2026-04-16 (after Phase 2 — Responsive Reader)_

## Core
- **Frontend Framework:** React 18.3.1
- **Language:** JavaScript (ES Modules, JSX) — no TypeScript
- **Styling:** Tailwind CSS v3.4 + vanilla CSS (`index.css` for global resets and tokens)
- **Animations:** Framer Motion 12 (AnimatePresence, motion.div, spring transitions)
- **Icons:** Lucide React 0.563

## Key Libraries
| Library | Version | Purpose |
|---|---|---|
| `react-pageflip` | 2.0.3 | HTML 3D page-flip engine (Flipbook mode) |
| `react-zoom-pan-pinch` | 3.7.0 | Pinch-to-zoom, pan, double-tap, zoom reset |
| `react-virtuoso` | 4.18.1 | Virtualised list rendering (Webtoon mode + ThumbnailDrawer) |
| `react-router-dom` | 7.13 | SPA routing (`/` → VolumeSelector, `/read/:volumeId` → BookWrapper) |
| `zustand` | 5.0.11 | Global state (authStore, useReaderStore) |
| `use-resize-observer` | 9.1 | DOM resize tracking (fallback for ResizeObserver) |
| `framer-motion` | 12.33 | Page transitions, drawer animations, control fade-in/out |

## Backend / Services
- **BaaS:** Firebase 12 (Auth + Firestore only — Storage not used)
- **Analytics:** Google Analytics 4 via `gtag.js` (custom wrapper in `analytics.js`)
- **Legacy:** Mixpanel listed in `package.json` but NOT used in current code — consider removing

## Tooling
| Tool | Purpose |
|---|---|
| Vite 7.2 | Dev server + production bundler |
| `@vitejs/plugin-react` | React Fast Refresh + JSX transform |
| `vite-plugin-pwa` 1.2 | Service worker, manifest, runtime caching |
| ESLint 9 | Linting with `eslint-plugin-react-hooks` + `react-refresh` |
| `pdf2pic` 3.1 (dev) | Node.js script (`scripts/convert-pdf-to-webp.js`) to convert PDFs to WebP |
| `autoprefixer` + `postcss` | CSS vendor prefixes |

## Build Chunks (manual Rollup splitting)
- `vendor` → react, react-dom, react-router-dom
- `firebase` → firebase/app, firebase/auth, firebase/firestore
- `pageflip` → react-pageflip
- `ui` → framer-motion, lucide-react
