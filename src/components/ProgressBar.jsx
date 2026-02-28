import React from 'react';

const ProgressBar = ({ currentPage, numPages, isMobile, showControls }) => {
    if (!numPages) return null;

    const displayPage = isMobile
        ? currentPage + 1
        : Math.min(currentPage + 2, numPages);
    const progressPercent = (displayPage / numPages) * 100;

    return (
        <div className={`absolute bottom-0 left-0 right-0 z-40 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-full px-6 pb-2">
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary/70 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-[11px] text-white/50 font-medium whitespace-nowrap tabular-nums">
                        {displayPage} / {numPages}
                    </span>
                </div>
            </div>
            <div className="text-center pb-4">
                <span className="text-white/30 text-[10px] uppercase tracking-widest font-medium pointer-events-none">
                    {isMobile
                        ? 'Toque nas laterais para virar • Belisque para zoom'
                        : 'Clique nas laterais ou use ← → para virar • F para tela cheia'}
                </span>
            </div>
        </div>
    );
};

export default ProgressBar;
