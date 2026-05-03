export interface Volume {
    id: string;
    title: string;
    author: string;
    folder?: string;
    coverImage?: string;
    numPages?: number;
    chapters?: Chapter[];
}

export interface Chapter {
    title: string;
    startPage: number;
}

export interface PdfDimensions {
    width: number;
    height: number;
    aspectRatio: number;
}

export interface BookDimensions {
    width: number;
    height: number;
    isMobile: boolean;
    isDesktopLandscape: boolean;
    singlePageWidth: number;
    singlePageHeight: number;
}

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export interface ReadingProgress {
    currentPage: number;
    totalPages: number;
    lastRead: string;
}

export type ReadingMode = 'flipbook' | 'webtoon';

export interface ReaderState {
    isZoomed: boolean;
    zoomScale: number;
    readingMode: ReadingMode;
    showThumbnails: boolean;
    pdfDimensions: PdfDimensions;
    setIsZoomed: (isZoomed: boolean) => void;
    setZoomScale: (scale: number) => void;
    toggleZoom: () => void;
    setReadingMode: (mode: ReadingMode) => void;
    toggleReadingMode: () => void;
    setShowThumbnails: (show: boolean) => void;
    toggleThumbnails: () => void;
    setPdfDimensions: (dimensions: PdfDimensions) => void;
    reset: () => void;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    initAuth: () => () => void;
    loginWithGoogle: () => Promise<void>;
    loginAnonymously: () => Promise<void>;
    logout: () => Promise<void>;
}