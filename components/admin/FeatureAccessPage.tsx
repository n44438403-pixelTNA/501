import React, { useState, useEffect } from 'react';
import { SystemSettings, AppFeature } from '../../types';
import { ALL_APP_FEATURES } from '../../constants';
import { Search, Save, Eye, EyeOff, Tag, Star, Lock, CheckCircle, RefreshCw, LayoutGrid, List } from 'lucide-react';

interface Props {
    settings: SystemSettings;
    onUpdateSettings: (s: SystemSettings) => void;
    onBack: () => void;
}

export const FeatureAccessPage: React.FC<Props> = ({ settings, onUpdateSettings, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'HIDDEN' | 'NEW' | 'UPDATED'>('ALL');
    const [localConfig, setLocalConfig] = useState<Record<string, any>>(settings.featureConfig || {});
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

    // Initialize config from settings if empty, but respect existing
    useEffect(() => {
        if (settings.featureConfig) {
            setLocalConfig(settings.featureConfig);
        }
    }, [settings.featureConfig]);

    const handleToggle = (id: string, field: 'visible' | 'isNew' | 'isUpdated') => {
        setLocalConfig(prev => {
            const current = prev[id] || {};
            return {
                ...prev,
                [id]: { ...current, [field]: current[field] !== undefined ? !current[field] : (field === 'visible' ? false : true) }
            };
        });
    };

    const handleTierChange = (id: string, tier: 'FREE' | 'BASIC' | 'ULTRA') => {
        setLocalConfig(prev => {
            const current = prev[id] || {};
            return {
                ...prev,
                [id]: { ...current, minTier: tier }
            };
        });
    };

    const saveChanges = () => {
        const updatedSettings = { ...settings, featureConfig: localConfig };
        onUpdateSettings(updatedSettings);
        alert("Feature configurations saved successfully!");
    };

    // Merge static list with local config state
    const mergedFeatures = ALL_APP_FEATURES.map(f => {
        const conf = localConfig[f.id] || {};
        return {
            ...f,
            visible: conf.visible !== false, // Default true
            isNew: conf.isNew || false,
            isUpdated: conf.isUpdated || false,
            minTier: conf.minTier || 'FREE'
        };
    });

    const filteredFeatures = mergedFeatures.filter(f => {
        const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;

        if (filter === 'HIDDEN') return !f.visible;
        if (filter === 'NEW') return f.isNew;
        if (filter === 'UPDATED') return f.isUpdated;
        return true;
    });

    return (
        <div className="bg-slate-50 min-h-screen p-6 animate-in fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 text-slate-600">
                        &larr;
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Feature Access Manager</h1>
                        <p className="text-xs text-slate-500 font-bold">{mergedFeatures.length} Features Detected</p>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setViewMode(viewMode === 'GRID' ? 'LIST' : 'GRID')}
                        className="p-3 bg-white text-slate-600 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50"
                    >
                        {viewMode === 'GRID' ? <List size={20} /> : <LayoutGrid size={20} />}
                    </button>
                    <button
                        onClick={saveChanges}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 flex items-center gap-2 flex-1 md:flex-none justify-center"
                    >
                        <Save size={20} /> Save Config
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search features..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    {['ALL', 'HIDDEN', 'NEW', 'UPDATED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${filter === f ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid/List View */}
            <div className={`grid ${viewMode === 'GRID' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                {filteredFeatures.map(feature => (
                    <div key={feature.id} className={`bg-white p-4 rounded-xl border-2 transition-all ${feature.visible ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-60 bg-slate-50'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">{feature.title}</h3>
                                <p className="text-[10px] text-slate-400 font-mono">{feature.id}</p>
                            </div>
                            <button
                                onClick={() => handleToggle(feature.id, 'visible')}
                                className={`p-2 rounded-lg transition-colors ${feature.visible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                title={feature.visible ? "Hide Feature" : "Show Feature"}
                            >
                                {feature.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>

                        {/* Controls */}
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleToggle(feature.id, 'isNew')}
                                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-1 ${feature.isNew ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-400 border-slate-200'}`}
                                >
                                    <Sparkles size={12} /> NEW
                                </button>
                                <button
                                    onClick={() => handleToggle(feature.id, 'isUpdated')}
                                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-1 ${feature.isUpdated ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-white text-slate-400 border-slate-200'}`}
                                >
                                    <RefreshCw size={12} /> UPDATED
                                </button>
                            </div>

                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Lock size={10} /> Minimum Tier</p>
                                <div className="flex gap-1">
                                    {['FREE', 'BASIC', 'ULTRA'].map((tier) => (
                                        <button
                                            key={tier}
                                            onClick={() => handleTierChange(feature.id, tier as any)}
                                            className={`flex-1 py-1 rounded text-[9px] font-black transition-colors ${
                                                feature.minTier === tier
                                                ? (tier === 'FREE' ? 'bg-green-500 text-white' : tier === 'BASIC' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white')
                                                : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-100'
                                            }`}
                                        >
                                            {tier}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
