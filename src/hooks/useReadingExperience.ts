import { useBookDimensions } from './useReaderHooks';
import { useAutoHideControls } from './useReaderHooks';
import { useFullscreen } from './useReaderHooks';
import { useKeyboardNav } from './useReaderHooks';
import { useReadingProgress } from './useReaderHooks';
import { usePageTurnSound } from './usePageTurnSound';
import { useSwipeNavigation } from './useSwipeNavigation';
import { useReaderStore } from '../store/useReaderStore';
import type { PdfDimensions, Volume } from '../types';

interface UseReadingExperienceOptions {
    volume: Volume;
    containerRef: React.RefObject<HTMLElement>;
}

interface UseReadingExperienceReturn {
    // Dimensions
    dimensions: ReturnType<typeof useBookDimensions>['dimensions'];
    singlePageWidth: number;
    singlePageHeight: number;

    // Controls visibility
    showControls: boolean;

    // Fullscreen
    isFullscreen: boolean;
    toggleFullScreen: () => void;
    enterFullscreen: () => void;

    // Navigation
    nextFlip: () => boolean;
    prevFlip: () => void;
    goToPage: (pageIndex: number) => void;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchEnd: (e: React.TouchEvent) => void;

    // Keyboard
    onEscapeZoom: () => void;
    onToggleFullscreen: () => void;

    // Progress
    currentPage: number;
    setCurrentPage: (page: number) => void;
    hasRestored: boolean;

    // Audio
    playPageTurnSound: () => void;

    // State
    isZoomed: boolean;
    readingMode: 'flipbook' | 'webtoon';
}

export const useReadingExperience = (
    volume: Volume,
    containerRef: React.RefObject<HTMLElement>
): UseReadingExperienceReturn => {
    const { pdfDimensions, isZoomed, readingMode } = useReaderStore();

    const { dimensions, singlePageWidth, singlePageHeight } = useBookDimensions(pdfDimensions);
    const { showControls } = useAutoHideControls(3000);
    const { isFullscreen, toggleFullScreen, enterFullscreen } = useFullscreen();
    const { currentPage, setCurrentPage, hasRestored } = useReadingProgress(volume.id);
    const { playPageTurnSound } = usePageTurnSound();

    // Navigation functions (these would come from useBookController)
    const nextFlip = () => true; // Placeholder - delegated to useBookController
    const prevFlip = () => {};
    const goToPage = (pageIndex: number) => setCurrentPage(pageIndex);

    const { handleTouchStart, handleTouchEnd } = useSwipeNavigation({
        onPrev: prevFlip,
        onNext: nextFlip,
        disabled: isZoomed
    });

    useKeyboardNav({
        enabled: readingMode === 'flipbook',
        onPrev: prevFlip,
        onNext: nextFlip,
        onEscapeZoom: () => {},
        onToggleFullscreen: toggleFullScreen,
    });

    return {
        dimensions,
        singlePageWidth,
        singlePageHeight,
        showControls,
        isFullscreen,
        toggleFullScreen,
        enterFullscreen,
        nextFlip,
        prevFlip,
        goToPage,
        handleTouchStart,
        handleTouchEnd,
        onEscapeZoom: () => {},
        onToggleFullscreen: toggleFullScreen,
        currentPage,
        setCurrentPage,
        hasRestored,
        playPageTurnSound,
        isZoomed,
        readingMode,
    };
};