---
phase: 02
plan: "02-02"
title: "Pre-caching e Virtualização de Imagens"
wave: 1
depends_on: []
files_modified:
  - src/components/Page.jsx
  - src/components/FlipbookReader.jsx
  - src/hooks/useImagePreloader.js
autonomous: true
requirements: []
---

# Plan 02-02: Pre-caching e Virtualização de Imagens (Image Lazy Load)

## Goal
Implementar carregamento inteligente de imagens: pré-carregar as próximas N páginas à frente, virtualizar (desmontar) páginas fora da janela visível, e adicionar transição de fade-in suave ao carregamento.

## must_haves
- Apenas as páginas visíveis + 3 à frente são carregadas na rede
- Páginas fora da janela (>6 de distância) mostram placeholder leve (sem `<img>`)
- Pré-carregamento das próximas 3 páginas ocorre em background via `new Image()`
- Transição fade-in ao carregar imagem (de skeleton para imagem real)
- Sem regressão no WebtoonMode (já usa Virtuoso para virtualização)

## Tasks

### Task 1: Criar hook useImagePreloader

<read_first>
- src/components/Page.jsx (current image loading pattern, lines 69-76)
- src/components/FlipbookReader.jsx (current windowing logic, lines 48-66)
</read_first>

<action>
Create new file `src/hooks/useImagePreloader.js`:

```js
import { useEffect, useRef } from 'react';

/**
 * Preloads images ahead of the current page position.
 * @param {string} folder - Base folder URL for WebP images
 * @param {number} currentPage - Current page index (0-based)
 * @param {number} totalPages - Total number of pages
 * @param {number} preloadAhead - Number of pages ahead to preload (default: 3)
 */
export function useImagePreloader(folder, currentPage, totalPages, preloadAhead = 3) {
    const preloadedRef = useRef(new Set());

    useEffect(() => {
        if (!folder || !totalPages) return;

        const startPage = currentPage + 1; // 1-based for file naming
        const endPage = Math.min(currentPage + preloadAhead + 1, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const pageNum = i; // page.1.webp, page.2.webp, ...
            const key = `${folder}/page.${pageNum}.webp`;

            if (!preloadedRef.current.has(key)) {
                const img = new Image();
                img.src = key;
                preloadedRef.current.add(key);
            }
        }

        // Cleanup: keep cache bounded to last 20 unique preloads
        if (preloadedRef.current.size > 20) {
            const entries = Array.from(preloadedRef.current);
            const toRemove = entries.slice(0, entries.length - 20);
            toRemove.forEach(k => preloadedRef.current.delete(k));
        }
    }, [folder, currentPage, totalPages, preloadAhead]);
}
```
</action>

<acceptance_criteria>
- File `src/hooks/useImagePreloader.js` exists
- Export is named `useImagePreloader`
- Uses `new Image()` for preloading (no DOM insertion)
- `preloadedRef` prevents duplicate preloads
- Cache bounded to 20 entries max
- `preloadAhead` default is `3`
</acceptance_criteria>

### Task 2: Melhorar virtualização no FlipbookReader

<read_first>
- src/components/FlipbookReader.jsx (current pages useMemo, lines 48-66)
</read_first>

<action>
Modify `src/components/FlipbookReader.jsx`:

1. **Import the preloader hook:**
```js
import { useImagePreloader } from '../hooks/useImagePreloader';
```

2. **Add preloader call inside the component (after the flipbookProps definition):**
```js
useImagePreloader(volume.folder, currentPage, numPages, 3);
```

3. **Tighten the virtualization window** in the `pages` useMemo:
```js
const pages = useMemo(() => {
    const RENDER_WINDOW = 3;  // Render 3 pages each direction (tighter)
    const PRELOAD_WINDOW = 5; // Keep DOM nodes for 5 pages each direction
    
    return Array.from(new Array(numPages || 0), (_, index) => {
        const distance = Math.abs(index - currentPage);
        const isVisible = distance <= RENDER_WINDOW;
        const isInDOM = distance <= PRELOAD_WINDOW;
        
        return (
            <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={singlePageWidth}
                height={singlePageHeight}
                folder={isInDOM ? (useWebp ? volume.folder : undefined) : undefined}
                pdfDimensions={useWebp ? undefined : pdfDimensions}
                isMobileLandscape={isMobileLandscape}
                isVisible={isVisible}
            />
        );
    });
}, [numPages, singlePageWidth, singlePageHeight, useWebp, volume.folder, pdfDimensions, isMobileLandscape, currentPage]);
```

Key changes:
- `RENDER_WINDOW = 3` (was 4) — pages within 3 get full image load
- `PRELOAD_WINDOW = 5` — pages within 5 keep the DOM node but `isVisible` controls image loading
- Pages beyond `PRELOAD_WINDOW` get `folder={undefined}` — rendering the lightweight placeholder from Page.jsx
</action>

<acceptance_criteria>
- `useImagePreloader` is imported and called in FlipbookReader
- `RENDER_WINDOW` constant is `3`
- `PRELOAD_WINDOW` constant is `5`
- Pages beyond `PRELOAD_WINDOW` receive `folder={undefined}`
- `isVisible` is `distance <= RENDER_WINDOW`
</acceptance_criteria>

### Task 3: Melhorar Page.jsx com skeleton e fade-in refinado

<read_first>
- src/components/Page.jsx (full file, lines 1-95)
</read_first>

<action>
Modify `src/components/Page.jsx`:

1. **Replace the loading spinner with a shimmer skeleton:**
Replace the loading div (lines 64-68):
```jsx
{!isLoaded && (
    <div className="absolute inset-0 w-full h-full bg-zinc-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-shimmer" />
    </div>
)}
```

2. **Optimize the `<img>` element for lazy loading:**
```jsx
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
```

Key changes:
- Remove `scale` transition (only opacity for smoother effect)
- Add `decoding="async"` for non-blocking decode
- Add `fetchPriority="high"` for first 2 pages
- Transition duration reduced from 500ms to 300ms

3. **Add shimmer animation to index.css:**
In `src/index.css`, add:
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
```
</action>

<acceptance_criteria>
- Page.jsx uses `animate-pulse` skeleton instead of spinning circle
- `<img>` has `decoding="async"` attribute
- `<img>` has `fetchPriority` attribute (high for page 1-2, auto otherwise)
- Transition class is `transition-opacity duration-300` (not `transition-all duration-500`)
- `src/index.css` contains `@keyframes shimmer`
</acceptance_criteria>

## Verification
```bash
npm run build 2>&1 | tail -5
# Expect: build succeeds
grep -rn "useImagePreloader" src/
# Expect: hook defined in useImagePreloader.js, imported in FlipbookReader.jsx
grep -n "decoding" src/components/Page.jsx
# Expect: decoding="async"
grep -n "shimmer" src/index.css
# Expect: @keyframes shimmer exists
```
