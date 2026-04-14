import { useCallback } from 'react';
import { useReaderStore } from '../store/useReaderStore';

/**
 * Hook to manage zoom state coordination between react-zoom-pan-pinch
 * and the reader store. Prevents swipe navigation during zoom.
 */
export function usePinchZoom() {
    const { setIsZoomed } = useReaderStore();

    const onZoomStart = useCallback(() => {
        // Will be called by TransformWrapper onZoomStart
    }, []);

    const onTransformed = useCallback((ref, state) => {
        const isCurrentlyZoomed = state.scale > 1.05; // Small threshold to avoid float issues
        setIsZoomed(isCurrentlyZoomed);
    }, [setIsZoomed]);

    const onZoomStop = useCallback((ref, event) => {
        const isCurrentlyZoomed = ref.state.scale > 1.05;
        setIsZoomed(isCurrentlyZoomed);
    }, [setIsZoomed]);

    return {
        onZoomStart,
        onTransformed,
        onZoomStop,
    };
}
