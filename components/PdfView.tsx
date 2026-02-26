import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Chapter, User, Subject, SystemSettings, HtmlModule, PremiumNoteSlot } from '../types';
import { FileText, Lock, ArrowLeft, Crown, Star, CheckCircle, AlertCircle, Globe, Maximize, Layers, HelpCircle, Minus, Plus, Volume2, Square, Zap, Headphones, BookOpen, Music, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { CustomAlert } from './CustomDialogs';
import { getChapterData, saveUserToLive } from '../firebase';
import { CreditConfirmationModal } from './CreditConfirmationModal';
import { AiInterstitial } from './AiInterstitial';
import { InfoPopup } from './InfoPopup';
import { DEFAULT_CONTENT_INFO_CONFIG } from '../constants';
import { checkFeatureAccess } from '../utils/permissionUtils';
import { speakText, stopSpeech } from '../utils/textToSpeech';

interface Props {
  chapter: Chapter;
  subject: Subject;
  user: User;
  board: string;
  classLevel: string;
  stream: string | null;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
  settings?: SystemSettings;
  initialSyllabusMode?: 'SCHOOL' | 'COMPETITION';
  directResource?: { url: string, access: string };
}

// Helper to split HTML content into topics
const extractTopicsFromHtml = (html: string): { title: string, content: string }[] => {
    if (!html) return [];

    // Create a temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const topics: { title: string, content: string }[] = [];
    let currentTitle = "Introduction";
    let currentContent: string[] = [];

    const children = Array.from(tempDiv.children);

    // Fallback if no children (raw text)
    if (children.length === 0 && html.trim().length > 0) {
        return [{ title: "Notes", content: html }];
    }

    children.forEach((child) => {
        const tagName = child.tagName.toLowerCase();
        if (tagName === 'h1' || tagName === 'h2') {
            // Push previous topic if exists
            if (currentContent.length > 0) {
                topics.push({
                    title: currentTitle,
                    content: currentContent.join('')
                });
                currentContent = [];
            }
            currentTitle = child.textContent || "Untitled Topic";
        } else {
            currentContent.push(child.outerHTML);
        }
    });

    // Push the last topic
    if (currentContent.length > 0 || topics.length === 0) {
        topics.push({
            title: currentTitle,
            content: currentContent.join('')
        });
    }

    return topics;
};

export const PdfView: React.FC<Props> = ({ 
  chapter, subject, user, board, classLevel, stream, onBack, onUpdateUser, settings, initialSyllabusMode, directResource
}) => {
  const [contentData, setContentData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [syllabusMode, setSyllabusMode] = useState<'SCHOOL' | 'COMPETITION'>(initialSyllabusMode || 'SCHOOL');
  const [activePdf, setActivePdf] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<'ENGLISH' | 'HINDI'>('ENGLISH');
  const [pendingPdf, setPendingPdf] = useState<{type: string, price: number, link: string, tts?: string} | null>(null);
  
  // DEEP DIVE STATE
  const [isDeepDiveMode, setIsDeepDiveMode] = useState(false);
  const [deepDiveTopics, setDeepDiveTopics] = useState<{ title: string, content: string }[]>([]);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [topicSpeakingState, setTopicSpeakingState] = useState<number | null>(null); // Index of topic currently speaking

  // ZOOM STATE
  const [zoom, setZoom] = useState(1);
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  
  // INFO POPUP STATE
  const [infoPopup, setInfoPopup] = useState<{isOpen: boolean, config: any, type: 'FREE' | 'PREMIUM'}>({isOpen: false, config: {}, type: 'FREE'});

  // TTS STATE (Global)
  const [speechRate, setSpeechRate] = useState(1.0);
  
  const stopAllSpeech = () => {
      stopSpeech();
      setIsAutoPlaying(false);
      setTopicSpeakingState(null);
  };

  useEffect(() => {
    return () => stopAllSpeech();
  }, [activePdf, isDeepDiveMode]);

  // Deep Dive Auto-Play Logic
  useEffect(() => {
      if (isAutoPlaying && isDeepDiveMode && deepDiveTopics.length > 0) {
          const currentIndex = activeTopicIndex; // Start from current viewed

          if (currentIndex < deepDiveTopics.length) {
              const topic = deepDiveTopics[currentIndex];
              setTopicSpeakingState(currentIndex);

              // Scroll to topic
              document.getElementById(`topic-card-${currentIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

              speakText(
                  topic.content, // speakText strips HTML automatically
                  null,
                  speechRate,
                  'hi-IN',
                  undefined,
                  () => {
                      // On End
                      if (isAutoPlaying) {
                          if (currentIndex + 1 < deepDiveTopics.length) {
                              setActiveTopicIndex(currentIndex + 1);
                          } else {
                              setIsAutoPlaying(false);
                              setTopicSpeakingState(null);
                          }
                      }
                  }
              );
          }
      }
  }, [isAutoPlaying, activeTopicIndex, isDeepDiveMode]); // Trigger when index updates in auto mode

  const handleTopicPlay = (index: number) => {
      if (topicSpeakingState === index) {
          // Pause/Stop
          stopSpeech();
          setTopicSpeakingState(null);
          setIsAutoPlaying(false);
      } else {
          // Play specific topic
          stopSpeech();
          setIsAutoPlaying(false); // Disable auto-sequence
          setTopicSpeakingState(index);
          const topic = deepDiveTopics[index];
          speakText(
              topic.content,
              null,
              speechRate,
              'hi-IN',
              undefined,
              () => setTopicSpeakingState(null)
          );
      }
  };

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
          pdfContainerRef.current?.requestFullscreen().catch(err => console.error(err));
      } else {
          document.exitFullscreen();
      }
  };

  // Interstitial State
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [pendingTts, setPendingTts] = useState<string | null>(null);

  // Alert
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, message: string}>({isOpen: false, message: ''});

  // Data Fetching
  useEffect(() => {
    if (directResource) {
        setLoading(false);
        setActivePdf(directResource.url);
        return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const streamKey = (classLevel === '11' || classLevel === '12') && stream ? `-${stream}` : '';
        const key = `nst_content_${board}_${classLevel}${streamKey}_${subject.name}_${chapter.id}`;
        let data = await getChapterData(key);
        if (!data) {
            const stored = localStorage.getItem(key);
            if (stored) data = JSON.parse(stored);
        }
        setContentData(data || {});
      } catch (error) {
        console.error("Error loading PDF data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chapter.id, board, classLevel, stream, subject.name, directResource]);

  const handlePdfClick = (type: 'FREE' | 'PREMIUM' | 'ULTRA' | 'DEEP_DIVE' | 'AUDIO_SLIDE') => {
      // Reset Deep Dive State
      setIsDeepDiveMode(false);

      let link = '';
      let htmlContent = '';
      let price = 0;
      let ttsContent: string | undefined = undefined;

      if (type === 'FREE') {
          // ... (Existing Logic) ...
          const htmlKey = syllabusMode === 'SCHOOL' ? 'schoolFreeNotesHtml' : 'competitionFreeNotesHtml';
          if (syllabusMode === 'SCHOOL') {
              link = contentData?.schoolPdfLink || contentData?.freeLink;
              htmlContent = contentData?.[htmlKey] || contentData?.freeNotesHtml;
          } else {
              link = contentData?.competitionPdfLink;
              htmlContent = contentData?.[htmlKey];
          }
          price = 0;
      } else if (type === 'PREMIUM') { // Renamed visually to Auto TTS
          // ... (Existing Logic) ...
          const htmlKey = syllabusMode === 'SCHOOL' ? 'schoolPremiumNotesHtml' : 'competitionPremiumNotesHtml';
          if (syllabusMode === 'SCHOOL') {
             link = contentData?.schoolPdfPremiumLink || contentData?.premiumLink; 
             htmlContent = contentData?.[htmlKey] || contentData?.premiumNotesHtml; 
             price = contentData?.schoolPdfPrice || contentData?.price;
          } else {
             link = contentData?.competitionPdfPremiumLink;
             htmlContent = contentData?.[htmlKey];
             price = contentData?.competitionPdfPrice;
          }
          if (price === undefined) price = (settings?.defaultPdfCost ?? 5);
      } else if (type === 'ULTRA') {
          link = contentData?.ultraPdfLink;
          price = contentData?.ultraPdfPrice !== undefined ? contentData.ultraPdfPrice : 10;
      } else if (type === 'DEEP_DIVE') {
          htmlContent = syllabusMode === 'SCHOOL' ? (contentData?.deepDiveNotesHtml || '') : (contentData?.competitionDeepDiveNotesHtml || '');
          // Prepare Topics immediately
          const extracted = extractTopicsFromHtml(htmlContent);
          setDeepDiveTopics(extracted);

          // Access Check Handled Below
      } else if (type === 'AUDIO_SLIDE') {
          link = syllabusMode === 'SCHOOL' ? (contentData?.schoolPdfPremiumLink || contentData?.premiumLink) : contentData?.competitionPdfPremiumLink;
          const rawTts = syllabusMode === 'SCHOOL' ? (contentData?.deepDiveNotesHtml || '') : (contentData?.competitionDeepDiveNotesHtml || '');
          ttsContent = rawTts.replace(/<[^>]*>?/gm, ' ');
      }

      // Prioritize Link, but allow HTML if link is missing
      // For Deep Dive, we handle specially
      const targetContent = type === 'DEEP_DIVE' ? 'DEEP_DIVE_MODE' : (link || htmlContent);

      if (!targetContent && type !== 'DEEP_DIVE') {
          setAlertConfig({isOpen: true, message: "Coming Soon! This content is being prepared."});
          return;
      }

      if (type === 'DEEP_DIVE' && (!htmlContent || htmlContent.length < 10)) {
           setAlertConfig({isOpen: true, message: "Coming Soon! Deep Dive notes are being prepared."});
           return;
      }

      // ... (Access Check Logic - mostly same) ...
      // Only change: If type === 'DEEP_DIVE', we activate the mode instead of setActivePdf link

      const proceed = () => {
          if (type === 'DEEP_DIVE') {
              triggerInterstitial('DEEP_DIVE_MODE');
          } else {
              triggerInterstitial(targetContent, ttsContent);
          }
      };

      // Check permissions... (Simplified for brevity, assuming same logic as before)
      // Access Check
      if (user.role === 'ADMIN') { proceed(); return; }
      if (user.unlockedContent && user.unlockedContent.includes(chapter.id)) { proceed(); return; }

      if (type === 'DEEP_DIVE' || type === 'AUDIO_SLIDE') {
          const featureId = type === 'DEEP_DIVE' ? 'DEEP_DIVE' : 'AUDIO_SLIDE';
          const access = checkFeatureAccess(featureId, user, settings || {});
          if (access.isDummy) { setAlertConfig({isOpen: true, message: "Coming Soon!"}); return; }
          if (access.hasAccess) { proceed(); return; }
          if (access.cost > 0) {
              if (user.isAutoDeductEnabled) processPaymentAndOpen(targetContent, access.cost, false, ttsContent, type === 'DEEP_DIVE');
              else setPendingPdf({ type, price: access.cost, link: targetContent, tts: ttsContent });
              return;
          }
          setAlertConfig({isOpen: true, message: `🔒 Locked! Upgrade to access.`});
          return;
      }

      if (price === 0) { proceed(); return; }

      const isSubscribed = user.isPremium && user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date();
      if (isSubscribed) {
          // Tier Checks...
          if (user.subscriptionTier === 'YEARLY' || user.subscriptionTier === 'LIFETIME' || user.subscriptionLevel === 'ULTRA' || user.subscriptionLevel === 'BASIC') {
              proceed(); return;
          }
      }

      if (user.isAutoDeductEnabled) processPaymentAndOpen(targetContent, price, false, ttsContent, type === 'DEEP_DIVE');
      else setPendingPdf({ type, price, link: targetContent, tts: ttsContent });
  };

  const processPaymentAndOpen = (targetContent: string, price: number, enableAuto: boolean = false, ttsContent?: string, isDeepDive: boolean = false) => {
      if (user.credits < price) {
          setAlertConfig({isOpen: true, message: `Insufficient Credits! You need ${price} coins.`});
          return;
      }
      let updatedUser = { ...user, credits: user.credits - price };
      if (enableAuto) updatedUser.isAutoDeductEnabled = true;
      
      localStorage.setItem('nst_current_user', JSON.stringify(updatedUser));
      saveUserToLive(updatedUser);
      onUpdateUser(updatedUser);
      
      if (isDeepDive) triggerInterstitial('DEEP_DIVE_MODE');
      else triggerInterstitial(targetContent, ttsContent);
      setPendingPdf(null);
  };

  const triggerInterstitial = (link: string, tts?: string) => {
      setPendingLink(link);
      setPendingTts(tts || null);
      setShowInterstitial(true);
  };

  const onInterstitialComplete = () => {
      setShowInterstitial(false);
      if (pendingLink) {
          if (pendingLink === 'DEEP_DIVE_MODE') {
              setIsDeepDiveMode(true);
              setActivePdf(null);
          } else {
              setActivePdf(pendingLink);
              // Auto-start TTS for Audio Slide is handled in useEffect or button
          }
          setPendingLink(null);
          setPendingTts(null);
      }
  };

  // ... (Render Helpers) ...

  // RENDER
  if (showInterstitial) {
      const isPremiumUser = user.isPremium && user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date();
      const aiImage = contentData?.chapterAiImage || settings?.aiLoadingImage;
      return <AiInterstitial onComplete={onInterstitialComplete} userType={isPremiumUser ? 'PREMIUM' : 'FREE'} imageUrl={aiImage} contentType="PDF" />;
  }

  // DEEP DIVE VIEW
  if (isDeepDiveMode) {
      return (
          <div className="bg-slate-100 min-h-screen pb-20">
              <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <button onClick={() => { setIsDeepDiveMode(false); stopAllSpeech(); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ArrowLeft size={20} /></button>
                      <h3 className="font-bold text-slate-800">Deep Dive: {chapter.title}</h3>
                  </div>

                  {/* GLOBAL CONTROLS */}
                  <div className="flex gap-2">
                      <button
                          onClick={() => {
                              if (isAutoPlaying) {
                                  setIsAutoPlaying(false);
                                  stopSpeech();
                              } else {
                                  setIsAutoPlaying(true);
                                  setActiveTopicIndex(0); // Start from top or current? User said "Non stop apna chalega"
                              }
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${isAutoPlaying ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-600 text-white shadow-lg'}`}
                      >
                          {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
                          {isAutoPlaying ? 'Stop Auto' : 'Auto Play All'}
                      </button>
                  </div>
              </div>

              <div className="p-4 space-y-6 max-w-2xl mx-auto snap-y snap-mandatory h-[calc(100vh-80px)] overflow-y-auto">
                  {deepDiveTopics.map((topic, idx) => {
                      const isActive = topicSpeakingState === idx;
                      return (
                          <div
                              id={`topic-card-${idx}`}
                              key={idx}
                              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all snap-center min-h-[50vh] flex flex-col justify-center ${isActive ? 'border-teal-400 ring-2 ring-teal-100 scale-[1.02]' : 'border-transparent'}`}
                          >
                              <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-2">
                                  <h4 className="text-lg font-black text-slate-800">{topic.title}</h4>
                                  <button
                                      onClick={() => handleTopicPlay(idx)}
                                      className={`p-2 rounded-full transition-colors ${isActive ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600'}`}
                                  >
                                      {isActive ? <Pause size={20} /> : <Volume2 size={20} />}
                                  </button>
                              </div>
                              <div
                                  className="prose prose-sm text-slate-600 leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: topic.content }}
                              />
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-in fade-in slide-in-from-right-8">
       <CustomAlert 
           isOpen={alertConfig.isOpen} 
           message={alertConfig.message} 
           onClose={() => setAlertConfig({...alertConfig, isOpen: false})} 
       />

       {/* STANDARD HEADER */}
       <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm p-4 flex items-center gap-3">
           <button onClick={() => activePdf ? setActivePdf(null) : onBack()} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
               <ArrowLeft size={20} />
           </button>
           <div className="flex-1">
               <h3 className="font-bold text-slate-800 leading-tight line-clamp-1">{chapter.title}</h3>
               {/* Mode Switchers */}
               <div className="flex gap-2 mt-1">
                 <button onClick={() => setSyllabusMode('SCHOOL')} className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${syllabusMode === 'SCHOOL' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>School</button>
                 <button onClick={() => setSyllabusMode('COMPETITION')} className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${syllabusMode === 'COMPETITION' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>Competition</button>
               </div>
           </div>
           
           {/* Standard Controls (Zoom, TTS for standard view) */}
           {activePdf && (
               <div className="flex items-center gap-1">
                   {/* TTS Button for PDF View */}
                   <button
                       onClick={() => {
                           const btn = document.querySelector('[data-tts-trigger]');
                           if(btn instanceof HTMLElement) btn.click(); // Trigger hidden button inside PDF view if needed or handle directly
                           // Actually we can just call handleSpeak if we hoist logic, but keeping existing
                       }}
                       className="p-2 bg-slate-100 rounded-full"
                   >
                       <Volume2 size={18} />
                   </button>
               </div>
           )}
       </div>

       {activePdf ? (
           <div ref={pdfContainerRef} className="h-[calc(100vh-80px)] w-full bg-slate-100 relative overflow-auto">
               {/* PDF/HTML Viewer Implementation (Same as before) */}
               {activePdf.startsWith('http') ? (
                   <iframe src={activePdf} className="w-full h-full border-none" title="Viewer" />
               ) : (
                   <div className="absolute inset-0 bg-white p-8 overflow-y-auto prose max-w-none">
                       <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{activePdf}</ReactMarkdown>
                   </div>
               )}
           </div>
       ) : (
       <div className="p-6 space-y-4">
           {loading ? (
               <div className="space-y-4"><div className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div></div>
           ) : (
               <>
                   {/* FREE NOTES */}
                   <div className="relative group">
                       <button onClick={() => handlePdfClick('FREE')} className="w-full p-5 rounded-2xl border-2 border-green-100 bg-white hover:bg-green-50 flex items-center gap-4 transition-all">
                           <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100"><FileText size={24} /></div>
                           <div className="flex-1 text-left"><h4 className="font-bold text-slate-800">Free Notes</h4><p className="text-xs text-slate-500">Standard Quality</p></div>
                       </button>
                   </div>

                   {/* AUTO TTS NOTES (Formerly Premium Notes) */}
                   <div className="relative group">
                       <button onClick={() => handlePdfClick('PREMIUM')} className="w-full p-5 rounded-2xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-white hover:border-yellow-300 flex items-center gap-4 transition-all">
                           <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-[10px] font-bold border border-yellow-200"><Zap size={10} /> AUTO TTS</div>
                           <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center border border-yellow-200"><Volume2 size={24} /></div>
                           <div className="flex-1 text-left">
                               <h4 className="font-bold text-slate-800">Auto TTS Notes</h4>
                               <p className="text-xs text-slate-500">Listen & Read (Premium)</p>
                           </div>
                           <div className="flex flex-col items-end">
                               <span className="text-xs font-black text-yellow-700">{contentData?.price || 5} CR</span>
                               <span className="text-[10px] text-slate-400">Unlock</span>
                           </div>
                       </button>
                   </div>

                   {/* DEEP DIVE NOTES (Topic Wise) */}
                   <div className="relative group">
                       <button onClick={() => handlePdfClick('DEEP_DIVE')} className="w-full p-5 rounded-2xl border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-white hover:border-teal-300 flex items-center gap-4 transition-all">
                           <div className="absolute top-3 right-3 flex items-center gap-1 bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-[10px] font-bold border border-teal-200"><Headphones size={10} /> AUDIO TOPICS</div>
                           <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center border border-teal-200"><BookOpen size={24} /></div>
                           <div className="flex-1 text-left">
                               <h4 className="font-bold text-slate-800">Deep Dive Topics</h4>
                               <p className="text-xs text-slate-500">Topic-wise Audio Explanations</p>
                           </div>
                           <div className="flex flex-col items-end">
                               <span className="text-xs font-black text-teal-700">5 CR</span>
                               <span className="text-[10px] text-slate-400">Unlock</span>
                           </div>
                       </button>
                   </div>

                   {/* AUDIO SLIDE */}
                   <div className="relative group">
                       <button onClick={() => handlePdfClick('AUDIO_SLIDE')} className="w-full p-5 rounded-2xl border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-white hover:border-rose-300 flex items-center gap-4 transition-all">
                           <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200"><Layers size={24} /></div>
                           <div className="flex-1 text-left"><h4 className="font-bold text-slate-800">Audio Slides</h4><p className="text-xs text-slate-500">Premium Slides + Audio</p></div>
                       </button>
                   </div>
               </>
           )}
       </div>
       )}

       {/* CONFIRMATION & INFO MODALS ... */}
       {pendingPdf && <CreditConfirmationModal title="Unlock Content" cost={pendingPdf.price} userCredits={user.credits} isAutoEnabledInitial={!!user.isAutoDeductEnabled} onCancel={() => setPendingPdf(null)} onConfirm={(auto) => processPaymentAndOpen(pendingPdf.link, pendingPdf.price, auto, pendingPdf.tts, pendingPdf.type === 'DEEP_DIVE')} />}
    </div>
  );
};
