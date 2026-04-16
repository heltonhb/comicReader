# Concerns
_Last updated: 2026-04-16 (after Phase 2 — Responsive Reader)_

## 🔴 Critical

### 1. No Tests
- Zero test coverage across all 17 components, 6 hooks, and 2 stores
- `useBookDimensions` breakpoint logic had regressions in Phase 2 — would be caught by unit tests
- Risk increases significantly before adding Phase 3 Admin Panel complexity

---

## 🟠 High Priority

### 2. `Book.jsx` is Over-Orchestrated (317 lines, 12 hook calls)
- Single component manages: dimensions, page state, swipe, keyboard, fullscreen, progress, analytics, mode switch, thumbnail state
- Violates single-responsibility — difficult to test and maintain
- **Recommendation:** Extract a `useBookOrchestrator` hook or split into sub-contexts

### 3. Volume Registry is Hardcoded (`volumes.js`)
- Adding a new volume requires a code deploy — no CMS or admin interface
- PDFs and WebP folders are manually placed in `/public/volumes/`
- Chapters for ThumbnailDrawer are passed as `volume.chapters` but this field is undefined in all 3 current volumes — the chapters tab in ThumbnailDrawer is dead code
- **Phase 3 Admin Panel** should address this directly

### 4. Dead / Unused Code
- `mixpanel-browser` in `package.json` but unused — adds ~50 KB to bundle
- `ZoomOverlay.jsx` component exists but is not imported anywhere in the current component tree
- `react-pdf` was removed but comment remains: `// Removed PDF callbacks as react-pdf is no longer used`
- Volume `file` field (PDF path) no longer used in reading — only for thumbnail fallback

### 5. No TypeScript
- Props shape for `Book.jsx` and `FlipbookReader.jsx` are complex (12+ props each)
- No type safety — prop errors only detected at runtime
- `pdfDimensions` default `{ width: 595, height: 842, aspectRatio: 0.707 }` hardcoded in store — magic number

---

## 🟡 Medium Priority

### 6. Auth Gate Behavior
- `AuthModal` blocks access for unauthenticated users at the app shell level  
- No anonymous/guest reading mode — all content gated behind Google login
- If Firebase Auth is unavailable, the app blocks access with no fallback message

### 7. React-Pageflip Library Limitations
- `react-pageflip` is a 3rd-party wrapper around StPageFlip — limited maintenance
- Mobile landscape mode disables aspect ratio enforcement (forced edge-to-edge) — by design but may cause blurry pages
- Spreading keyboard events via imperative `bookRef.current.pageFlip()` API tightly couples keyboard nav to FlipBook implementation

### 8. Image Loading Strategy Has Gaps
- `useImagePreloader` preloads 3 pages ahead using `new Image()` — good
- But there is **no shimmer/skeleton** shown when a page is in RENDER_WINDOW but its image hasn't loaded yet (only lazy-loading attribute handles this)
- `Page.jsx` should implement shimmer for images transitioning from loading → loaded state

### 9. `visualViewport` API Not Universal
- Used to compute precise mobile height to avoid address bar issues
- Fallback to `window.innerHeight` if missing — but the two can disagree and cause layout jumps on scroll-triggered toolbar hide on iOS Safari

### 10. Firestore Progress Sync: No Offline Handling
- If user flips pages while offline, localStorage saves correctly but Firestore write silently fails with no retry
- On next online session, progress starts from last successful Firestore save, not last local save

---

## 🟢 Low Priority / Watch

### 11. CSS Specificity Hack for react-pageflip
- `.stf__wrapper` and `.stf__parent` overridden with `!important` in `index.css`
- Fragile — will break if react-pageflip renames internal class names

### 12. `body { touch-action: none }` Global Disable
- Globally disables native scroll and zoom — intentional for the reader experience
- May cause issues for any future pages that need native scrolling (e.g., Admin Panel)
- Recommend scoping `touch-action: none` to `.reader-container` instead of `body`

### 13. No Rate Limiting on Analytics
- Every page flip calls `trackEvent('flip_page')` synchronously
- Rapid flipping (keyboard hold) sends many events per second to GA4
- Consider debouncing analytics calls

### 14. `chunkSizeWarningLimit: 1500` in vite.config.js
- Threshold raised to suppress warnings rather than reduce chunk size
- Should be addressed by actually reducing bundle size (e.g., remove mixpanel)
