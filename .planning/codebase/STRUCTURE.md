# Structure
_Last updated: 2026-04-16 (after Phase 2 — Responsive Reader)_

## Directory Tree

```
hq/
├── public/                          # Static assets served at root
│   ├── favicon.png / logo.png       # App icons
│   ├── pwa-192x192.png / pwa-512x512.png  # PWA icons
│   ├── apple-touch-icon.png
│   └── volumes/                     # Comic WebP pages (per volume)
│       ├── primeiraguerra/
│       │   ├── metadata.json        # { numPages }
│       │   └── page.1.webp … page.N.webp
│       ├── segundaguerra/
│       └── stalingrado/
│
├── src/
│   ├── main.jsx                     # Entry: analytics init + RouterProvider
│   ├── App.jsx                      # Shell layout + auth init + route tracking
│   ├── router.jsx                   # Route definitions
│   ├── firebase.js                  # Firebase SDK init
│   ├── analytics.js                 # GA4 wrapper
│   ├── volumes.js                   # Static volume registry
│   ├── index.css                    # Tailwind import + global CSS tokens
│   │
│   ├── components/
│   │   ├── Book.jsx                 # Reader orchestrator (17KB — largest component)
│   │   ├── FlipbookReader.jsx       # react-pageflip + react-zoom-pan-pinch wrapper
│   │   ├── WebtoonMode.jsx          # Virtuoso vertical scroll reader
│   │   ├── Page.jsx                 # Single page renderer (WebP img + shimmer)
│   │   ├── NavigationOverlay.jsx    # Tap zones (left = prev, right = next)
│   │   ├── ReaderControls.jsx       # HUD: back, fullscreen, mode toggle, thumbnails
│   │   ├── ProgressBar.jsx          # Bottom reading progress bar + hint text
│   │   ├── ThumbnailDrawer.jsx      # Slide-in drawer: page thumbnails + chapter list
│   │   ├── ZoomOverlay.jsx          # Zoom state overlay (legacy — check if still used)
│   │   ├── GoldCarousel.jsx         # 3D home carousel (largest component — 14KB)
│   │   ├── VolumeSelector.jsx       # Volume selection screen + auth-gated entry
│   │   ├── AuthModal.jsx            # Google sign-in modal
│   │   ├── PdfThumbnail.jsx         # Lazy-loaded cover image component
│   │   ├── BookLoader.jsx           # Loading spinner for route suspense
│   │   ├── BookWrapper.jsx          # Route adapter: params → Book
│   │   ├── LoadingSpinner.jsx       # Generic spinner
│   │   └── ErrorBoundary.jsx        # Top-level error boundary
│   │
│   ├── hooks/
│   │   ├── useReaderHooks.js        # Core reader logic (312 lines) — 5 hooks:
│   │   │                            #   useBookDimensions, useAutoHideControls,
│   │   │                            #   useFullscreen, useKeyboardNav, useReadingProgress
│   │   ├── useImagePreloader.js     # Bounded ahead-preload (3 pages, LRU-20)
│   │   ├── usePinchZoom.js          # Zoom state coordination with useReaderStore
│   │   ├── useSwipeNavigation.js    # Swipe gesture detection (L/R, threshold-based)
│   │   ├── usePageTurnSound.js      # Page-turn audio effect
│   │   └── useAuth.js              # Auth store accessor hook
│   │
│   └── store/
│       ├── useReaderStore.js        # Reader global state (Zustand)
│       └── authStore.js             # Auth global state (Zustand)
│
├── scripts/
│   └── convert-pdf-to-webp.js      # Node.js PDF → WebP batch converter (pdf2pic)
│
├── package.json
├── vite.config.js                  # Build config + PWA manifest + chunk splitting
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── .env                            # VITE_FIREBASE_* + VITE_GA_MEASUREMENT_ID (gitignored)
```

## Key File Sizes (approximate)
| File | Size | Notes |
|---|---|---|
| `GoldCarousel.jsx` | 14.8 KB | 3D carousel — largest component |
| `Book.jsx` | 9.9 KB | Reader orchestrator |
| `ThumbnailDrawer.jsx` | 8.7 KB | Drawer with dual tabs |
| `useReaderHooks.js` | 12 KB | Core logic hub — 5 hooks |
| `FlipbookReader.jsx` | 5.1 KB | Flipbook + zoom layer |
| `ReaderControls.jsx` | 5.0 KB | HUD overlay |
| `WebtoonMode.jsx` | 3.2 KB | Scroll reader |

## Volume Data (static registry)
3 volumes in `volumes.js`:
1. `vol-1` — Primeira Guerra Mundial (`/volumes/primeiraguerra`)
2. `vol-2` — Segunda Guerra Mundial (`/volumes/segundaguerra`)
3. `vol-3` — Stalingrado (`/volumes/stalingrado`)
