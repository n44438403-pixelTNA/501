import React, { useState, useEffect } from 'react';
// Sync check
import type { MCQResult, User, SystemSettings } from '../types';
import { X, Share2, ChevronLeft, ChevronRight, Download, FileSearch, Grid, CheckCircle, XCircle, Clock, Award, BrainCircuit, Play, StopCircle, BookOpen, Target, Zap, BarChart3, ListChecks, FileText, LayoutTemplate, TrendingUp, TrendingDown, Lightbulb, ExternalLink, RefreshCw, Lock, Sparkles, Volume2, ChevronDown, ChevronUp, AlertCircle, ArrowRight, BookOpenCheck, ArrowUp, Minus } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generateUltraAnalysis } from '../services/groq';
import { saveUniversalAnalysis, saveUserToLive, saveAiInteraction, getChapterData } from '../firebase';
import ReactMarkdown from 'react-markdown';
import { speakText, stopSpeech, getCategorizedVoices, stripHtml } from '../utils/textToSpeech';
import { CustomConfirm } from './CustomDialogs'; // Import CustomConfirm
import { SpeakButton } from './SpeakButton';
import { renderMathInHtml } from '../utils/mathUtils';
import { DownloadOptionsModal } from './DownloadOptionsModal';
import { downloadAsMHTML } from '../utils/downloadUtils';

interface Props {
  result: MCQResult;
  user: User;
  settings?: SystemSettings;
  onClose: () => void;
  onViewAnalysis?: (cost: number) => void;
  onPublish?: () => void;
  questions?: any[]; 
  onUpdateUser?: (user: User) => void;
  initialView?: 'ANALYSIS' | 'RECOMMEND';
  onLaunchContent?: (content: any) => void;
  mcqMode?: 'FREE' | 'PREMIUM'; // NEW: Mode Check
}

