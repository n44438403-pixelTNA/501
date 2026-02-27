
import React, { useState, useEffect } from 'react';
import { SystemSettings } from '../../types';
import { NSTA_DEFAULT_FEATURES } from '../../constants';
import { Save, Lock, Zap, CheckCircle, Settings, Plus, Trash2, RotateCcw } from 'lucide-react';

interface Props {
    settings: SystemSettings;
    onUpdateSettings: (s: SystemSettings) => void;
    onBack: () => void;
}

export const NstaFeatureManager: React.FC<Props> = ({ settings, onUpdateSettings, onBack }) => {
    // Initialize config from settings (if exists) or merge with NSTA defaults
    const [config, setConfig] = useState<any[]>(() => {
        const storedConfig = settings.featureConfig || {};

        // Merge stored config with NSTA defaults to ensure all keys exist
        return NSTA_DEFAULT_FEATURES.map(def => {
            const stored = storedConfig[def.id];
            if (stored) {
                return { ...def, ...stored };
            }
            return def;
        });
    });

    const [activeCategory, setActiveCategory] = useState<string>('ALL');
    const categories = ['ALL', ...Array.from(new Set(config.map(f => f.category)))];

    // State for Adding New Feature
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFeature, setNewFeature] = useState({ id: '', label: '', category: 'CUSTOM' });

    // Save Changes
    const saveChanges = () => {
        // Convert array back to object map for storage
        const featureConfigMap: Record<string, any> = {};
        config.forEach(f => {
            featureConfigMap[f.id] = f;
        });

        const updatedSettings = {
            ...settings,
            featureConfig: featureConfigMap
        };
        onUpdateSettings(updatedSettings);
        alert("NSTA Configuration Saved Successfully!");
    };

    const handleReset = () => {
        if(confirm("Reset all features to NSTA Defaults? This will wipe custom limits.")) {
            setConfig(NSTA_DEFAULT_FEATURES);
        }
    };

    const toggleVisibility = (id: string) => {
        setConfig(prev => prev.map(f => f.id === id ? { ...f, visible: !f.visible } : f));
    };

    const handleTierToggle = (id: string, tier: 'FREE' | 'BASIC' | 'ULTRA') => {
        setConfig(prev => prev.map(f => {
            if (f.id !== id) return f;
            const currentTiers = f.allowedTiers || ['FREE', 'BASIC', 'ULTRA'];
            const newTiers = currentTiers.includes(tier)
                ? currentTiers.filter((t: string) => t !== tier)
                : [...currentTiers, tier];
            return { ...f, allowedTiers: newTiers };
        }));
    };

    const handleLimitChange = (id: string, tier: string, value: string) => {
        setConfig(prev => prev.map(f => {
            if (f.id !== id) return f;
            const limits = { ...f.limits, [tier.toLowerCase()]: value === '' ? undefined : Number(value) };
            if (value === '') delete limits[tier.toLowerCase()];
            return { ...f, limits };
        }));
    };

    const handleCostChange = (id: string, value: string) => {
        setConfig(prev => prev.map(f => f.id === id ? { ...f, creditCost: Number(value) } : f));
    };

    const handleAddFeature = () => {
        if (!newFeature.id || !newFeature.label) return alert("ID and Label required!");
        const newItem = {
            id: newFeature.id.toUpperCase().replace(/\s+/g, '_'),
            label: newFeature.label,
            category: newFeature.category,
            visible: true,
            allowedTiers: ['FREE', 'BASIC', 'ULTRA'],
            limits: {},
            creditCost: 0
        };
        setConfig([...config, newItem]);
        setShowAddModal(false);
        setNewFeature({ id: '', label: '', category: 'CUSTOM' });
    };

    const handleDeleteFeature = (id: string) => {
        if(confirm("Delete this feature control?")) {
            setConfig(prev => prev.filter(f => f.id !== id));
        }
    };

    const filteredConfig = activeCategory === 'ALL' ? config : config.filter(f => f.category === activeCategory);

    return (
        <div className="bg-slate-50 min-h-screen p-6 animate-in fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 text-slate-600">
                        &larr;
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            <Settings className="text-violet-600" /> NSTA Control Panel
                        </h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Master Feature Management</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleReset} className="px-4 py-2 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 flex items-center gap-2">
                        <RotateCcw size={16} /> Reset
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2">
                        <Plus size={16} /> Add Feature
                    </button>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                            activeCategory === cat ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredConfig.map((feature) => (
                    <div key={feature.id} className={`bg-white p-4 rounded-xl border-2 transition-all ${feature.visible ? 'border-slate-200 shadow-sm' : 'border-red-100 bg-red-50/30 grayscale'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{feature.category}</span>
                                    <h3 className="font-bold text-slate-800">{feature.label}</h3>
                                </div>
                                <p className="text-[10px] font-mono text-slate-400 mt-1">{feature.id}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleVisibility(feature.id)}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${feature.visible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                                >
                                    {feature.visible ? <CheckCircle size={12}/> : <Lock size={12}/>}
                                    {feature.visible ? 'ACTIVE' : 'LOCKED'}
                                </button>
                                <button onClick={() => handleDeleteFeature(feature.id)} className="p-1.5 text-slate-300 hover:text-red-500 rounded hover:bg-slate-50">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className={`grid grid-cols-4 gap-4 ${!feature.visible ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* Tiers */}
                            <div className="col-span-4 grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                {['FREE', 'BASIC', 'ULTRA'].map(tier => {
                                    const isAllowed = (feature.allowedTiers || ['FREE', 'BASIC', 'ULTRA']).includes(tier);
                                    return (
                                        <button
                                            key={tier}
                                            onClick={() => handleTierToggle(feature.id, tier as any)}
                                            className={`py-1 rounded text-[10px] font-bold border transition-all ${
                                                isAllowed
                                                ? (tier === 'FREE' ? 'bg-green-50 border-green-200 text-green-700' : tier === 'BASIC' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-purple-50 border-purple-200 text-purple-700')
                                                : 'bg-white border-slate-200 text-slate-300'
                                            }`}
                                        >
                                            {tier}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Limits Inputs */}
                            {['Free', 'Basic', 'Ultra'].map(tier => {
                                const isAllowed = (feature.allowedTiers || ['FREE', 'BASIC', 'ULTRA']).includes(tier.toUpperCase());
                                const limitVal = feature.limits?.[tier.toLowerCase()] ?? '';

                                return (
                                    <div key={tier} className="flex flex-col gap-1">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase text-center">{tier} Limit</label>
                                        <input
                                            type="number"
                                            placeholder={isAllowed ? "∞" : "Locked"}
                                            disabled={!isAllowed}
                                            value={limitVal}
                                            onChange={(e) => handleLimitChange(feature.id, tier, e.target.value)}
                                            className={`w-full p-2 text-xs font-bold text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${!isAllowed ? 'bg-slate-100 cursor-not-allowed' : 'bg-white border-slate-200'}`}
                                        />
                                    </div>
                                );
                            })}

                            {/* Cost */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-bold text-orange-400 uppercase text-center">Cost (Cr)</label>
                                <div className="relative">
                                    <Zap size={10} className="absolute top-2.5 left-2 text-orange-500" />
                                    <input
                                        type="number"
                                        value={feature.creditCost || 0}
                                        onChange={(e) => handleCostChange(feature.id, e.target.value)}
                                        className="w-full p-2 pl-5 text-xs font-bold text-center border border-orange-200 bg-orange-50 rounded-lg text-orange-700 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* STICKY SAVE BUTTON - ADJUSTED Z-INDEX AND POSITION */}
            <div className="fixed bottom-10 right-6 z-[1000] pb-safe">
                <button
                    onClick={saveChanges}
                    className="px-8 py-4 bg-green-600 text-white font-black rounded-full shadow-2xl hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-3 border-4 border-white animate-bounce-slow"
                >
                    <Save size={24} /> SAVE CHANGES
                </button>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <h3 className="font-black text-xl text-slate-800 mb-4">Add New Feature</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                <input
                                    type="text"
                                    value={newFeature.category}
                                    onChange={(e) => setNewFeature({...newFeature, category: e.target.value})}
                                    className="w-full p-2 border rounded-lg mt-1 font-bold"
                                    list="categories"
                                />
                                <datalist id="categories">
                                    {categories.map(c => <option key={c} value={c} />)}
                                </datalist>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Feature ID (Unique)</label>
                                <input
                                    type="text"
                                    value={newFeature.id}
                                    onChange={(e) => setNewFeature({...newFeature, id: e.target.value})}
                                    className="w-full p-2 border rounded-lg mt-1 font-mono uppercase"
                                    placeholder="MY_NEW_FEATURE"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Label</label>
                                <input
                                    type="text"
                                    value={newFeature.label}
                                    onChange={(e) => setNewFeature({...newFeature, label: e.target.value})}
                                    className="w-full p-2 border rounded-lg mt-1"
                                    placeholder="My Feature Name"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg">Cancel</button>
                            <button onClick={handleAddFeature} className="flex-1 py-2 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700">Add Feature</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
