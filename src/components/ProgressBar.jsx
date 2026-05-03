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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none"
                >
                    {isMobile ? (
                        <div className="w-full h-[3px] bg-white/10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-gold via-gold-light to-gold"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    ) : (
                        <div className="w-full px-8 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-gold via-gold-light to-gold rounded-full shadow-gold"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                                <motion.span 
                                    className="text-xs font-medium whitespace-nowrap tabular-nums tracking-wider text-white/80"
                                    key={displayPage}
                                    initial={{ opacity: 0.5, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span className="text-gold-light font-semibold">{displayPage}</span>
                                    <span className="text-white/50 mx-1">/</span>
                                    <span className="text-white/70">{numPages}</span>
                                </motion.span>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProgressBar;