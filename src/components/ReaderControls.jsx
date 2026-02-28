import React from 'react';
import { ArrowLeft, Maximize2, Minimize2, LayoutGrid, BookOpen, AlignJustify, ZoomIn } from 'lucide-react';
import { useReaderStore } from '../store/useReaderStore';

const ReaderControls = ({
    showControls,
    isFullscreen,
    onToggleFullscreen,
    onBack,
}) => {
    const {
        readingMode, toggleReadingMode,
        toggleZoom,
        toggleThumbnails,
    } = useReaderStore();

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border border-white/10 rounded-full shadow-2xl">

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center justify-center p-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 group relative"
                    title="Voltar"
                >
                    <ArrowLeft size={20} />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Voltar
                    </span>
                </button>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Thumbnails */}
                <button
                    onClick={toggleThumbnails}
                    className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 group relative"
                    title="Índice"
                >
                    <LayoutGrid size={20} />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Índice
                    </span>
                </button>

                {/* Reading Mode */}
                <button
                    onClick={toggleReadingMode}
                    className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 group relative"
                    title={readingMode === 'flipbook' ? 'Modo Vertical' : 'Modo HQ'}
                >
                    {readingMode === 'flipbook' ? <AlignJustify size={20} /> : <BookOpen size={20} />}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {readingMode === 'flipbook' ? 'Ler Vertical' : 'Ler Livro'}
                    </span>
                </button>

                {/* Zoom (only in flipbook mode) */}
                {readingMode === 'flipbook' && (
                    <button
                        onClick={toggleZoom}
                        className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 group relative"
                        title="Zoom"
                    >
                        <ZoomIn size={20} />
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Zoom
                        </span>
                    </button>
                )}

                {/* Fullscreen */}
                <button
                    onClick={onToggleFullscreen}
                    className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 group relative"
                    title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {isFullscreen ? "Sair" : "Tela Cheia"}
                    </span>
                </button>

            </div>
        </div >
    );
};

export default ReaderControls;

