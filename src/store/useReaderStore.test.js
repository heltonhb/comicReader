import { describe, it, expect, beforeEach } from 'vitest';
import { useReaderStore } from './useReaderStore';

describe('useReaderStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useReaderStore.getState().reset();
  });

  describe('Zoom', () => {
    it('should start with isZoomed as false', () => {
      const { isZoomed } = useReaderStore.getState();
      expect(isZoomed).toBe(false);
    });

    it('should set isZoomed to true', () => {
      const { setIsZoomed } = useReaderStore.getState();
      setIsZoomed(true);
      expect(useReaderStore.getState().isZoomed).toBe(true);
    });

    it('should toggle zoom state', () => {
      const { toggleZoom } = useReaderStore.getState();
      toggleZoom();
      expect(useReaderStore.getState().isZoomed).toBe(true);
      toggleZoom();
      expect(useReaderStore.getState().isZoomed).toBe(false);
    });

    it('should update zoomScale', () => {
      const { setZoomScale } = useReaderStore.getState();
      setZoomScale(2.5);
      expect(useReaderStore.getState().zoomScale).toBe(2.5);
    });
  });

  describe('Reading Mode', () => {
    it('should start with flipbook mode', () => {
      const { readingMode } = useReaderStore.getState();
      expect(readingMode).toBe('flipbook');
    });

    it('should set reading mode', () => {
      const { setReadingMode } = useReaderStore.getState();
      setReadingMode('webtoon');
      expect(useReaderStore.getState().readingMode).toBe('webtoon');
    });

    it('should toggle reading mode from flipbook to webtoon', () => {
      const { toggleReadingMode } = useReaderStore.getState();
      toggleReadingMode();
      const { readingMode, isZoomed } = useReaderStore.getState();
      expect(readingMode).toBe('webtoon');
      expect(isZoomed).toBe(false); // Zoom should reset on mode change
    });

    it('should toggle reading mode back to flipbook', () => {
      const { toggleReadingMode } = useReaderStore.getState();
      toggleReadingMode();
      toggleReadingMode();
      expect(useReaderStore.getState().readingMode).toBe('flipbook');
    });
  });

  describe('Thumbnails', () => {
    it('should start with thumbnails hidden', () => {
      const { showThumbnails } = useReaderStore.getState();
      expect(showThumbnails).toBe(false);
    });

    it('should toggle thumbnails', () => {
      const { toggleThumbnails } = useReaderStore.getState();
      toggleThumbnails();
      expect(useReaderStore.getState().showThumbnails).toBe(true);
      toggleThumbnails();
      expect(useReaderStore.getState().showThumbnails).toBe(false);
    });

    it('should set showThumbnails', () => {
      const { setShowThumbnails } = useReaderStore.getState();
      setShowThumbnails(true);
      expect(useReaderStore.getState().showThumbnails).toBe(true);
    });
  });

  describe('PDF Dimensions', () => {
    it('should have default PDF dimensions', () => {
      const { pdfDimensions } = useReaderStore.getState();
      expect(pdfDimensions.width).toBe(595);
      expect(pdfDimensions.height).toBe(842);
      expect(pdfDimensions.aspectRatio).toBe(0.707);
    });

    it('should set custom PDF dimensions', () => {
      const { setPdfDimensions } = useReaderStore.getState();
      setPdfDimensions({ width: 800, height: 1200, aspectRatio: 0.667 });
      const { pdfDimensions } = useReaderStore.getState();
      expect(pdfDimensions.width).toBe(800);
      expect(pdfDimensions.height).toBe(1200);
      expect(pdfDimensions.aspectRatio).toBe(0.667);
    });
  });

  describe('Reset', () => {
    it('should reset all state to defaults', () => {
      const { setIsZoomed, setZoomScale, setReadingMode, setShowThumbnails } = useReaderStore.getState();

      // Set some state
      setIsZoomed(true);
      setZoomScale(3);
      setReadingMode('webtoon');
      setShowThumbnails(true);

      // Reset
      useReaderStore.getState().reset();

      const state = useReaderStore.getState();
      expect(state.isZoomed).toBe(false);
      expect(state.zoomScale).toBe(1);
      expect(state.readingMode).toBe('flipbook');
      expect(state.showThumbnails).toBe(false);
    });
  });
});
