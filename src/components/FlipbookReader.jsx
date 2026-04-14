import React, { useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import Page from './Page';
import NavigationOverlay from './NavigationOverlay';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { usePinchZoom } from '../hooks/usePinchZoom';
import { useReaderStore } from '../store/useReaderStore';

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

const FlipbookReader = ({
    volume,
    useWebp,
    numPages,
    currentPage,
    dimensions,
    singlePageWidth,
    singlePageHeight,
    pdfDimensions,
    bookRef,
    showControls,
    onFlip,
    onChangeState,
    onPrev,
    onNext,
    handleTouchStart,
    handleTouchEnd,
}) => {

    const isMobile = dimensions?.isMobile;
    const isMobileLandscape = dimensions?.isMobileLandscape;
    const wrapperWidth = dimensions?.isDesktopLandscape ? singlePageWidth * 2 : singlePageWidth;

    // Preload upcoming pages in background
    useImagePreloader(volume.folder, currentPage, numPages, 3);

    // Zoom state coordination
    const { onTransformed, onZoomStop } = usePinchZoom();
    const { isZoomed } = useReaderStore();

    const flipbookProps = {
        width: singlePageWidth,
        height: singlePageHeight,
        size: isMobile ? "stretch" : "fixed",
        showCover: true,
        mobileScrollSupport: false,
        ref: bookRef,
        startPage: currentPage,
        drawShadow: !isMobile,
        flippingTime: isMobile ? 400 : 600,
        usePortrait: true,
        startZIndex: 0,
        autoSize: false,
        maxShadowOpacity: isMobile ? 0 : 0.5,
        showPageCorners: !isMobile,
        disableFlipByClick: isMobile,
        onFlip,
        onChangeState,
    };

    const pages = useMemo(() => {
        const RENDER_WINDOW = 3;
        const PRELOAD_WINDOW = 5;

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

    return (
        <div
            className="relative z-10 flex items-center justify-center transition-all duration-300 ease-out"
            style={{
                width: isMobile ? '100%' : wrapperWidth,
                height: singlePageHeight,
                maxHeight: '100dvh',
                filter: isMobile ? 'none' : 'drop-shadow(0 25px 25px rgba(0,0,0,0.15))'
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
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

            <NavigationOverlay
                onPrev={onPrev}
                onNext={onNext}
                showControls={showControls}
            />
        </div>
    );
};

export default FlipbookReader;

