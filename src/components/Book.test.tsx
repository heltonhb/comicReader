import { describe, it, expect, vi, beforeEach } from 'vitest';

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Book from './Book';

vi.mock('../hooks/useBookController', () => ({
    useBookController: () => ({
        bookRef: { current: null },
        numPages: 10,
        error: null,
        currentPage: 0,
        isLightBackground: false,
        isZoomed: false,
        nextFlip: vi.fn().mockReturnValue(true),
        prevFlip: vi.fn(),
        goToPage: vi.fn(),
        handleTouchStart: vi.fn(),
        handleTouchEnd: vi.fn(),
        onFlip: vi.fn(),
        onChangeState: vi.fn(),
        setCurrentPage: vi.fn(),
    }),
}));

vi.mock('../store/useReaderStore', () => ({
    useReaderStore: () => ({
        pdfDimensions: { width: 595, height: 842, aspectRatio: 0.707 },
        readingMode: 'flipbook',
        isZoomed: false,
    }),
}));

vi.mock('../hooks/useReaderHooks', () => ({
    useBookDimensions: () => ({
        containerRef: { current: null },
        dimensions: {
            width: 800,
            height: 600,
            isMobile: false,
            isDesktopLandscape: true,
            singlePageWidth: 400,
            singlePageHeight: 600,
        },
        singlePageWidth: 400,
        singlePageHeight: 600,
    }),
    useAutoHideControls: () => ({
        showControls: true,
        resetTimeout: vi.fn(),
    }),
    useFullscreen: () => ({
        isFullscreen: false,
        toggleFullScreen: vi.fn(),
        enterFullscreen: vi.fn(),
    }),
}));

const mockVolume = {
    id: 'test-volume',
    title: 'Test Volume',
    author: 'Test Author',
    folder: '/volumes/test',
};

describe('Book', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <Book volume={mockVolume} onBack={vi.fn()} />
            </BrowserRouter>
        );
    });

    it('renders with mocked hooks', () => {
        render(
            <BrowserRouter>
                <Book volume={mockVolume} onBack={vi.fn()} />
            </BrowserRouter>
        );
        // Book renders without error when hooks are mocked
    });
});