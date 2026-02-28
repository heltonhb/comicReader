import React, { memo, useState } from 'react';
import { Document, Page as PdfPage } from 'react-pdf';
import { Virtuoso } from 'react-virtuoso';
import { X, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const THUMB_WIDTH = 120;

const ThumbnailItem = memo(({ pageNumber, isActive, onClick, folder }) => {
    return (
        <button
            onClick={() => onClick(pageNumber - 1)}
            className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary ${isActive
                ? 'border-primary shadow-lg shadow-primary/30'
                : 'border-white/10 hover:border-white/30'
                }`}
            style={{ width: THUMB_WIDTH, height: THUMB_WIDTH * 1.414 }}
            aria-label={`Ir para página ${pageNumber}`}
        >
            {folder ? (
                <img
                    src={`${folder}/page.${pageNumber}.webp`}
                    alt={`Página ${pageNumber}`}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                />
            ) : (
                <PdfPage
                    pageNumber={pageNumber}
                    width={THUMB_WIDTH}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    loading={
                        <div className="w-full h-full bg-surface flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    }
                />
            )}
            <div className={`absolute bottom-0 inset-x-0 py-1 text-center text-[10px] font-bold ${isActive ? 'bg-primary text-white' : 'bg-black/60 text-white/70'
                }`}>
                {pageNumber}
            </div>
        </button>
    );
});

ThumbnailItem.displayName = 'ThumbnailItem';

import { useReaderStore } from '../store/useReaderStore';

const ThumbnailDrawer = ({ file, numPages, currentPage, chapters, onPageSelect, folder }) => {
    const { showThumbnails, setShowThumbnails } = useReaderStore();
    const [activeTab, setActiveTab] = useState('thumbnails'); // 'thumbnails' | 'chapters'

    const handleClose = () => setShowThumbnails(false);

    if (!numPages) return null;

    return (
        <AnimatePresence>
            {showThumbnails && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed left-0 top-0 bottom-0 z-[95] w-[220px] bg-gray-900/95 backdrop-blur-md border-r border-white/10 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Navegação</h2>
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                                aria-label="Fechar navegação"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Tabs */}
                        {chapters && chapters.length > 0 && (
                            <div className="flex border-b border-white/10">
                                <button
                                    onClick={() => setActiveTab('thumbnails')}
                                    className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 ${activeTab === 'thumbnails' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white/80'}`}
                                >
                                    <LayoutGrid size={14} /> Páginas
                                </button>
                                <button
                                    onClick={() => setActiveTab('chapters')}
                                    className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 ${activeTab === 'chapters' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white/80'}`}
                                >
                                    <List size={14} /> Sumário
                                </button>
                            </div>
                        )}

                        <div className="flex-1 overflow-hidden p-3 h-full">
                            {activeTab === 'thumbnails' ? (
                                <>
                                    {folder ? (
                                        <Virtuoso
                                            style={{ height: '100%' }}
                                            totalCount={numPages}
                                            initialTopMostItemIndex={Math.max(0, currentPage - 1)}
                                            itemContent={(index) => (
                                                <div className="pb-3 flex justify-center">
                                                    <ThumbnailItem
                                                        pageNumber={index + 1}
                                                        isActive={currentPage === index}
                                                        onClick={(page) => {
                                                            onPageSelect(page);
                                                            if (window.innerWidth < 768) handleClose();
                                                        }}
                                                        folder={folder}
                                                    />
                                                </div>
                                            )}
                                        />
                                    ) : (
                                        <Document file={file} loading={null} className="h-full">
                                            <Virtuoso
                                                style={{ height: '100%' }}
                                                totalCount={numPages}
                                                initialTopMostItemIndex={Math.max(0, currentPage - 1)}
                                                itemContent={(index) => (
                                                    <div className="pb-3 flex justify-center">
                                                        <ThumbnailItem
                                                            pageNumber={index + 1}
                                                            isActive={currentPage === index}
                                                            onClick={(page) => {
                                                                onPageSelect(page);
                                                                if (window.innerWidth < 768) handleClose();
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </Document>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 overflow-y-auto h-full pr-1 custom-scrollbar">
                                    {chapters.map((chapter, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                onPageSelect(chapter.page - 1);
                                                if (window.innerWidth < 768) handleClose();
                                            }}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors border ${currentPage >= (chapter.page - 1) && (!chapters[idx + 1] || currentPage < chapters[idx + 1].page - 1)
                                                ? 'bg-primary/20 border-primary/50 text-white'
                                                : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            <span className="text-sm font-medium line-clamp-2">{chapter.title}</span>
                                            <span className="text-xs opacity-50 font-mono ml-2 shrink-0">p. {chapter.page}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ThumbnailDrawer;
