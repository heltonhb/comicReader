# Architecture
_Last updated: 2026-04-16 (after Phase 2 — Responsive Reader)_

## Application Type
Single-page application (SPA) — React 18 + Vite 7. No SSR. Deployed to Firebase Hosting.

## Top-Level Architecture

```
src/
├── main.jsx          → App entry: initAnalytics() + createRoot + RouterProvider
├── router.jsx        → createBrowserRouter: "/" → VolumeSelector, "/read/:id" → BookWrapper (lazy)
├── App.jsx           → Shell: initAuth() + page_view tracking + AuthModal gate + <Outlet>
├── firebase.js       → Firebase init (auth, db, googleProvider)
├── analytics.js      → GA4 wrapper (initAnalytics, trackEvent)
├── volumes.js        → Static VOLUMES registry [{id, title, file, folder}]
├── index.css         → Tailwind base + global resets + design tokens
│
├── components/       → UI layer
├── hooks/            → Logic isolation layer
└── store/            → Global state (Zustand)
```

## Routing (react-router-dom v7)
| Route | Component | Notes |
|---|---|---|
| `/` | `VolumeSelector` | Eager-loaded; shows carousel and handles auth gate |
| `/read/:volumeId` | `BookWrapper` (lazy) | Lazy-loaded with `<Suspense>` spinner; resolves volume from params |

## Component Hierarchy (Reader)
```
BookWrapper
└── Book               ← orchestrator: all reader state + hooks
    ├── ReaderControls  ← top HUD (back, fullscreen, mode toggle, thumbnails btn)
    ├── FlipbookReader  ← Flipbook mode
    │   ├── TransformWrapper (react-zoom-pan-pinch)
    │   │   ├── ZoomResetButton
    │   │   └── TransformComponent
    │   │       └── HTMLFlipBook (react-pageflip)
    │   │           └── Page[] (windowed by RENDER_WINDOW=3 / PRELOAD_WINDOW=5)
    │   └── NavigationOverlay (tap zones: prev/next)
    ├── WebtoonMode     ← Webtoon (vertical scroll) mode
    │   └── Virtuoso (react-virtuoso virtualised list)
    │       └── WebtoonPage → Page
    ├── ProgressBar     ← bottom progress bar + hint text
    ├── ThumbnailDrawer ← left-side slide-in drawer (pages + chapters tabs)
    │   └── Virtuoso → ThumbnailItem[]
    └── BookLoader      ← spinner shown before dimensions resolve
```

## Component Hierarchy (Library / Home)
```
VolumeSelector
└── GoldCarousel      ← 3D perspective carousel with CSS 3D transforms
    └── VolumeThumbnail → PdfThumbnail (lazy, renders first WebP frame)
```

## State Architecture
| Layer | Store | Concerns |
|---|---|---|
| **Global — Auth** | `authStore` (Zustand) | `user`, `loading`, `initAuth`, `loginWithGoogle`, `logout` |
| **Global — Reader** | `useReaderStore` (Zustand) | `isZoomed`, `zoomScale`, `readingMode`, `showThumbnails`, `pdfDimensions` |
| **Local — Book** | `useState` in Book.jsx | `numPages`, `error`, flipbook `bookRef` |
| **Persisted — Progress** | `useReadingProgress` hook | LocalStorage (instant) + Firestore (debounced 3s, user-gated) |

## Data Flow: Volume Loading
1. `BookWrapper` resolves `volumeId` from URL params → finds volume in `VOLUMES` array
2. `Book` mounts → `enterFullscreen()` → fetches `{folder}/metadata.json` for `numPages`
3. Loads `page.1.webp` to detect actual page dimensions → sets `pdfDimensions`
4. `useBookDimensions` watches container via ResizeObserver → computes responsive layout
5. `FlipbookReader` pre-renders pages (RENDER_WINDOW) + preloads ahead (PRELOAD_WINDOW) + `useImagePreloader`

## Reading Modes
| Mode | Mechanism | Virtualisation |
|---|---|---|
| **Flipbook** | `react-pageflip` (HTMLFlipBook) | Page windowing via `useMemo` (render ±3, preload ±5) |
| **Webtoon** | Vertical scroll list | `react-virtuoso` full virtualisation |

## Performance Patterns
- **Manual chunk splitting** in vite.config.js (vendor / firebase / pageflip / ui)
- **Lazy route** for BookWrapper via `React.lazy`
- **PWA caching:** `.webp` CacheFirst (60 days), `.pdf` NetworkFirst (30 days)
- **Image preloading:** `useImagePreloader` with 20-item bounded LRU cache
- **ResizeObserver** for responsive layout recalculation (debounced 100ms)
- **visualViewport API** for precise mobile height (avoids address bar issues)
- **Progress debounce:** Firestore writes debounced 3s to avoid on-every-flip writes
