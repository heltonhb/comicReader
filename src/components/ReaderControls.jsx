import React from 'react';
import { ArrowLeft, Maximize2, Minimize2, LayoutGrid, BookOpen, AlignJustify } from 'lucide-react';
import { useReaderStore } from '../store/useReaderStore';
import { motion, AnimatePresence } from 'framer-motion';

const ReaderControls = ({
    showControls,
    isFullscreen,
    onToggleFullscreen,
    onBack,
    isLight // Recebe se o fundo é claro
}) => {
    const { readingMode, toggleReadingMode, toggleThumbnails } = useReaderStore();
    // Primeiro declara com =
    const borderStyle = isLight ? "border-2 border-red-600" : "border-2 border-white/60";

    const theme = isLight
        ? {
            bg: "bg-white/20",
            border: borderStyle, // Chama a variável aqui
            text: "text-red-500 font-bold drop-shadow-md",
            divider: "bg-black/30"
        }
        : {
            bg: "bg-black/20",
            border: borderStyle, // E aqui também
            text: "text-white font-bold drop-shadow-md",
            divider: "bg-white/30"
        };
    return (
        <AnimatePresence>
            {showControls && (
                <motion.div
                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 10, x: '-50%' }}
                    className="fixed bottom-6 left-1/2 z-50"
                >
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-500 ${theme.bg} ${theme.border} ${theme.text}`}>

                        <button onClick={onBack} className="p-2 hover:opacity-60 transition-opacity">
                            <ArrowLeft size={22} strokeWidth={2.5} />
                        </button>

                        <div className={`w-px h-5 mx-1 ${theme.divider}`} />

                        <button onClick={toggleThumbnails} className="p-2 hover:opacity-60 transition-opacity">
                            <LayoutGrid size={22} strokeWidth={2.5} />
                        </button>

                        <button onClick={toggleReadingMode} className="p-2 hover:opacity-60 transition-opacity">
                            {readingMode === 'flipbook' ? <AlignJustify size={22} strokeWidth={2.5} /> : <BookOpen size={22} strokeWidth={2.5} />}
                        </button>

                        <button onClick={onToggleFullscreen} className="hidden sm:flex p-2 hover:opacity-60 transition-opacity">
                            {isFullscreen ? <Minimize2 size={22} strokeWidth={2.5} /> : <Maximize2 size={22} strokeWidth={2.5} />}
                        </button>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReaderControls;