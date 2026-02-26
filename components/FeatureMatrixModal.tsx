import React from 'react';
import { X, Check, Lock, AlertTriangle, Crown, List, Shield, Zap, Sparkles, BookOpen, Star, Layout, MessageSquare, Gamepad2, Trophy, Video, FileText, Headphones } from 'lucide-react';
import { SystemSettings } from '../types';
import { ALL_FEATURES, FeatureGroup } from '../utils/featureRegistry';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings?: SystemSettings;
  discountActive?: boolean;
}

export const FeatureMatrixModal: React.FC<Props> = ({ isOpen, onClose, settings, discountActive }) => {
  if (!isOpen) return null;

  // Logic to merge and filter features
  const localConfig = settings?.featureConfig || {};

  const coreFeatureIds = new Set(ALL_FEATURES.map(f => f.id));
  const customFeatureIds = Object.keys(localConfig).filter(id => !coreFeatureIds.has(id));

  const combinedFeatures = [
      ...ALL_FEATURES.map(f => ({
          id: f.id,
          title: f.label,
          category: f.group,
          adminVisible: f.adminVisible,
          description: f.description,
          // icon: f.icon // We map locally
      })),
      ...customFeatureIds.map(id => ({
          id,
          title: localConfig[id].label || id,
          category: localConfig[id].customCategory || 'CUSTOM',
          adminVisible: false, // Custom defaults to student visible
          description: 'Custom Feature',
      }))
  ];

  const mergedFeatures = combinedFeatures.map(f => {
      const conf = localConfig[f.id] || {};
      return {
          ...f,
          visible: conf.visible !== false,
          allowedTiers: conf.allowedTiers || ['FREE', 'BASIC', 'ULTRA'],
          creditCost: conf.creditCost !== undefined ? conf.creditCost : 0,
      };
  }).filter(f => !f.adminVisible && f.visible); // Show only student visible & enabled features

  // Group by Category
  const groupedFeatures: Record<string, typeof mergedFeatures> = {};
  mergedFeatures.forEach(f => {
      const cat = f.category || 'OTHER';
      if (!groupedFeatures[cat]) groupedFeatures[cat] = [];
      groupedFeatures[cat].push(f);
  });

  const getCategoryIcon = (group: string) => {
      switch(group) {
          case 'AI': return <Sparkles size={18} className="text-purple-500"/>;
          case 'CONTENT': return <BookOpen size={18} className="text-blue-500"/>;
          case 'GAME': return <Gamepad2 size={18} className="text-orange-500"/>;
          case 'CORE': return <Layout size={18} className="text-indigo-500"/>;
          case 'TOOLS': return <Zap size={18} className="text-yellow-500"/>;
          default: return <Star size={18} className="text-slate-500"/>;
      }
  };

  const getTierBadge = (tiers: string[]) => {
      if (tiers.includes('FREE')) return <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded">FREE</span>;
      if (tiers.includes('BASIC')) return <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded">BASIC</span>;
      return <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded">ULTRA</span>;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex justify-between items-center shrink-0 relative overflow-hidden">
            {discountActive && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-red-900 text-xs font-black px-4 py-1 transform rotate-45 translate-x-4 translate-y-2 shadow-lg animate-pulse">
                    FLAME SALE ACTIVE!
                </div>
            )}
            <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Crown className="text-yellow-400 fill-yellow-400" /> App Future Access
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Available Features List</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50">
            {Object.keys(groupedFeatures).length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <p>No features configured.</p>
                </div>
            ) : (
                Object.entries(groupedFeatures).map(([category, features]) => (
                    <div key={category} className="space-y-3">
                        <h3 className="flex items-center gap-2 font-black text-slate-700 text-sm uppercase tracking-wide">
                            {getCategoryIcon(category)} {category} Features
                        </h3>
                        <div className="grid gap-3">
                            {features.map(feature => (
                                <div key={feature.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{feature.title}</h4>
                                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{feature.description || 'Unlock powerful tools to boost your learning.'}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        {getTierBadge(feature.allowedTiers)}
                                        {feature.creditCost > 0 && (
                                            <span className="text-[9px] font-bold text-slate-400">
                                                {feature.creditCost} Coins
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-white border-t border-slate-200 text-center text-[10px] text-slate-400 shrink-0 font-medium">
            * Availability depends on your current subscription plan.
        </div>
      </div>
    </div>
  );
};
