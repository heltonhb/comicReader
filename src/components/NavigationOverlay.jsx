import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Prev/Next navigation touch areas overlaid on the flipbook.
 */
const NavigationOverlay = ({ onPrev, onNext, showControls }) => (
    <>
        <button
            onClick={onPrev}
            className={`absolute left-0 top-0 h-full w-[15%] flex items-center justify-start pl-4 md:pl-8 transition-all duration-300 z-50 group focus:outline-none touch-manipulation cursor-pointer ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
            aria-label="Página Anterior"
        >
            <div className="p-4 bg-transparent text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
                <ChevronLeft size={32} />
            </div>
        </button>
        <button
            onClick={onNext}
            className={`absolute right-0 top-0 h-full w-[15%] flex items-center justify-end pr-4 md:pr-8 transition-all duration-300 z-50 group focus:outline-none touch-manipulation cursor-pointer ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
            aria-label="Próxima Página"
        >
            <div className="p-4 bg-transparent text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                <ChevronRight size={32} />
            </div>
        </button>
    </>
);

export default NavigationOverlay;
