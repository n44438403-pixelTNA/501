import React, { useState, useEffect } from 'react';
import { SystemSettings, FeatureConfig } from '../../types';
import { Save, Plus, Trash2, Edit2, Lock, Unlock, Eye, EyeOff, LayoutList } from 'lucide-react';

interface Props {
    settings: SystemSettings;
    onUpdateSettings: (s: SystemSettings) => void;
    onBack: () => void;
}

interface FeatureItem {
    category: string;
    key: string;
    label: string;
    free: string;
    basic: string;
    ultra: string;
}

const DEFAULT_FEATURES: FeatureItem[] = [
    { category: '📑 NOTES', key: 'QUICK_REVISION', label: 'Quick Revision', free: '✅ 2 Topics', basic: '✅ Unlimited', ultra: '✅ Unlimited' },
    { category: '📑 NOTES', key: 'DEEP_DIVE', label: 'Deep Dive Notes', free: '❌ Locked', basic: '✅ Full Access', ultra: '✅ Full Access' },
    { category: '📑 NOTES', key: 'PREMIUM_NOTES', label: 'Premium Notes', free: '❌ Locked', basic: '👁️ View Only', ultra: '📥 Download' },
    { category: '📑 NOTES', key: 'ADDITIONAL_NOTES', label: 'Additional Notes', free: '✅ Basic', basic: '✅ Full Access', ultra: '✅ Full Access' },
    { category: '🎬 VIDEO', key: 'VIDEO_ACCESS', label: 'Video Lectures', free: '🔒 Demo', basic: '✅ All Classes', ultra: '✅ All Classes' },
    { category: '🎧 AUDIO', key: 'AUDIO_LIBRARY', label: 'Audio Library', free: '❌ Locked', basic: '❌ Locked', ultra: '✅ Premium' },
    { category: '📝 MCQ', key: 'FREE_PRACTICE', label: 'Free Practice', free: '✅ 50 Daily', basic: '✅ Unlimited', ultra: '✅ Unlimited' },
    { category: '📝 MCQ', key: 'PREMIUM_TEST', label: 'Premium Test', free: '❌ Locked', basic: '✅ Topic-wise', ultra: '✅ AI Adaptive' },
    { category: '🔄 REVISION', key: 'REVISION_HUB', label: 'Revision Hub', free: '❌ Locked', basic: '⚠️ 1 Day Data', ultra: '✅ 30-Day Mastery' },
    { category: '🤖 AI HUB', key: 'AI_HUB_CONTROL', label: 'AI Hub Control', free: '❌ Locked', basic: '🔒 5 Chats/Day', ultra: '✅ Unlimited Turbo' },
];

