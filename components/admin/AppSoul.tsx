import React, { useState, useEffect } from 'react';
import { SystemSettings } from '../../types';
import { ALL_FEATURES, Feature } from '../../utils/featureRegistry';
import { Save, CheckCircle, Settings, Shield, Star, Lock, Zap, BookOpen, Crown, BrainCircuit, Headphones, MessageSquare, Megaphone, Video, FileText } from 'lucide-react';

interface Props {
    settings: SystemSettings;
    onUpdateSettings: (s: SystemSettings) => void;
    onBack: () => void;
}

// Mapping of Feature IDs to the user's specific request list
const SOUL_FEATURES = [
    'QUICK_REVISION',
    'DEEP_DIVE',
    'PREMIUM_NOTES',
    'ADDITIONAL_NOTES',
    'VIDEO_ACCESS',
    'MCQ_FREE',
    'MCQ_PREMIUM',
    'AUDIO_LIBRARY',
    'REVISION_HUB_FREE',
    'REVISION_HUB_PREMIUM',
    'AI_STUDIO',
    'MY_ANALYSIS',
    'TOPIC_CONTENT',
    'REQUEST_CONTENT',
    'MS_RECOMMEND',
    'MS_OMR',
    'MS_AI_INSIGHTS',
    'MS_MISTAKES',
    'MS_ANALYSIS',
    'MS_OFFICIAL',
    'AI_CENTER',
    'AI_HUB_BANNER'
];

