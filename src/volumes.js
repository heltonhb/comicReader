/**
 * Registry of available HQ volumes.
 */
export const VOLUMES = [
    {
        id: 'vol-1',
        title: 'Primeira Guerra Mundial',
        file: '/primeiraguerra_final.pdf',
        folder: '/volumes/primeiraguerra',
        category: 'guerras',
    },
    {
        id: 'vol-2',
        title: 'Segunda Guerra Mundial',
        file: '/segundaguerra_final.pdf',
        folder: '/volumes/segundaguerra',
        category: 'guerras',
    },
    {
        id: 'vol-3',
        title: 'Stalingrado',
        file: '/stalingrado_final.pdf',
        folder: '/volumes/stalingrado',
        category: 'guerras',
    },
];

export const CATEGORIES = [
    { id: 'guerras', name: 'Guerras', icon: '⚔️', color: '#dc2626' },
    { id: 'acao', name: 'Ação', icon: '💥', color: '#f97316' },
    { id: 'aventura', name: 'Aventura', icon: '🗺️', color: '#22c55e' },
    { id: 'terror', name: 'Terror', icon: '👻', color: '#8b5cf6' },
    { id: 'comedia', name: 'Comédia', icon: '😂', color: '#eab308' },
    { id: 'drama', name: 'Drama', icon: '🎭', color: '#ec4899' },
    { id: 'ficcao', name: 'Ficção', icon: '🚀', color: '#0ea5e9' },
    { id: 'romance', name: 'Romance', icon: '💕', color: '#f43f5e' },
    { id: 'esporte', name: 'Esporte', icon: '⚽', color: '#14b8a6' },
    { id: 'manga', name: 'Mangá', icon: '🎌', color: '#f472b6' },
];

