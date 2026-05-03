# Architecture - Gibiteca HQ

## High-Level Structure

```
src/
├── main.jsx              # Entry point
├── router.jsx            # React Router config
├── App.jsx               # Root layout
├── volumes.js            # Volume registry
├── firebase.js           # Firebase config
├── analytics.js          # GA4 tracking
├── store/                # Zustand stores
│   ├── useReaderStore.js  # Reader state (zoom, mode, thumbnails)
│   ├── authStore.js       # Auth state (user, login, logout)
│   └── adminStore.js      # Admin state (upload, management)
├── hooks/                # React hooks
│   ├── useAuth.js         # Auth hook
│   ├── useAdminCheck.js   # Admin check hook
│   ├── useReaderHooks.js  # Reading hooks (dimensions, controls, fullscreen)
│   ├── usePageTurnSound.js
│   ├── useSwipeNavigation.js
│   ├── usePinchZoom.js
│   ├── useImagePreloader.js
│   └── useBookController.ts  # Extracted controller logic
├── components/           # React components
│   ├── VolumeSelector.jsx  # Library view (GoldCarousel)
│   ├── BookWrapper.jsx     # Lazy-loaded book container
│   ├── Book.tsx            # Main reader component
│   ├── FlipbookReader.jsx  # Flipbook mode
│   ├── WebtoonMode.jsx     # Webtoon mode
│   ├── Page.jsx            # Single page render
│   ├── ReaderControls.jsx  # Navigation controls
│   ├── ProgressBar.jsx      # Reading progress
│   ├── ThumbnailDrawer.jsx  # Page thumbnails
│   ├── AuthModal.jsx       # Login modal
│   ├── AdminRoute.jsx      # Protected route wrapper
│   └── AdminPanel.jsx      # Admin dashboard
└── types/                # TypeScript definitions
    └── index.ts
```

## State Management

### Zustand Stores

1. **useReaderStore** - Reader UI state
   - `isZoomed`, `zoomScale`
   - `readingMode` (flipbook/webtoon)
   - `showThumbnails`
   - `pdfDimensions`

2. **authStore** - Authentication
   - `user`, `loading`
   - `loginWithGoogle()`, `loginAnonymously()`, `logout()`

3. **adminStore** - Admin functionality
   - Upload, volume management

## Data Flow

```
VolumeSelector → BookWrapper → Book → FlipbookReader/WebtoonMode → Page
                    ↓
              useBookController (extracted logic)
                    ↓
         useReaderHooks (dimensions, controls, fullscreen)
```

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | VolumeSelector | Library/carousel |
| `/read/:volumeId` | BookWrapper | Reader (lazy) |
| `/admin` | AdminPanel | Admin (protected) |

## Key Patterns

- **Lazy Loading**: BookWrapper, AdminPanel loaded via `React.lazy()`
- **Custom Hooks**: Logic extracted to hooks for reusability
- **PWA**: Service Worker via vite-plugin-pwa
- **Local Storage**: Reading progress persistence