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
                    {/* Transparent wrapper with difference blending for dynamic contrast */}
                    <div className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-transparent mix-blend-difference text-white">

                        {/* Back Button */}
                        <button
                            onClick={onBack}
                            className="flex items-center justify-center p-2 hover:opacity-70 active:opacity-100 transition-all duration-200 active:scale-90 touch-manipulation"
                            title="Voltar"
                        >
                            <ArrowLeft size={18} strokeWidth={2} />
                        </button>

                        <div className="w-px h-5 bg-white mx-1 opacity-50" />

                        {/* Thumbnails */}
                        <button
                            onClick={toggleThumbnails}
                            className="p-2 hover:opacity-70 active:opacity-100 transition-all duration-200 active:scale-90 touch-manipulation"
                            title="Índice"
                        >
                            <LayoutGrid size={18} strokeWidth={2} />
                        </button>

                        {/* Reading Mode */}
                        <button
                            onClick={toggleReadingMode}
                            className="p-2 hover:opacity-70 active:opacity-100 transition-all duration-200 active:scale-90 touch-manipulation"
                            title={readingMode === 'flipbook' ? 'Modo Vertical' : 'Modo HQ'}
                        >
                            {readingMode === 'flipbook' ? <AlignJustify size={18} strokeWidth={2} /> : <BookOpen size={18} strokeWidth={2} />}
                        </button>

                        {/* Fullscreen */}
                        <button
                            onClick={onToggleFullscreen}
                            className="hidden sm:flex p-2 hover:opacity-70 active:opacity-100 transition-all duration-200 active:scale-90"
                            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                        >
                            {isFullscreen ? <Minimize2 size={18} strokeWidth={2} /> : <Maximize2 size={18} strokeWidth={2} />}
                        </button>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReaderControls;

