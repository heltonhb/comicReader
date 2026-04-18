import React from 'react';
import { ArrowLeft, Maximize2, Minimize2, LayoutGrid, BookOpen, AlignJustify } from 'lucide-react';
import { useReaderStore } from '../store/useReaderStore';
import { motion, AnimatePresence } from 'framer-motion';
const ReaderControls = ({
    showControls,
    isFullscreen,
    onToggleFullscreen,
    onBack,
}) => {
    const {
        readingMode, toggleReadingMode,
        toggleThumbnails,
    } = useReaderStore();

    return (
        <AnimatePresence>
            {showControls && (
                <motion.div
                    initial={{ opacity: 0, y: 8, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 8, x: '-50%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="fixed bottom-3 sm:bottom-6 left-1/2 z-50 w-auto"
                >
                    {/* Completely transparent wrapper */}
                    <div className="flex items-center gap-2 sm:gap-4 px-2 py-1 bg-transparent">

                        {/* Back Button */}
                        <button
                            onClick={onBack}
                            className="flex items-center justify-center p-2 text-white/30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-white/90 active:text-white transition-all duration-200 active:scale-90 touch-manipulation"
                            title="Voltar"
                        >
                            <ArrowLeft size={20} strokeWidth={2} />
                        </button>

                        {/* Thumbnails */}
                        <button
                            onClick={toggleThumbnails}
                            className="p-2 text-white/30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-white/90 active:text-white transition-all duration-200 active:scale-90 touch-manipulation"
                            title="Índice"
                        >
                            <LayoutGrid size={20} strokeWidth={2} />
                        </button>

                        {/* Reading Mode */}
                        <button
                            onClick={toggleReadingMode}
                            className="p-2 text-white/30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-white/90 active:text-white transition-all duration-200 active:scale-90 touch-manipulation"
                            title={readingMode === 'flipbook' ? 'Modo Vertical' : 'Modo HQ'}
                        >
                            {readingMode === 'flipbook' ? <AlignJustify size={20} strokeWidth={2} /> : <BookOpen size={20} strokeWidth={2} />}
                        </button>

                        {/* Fullscreen */}
                        <button
                            onClick={onToggleFullscreen}
                            className="hidden sm:flex p-2 text-white/30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-white/90 transition-all duration-200 active:scale-90"
                            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                        >
                            {isFullscreen ? <Minimize2 size={20} strokeWidth={2} /> : <Maximize2 size={20} strokeWidth={2} />}
                        </button>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReaderControls;

