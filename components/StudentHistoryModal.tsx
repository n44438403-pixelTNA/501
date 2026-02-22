
import React from 'react';
import { User, ActivityLogEntry, UniversalAnalysisLog } from '../types';
import { X, Activity, CheckCircle, BrainCircuit, ListChecks } from 'lucide-react';

interface Props {
    user: User;
    onClose: () => void;
    analysisLogs: UniversalAnalysisLog[];
}

export const StudentHistoryModal: React.FC<Props> = ({ user, onClose, analysisLogs }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Activity className="text-purple-600"/> My Activity History</h3>
                        <p className="text-sm text-slate-500">
                            Detailed record of your tests, AI analysis, and usage.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* STATISTICAL SUMMARY */}
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-2xl border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-widest">Performance Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Tests</p>
                                <p className="text-xl font-black text-slate-800">{user.mcqHistory?.length || 0}</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg. Score</p>
                                <p className="text-xl font-black text-blue-600">
                                    {user.mcqHistory && user.mcqHistory.length > 0
                                        ? Math.round(user.mcqHistory.reduce((acc: any, h: any) => acc + (h.totalQuestions > 0 ? (h.score/h.totalQuestions)*100 : 0), 0) / user.mcqHistory.length)
                                        : 0}%
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</p>
                                <p className="text-xl font-black text-green-600">
                                    {(() => {
                                        const hist = user.mcqHistory || [];
                                        const totalQ = hist.reduce((acc: any, h: any) => acc + h.totalQuestions, 0);
                                        const correct = hist.reduce((acc: any, h: any) => acc + h.correctCount, 0);
                                        return totalQ > 0 ? Math.round((correct/totalQ)*100) : 0;
                                    })()}%
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Streak</p>
                                <p className="text-xl font-black text-orange-600">{user.streak} Days</p>
                            </div>
                        </div>
                    </div>

                    {/* 1. MCQ RESULTS */}
                    <div>
                        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><CheckCircle size={18}/> Test Performance</h4>
                        <div className="max-h-60 overflow-y-auto border rounded-xl">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 font-bold text-slate-500 uppercase sticky top-0">
                                    <tr>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Test/Chapter</th>
                                        <th className="p-3">Score</th>
                                        <th className="p-3">Time</th>
                                        <th className="p-3">Tag</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(!user.mcqHistory || user.mcqHistory.length === 0) && (
                                        <tr><td colSpan={5} className="p-4 text-center text-slate-400">No tests taken yet.</td></tr>
                                    )}
                                    {(user.mcqHistory || []).map((res: any) => (
                                        <tr key={res.id} className="hover:bg-slate-50">
                                            <td className="p-3 text-slate-500">{new Date(res.date).toLocaleDateString()}</td>
                                            <td className="p-3 font-bold text-slate-700">{res.chapterTitle}</td>
                                            <td className="p-3 font-bold text-blue-600">{res.score}/{res.totalQuestions} ({Math.round(res.score/res.totalQuestions*100)}%)</td>
                                            <td className="p-3 text-slate-500">{Math.round(res.totalTimeSeconds || 0)}s</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    res.performanceTag === 'EXCELLENT' ? 'bg-green-100 text-green-700' :
                                                    res.performanceTag === 'GOOD' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {res.performanceTag}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 2. AI ANALYSIS HISTORY */}
                    <div>
                        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><BrainCircuit size={18}/> AI Analysis Reports</h4>
                        <div className="max-h-60 overflow-y-auto border rounded-xl bg-slate-50 p-4 space-y-3">
                            {analysisLogs.length === 0 && (
                                <p className="text-slate-400 text-center text-xs">No analysis reports found.</p>
                            )}
                            {analysisLogs.map(log => (
                                <div key={log.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-xs text-slate-700">{log.chapter} ({log.subject})</p>
                                        <span className="text-[10px] text-slate-400">{new Date(log.date).toLocaleString()}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded whitespace-pre-wrap font-mono max-h-20 overflow-y-auto">
                                        {log.aiResponse}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. USAGE LOGS */}
                    <div>
                        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><ListChecks size={18}/> Activity Log</h4>
                        <div className="max-h-60 overflow-y-auto border rounded-xl">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 font-bold text-slate-500 uppercase sticky top-0">
                                    <tr>
                                        <th className="p-3">Time</th>
                                        <th className="p-3">Action</th>
                                        <th className="p-3">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(!user.usageHistory || user.usageHistory.length === 0) && (
                                        <tr><td colSpan={3} className="p-4 text-center text-slate-400">No activity recorded.</td></tr>
                                    )}
                                    {(user.usageHistory || []).map((act: any) => (
                                        <tr key={act.id} className="hover:bg-slate-50">
                                            <td className="p-3 text-slate-500 whitespace-nowrap">{new Date(act.timestamp).toLocaleString()}</td>
                                            <td className="p-3 font-bold text-slate-700">{act.type}</td>
                                            <td className="p-3 text-slate-600">{act.itemTitle} {act.amount ? `(${act.amount})` : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                     <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900">Close</button>
                </div>
            </div>
        </div>
    );
};
