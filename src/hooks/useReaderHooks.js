import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
/**
 * Hook to calculate book dimensions based on container size and PDF aspect ratio.
 * Handles ResizeObserver + window resize fallback.
 */
export function useBookDimensions(pdfDimensions) {
    const [containerDimensions, setContainerDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });
    const containerRef = useRef(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                // Use visualViewport if available for more accurate mobile height (ignores address bar overlays)
                const viewportHeight = window.visualViewport ? window.visualViewport.height : height;
                const finalHeight = width < 768 ? Math.max(height, viewportHeight) : height;

                if (width > 0 && finalHeight > 0) {
                    setContainerDimensions({ width, height: finalHeight });
                }
            }
        };

        updateDimensions();

        const observerCallback = (entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                if (width > 0 && height > 0) {
                    setContainerDimensions({ width, height });
                } else {
                    updateDimensions();
                }
            }
        };

        const resizeObserver = new ResizeObserver(observerCallback);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', updateDimensions);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateDimensions);
        }
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateDimensions);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateDimensions);
            }
        };
    }, []);

    const dimensions = useMemo(() => {
        if (containerDimensions.width === 0 || containerDimensions.height === 0) return null;

        const { width: cWidth, height: cHeight } = containerDimensions;
        const isMobile = cWidth < 768;

        const availableWidth = cWidth;
        const availableHeight = cHeight;

        let bookWidth, bookHeight;

        if (isMobile) {
            bookWidth = availableWidth;
            // Force the book height to occupy the entire screen on mobile
            bookHeight = availableHeight;
        } else {
            const isLandscape = pdfDimensions.aspectRatio > 1;
            const singlePageHeight = availableHeight;
            const singlePageWidthVal = singlePageHeight * pdfDimensions.aspectRatio;

            if (isLandscape || singlePageWidthVal * 2 > availableWidth) {
                // Single page mode for landscape or very wide pages
                bookHeight = Math.min(availableHeight, availableWidth / pdfDimensions.aspectRatio);
                bookWidth = bookHeight * pdfDimensions.aspectRatio;
            } else {
                // Double page mode
                bookHeight = singlePageHeight;
                bookWidth = singlePageWidthVal * 2;
            }
        }

        return {
            width: Math.max(Math.floor(bookWidth), 300),
            height: Math.max(Math.floor(bookHeight), 400),
            isMobile
        };
    }, [containerDimensions, pdfDimensions]);

    const singlePageWidth = dimensions ? (dimensions.isMobile ? dimensions.width : dimensions.width / 2) : 300;
    const singlePageHeight = dimensions ? dimensions.height : 400;

    return { containerRef, dimensions, singlePageWidth, singlePageHeight };
}

/**
 * Hook to auto-hide UI controls after inactivity.
 */
export function useAutoHideControls(timeout = 3000) {
    const [showControls, setShowControls] = useState(true);
    const timeoutRef = useRef(null);

    const resetTimeout = useCallback(() => {
        setShowControls(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowControls(false), timeout);
    }, [timeout]);

    useEffect(() => {
        // Start timer on mount without setting state (since it's already true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowControls(false), timeout);

        window.addEventListener('mousemove', resetTimeout);
        window.addEventListener('touchstart', resetTimeout);
        window.addEventListener('click', resetTimeout);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            window.removeEventListener('mousemove', resetTimeout);
            window.removeEventListener('touchstart', resetTimeout);
            window.removeEventListener('click', resetTimeout);
        };
    }, [resetTimeout, timeout]);

    return { showControls, resetTimeout };
}

/**
 * Hook to manage fullscreen state reactively.
 */
export function useFullscreen() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    const toggleFullScreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error(`Erro ao alternar tela cheia: ${err.message}`);
        }
    }, []);

    const enterFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.log("Fullscreen request failed:", err);
        }
    }, []);

    return { isFullscreen, toggleFullScreen, enterFullscreen };
}

/**
 * Hook for keyboard navigation.
 */
export function useKeyboardNav({ enabled, onPrev, onNext, onEscapeZoom, onToggleFullscreen, resetControls }) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    onPrev();
                    resetControls?.();
                    break;
                case 'ArrowRight':
                    onNext();
                    resetControls?.();
                    break;
                case 'Escape':
                    onEscapeZoom?.();
                    break;
                case 'f':
                case 'F':
                    if (!e.ctrlKey && !e.metaKey) {
                        onToggleFullscreen?.();
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, onPrev, onNext, onEscapeZoom, onToggleFullscreen, resetControls]);
}

export function useReadingProgress(volumeId) {
    const storageKey = `hq-reader-page-${volumeId}`;
    const { user } = useAuth();
    const [hasRestored] = useState(true);

    // Always start at page 0
    const [currentPage, setCurrentPage] = useState(0);

    // Persist on change (Local -> Cloud)
    useEffect(() => {
        // Always save locally immediately
        try {
            localStorage.setItem(storageKey, String(currentPage));
        } catch {
            // ignore
        }

        if (!hasRestored || !user || !volumeId) return;

        // Debounce cloud save (3 seconds) to avoid writing on every fast page flip
        const timeout = setTimeout(async () => {
            try {
                const docRef = doc(db, 'users', user.uid, 'progress', volumeId);
                await setDoc(docRef, {
                    currentPage,
                    updatedAt: serverTimestamp()
                }, { merge: true });
            } catch (error) {
                console.error("Error saving progress to cloud", error);
            }
        }, 3000);

        return () => clearTimeout(timeout);
    }, [currentPage, storageKey, user, volumeId, hasRestored]);

    return { currentPage, setCurrentPage, hasRestored };
}
