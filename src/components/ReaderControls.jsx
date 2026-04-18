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
                    className="fixed bottom-8 left-1/2 z-50 w-auto"
                >
                    <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/70 border border-white/10 rounded-full shadow-2xl backdrop-blur-xl ring-1 ring-white/10 transition-colors">

                        {/* Back Button */}
                        <button
                            onClick={onBack}
                            className="flex items-center justify-center p-3 sm:p-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 group relative active:scale-90"
                            title="Voltar"
                        >
                            <ArrowLeft size={22} strokeWidth={2.5} />
                            <span className="hidden sm:block absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-800 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none">
                                Voltar
                            </span>
                        </button>

                        <div className="w-px h-8 bg-white/10 mx-1" />

                        {/* Thumbnails */}
                        <button
                            onClick={toggleThumbnails}
                            className="p-3 sm:p-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 group relative active:scale-90"
                            title="Índice"
                        >
                            <LayoutGrid size={22} />
                            <span className="hidden sm:block absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-800 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none">
                                Índice
                            </span>
                        </button>

                        {/* Reading Mode */}
                        <button
                            onClick={toggleReadingMode}
                            className="p-3 sm:p-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 group relative active:scale-90"
                            title={readingMode === 'flipbook' ? 'Modo Vertical' : 'Modo HQ'}
                        >
                            {readingMode === 'flipbook' ? <AlignJustify size={22} /> : <BookOpen size={22} />}
                            <span className="hidden sm:block absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-800 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none">
                                {readingMode === 'flipbook' ? 'Ler Vertical' : 'Ler Livro'}
                            </span>
                        </button>



                        {/* Fullscreen */}
                        <button
                            onClick={onToggleFullscreen}
                            className="p-3 sm:p-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 group relative active:scale-90"
                            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                        >
                            {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
                            <span className="hidden sm:block absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-800 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none">
                                {isFullscreen ? "Sair" : "Tela Cheia"}
                            </span>
                        </button>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReaderControls;

