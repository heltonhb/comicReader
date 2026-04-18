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
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none"
                >
                    {isMobile ? (
                        /* Mobile: ultra-thin line only — zero text clutter */
                        <div className="w-full h-[1.5px] bg-white/8">
                            <div
                                className="h-full bg-white/20 transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    ) : (
                        /* Desktop: slim bar + page count, well away from content */
                        <div className="w-full px-8 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-[2px] bg-white/8 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white/25 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-white/30 font-medium whitespace-nowrap tabular-nums tracking-wide">
                                    {displayPage} / {numPages}
                                </span>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProgressBar;
