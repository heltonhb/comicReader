---
phase: 02
plan: "02-03"
title: "Touch Gestures — Pinch-to-Zoom e Pan"
wave: 2
depends_on: ["02-01", "02-02"]
files_modified:
  - src/components/FlipbookReader.jsx
  - src/components/Page.jsx
  - src/components/ZoomOverlay.jsx
  - src/hooks/usePinchZoom.js
  - src/store/useReaderStore.js
autonomous: true
requirements: []
---

# Plan 02-03: Touch Gestures — Pinch-to-Zoom via react-zoom-pan-pinch

## Goal
Implementar gestos de toque nativos (pinch-to-zoom, pan, double-tap zoom) diretamente no leitor flipbook sem depender do ZoomOverlay separado. Usar `react-zoom-pan-pinch` (já instalado v3.7.0) inline para uma experiência fluida tipo app nativo.

## must_haves
- Pinch-to-zoom funciona inline no flipbook (sem modal overlay)
- Double-tap zoom com 2x de amplificação centrado no ponto do toque
- Pan suave quando zoom > 1x
- Swipe de navegação desabilitado durante zoom ativo (prevenir conflito de gestos)
- Botão de reset zoom visível quando zoom está ativo
- Esc fecha o zoom (volta para 1x)
- Sem regressão: Desktop deve funcionar com mouse wheel zoom

## Tasks

### Task 1: Criar hook usePinchZoom

<read_first>
- src/hooks/useSwipeNavigation.js (current gesture handling)
- src/store/useReaderStore.js (isZoomed state)
</read_first>

<action>
Create new file `src/hooks/usePinchZoom.js`:

```js
import { useCallback } from 'react';
import { useReaderStore } from '../store/useReaderStore';

/**
 * Hook to manage zoom state coordination between react-zoom-pan-pinch
 * and the reader store. Prevents swipe navigation during zoom.
 */
export function usePinchZoom() {
    const { setIsZoomed } = useReaderStore();

    const onZoomStart = useCallback(() => {
        // Will be called by TransformWrapper onZoomStart
    }, []);

    const onTransformed = useCallback((ref, state) => {
        const isCurrentlyZoomed = state.scale > 1.05; // Small threshold to avoid float issues
        setIsZoomed(isCurrentlyZoomed);
    }, [setIsZoomed]);

    const onZoomStop = useCallback((ref, event) => {
        const isCurrentlyZoomed = ref.state.scale > 1.05;
        setIsZoomed(isCurrentlyZoomed);
    }, [setIsZoomed]);

    return {
        onZoomStart,
        onTransformed,
        onZoomStop,
    };
}
```
</action>

<acceptance_criteria>
- File `src/hooks/usePinchZoom.js` exists
- Exports `usePinchZoom` hook
- `onTransformed` checks `state.scale > 1.05` threshold
- Calls `setIsZoomed` from reader store
</acceptance_criteria>

### Task 2: Integrar TransformWrapper inline no FlipbookReader

<read_first>
- src/components/FlipbookReader.jsx (full file)
- src/components/ZoomOverlay.jsx (current react-zoom-pan-pinch usage, lines 11-30)
</read_first>

<action>
Modify `src/components/FlipbookReader.jsx`:

1. **Add imports:**
```js
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { usePinchZoom } from '../hooks/usePinchZoom';
import { useReaderStore } from '../store/useReaderStore';
```

2. **Add zoom hook call inside component:**
```js
const { onTransformed, onZoomStop } = usePinchZoom();
const { isZoomed } = useReaderStore();
```

3. **Wrap the HTMLFlipBook with TransformWrapper:**
```jsx
<TransformWrapper
    initialScale={1}
    minScale={1}
    maxScale={3.5}
    centerOnInit
    doubleClick={{ mode: 'toggle', step: 2 }}
    panning={{ disabled: !isZoomed, velocityDisabled: false }}
    pinch={{ step: 5 }}
    wheel={{ step: 0.1 }}
    onTransformed={onTransformed}
    onZoomStop={onZoomStop}
    limitToBounds={true}
    disablePadding={true}
>
    <ZoomResetButton />
    <TransformComponent
        wrapperClass="!w-full !h-full"
        contentClass="!w-full !h-full flex items-center justify-center"
    >
        <HTMLFlipBook
            {...flipbookProps}
            key={`flipbook-${singlePageWidth}-${singlePageHeight}`}
        >
            {pages}
        </HTMLFlipBook>
    </TransformComponent>
</TransformWrapper>
```

4. **Create inline ZoomResetButton component** (above FlipbookReader or in same file):
```jsx
const ZoomResetButton = () => {
    const { resetTransform } = useControls();
    const { isZoomed } = useReaderStore();

    if (!isZoomed) return null;

    return (
        <button
            onClick={() => resetTransform()}
            className="absolute top-4 right-4 z-[60] px-4 py-2 bg-black/60 backdrop-blur-md text-white/90 text-sm font-medium rounded-full border border-white/10 hover:bg-black/80 transition-all duration-200 active:scale-95"
            aria-label="Resetar zoom"
        >
            Resetar Zoom
        </button>
    );
};
```

5. **Disable swipe during zoom** — The `useSwipeNavigation` hook already checks for `disabled: isZoomed`, so no change needed there. Verify the `handleTouchStart`/`handleTouchEnd` are passed correctly.
</action>

