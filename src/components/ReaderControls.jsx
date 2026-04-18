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
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-black/40 sm:bg-black/50 border border-white/5 rounded-full shadow-lg backdrop-blur-md ring-1 ring-white/5 transition-colors">

                        {/* Back Button */}
                        <button
                            onClick={onBack}
                            className="flex items-center justify-center p-2 sm:p-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 group relative active:scale-90"
                            title="Voltar"
                        >
                            <ArrowLeft size={20} strokeWidth={2.5} />
                        </button>

                        <div className="w-px h-8 bg-white/10 mx-1" />

                        {/* Thumbnails */}
                        <button
                            onClick={toggleThumbnails}
                            className="p-2 sm:p-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 group relative active:scale-90"
                            title="Índice"
                        >
                            <LayoutGrid size={20} />
                        </button>

                        {/* Reading Mode */}
                        <button
                            onClick={toggleReadingMode}
                            className="p-2 sm:p-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 group relative active:scale-90"
                            title={readingMode === 'flipbook' ? 'Modo Vertical' : 'Modo HQ'}
                        >
                            {readingMode === 'flipbook' ? <AlignJustify size={20} /> : <BookOpen size={20} />}
                        </button>



                        {/* Fullscreen */}
                        <button
                            onClick={onToggleFullscreen}
                            className="p-2 sm:p-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 group relative active:scale-90"
                            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                        >
                            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReaderControls;

