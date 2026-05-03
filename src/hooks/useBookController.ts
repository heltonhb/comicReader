import { useState, useEffect, useCallback, useRef, RefObject } from 'react';
import { trackEvent } from '../analytics';
import { useReaderStore } from '../store/useReaderStore';
import { useReadingProgress } from './useReaderHooks';
import { usePageTurnSound } from './usePageTurnSound';
import { useSwipeNavigation } from './useSwipeNavigation';
import { useKeyboardNav } from './useReaderHooks';
import { FastAverageColor } from 'fast-average-color';
import type { Volume } from '../types';

interface UseBookControllerReturn {
    bookRef: RefObject<unknown>;
    numPages: number | null;
    error: string | null;
    currentPage: number;
    isLightBackground: boolean;
    isZoomed: boolean;
    nextFlip: () => boolean;
    prevFlip: () => void;
    goToPage: (pageIndex: number) => void;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchEnd: (e: React.TouchEvent) => void;
    onFlip: (e: { data: number }) => void;
    onChangeState: (e: { data: string }) => void;
    setCurrentPage: (page: number) => void;
}

export const useBookController = (volume: Volume): UseBookControllerReturn => {
    const [numPages, setNumPages] = useState(null);
    const [error, setError] = useState(null);
    const [isLightBackground, setIsLightBackground] = useState(false);

    const bookRef = useRef(null);
    const facRef = useRef(null);

    const { isZoomed, setIsZoomed, readingMode, pdfDimensions, setPdfDimensions, reset } = useReaderStore();
    const { currentPage, setCurrentPage, hasRestored } = useReadingProgress(volume.id);
    const { playPageTurnSound } = usePageTurnSound();

    const totalStorageKey = `hq-reader-total-${volume.id}`;

    // Persist total pages for progress display
    useEffect(() => {
        if (numPages) {
            try {
                localStorage.setItem(totalStorageKey, String(numPages));
            } catch { /* ignore */ }
        }
    }, [numPages, totalStorageKey]);

    // Fetch metadata and detect dimensions
    useEffect(() => {
        if (volume.folder) {
            setError(null);
            fetch(`${volume.folder}/metadata.json`)
                .then(r => {
                    if (!r.ok) throw new Error('Metadata not found');
                    return r.json();
                })
                .then(data => {
                    setNumPages(data.numPages);

                    const img = new Image();
                    img.onload = () => {
                        const isSpread = img.naturalWidth > img.naturalHeight;
                        const singlePageWidthVal = isSpread ? img.naturalWidth / 2 : img.naturalWidth;

                        setPdfDimensions({
                            width: singlePageWidthVal,
                            height: img.naturalHeight,
                            aspectRatio: singlePageWidthVal / img.naturalHeight
                        });
                    };
                    img.onerror = () => console.error("Falha ao carregar primeira página WebP");
                    img.src = `${volume.folder}/page.1.webp`;
                })
                .catch(() => console.error("Falha ao carregar metadados do WebP"));
        }
    }, [volume.folder, setPdfDimensions]);

    // Navigation callbacks
    const nextFlip = useCallback(() => {
        if (bookRef.current) {
            const pageFlip = bookRef.current.pageFlip();
            const current = pageFlip.getCurrentPageIndex();

            // Calculate if at end based on viewport
            // We'll let the component pass dimensions through
            if (current >= (numPages || 1) - 1) {
                return false; // Signal end reached
            }
            pageFlip.flipNext('bottom');
            return true;
        }
        return false;
    }, [numPages]);

    const prevFlip = useCallback(() => {
        if (bookRef.current) {
            const pageFlip = bookRef.current.pageFlip();
            const current = pageFlip.getCurrentPageIndex();
            console.log('prevFlip called, current page:', current);
            pageFlip.flipPrev('bottom');
        }
    }, []);

    const goToPage = useCallback((pageIndex) => {
        if (bookRef.current && readingMode === 'flipbook') {
            try {
                bookRef.current.pageFlip().turnToPage(pageIndex);
            } catch { /* ignore */ }
        }
        setCurrentPage(pageIndex);
    }, [readingMode, setCurrentPage]);

    const { handleTouchStart, handleTouchEnd } = useSwipeNavigation({
        onPrev: prevFlip,
        onNext: nextFlip,
        disabled: isZoomed
    });

    // Keyboard navigation
    useKeyboardNav({
        enabled: readingMode === 'flipbook',
        onPrev: prevFlip,
        onNext: nextFlip,
        onEscapeZoom: () => { if (isZoomed) setIsZoomed(false); },
    });

    // Flip event handlers
    const onFlip = useCallback((e) => {
        const newPage = e.data;
        setCurrentPage(newPage);
        trackEvent('flip_page', { volume_id: volume.id, page_number: newPage + 1 });
    }, [setCurrentPage, volume.id]);

    const onChangeState = useCallback((e) => {
        if (e.data === 'flipping') {
            playPageTurnSound();
        }
    }, [playPageTurnSound]);

    // Navigate to saved page after book loads
    useEffect(() => {
        if (numPages && currentPage > 0 && bookRef.current && hasRestored) {
            try {
                bookRef.current.pageFlip().turnToPage(currentPage);
            } catch { /* ignore */ }
        }
        if (numPages && hasRestored) {
            trackEvent('start_volume', { volume_id: volume.id, num_pages: numPages });
        }
    }, [numPages, hasRestored, currentPage, volume.id]);

    // Color analysis
    useEffect(() => {
        if (!volume.folder || currentPage === undefined) return;

        facRef.current = new FastAverageColor();
        const imageUrl = `${volume.folder}/page.${currentPage + 1}.webp`;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            facRef.current.getColorAsync(img)
                .then(color => setIsLightBackground(color.isLight))
                .catch(() => {});
        };
        img.src = imageUrl;

        return () => {
            if (facRef.current) facRef.current.destroy();
        };
    }, [volume.folder, currentPage]);

    // Cleanup on unmount
    useEffect(() => {
        return () => reset();
    }, [reset]);

    return {
        // Refs
        bookRef,

        // State
        numPages,
        error,
        currentPage,
        isLightBackground,
        isZoomed,

        // Navigation
        nextFlip,
        prevFlip,
        goToPage,
        handleTouchStart,
        handleTouchEnd,

        // Events
        onFlip,
        onChangeState,

        // Setters
        setCurrentPage,
    };
};