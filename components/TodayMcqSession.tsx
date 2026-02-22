import React, { useState, useEffect } from 'react';
import { User, MCQItem, MCQResult, TopicItem } from '../types';
import { X, CheckCircle, ArrowRight, Loader2, BrainCircuit, AlertCircle, List } from 'lucide-react';
import { getChapterData, saveUserToLive, saveTestResult, saveUserHistory, saveDemand } from '../firebase';
import { storage } from '../utils/storage';
import { generateAnalysisJson } from '../utils/analysisUtils';

interface Props {
    user: User;
    topics: TopicItem[];
    onClose: () => void;
    onComplete: (results: MCQResult[]) => void;
}

export const TodayMcqSession: React.FC<Props> = ({ user, topics, onClose, onComplete }) => {
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentMcqData, setCurrentMcqData] = useState<MCQItem[]>([]);

    // Test State for Current Topic
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResult, setShowResult] = useState(false); // Result for current topic
    const [topicScore, setTopicScore] = useState(0);
    const [showSidebar, setShowSidebar] = useState(false);

    const [sessionResults, setSessionResults] = useState<MCQResult[]>([]);

    // Timers
    const [totalTime, setTotalTime] = useState(0);
    const [questionTime, setQuestionTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTotalTime(prev => prev + 1);
            setQuestionTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Reset question timer on new question
    useEffect(() => {
        setQuestionTime(0);
    }, [qIndex, currentIndex]);

    useEffect(() => {
        loadTopicData(currentIndex);
    }, [currentIndex]);

    const loadTopicData = async (index: number) => {
        if (index >= topics.length) {
            onComplete(sessionResults);
            return;
        }

        setLoading(true);
        const topic = topics[index];
        setQIndex(0);
        setAnswers({});
        setShowResult(false);
        setTopicScore(0);

        try {
            let data: any = null;
            const board = user.board || 'CBSE';
            const classLevel = user.classLevel || '10';
            const streamKey = (classLevel === '11' || classLevel === '12') && user.stream ? `-${user.stream}` : '';
            const subject = topic.subjectName || 'Unknown';

            // Fetch Content
            const strictKey = `nst_content_${board}_${classLevel}${streamKey}_${subject}_${topic.chapterId}`;
            data = await storage.getItem(strictKey);
            if (!data) data = await getChapterData(strictKey);
            if (!data) data = await getChapterData(topic.chapterId);

            let mcqs: MCQItem[] = [];
            if (data && data.manualMcqData) {
                // Filter by Subtopic Logic
                const normSubTopic = topic.name.toLowerCase().trim();
                mcqs = data.manualMcqData.filter((q: any) => q.topic && q.topic.toLowerCase().trim() === normSubTopic);

                // Fallback: If no subtopic specific MCQs, maybe use generic ones?
                // User logic is specific to subtopics now. If empty, we might need to skip or show empty.
                if (mcqs.length === 0) {
                     // Try loose match
                     mcqs = data.manualMcqData.filter((q: any) => q.topic && q.topic.toLowerCase().includes(normSubTopic));
                }
            }

            // AUTO-SKIP EMPTY TOPICS & REPORT
            if (mcqs.length === 0) {
                console.log(`Skipping ${topic.name} - No MCQs found`);
                // Report Missing Content to Admin
                saveDemand(user.id, `Missing MCQs for Revision: ${topic.name} (${topic.chapterName})`);

                setCurrentIndex(prev => prev + 1); // Automatically move to next
                return; // Early exit, let effect re-trigger
            }

            // LIMIT QUESTIONS (User Request: Don't show 200-400 questions)
            // Cap at 20 questions per revision session to prevent burnout
            const limitedMcqs = mcqs.slice(0, 20);

            setCurrentMcqData(limitedMcqs);
        } catch (e) {
            console.error("Failed to load MCQ", e);
            setCurrentMcqData([]);
            setCurrentIndex(prev => prev + 1); // Skip on error
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (optionIdx: number) => {
        if (answers[qIndex] !== undefined) return;

        const newAnswers = { ...answers, [qIndex]: optionIdx };
        setAnswers(newAnswers);

        // Auto Advance after short delay
        setTimeout(() => {
            if (qIndex < currentMcqData.length - 1) {
                setQIndex(prev => prev + 1);
            } else {
                // Topic Finished -> Auto Submit Topic (No Result Screen)
                calculateAndNext(newAnswers);
            }
        }, 500);
    };

    const calculateAndNext = (finalAnswers: Record<number, number>) => {
        let correct = 0;
        currentMcqData.forEach((q, i) => {
            if (finalAnswers[i] === q.correctAnswer) correct++;
        });
        // Save & Move Next immediately
        processTopicResult(correct, finalAnswers);
    };

    const processTopicResult = (score: number, finalAnswers: Record<number, number>) => {
        // Save Result
        const topic = topics[currentIndex];
        const total = currentMcqData.length;
        const percentage = total > 0 ? (score/total)*100 : 0;

        // Determine Status based on NEW Logic
        // < 50 Weak, 50-79 Avg, >= 80 Excellent (User said "80% aagaya ab ye topic jayega exclent page me")
        // Wait, did user define "Strong"?
        // User: "10 topic week , 5 avrage aur 2 stronge hua... mcq banaye 80% aagaya ab ye topic jayega exclent page me"
        // Implies: < 50 Weak, 50-65 Avg, 65-79 Strong, >= 80 Excellent. (Approximation)
        let status = 'AVERAGE';
        if (percentage < 50) status = 'WEAK';
        else if (percentage >= 80) status = 'EXCELLENT';
        else if (percentage >= 65) status = 'STRONG';

        // Use helper to generate report matching other components
        // Create dummy "submittedQuestions" array where every question is from this subtopic
        // But we need individual correctness. We have `answers` (Record<qIndex, optionIndex>)
        // and `currentMcqData`.

        // Reconstruct user answers for the helper
        const userAnswersMap: Record<number, number> = {};
        currentMcqData.forEach((_, idx) => {
            if (answers[idx] !== undefined) userAnswersMap[idx] = answers[idx];
        });

        const analysisJson = generateAnalysisJson(currentMcqData, userAnswersMap);

        const result: MCQResult = {
            id: `mcq-rev-${Date.now()}`,
            userId: user.id,
            chapterId: topic.chapterId,
            chapterTitle: topic.chapterName,
            subjectId: 'REVISION',
            subjectName: topic.subjectName || 'Revision',
            date: new Date().toISOString(),
            score: score,
            totalQuestions: total,
            correctCount: score,
            wrongCount: total - score,
            totalTimeSeconds: 0,
            averageTimePerQuestion: 0,
            performanceTag: percentage >= 80 ? 'EXCELLENT' : percentage >= 50 ? 'GOOD' : 'BAD',
            ultraAnalysisReport: analysisJson
        };

        setSessionResults(prev => [...prev, result]);

        // Save to DB immediately to be safe
        saveUserHistory(user.id, result);
        saveTestResult(user.id, result);

        setCurrentIndex(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
                <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                <p className="font-bold text-slate-600 animate-pulse">Loading Topic {currentIndex + 1}...</p>
            </div>
        );
    }

    // Completion View
    if (currentIndex >= topics.length) {
        return null; // Handled by loadTopicData check, but for safety
    }

    const topic = topics[currentIndex];

    // No Questions Found View (Should be skipped automatically, but safety net)
    if (currentMcqData.length === 0) {
        return (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
                <Loader2 size={48} className="text-slate-300 animate-spin mb-4" />
                <p className="text-slate-400 font-bold">Skipping empty topic...</p>
            </div>
        );
    }

    // Intermediate Result Screen REMOVED as per user request
    // "banane ke baad ek analysis page aaya hai jo na aaye to hi achha rahega"

    // MCQ Question View
    const question = currentMcqData[qIndex];
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            {/* Sidebar Overlay */}
            {showSidebar && (
                <div className="fixed inset-0 bg-black/50 z-[110]" onClick={() => setShowSidebar(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl p-4 overflow-y-auto animate-in slide-in-from-right" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-slate-800">Session Topics</h3>
                            <button onClick={() => setShowSidebar(false)}><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            {topics.map((t, idx) => {
                                const isCurrent = idx === currentIndex;
                                const isDone = idx < currentIndex;
                                return (
                                    <div key={idx} className={`p-3 rounded-xl border ${isCurrent ? 'bg-blue-50 border-blue-200' : isDone ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-100'}`}>
                                        <p className={`text-xs font-bold ${isCurrent ? 'text-blue-700' : 'text-slate-700'}`}>{t.name}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[10px] uppercase text-slate-400 font-bold">{t.chapterName}</span>
                                            {isCurrent && <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Active</span>}
                                            {isDone && <CheckCircle size={12} className="text-green-500" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <button onClick={() => {
                        // Back Button = Submit & Exit (Auto)
                        // If we have some results, complete. If not, just close.
                        if (sessionResults.length > 0) {
                            onComplete(sessionResults);
                        } else {
                            onClose();
                        }
                    }} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                        <ArrowRight size={18} className="rotate-180" /> {/* Back Icon */}
                    </button>
                    <div>
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide max-w-[150px] truncate">{topic.name}</h3>
                        <p className="text-xs text-slate-400 font-bold">Q {qIndex + 1} / {currentMcqData.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowSidebar(true)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                        <List size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                            <span className="text-xs font-mono font-bold text-slate-700">
                                {Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            // "Apne aap submit ho jayega" - Manual submit also triggers finish
                            onComplete(sessionResults);
                        }}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow hover:bg-green-700"
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Progress */}
            <div className="h-1 bg-slate-100 w-full">
                <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${((qIndex + 1) / currentMcqData.length) * 100}%` }}
                ></div>
            </div>

            {/* Question */}
            <div className="flex-1 overflow-y-auto p-6 pb-24">
                <h2 className="text-lg font-bold text-slate-800 mb-8 leading-relaxed">
                    {question.question}
                </h2>

                <div className="space-y-3">
                    {question.options.map((opt, idx) => {
                        const isSelected = answers[qIndex] === idx;
                        const isCorrect = idx === question.correctAnswer;
                        let btnClass = "border-slate-200 bg-white text-slate-600 hover:bg-slate-50";

                        if (answers[qIndex] !== undefined) {
                            if (isCorrect) btnClass = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                            else if (isSelected) btnClass = "border-red-500 bg-red-50 text-red-700";
                            else btnClass = "border-slate-100 opacity-50";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={answers[qIndex] !== undefined}
                                className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex items-center gap-3 ${btnClass}`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                                    answers[qIndex] !== undefined && isCorrect ? 'bg-green-500 border-green-500 text-white' :
                                    answers[qIndex] !== undefined && isSelected ? 'bg-red-500 border-red-500 text-white' :
                                    'bg-slate-100 border-slate-300 text-slate-500'
                                }`}>
                                    {['A','B','C','D'][idx]}
                                </div>
                                <span className="flex-1">{opt}</span>
                                {answers[qIndex] !== undefined && isCorrect && <CheckCircle size={18} className="text-green-600" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
