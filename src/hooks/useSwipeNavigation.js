import { useRef, useCallback } from 'react';

export const useSwipeNavigation = ({ onPrev, onNext, disabled }) => {
    const touchStartRef = useRef(null);

    const handleTouchStart = useCallback((e) => {
        if (e.touches.length !== 1 || disabled) return;
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            time: Date.now()
        };
    }, [disabled]);

    const handleTouchEnd = useCallback((e) => {
        if (!touchStartRef.current || disabled) return;

        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartRef.current.x;
        const dy = touch.clientY - touchStartRef.current.y;
        const dt = Date.now() - touchStartRef.current.time;

        touchStartRef.current = null;

        // Ignore swipes that take longer than 600ms
        if (dt > 600) return;

        // Threshold of 50px for swipe action
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                // Swiped right -> go to previous
                onPrev();
            } else {
                // Swiped left -> go to next
                onNext();
            }
        }
    }, [onPrev, onNext, disabled]);

    return { handleTouchStart, handleTouchEnd };
};
