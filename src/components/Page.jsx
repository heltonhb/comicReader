import React, { forwardRef, memo, useState } from 'react';

const Page = memo(forwardRef(({ pageNumber, width, height, folder, style, isWebtoon, isMobileLandscape, isVisible = true, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div
            ref={ref}
            className={`bg-zinc-950 overflow-hidden relative flex items-center justify-center ${isWebtoon ? '' : 'shadow-2xl border-x border-white/5'}`}
            style={{
                ...style,
                ...(width ? { width } : {}),
                ...(height ? { height } : {})
            }}
            {...props}
        >
            {isVisible && folder ? (
                <div
                    className={`w-full h-full flex items-center justify-center ${isWebtoon ? '' : 'min-h-[50vh]'}`}
                >
                    {!isLoaded && (
                        <div className="absolute inset-0 w-full h-full bg-zinc-900 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-shimmer" />
                        </div>
                    )}
                    <img
                        src={`${folder}/page.${pageNumber}.webp`}
                        alt={`Página ${pageNumber}`}
                        className={`absolute inset-0 w-full h-full pointer-events-none block origin-center z-10 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ objectFit: (isWebtoon || isMobileLandscape) ? 'fill' : 'contain' }}
                        loading="lazy"
                        decoding="async"
                        fetchPriority={pageNumber <= 2 ? 'high' : 'auto'}
                        onLoad={() => setIsLoaded(true)}
                    />
                </div>
            ) : (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
                    <span className="text-white/5 text-[8px]">{pageNumber}</span>
                </div>
            )}

            <div className="absolute bottom-3 right-4 text-[9px] font-bold text-white/20 pointer-events-none z-10 uppercase tracking-tighter">
                {pageNumber}
            </div>
        </div>
    );
}));

Page.displayName = 'Page';

export default Page;


