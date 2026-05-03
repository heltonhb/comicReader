import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock imports BEFORE any component imports
vi.mock('../hooks/useReaderHooks', () => ({
    useFullscreen: () => ({
        enterFullscreen: vi.fn(),
    }),
}));

vi.mock('../analytics', () => ({
    initAnalytics: vi.fn(),
    trackEvent: vi.fn(),
}));

vi.mock('../volumes', () => ({
    VOLUMES: [
        { id: 'vol-1', title: 'Primeira Guerra Mundial', folder: '/volumes/primeiraguerra' },
        { id: 'vol-2', title: 'Segunda Guerra Mundial', folder: '/volumes/segundaguerra' },
        { id: 'vol-3', title: 'Stalingrado', folder: '/volumes/stalingrado' },
    ],
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VolumeSelector from './VolumeSelector';

// Wrapper component for testing with router
const TestWrapper = ({ children }) => (
    <BrowserRouter>{children}</BrowserRouter>
);

describe('VolumeSelector', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should render without crashing', () => {
        render(<VolumeSelector />, { wrapper: TestWrapper });
        expect(screen.getByText('Primeira Guerra Mundial')).toBeInTheDocument();
    });

    it('should render volumes', () => {
        render(<VolumeSelector />, { wrapper: TestWrapper });
        expect(screen.getByText('Primeira Guerra Mundial')).toBeInTheDocument();
    });

    it('should render clickable volumes', () => {
        render(<VolumeSelector />, { wrapper: TestWrapper });

        const volumeButtons = screen.getAllByRole('button');
        expect(volumeButtons.length).toBeGreaterThan(0);
    });
});