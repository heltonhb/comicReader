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
            const pageNum = i;
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