export const AdminFeatureControlPanel: React.FC<Props> = ({ settings, onUpdateSettings, onBack }) => {
    const [features, setFeatures] = useState<FeatureItem[]>(DEFAULT_FEATURES);
    const [config, setConfig] = useState<Record<string, any>>(settings.featureConfig || {});
    const [editingItem, setEditingItem] = useState<FeatureItem | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Initialize config if missing
    useEffect(() => {
        if (!settings.featureConfig) {
            const initialConfig: Record<string, any> = {};
            DEFAULT_FEATURES.forEach(f => {
                initialConfig[f.key] = {
                    visible: true,
                    allowedTiers: ['FREE', 'BASIC', 'ULTRA'], // Default all allowed, controlled by text
                    limits: {},
                    creditCost: 0
                };
            });
            setConfig(initialConfig);
        } else {
            setConfig(settings.featureConfig);
        }

        // Load custom features if stored in settings (optional future expansion)
        // For now, we stick to the requested hardcoded list as base
    }, [settings.featureConfig]);

    const handleSave = () => {
        const updatedSettings = {
            ...settings,
            featureConfig: config,
            // We can also store the custom feature list definition if we want dynamic rows
            customFeatureList: features
        };
        onUpdateSettings(updatedSettings);
        alert("Feature Control Updated!");
    };

    const toggleLock = (key: string) => {
        setConfig(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                visible: !prev[key]?.visible
            }
        }));
    };

    const updateFeature = (item: FeatureItem) => {
        setFeatures(prev => prev.map(f => f.key === item.key ? item : f));
        setEditingItem(null);
    };

    const addFeature = (item: FeatureItem) => {
        setFeatures([...features, item]);
        setConfig(prev => ({
            ...prev,
            [item.key]: { visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'] }
        }));
        setIsAdding(false);
    };

    const deleteFeature = (key: string) => {
        if(confirm("Delete this feature row?")) {
            setFeatures(prev => prev.filter(f => f.key !== key));
            // We don't delete config to preserve data, or we could
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-6 animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100">
                        &larr;
                    </button>
                    <h1 className="text-2xl font-black text-slate-800">Unified Feature Control</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2">
                        <Plus size={18} /> Add Row
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 flex items-center gap-2 shadow-lg">
                        <Save size={18} /> Save All
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="p-4">Category</th>
                            <th className="p-4">Feature Key</th>
                            <th className="p-4">Label</th>
                            <th className="p-4 bg-green-50 text-green-700">Free</th>
                            <th className="p-4 bg-blue-50 text-blue-700">Basic</th>
                            <th className="p-4 bg-purple-50 text-purple-700">Ultra</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {features.map((f) => {
                            const isLocked = config[f.key]?.visible === false;
                            return (
                                <tr key={f.key} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-600">{f.category}</td>
                                    <td className="p-4 font-mono text-xs text-slate-400">{f.key}</td>
                                    <td className="p-4 font-bold text-slate-800">{f.label}</td>
                                    <td className="p-4 text-green-700 font-medium bg-green-50/30">{f.free}</td>
                                    <td className="p-4 text-blue-700 font-medium bg-blue-50/30">{f.basic}</td>
                                    <td className="p-4 text-purple-700 font-medium bg-purple-50/30">{f.ultra}</td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => toggleLock(f.key)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 mx-auto transition-colors ${isLocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                                        >
                                            {isLocked ? <Lock size={12}/> : <Unlock size={12}/>}
                                            {isLocked ? 'LOCKED' : 'ACTIVE'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => setEditingItem(f)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => deleteFeature(f.key)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* EDIT/ADD MODAL */}
            {(editingItem || isAdding) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-black text-slate-800 mb-4">{isAdding ? 'Add New Feature' : 'Edit Feature'}</h3>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                    <input
                                        defaultValue={editingItem?.category}
                                        id="edit-category"
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="e.g. 📑 NOTES"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Key (Unique)</label>
                                    <input
                                        defaultValue={editingItem?.key}
                                        id="edit-key"
                                        className="w-full p-2 border rounded-lg font-mono"
                                        disabled={!!editingItem && !isAdding}
                                        placeholder="FEATURE_KEY"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Label</label>
                                <input
                                    defaultValue={editingItem?.label}
                                    id="edit-label"
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Display Name"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-green-600 uppercase">Free Text</label>
                                    <input
                                        defaultValue={editingItem?.free}
                                        id="edit-free"
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="e.g. ❌ Locked"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-blue-600 uppercase">Basic Text</label>
                                    <input
                                        defaultValue={editingItem?.basic}
                                        id="edit-basic"
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="e.g. ✅ Full"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-purple-600 uppercase">Ultra Text</label>
                                    <input
                                        defaultValue={editingItem?.ultra}
                                        id="edit-ultra"
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="e.g. ✅ Full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setEditingItem(null); setIsAdding(false); }}
                                className="flex-1 py-3 text-slate-500 font-bold bg-slate-100 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const newItem: FeatureItem = {
                                        category: (document.getElementById('edit-category') as HTMLInputElement).value,
                                        key: (document.getElementById('edit-key') as HTMLInputElement).value,
                                        label: (document.getElementById('edit-label') as HTMLInputElement).value,
                                        free: (document.getElementById('edit-free') as HTMLInputElement).value,
                                        basic: (document.getElementById('edit-basic') as HTMLInputElement).value,
                                        ultra: (document.getElementById('edit-ultra') as HTMLInputElement).value,
                                    };
                                    if(isAdding) addFeature(newItem);
                                    else updateFeature(newItem);
                                }}
                                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