<acceptance_criteria>
- `TransformWrapper` wraps `HTMLFlipBook` in FlipbookReader.jsx
- `minScale` is `1`, `maxScale` is `3.5`
- `doubleClick.step` is `2`
- `panning.disabled` is `!isZoomed`
- `ZoomResetButton` renders only when `isZoomed` is true
- `ZoomResetButton` calls `resetTransform()` on click
</acceptance_criteria>

### Task 3: Remover double-tap zoom interno do Page.jsx

<read_first>
- src/components/Page.jsx (handleDoubleTap function, lines 11-41)
</read_first>

<action>
Modify `src/components/Page.jsx`:

1. **Remove the entire `handleDoubleTap` function** (lines 11-41)
2. **Remove `isZoomed` state:** Remove `const [isZoomed, setIsZoomed] = useState(false);`
3. **Remove `controls` and `useAnimation`:** Remove `const controls = useAnimation();`
4. **Remove `containerRef`:** Remove `const containerRef = useRef(null);`
5. **Remove unused imports:** Remove `useAnimation` from framer-motion import, remove `useRef`

6. **Simplify the motion.div:**
```jsx
{isVisible && folder ? (
    <div
        className={`w-full h-full flex items-center justify-center ${isWebtoon ? '' : 'min-h-[50vh]'}`}
    >
        {!isLoaded && (
            <div className="absolute inset-0 w-full h-full bg-zinc-900 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-shimmer" />
            </div>
        )}
        <img
            src={`${folder}/page.${pageNumber}.webp`}
            alt={`Página ${pageNumber}`}
            className={`absolute inset-0 w-full h-full pointer-events-none block origin-center z-10 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ objectFit: (isWebtoon || isMobileLandscape) ? 'fill' : 'contain' }}
            loading="lazy"
            decoding="async"
            fetchPriority={pageNumber <= 2 ? 'high' : 'auto'}
            onLoad={() => setIsLoaded(true)}
        />
    </div>
) : (
    ...placeholder...
)}
```

7. **Remove `drag` and `dragConstraints` props** — these are now handled by react-zoom-pan-pinch at the FlipbookReader level.

8. **Update imports at top of file:**
```js
import React, { forwardRef, memo, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
```
Remove: `useRef` from React, `motion`, `useAnimation` from framer-motion.
</action>

<acceptance_criteria>
- `Page.jsx` does NOT import `useAnimation` or `motion` from framer-motion
- `Page.jsx` does NOT contain `handleDoubleTap` function
- `Page.jsx` does NOT contain `drag={isZoomed}` prop
- `Page.jsx` does NOT have internal `isZoomed` state
- `Page.jsx` uses a plain `<div>` instead of `<motion.div>` for the image container
</acceptance_criteria>

### Task 4: Simplificar ZoomOverlay como fallback

<read_first>
- src/components/ZoomOverlay.jsx (full file)
- src/components/Book.jsx (ZoomOverlay usage, lines 260-267)
</read_first>

<action>
Modify `src/components/Book.jsx`:

1. **Remove the ZoomOverlay render block** (lines 259-267):
```jsx
// REMOVE THIS BLOCK:
{isZoomed && readingMode === 'flipbook' && (
    <ZoomOverlay ... />
)}
```

2. **Remove ZoomOverlay import** (line 9):
```js
// REMOVE: import ZoomOverlay from './ZoomOverlay';
```

3. **Remove `zoomWidth` calculation** (line 175):
```js
// REMOVE: const zoomWidth = dimensions?.isMobile ? ...
```

The inline TransformWrapper in FlipbookReader now handles all zoom functionality, making the separate ZoomOverlay unnecessary for flipbook mode.

Note: Keep `ZoomOverlay.jsx` file — it can be repurposed later for image gallery features.
</action>

<acceptance_criteria>
- `Book.jsx` does NOT import `ZoomOverlay`
- `Book.jsx` does NOT contain `zoomWidth` variable
- `Book.jsx` does NOT render `<ZoomOverlay`
- `ZoomOverlay.jsx` file still exists (not deleted)
</acceptance_criteria>

### Task 5: Atualizar store com zoom scale

<read_first>
- src/store/useReaderStore.js (full file)
</read_first>

<action>
Modify `src/store/useReaderStore.js`:

Add `zoomScale` state for UI feedback:
```js
export const useReaderStore = create((set) => ({
    // Navigation & State
    isZoomed: false,
    zoomScale: 1,
    setIsZoomed: (isZoomed) => set({ isZoomed }),
    setZoomScale: (scale) => set({ zoomScale: scale }),
    toggleZoom: () => set((state) => ({ isZoomed: !state.isZoomed })),

    // ...rest stays the same...

    // Reset store when closing volume
    reset: () => set({
        isZoomed: false,
        zoomScale: 1,
        readingMode: 'flipbook',
        showThumbnails: false,
    }),
}));
```
</action>

<acceptance_criteria>
- `useReaderStore` contains `zoomScale: 1` in default state
- `setZoomScale` action exists
- `reset` function sets `zoomScale: 1`
</acceptance_criteria>

## Verification
```bash
npm run build 2>&1 | tail -5
# Expect: build succeeds
grep -rn "TransformWrapper" src/components/FlipbookReader.jsx
# Expect: TransformWrapper wrapping HTMLFlipBook
grep -rn "handleDoubleTap" src/components/Page.jsx
# Expect: no results (removed)
grep -rn "ZoomOverlay" src/components/Book.jsx
# Expect: no results (removed)
grep -n "zoomScale" src/store/useReaderStore.js
# Expect: zoomScale state exists
```
