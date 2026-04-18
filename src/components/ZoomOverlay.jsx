import React from 'react';
import { X } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Page from './Page';

import { useReaderStore } from '../store/useReaderStore';

const ZoomOverlay = ({ folder, pageNumber, showControls }) => {
    const { toggleZoom } = useReaderStore();
    const content = (
        <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={4}
            centerOnInit
            doubleClick={{ mode: 'toggle', step: 2 }}
        >
            <TransformComponent
                wrapperClass="!w-full !h-full flex items-center justify-center"
                contentClass="flex items-center justify-center"
            >
                {folder && (
                    <img
                        src={`${folder}/page.${pageNumber}.webp`}
                        alt={`Página ${pageNumber}`}
                        className="max-w-full max-h-screen object-contain pointer-events-none"
                    />
                )}
            </TransformComponent>
        </TransformWrapper>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className={`absolute top-4 right-4 z-[101] flex gap-4 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                    onClick={toggleZoom}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md min-w-[48px] min-h-[48px] flex items-center justify-center"
                    aria-label="Fechar zoom"
                >
                    <X size={32} />
                </button>
            </div>

            {folder && (
                <div className="flex items-center justify-center h-full w-full">
                    {content}
                </div>
            )}

            <div className="absolute bottom-8 text-white/50 text-sm font-medium pointer-events-none">
                Belisque para zoom • Arraste para mover • Toque duplo para zoom • Esc para fechar
            </div>
        </div>
    );
};

export default ZoomOverlay;
