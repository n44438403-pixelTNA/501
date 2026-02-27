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

  const featureConfig = settings?.featureConfig || {};

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="bg-slate-900 p-6 flex justify-between items-center shrink-0 border-b border-slate-800">
            <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Crown className="text-yellow-400 fill-yellow-400" /> Plan Matrix
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Feature Comparison & Availability</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* TABLE CONTENT */}
        <div className="overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
            <div className="min-w-[800px] p-6">

                {/* TABLE HEADER */}
                <div className="grid grid-cols-4 gap-4 mb-4 sticky top-0 bg-slate-50 z-10 py-2 border-b border-slate-200">
                    <div className="font-black text-slate-400 uppercase text-xs tracking-widest pt-3">Feature</div>
                    <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center font-black text-sm border border-green-200 shadow-sm">FREE</div>
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-center font-black text-sm border border-blue-200 shadow-sm">BASIC</div>
                    <div className="bg-purple-50 text-purple-700 p-3 rounded-xl text-center font-black text-sm border border-purple-200 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">ULTRA</div>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>
                    </div>
                </div>

                {/* TABLE BODY */}
                <div className="space-y-8">
                    {DEFAULT_PLAN_COMPARISON.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                                <h3 className="font-black text-slate-700 text-sm uppercase">{section.name}</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {section.features.map((feat: any, fIdx: number) => {
                                    // CHECK ADMIN LOCK
                                    let isLocked = false;
                                    if (feat.id && featureConfig[feat.id] && featureConfig[feat.id].visible === false) {
                                        isLocked = true;
                                    }

                                    return (
                                        <div key={fIdx} className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                                            <div className="font-bold text-slate-700 text-xs flex items-center gap-2">
                                                {isLocked && <Lock size={12} className="text-red-500" />}
                                                {feat.name}
                                            </div>

                                            {/* FREE COL */}
                                            <div className="text-center text-xs font-medium text-slate-600">
                                                {isLocked ? <span className="font-bold text-red-500 bg-red-50 px-2 py-1 rounded">❌ Locked by Admin</span> : feat.free}
                                            </div>

                                            {/* BASIC COL */}
                                            <div className="text-center text-xs font-medium text-slate-600">
                                                {isLocked ? <span className="font-bold text-red-500 bg-red-50 px-2 py-1 rounded">❌ Locked by Admin</span> : feat.basic}
                                            </div>

                                            {/* ULTRA COL */}
                                            <div className="text-center text-xs font-bold text-slate-800">
                                                {isLocked ? <span className="font-bold text-red-500 bg-red-50 px-2 py-1 rounded">❌ Locked by Admin</span> : feat.ultra}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-white border-t border-slate-200 text-center text-[10px] text-slate-400 shrink-0 font-medium">
            * Features marked "Locked by Admin" are currently unavailable for maintenance or updates.
        </div>
      </div>
    </div>
  );
};
