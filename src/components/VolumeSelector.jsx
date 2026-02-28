import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { VOLUMES } from '../volumes';
import { useFullscreen } from '../hooks/useReaderHooks';
import GoldCarousel from './GoldCarousel';

const VolumeSelector = () => {
    const navigate = useNavigate();
    const { enterFullscreen } = useFullscreen();
    const [activeIndex, setActiveIndex] = useState(0);

    // Restore active index
    useEffect(() => {
        try {
            const savedId = localStorage.getItem('hq-carousel-active-id');
            const index = VOLUMES.findIndex(v => v.id === savedId);
            if (index >= 0) setTimeout(() => setActiveIndex(index), 0);
        } catch { /* empty */ }
    }, []);

    useEffect(() => {
        try {
            const currentVolume = VOLUMES[activeIndex];
            if (currentVolume) localStorage.setItem('hq-carousel-active-id', currentVolume.id);
        } catch { /* empty */ }
    }, [activeIndex]);

    const handleSelect = useCallback((volume) => {
        enterFullscreen();
        setTimeout(() => {
            navigate(`/read/${volume.id}`);
        }, 150);
    }, [navigate, enterFullscreen]);

    // Handle Exit
    const handleExit = async () => {
        if (document.fullscreenElement) {
            try { await document.exitFullscreen(); } catch (err) { console.error(err); }
        }
        try { window.close(); } catch (e) { console.log('Cannot close window', e); }
    };

    return (
        <GoldCarousel
            volumes={VOLUMES}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onSelect={handleSelect}
            onClose={handleExit}
        />
    );
};

export default VolumeSelector;
