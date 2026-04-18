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

export default BookLoader;
