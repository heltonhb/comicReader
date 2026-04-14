import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

// Padding constants per breakpoint
const MOBILE_PADDING = 0;       // Edge-to-edge on mobile
const TABLET_PADDING = 24;      // 12px each side
const DESKTOP_PADDING = 48;     // 24px each side
const PROGRESS_BAR_HEIGHT = 32; // Reserve space for bottom progress bar

/**
 * Hook to calculate book dimensions based on container size and PDF aspect ratio.
 * Handles ResizeObserver + window resize fallback with debounce.
 */
export function useBookDimensions(pdfDimensions) {
    const [containerDimensions, setContainerDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });
    const containerRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        const updateDimensions = () => {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const width = rect.width;
                    const height = rect.height;

                    // Prioritize visualViewport for precise height on mobile (avoids address bar issues)
                    const viewportHeight = window.visualViewport ? window.visualViewport.height : height;
                    const finalHeight = width < 1024 ? viewportHeight : height;

                    if (width > 0 && finalHeight > 0) {
                        setContainerDimensions(prev => {
                            if (Math.abs(prev.width - width) < 1 && Math.abs(prev.height - finalHeight) < 1) return prev;
                            return { width, height: finalHeight };
                        });
                    }
                }
            }, 100);
        };

        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                if (width > 0 && height > 0) {
                    setContainerDimensions(prev => {
                        if (Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1) return prev;
                        return { width, height };
                    });
                }
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', updateDimensions);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateDimensions);
            window.visualViewport.addEventListener('scroll', updateDimensions);
        }

        updateDimensions();

        return () => {
            clearTimeout(debounceRef.current);
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateDimensions);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateDimensions);
                window.visualViewport.removeEventListener('scroll', updateDimensions);
            }
        };
    }, []);

    const dimensions = useMemo(() => {
        if (containerDimensions.width === 0 || containerDimensions.height === 0) return null;

        const { width: cWidth, height: cHeight } = containerDimensions;

        const isMobile = cWidth < 768;
        const isTablet = cWidth >= 768 && cWidth < 1024;
        const isPortrait = cWidth <= cHeight;
        const isDesktopLandscape = cWidth >= 1024 && !isPortrait;
        const isMobileLandscape = isMobile && !isPortrait;

        const availableWidth = cWidth;
        const availableHeight = cHeight;
        const enforceAspectRatio = pdfDimensions && pdfDimensions.aspectRatio > 0;

        let singleWidth, singleHeight;

        if (isMobile && isPortrait) {
            // Mobile portrait: full width edge-to-edge
            singleWidth = availableWidth;
            if (enforceAspectRatio) {
                const heightFromWidth = singleWidth / pdfDimensions.aspectRatio;
                if (heightFromWidth > availableHeight - PROGRESS_BAR_HEIGHT) {
                    // Height-constrained: shrink width to fit height
                    singleHeight = availableHeight - PROGRESS_BAR_HEIGHT;
                    singleWidth = singleHeight * pdfDimensions.aspectRatio;
                } else {
                    singleHeight = heightFromWidth;
                }
            } else {
                singleHeight = availableHeight - PROGRESS_BAR_HEIGHT;
            }
        } else if (isMobileLandscape) {
            // Mobile landscape: prioritize height
            singleHeight = availableHeight - PROGRESS_BAR_HEIGHT;
            if (enforceAspectRatio) {
                singleWidth = singleHeight * pdfDimensions.aspectRatio;
                // Don't exceed available width
                if (singleWidth > availableWidth) {
                    singleWidth = availableWidth;
                    singleHeight = singleWidth / pdfDimensions.aspectRatio;
                }
            } else {
                singleWidth = availableWidth;
            }
        } else if (isTablet && isPortrait) {
            // Tablet portrait: slight padding
            singleWidth = availableWidth - TABLET_PADDING;
            if (enforceAspectRatio) {
                const heightFromWidth = singleWidth / pdfDimensions.aspectRatio;
                if (heightFromWidth > availableHeight - PROGRESS_BAR_HEIGHT) {
                    singleHeight = availableHeight - PROGRESS_BAR_HEIGHT;
                    singleWidth = singleHeight * pdfDimensions.aspectRatio;
                } else {
                    singleHeight = heightFromWidth;
                }
            } else {
                singleHeight = availableHeight - PROGRESS_BAR_HEIGHT;
            }
        } else if (isDesktopLandscape || (isTablet && !isPortrait)) {
            // Desktop landscape or tablet landscape: 2-page spread
            singleWidth = (availableWidth - DESKTOP_PADDING) / 2;
            if (enforceAspectRatio) {
                const heightFromWidth = singleWidth / pdfDimensions.aspectRatio;
                if (heightFromWidth > availableHeight - PROGRESS_BAR_HEIGHT) {
                    singleHeight = availableHeight - PROGRESS_BAR_HEIGHT;
                    singleWidth = singleHeight * pdfDimensions.aspectRatio;
                } else {
                    singleHeight = heightFromWidth;
                }
            } else {
                singleHeight = availableHeight - PROGRESS_BAR_HEIGHT;
            }
        } else {
            // Fallback
            singleWidth = availableWidth;
            singleHeight = availableHeight - PROGRESS_BAR_HEIGHT;
        }

        return {
            width: Math.floor(Math.max(singleWidth, 200)),
            height: Math.floor(Math.max(singleHeight, 250)),
            isMobile,
            isTablet,
            isPortrait,
            isDesktopLandscape,
            isMobileLandscape
        };
    }, [containerDimensions, pdfDimensions]);

    const singlePageWidth = dimensions ? dimensions.width : 300;
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
