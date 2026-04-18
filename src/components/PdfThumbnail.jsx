import React from 'react';

const PdfThumbnail = React.memo(({ folder }) => {
    return (
        <div className="w-full h-full relative">
            {folder ? (
                <div className="w-full h-full relative bg-black overflow-hidden flex items-center justify-center">
                    <img
                        src={`${folder}/page.1.webp`}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-50 scale-125 saturate-150"
                        aria-hidden="true"
                    />
                    <img
                        src={`${folder}/page.1.webp`}
                        alt="Thumbnail"
                        className="relative w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10"
                        loading="lazy"
                    />
                </div>
            ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-xs">
                    <span className="uppercase tracking-widest">Sem capa</span>
                </div>
            )}
            {/* Subtle gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
        </div>
    );
});

export default PdfThumbnail;
