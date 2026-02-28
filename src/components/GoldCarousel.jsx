import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, BookOpen, Search } from 'lucide-react';

const PdfThumbnail = lazy(() => import('./PdfThumbnail'));

// Theme Constants extracted from Stitch HTML
const THEME = {
    gold: '#D4AF37',
    silver: '#C0C0C0',
    redGlow: '#8B0000',
    redButton: 'radial-gradient(circle at center, #B22222, #800000)',
    bg: 'radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 100%)',
};

// Reused Thumbnail Component
const VolumeThumbnail = React.memo(({ file, folder, volumeId }) => {
    return (
        <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse" />}>
            <PdfThumbnail file={file} folder={folder} />
        </Suspense>
    );
});

const GoldCarousel = ({ volumes, activeIndex, setActiveIndex, onSelect, onClose }) => {

    const getCardStyle = (index) => {
        const length = volumes.length;
        let offset = (index - activeIndex + length) % length;
        if (offset > length / 2) offset -= length;

        const isCenter = offset === 0;

        let x = '0%';
        let rotateY = 0;
        let scale = 1;
        let opacity = 1;
        let zIndex = 10;
        let blur = 0;

        if (isCenter) {
            zIndex = 20;
            rotateY = -18; // Slight turn to show the pages on the right
        } else if (offset === -1 || (activeIndex === 0 && index === length - 1)) {
            x = '-55%';
            rotateY = 35; // Angled rightwards, showing spine
            scale = 0.8;
            opacity = 0.6;
            zIndex = 10;
            blur = 1;
        } else if (offset === 1 || (activeIndex === length - 1 && index === 0)) {
            x = '55%';
            rotateY = -45; // Angled leftwards, showing pages
            scale = 0.8;
            opacity = 0.6;
            zIndex = 10;
            blur = 1;
        } else {
            scale = 0.5;
            opacity = 0;
            zIndex = 0;
        }

        return { x, rotateY, scale, opacity, zIndex, blur, isCenter };
    };

    const nextVolume = () => setActiveIndex((prev) => (prev + 1) % volumes.length);
    const prevVolume = () => setActiveIndex((prev) => (prev - 1 + volumes.length) % volumes.length);

    const [clientStartX, setClientStartX] = useState(null);
    const [clientEndX, setClientEndX] = useState(null);

    const checkSwipe = () => {
        if (clientStartX === null || clientEndX === null) return;
        const distance = clientStartX - clientEndX;
        if (distance > 50) {
            nextVolume();
        } else if (distance < -50) {
            prevVolume();
        }
        setClientStartX(null);
        setClientEndX(null);
    };

    return (
        <div
            className="relative flex h-screen w-full flex-col overflow-hidden text-white font-sans"
            style={{ background: THEME.bg }}
        >

            {/* Header */}
            <header className="flex flex-col items-center justify-center pt-8 pb-4 z-30 relative">
                <div className="absolute right-6 top-8">
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full p-1"
                        aria-label="Fechar"
                    >
                        <X size={32} />
                    </button>
                </div>

                <div className="text-center space-y-0.5">
                    <h2 className="uppercase tracking-[0.2em] text-lg font-light text-[#C0C0C0]">
                        Sua
                    </h2>
                    <h1 className="uppercase tracking-[0.3em] text-2xl font-bold leading-none text-[#D4AF37]">
                        Gibiteca
                    </h1>
                    <h1 className="uppercase tracking-[0.3em] text-2xl font-bold leading-none text-[#D4AF37]">
                        Ensina Mais
                    </h1>
                </div>
            </header>

            {/* Carousel Track */}
            <div
                className="flex-1 relative flex items-center justify-center perspective-[1000px] transform-style-3d mb-20 w-full"
                onTouchStart={(e) => {
                    setClientStartX(e.targetTouches[0].clientX);
                    setClientEndX(null);
                }}
                onTouchMove={(e) => setClientEndX(e.targetTouches[0].clientX)}
                onTouchEnd={checkSwipe}
                onMouseDown={(e) => {
                    setClientStartX(e.clientX);
                    setClientEndX(null);
                }}
                onMouseMove={(e) => {
                    if (clientStartX !== null) setClientEndX(e.clientX);
                }}
                onMouseUp={checkSwipe}
                onMouseLeave={() => {
                    if (clientStartX !== null) checkSwipe();
                }}
            >
                {/* Nav Click Areas (Invisible but functional) */}
                <button
                    className="absolute inset-y-0 left-0 w-1/4 z-30 opacity-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50"
                    onClick={prevVolume}
                    onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? prevVolume() : null}
                    aria-label="Volume anterior"
                    type="button"
                />
                <button
                    className="absolute inset-y-0 right-0 w-1/4 z-30 opacity-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50"
                    onClick={nextVolume}
                    onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? nextVolume() : null}
                    aria-label="Próximo volume"
                    type="button"
                />

                <AnimatePresence initial={false}>
                    {volumes.map((volume, index) => {
                        const style = getCardStyle(index);
                        const isCenter = style.zIndex === 20;
                        if (style.opacity === 0) return null;

                        return (
                            <motion.div
                                key={volume.id}
                                className={`absolute w-56 sm:w-64 aspect-[9/16] cursor-pointer`}
                                style={{ zIndex: style.zIndex, perspective: 1500 }}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    x: style.x,
                                    scale: style.scale,
                                    opacity: style.opacity,
                                    filter: style.blur ? `blur(${style.blur}px)` : 'drop-shadow(0 20px 30px rgba(0,0,0,0.7))'
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                onClick={() => style.isCenter ? onSelect(volume) : setActiveIndex(index)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        style.isCenter ? onSelect(volume) : setActiveIndex(index);
                                    }
                                }}
                                role="button"
                                tabIndex={style.opacity > 0 ? 0 : -1}
                                aria-label={`Selecionar ${volume.title}`}
                                aria-current={style.isCenter}
                            >
                                <motion.div
                                    className="w-full h-full relative"
                                    style={{ transformStyle: 'preserve-3d' }}
                                    animate={{ rotateY: style.rotateY }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    {/* Back Cover */}
                                    <div className="absolute inset-0 bg-black/90 rounded-r-md"
                                        style={{ transform: 'translateZ(-15px) rotateY(180deg)' }} />

                                    {/* Left Side (Spine) */}
                                    <div className="absolute inset-y-0 left-0 w-[30px] bg-[#1a1a1a] flex items-center justify-center border-l border-white/10 shadow-inner"
                                        style={{ transform: 'translateX(-15px) rotateY(-90deg)' }}>
                                        <span className="text-white/20 font-bold tracking-widest text-[8px] transform -rotate-90 whitespace-nowrap">ENSINA MAIS</span>
                                    </div>

                                    {/* Right Side (Pages) */}
                                    <div className="absolute inset-y-0 right-0 w-[30px] bg-[#e8e8e8] flex flex-col justify-evenly overflow-hidden"
                                        style={{ transform: 'translateX(15px) rotateY(90deg)' }}>
                                        {Array.from({ length: 40 }).map((_, i) => <div key={i} className="w-full h-[1px] bg-black/5" />)}
                                    </div>

                                    {/* Bottom Side (Pages) */}
                                    <div className="absolute bottom-0 inset-x-0 h-[30px] bg-[#d0d0d0] flex justify-evenly overflow-hidden"
                                        style={{ transform: 'translateY(15px) rotateX(-90deg)' }}>
                                        {Array.from({ length: 30 }).map((_, i) => <div key={i} className="h-full w-[1px] bg-black/5" />)}
                                    </div>

                                    {/* Top Side (Pages) */}
                                    <div className="absolute top-0 inset-x-0 h-[30px] bg-[#f0f0f0] flex justify-evenly overflow-hidden"
                                        style={{ transform: 'translateY(-15px) rotateX(90deg)' }}>
                                        {Array.from({ length: 30 }).map((_, i) => <div key={i} className="h-full w-[1px] bg-black/5" />)}
                                    </div>

                                    {/* Front Cover */}
                                    <div className="absolute inset-0 bg-gray-900 rounded-r-md overflow-hidden"
                                        style={{
                                            transform: 'translateZ(15px)',
                                            boxShadow: style.isCenter ? 'inset 0 0 0 1px rgba(255,255,255,0.2)' : 'inset 0 0 0 1px rgba(255,255,255,0.1)'
                                        }}>
                                        <VolumeThumbnail file={volume.file} folder={volume.folder} volumeId={volume.id} />
                                        {/* Spine hinge overlay */}
                                        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
                                        <div className="absolute inset-y-0 left-[1px] w-[1px] bg-white/30 pointer-events-none" />
                                        {style.isCenter && <div className="absolute inset-0 border border-[#D4AF37]/40 rounded-r-md pointer-events-none mix-blend-overlay" />}
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-40 flex flex-col items-center pb-8 pointer-events-none">
                {(() => {

                    return (
                        <>
                            <button
                                onClick={() => onSelect(volumes[activeIndex])}
                                className="pointer-events-auto flex flex-col items-center justify-center size-28 rounded-full border-2 border-white/10 transition-transform active:scale-95 hover:scale-105 mb-6"
                                style={{
                                    background: 'radial-gradient(circle at center, rgba(178, 34, 34, 0.5), rgba(128, 0, 0, 0.5))',
                                    boxShadow: '0 0 25px rgba(178, 34, 34, 0.25)',
                                    //backdropFilter: 'blur(4px)'
                                }}
                            >
                                <BookOpen size={32} className="text-white mb-1" />
                                <span className="text-[10px] leading-tight font-bold uppercase tracking-tighter text-white">
                                    Começar<br />Leitura
                                </span>
                            </button>

                            <div className="text-center mb-6 mt-22 pointer-events-auto">
                                <p className="text-[#ff0000] text-xs font-bold tracking-widest uppercase mb-1 opacity-80">HQ Interativa</p>
                                <h3 className="text-xl font-light text-[#fbbf24] tracking-wide drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                                    {(() => {
                                        const parts = volumes[activeIndex]?.title.split('—').map(s => s.trim());
                                        if (!parts) return null;
                                        return (
                                            <>
                                                {parts[0]}
                                                {parts[1] && (
                                                    <> — <span className="font-normal">{parts[1]}</span></>
                                                )}
                                            </>
                                        );
                                    })()}
                                </h3>
                            </div>
                        </>
                    );
                })()}

                {/* Pagination Dots */}
                <div className="flex gap-2 justify-center">
                    {volumes.map((_, idx) => (
                        <div
                            key={idx}
                            className={`size-1.5 rounded-full transition-colors ${idx === activeIndex ? 'bg-[#8B0000]' : 'bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default GoldCarousel;
