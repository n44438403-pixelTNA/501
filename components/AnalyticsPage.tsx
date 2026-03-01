
import React, { useState } from 'react';
import type { User, MCQResult, PerformanceTag, SystemSettings } from '../types';
import { BarChart, Clock, Calendar, BookOpen, TrendingUp, AlertTriangle, CheckCircle, XCircle, FileText, BrainCircuit } from 'lucide-react';
import { MarksheetCard } from './MarksheetCard';

interface Props {
  user: User;
  onBack: () => void;
  settings?: SystemSettings;
  onNavigateToChapter?: (chapterId: string, chapterTitle: string, subjectName: string, classLevel?: string) => void;
}

export const AnalyticsPage: React.FC<Props> = ({ user, onBack, settings, onNavigateToChapter }) => {
  const [selectedResult, setSelectedResult] = useState<MCQResult | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(10);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [initialView, setInitialView] = useState<'ANALYSIS' | 'RECOMMEND' | undefined>(undefined);
  const [showMoreTests, setShowMoreTests] = useState(false);

  const historyRaw = user.mcqHistory || [];
  
  // Annual Report Requirement: Show only last 30 days data
  const history = historyRaw.filter(h => {
      const d = new Date(h.date);
      const limit = new Date();
      limit.setDate(limit.getDate() - 30);
      return d >= limit;
  });

  const getQuestionsForAttempt = (attemptId: string) => {
      try {
          const historyStr = localStorage.getItem('nst_user_history');
          if (historyStr) {
              const history = JSON.parse(historyStr);
              // Match by analytics ID (which is result ID)
              const match = history.find((h: any) => h.analytics && h.analytics.id === attemptId);
              if (match && match.mcqData) {
                  return match.mcqData;
              }
          }
      } catch (e) {}
      return [];
  };

  const handleOpenMarksheet = (result: MCQResult, view?: 'ANALYSIS' | 'RECOMMEND') => {
      const questions = getQuestionsForAttempt(result.id);
      setSelectedQuestions(questions);
      setInitialView(view);
      setSelectedResult(result);
  };
  
  // Calculate Totals
  const totalTests = history.length;
  const totalQuestions = history.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  const totalCorrect = history.reduce((acc, curr) => acc + curr.correctCount, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  const totalTime = history.reduce((acc, curr) => acc + curr.totalTimeSeconds, 0);
  const avgTimePerQ = totalQuestions > 0 ? (totalTime / totalQuestions).toFixed(1) : '0';

  // Topic Analysis (Premium)
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  // Group History by Topic -> SubTopic
  const topicTree: Record<string, Record<string, MCQResult[]>> = {};
  history.forEach(h => {
      const topic = h.subjectName || 'General';
      // Subtopic is chapterTitle in this context
      const subtopic = h.chapterTitle || 'Miscellaneous';

      if (!topicTree[topic]) topicTree[topic] = {};
      if (!topicTree[topic][subtopic]) topicTree[topic][subtopic] = [];

      topicTree[topic][subtopic].push(h);
  });

  // --- REVISION LOGIC CONFIG (DYNAMIC THRESHOLDS) ---
  const revisionConfig = settings?.revisionConfig;
  const thresholds = revisionConfig?.thresholds || { strong: 80, average: 50 }; // Default as per previous logic

  // Trend Analysis (Last 10 tests)
    const trendData = history
        .slice(0, visibleLimit)
        .reverse() // Oldest to newest
        .map(h => ({
            date: new Date(h.date).toLocaleDateString(undefined, {day: 'numeric', month: 'short'}),
            score: h.totalQuestions > 0 ? Math.round((h.correctCount / h.totalQuestions) * 100) : 0,
            fullDate: new Date(h.date).toLocaleDateString(),
            topic: h.chapterTitle || 'General Test'
        }));

  // Categorized Analysis
  const categorizedHistory = {
      strong: history.filter(h => h.totalQuestions > 0 && ((h.correctCount / h.totalQuestions) * 100) >= thresholds.strong),
      average: history.filter(h => h.totalQuestions > 0 && ((h.correctCount / h.totalQuestions) * 100) >= thresholds.average && ((h.correctCount / h.totalQuestions) * 100) < thresholds.strong),
      weak: history.filter(h => h.totalQuestions > 0 && ((h.correctCount / h.totalQuestions) * 100) < thresholds.average)
  };

  const getTagColor = (tag: PerformanceTag) => {
      switch(tag) {
          case 'EXCELLENT': return 'bg-green-100 text-green-700 border-green-200';
          case 'GOOD': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'BAD': return 'bg-orange-100 text-orange-700 border-orange-200';
          case 'VERY_BAD': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-slate-100 text-slate-600';
      }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 animate-in fade-in slide-in-from-right">
        {selectedResult && (
            <MarksheetCard 
                result={selectedResult} 
                user={user} 
                settings={settings}
                onClose={() => setSelectedResult(null)} 
                questions={selectedQuestions}
                initialView={initialView}
            />
        )}
        
        {/* HEADER */}
        <div className="bg-white p-4 shadow-sm border-b border-slate-200 sticky top-0 z-10 flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><TrendingUp size={20} className="text-slate-600" /></button>
            <div>
                <h2 className="text-xl font-black text-slate-800">Annual Report</h2>
                <p className="text-xs text-slate-500 font-bold uppercase">Performance Analytics (Last 30 Days)</p>
            </div>
        </div>

        <div className="p-4 space-y-6">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><CheckCircle size={18} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Accuracy</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800">{accuracy}%</p>
                    <p className="text-[10px] text-slate-400">{totalCorrect}/{totalQuestions} Correct</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Clock size={18} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Speed</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800">{avgTimePerQ}s</p>
                    <p className="text-[10px] text-slate-400">Avg per Question</p>
                </div>
            </div>

            {/* PERFORMANCE TREND (Professional Progress Bars) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-500" /> Performance Trend
                </h3>
                {trendData.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">Take tests to see your progress.</p>
                ) : (
                    <div className="space-y-4">
                        {trendData.map((d, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${d.score >= 80 ? 'bg-green-500' : d.score >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-700 truncate line-clamp-1">{d.topic}</span>
                                            <span className="text-[9px] text-slate-400 font-medium">{d.date}</span>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-black shrink-0 ${d.score >= 80 ? 'text-green-600' : d.score >= 50 ? 'text-blue-600' : 'text-red-600'}`}>
                                        {d.score}%
                                    </span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex items-center relative">
                                    {/* 100% Marker Line */}
                                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-slate-300 z-10"></div>
                                    
                                    <div 
                                        className={`h-full transition-all duration-1000 rounded-full relative ${
                                            d.score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 
                                            d.score >= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 
                                            'bg-gradient-to-r from-red-500 to-orange-400'
                                        }`} 
                                        style={{ width: `${d.score}%` }}
                                    >
                                        {/* Glow effect for professional look */}
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            <span>Last 10 Tests</span>
                            <span>Target: 100%</span>
                        </div>
                    </div>
                )}
            </div>

            {/* PREMIUM ANALYSIS TREE (Topic -> Subtopic -> Questions) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <BrainCircuit size={18} className="text-purple-600" /> Premium Analysis
                    </h3>
                    <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded">
                        DEEP DIVE
                    </span>
                </div>

                <div className="space-y-2">
                    {Object.keys(topicTree).map(topic => (
                        <div key={topic} className="border border-slate-100 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setExpandedTopic(expandedTopic === topic ? null : topic)}
                                className="w-full flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <span className="font-bold text-sm text-slate-700">{topic}</span>
                                <span className="text-slate-400 text-xs">{expandedTopic === topic ? '▲' : '▼'}</span>
                            </button>

                            {expandedTopic === topic && (
                                <div className="p-3 bg-white space-y-3 animate-in slide-in-from-top-2">
                                    {Object.keys(topicTree[topic]).map(subtopic => {
                                        const results = topicTree[topic][subtopic];
                                        // Sort by Date (Oldest First)
                                        const sorted = results.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                        const current = sorted[sorted.length - 1]; // Latest
                                        const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null; // Previous attempt

                                        const currPct = current.totalQuestions > 0 ? Math.round((current.score/current.totalQuestions)*100) : 0;
                                        const prevPct = previous && previous.totalQuestions > 0 ? Math.round((previous.score/previous.totalQuestions)*100) : 0;

                                        const improvePercent = previous ? currPct - prevPct : 0;
                                        const questions = getQuestionsForAttempt(current.id);

                                        return (
                                            <div key={subtopic} className="border-l-2 border-purple-200 pl-3 pb-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{subtopic}</p>
                                                        <p className="text-[10px] text-slate-500 font-bold">{results.length} Attempts • Latest: {new Date(current.date).toLocaleDateString()}</p>
                                                    </div>

                                                    {/* UPGRADE STATUS BADGE */}
                                                    {previous ? (
                                                        <div className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <span className="text-[10px] text-slate-400 line-through">{prevPct}%</span>
                                                                <span className="text-xs text-slate-300">→</span>
                                                                <span className={`text-sm font-black ${currPct >= prevPct ? 'text-green-600' : 'text-red-500'}`}>
                                                                    {currPct}%
                                                                </span>
                                                            </div>
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${improvePercent > 0 ? 'bg-green-100 text-green-700' : improvePercent < 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                                                {improvePercent > 0 ? `UPGRADE +${improvePercent}%` : improvePercent < 0 ? `DROP ${improvePercent}%` : 'NO CHANGE'}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-right">
                                                            <span className="text-sm font-black text-blue-600">{currPct}%</span>
                                                            <p className="text-[9px] text-slate-400">First Attempt</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* EXPANDED QUESTIONS LIST */}
                                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Questions in this Test</p>
                                                    <div className="space-y-2">
                                                        {questions.length === 0 ? (
                                                            <p className="text-[10px] text-slate-400 italic">Questions data not available.</p>
                                                        ) : (
                                                            questions.map((q: any, qi: number) => {
                                                                // Infer status if not explicit
                                                                const isCorrect = q.userAnswer === q.correctAnswer; // Assuming data structure matches
                                                                // If userAnswer is missing, try to find it in result? result only has scores.
                                                                // We need to trust getQuestionsForAttempt returns data with answers merged or we can't show status.
                                                                // Actually getQuestionsForAttempt returns mcqData.
                                                                // We need to merge answers?
                                                                // In McqView, we saved `userAnswers` inside `newHistoryItem`.
                                                                // Let's assume `q` has it or we can't color code.
                                                                // If not, we just list the question.

                                                                // Check if we can find the answer in history item?
                                                                // `getQuestionsForAttempt` pulls `mcqData`.
                                                                // The `newHistoryItem` has `userAnswers`.
                                                                // We need to modify `getQuestionsForAttempt` or `AnalyticsPage` to return answers too.
                                                                // But for now, let's just list them.

                                                                return (
                                                                    <div key={qi} className="flex gap-2 items-start">
                                                                        <span className="text-[10px] font-mono text-slate-400 mt-0.5">Q{qi+1}</span>
                                                                        <p className="text-[11px] text-slate-700 leading-snug line-clamp-2">{q.question}</p>
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleOpenMarksheet(current)}
                                                        className="w-full mt-3 py-2 bg-white border border-purple-200 text-purple-700 text-[10px] font-bold rounded-lg hover:bg-purple-50 transition-colors shadow-sm"
                                                    >
                                                        View Full Solution & Analysis
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* RECENT TESTS */}
            <div>
                <h3 className="font-bold text-slate-800 mb-3 px-1 flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400" /> Recent Tests
                </h3>
                <div className="space-y-3">
                    {history.length === 0 && <p className="text-slate-400 text-sm text-center py-8 bg-white rounded-xl border border-dashed">No tests taken yet.</p>}
                    {
                    history
                        .filter(h => new Date(h.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, visibleLimit)
                        .map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{item.chapterTitle}</h4>
                                    <p className="text-xs text-slate-500">{item.subjectName} • {new Date(item.date).toLocaleDateString()}</p>
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] font-black border ${getTagColor(item.performanceTag)}`}>
                                    {item.performanceTag.replace('_', ' ')}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg">
                                <div className="text-center flex-1 border-r border-slate-200">
                                    <p className="text-slate-400 font-bold uppercase text-[9px]">Score</p>
                                    <p className="font-black text-slate-700">{item.score}/{item.totalQuestions}</p>
                                </div>
                                <div className="text-center flex-1 border-r border-slate-200">
                                    <p className="text-slate-400 font-bold uppercase text-[9px]">Avg Time</p>
                                    <p className="font-black text-slate-700">{item.averageTimePerQuestion.toFixed(1)}s</p>
                                </div>
                                <div className="text-center flex-1">
                                    <p className="text-slate-400 font-bold uppercase text-[9px]">Total Time</p>
                                    <p className="font-black text-slate-700">{Math.floor(item.totalTimeSeconds/60)}m {item.totalTimeSeconds%60}s</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => handleOpenMarksheet(item, 'ANALYSIS')}
                                    className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                    {history.filter(h => new Date(h.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length > visibleLimit && (
                        <button onClick={() => setVisibleLimit(prev => prev + 10)} className="w-full text-center py-3 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-white rounded-xl border border-dashed border-slate-300 mt-4">
                            + Load More Tests
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
