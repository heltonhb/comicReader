import React from 'react';
import { Document, Page as PdfPage, pdfjs } from 'react-pdf';

// Configure worker globally to avoid reload/freeze issues for lazy-loaded PDF components
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfThumbnail = React.memo(({ file, folder }) => {
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
                <Document
                    file={file}
                    className="w-full h-full"
                    loading={<div className="w-full h-full bg-white/5 animate-pulse" />}
                >
                    <PdfPage
                        pageNumber={1}
                        width={320}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="w-full h-full object-cover"
                    />
                </Document>
            )}
            {/* Subtle gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
        </div>
    );
});

export default PdfThumbnail;
