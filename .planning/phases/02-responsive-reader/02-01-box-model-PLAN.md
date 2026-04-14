---
phase: 02
plan: "02-01"
title: "Box-Model Responsivo Edge-to-Edge"
wave: 1
depends_on: []
files_modified:
  - src/hooks/useReaderHooks.js
  - src/components/FlipbookReader.jsx
  - src/components/Book.jsx
  - src/index.css
autonomous: true
requirements: []
---

# Plan 02-01: Limitação Inteligente do Box-Model do react-pageflip

## Goal
Eliminar barras pretas invasivas e garantir que o flipbook ocupe edge-to-edge em todos os breakpoints (mobile portrait, mobile landscape, tablet, desktop), respeitando o aspect-ratio real das páginas WebP.

## must_haves
- Flipbook preenche 100% da viewport sem barras pretas visíveis em mobile portrait
- Aspect-ratio das páginas é preservado (sem distorção)
- Desktop landscape mantém spread de 2 páginas lado a lado
- Mobile landscape preenche altura da viewport
- Tablet portrait usa página única com largura máxima
- Transição suave ao rotacionar o dispositivo (sem layout jumps)

## Tasks

### Task 1: Refatorar useBookDimensions para cálculo edge-to-edge

<read_first>
- src/hooks/useReaderHooks.js (current dimension calculation logic, lines 9-131)
- src/store/useReaderStore.js (pdfDimensions default values)
</read_first>

<action>
Modify `useBookDimensions` in `src/hooks/useReaderHooks.js`:

1. **Add padding constants at top of hook:**
```js
const MOBILE_PADDING = 0;       // Edge-to-edge on mobile
const TABLET_PADDING = 24;      // 12px each side
const DESKTOP_PADDING = 48;     // 24px each side  
const PROGRESS_BAR_HEIGHT = 32; // Reserve space for bottom progress bar
```

2. **Replace dimension calculation in the `useMemo` block (lines 68-125):**

For **mobile portrait** (`isMobile && isPortrait`):
- `singleWidth = availableWidth` (full width, zero padding)
- `singleHeight = Math.min(availableWidth / aspectRatio, availableHeight - PROGRESS_BAR_HEIGHT)`

For **mobile landscape** (`isMobile && !isPortrait`):
- `singleHeight = availableHeight - PROGRESS_BAR_HEIGHT`
- `singleWidth = singleHeight * aspectRatio`

For **tablet portrait** (`isTablet && isPortrait`):
- `singleWidth = availableWidth - TABLET_PADDING`
- `singleHeight = Math.min(singleWidth / aspectRatio, availableHeight - PROGRESS_BAR_HEIGHT)`

For **tablet landscape** (`isTablet && !isPortrait`):
- Treat as desktop landscape (2-page spread)

For **desktop landscape** (`isDesktopLandscape`):
- `singleWidth = (availableWidth - DESKTOP_PADDING) / 2`
- `singleHeight = Math.min(singleWidth / aspectRatio, availableHeight - PROGRESS_BAR_HEIGHT)`

3. **Add `visualViewport` debounce** to prevent rapid re-renders during address bar show/hide on mobile:
```js
const debounceRef = useRef(null);
// Inside updateDimensions:
clearTimeout(debounceRef.current);
debounceRef.current = setTimeout(() => {
  // actual dimension update
}, 100);
```

4. **Export additional metadata:**
Add `isMobileLandscape: isMobile && !isPortrait` to the returned dimensions object for downstream components.
</action>

<acceptance_criteria>
- `useBookDimensions` returns `isMobileLandscape` in dimensions object
- On viewport width < 768 portrait: `singlePageWidth` equals `containerDimensions.width` (no padding)
- On viewport width >= 1024 landscape: `singlePageWidth` equals approximately `(width - 48) / 2`
- `PROGRESS_BAR_HEIGHT` constant is `32`
- `debounceRef` is used in updateDimensions
- No `Math.max(…, 250)` fallback cluttering mobile (replaced by aspect-ratio logic)
</acceptance_criteria>

### Task 2: Atualizar FlipbookReader wrapper para edge-to-edge

<read_first>
- src/components/FlipbookReader.jsx (current wrapper div styling, line 69-77)
- src/hooks/useReaderHooks.js (dimensions object shape after Task 1)
</read_first>

<action>
Modify `src/components/FlipbookReader.jsx`:

