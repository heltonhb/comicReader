import React, { useRef, useEffect, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import Page from './Page';

const WebtoonPage = memo(({ pageNumber, width, height, folder, pdfDimensions }) => {
    return (
        <div className="w-full flex justify-center m-0 p-0 leading-none">
            <Page
                pageNumber={pageNumber}
                width={width}
                height={height}
                folder={folder}
                pdfDimensions={pdfDimensions}
                isWebtoon={true}
            />
        </div>
    );
});

WebtoonPage.displayName = 'WebtoonPage';

import { useReaderStore } from '../store/useReaderStore';

const WebtoonMode = ({ numPages, currentPage, onPageChange, containerWidth, onBack, folder }) => {
    const { pdfDimensions } = useReaderStore();
    const virtuosoRef = useRef(null);
    const isScrollingRef = useRef(false);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    // Page width: fill container completely on mobile to be edge-to-edge
    const pageWidth = isMobile ? containerWidth : Math.min(containerWidth, 800);
    const pageHeight = pdfDimensions?.aspectRatio ? pageWidth / pdfDimensions.aspectRatio : pageWidth * 1.5;

    // Sync external currentPage change
    useEffect(() => {
        if (virtuosoRef.current && !isScrollingRef.current) {
            virtuosoRef.current.scrollToIndex({
                index: currentPage,
                align: 'start',
                behavior: 'auto'
            });
        }
        isScrollingRef.current = false;
    }, [currentPage]);

    if (!numPages) return null;



    const renderList = () => (
        <Virtuoso
            ref={virtuosoRef}
            style={{ height: '100%' }}
            totalCount={numPages}
            initialTopMostItemIndex={currentPage}
            rangeChanged={(range) => {
                isScrollingRef.current = true;
                onPageChange(range.startIndex);
            }}
            components={{
                Footer: () => (
                    <div className="w-full flex justify-center py-12">
                        <button
                            onClick={onBack}
                            className="px-8 py-3 bg-primary text-white rounded-full font-medium tracking-wide hover:bg-primary/80 transition-all flex items-center gap-2"
                        >
                            Voltar à Seleção
                        </button>
                    </div>
                )
            }}
            itemContent={(index) => (
                <div className="flex flex-col items-center m-0 p-0 leading-none">
                    <WebtoonPage
                        pageNumber={index + 1}
                        width={pageWidth}
                        height={pageHeight}
                        folder={folder}
                        pdfDimensions={pdfDimensions}
                    />
                </div>
            )}
        />
    );

    return (
        <div className="w-full h-full bg-gray-950">
            {folder && renderList()}
        </div>
    );
};

export default WebtoonMode;
