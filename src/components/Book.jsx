import React, { useState, useRef, useCallback, useEffect } from 'react';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import FlipbookReader from './FlipbookReader';
import ReaderControls from './ReaderControls';
import ZoomOverlay from './ZoomOverlay';
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
    const file = volume.file;
    const totalStorageKey = `hq-reader-total-${volume.id}`;

    const {
        isZoomed, setIsZoomed,
        readingMode,
        pdfDimensions, setPdfDimensions, reset
    } = useReaderStore();

    const [numPages, setNumPages] = useState(null);
    const [error, setError] = useState(null);
    const [useWebp, setUseWebp] = useState(false);
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

                        setUseWebp(true);
                        setError(null);
                    };
                    img.onerror = () => {
                        console.error("Falha ao carregar primeira página WebP para dimensões");
                        setUseWebp(false);
                    };
                    img.src = `${volume.folder}/page.1.webp`;
                })
                .catch(() => {
                    setUseWebp(false);
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

            const isAtEnd = dimensions?.isMobile
                ? current >= numPages - 1
                : current >= numPages - 2;

            if (isAtEnd) {
                if (onBack) onBack();
            } else {
                pageFlip.flipNext('bottom');
            }
        }
    }, [numPages, dimensions?.isMobile, onBack]);

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

    // PDF callbacks
    const onDocumentLoadSuccess = useCallback((pdf) => {
        setNumPages(pdf.numPages);
        setError(null);
        pdf.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            if (viewport.width && viewport.height) {
                setPdfDimensions({
                    width: viewport.width,
                    height: viewport.height,
                    aspectRatio: viewport.width / viewport.height
                });
            }
        }).catch(err => console.error("Falha ao obter dimensões da página", err));
    }, [setPdfDimensions]);

    const onDocumentLoadError = useCallback((err) => {
        console.error("Erro ao carregar PDF:", err);
        setError("Falha ao carregar o PDF. Verifique sua conexão ou o caminho do arquivo.");
    }, []);

    const onFlip = useCallback((e) => setCurrentPage(e.data), [setCurrentPage]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numPages, hasRestored]);

    // Zoom page width
    const zoomWidth = dimensions?.isMobile ? (typeof window !== 'undefined' ? window.innerWidth : 600) : (dimensions?.width || 600);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-background overflow-hidden relative" ref={containerRef}>

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

            {/* Flipbook Mode */}
            {readingMode === 'flipbook' && dimensions && (
                <FlipbookReader
                    volume={volume}
                    useWebp={useWebp}
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
                    onDocumentLoadSuccess={onDocumentLoadSuccess}
                    onDocumentLoadError={onDocumentLoadError}
                    onPrev={prevFlip}
                    onNext={nextFlip}
                    handleTouchStart={handleTouchStart}
                    handleTouchEnd={handleTouchEnd}
                />
            )}

            {/* Webtoon Mode */}
            {readingMode === 'webtoon' && (
                <WebtoonMode
                    file={file}
                    folder={useWebp ? volume.folder : null}
                    numPages={numPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    containerWidth={dimensions?.width || (typeof window !== 'undefined' ? window.innerWidth : 600)}
                    onBack={onBack}
                />
            )}

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

            {/* Zoom Overlay (flipbook only) */}
            {isZoomed && readingMode === 'flipbook' && (
                <ZoomOverlay
                    file={file}
                    folder={useWebp ? volume.folder : null}
                    pageNumber={currentPage + 1}
                    width={zoomWidth}
                    showControls={showControls}
                />
            )}

            <ThumbnailDrawer
                file={file}
                folder={useWebp ? volume.folder : null}
                numPages={numPages}
                currentPage={currentPage}
                chapters={volume.chapters || []}
                onPageSelect={goToPage}
            />
        </div>
    );
};

export default Book;
