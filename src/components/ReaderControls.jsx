import React, { useState } from 'react';
import { 
    ArrowLeft, 
    Maximize2, 
    Minimize2, 
    LayoutGrid, 
    BookOpen, 
    AlignJustify,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useReaderStore } from '../store/useReaderStore';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ children, text }) => {
    const [show, setShow] = useState(false);
    
    return (
        <div 
            className="relative"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            <AnimatePresence>
                {show && (
                    <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-navy-dark text-white/90 rounded-md whitespace-nowrap shadow-elevated"
                    >
                        {text}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
};

const ReaderControls = ({
    showControls,
    isFullscreen,
    onToggleFullscreen,
    onBack,
    isLight
}) => {
    const { readingMode, toggleReadingMode, toggleThumbnails } = useReaderStore();
    
    const borderStyle = isLight ? "border-2 border-red-600" : "border-2 border-white/60";

    const theme = isLight
        ? {
            bg: "bg-white/20 backdrop-blur-md",
            border: borderStyle,
            text: "text-red-500",
            divider: "bg-black/30"
        }
        : {
            bg: "bg-black/40 backdrop-blur-md border border-white/10",
            border: borderStyle,
            text: "text-white",
            divider: "bg-white/20"
        };

    return (
        <AnimatePresence>
            {showControls && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 left-1/2 z-50"
                >
                    <div className={`
                        flex items-center gap-1 px-4 py-2.5 rounded-2xl 
                        ${theme.bg} ${theme.border} ${theme.text}
                        shadow-elevated
                    `}>
                        <Tooltip text="Voltar">
                            <button 
                                onClick={onBack} 
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
                            >
                                <ArrowLeft size={20} strokeWidth={2.5} />
                            </button>
                        </Tooltip>

                        <div className={`w-px h-5 mx-1 ${theme.divider}`} />

                        <Tooltip text="Miniaturas">
                            <button 
                                onClick={toggleThumbnails} 
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
                            >
                                <LayoutGrid size={20} strokeWidth={2.5} />
                            </button>
                        </Tooltip>

                        <Tooltip text={readingMode === 'flipbook' ? 'Modo Webtoon' : 'Modo Flipbook'}>
                            <button 
                                onClick={toggleReadingMode} 
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
                            >
                                {readingMode === 'flipbook' 
                                    ? <AlignJustify size={20} strokeWidth={2.5} /> 
                                    : <BookOpen size={20} strokeWidth={2.5} />
                                }
                            </button>
                        </Tooltip>

                        <div className={`w-px h-5 mx-1 ${theme.divider}`} />

                        <Tooltip text={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}>
                            <button 
                                onClick={onToggleFullscreen} 
                                className="hidden sm:flex p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
                            >
                                {isFullscreen 
                                    ? <Minimize2 size={20} strokeWidth={2.5} /> 
                                    : <Maximize2 size={20} strokeWidth={2.5} />
                                }
                            </button>
                        </Tooltip>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReaderControls;