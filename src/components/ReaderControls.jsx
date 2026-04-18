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
                    initial={{ opacity: 0, y: 40, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 40, x: '-50%' }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-4 sm:bottom-8 left-1/2 z-50 w-auto"
                >
                    <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-2 py-1 rounded-full">

                        {/* Back Button */}
                        <button
                            onClick={onBack}
                            className="flex items-center justify-center p-1.5 text-white/30 hover:text-white transition-all active:scale-90"
                            title="Voltar"
                        >
                            <ArrowLeft size={18} strokeWidth={2} />
                        </button>

                        <div className="w-px h-5 bg-white/10 mx-0.5" />

                        {/* Thumbnails */}
                        <button
                            onClick={toggleThumbnails}
                            className="p-1.5 text-white/30 hover:text-white transition-all active:scale-90"
                            title="Índice"
                        >
                            <LayoutGrid size={18} />
                        </button>

                        {/* Reading Mode */}
                        <button
                            onClick={toggleReadingMode}
                            className="p-1.5 text-white/30 hover:text-white transition-all active:scale-90"
                            title={readingMode === 'flipbook' ? 'Modo Vertical' : 'Modo HQ'}
                        >
                            {readingMode === 'flipbook' ? <AlignJustify size={18} /> : <BookOpen size={18} />}
                        </button>

                        {/* Fullscreen */}
                        <button
                            onClick={onToggleFullscreen}
                            className="p-1.5 text-white/30 hover:text-white transition-all active:scale-90"
                            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                        >
                            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReaderControls;

