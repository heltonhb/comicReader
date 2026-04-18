import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Prev/Next navigation touch areas overlaid on the flipbook.
 */
const NavigationOverlay = ({ onPrev, onNext, showControls }) => (
    <AnimatePresence>
        {showControls && (
            <>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onPrev}
                    className="absolute left-0 top-0 h-full w-[15%] flex items-center justify-start pl-2 md:pl-8 z-50 group focus:outline-none touch-manipulation cursor-pointer"
                    aria-label="Página Anterior"
                >
                    <div className="p-2 sm:p-4 bg-transparent text-white/40 group-hover:text-white/80 group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 sm:-translate-x-4 group-hover:translate-x-0">
                        <ChevronLeft size={28} />
                    </div>
                </motion.button>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onNext}
                    className="absolute right-0 top-0 h-full w-[15%] flex items-center justify-end pr-2 md:pr-8 z-50 group focus:outline-none touch-manipulation cursor-pointer"
                    aria-label="Próxima Página"
                >
                    <div className="p-2 sm:p-4 bg-transparent text-white/40 group-hover:text-white/80 group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 sm:translate-x-4 group-hover:translate-x-0">
                        <ChevronRight size={28} />
                    </div>
                </motion.button>
            </>
        )}
    </AnimatePresence>
);

export default NavigationOverlay;
