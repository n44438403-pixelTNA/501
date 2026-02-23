import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Shield, Info, CheckCircle, XCircle, LayoutGrid, BrainCircuit, Gamepad2, BarChart3, Settings, BookOpen } from 'lucide-react';
import { SystemSettings } from '../../types';
import { ALL_FEATURES, FeatureGroup, AppFeatureDef } from '../../utils/featureRegistry';

interface Props {
    settings: SystemSettings;
    onUpdateSettings: (s: SystemSettings) => void;
    onBack: () => void;
}

export const FeatureAccessPage: React.FC<Props> = ({ settings, onUpdateSettings, onBack }) => {
    const [activeGroup, setActiveGroup] = useState<FeatureGroup>('CORE');
    const [localFeatures, setLocalFeatures] = useState<string[]>(settings.hiddenFeatures || []);
    const [hasChanges, setHasChanges] = useState(false);

    // Sync with settings on mount
    useEffect(() => {
        setLocalFeatures(settings.hiddenFeatures || []);
    }, [settings.hiddenFeatures]);

    const handleToggle = (featureId: string) => {
        const isHidden = localFeatures.includes(featureId);
        let newHidden;
        if (isHidden) {
            newHidden = localFeatures.filter(id => id !== featureId); // Unhide (Enable)
        } else {
            newHidden = [...localFeatures, featureId]; // Hide (Disable)
        }
        setLocalFeatures(newHidden);
        setHasChanges(true);
    };

    const handleSave = () => {
        onUpdateSettings({
            ...settings,
            hiddenFeatures: localFeatures
        });
        setHasChanges(false);
        alert("Feature Visibility Updated!");
    };

    const getGroupIcon = (group: FeatureGroup) => {
        switch (group) {
            case 'CORE': return <BookOpen size={18} />;
            case 'AI': return <BrainCircuit size={18} />;
            case 'GAME': return <Gamepad2 size={18} />;
            case 'ANALYTICS': return <BarChart3 size={18} />;
            case 'ADMIN': return <Shield size={18} />;
            default: return <Settings size={18} />;
        }
    };

    const renderFeatureCard = (feature: AppFeatureDef) => {
        const isEnabled = !localFeatures.includes(feature.id);

        return (
            <div key={feature.id} className={`p-4 rounded-xl border-2 transition-all ${isEnabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-75'}`}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className={`font-bold text-sm ${isEnabled ? 'text-slate-800' : 'text-slate-500'}`}>{feature.label}</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{feature.id}</p>
                    </div>
                    <button
                        onClick={() => handleToggle(feature.id)}
                        className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${isEnabled ? 'bg-green-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        feature.requiredSubscription === 'FREE' ? 'bg-green-50 text-green-700 border-green-100' :
                        feature.requiredSubscription === 'BASIC' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                        {feature.requiredSubscription}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                        Level {feature.surfaceLevel}
                    </span>
                </div>

                {feature.description && (
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        {feature.description}
                    </p>
                )}
            </div>
        );
    };

    const groups: FeatureGroup[] = ['CORE', 'CONTENT', 'REVISION', 'ANALYTICS', 'AI', 'GAME', 'ADVANCED'];

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-slate-200 sticky top-0 z-20 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <LayoutGrid className="text-indigo-600" size={20} /> Feature Governance
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">Control app features visibility and access.</p>
                    </div>
                </div>
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 animate-in fade-in slide-in-from-right-4"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                )}
            </div>

            <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0 space-y-2 sticky top-24">
                    {groups.map(group => (
                        <button
                            key={group}
                            onClick={() => setActiveGroup(group)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
                                activeGroup === group
                                ? 'bg-white shadow-md text-indigo-700 ring-1 ring-indigo-100'
                                : 'text-slate-500 hover:bg-white hover:text-slate-700'
                            }`}
                        >
                            <span className={activeGroup === group ? 'text-indigo-600' : 'text-slate-400'}>
                                {getGroupIcon(group)}
                            </span>
                            {group}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[60vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800">{activeGroup} Features</h3>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <CheckCircle size={12} className="text-green-500" /> Enabled
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <XCircle size={12} className="text-slate-300" /> Hidden
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {ALL_FEATURES.filter(f => f.group === activeGroup).map(renderFeatureCard)}
                        </div>

                        {ALL_FEATURES.filter(f => f.group === activeGroup).length === 0 && (
                            <div className="text-center py-12 text-slate-400 text-sm italic">
                                No features defined for this group yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
