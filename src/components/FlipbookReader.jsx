import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document } from 'react-pdf';
import Page from './Page';
import NavigationOverlay from './NavigationOverlay';
import { PdfDocumentLoader } from './BookLoader';

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
    onDocumentLoadSuccess,
    onDocumentLoadError,
    onPrev,
    onNext,
    handleTouchStart,
    handleTouchEnd,
}) => {
    const file = volume.file;

    const flipbookProps = {
        width: singlePageWidth,
        height: singlePageHeight,
        size: "fixed",
        showCover: true,
        mobileScrollSupport: true,
        ref: bookRef,
        startPage: currentPage,
        drawShadow: true,
        flippingTime: 600,
        usePortrait: dimensions.isMobile,
        startZIndex: 0,
        autoSize: false,
        maxShadowOpacity: 0.5,
        showPageCorners: true,
        disableFlipByClick: false,
        onFlip,
        onChangeState,
    };

    const renderPages = (isWebp) =>
        Array.from(new Array(numPages || 0), (_, index) => (
            <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={singlePageWidth}
                height={singlePageHeight}
                folder={isWebp ? volume.folder : undefined}
                pdfDimensions={isWebp ? undefined : pdfDimensions}
            />
        ));

    return (
        <div
            className="relative z-10 flex items-center justify-center transition-all duration-300 ease-out h-full"
            style={{
                width: dimensions.width,
                height: dimensions.height,
                filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))'
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {useWebp ? (
                <HTMLFlipBook
                    {...flipbookProps}
                    key={`flipbook-webp-${singlePageWidth}-${singlePageHeight}`}
                >
                    {renderPages(true)}
                </HTMLFlipBook>
            ) : (
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<PdfDocumentLoader />}
                    className="h-full w-full"
                >
                    <HTMLFlipBook
                        {...flipbookProps}
                        key={`flipbook-${singlePageWidth}-${singlePageHeight}`}
                    >
                        {renderPages(false)}
                    </HTMLFlipBook>
                </Document>
            )}

            <NavigationOverlay
                onPrev={onPrev}
                onNext={onNext}
                showControls={showControls}
            />
        </div>
    );
};

export default FlipbookReader;

