import React, { forwardRef, memo, useState, useRef } from 'react';
import { Page as PdfPage } from 'react-pdf';
import LoadingSpinner from './LoadingSpinner';
import { motion, useAnimation } from 'framer-motion';

const Page = memo(forwardRef(({ pageNumber, width, height, folder, style, disableInternalZoom, ...props }, ref) => {
    // Guided view state (zoom)
    const [isZoomed, setIsZoomed] = useState(false);
    const controls = useAnimation();
    const containerRef = useRef(null);

    const handleDoubleTap = (e) => {
        if (disableInternalZoom) return;

        if (!isZoomed) {
            const rect = containerRef.current.getBoundingClientRect();
            const clientX = e.clientX ?? (e.changedTouches?.[0]?.clientX || rect.left + rect.width / 2);
            const clientY = e.clientY ?? (e.changedTouches?.[0]?.clientY || rect.top + rect.height / 2);

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            controls.start({
                scale: 1.8,
                originX: xPercent / 100,
                originY: yPercent / 100,
                transition: { type: 'spring', stiffness: 300, damping: 30 }
            });
            setIsZoomed(true);
        } else {
            controls.start({
                scale: 1,
                x: 0,
                y: 0,
                transition: { type: 'spring', stiffness: 300, damping: 30 }
            });
            setIsZoomed(false);
        }
    };

    return (
        <div
            ref={ref}
            className="bg-gray-900 overflow-hidden relative flex items-center justify-center shadow-lg"
            style={{
                ...style,
                ...(width ? { width } : {}),
                ...(height ? { height } : {})
            }}
            {...props}
        >
            {folder ? (
                <motion.div
                    ref={containerRef}
                    className="w-full h-full min-h-[50vh] flex items-center justify-center cursor-zoom-in touch-none"
                    onDoubleClick={handleDoubleTap}
                    animate={controls}
                    drag={isZoomed}
                    dragConstraints={containerRef}
                    dragElastic={0.1}
                >
                    <img
                        src={`${folder}/page.${pageNumber}.webp`}
                        alt={`Página ${pageNumber}`}
                        className="absolute inset-0 w-full h-full pointer-events-none block origin-center"
                        style={{ objectFit: (typeof window !== 'undefined' && window.innerWidth < 768) ? 'fill' : 'contain' }}
                        loading="lazy"
                    />
                </motion.div>
            ) : (
                <div className="w-full h-full flex items-center justify-center p-[1px] relative">
                    <PdfPage
                        pageNumber={pageNumber}
                        width={width ? width - 2 : undefined}
                        height={height ? height - 2 : undefined}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        devicePixelRatio={Math.min(window.devicePixelRatio || 1, 2)}
                        loading={
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                                <LoadingSpinner size={32} />
                            </div>
                        }
                        className="flex items-center justify-center !bg-transparent"
                    />
                </div>
            )}

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/50 pointer-events-none z-10 mix-blend-difference">
                {pageNumber}
            </div>
        </div>
    );
}));

Page.displayName = 'Page';

export default Page;

