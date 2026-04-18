import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// analytics
import { trackEvent } from '../analytics';

import FlipbookReader from './FlipbookReader';
import ReaderControls from './ReaderControls';

import ProgressBar from './ProgressBar';
import ThumbnailDrawer from './ThumbnailDrawer';
import WebtoonMode from './WebtoonMode';
import { BookLoader } from './BookLoader';
import {
    useBookDimensions,
    useAutoHideControls,
    useFullscreen,
    useKeyboardNav,
    useReadingProgress
} from '../hooks/useReaderHooks';
import { usePageTurnSound } from '../hooks/usePageTurnSound';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import { useReaderStore } from '../store/useReaderStore';

const Book = ({ volume, onBack }) => {
    const totalStorageKey = `hq-reader-total-${volume.id}`;

    const {
        isZoomed, setIsZoomed,
        readingMode,
        pdfDimensions, setPdfDimensions, reset
    } = useReaderStore();

    const [numPages, setNumPages] = useState(null);
    const [error, setError] = useState(null);
    const bookRef = useRef(null);

    // Custom hooks
    const { containerRef, dimensions, singlePageWidth, singlePageHeight } = useBookDimensions(pdfDimensions);
    const { showControls, resetTimeout } = useAutoHideControls(3000);
    const { isFullscreen, toggleFullScreen, enterFullscreen } = useFullscreen();
    const { currentPage, setCurrentPage, hasRestored } = useReadingProgress(volume.id);
    const { playPageTurnSound } = usePageTurnSound();
    // Persist total pages for progress display on VolumeSelector
    useEffect(() => {
        if (numPages) {
            try {
                localStorage.setItem(totalStorageKey, String(numPages));
            } catch { /* ignore */ }
        }
    }, [numPages, totalStorageKey]);

    // Fetch WebP metadata and detect dimensions if folder is mapped
    useEffect(() => {
        if (volume.folder) {
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
                        setError(null);
                    };
                    img.onerror = () => {
                        console.error("Falha ao carregar primeira página WebP para dimensões");
                    };
                    img.src = `${volume.folder}/page.1.webp`;
                })
                .catch(() => {
                    console.error("Falha ao carregar metadados do WebP");
                });
        }
    }, [volume.folder, setPdfDimensions]);

    // Enter fullscreen on mount
    useEffect(() => {
        enterFullscreen();
    }, [enterFullscreen]);

    // Cleanup on unmount
    useEffect(() => {
        return () => reset();
    }, [reset]);

    // Navigation callbacks
    const nextFlip = useCallback(() => {
        if (bookRef.current) {
            const pageFlip = bookRef.current.pageFlip();
            const current = pageFlip.getCurrentPageIndex();

            const isAtEnd = dimensions?.isDesktopLandscape
                ? current >= numPages - 2
                : current >= numPages - 1;

            if (isAtEnd) {
                if (onBack) onBack();
            } else {
                pageFlip.flipNext('bottom');
            }
        }
    }, [numPages, dimensions?.isDesktopLandscape, onBack]);

    const prevFlip = useCallback(() => {
        if (bookRef.current) {
            bookRef.current.pageFlip().flipPrev('bottom');
        }
    }, []);

    const { handleTouchStart, handleTouchEnd } = useSwipeNavigation({
        onPrev: prevFlip,
        onNext: nextFlip,
        disabled: isZoomed
    });

    const goToPage = useCallback((pageIndex) => {
        if (bookRef.current && readingMode === 'flipbook') {
            try {
                bookRef.current.pageFlip().turnToPage(pageIndex);
            } catch { /* ignore */ }
        }
        setCurrentPage(pageIndex);
    }, [readingMode, setCurrentPage]);

    // Keyboard navigation
    useKeyboardNav({
        enabled: readingMode === 'flipbook',
        onPrev: prevFlip,
        onNext: nextFlip,
        onEscapeZoom: () => { if (isZoomed) setIsZoomed(false); },
        onToggleFullscreen: toggleFullScreen,
        resetControls: resetTimeout,
    });

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
        // when the volume is first ready, record start event
        if (numPages && hasRestored) {
            trackEvent('start_volume', { volume_id: volume.id, num_pages: numPages });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numPages, hasRestored]);



    return (
        <div className="reader-container flex flex-col items-center justify-center w-full h-full bg-background overflow-hidden relative" ref={containerRef}>

            {error && (
                <div className="absolute inset-0 flex items-center justify-center text-red-400 z-50 bg-background">
                    {error}
                </div>
            )}

            <ReaderControls
                showControls={showControls}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullScreen}
                onBack={onBack}
            />

            <AnimatePresence mode="wait">
                {/* Flipbook Mode */}
                {readingMode === 'flipbook' && dimensions && (
                    <motion.div
                        key="flipbook"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
                    >
                        <FlipbookReader
                            volume={volume}
                            useWebp={true}
                            numPages={numPages}
                            currentPage={currentPage}
                            dimensions={dimensions}
                            singlePageWidth={singlePageWidth}
                            singlePageHeight={singlePageHeight}
                            pdfDimensions={pdfDimensions}
                            bookRef={bookRef}
                            showControls={showControls}
                            onFlip={onFlip}
                            onChangeState={onChangeState}
                            onPrev={prevFlip}
                            onNext={nextFlip}
                            handleTouchStart={handleTouchStart}
                            handleTouchEnd={handleTouchEnd}
                        />
                    </motion.div>
                )}

                {/* Webtoon Mode */}
                {readingMode === 'webtoon' && (
                    <motion.div
                        key="webtoon"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
                    >
                        <WebtoonMode
                            folder={volume.folder}
                            numPages={numPages}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            containerWidth={dimensions?.width || (typeof window !== 'undefined' ? window.innerWidth : 600)}
                            onBack={onBack}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading state (flipbook only) */}
            {readingMode === 'flipbook' && !dimensions && !error && (
                <BookLoader />
            )}

            <ProgressBar
                currentPage={currentPage}
                numPages={numPages}
                isMobile={dimensions?.isMobile}
                showControls={showControls}
            />



            <ThumbnailDrawer
                folder={volume.folder}
                numPages={numPages}
                currentPage={currentPage}
                chapters={volume.chapters || []}
                onPageSelect={goToPage}
            />
        </div>
    );
};

export default Book;
