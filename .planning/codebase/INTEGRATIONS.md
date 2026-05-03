# Integrations - Gibiteca HQ

## External Services

### Firebase

| Service | Purpose |
|---------|---------|
| Firebase Auth | Google + Anonymous login |
| Cloud Firestore | (future: user data, reading progress) |
| Cloud Storage | (future: uploaded volumes) |

**Config**: `src/firebase.js`

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ...
};
```

### Google Analytics 4

- **Purpose**: Track reading events, page views
- **Config**: `VITE_GA_MEASUREMENT_ID` env var
- **Fallback**: No-op if ID not configured
- **Events**: `flip_page`, `start_volume`, `select_volume`

### Mixpanel

- **Purpose**: Analytics (backup/supplementary)
- **Config**: `src/analytics.js`

## Browser APIs

### Service Worker (PWA)

- **Plugin**: vite-plugin-pwa
- **Features**: Offline support, update notifications
- **Config**: `vite.config.js` → pwa section

### Fullscreen API

- **Usage**: Fullscreen reading mode
- **Hook**: useFullscreen in `useReaderHooks.js`

### LocalStorage

- **Usage**: Reading progress persistence
- **Key pattern**: `hq-reader-*`

## Build Integration

### Vite

- **HMR**: Fast development
- **PWA**: Offline-first
- **Build**: Optimized production bundles

### PDF Conversion

- **Script**: `scripts/convert-pdf-to-webp.js`
- **Purpose**: Convert uploaded PDFs to WebP images
- **Command**: `npm run convert-hqs` (part of build)