import { create } from 'zustand';

export const useReaderStore = create((set) => ({
    // Navigation & State
    isZoomed: false,
    setIsZoomed: (isZoomed) => set({ isZoomed }),
    toggleZoom: () => set((state) => ({ isZoomed: !state.isZoomed })),

    readingMode: 'flipbook', // 'flipbook' | 'webtoon'
    setReadingMode: (mode) => set({ readingMode: mode }),
    toggleReadingMode: () => set((state) => ({
        readingMode: state.readingMode === 'flipbook' ? 'webtoon' : 'flipbook',
        isZoomed: false,
    })),

    showThumbnails: false,
    setShowThumbnails: (show) => set({ showThumbnails: show }),
    toggleThumbnails: () => set((state) => ({ showThumbnails: !state.showThumbnails })),

    // Dimensions
    pdfDimensions: { width: 595, height: 842, aspectRatio: 0.707 },
    setPdfDimensions: (dimensions) => set({ pdfDimensions: dimensions }),

    // Reset store when closing volume
    reset: () => set({
        isZoomed: false,
        readingMode: 'flipbook',
        showThumbnails: false,
    }),
}));