1. **Replace wrapper div (line 69-77):**
```jsx
<div
    className="relative z-10 flex items-center justify-center transition-all duration-300 ease-out"
    style={{
        width: dimensions.isMobile ? '100%' : wrapperWidth,
        height: singlePageHeight,
        maxHeight: '100dvh',
        filter: dimensions.isMobile ? 'none' : 'drop-shadow(0 25px 25px rgba(0,0,0,0.15))'
    }}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
>
```

2. **Remove the hardcoded `h-[100dvh]` class** from the wrapper div — height is now controlled by `style.height` and `style.maxHeight`.

3. **Update `flipbookProps` to use `stretch` size on mobile:**
```js
const flipbookProps = {
    width: singlePageWidth,
    height: singlePageHeight,
    size: dimensions.isMobile ? "stretch" : "fixed",
    showCover: true,
    mobileScrollSupport: false,  // We handle our own swipe
    ref: bookRef,
    startPage: currentPage,
    drawShadow: !dimensions.isMobile,  // No shadows on mobile
    flippingTime: dimensions.isMobile ? 400 : 600,  // Faster on mobile
    usePortrait: true,
    startZIndex: 0,
    autoSize: false,
    maxShadowOpacity: dimensions.isMobile ? 0 : 0.5,
    showPageCorners: !dimensions.isMobile,
    disableFlipByClick: dimensions.isMobile,  // Use swipe on mobile
    onFlip,
    onChangeState,
};
```
</action>

<acceptance_criteria>
- FlipbookReader wrapper div does NOT contain class `h-[100dvh]`
- Mobile: wrapper width is `'100%'`, not a pixel value
- Mobile: `size` prop is `"stretch"`, `drawShadow` is `false`, `showPageCorners` is `false`
- Desktop: `size` prop is `"fixed"`, `drawShadow` is `true`
- `mobileScrollSupport` is `false` (custom swipe handling)
</acceptance_criteria>

### Task 3: Atualizar CSS base para suporte edge-to-edge

<read_first>
- src/index.css (current global styles, lines 1-68)
</read_first>

<action>
Add the following to `src/index.css`:

1. **After the `:root` block (line 20), add:**
```css
/* Ensure the flipbook container fills the viewport on mobile */
@media (max-width: 767px) {
  .stf__wrapper {
    width: 100% !important;
    max-width: 100vw !important;
  }
  
  .stf__wrapper .stf__parent {
    width: 100% !important;
  }
}

/* Smooth orientation change transitions */
@media (orientation: portrait) {
  .reader-container {
    transition: width 0.3s ease-out, height 0.3s ease-out;
  }
}

@media (orientation: landscape) {
  .reader-container {
    transition: width 0.3s ease-out, height 0.3s ease-out;
  }
}
```

2. **Add safe-area insets for notched devices (after body block):**
```css
/* Safe area for notched/dynamic island devices */
@supports (padding: env(safe-area-inset-top)) {
  .reader-controls-safe {
    padding-bottom: calc(env(safe-area-inset-bottom) + 8px);
  }
}
```
</action>

<acceptance_criteria>
- `src/index.css` contains `.stf__wrapper` override for `max-width: 767px`
- `src/index.css` contains `.reader-container` transition rules
- `src/index.css` contains `env(safe-area-inset-bottom)` support class
</acceptance_criteria>

### Task 4: Adicionar classe reader-container ao Book.jsx

<read_first>
- src/components/Book.jsx (line 178, main container div)
</read_first>

<action>
In `src/components/Book.jsx`, line 178, add `reader-container` class:

```jsx
<div className="reader-container flex flex-col items-center justify-center w-full h-full bg-background overflow-hidden relative" ref={containerRef}>
```

Also update the ReaderControls wrapper (line 25-27 of ReaderControls.jsx) by adding `reader-controls-safe` class to the fixed bottom container.
</action>

<acceptance_criteria>
- `Book.jsx` main container div has class `reader-container`
- The class is the FIRST class in the className string
</acceptance_criteria>

## Verification
```bash
npm run build 2>&1 | tail -5
# Expect: build succeeds with no errors
grep -n "reader-container" src/components/Book.jsx
# Expect: line 178 contains reader-container
grep -n "stf__wrapper" src/index.css
# Expect: .stf__wrapper override exists
grep -n "PROGRESS_BAR_HEIGHT" src/hooks/useReaderHooks.js
# Expect: constant defined
```