export const AppSoul: React.FC<Props> = ({ settings, onUpdateSettings, onBack }) => {
    const [localConfig, setLocalConfig] = useState<Record<string, any>>(settings.featureConfig || {});

    useEffect(() => {
        if (settings.featureConfig) {
            setLocalConfig(settings.featureConfig);
        }
    }, [settings.featureConfig]);

    const handleTierToggle = (id: string, tier: 'FREE' | 'BASIC' | 'ULTRA') => {
        setLocalConfig(prev => {
            const current = prev[id] || {};
            const currentTiers = current.allowedTiers || ['FREE', 'BASIC', 'ULTRA'];
            let newTiers;
            if (currentTiers.includes(tier)) {
                newTiers = currentTiers.filter((t: string) => t !== tier);
            } else {
                newTiers = [...currentTiers, tier];
            }
            return {
                ...prev,
                [id]: { ...current, allowedTiers: newTiers }
            };
        });
    };

    const handleLimitChange = (id: string, tier: 'free' | 'basic' | 'ultra', value: string) => {
        setLocalConfig(prev => {
            const current = prev[id] || {};
            const currentLimits = current.limits || {};
            const newLimits = {
                ...currentLimits,
                [tier]: value === '' ? undefined : Number(value)
            };
            if (value === '') delete newLimits[tier];
            return {
                ...prev,
                [id]: { ...current, limits: newLimits }
            };
        });
    };

    const handleCostChange = (id: string, cost: number) => {
        setLocalConfig(prev => {
            const current = prev[id] || {};
            return {
                ...prev,
                [id]: { ...current, creditCost: cost }
            };
        });
    };

    const handleLockToggle = (id: string) => {
        setLocalConfig(prev => {
            const current = prev[id] || {};
            const isVisible = current.visible !== false;
            return {
                ...prev,
                [id]: { ...current, visible: !isVisible }
            };
        });
    };

    const saveChanges = () => {
        const updatedSettings = {
            ...settings,
            featureConfig: localConfig
        };
        onUpdateSettings(updatedSettings);
        alert("App Soul Configurations Saved Successfully!");
    };

    const getIcon = (id: string) => {
        if (id.includes('MCQ')) return <CheckCircle size={24} className="text-green-500"/>;
        if (id.includes('NOTES') || id.includes('DEEP')) return <FileText size={24} className="text-blue-500"/>;
        if (id.includes('VIDEO')) return <Video size={24} className="text-red-500"/>;
        if (id.includes('AUDIO')) return <Headphones size={24} className="text-pink-500"/>;
        if (id.includes('AI') || id.includes('STUDIO')) return <BrainCircuit size={24} className="text-purple-500"/>;
        if (id.includes('REVISION')) return <Zap size={24} className="text-yellow-500"/>;
        if (id.includes('REQUEST')) return <Megaphone size={24} className="text-orange-500"/>;
        return <Star size={24} className="text-slate-500"/>;
    };

    // Filter relevant features
    const soulFeatures = ALL_FEATURES.filter(f => SOUL_FEATURES.includes(f.id));

    return (
        <div className="bg-slate-50 min-h-screen p-6 animate-in fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 text-slate-600">
                        &larr;
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
                            <Crown className="text-violet-600 fill-violet-200" /> App Soul
                        </h1>
                        <p className="text-slate-500 font-medium">Central Control for Rare & Core Features (90% Control)</p>
                    </div>
                </div>
                <button
                    onClick={saveChanges}
                    className="px-8 py-4 bg-violet-600 text-white font-bold rounded-2xl shadow-xl hover:bg-violet-700 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                >
                    <Save size={24} /> SAVE SOUL CONFIG
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {soulFeatures.map(feature => {
                    const conf = localConfig[feature.id] || {};
                    const isVisible = conf.visible !== false;
                    const allowedTiers = conf.allowedTiers || (feature.requiredSubscription === 'ULTRA' ? ['ULTRA'] : feature.requiredSubscription === 'BASIC' ? ['BASIC', 'ULTRA'] : ['FREE', 'BASIC', 'ULTRA']);
                    const cost = conf.creditCost !== undefined ? conf.creditCost : 0;

                    return (
                        <div key={feature.id} className={`bg-white rounded-2xl border-2 transition-all ${isVisible ? 'border-slate-200 shadow-lg' : 'border-red-200 bg-red-50/50'}`}>
                            {/* Card Header */}
                            <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        {getIcon(feature.id)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{feature.label}</h3>
                                        <p className="text-xs text-slate-400 font-mono">{feature.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleLockToggle(feature.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${isVisible ? 'bg-green-100 text-green-700' : 'bg-red-600 text-white shadow-md animate-pulse'}`}
                                >
                                    {isVisible ? <Lock size={12} className="opacity-50"/> : <Lock size={12} />}
                                    {isVisible ? 'UNLOCKED' : 'LOCKED'}
                                </button>
                            </div>

                            {/* Controls */}
                            <div className={`p-5 space-y-6 ${!isVisible ? 'opacity-50 pointer-events-none grayscale' : ''}`}>

                                {/* Access Tiers */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Allowed Plans</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['FREE', 'BASIC', 'ULTRA'].map(tier => {
                                            const isActive = allowedTiers.includes(tier);
                                            return (
                                                <button
                                                    key={tier}
                                                    onClick={() => handleTierToggle(feature.id, tier as any)}
                                                    className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                                        isActive
                                                        ? (tier === 'FREE' ? 'bg-green-50 border-green-200 text-green-700' : tier === 'BASIC' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-purple-50 border-purple-200 text-purple-700')
                                                        : 'bg-white border-slate-100 text-slate-300'
                                                    }`}
                                                >
                                                    {tier}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Limits Configuration */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Daily Usage Limits (Leave blank for ∞)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['free', 'basic', 'ultra'].map(tier => (
                                            <div key={tier} className="relative">
                                                <input
                                                    type="number"
                                                    placeholder="∞"
                                                    value={conf.limits?.[tier] ?? ''}
                                                    onChange={(e) => handleLimitChange(feature.id, tier as any, e.target.value)}
                                                    className="w-full pl-2 pr-2 py-2 text-xs font-bold border border-slate-200 rounded-lg text-center focus:ring-2 focus:ring-violet-500 outline-none"
                                                />
                                                <span className="absolute -top-2 left-2 text-[8px] bg-white px-1 text-slate-400 font-bold uppercase">{tier}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Credit Cost */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Cost Per Use (Credits)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-orange-500 font-bold">⚡</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={cost}
                                            onChange={(e) => handleCostChange(feature.id, Number(e.target.value))}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-700 focus:bg-white focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                            min="0"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
