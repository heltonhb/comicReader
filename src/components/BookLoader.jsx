import React from 'react';

/**
 * Reusable loading states for the reader.
 */

export const BookLoader = () => (
    <div className="flex flex-col items-center justify-center gap-4 text-white">
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
        </div>
        <span className="text-xs tracking-[0.2em] font-medium opacity-50 uppercase">Preparando Leitor</span>
    </div>
);

export const PdfDocumentLoader = () => (
    <div className="flex flex-col items-center justify-center text-text-primary h-full w-full gap-6">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-surface shadow-inner" />
            </div>
        </div>
        <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium tracking-wide text-white">Carregando HQ</h3>
            <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-primary/80 animate-[shimmer_1s_infinite] w-full origin-left" />
            </div>
        </div>
    </div>
);

export default BookLoader;
