import { useState, useEffect } from 'react';
import type { Volume } from '../types';

interface UseVolumesReturn {
    volumes: Volume[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const VOLUMES_API_URL = '/volumes.json';

export const useVolumes = (): UseVolumesReturn => {
    const [volumes, setVolumes] = useState<Volume[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVolumes = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(VOLUMES_API_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch volumes: ${response.status}`);
            }
            const data = await response.json();
            setVolumes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolumes();
    }, []);

    return {
        volumes,
        loading,
        error,
        refetch: fetchVolumes,
    };
};