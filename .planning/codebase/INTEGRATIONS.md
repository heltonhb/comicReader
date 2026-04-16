# Integrations
_Last updated: 2026-04-16 (after Phase 2 — Responsive Reader)_

## Firebase
- **Auth:** `firebase/auth` — Google OAuth (`signInWithPopup` + `GoogleAuthProvider`)
- **Firestore:** `firebase/firestore` — Stores per-user reading progress at `users/{uid}/progress/{volumeId}` with fields `{ currentPage, updatedAt }`
- **Storage:** Not used — comic images are served as static WebP files from the hosting file system
- **Hosting:** Site deployed via Firebase Hosting (implied by `firebase deploy` in STATE.md)
- **Config:** All credentials from Vite env vars (`VITE_FIREBASE_*`)

## Analytics
- **Platform:** Google Analytics 4 (GA4) via `gtag.js` CDN script — dynamically injected by `analytics.js`
- **Initialised:** On app boot via `initAnalytics()` in `main.jsx`
- **Tracked Events:**
  | Event | Trigger | Properties |
  |---|---|---|
  | `page_view` | Route change (App.jsx) | `{ path }` |
  | `flip_page` | Page flip (Book.jsx) | `{ volume_id, page_number }` |
  | `start_volume` | Book loads + restored (Book.jsx) | `{ volume_id, num_pages }` |
- **Config key:** `VITE_GA_MEASUREMENT_ID`

## PWA / Service Worker
- **Plugin:** `vite-plugin-pwa` with `autoUpdate` strategy
- **Runtime caching (Workbox):**
  - `.pdf` files → `NetworkFirst` (30-day cache, 10 max entries)
  - `.webp` files → `CacheFirst` (60-day cache, 200 max entries)
- **Manifest:** App name "Gibiteca HQ", standalone display, landscape orientation, dark theme `#000000`

## Static Assets / CDN
- Comic pages served as `/volumes/{slug}/page.{N}.webp` from Firebase Hosting root
- PDF originals at `/{slug}_final.pdf` (public but mainly for PDF-to-WebP conversion script)
- `metadata.json` per volume at `/volumes/{slug}/metadata.json` with `{ numPages }` used to init the reader

## Environment Variables Required
| Var | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID |

## Dead / Unused Integrations
- `mixpanel-browser` — installed as dependency but **not imported anywhere in current code**; candidate for removal to reduce bundle size
