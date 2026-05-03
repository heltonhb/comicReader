import React, { useState } from 'react';

const PdfThumbnail = React.memo(({ folder }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="w-full h-full relative">
            {folder ? (
                <div className="w-full h-full relative bg-black overflow-hidden flex items-center justify-center">
                    {/* Blurred background */}
                    <img
                        src={`${folder}/page.1.webp`}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-50 scale-125 saturate-150"
                        aria-hidden="true"
                    />
                    {/* Skeleton while loading */}
                    {!loaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 animate-shimmer bg-[length:200%_100%]" />
                    )}
                    {/* Main image */}
                    <img
                        src={`${folder}/page.1.webp`}
                        alt="Thumbnail"
                        className={`relative w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 transition-opacity duration-500 ${
                            loaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading="lazy"
                        onLoad={() => setLoaded(true)}
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
