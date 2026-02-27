import React from 'react';
import { X, Check, Lock, AlertTriangle, Crown, List, Shield, Zap, Sparkles, BookOpen, Star, Layout, MessageSquare, Gamepad2, Trophy, Video, FileText, Headphones } from 'lucide-react';
import { SystemSettings } from '../types';
import { DEFAULT_PLAN_COMPARISON } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings?: SystemSettings;
  discountActive?: boolean;
}

export const FeatureMatrixModal: React.FC<Props> = ({ isOpen, onClose, settings, discountActive }) => {
  if (!isOpen) return null;

  // Use default static comparison if dynamic one not available in settings
  // The plan matrix is "driven" by this constant, but "locked" by settings.featureConfig
  const planData = settings?.planComparison || DEFAULT_PLAN_COMPARISON;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
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
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Plan Comparison Matrix</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* STICKY COLUMN HEADERS */}
        <div className="grid grid-cols-4 bg-slate-100 border-b border-slate-200 shrink-0 text-center">
            <div className="p-4 flex items-center justify-start pl-6 font-black text-slate-400 text-xs uppercase tracking-wider">
                Feature
            </div>
            <div className="p-4 bg-green-50/50 border-l border-white">
                <h3 className="font-black text-green-700 text-sm">FREE</h3>
                <p className="text-[10px] text-green-600 font-bold">Starter</p>
            </div>
            <div className="p-4 bg-blue-50/50 border-l border-white relative overflow-hidden">
                <h3 className="font-black text-blue-700 text-sm">BASIC</h3>
                <p className="text-[10px] text-blue-600 font-bold">Standard</p>
            </div>
            <div className="p-4 bg-purple-50/50 border-l border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-yellow-400 to-transparent"></div>
                <h3 className="font-black text-purple-700 text-sm flex items-center justify-center gap-1">ULTRA <Crown size={12} className="fill-purple-700"/></h3>
                <p className="text-[10px] text-purple-600 font-bold">Best Value</p>
            </div>
        </div>

        {/* CONTENT (SCROLLABLE) */}
        <div className="overflow-y-auto custom-scrollbar bg-white">
            {planData.map((category: any, catIndex: number) => (
                <div key={catIndex}>
                    {/* CATEGORY HEADER */}
                    <div className="bg-slate-50 p-3 px-6 border-y border-slate-100 flex items-center gap-2 sticky top-0 z-10 shadow-sm">
                        <span className="font-black text-slate-800 text-xs uppercase tracking-widest">{category.name}</span>
                    </div>

                    {/* FEATURE ROWS */}
                    {category.features.map((feature: any, featIndex: number) => {
                        // CHECK FOR LOCK VIA APP SOUL
                        // If id exists and is set to visible: false in settings, lock the row
                        const featureConfig = settings?.featureConfig?.[feature.id];
                        const isLocked = featureConfig?.visible === false;

                        return (
                            <div key={featIndex} className={`grid grid-cols-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors relative group ${isLocked ? 'grayscale opacity-70 bg-slate-50' : ''}`}>

                                {/* LOCKED OVERLAY */}
                                {isLocked && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/50 backdrop-blur-[1px]">
                                        <div className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
                                            <Lock size={12} /> FEATURE CURRENTLY LOCKED
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 pl-6 flex items-center gap-3 text-sm font-bold text-slate-700 border-r border-slate-50">
                                    {/* Optional: Add icon mapping based on feature name or id if needed */}
                                    {feature.name}
                                </div>
                                <div className="p-4 flex items-center justify-center text-xs font-medium text-slate-600 border-r border-slate-50 text-center">
                                    {feature.free}
                                </div>
                                <div className="p-4 flex items-center justify-center text-xs font-bold text-blue-700 bg-blue-50/10 border-r border-slate-50 text-center">
                                    {feature.basic}
                                </div>
                                <div className="p-4 flex items-center justify-center text-xs font-black text-purple-700 bg-purple-50/10 text-center">
                                    {feature.ultra}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center flex justify-between items-center shrink-0">
            <p className="text-[10px] text-slate-400 font-medium">
                * Prices and features subject to change. Admin controls all access rights.
            </p>
            <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
                Close Matrix
            </button>
        </div>
      </div>
    </div>
  );
};
