import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { VOLUMES, CATEGORIES } from '../volumes';
import { useFullscreen } from '../hooks/useReaderHooks';
import { trackEvent } from '../analytics';
import { BookOpen, Grid, List } from 'lucide-react';

const Library = () => {
    const navigate = useNavigate();
    const { enterFullscreen } = useFullscreen();
    const [activeCategory, setActiveCategory] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const filteredVolumes = activeCategory 
        ? VOLUMES.filter(v => v.category === activeCategory)
        : VOLUMES;

    const volumesByCategory = CATEGORIES.map(cat => ({
        ...cat,
        volumes: VOLUMES.filter(v => v.category === cat.id)
    })).filter(cat => cat.volumes.length > 0);

    const handleSelect = (volume) => {
        if (volume?.id && volume?.title) {
            trackEvent('select_volume', { volume_id: volume.id, title: volume.title });
        }
        if (volume?.id) {
            enterFullscreen();
            setTimeout(() => {
                navigate(`/read/${volume.id}`);
            }, 150);
        }
    };

    const handleExit = async () => {
        if (document.fullscreenElement) {
            try { await document.exitFullscreen(); } catch (err) { console.error(err); }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExit}
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            ← Voltar
                        </button>
                        <h1 className="text-xl font-bold text-[#D4AF37]">Biblioteca</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-white/40 hover:text-white'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-white/40 hover:text-white'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="max-w-7xl mx-auto px-4 pb-4 flex gap-2 flex-wrap">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                            activeCategory === null 
                                ? 'bg-[#D4AF37] text-gray-900' 
                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                    >
                        Todos ({VOLUMES.length})
                    </button>
                    {volumesByCategory.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                activeCategory === cat.id 
                                    ? 'bg-[#D4AF37] text-gray-900' 
                                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                            }`}
                        >
                            {cat.icon} {cat.name} ({cat.volumes.length})
                        </button>
                    ))}
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {activeCategory ? (
                    /* Single Category View */
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">{CATEGORIES.find(c => c.id === activeCategory)?.icon}</span>
                            <h2 className="text-2xl font-bold">{CATEGORIES.find(c => c.id === activeCategory)?.name}</h2>
                        </div>
                        <VolumeGrid volumes={filteredVolumes} viewMode={viewMode} onSelect={handleSelect} />
                    </div>
                ) : (
                    /* All Categories */
                    <div className="space-y-12">
                        {volumesByCategory.map(cat => (
                            <section key={cat.id}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{cat.icon}</span>
                                    <h2 className="text-xl font-bold text-white/80">{cat.name}</h2>
                                    <span className="text-sm text-white/40">({cat.volumes.length})</span>
                                </div>
                                <VolumeGrid volumes={cat.volumes} viewMode={viewMode} onSelect={handleSelect} />
                            </section>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const VolumeGrid = ({ volumes, viewMode, onSelect }) => {
    if (viewMode === 'list') {
        return (
            <div className="space-y-2">
                {volumes.map((volume, idx) => (
                    <motion.div
                        key={volume.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => onSelect(volume)}
                        className="flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-lg p-3 cursor-pointer transition-colors border border-white/5 hover:border-[#D4AF37]/30"
                    >
                        <div className="w-12 h-16 bg-gray-800 rounded flex items-center justify-center text-[#D4AF37] font-bold">
                            {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{volume.title}</h3>
                            <p className="text-sm text-white/50">{volume.author || 'Autor desconhecido'}</p>
                        </div>
                        <BookOpen className="text-[#D4AF37] opacity-50" size={20} />
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {volumes.map((volume, idx) => (
                <motion.div
                    key={volume.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => onSelect(volume)}
                    className="group cursor-pointer"
                >
                    <div className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden relative border border-white/10 group-hover:border-[#D4AF37]/50 transition-all group-hover:shadow-lg group-hover:shadow-[#D4AF37]/20">
                        <div className="absolute inset-0 flex items-center justify-center text-white/20">
                            <BookOpen size={48} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="font-semibold text-sm truncate">{volume.title}</h3>
                            <p className="text-xs text-white/50 truncate">{volume.author || 'Autor'}</p>
                        </div>
                        {volume.category && (
                            <div className="absolute top-2 right-2">
                                <span className="text-lg">{CATEGORIES.find(c => c.id === volume.category)?.icon}</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default Library;