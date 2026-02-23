import React, { useState } from 'react';
import { User, SystemSettings, StudentTab } from '../types';
import { Bot, Sparkles, BrainCircuit, FileText, Zap } from 'lucide-react';
import { CustomAlert } from './CustomDialogs';

interface Props {
    user: User;
    onTabChange: (tab: StudentTab) => void;
    settings?: SystemSettings;
}

export const AiHub: React.FC<Props> = ({ user, onTabChange, settings }) => {
    const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, type: 'SUCCESS'|'ERROR'|'INFO', title?: string, message: string}>({isOpen: false, type: 'INFO', message: ''});

    return (
        <div className="space-y-6 pb-24 p-4 animate-in fade-in">
            {/* HEADER */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
                        <Sparkles className="text-yellow-400" /> AI Center
                    </h2>
                    <p className="text-indigo-200 text-sm">Your personal learning assistant powered by advanced AI.</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* AI TOOLS COMPRESSED VIEW */}
            <div className="grid grid-cols-1 gap-4">
                {/* 1. CHAT TUTOR */}
                <button
                    onClick={() => onTabChange('AI_CHAT')}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
                        <Bot size={24} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-800">Chat with AI Tutor</h3>
                        <p className="text-xs text-slate-500">Instant answers to any question.</p>
                    </div>
                    <div className="text-slate-300">
                        <Zap size={16} />
                    </div>
                </button>

                {/* 2. NOTES GENERATOR */}
                <button
                    onClick={() => onTabChange('AI_STUDIO' as any)} // Assuming mapped to AI Modal logic in parent
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className="bg-pink-100 text-pink-600 p-3 rounded-xl">
                        <FileText size={24} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-800">Generate Notes</h3>
                        <p className="text-xs text-slate-500">Create custom summaries instantly.</p>
                    </div>
                    <div className="text-slate-300">
                        <Zap size={16} />
                    </div>
                </button>

                {/* 3. DEEP ANALYSIS */}
                <button
                    onClick={() => onTabChange('DEEP_ANALYSIS')}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                        <BrainCircuit size={24} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-800">Deep Performance Analysis</h3>
                        <p className="text-xs text-slate-500">AI insights on your weak areas.</p>
                    </div>
                    <div className="text-slate-300">
                        <Zap size={16} />
                    </div>
                </button>
            </div>

            <CustomAlert
                isOpen={alertConfig.isOpen}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={() => setAlertConfig(prev => ({...prev, isOpen: false}))}
            />
        </div>
    );
};
