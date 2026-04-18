import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const ProgressBar = ({ currentPage, numPages, isMobile, showControls }) => {
    if (!numPages) return null;

    const displayPage = isMobile
        ? currentPage + 1
        : Math.min(currentPage + 2, numPages);
    const progressPercent = (displayPage / numPages) * 100;

    return (
        <AnimatePresence>
            {showControls && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 z-40"
                >
                    <div className="w-full px-6 pb-2">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary/70 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <span className="text-xs text-white/60 font-medium whitespace-nowrap tabular-nums">
                                {displayPage} / {numPages}
                            </span>
                        </div>
                    </div>
                    <div className="text-center pb-4">
                        <span className="text-white/50 text-xs uppercase tracking-widest font-medium pointer-events-none">
                            {isMobile
                                ? 'Toque nas laterais para virar • Toque duplo para zoom'
                                : 'Clique nas laterais ou use ← → para virar • F para tela cheia'}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProgressBar;