export const MarksheetCard: React.FC<Props> = ({ result, user, settings, onClose, onViewAnalysis, onPublish, questions, onUpdateUser, initialView, onLaunchContent, mcqMode = 'FREE' }) => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'OFFICIAL_MARKSHEET' | 'SOLUTION' | 'OMR' | 'RECOMMEND' | 'MISTAKES' | 'AI_ANALYSIS'>(
      mcqMode === 'PREMIUM' ? 'SOLUTION' : 'OFFICIAL_MARKSHEET'
  );
  
  // FREE MODE ANALYSIS LOCK
  const [isAnalysisUnlocked, setIsAnalysisUnlocked] = useState(mcqMode === 'PREMIUM');

  // ULTRA ANALYSIS STATE
  const [ultraAnalysisResult, setUltraAnalysisResult] = useState('');
  const [isLoadingUltra, setIsLoadingUltra] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [viewingNote, setViewingNote] = useState<any>(null); // New state for HTML Note Modal
  const [comparisonMessage, setComparisonMessage] = useState<string | null>(null);

  // DOWNLOAD MODAL STATE
  const [downloadModal, setDownloadModal] = useState<{isOpen: boolean, type: 'MARKSHEET' | 'FULL' | null}>({isOpen: false, type: null});

  // Comparison Logic (User Req)
  useEffect(() => {
      if (user.mcqHistory && result.chapterId) {
          // Sort by date desc
          const attempts = user.mcqHistory
              .filter(h => h.chapterId === result.chapterId)
              .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          // Current result is usually index 0 if updatedUser passed, but let's be safe
          const currentIdx = attempts.findIndex(h => h.id === result.id);

          // Next one is previous chronologically
          const previousAttempt = (currentIdx !== -1 && attempts.length > currentIdx + 1) ? attempts[currentIdx + 1] : null;

          if (previousAttempt) {
              const prevPct = Math.round((previousAttempt.score / previousAttempt.totalQuestions) * 100);
              const currPct = Math.round((result.score / result.totalQuestions) * 100);

              let msg = '';
              // Improvement or Same
              if (currPct >= prevPct) {
                  const improvement = currPct - prevPct;
                  msg = `Welcome ${user.name}, aapne achhi mehnat ki! Pichhli test me ${prevPct}% aapka marks tha, ish baar aapne ${currPct}% kiya. ${improvement > 0 ? `Improvement: ${improvement}%!` : 'Consistent performance!'}`;
              }
              // Decline (Strong -> Weak/Avg)
              else if (currPct < prevPct) {
                  msg = `Pahle se kharab hai... Pichhli baar ${prevPct}% tha, abhi ${currPct}% hai. Aapka score kam ho gaya hai. Aap revision kijiye.`;
              } else if (currPct > prevPct) {
                  msg = `Appka result pahle se achha hai! ${currPct - prevPct}% aapne achha kiya. Keep it up ${user.name}!`;
              } else {
                  msg = `Result same hai (${currPct}%). Thoda aur push karein!`;
              }

              if (msg) setComparisonMessage(msg);
          }
      }
  }, [result.id, user.mcqHistory]);

  const generateLocalAnalysis = () => {
      // Calculate weak/strong based on topicStats
      const topics = Object.keys(topicStats).map(t => {
          const s = topicStats[t];
          let status = 'AVERAGE';
          if (s.percent >= 80) status = 'STRONG';
          else if (s.percent < 50) status = 'WEAK';

          return {
              name: t,
              status,
              total: s.total,
              correct: s.correct,
              percent: s.percent,
              actionPlan: status === 'WEAK' ? 'Focus on basic concepts and practice more questions from this topic.' : 'Good job! Keep revising to maintain speed.',
              studyMode: status === 'WEAK' ? 'DEEP_STUDY' : 'QUICK_REVISION'
          };
      });

      return JSON.stringify({
          motivation: percentage > 80 ? "Excellent Performance! You are on track." : "Keep working hard. You can improve!",
          topics: topics,
      });
  };
  
  // TTS State
  const [voices, setVoices] = useState<{hindi: SpeechSynthesisVoice[], indianEnglish: SpeechSynthesisVoice[], others: SpeechSynthesisVoice[]}>({hindi: [], indianEnglish: [], others: []});
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  
  // TTS Playlist State
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const stopPlaylist = () => {
      setIsPlayingAll(false);
      setCurrentTrack(0);
      stopSpeech();
  };

  useEffect(() => {
    if (isPlayingAll && currentTrack < playlist.length) {
        speakText(
            playlist[currentTrack],
            selectedVoice,
            speechRate,
            'hi-IN',
            undefined, // onStart
            () => { // onEnd
                if (isPlayingAll) {
                    setCurrentTrack(prev => prev + 1);
                }
            }
        ).catch(() => setIsPlayingAll(false));
    } else if (currentTrack >= playlist.length && isPlayingAll) {
        setIsPlayingAll(false);
        setCurrentTrack(0);
    }
  }, [currentTrack, isPlayingAll, playlist, selectedVoice, speechRate]);

  // Stop Playlist on Tab Change
  useEffect(() => {
      stopPlaylist();
  }, [activeTab]);

  // Dialog State
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void}>({isOpen: false, title: '', message: '', onConfirm: () => {}});

  // RECOMMENDATION STATE
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  const [topicStats, setTopicStats] = useState<Record<string, {total: number, correct: number, percent: number}>>({});

  useEffect(() => {
      if (questions) {
          const stats: Record<string, {total: number, correct: number, percent: number}> = {};
          questions.forEach((q, idx) => {
              const topic = q.topic || 'General';
              if (!stats[topic]) stats[topic] = { total: 0, correct: 0, percent: 0 };
              stats[topic].total++;

              const omr = result.omrData?.find(d => d.qIndex === idx);
              if (omr && omr.selected === q.correctAnswer) {
                  stats[topic].correct++;
              }
          });

          Object.keys(stats).forEach(t => {
              stats[t].percent = Math.round((stats[t].correct / stats[t].total) * 100);
          });
          setTopicStats(stats);
      }
  }, [questions]);

  // Handle Initial View Logic
  useEffect(() => {
      if (initialView === 'RECOMMEND' && questions && questions.length > 0 && isAnalysisUnlocked) {
          // Allow state to settle, then open
          setTimeout(() => {
              handleRecommend();
          }, 500);
      }
  }, [initialView, questions, isAnalysisUnlocked]);

  // Auto-Load Recommendations on Tab Change
  useEffect(() => {
      // Only fetch if data is missing. Do NOT open modal automatically.
      if ((activeTab === 'RECOMMEND' || activeTab === 'PREMIUM_ANALYSIS' || activeTab === 'SOLUTION') && questions && questions.length > 0 && recommendations.length === 0 && isAnalysisUnlocked) {
          handleRecommend(false); // Pass false to suppress modal
      }
  }, [activeTab, questions, isAnalysisUnlocked]);

  const handleRecommend = async (openModal: boolean = false) => {
      if (!isAnalysisUnlocked) return;
      setRecLoading(true);

      const allTopics = Object.keys(topicStats);
      const streamKey = (result.classLevel === '11' || result.classLevel === '12') && user.stream ? `-${user.stream}` : '';
      const key = `nst_content_${user.board || 'CBSE'}_${result.classLevel || '10'}${streamKey}_${result.subjectName}_${result.chapterId}`;

      let chapterData: any = {};
      try { chapterData = await getChapterData(key); } catch (e) { console.error(e); }

      let universalData: any = {};
      try { universalData = await getChapterData('nst_universal_notes'); } catch (e) { console.error(e); }

      const recs: any[] = [];
      const freeHtml = chapterData?.freeNotesHtml || chapterData?.schoolFreeNotesHtml;
      const extractedTopics: string[] = [];
      if (freeHtml) {
           try {
               const doc = new DOMParser().parseFromString(freeHtml, 'text/html');
               const headers = doc.querySelectorAll('h1, h2, h3, h4');
               headers.forEach(h => {
                   if(h.textContent && h.textContent.length > 3) extractedTopics.push(h.textContent.trim());
               });
           } catch(e) {}
      }

      allTopics.forEach(wt => {
          const wtLower = wt.trim().toLowerCase();
          if (extractedTopics.length > 0) {
              const matchedHeader = extractedTopics.find(et => et.toLowerCase().includes(wtLower) || wtLower.includes(et.toLowerCase()));
              if (matchedHeader) {
                  recs.push({
                       title: matchedHeader,
                       topic: wt,
                       type: 'FREE_NOTES_LINK',
                       isPremium: false,
                       url: 'FREE_CHAPTER_NOTES',
                       access: 'FREE'
                  });
              }
          }
          if (universalData && universalData.notesPlaylist) {
              const matches = universalData.notesPlaylist.filter((n: any) =>
                  n.title.toLowerCase().includes(wtLower) ||
                  (n.topic && n.topic.toLowerCase().includes(wtLower)) ||
                  wtLower.includes(n.topic?.toLowerCase() || '')
              );
              recs.push(...matches.map((n: any) => ({
                  ...n,
                  topic: wt,
                  type: 'UNIVERSAL_NOTE',
                  isPremium: n.access === 'PREMIUM' || n.type === 'PDF'
              })));
          }
          if (chapterData && chapterData.topicNotes) {
              const matches = chapterData.topicNotes.filter((n: any) =>
                  (n.topic && n.topic.toLowerCase().trim() === wtLower) ||
                  (n.topic && n.topic.toLowerCase().includes(wtLower)) ||
                  (n.topic && wtLower.includes(n.topic.toLowerCase()))
              );
              recs.push(...matches.map((n: any) => ({
                  ...n,
                  topic: wt,
                  type: 'TOPIC_NOTE',
                  access: n.isPremium ? 'PREMIUM' : 'FREE',
                  isPremium: n.isPremium
              })));
          }
      });

      const uniqueRecs = recs.filter((v,i,a)=>a.findIndex(v2=>(v2.title===v.title && v2.topic === v.topic))===i);
      setRecommendations(uniqueRecs);
      setRecLoading(false);
  };

  const ITEMS_PER_PAGE = 50;
  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const omrData = result.omrData || [];
  const hasOMR = omrData.length > 0;
  const totalPages = Math.ceil(omrData.length / ITEMS_PER_PAGE);
  const currentData = omrData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const devName = settings?.footerText || 'Nadim Anwar';

  useEffect(() => {
    if (initialView === 'ANALYSIS' || result.ultraAnalysisReport) {
        if (result.ultraAnalysisReport) {
             setUltraAnalysisResult(result.ultraAnalysisReport);
        }
    }
  }, [initialView, result.ultraAnalysisReport]);

  useEffect(() => {
      getCategorizedVoices().then(v => {
          setVoices(v);
          const preferred = v.hindi[0] || v.indianEnglish[0] || v.others[0];
          if (preferred) setSelectedVoice(preferred);
      });
  }, []);

  const handleDownloadMarksheet = async () => {
      const element = document.getElementById('marksheet-style-1');
      if (!element) return;
      try {
          const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
          const imgData = canvas.toDataURL('image/png');

          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Marksheet_${user.name}_${result.chapterTitle}.pdf`);
      } catch (e) {
          console.error('Download failed', e);
          alert("Failed to generate PDF. Please try again.");
      }
  };

  const handleDownloadFullReport = async () => {
      setIsDownloadingAll(true);
      setTimeout(async () => {

          const element = document.getElementById('full-report-print-container'); // Capture HIDDEN PRINT content

          const element = document.getElementById('full-report-print-container');

          if (element) {
              try {
                  const canvas = await html2canvas(element, { scale: 1.5, backgroundColor: '#ffffff', useCORS: true });
                  const imgData = canvas.toDataURL('image/png');

                  const pdf = new jsPDF('p', 'mm', 'a4');
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                  let heightLeft = pdfHeight;
                  let position = 0;
                  const pageHeight = pdf.internal.pageSize.getHeight();

                  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                  heightLeft -= pageHeight;

                  while (heightLeft >= 0) {
                      position = heightLeft - pdfHeight;
                      pdf.addPage();
                      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                      heightLeft -= pageHeight;
                  }

                  pdf.save(`Full_Report_${user.name}.pdf`);
              } catch (e) {
                  console.error('Full PDF Download Failed', e);
                  alert("Could not generate PDF. Please try again.");
              }
          } else {
              alert("Error: Print container not found.");
          }
          setIsDownloadingAll(false);
      }, 500);
  };

  const handleShare = async () => {
      const appLink = settings?.officialAppUrl || "https://play.google.com/store/apps/details?id=com.nsta.app"; 
      const text = `*${settings?.appName || 'IDEAL INSPIRATION CLASSES'} RESULT*\n\nName: ${user.name}\nScore: ${result.score}/${result.totalQuestions}\nAccuracy: ${percentage}%\nCheck attached PDF for details.\n\nDownload App: ${appLink}`;

      if (navigator.share) {
          try {
              const element = document.getElementById('marksheet-style-1');
              if (element) {
                  const canvas = await html2canvas(element, { scale: 1.5, backgroundColor: '#ffffff', useCORS: true });
                  const imgData = canvas.toDataURL('image/png');
                  const pdf = new jsPDF('p', 'mm', 'a4');
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

                  const blob = pdf.output('blob');
                  const file = new File([blob], "Result_Analysis.pdf", { type: "application/pdf" });

                  if (navigator.canShare && navigator.canShare({ files: [file] })) {
                      await navigator.share({
                          title: 'My Result Analysis',
                          text: text,
                          files: [file]
                      });
                      return;
                  }
              }
          } catch(e) { console.error("Share File Failed", e); }
          try { await navigator.share({ title: 'Result', text }); } catch(e) {}
      } else {
          handleDownloadMarksheet();
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
  };

  const unlockFreeAnalysis = () => {
      const COST = 20;
      if (user.credits < COST) {
          alert(`Insufficient Credits! Unlock costs ${COST} coins.`);
          return;
      }
      setConfirmConfig({
          isOpen: true,
          title: "Unlock Analysis",
          message: `View answers and explanations for ${COST} Coins?`,
          onConfirm: () => {
              if (onUpdateUser) onUpdateUser({ ...user, credits: user.credits - COST });
              setIsAnalysisUnlocked(true);
              setConfirmConfig(prev => ({...prev, isOpen: false}));
          }
      });
  };

  const handleUltraAnalysis = async (skipCost: boolean = false) => {
      if (result.ultraAnalysisReport) {
          setUltraAnalysisResult(result.ultraAnalysisReport);
          return;
      }
      if (!questions || questions.length === 0) return;

      const cost = settings?.mcqAnalysisCostUltra ?? 20;
      if (!skipCost) {
          if (user.credits < cost) {
              alert(`Insufficient Credits! You need ${cost} coins for Analysis Ultra.`);
              return;
          }
          if (!confirm(`Unlock AI Analysis Ultra for ${cost} Coins?`)) return;
      }

      setIsLoadingUltra(true);
      try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          const analysisText = generateLocalAnalysis();
          setUltraAnalysisResult(analysisText);

          const updatedResult = { ...result, ultraAnalysisReport: analysisText };
          const updatedHistory = (user.mcqHistory || []).map(r => r.id === result.id ? updatedResult : r);
          
          const updatedUser = { 
              ...user, 
              credits: skipCost ? user.credits : user.credits - cost,
              mcqHistory: updatedHistory
          };
          localStorage.setItem('nst_current_user', JSON.stringify(updatedUser));
          await saveUserToLive(updatedUser);
          if (onUpdateUser) onUpdateUser(updatedUser);

          await saveUniversalAnalysis({
              id: `analysis-${Date.now()}`,
              userId: user.id,
              userName: user.name,
              date: new Date().toISOString(),
              subject: result.subjectName,
              chapter: result.chapterTitle,
              score: result.score,
              totalQuestions: result.totalQuestions,
              userPrompt: `Analysis`,
              aiResponse: analysisText,
              cost: skipCost ? 0 : cost
          });
      } catch (error: any) {
          console.error("Ultra Analysis Error:", error);
      } finally {
          setIsLoadingUltra(false);
      }
  };

  const handleRetryMistakes = () => {
      let wrongQs = result.wrongQuestions || [];
      if (wrongQs.length === 0 && questions) {
          wrongQs = questions.filter((q, i) => {
              const omr = result.omrData?.find(d => d.qIndex === i);
              return omr && omr.selected !== -1 && omr.selected !== q.correctAnswer;
          });
      }
      if (!wrongQs || wrongQs.length === 0) {
          alert("No mistakes to retry! Great job.");
          return;
      }
      if (onLaunchContent) {
          onLaunchContent({
              id: `RETRY_${result.id}`,
              title: `Retry Mistakes: ${result.chapterTitle}`,
              type: 'MCQ_SIMPLE',
              mcqData: wrongQs,
              subtitle: 'Mistake Review Session'
          });
      }
  };

  const renderOMRRow = (qIndex: number, selected: number, correct: number) => {
      const options = [0, 1, 2, 3];
      return (
          <div key={qIndex} className="flex items-center gap-3 mb-2">
              <span className="w-6 text-[10px] font-bold text-slate-500 text-right">{qIndex + 1}</span>
              <div className="flex gap-1.5">
                  {options.map((opt) => {
                      let bgClass = "bg-white border border-slate-300 text-slate-400";
                      if (selected === opt) {
                          if (correct === opt) bgClass = "bg-green-600 border-green-600 text-white shadow-sm";
                          else bgClass = "bg-red-500 border-red-500 text-white shadow-sm";
                      } else if (correct === opt && selected !== -1) {
                          bgClass = "bg-green-600 border-green-600 text-white opacity-80"; 
                      } else if (correct === opt && selected === -1) {
                          bgClass = "border-green-500 text-green-600 bg-green-50";
                      }
                      return (
                          <div key={opt} className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${bgClass}`}>
                              {String.fromCharCode(65 + opt)}
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  const startSpeaking = (text: string) => {
      speakText(text, selectedVoice, speechRate);
      setIsSpeaking(true);
  };

  // --- SECTION RENDERERS ---

  const generateTeacherRemarks = (percent: number, topic: string, prevPercent?: number, hasPrev?: boolean) => {
      const isHindi = user.board === 'BSEB';

      // Comparison Logic
      if (hasPrev && prevPercent !== undefined) {
          const diff = percent - prevPercent;
          if (diff > 0) {
              return isHindi
                  ? `Badhai ho! Pichhli baar se aapne ${diff}% improve kiya hai (${prevPercent}% -> ${percent}%). ${topic} me aapki mehnat dikh rahi hai!`
                  : `Great improvement! You scored ${percent}% compared to ${prevPercent}% last time. Your hard work in ${topic} is showing!`;
          } else if (diff < 0) {
               return isHindi
                  ? `Dhyan dein! Pichhli baar aapka score ${prevPercent}% tha, jo gir kar ${percent}% ho gaya hai. ${topic} me revision ki zarurat hai.`
                  : `Performance dropped. You scored ${percent}% compared to ${prevPercent}% last time. Focus more on ${topic} revision.`;
          } else {
               return isHindi
                  ? `Performance consistent hai (${percent}%). Thoda aur push karein taaki score badhe.`
                  : `Performance is consistent at ${percent}%. Push a little harder to improve next time.`;
          }
      }

      if (percent >= 80) return isHindi
          ? `Shabash! ${topic} me aapne bahut achha kiya hai. Is pakad ko banaye rakhein.`
          : `Excellent work in ${topic}! Your grasp on this topic is strong. Keep practicing to maintain this level.`;

      if (percent >= 50) return isHindi
          ? `${topic} me thik hai, par thoda aur sudhar ho sakta hai. Revision karein.`
          : `Good effort in ${topic}. You are doing okay, but a little more revision will help you reach the top level.`;

      return isHindi
          ? `${topic} me aapka performance kamzor hai. Kripya notes padhein aur dubara koshish karein.`
          : `You need to focus on ${topic}. Your score is low here. Please read the recommended notes and try again.`;
  };

  const renderWeakAreasSummary = () => {
      const weakTopics = Object.keys(topicStats).filter(t => topicStats[t].percent < 50);
      if (weakTopics.length === 0) return null;

      return (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 animate-in slide-in-from-top-4">
              <h3 className="text-sm font-black text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle size={16} /> Weak Areas (Needs Focus)
              </h3>
              <div className="flex flex-wrap gap-2">
                  {weakTopics.map(t => (
                      <span key={t} className="px-3 py-1 bg-white border border-red-200 rounded-full text-xs font-bold text-red-600 shadow-sm">
                          {t} ({topicStats[t].percent}%)
                      </span>
                  ))}
              </div>
              <p className="text-[10px] text-red-500 font-bold mt-3">
                  Please review these topics carefully before the next test.
              </p>
          </div>
      );
  };

  const renderGranularAnalysis = () => {
      const topics = Object.keys(topicStats);

      // Find previous result for comparison
      const previousResult = (user.mcqHistory || [])
          .filter(h => h.chapterId === result.chapterId && h.id !== result.id)
          .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      return (
          <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                      <h3 className="text-xl font-black mb-2 flex items-center gap-2"><BrainCircuit className="text-yellow-400" /> Analysis Dashboard</h3>
                      <p className="text-slate-300 text-xs font-medium mb-4">Detailed breakdown of your performance by topic.</p>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/5 skew-x-12 -mr-8"></div>
              </div>

              {renderWeakAreasSummary()}

              {topics.map((topic, i) => {
                  const stats = topicStats[topic];
                  const percent = stats.percent;
                  const status = percent >= 80 ? 'STRONG' : percent >= 50 ? 'AVERAGE' : 'WEAK';

                  // Compare with previous
                  let prevPercent = 0;
                  let hasPrev = false;
                  if (previousResult && previousResult.topicAnalysis && previousResult.topicAnalysis[topic]) {
                      prevPercent = previousResult.topicAnalysis[topic].percentage;
                      hasPrev = true;
                  }

                  const diff = percent - prevPercent;
                  // Filter questions for this topic
                  const topicQuestions = questions?.filter((q, idx) => {
          const t = q.topic || 'General';
          return t === topic;
      }) || [];

      // Calculate Topic-Specific Percentage
      const topicStats = { correct: 0, total: 0 };
      topicQuestions.forEach(q => {
          const globalIdx = questions?.indexOf(q) ?? -1;
          const omr = result.omrData?.find(d => d.qIndex === globalIdx);
          if (omr && omr.selected === q.correctAnswer) topicStats.correct++;
          topicStats.total++;
      });
      const topicPercent = topicStats.total > 0 ? Math.round((topicStats.correct / topicStats.total) * 100) : 0;

      // Find Previous Attempt for SAME Topic
      let prevTopicPercent = 0;
      let hasPrevTopic = false;
      if (previousResult && previousResult.topicAnalysis && previousResult.topicAnalysis[topic]) {
          prevTopicPercent = previousResult.topicAnalysis[topic].percentage;
          hasPrevTopic = true;
      }

      const remarks = generateTeacherRemarks(topicPercent, topic, prevTopicPercent, hasPrevTopic);

                  return (
                      <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                          {/* 1. Topic Header & Status */}
                          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                              <div>
                                  <h4 className="font-black text-slate-800 text-sm uppercase flex items-center gap-2">
                                      {topic}
                                      {status === 'WEAK' && <AlertCircle size={14} className="text-red-500" />}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${status === 'STRONG' ? 'bg-green-100 text-green-700' : status === 'AVERAGE' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                          {status}
                                      </span>
                                      {/* 2. Historical Comparison */}
                                      {hasPrev && (
                                          <span className={`text-[10px] font-bold flex items-center gap-1 ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                              {diff > 0 ? <ArrowUp size={10} /> : diff < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
                                              {Math.abs(diff)}% vs Last ({prevPercent}%)
                                          </span>
                                      )}
                                  </div>
                              </div>
                              {/* 3. Stats */}
                              <div className="text-right">
                                  <div className={`text-2xl font-black ${percent >= 80 ? 'text-green-600' : percent < 50 ? 'text-red-600' : 'text-slate-800'}`}>{percent}%</div>
                                  <div className="text-[10px] text-slate-500 font-bold">{stats.correct}/{stats.total} Correct</div>
                              </div>
                          </div>

                          <div className="p-4 bg-white">
                              {/* 4. Teacher Remarks */}
                              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-4 flex gap-3">
                                  <div className="shrink-0 bg-white p-1.5 rounded-full h-fit shadow-sm text-indigo-600">
                                      <Sparkles size={16} />
                                  </div>
                                  <div>
                                      <div className="text-xs text-indigo-900 font-medium leading-relaxed italic">
                                          "<span dangerouslySetInnerHTML={{ __html: renderMathInHtml(remarks) }} />"
                                      </div>
                                      <div className="flex gap-2 mt-2 items-center">
                                          <SpeakButton text={stripHtml(remarks)} className="p-0 hover:bg-transparent text-indigo-600" iconSize={14} />
                                          <span className="text-[10px] font-bold text-indigo-600">Teacher Remark</span>
                                      </div>
                                  </div>
                              </div>

                              {/* 5. Questions Accordion List */}
                              <div className="space-y-2">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Questions in this Topic</p>
                                  {topicQuestions.map((q, localIdx) => {
                                      const globalIdx = questions?.indexOf(q) ?? -1;
                                      const omrEntry = result.omrData?.find(d => d.qIndex === globalIdx);
                                      const userSelected = omrEntry ? omrEntry.selected : -1;
                                      const isCorrect = userSelected === q.correctAnswer;
                                      const isSkipped = userSelected === -1;

                                      return (
                                          <div key={localIdx} className={`text-xs border rounded-lg overflow-hidden transition-all ${isCorrect ? 'border-green-200 bg-green-50/30' : isSkipped ? 'border-slate-200 bg-slate-50' : 'border-red-200 bg-red-50/30'}`}>
                                              <details className="group">
                                                  <summary className="flex items-center justify-between p-3 cursor-pointer list-none select-none">
                                                      <div className="flex items-center gap-2 overflow-hidden">
                                                          <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center font-bold text-[10px] ${isCorrect ? 'bg-green-100 text-green-700' : isSkipped ? 'bg-slate-200 text-slate-600' : 'bg-red-100 text-red-600'}`}>
                                                              {globalIdx + 1}
                                                          </span>
                                                          <div className="font-medium text-slate-700 truncate pr-2" dangerouslySetInnerHTML={{__html: stripHtml(q.question)}} />
                                                      </div>
                                                      <div className="shrink-0">
                                                          <ChevronDown size={14} className="text-slate-400 group-open:rotate-180 transition-transform" />
                                                      </div>
                                                  </summary>
                                                  <div className="px-3 pb-3 pt-0 border-t border-dashed border-slate-200 mt-2 bg-white">
                                                      <div className="mt-2 text-slate-800 font-bold mb-2" dangerouslySetInnerHTML={{__html: renderMathInHtml(q.question)}} />
                                                      <div className="space-y-1 mb-2">
                                                          {q.options?.map((opt, optIdx) => {
                                                              const isAns = optIdx === q.correctAnswer;
                                                              const isSel = optIdx === userSelected;
                                                              let cls = "text-slate-500";
                                                              if (isAns) cls = "text-green-700 font-bold";
                                                              if (isSel && !isAns) cls = "text-red-700 font-bold line-through decoration-red-500";

                                                              return (
                                                                  <div key={optIdx} className={`flex gap-2 ${cls}`}>
                                                                      <span className="w-4 shrink-0">{String.fromCharCode(65+optIdx)}.</span>
                                                                      <span dangerouslySetInnerHTML={{__html: renderMathInHtml(opt)}} />
                                                                      {isAns && <CheckCircle size={12} className="ml-1 text-green-600 inline" />}
                                                                      {isSel && !isAns && <XCircle size={12} className="ml-1 text-red-600 inline" />}
                                                                  </div>
                                                              );
                                                          })}
                                                      </div>
                                                      <div className="p-2 bg-blue-50 rounded text-blue-800 italic text-[10px]">
                                                          <span className="font-bold not-italic">Explanation: </span>
                                                          <span dangerouslySetInnerHTML={{__html: renderMathInHtml(q.explanation || 'Not available')}} />
                                                      </div>
                                                      <div className="mt-2 text-right">
                                                          <SpeakButton
                                                              text={`Question ${globalIdx + 1}. ${stripHtml(q.question)}. The correct answer is option ${String.fromCharCode(65 + q.correctAnswer)}. Explanation: ${stripHtml(q.explanation || '')}`}
                                                              className="text-slate-400 hover:text-indigo-600 inline-flex"
                                                              iconSize={14}
                                                          />
                                                      </div>
                                                  </div>
                                              </details>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      );
  };

  const renderAnalysisContent = () => {
    let data;
    try { data = JSON.parse(ultraAnalysisResult); } catch (e) {
        return <div className="p-4 bg-white rounded border border-slate-200 whitespace-pre-wrap text-sm"><ReactMarkdown>{ultraAnalysisResult}</ReactMarkdown></div>;
    }
    return (
        <div className="space-y-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-lg uppercase text-slate-800 border-b pb-2">AI Performance Analysis</h3>
            {data.motivation && (
                <div className="bg-white p-4 rounded border border-indigo-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-700 italic">"{data.motivation}"</p>
                </div>
            )}
            <div className="grid gap-4">
                {data.topics?.map((t: any, i: number) => (
                    <div key={i} className="bg-white p-3 rounded border border-slate-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm text-slate-800">{t.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.status === 'WEAK' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{t.status}</span>
                        </div>
                        <p className="text-xs text-slate-600">{t.actionPlan}</p>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const renderRecommendationsSection = () => {
      if (recLoading) {
          return (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="font-bold text-xs uppercase tracking-widest">Finding best notes...</p>
              </div>
          );
      }

      if (recommendations.length === 0) {
          return (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <FileSearch size={48} className="mb-4 opacity-50" />
                  <h4 className="font-bold text-slate-600 mb-2">No Recommendations Found</h4>
                  <p className="text-xs text-center max-w-xs mb-6">
                      We couldn't find specific notes for your weak topics in this chapter.
                      Try searching the main library or ask AI for help.
                  </p>
                  <button
                      onClick={() => handleRecommend(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 flex items-center gap-2"
                  >
                      <RefreshCw size={14} /> Retry
                  </button>
              </div>
          );
      }

      const groupedRecs: Record<string, any[]> = {};
      recommendations.forEach(rec => {
          const topic = rec.topic || 'General';
          if(!groupedRecs[topic]) groupedRecs[topic] = [];
          groupedRecs[topic].push(rec);
      });
      const displayTopics = Object.keys(topicStats).sort((a, b) => topicStats[a].percent - topicStats[b].percent);

      return (
          <div className="bg-slate-50 min-h-full">
              <div className="px-4 space-y-8 pb-20 pt-4">
                  {displayTopics.map((topicName, idx) => {
                      const relevantRecs = groupedRecs[topicName] || [];
                      if (relevantRecs.length === 0) {
                          const key = Object.keys(groupedRecs).find(k => k.toLowerCase() === topicName.toLowerCase());
                          if (key) relevantRecs.push(...groupedRecs[key]);
                      }
                      const topicWrongQs = questions?.filter(q => {
                           const isTopicMatch = (q.topic && q.topic.toLowerCase().includes(topicName.toLowerCase()));
                           if (!isTopicMatch) return false;
                           const omr = result.omrData?.find((d: any) => questions && d.qIndex === questions.indexOf(q));
                           return omr && omr.selected !== -1 && omr.selected !== q.correctAnswer;
                      }) || [];
                      if (relevantRecs.length === 0 && topicWrongQs.length === 0) return null;

                      return (
                          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                              <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-sm uppercase">{topicName}</div>
                              <div className="p-4 space-y-4">
                                  {relevantRecs.map((rec, rIdx) => (
                                      <div key={rIdx} className="flex justify-between items-center p-3 border rounded-xl">
                                          <div className="flex items-center gap-2">
                                              <div className="text-xs font-bold text-slate-700">{rec.title}</div>
                                              <SpeakButton text={`Recommended Note: ${rec.title}. Topic: ${topicName}`} className="p-1" iconSize={14} />
                                          </div>
                                          <div className="flex gap-2">
                                              <span className="text-[10px] bg-slate-100 px-2 py-1 rounded">{rec.isPremium ? 'Premium' : 'Free'}</span>
                                              <button
                                                  onClick={() => {
                                                      if (rec.isPremium) {
                                                          if (onLaunchContent) {
                                                              onLaunchContent({
                                                                  id: `REC_PREM_${idx}_${rIdx}`,
                                                                  title: rec.title,
                                                                  type: 'PDF',
                                                                  directResource: { url: rec.url, access: rec.access }
                                                              });
                                                          } else {
                                                              window.open(rec.url, '_blank');
                                                          }
                                                      } else {
                                                          if (rec.content) {
                                                              setViewingNote(rec);
                                                          } else if (onLaunchContent) {
                                                              onLaunchContent({
                                                                  id: `REC_FREE_${idx}_${rIdx}`,
                                                                  title: rec.title,
                                                                  type: 'PDF',
                                                                  directResource: { url: rec.url, access: rec.access }
                                                              });
                                                          }
                                                      }
                                                  }}
                                                  className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold"
                                              >
                                                  {rec.isPremium ? 'View PDF' : 'Read'}
                                              </button>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  const renderProgressDelta = () => {
      // Fetch past 3 results + current
      const history = (user.mcqHistory || [])
          .filter(h => h.chapterId === result.chapterId)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ascending date

      // Find index of current result to slice properly (or just take last 4 if current is latest)
      // Since 'result' might be from history, we find its position
      const currentIndex = history.findIndex(h => h.id === result.id);

      // If current result not in history yet (rare edge case), assume it's latest
      const relevantHistory = currentIndex !== -1
          ? history.slice(Math.max(0, currentIndex - 3), currentIndex + 1)
          : [...history.slice(-3), result];

      if (relevantHistory.length <= 1) return null; // No past history to compare

      return (
          <div className="bg-white rounded-2xl p-5 mb-6 border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-600" /> Progress Trend (Last 3 Tests + Current)
              </h4>
              <div className="flex items-end justify-between gap-2 h-24 px-2">
                  {relevantHistory.map((h, i) => {
                      const pct = Math.round((h.score / h.totalQuestions) * 100);
                      const isCurrent = h.id === result.id;
                      const barColor = isCurrent
                          ? (pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : 'bg-red-500')
                          : 'bg-slate-200';

                      return (
                          <div key={i} className="flex flex-col items-center flex-1 group relative">
                              <div className="text-[10px] font-bold text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-4">{pct}%</div>
                              <div
                                  className={`w-full max-w-[20px] rounded-t-sm transition-all duration-500 ${barColor}`}
                                  style={{ height: `${Math.max(10, pct)}%` }}
                              ></div>
                              <div className={`text-[9px] font-bold mt-2 truncate max-w-full ${isCurrent ? 'text-blue-700' : 'text-slate-400'}`}>
                                  {isCurrent ? 'Now' : `T-${relevantHistory.length - 1 - i}`}
                              </div>
                          </div>
                      );
                  })}
              </div>
              <div className="mt-4 flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400">Consistency is key!</span>
                  <div className="flex gap-4">
                      {relevantHistory.map((h, i) => {
                          const pct = Math.round((h.score / h.totalQuestions) * 100);
                          const isCurrent = h.id === result.id;
                          if (!isCurrent) return null; // Only show current diff vs immediate prev

                          const prev = relevantHistory[i - 1];
                          if (!prev) return null;
                          const prevPct = Math.round((prev.score / prev.totalQuestions) * 100);
                          const diff = pct - prevPct;

                          return (
                              <span key={i} className={`text-xs font-black ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                  {diff >= 0 ? '+' : ''}{diff}% vs Last
                              </span>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  };

  const renderTopicBreakdown = () => {
      const topics = Object.keys(topicStats);
      if (topics.length === 0) return null;
      return (
          <div className="space-y-6">
               {renderProgressDelta()}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><BarChart3 size={18} /> Topic Breakdown</h3>
                  <div className="space-y-4">
                      {topics.map((topic, i) => {
                          const stats = topicStats[topic];
                          return (
                              <div key={i}>
                                  <div className="flex justify-between items-end mb-1">
                                      <span className="font-bold text-slate-700 text-xs uppercase">{topic}</span>
                                      <span className="text-xs font-black">{stats.correct}/{stats.total} ({stats.percent}%)</span>
                                  </div>
                                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                      <div className={`h-full ${stats.percent >= 80 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${stats.percent}%` }}></div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  };


  // MARKSHET STYLE 1: Centered Logo
  const renderMarksheetStyle1 = (customId?: string) => (
      <div id={customId || "marksheet-style-1"} className="bg-white p-8 max-w-2xl mx-auto border-4 border-slate-900 rounded-none relative">
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-900"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-900"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-900"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-900"></div>
          
          {/* Header */}
          <div className="text-center mb-8">

  const renderFullOMR = () => (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6">
          <h3 className="font-black text-slate-800 text-lg mb-4">Complete OMR Sheet</h3>
          <div className="grid grid-cols-4 gap-x-4 gap-y-2">
              {result.omrData?.map((data) => renderOMRRow(data.qIndex, data.selected, data.correct))}
          </div>
      </div>
  );

  const renderDetailedSolutions = () => (
      <div className="space-y-6 mt-6">
          <h3 className="font-black text-slate-800 text-lg border-b pb-2">Detailed Solutions</h3>
          {questions?.map((q, idx) => {
              const omrEntry = result.omrData?.find(d => d.qIndex === idx);
              const userSelected = omrEntry ? omrEntry.selected : -1;
              const isCorrect = userSelected === q.correctAnswer;

              // Prepare TTS Text
              const cleanQuestion = stripHtml(q.question);
              const cleanExplanation = q.explanation ? stripHtml(q.explanation) : '';
              const correctAnswerText = q.options ? stripHtml(q.options[q.correctAnswer]) : '';
              const ttsText = `Question ${idx + 1}. ${cleanQuestion}. The correct answer is option ${String.fromCharCode(65 + q.correctAnswer)}, which is ${correctAnswerText}. Explanation: ${cleanExplanation}`;

              return (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm break-inside-avoid relative group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <SpeakButton text={ttsText} className="bg-slate-100 hover:bg-slate-200 text-slate-600" iconSize={16} />
                      </div>
                      <div className="flex gap-2 mb-2 pr-8">
                          <span className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{idx + 1}</span>
                          <div className="text-sm font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: renderMathInHtml(q.question) }} />
                      </div>
                      <div className="ml-8 space-y-1">
                          {q.options?.map((opt: string, optIdx: number) => {
                              const isAnswer = q.correctAnswer === optIdx;
                              const isSelected = userSelected === optIdx;
                              let cls = "text-slate-600";
                              if (isAnswer) cls = "text-green-700 font-bold bg-green-50 px-2 rounded";
                              else if (isSelected) cls = "text-red-700 font-bold bg-red-50 px-2 rounded";

                              return (
                                  <div key={optIdx} className={`text-xs ${cls}`}>
                                      {String.fromCharCode(65 + optIdx)}. <span dangerouslySetInnerHTML={{ __html: renderMathInHtml(opt) }} />
                                  </div>
                              );
                          })}
                      </div>
                      <div className="ml-8 mt-2 p-2 bg-slate-50 text-[10px] text-slate-600 italic rounded">
                          <span className="font-bold">Explanation:</span> <span dangerouslySetInnerHTML={{ __html: renderMathInHtml(q.explanation || 'N/A') }} />
                      </div>
                  </div>
              );
          })}
      </div>
  );

  const renderMarksheetStyle1 = () => (
      <div id="marksheet-style-1" className="bg-white p-8 max-w-2xl mx-auto border-4 border-double border-slate-900 relative shadow-sm">
          {/* Professional Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-6">

              {settings?.appLogo && (
                  <img src={settings.appLogo} alt="Logo" className="w-20 h-20 object-contain" />
              )}
              <div className="text-right flex-1 ml-4">
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wide">{settings?.appName || 'INSTITUTE NAME'}</h1>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{settings?.aiName || 'OFFICIAL RESULT REPORT'}</p>
              </div>
          </div>

          {/* Student Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="p-3 border border-slate-200 bg-slate-50 rounded">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Student Name</p>
                  <p className="font-bold text-slate-900 text-lg">{user.name}</p>
              </div>
              <div className="p-3 border border-slate-200 bg-slate-50 rounded">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Enrollment ID</p>
                  <p className="font-mono font-bold text-slate-900 text-lg">{user.displayId || user.id}</p>
              </div>
              <div className="p-3 border border-slate-200 bg-slate-50 rounded">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Test Date</p>
                  <p className="font-bold text-slate-900">{new Date(result.date).toLocaleDateString()}</p>
              </div>
              <div className="p-3 border border-slate-200 bg-slate-50 rounded">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Subject / Chapter</p>
                  <p className="font-bold text-slate-900 truncate">{result.chapterTitle}</p>
              </div>
          </div>

          {/* Score Summary Grid */}
          <div className="mb-8 border-t-2 border-slate-900 pt-6">
              <h3 className="text-center font-black text-slate-900 uppercase mb-4 tracking-widest text-sm">Performance Summary</h3>
              <div className="grid grid-cols-4 gap-2 text-center mb-6">
                  <div className="p-2 border bg-slate-50"><div className="text-[10px] text-slate-500 uppercase font-bold">Total</div><div className="font-black text-xl">{result.totalQuestions}</div></div>
                  <div className="p-2 border bg-slate-50"><div className="text-[10px] text-slate-500 uppercase font-bold">Attempted</div><div className="font-black text-xl">{result.correctCount + result.wrongCount}</div></div>
                  <div className="p-2 border bg-green-50 border-green-200"><div className="text-[10px] text-green-600 uppercase font-bold">Correct</div><div className="font-black text-xl text-green-700">{result.correctCount}</div></div>
                  <div className="p-2 border bg-red-50 border-red-200"><div className="text-[10px] text-red-600 uppercase font-bold">Wrong</div><div className="font-black text-xl text-red-700">{result.wrongCount}</div></div>
              </div>

              {/* Big Score Display */}
              <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Score Achieved</p>
                      <div className="text-6xl font-black text-slate-900 leading-none">{result.score}</div>
                  </div>
                  <div className="h-16 w-px bg-slate-300"></div>
                  <div className="text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Percentage</p>
                      <div className={`text-4xl font-black leading-none ${percentage >= 80 ? 'text-green-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{percentage}%</div>
                  </div>
              </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t-2 border-slate-900 pt-4 mt-8 flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              <span>Generated on {new Date().toLocaleDateString()}</span>
              <span>{settings?.appName} Official Record</span>
          </div>
      </div>
  );

  const renderFullReport = () => (
      <div className="p-8 bg-white max-w-4xl mx-auto space-y-8">
          {renderMarksheetStyle1()}
          <div className="border-t-2 border-dashed border-slate-300 my-8"></div>
          {renderAnalysisContent()}
          {renderTopicBreakdown()}
          {renderFullOMR()}
          {renderDetailedSolutions()}
      </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">


        {/* HIDDEN PRINT CONTAINER (For Full PDF Generation) */}
        <div id="full-report-print-container" style={{ position: 'fixed', top: 0, left: -9999, width: '800px', backgroundColor: 'white', zIndex: -1 }}>
            {/* PAGE 1: MARKSHEET */}
            <div className="p-8 min-h-[1100px] border-b-2 border-dashed border-slate-300">
                {renderMarksheetStyle1("print-marksheet-id")}
            </div>

            {/* PAGE 2: ANALYSIS & BREAKDOWN */}
            <div className="p-8 min-h-[1100px] border-b-2 border-dashed border-slate-300">
                <h2 className="text-2xl font-black mb-6 uppercase text-slate-800 border-b-4 border-slate-800 pb-2">Detailed Analysis</h2>
                {renderProgressDelta()}
                <div className="mt-8">
                    {renderTopicBreakdown()}
                </div>
                <div className="mt-8">
                    {renderAnalysisContent()}
                </div>
            </div>

            {/* PAGE 3: OMR SHEET */}
            <div className="p-8 min-h-[1100px] border-b-2 border-dashed border-slate-300">
                <h2 className="text-2xl font-black mb-6 uppercase text-slate-800 border-b-4 border-slate-800 pb-2">OMR Response Sheet</h2>
                <div className="grid grid-cols-4 gap-4 text-xs">
                    {result.omrData?.map((data) => renderOMRRow(data.qIndex, data.selected, data.correct))}
                </div>
            </div>

            {/* PAGE 4: MISTAKES & SOLUTIONS */}
            <div className="p-8 min-h-[1100px]">
                <h2 className="text-2xl font-black mb-6 uppercase text-slate-800 border-b-4 border-slate-800 pb-2">Full Solutions & Mistakes</h2>
                <div className="space-y-6">
                    {questions?.map((q, idx) => {
                        const omrEntry = result.omrData?.find(d => d.qIndex === idx);
                        const userSelected = omrEntry ? omrEntry.selected : -1;
                        const isCorrect = userSelected === q.correctAnswer;
                        const isSkipped = userSelected === -1;

                        return (
                            <div key={idx} className={`p-4 border rounded-lg ${!isCorrect && !isSkipped ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                                <p className="font-bold text-sm mb-2 text-slate-800">Q{idx + 1}. {stripHtml(q.question)}</p>
                                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                    {q.options.map((opt: string, oIdx: number) => (
                                        <div key={oIdx} className={`p-1 border rounded ${q.correctAnswer === oIdx ? 'bg-green-100 border-green-300 font-bold' : userSelected === oIdx ? 'bg-red-100 border-red-300' : 'bg-white'}`}>
                                            {String.fromCharCode(65 + oIdx)}. {stripHtml(opt)}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 italic">
                                    {isCorrect ? '✅ Correct' : isSkipped ? '⚪ Skipped' : '❌ Wrong'}
                                </p>
                                {q.explanation && (
                                    <div className="mt-2 text-xs bg-slate-50 p-2 rounded">
                                        <span className="font-bold">Explanation:</span> {stripHtml(q.explanation)}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>


        <CustomConfirm
            isOpen={confirmConfig.isOpen}
            title={confirmConfig.title}
            message={confirmConfig.message}
            onConfirm={confirmConfig.onConfirm}
            onCancel={() => setConfirmConfig({...confirmConfig, isOpen: false})}
        />

        {/* HIDDEN PRINT CONTAINER */}
        <div id="full-report-print-container" style={{ position: 'absolute', left: '-10000px', width: '800px' }}>
            {renderFullReport()}
        </div>

        <div className="w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-white text-slate-800 px-4 py-3 border-b border-slate-100 flex justify-between items-center z-10 sticky top-0 shrink-0">
                <div className="flex items-center gap-3">
                    {settings?.appLogo && <img src={settings.appLogo} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-slate-50 border" />}
                    <div>
                        <h1 className="text-sm font-black uppercase text-slate-900 tracking-wide">{settings?.appName || 'RESULT'}</h1>
                        <p className="text-[10px] font-bold text-slate-400">Official Marksheet</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
            </div>

            {/* Comparison Alert */}
            {comparisonMessage && (
                <div className="px-4 pt-2">
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex gap-3 animate-in slide-in-from-top-2">
                        <div className="bg-white p-2 rounded-full h-fit shadow-sm text-blue-600"><TrendingUp size={16} /></div>
                        <p className="text-xs text-blue-800 font-medium leading-relaxed">{comparisonMessage}</p>
                    </div>
                </div>
            )}

            {/* Tab Header */}
            <div className="px-4 pt-2 pb-0 bg-white border-b border-slate-100 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide items-center">
                {mcqMode === 'FREE' && (
                    <button onClick={() => setActiveTab('OFFICIAL_MARKSHEET')} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${activeTab === 'OFFICIAL_MARKSHEET' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                        <FileText size={14} className="inline mr-1 mb-0.5" /> Official Marksheet
                    </button>
                )}
                {!isAnalysisUnlocked ? (
                    <button onClick={unlockFreeAnalysis} className="px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 border-transparent text-slate-400 hover:text-slate-600 flex items-center gap-1 bg-slate-50/50">
                        <Lock size={12} /> Analysis (Locked)
                    </button>
                ) : (
                    <>
                        <button onClick={() => setActiveTab('SOLUTION')} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${activeTab === 'SOLUTION' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                            <FileSearch size={14} className="inline mr-1 mb-0.5" /> Analysis
                        </button>
                        <button onClick={() => setActiveTab('MISTAKES')} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${activeTab === 'MISTAKES' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                            <XCircle size={14} className="inline mr-1 mb-0.5" /> Mistakes
                        </button>
                        <button onClick={() => setActiveTab('AI_ANALYSIS')} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${activeTab === 'AI_ANALYSIS' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                            <BrainCircuit size={14} className="inline mr-1 mb-0.5" /> AI Insights
                        </button>
                        <button onClick={() => setActiveTab('OMR')} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${activeTab === 'OMR' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                            <Grid size={14} className="inline mr-1 mb-0.5" /> OMR
                        </button>
                        <button onClick={() => setActiveTab('RECOMMEND')} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${activeTab === 'RECOMMEND' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                            <Lightbulb size={14} className="inline mr-1 mb-0.5" /> Recommend Notes
                        </button>
                    </>
                )}
            </div>

            {/* Scrollable Content */}
            <div id="marksheet-content" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
                {activeTab === 'OFFICIAL_MARKSHEET' && (
                    <>
                        {renderMarksheetStyle1()}
                        {!isAnalysisUnlocked && (
                            <div className="mt-6 bg-white p-6 rounded-2xl border-2 border-indigo-100 text-center shadow-lg">
                                <Lock className="mx-auto text-indigo-400 mb-3" size={48} />
                                <h3 className="text-xl font-black text-slate-800 mb-2">Analysis Locked</h3>
                                <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Unlock detailed answers, OMR sheet, and weak concept analysis.</p>
                                <button onClick={unlockFreeAnalysis} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto">
                                    <BrainCircuit size={20} /> Unlock Now (20 Coins)
                                </button>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'SOLUTION' && isAnalysisUnlocked && (
                    <div className="animate-in slide-in-from-bottom-4">
                        {/* NEW: Granular Analysis View (Default) */}
                        <div className="mb-8">
                            {renderGranularAnalysis()}
                        </div>

                        {questions && questions.length > 0 ? (
                            <div className="space-y-6">
                                {questions.map((q, idx) => {
                                    const omrEntry = result.omrData?.find(d => d.qIndex === idx);
                                    const userSelected = omrEntry ? omrEntry.selected : -1;
                                    const isCorrect = userSelected === q.correctAnswer;
                                    const isSkipped = userSelected === -1;
                                    return (
                                        <div key={idx} className={`bg-white rounded-2xl border ${isCorrect ? 'border-green-200' : isSkipped ? 'border-slate-200' : 'border-red-200'} shadow-sm overflow-hidden`}>
                                            <div className={`p-4 ${isCorrect ? 'bg-green-50' : isSkipped ? 'bg-slate-50' : 'bg-red-50'} border-b ${isCorrect ? 'border-green-100' : isSkipped ? 'border-slate-100' : 'border-red-100'} flex gap-3`}>
                                                <span className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isCorrect ? 'bg-green-100 text-green-700' : isSkipped ? 'bg-slate-200 text-slate-600' : 'bg-red-100 text-red-600'}`}>{idx + 1}</span>
                                                <div className="flex-1"><div className="text-sm font-bold text-slate-800 leading-snug" dangerouslySetInnerHTML={{ __html: renderMathInHtml(q.question) }} /></div>
                                            </div>
                                            {q.options && (
                                                <div className="p-4 space-y-2">
                                                    {q.options.map((opt: string, optIdx: number) => {
                                                        const isSelected = userSelected === optIdx;
                                                        const isAnswer = q.correctAnswer === optIdx;
                                                        let cls = "border-slate-100 bg-white text-slate-600";
                                                        if (isAnswer) cls = "border-green-300 bg-green-50 text-green-800 font-bold";
                                                        else if (isSelected) cls = "border-red-300 bg-red-50 text-red-800 font-bold";
                                                        return (
                                                            <div key={optIdx} className={`p-3 rounded-xl border flex items-center gap-3 text-xs transition-colors ${cls}`}>
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border ${isAnswer ? 'border-green-400 bg-green-100 text-green-700' : isSelected ? 'border-red-400 bg-red-100 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>{String.fromCharCode(65 + optIdx)}</div>
                                                                <div className="flex-1" dangerouslySetInnerHTML={{ __html: renderMathInHtml(opt) }} />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {q.explanation && (
                                                <div className="p-4 bg-blue-50 border-t border-blue-100">
                                                    <div className="text-xs text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: renderMathInHtml(q.explanation) }} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : <p>No questions data.</p>}
                    </div>
                )}

                {activeTab === 'MISTAKES' && isAnalysisUnlocked && (
                    <div className="animate-in slide-in-from-bottom-4 h-full">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 mb-6">
                            <h3 className="text-lg font-black text-red-700 flex items-center gap-2 mb-4">
                                <XCircle className="text-red-500" /> Mistakes Review
                            </h3>

                            {result.wrongQuestions && result.wrongQuestions.length > 0 ? (
                                <>
                                    <button onClick={handleRetryMistakes} className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2 mb-6">
                                        <RefreshCw size={20} /> Retry {result.wrongQuestions.length} Mistakes Now
                                    </button>

                                    <div className="space-y-4">
                                        {result.wrongQuestions.map((wq, i) => (
                                            <div key={i} className="p-4 rounded-xl border border-red-200 bg-red-50/50">
                                                <div className="flex gap-3">
                                                    <span className="shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xs">{wq.qIndex + 1}</span>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-slate-800 text-sm mb-2" dangerouslySetInnerHTML={{__html: renderMathInHtml(wq.question)}} />
                                                        <div className="text-xs text-slate-500 italic">
                                                            Correct Answer: Option {String.fromCharCode(65 + (typeof wq.correctAnswer === 'number' ? wq.correctAnswer : 0))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                                    <h4 className="font-bold text-slate-800">Perfect Score!</h4>
                                    <p className="text-sm text-slate-500">You have no mistakes to review.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'AI_ANALYSIS' && isAnalysisUnlocked && (
                    <div className="animate-in slide-in-from-bottom-4 h-full">
                         {/* ULTRA AI ANALYSIS (Optional Upgrade) */}
                        <div className="mb-8">
                             {!ultraAnalysisResult ? (
                                <div className="bg-white border border-dashed border-indigo-200 rounded-3xl p-6 text-center">
                                    <BrainCircuit size={32} className="mx-auto mb-2 text-indigo-400" />
                                    <h4 className="text-sm font-black text-slate-700 mb-1">Want Deeper AI Insights?</h4>
                                    <p className="text-xs text-slate-500 mb-4">Get a personalized study plan and motivation.</p>
                                    <button onClick={() => handleUltraAnalysis()} disabled={isLoadingUltra} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50">
                                        {isLoadingUltra ? <span className="animate-spin">⏳</span> : <Sparkles size={14} />}
                                        {isLoadingUltra ? 'Generating...' : `Generate AI Report (${settings?.mcqAnalysisCostUltra ?? 20} Coins)`}
                                    </button>
                                </div>
                            ) : renderAnalysisContent()}
                        </div>
                    </div>
                )}

                {activeTab === 'OMR' && isAnalysisUnlocked && (
                    <div className="animate-in slide-in-from-bottom-4">
                         {renderTopicBreakdown()}
                         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6">
                            <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2"><Grid size={18} /> OMR Response Sheet</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                                {currentData.map((data) => renderOMRRow(data.qIndex, data.selected, data.correct))}
                            </div>
                            {/* RESTORED: Pagination */}
                            {hasOMR && (
                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className="p-2 rounded-lg bg-slate-100 disabled:opacity-50 hover:bg-slate-200"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="text-xs font-bold text-slate-500">Page {page} of {totalPages}</span>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        className="p-2 rounded-lg bg-slate-100 disabled:opacity-50 hover:bg-slate-200"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'RECOMMEND' && isAnalysisUnlocked && (
                    <div className="animate-in slide-in-from-bottom-4 h-full">{renderRecommendationsSection()}</div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="bg-white p-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 z-10 shrink-0">
                <button onClick={handleShare} className="p-3 bg-green-50 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95" title="Share Result">
                    <Share2 size={20} />
                </button>
                <button
                    onClick={() => setDownloadModal({isOpen: true, type: 'MARKSHEET'})}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-sm"
                >
                    <Download size={16} /> Download Marksheet
                </button>


                {/* PDF DOWNLOAD BUTTONS */}
                <button
                    onClick={() => handleDownloadAll()}
                    className="p-3 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                    title="Download Full Analysis PDF (Report, OMR, Mistakes)"
                >
                    {isDownloadingAll ? <span className="animate-spin">⏳</span> : <FileText size={20} />}

                <button
                    onClick={() => setDownloadModal({isOpen: true, type: 'FULL'})}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                    {isDownloadingAll ? <span className="animate-spin">⏳</span> : <Download size={16} />} Download Full Analysis

                </button>
            </div>
             
             <div className="text-center py-2 bg-slate-50 border-t border-slate-100">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Developed by Nadim Anwar</p>
             </div>
        </div>

        <DownloadOptionsModal
            isOpen={downloadModal.isOpen}
            onClose={() => setDownloadModal({isOpen: false, type: null})}
            title={downloadModal.type === 'MARKSHEET' ? "Download Marksheet" : "Download Full Report"}
            onDownloadPdf={() => {
                if (downloadModal.type === 'MARKSHEET') handleDownloadMarksheet();
                else handleDownloadFullReport();
            }}
            onDownloadMhtml={() => {
                if (downloadModal.type === 'MARKSHEET') {
                    // Temporarily show the hidden marksheet container if needed, or clone it
                    // The marksheet is rendered conditionally. We might need to ensure it's in DOM.
                    // But 'marksheet-style-1' is in render logic. If tab is not OFFICIAL, it might not be there.
                    // Actually, renderMarksheetStyle1 is called in renderFullReport into a hidden container.
                    // Let's use the hidden container for Full Report MHTML.
                    // For Marksheet Only, we should use 'marksheet-style-1' if visible, or re-render it.
                    // Robust way: Use the 'full-report-print-container' for Full, and ensure 'marksheet-style-1' is available for Marksheet.
                    // If activeTab !== 'OFFICIAL_MARKSHEET', 'marksheet-style-1' might not be in the visible tree.
                    // But 'renderFullReport' puts it in a hidden div. So we can grab it from there for Marksheet too?
                    // 'renderFullReport' calls 'renderMarksheetStyle1'.
                    // Wait, 'full-report-print-container' is always rendered in the JSX return.
                    // So we can target elements inside it.

                    downloadAsMHTML('marksheet-style-1', `Marksheet_${user.name}`);
                } else {
                    downloadAsMHTML('full-report-print-container', `Full_Analysis_${user.name}`);
                }
            }}
        />

        {viewingNote && (
            <div className="fixed inset-0 z-[250] bg-slate-900/90 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-indigo-600"/>
                            <h3 className="font-bold text-slate-800 text-sm line-clamp-1 max-w-[200px] sm:max-w-xs">{viewingNote.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <SpeakButton
                                text={stripHtml(viewingNote.content || viewingNote.html || 'No content available.')}
                                className="hover:bg-slate-200 text-slate-600 p-1.5"
                                iconSize={18}
                            />
                            <button onClick={() => setViewingNote(null)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500"><X size={20} /></button>
                        </div>
                    </div>
                    <div className="p-6 overflow-y-auto prose prose-sm max-w-none">
                         <div dangerouslySetInnerHTML={{ __html: viewingNote.content || viewingNote.html || '<p>No content available.</p>' }} />
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

const UnlockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);
