import React, { useRef, useEffect, memo } from 'react';
import { Document } from 'react-pdf';
import { Virtuoso } from 'react-virtuoso';
import Page from './Page';

const WebtoonPage = memo(({ pageNumber, width, folder, pdfDimensions }) => {
    return (
        <div className="w-full flex justify-center">
            <Page
                pageNumber={pageNumber}
                width={width}
                folder={folder}
                pdfDimensions={pdfDimensions}
            />
        </div>
    );
});

WebtoonPage.displayName = 'WebtoonPage';

import { useReaderStore } from '../store/useReaderStore';

const WebtoonMode = ({ file, numPages, currentPage, onPageChange, containerWidth, onBack, folder }) => {
    const { pdfDimensions } = useReaderStore();
    const virtuosoRef = useRef(null);
    const isScrollingRef = useRef(false);

    // Page width: fill container for maximum screen usage
    const pageWidth = Math.min(containerWidth, 800);

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
                <div className="flex flex-col items-center">
                    <WebtoonPage
                        pageNumber={index + 1}
                        width={pageWidth}
                        folder={folder}
                        pdfDimensions={pdfDimensions}
                    />
                </div>
            )}
        />
    );

    return (
        <div className="w-full h-full bg-gray-950">
            {folder ? (
                renderList()
            ) : (
                <Document
                    file={file}
                    loading={
                        <div className="flex flex-col items-center justify-center text-white h-screen w-full gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            <div className="text-sm font-light text-text-secondary animate-pulse">Carregando HQ...</div>
                        </div>
                    }
                    className="w-full h-full"
                >
                    {renderList()}
                </Document>
            )}
        </div>
    );
};

export default WebtoonMode;
