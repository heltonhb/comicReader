import { useRef, useCallback } from 'react';

export const usePageTurnSound = () => {
    const audioContextRef = useRef(null);

    const playPageTurnSound = useCallback(() => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            // Initialize context if it doesn't exist
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext();
            }

            const ctx = audioContextRef.current;

            // Resume context if suspended
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const t = ctx.currentTime;

            // LAYER 1: The "Whoosh" (Paper friction/movement)
            const bufferSize = ctx.sampleRate * 0.4;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.Q.value = 0.7;
            filter.frequency.setValueAtTime(400, t);
            // Sweep frequency up to simulate page speed increasing then decreasing
            filter.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
            filter.frequency.exponentialRampToValueAtTime(300, t + 0.3);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0, t);
            noiseGain.gain.linearRampToValueAtTime(0.4, t + 0.05); // Attack
            noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); // Decay

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(ctx.destination);

            noise.start(t);
            noise.stop(t + 0.4);

            // LAYER 2: The "Snap/Crackle" (Paper separating)
            const snapOsc = ctx.createOscillator();
            snapOsc.type = 'triangle';
            // Randomize pitch slightly for variation
            snapOsc.frequency.setValueAtTime(1500 + Math.random() * 500, t);

            const snapGain = ctx.createGain();
            snapGain.gain.setValueAtTime(0, t);
            snapGain.gain.linearRampToValueAtTime(0.05, t + 0.02);
            snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

            snapOsc.connect(snapGain);
            snapGain.connect(ctx.destination);

            snapOsc.start(t);
            snapOsc.stop(t + 0.1);

        } catch (e) {
            console.error("Audio play failed", e);
        }
    }, []);

    return { playPageTurnSound };
};
