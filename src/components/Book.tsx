import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import FlipbookReader from './FlipbookReader';
import ReaderControls from './ReaderControls';
import ProgressBar from './ProgressBar';
import ThumbnailDrawer from './ThumbnailDrawer';
import WebtoonMode from './WebtoonMode';
import { BookLoader } from './BookLoader';
import { useBookDimensions } from '../hooks/useReaderHooks';
import { useAutoHideControls } from '../hooks/useReaderHooks';
import { useFullscreen } from '../hooks/useReaderHooks';
import { useReaderStore } from '../store/useReaderStore';
import { useBookController } from '../hooks/useBookController';
import type { Volume } from '../types';

interface BookProps {
    volume: Volume;
    onBack?: () => void;
}

const Book: React.FC<BookProps> = ({ volume, onBack }) => {
    const { pdfDimensions, readingMode } = useReaderStore();

    const { isFullscreen, toggleFullScreen, enterFullscreen } = useFullscreen();
    const { showControls } = useAutoHideControls(3000);
    const { containerRef, dimensions, singlePageWidth, singlePageHeight } = useBookDimensions(pdfDimensions);

    const {
        bookRef,
        numPages,
        error,
        currentPage,
        isLightBackground,
        nextFlip,
        prevFlip,
        goToPage,
        handleTouchStart,
        handleTouchEnd,
        onFlip,
        onChangeState,
    } = useBookController(volume);

    useEffect(() => {
        enterFullscreen();
    }, [enterFullscreen]);

    const handleNext = () => {
        const reachedEnd = !nextFlip();
        if (reachedEnd && onBack) onBack();
    };

    return (
        <div
            className="reader-container flex flex-col items-center justify-center w-full h-full bg-background overflow-hidden relative"
            ref={containerRef}
        >
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
                isLight={isLightBackground}
            />

            <AnimatePresence mode="wait">
                {dimensions && numPages && (
                    <motion.div
                        key={dimensions.isMobile ? 'mobile' : 'desktop'}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
                    >
                        {readingMode === 'flipbook' ? (
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
                                onNext={handleNext}
                                handleTouchStart={handleTouchStart}
                                handleTouchEnd={handleTouchEnd}
                            />
                        ) : (
                            <WebtoonMode
                                folder={volume.folder}
                                numPages={numPages}
                                currentPage={currentPage}
                                onPageChange={goToPage}
                                containerWidth={dimensions.width}
                                onBack={onBack}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {(!dimensions || !numPages) && !error && <BookLoader />}

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