import React, { useRef, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';
import ReaderControls from './ReaderControls';

const Reader = ({ imageUrl }) => {
    const imageRef = useRef(null);
    const [isLightBackground, setIsLightBackground] = useState(false);

    const handleImageLoad = () => {
        const fac = new FastAverageColor();
        // Analisa a imagem assim que ela carrega
        fac.getColorAsync(imageRef.current)
            .then(color => {
                // color.isLight deteta se a cor média é clara ou escura
                setIsLightBackground(color.isLight);
            })
            .catch(e => console.error("Erro ao analisar imagem:", e));
    };

    return (
        <div className="relative w-full h-screen bg-gray-900 flex justify-center items-center overflow-hidden">
            {/* Imagem da HQ / Livro */}
            <img
                ref={imageRef}
                src={imageUrl}
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
                className="max-h-full object-contain"
                alt="Página atual"
            />

            {/* Controlos que reagem ao fundo */}
            <ReaderControls
                showControls={true}
                isLight={isLightBackground}
                onBack={() => console.log('Voltar')}
                onToggleFullscreen={() => console.log('Fullscreen')}
                isFullscreen={false}
            />
        </div>
    );
};

export default Reader;