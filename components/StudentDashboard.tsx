
import React, { useState, useEffect } from 'react';
import { User, Subject, StudentTab, SystemSettings, CreditPackage, WeeklyTest, Chapter, MCQItem, Challenge20 } from '../types';
import { updateUserStatus, db, saveUserToLive, getChapterData, rtdb, saveAiInteraction, saveDemandRequest } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { ref, query, limitToLast, onValue } from 'firebase/database';
import { getSubjectsList, DEFAULT_APP_FEATURES, ALL_APP_FEATURES, LEVEL_UNLOCKABLE_FEATURES, LEVEL_UP_CONFIG } from '../constants';
import { ALL_FEATURES } from '../utils/featureRegistry';
import { checkFeatureAccess } from '../utils/permissionUtils';
import { SubscriptionEngine } from '../utils/engines/subscriptionEngine';
import { RewardEngine } from '../utils/engines/rewardEngine';
import { Button } from './ui/Button'; // Design System
import { getActiveChallenges } from '../services/questionBank';
import { generateDailyChallengeQuestions } from '../utils/challengeGenerator';
import { generateMorningInsight } from '../services/morningInsight';
import { RedeemSection } from './RedeemSection';
import { PrizeList } from './PrizeList';
import { Store } from './Store';
import { Layout, Gift, Sparkles, Megaphone, Lock, BookOpen, AlertCircle, Edit, Settings, Play, Pause, RotateCcw, MessageCircle, Gamepad2, Timer, CreditCard, Send, CheckCircle, Mail, X, Ban, Smartphone, Trophy, ShoppingBag, ArrowRight, Video, Youtube, Home, User as UserIcon, Book, BookOpenText, List, BarChart3, Award, Bell, Headphones, LifeBuoy, WifiOff, Zap, Star, Crown, History, ListChecks, Rocket, Ticket, TrendingUp, BrainCircuit, FileText, CheckSquare, Menu, LayoutGrid, Compass, User as UserIconOutline, MessageSquare, Bot, HelpCircle, Database, Activity, Download, Calendar } from 'lucide-react';
import { SubjectSelection } from './SubjectSelection';
import { BannerCarousel } from './BannerCarousel';
import { ChapterSelection } from './ChapterSelection'; // Imported for Video Flow
import { VideoPlaylistView } from './VideoPlaylistView'; // Imported for Video Flow
import { AudioPlaylistView } from './AudioPlaylistView'; // Imported for Audio Flow
import { PdfView } from './PdfView'; // Imported for PDF Flow
import { McqView } from './McqView'; // Imported for MCQ Flow
import { MiniPlayer } from './MiniPlayer'; // Imported for Audio Flow
import { HistoryPage } from './HistoryPage';
import { Leaderboard } from './Leaderboard';
import { SpinWheel } from './SpinWheel';
import { fetchChapters, generateCustomNotes } from '../services/groq'; // Needed for Video Flow
import { LoadingOverlay } from './LoadingOverlay';
import { CreditConfirmationModal } from './CreditConfirmationModal';
import { UserGuide } from './UserGuide';
import { CustomAlert } from './CustomDialogs';
import { AnalyticsPage } from './AnalyticsPage';
import { LiveResultsFeed } from './LiveResultsFeed';
// import { ChatHub } from './ChatHub';
import { UniversalInfoPage } from './UniversalInfoPage';
import { UniversalChat } from './UniversalChat';
import { ExpiryPopup } from './ExpiryPopup';
import { SubscriptionHistory } from './SubscriptionHistory';
import { MonthlyMarksheet } from './MonthlyMarksheet';
import { SearchResult } from '../utils/syllabusSearch';
import { AiDeepAnalysis } from './AiDeepAnalysis';
import { RevisionHub } from './RevisionHub'; // NEW
import { AiHub } from './AiHub'; // NEW: AI Hub
import { McqReviewHub } from './McqReviewHub'; // NEW
import { UniversalVideoView } from './UniversalVideoView'; // NEW
import { CustomBloggerPage } from './CustomBloggerPage';
import { ReferralPopup } from './ReferralPopup';
import { StudentAiAssistant } from './StudentAiAssistant';
import { SpeakButton } from './SpeakButton';
import { PerformanceGraph } from './PerformanceGraph';
import { StudentSidebar } from './StudentSidebar';
import { StudyGoalTimer } from './StudyGoalTimer';
import { ExplorePage } from './ExplorePage';
import { StudentHistoryModal } from './StudentHistoryModal';
import { generateDailyRoutine } from '../utils/routineGenerator';
// @ts-ignore
import jsPDF from 'jspdf';
// @ts-ignore
import html2canvas from 'html2canvas';

interface Props {
  user: User;
  dailyStudySeconds: number; // Received from Global App
  onSubjectSelect: (subject: Subject) => void;
  onRedeemSuccess: (user: User) => void;
  settings?: SystemSettings; // New prop
  onStartWeeklyTest?: (test: WeeklyTest) => void;
  activeTab: StudentTab;
  onTabChange: (tab: StudentTab) => void;
  setFullScreen: (full: boolean) => void; // Passed from App
  onNavigate?: (view: 'ADMIN_DASHBOARD') => void; // Added for Admin Switch
  isImpersonating?: boolean;
  onNavigateToChapter?: (chapterId: string, chapterTitle: string, subjectName: string, classLevel?: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: (v: boolean) => void;
}

const DashboardSectionWrapper = ({
    id,
    children,
    label,
    settings,
    isLayoutEditing,
    onToggleVisibility
}: {
    id: string,
    children: React.ReactNode,
    label: string,
    settings?: SystemSettings,
    isLayoutEditing: boolean,
    onToggleVisibility: (id: string) => void
}) => {
    const isVisible = settings?.dashboardLayout?.[id]?.visible !== false;

    if (!isVisible && !isLayoutEditing) return null;

    return (
        <div className={`relative ${isLayoutEditing ? 'border-2 border-dashed border-yellow-400 p-2 rounded-xl mb-4 bg-yellow-50/10' : ''}`}>
            {isLayoutEditing && (
                <div className="absolute -top-3 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow z-50 flex items-center gap-2">
                    <span>{label}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleVisibility(id); }}
                        className={`px-2 py-0.5 rounded text-xs ${isVisible ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                    >
                        {isVisible ? 'ON' : 'OFF'}
                    </button>
                </div>
            )}
            <div className={!isVisible ? 'opacity-50 grayscale pointer-events-none' : ''}>
                {children}
            </div>
        </div>
    );
};

export const StudentDashboard: React.FC<Props> = ({ user, dailyStudySeconds, onSubjectSelect, onRedeemSuccess, settings, onStartWeeklyTest, activeTab, onTabChange, setFullScreen, onNavigate, isImpersonating, onNavigateToChapter, isDarkMode, onToggleDarkMode }) => {
  
  const analysisLogs = JSON.parse(localStorage.getItem('nst_universal_analysis_logs') || '[]');

  const hasPermission = (featureId: string) => {
      // Use the new centralized helper which handles Feed vs Matrix control
      if (!settings) return true; // Default allow if settings missing (fallback to static)
      const { hasAccess } = checkFeatureAccess(featureId, user, settings);
      return hasAccess;
  };

  // ... (rest of standard hooks) ...
  // Keeping code brief where unchanged

  // --- EXPIRY CHECK & AUTO DOWNGRADE ---
  useEffect(() => {
      if (user.isPremium && !SubscriptionEngine.isPremium(user)) {
          const updatedUser: User = {
              ...user,
              isPremium: false,
              subscriptionTier: 'FREE',
              subscriptionLevel: undefined,
              subscriptionEndDate: undefined
          };
          handleUserUpdate(updatedUser);
          showAlert("Your subscription has expired. You are now on the Free Plan.", "ERROR", "Plan Expired");
      }
  }, [user.isPremium, user.subscriptionEndDate]);

  // ... (Popup Logic) ...
  useEffect(() => {
      const checkPopups = () => {
          const now = Date.now();
          if (settings?.popupConfigs?.isExpiryWarningEnabled && user.isPremium && user.subscriptionEndDate) {
             const end = new Date(user.subscriptionEndDate).getTime();
             const diffHours = (end - now) / (1000 * 60 * 60);
             const threshold = settings.popupConfigs.expiryWarningHours || 48;
             if (diffHours > 0 && diffHours <= threshold) {
                 const lastShown = parseInt(localStorage.getItem(`last_expiry_warn_${user.id}`) || '0');
                 const interval = (settings.popupConfigs.expiryWarningIntervalMinutes || 60) * 60 * 1000;
                 if (now - lastShown > interval) {
                     showAlert(`⚠️ Your subscription expires in ${Math.ceil(diffHours)} hours! Renew now to keep access.`, "INFO", "Expiry Warning");
                     localStorage.setItem(`last_expiry_warn_${user.id}`, now.toString());
                 }
             }
          }
          if (settings?.popupConfigs?.isUpsellEnabled && user.subscriptionLevel !== 'ULTRA') {
             const lastShown = parseInt(localStorage.getItem(`last_upsell_${user.id}`) || '0');
             const interval = (settings.popupConfigs.upsellPopupIntervalMinutes || 120) * 60 * 1000;
             if (now - lastShown > interval) {
                 const isFree = !user.isPremium;
                 const msg = isFree
                     ? "🚀 Unlock full power! Upgrade to Basic or Ultra for more features."
                     : "💎 Go Ultra! Get unlimited access to Competition Mode and AI.";
                 showAlert(msg, "INFO", "Upgrade Available");
                 localStorage.setItem(`last_upsell_${user.id}`, now.toString());
             }
          }
      };
      const timer = setInterval(checkPopups, 60000);
      return () => clearInterval(timer);
  }, [user.isPremium, user.subscriptionEndDate, settings?.popupConfigs]);

  // CUSTOM ALERT STATE
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, type: 'SUCCESS'|'ERROR'|'INFO', title?: string, message: string}>({isOpen: false, type: 'INFO', message: ''});
  const showAlert = (msg: string, type: 'SUCCESS'|'ERROR'|'INFO' = 'INFO', title?: string) => {
      setAlertConfig({ isOpen: true, type, title, message: msg });
  };

  // ... (Notification Logic) ...
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  useEffect(() => {
      const q = query(ref(rtdb, 'universal_updates'), limitToLast(1));
      const unsub = onValue(q, snap => {
          const data = snap.val();
          if (data) {
              const latest = Object.values(data)[0] as any;
              const lastRead = localStorage.getItem('nst_last_read_update') || '0';
              if (new Date(latest.timestamp).getTime() > Number(lastRead)) {
                  setHasNewUpdate(true);
                      const alertKey = `nst_update_alert_shown_${latest.id}`;
                      if (!localStorage.getItem(alertKey)) {
                          showAlert(`New Content Available: ${latest.text}`, 'INFO', 'New Update');
                          localStorage.setItem(alertKey, 'true');
                      }
              } else {
                  setHasNewUpdate(false);
              }
          }
      });
      return () => unsub();
  }, []);

  // ... (Rest of component state) ...
  const [testAttempts, setTestAttempts] = useState<Record<string, any>>(JSON.parse(localStorage.getItem(`nst_test_attempts_${user.id}`) || '{}'));
  const globalMessage = localStorage.getItem('nst_global_message');
  const [activeExternalApp, setActiveExternalApp] = useState<string | null>(null);
  const [pendingApp, setPendingApp] = useState<{app: any, cost: number} | null>(null);
  const [contentViewStep, setContentViewStep] = useState<'SUBJECTS' | 'CHAPTERS' | 'PLAYER'>('SUBJECTS');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [syllabusMode, setSyllabusMode] = useState<'SCHOOL' | 'COMPETITION'>('SCHOOL');
  const [currentAudioTrack, setCurrentAudioTrack] = useState<{url: string, title: string} | null>(null);
  const [universalNotes, setUniversalNotes] = useState<any[]>([]);
  const [topicFilter, setTopicFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
      getChapterData('nst_universal_notes').then(data => {
          if (data && data.notesPlaylist) setUniversalNotes(data.notesPlaylist);
      });
  }, []);
  
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
      classLevel: user.classLevel || '10',
      board: user.board || 'CBSE',
      stream: user.stream || 'Science',
      newPassword: '',
      dailyGoalHours: 3
  });
  const [canClaimReward, setCanClaimReward] = useState(false);
  const [selectedPhoneId, setSelectedPhoneId] = useState<string>('');
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showNameChangeModal, setShowNameChangeModal] = useState(false);
  const [newNameInput, setNewNameInput] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isLayoutEditing, setIsLayoutEditing] = useState(false);
  const [showExpiryPopup, setShowExpiryPopup] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [marksheetType, setMarksheetType] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'HOME' || activeTab === 'EXPLORE' || activeTab === 'PROFILE' || (activeTab as any) === 'AI_STUDIO' || activeTab === 'REVISION') {
        setFullScreen(true);
    } else {
        if (activeTab !== 'VIDEO' && activeTab !== 'PDF' && activeTab !== 'MCQ' && activeTab !== 'AUDIO') {
             setFullScreen(false);
        }
    }
  }, [activeTab]);

  useEffect(() => {
      const isNew = (Date.now() - new Date(user.createdAt).getTime()) < 10 * 60 * 1000;
      if (isNew && !user.redeemedReferralCode && !localStorage.getItem(`referral_shown_${user.id}`)) {
          setShowReferralPopup(true);
          localStorage.setItem(`referral_shown_${user.id}`, 'true');
      }
  }, [user.id, user.createdAt, user.redeemedReferralCode]);

  const handleSupportEmail = () => {
    const email = "nadim841442@gmail.com";
    const subject = encodeURIComponent(`Support Request: ${user.name} (ID: ${user.id})`);
    const body = encodeURIComponent(`Student Details:\nName: ${user.name}\nUID: ${user.id}\nEmail: ${user.email}\n\nIssue Description:\n`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };
  
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({ subject: '', topic: '', type: 'PDF' });
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [dailyTargetSeconds, setDailyTargetSeconds] = useState(3 * 3600);
  const REWARD_AMOUNT = settings?.dailyReward || 3;
  const adminPhones = settings?.adminPhones || [{id: 'default', number: '8227070298', name: 'Admin'}];
  const defaultPhoneId = adminPhones.find(p => p.isDefault)?.id || adminPhones[0]?.id || 'default';
  
  if (!selectedPhoneId && adminPhones.length > 0) {
    setSelectedPhoneId(defaultPhoneId);
  }

  const [viewingUserHistory, setViewingUserHistory] = useState<User | null>(null);

  useEffect(() => {
      const today = new Date().toDateString();
      if (user.dailyRoutine?.date !== today) {
          const newRoutine = generateDailyRoutine(user);
          const updatedUser = { ...user, dailyRoutine: newRoutine };
          if (!isImpersonating) {
              localStorage.setItem('nst_current_user', JSON.stringify(updatedUser));
              saveUserToLive(updatedUser);
          }
          onRedeemSuccess(updatedUser);
      }
  }, [user.dailyRoutine?.date, user.mcqHistory?.length]);

  const [discountTimer, setDiscountTimer] = useState<string | null>(null);
  const [discountStatus, setDiscountStatus] = useState<'WAITING' | 'ACTIVE' | 'NONE'>('NONE');
  const [showDiscountBanner, setShowDiscountBanner] = useState(false);
  const [morningBanner, setMorningBanner] = useState<any>(null);

  useEffect(() => {
      const loadMorningInsight = async () => {
          const now = new Date();
          if (now.getHours() >= 10) {
              const today = now.toDateString();
              const savedBanner = localStorage.getItem('nst_morning_banner');
              if (savedBanner) {
                  const parsed = JSON.parse(savedBanner);
                  if (parsed.date === today) {
                      setMorningBanner(parsed);
                      return;
                  }
              }
              const isGen = localStorage.getItem(`nst_insight_gen_${today}`);
              if (!isGen) {
                  localStorage.setItem(`nst_insight_gen_${today}`, 'true');
                  try {
                      const logs = JSON.parse(localStorage.getItem('nst_universal_analysis_logs') || '[]');
                      if (logs.length === 0) return;
                      await generateMorningInsight(
                          logs, 
                          settings, 
                          (banner) => {
                              localStorage.setItem('nst_morning_banner', JSON.stringify(banner));
                              setMorningBanner(banner);
                          }
                      );
                  } catch (e) {
                      console.error("Insight Gen Failed", e);
                      localStorage.removeItem(`nst_insight_gen_${today}`);
                  }
              }
          }
      };
      loadMorningInsight();
  }, [user.role, settings]);

  useEffect(() => {
     const evt = settings?.specialDiscountEvent;
     const formatDiff = (diff: number) => {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        return `${d>0?d+'d ':''}${h.toString().padStart(2,'0')}h ${m.toString().padStart(2,'0')}m ${s.toString().padStart(2,'0')}s`;
     };
     const checkStatus = () => {
         if (!evt?.enabled) { setShowDiscountBanner(false); setDiscountStatus('NONE'); setDiscountTimer(null); return; }
         const now = Date.now();
         const startsAt = evt.startsAt ? new Date(evt.startsAt).getTime() : now;
         const endsAt = evt.endsAt ? new Date(evt.endsAt).getTime() : now;
         if (now < startsAt) {
             setDiscountStatus('WAITING'); setShowDiscountBanner(true); setDiscountTimer(formatDiff(startsAt - now));
         } else if (now < endsAt) {
             setDiscountStatus('ACTIVE'); setShowDiscountBanner(true); setDiscountTimer(formatDiff(endsAt - now));
         } else {
             setDiscountStatus('NONE'); setShowDiscountBanner(false); setDiscountTimer(null);
         }
     };
     checkStatus();
     if (evt?.enabled) { const interval = setInterval(checkStatus, 1000); return () => clearInterval(interval); }
     else { setShowDiscountBanner(false); setDiscountStatus('NONE'); }
  }, [settings?.specialDiscountEvent]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleAiNotesGeneration = async () => {
      // 1. Feature Lock Check
      const access = checkFeatureAccess('AI_GENERATOR', user, settings || {});
      if (!access.hasAccess) {
          showAlert(access.reason === 'FEED_LOCKED' ? '🔒 Locked by Admin' : '🔒 Upgrade to access AI Notes!', 'ERROR', 'Access Denied');
          return;
      }

      if (!aiTopic.trim()) { showAlert("Please enter a topic!", "ERROR"); return; }

      // 2. Limit Check (Use Feed Limit if available)
      const today = new Date().toDateString();
      const usageKey = `nst_ai_usage_${user.id}_${today}`;
      const currentUsage = parseInt(localStorage.getItem(usageKey) || '0');
      
      const limit = access.limit !== undefined ? access.limit : 5; // Default fallback

      if (currentUsage >= limit) {
          showAlert(`Daily Limit Reached! You have used ${currentUsage}/${limit} AI generations today.`, "ERROR", "Limit Exceeded");
          return;
      }

      setAiGenerating(true);
      try {
          const notes = await generateCustomNotes(aiTopic, settings?.aiNotesPrompt || '', settings?.aiModel);
          setAiResult(notes);
          localStorage.setItem(usageKey, (currentUsage + 1).toString());
          saveAiInteraction({
              id: `ai-note-${Date.now()}`,
              userId: user.id,
              userName: user.name,
              type: 'AI_NOTES',
              query: aiTopic,
              response: notes,
              timestamp: new Date().toISOString()
          });
          showAlert("Notes Generated Successfully!", "SUCCESS");
      } catch (e) {
          console.error(e);
          showAlert("Failed to generate notes. Please try again.", "ERROR");
      } finally {
          setAiGenerating(false);
      }
  };

  const handleSwitchToAdmin = () => { if (onNavigate) onNavigate('ADMIN_DASHBOARD'); };

  const toggleLayoutVisibility = (sectionId: string) => {
      if (!settings) return;
      const currentLayout = settings.dashboardLayout || {};
      const currentConfig = currentLayout[sectionId] || { id: sectionId, visible: true };
      const newLayout = { ...currentLayout, [sectionId]: { ...currentConfig, visible: !currentConfig.visible } };
      const newSettings = { ...settings, dashboardLayout: newLayout };
      localStorage.setItem('nst_system_settings', JSON.stringify(newSettings));
      saveUserToLive(user);
      window.location.reload(); 
  };
  
  const getPhoneNumber = (phoneId?: string) => {
    const phone = adminPhones.find(p => p.id === (phoneId || selectedPhoneId));
    return phone ? phone.number : '8227070298';
  };

  useEffect(() => {
      const checkCompetitionAccess = () => {
          if (syllabusMode === 'COMPETITION') {
              const access = checkFeatureAccess('COMPETITION_MODE', user, settings || {});
              if (!access.hasAccess) {
                  setSyllabusMode('SCHOOL');
                  document.documentElement.style.setProperty('--primary', settings?.themeColor || '#3b82f6');
                  showAlert("⚠️ Competition Mode is locked! Please upgrade to an Ultra subscription to access competition content.", 'ERROR', 'Locked Feature');
              }
          }
      };
      checkCompetitionAccess();
      const interval = setInterval(checkCompetitionAccess, 60000);
      return () => clearInterval(interval);
  }, [syllabusMode, user.isPremium, user.subscriptionEndDate, user.subscriptionTier, user.subscriptionLevel, settings?.themeColor]);

  useEffect(() => {
      const storedGoal = localStorage.getItem(`nst_goal_${user.id}`);
      if (storedGoal) {
          const hours = parseInt(storedGoal);
          setDailyTargetSeconds(hours * 3600);
          setProfileData(prev => ({...prev, dailyGoalHours: hours}));
      }
  }, [user.id]);

  useEffect(() => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yDateStr = yesterday.toDateString();
      const yActivity = parseInt(localStorage.getItem(`activity_${user.id}_${yDateStr}`) || '0');
      const yClaimed = localStorage.getItem(`reward_claimed_${user.id}_${yDateStr}`);
      if (!yClaimed && (!user.subscriptionTier || user.subscriptionTier === 'FREE')) {
          let reward = null;
          if (yActivity >= 10800) reward = { tier: 'MONTHLY', level: 'ULTRA', hours: 4 };
          else if (yActivity >= 3600) reward = { tier: 'WEEKLY', level: 'BASIC', hours: 4 };
          if (reward) {
              const expiresAt = new Date(new Date().setHours(new Date().getHours() + 24)).toISOString();
              const newMsg: any = {
                  id: `reward-${Date.now()}`,
                  text: `🎁 Daily Reward! You studied enough yesterday. Claim your ${reward.hours} hours of ${reward.level} access now!`,
                  date: new Date().toISOString(),
                  read: false,
                  type: 'REWARD',
                  reward: { tier: reward.tier as any, level: reward.level as any, durationHours: reward.hours },
                  expiresAt: expiresAt,
                  isClaimed: false
              };
              const updatedUser = { ...user, inbox: [newMsg, ...(user.inbox || [])] };
              handleUserUpdate(updatedUser);
              localStorage.setItem(`reward_claimed_${user.id}_${yDateStr}`, 'true');
          }
      }
  }, [user.id]);

  const claimRewardMessage = (msgId: string, reward: any, gift?: any) => {
      const updatedInbox = user.inbox?.map(m => m.id === msgId ? { ...m, isClaimed: true, read: true } : m);
      let updatedUser: User = { ...user, inbox: updatedInbox };
      let successMsg = '';
      if (gift) {
          if (gift.type === 'CREDITS') { updatedUser.credits = (user.credits || 0) + Number(gift.value); successMsg = `🎁 Gift Claimed! Added ${gift.value} Credits.`; }
          else if (gift.type === 'SUBSCRIPTION') {
              const [tier, level] = (gift.value as string).split('_');
              const duration = gift.durationHours || 24;
              const now = new Date();
              const currentEnd = user.subscriptionEndDate ? new Date(user.subscriptionEndDate) : now;
              const isActive = user.isPremium && currentEnd > now;
              let newEndDate = new Date(now.getTime() + duration * 60 * 60 * 1000);
              if (isActive) { newEndDate = new Date(currentEnd.getTime() + duration * 60 * 60 * 1000); updatedUser.subscriptionEndDate = newEndDate.toISOString(); successMsg = `🎁 Gift Claimed! Extended your plan by ${duration} hours.`; }
              else { updatedUser.subscriptionTier = tier as any; updatedUser.subscriptionLevel = level as any; updatedUser.subscriptionEndDate = newEndDate.toISOString(); updatedUser.isPremium = true; successMsg = `🎁 Gift Claimed! ${tier} ${level} unlocked for ${duration} hours.`; }
          }
      } else if (reward) {
          const duration = reward.durationHours || 4;
          const now = new Date();
          const currentEnd = user.subscriptionEndDate ? new Date(user.subscriptionEndDate) : now;
          const isActive = user.isPremium && currentEnd > now;
          let newEndDate = new Date(now.getTime() + duration * 60 * 60 * 1000);
          if (isActive) { newEndDate = new Date(currentEnd.getTime() + duration * 60 * 60 * 1000); updatedUser.subscriptionEndDate = newEndDate.toISOString(); successMsg = `✅ Reward Claimed! Extended access by ${duration} hours.`; }
          else { updatedUser.subscriptionTier = reward.tier; updatedUser.subscriptionLevel = reward.level; updatedUser.subscriptionEndDate = newEndDate.toISOString(); updatedUser.isPremium = true; successMsg = `✅ Reward Claimed! Enjoy ${duration} hours of ${reward.level} access.`; }
      }
      handleUserUpdate(updatedUser);
      showAlert(successMsg, 'SUCCESS', 'Rewards Claimed');
  };

  const userRef = React.useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  useEffect(() => {
    if (!user.id) return;
    const unsub = onSnapshot(doc(db, "users", user.id), (doc) => {
        if (doc.exists()) {
            const cloudData = doc.data() as User;
            const currentUser = userRef.current;
            const needsUpdate = cloudData.credits !== currentUser.credits || cloudData.subscriptionTier !== currentUser.subscriptionTier || cloudData.isPremium !== currentUser.isPremium || cloudData.isGameBanned !== currentUser.isGameBanned || (cloudData.mcqHistory?.length || 0) > (currentUser.mcqHistory?.length || 0);
            if (needsUpdate) {
                let protectedSub = { tier: cloudData.subscriptionTier, level: cloudData.subscriptionLevel, endDate: cloudData.subscriptionEndDate, isPremium: cloudData.isPremium };
                const localTier = currentUser.subscriptionTier || 'FREE';
                const cloudTier = cloudData.subscriptionTier || 'FREE';
                const tierPriority: Record<string, number> = { 'LIFETIME': 5, 'YEARLY': 4, '3_MONTHLY': 3, 'MONTHLY': 2, 'WEEKLY': 1, 'FREE': 0, 'CUSTOM': 0 };
                if (tierPriority[localTier] > tierPriority[cloudTier]) {
                     const localEnd = currentUser.subscriptionEndDate ? new Date(currentUser.subscriptionEndDate) : new Date();
                     if (localTier === 'LIFETIME' || localEnd > new Date()) {
                         console.warn("⚠️ Prevented Cloud Downgrade! Keeping Local Subscription.", localTier);
                         protectedSub = { tier: currentUser.subscriptionTier, level: currentUser.subscriptionLevel, endDate: currentUser.subscriptionEndDate, isPremium: true };
                         saveUserToLive({ ...cloudData, ...protectedSub });
                     }
                }
                const updated: User = { ...currentUser, ...cloudData, ...protectedSub };
                if ((!cloudData.mcqHistory || cloudData.mcqHistory.length === 0) && (currentUser.mcqHistory && currentUser.mcqHistory.length > 0)) { updated.mcqHistory = currentUser.mcqHistory; }
                onRedeemSuccess(updated); 
            }
        }
    });
    return () => unsub();
  }, [user.id]); 

  useEffect(() => {
      const interval = setInterval(() => {
          updateUserStatus(user.id, dailyStudySeconds);
          const todayStr = new Date().toDateString();
          localStorage.setItem(`activity_${user.id}_${todayStr}`, dailyStudySeconds.toString());
          const accountAgeHours = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60);
          const firstDayBonusClaimed = localStorage.getItem(`first_day_ultra_${user.id}`);
          if (accountAgeHours < 24 && dailyStudySeconds >= 3600 && !firstDayBonusClaimed) {
              const endDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
              const updatedUser: User = { ...user, subscriptionTier: 'MONTHLY', subscriptionEndDate: endDate, isPremium: true };
              const storedUsers = JSON.parse(localStorage.getItem('nst_users') || '[]');
              const idx = storedUsers.findIndex((u:User) => u.id === user.id);
              if (idx !== -1) storedUsers[idx] = updatedUser;
              localStorage.setItem('nst_users', JSON.stringify(storedUsers));
              localStorage.setItem('nst_current_user', JSON.stringify(updatedUser));
              localStorage.setItem(`first_day_ultra_${user.id}`, 'true');
              onRedeemSuccess(updatedUser);
              showAlert("🎉 FIRST DAY BONUS: You unlocked 1 Hour Free ULTRA Subscription!", 'SUCCESS');
          }
      }, 60000); 
      return () => clearInterval(interval);
  }, [dailyStudySeconds, user.id, user.createdAt]);

  const [showInbox, setShowInbox] = useState(false);
  const unreadCount = user.inbox?.filter(m => !m.read).length || 0;

  useEffect(() => { setCanClaimReward(RewardEngine.canClaimDaily(user, dailyStudySeconds, dailyTargetSeconds)); }, [user.lastRewardClaimDate, dailyStudySeconds, dailyTargetSeconds]);

  const claimDailyReward = () => {
      if (!canClaimReward) return;
      const finalReward = RewardEngine.calculateDailyBonus(user, settings);
      const updatedUser = RewardEngine.processClaim(user, finalReward);
      handleUserUpdate(updatedUser);
      setCanClaimReward(false);
      showAlert(`Received: ${finalReward} Free Credits!`, 'SUCCESS', 'Daily Goal Met');
  };

  const handleUserUpdate = (updatedUser: User) => {
      const storedUsers = JSON.parse(localStorage.getItem('nst_users') || '[]');
      const userIdx = storedUsers.findIndex((u:User) => u.id === updatedUser.id);
      if (userIdx !== -1) {
          storedUsers[userIdx] = updatedUser;
          localStorage.setItem('nst_users', JSON.stringify(storedUsers));
          if (!isImpersonating) { localStorage.setItem('nst_current_user', JSON.stringify(updatedUser)); saveUserToLive(updatedUser); }
          onRedeemSuccess(updatedUser); 
      }
  };

  const markInboxRead = () => {
      if (!user.inbox) return;
      const updatedInbox = user.inbox.map(m => ({ ...m, read: true }));
      handleUserUpdate({ ...user, inbox: updatedInbox });
  };

  // --- MENU ITEM GENERATOR WITH LOCKS ---
  const renderSidebarMenuItems = () => {
      const items = [
          { id: 'INBOX', label: 'Inbox', icon: Mail, color: 'indigo', action: () => { setShowInbox(true); setShowSidebar(false); } },
          { id: 'UPDATES', label: 'Notifications', icon: Bell, color: 'red', action: () => { onTabChange('UPDATES'); setHasNewUpdate(false); localStorage.setItem('nst_last_read_update', Date.now().toString()); setShowSidebar(false); } },
          { id: 'ANALYTICS', label: 'Analytics', icon: BarChart3, color: 'blue', action: () => { onTabChange('ANALYTICS'); setShowSidebar(false); } },
          { id: 'MARKSHEET', label: 'Marksheet', icon: FileText, color: 'green', action: () => { setShowMonthlyReport(true); setShowSidebar(false); } },
          { id: 'HISTORY', label: 'History', icon: History, color: 'slate', action: () => { onTabChange('HISTORY'); setShowSidebar(false); } },
          { id: 'PLAN', label: 'My Plan', icon: CreditCard, color: 'purple', action: () => { onTabChange('SUB_HISTORY'); setShowSidebar(false); } },
          ...(isGameEnabled ? [{ id: 'GAME', label: 'Play Game', icon: Gamepad2, color: 'orange', action: () => { onTabChange('GAME'); setShowSidebar(false); }, featureId: 'GAMES' }] : []),
          { id: 'REDEEM', label: 'Redeem', icon: Gift, color: 'pink', action: () => { onTabChange('REDEEM'); setShowSidebar(false); } },
          { id: 'PRIZES', label: 'Prizes', icon: Trophy, color: 'yellow', action: () => { onTabChange('PRIZES'); setShowSidebar(false); } },
          { id: 'REQUEST', label: 'Request Content', icon: Megaphone, color: 'purple', action: () => { setShowRequestModal(true); setShowSidebar(false); } },
      ];

      return items.map(item => {
          // Check Feature Access if ID linked
          let isLocked = false;
          if (item.featureId) {
              const access = checkFeatureAccess(item.featureId, user, settings || {});
              if (!access.hasAccess) isLocked = true;
          }

          return (
              <Button
                  key={item.id}
                  onClick={() => {
                      if (isLocked) {
                          showAlert("🔒 Locked by Admin. Upgrade your plan to access.", 'ERROR');
                          return;
                      }
                      item.action();
                  }}
                  variant="ghost"
                  fullWidth
                  className={`justify-start gap-4 p-4 hover:bg-slate-50 ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                  <div className={`bg-${item.color}-100 text-${item.color}-600 p-2 rounded-lg relative`}>
                      <item.icon size={20} />
                      {isLocked && <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 border border-white"><Lock size={8} className="text-white"/></div>}
                  </div>
                  {item.label}
              </Button>
          );
      });
  };

  // ... (Render logic continues...)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
        {/* ... (Admin Switch, Header, etc.) ... */}
        
        {/* SIDEBAR OVERLAY (INLINE) */}
        {showSidebar && (
            <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-200">
                <div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setShowSidebar(false)}
                ></div>

                <div className="w-64 bg-white h-full shadow-2xl relative z-10 flex flex-col slide-in-from-left duration-300">
                    <div className="p-6 bg-slate-900 text-white rounded-br-3xl">
                        <h2 className="text-2xl font-black italic mb-1">{settings?.appName || 'App'}</h2>
                        <p className="text-xs text-slate-400">Student Menu</p>
                        <button onClick={() => setShowSidebar(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {renderSidebarMenuItems()}

                        {/* EXTERNAL APPS */}
                        {settings?.externalApps?.map(app => (
                            <Button
                                key={app.id}
                                onClick={() => { handleExternalAppClick(app); setShowSidebar(false); }}
                                variant="ghost"
                                fullWidth
                                className="justify-start gap-4 p-4 hover:bg-slate-50"
                            >
                                <div className="bg-cyan-100 text-cyan-600 p-2 rounded-lg">
                                    {app.icon ? <img src={app.icon} alt="" className="w-5 h-5"/> : <Smartphone size={20} />}
                                </div>
                                <span className="flex-1 text-left">{app.name}</span>
                                {app.isLocked && <Lock size={14} className="text-red-500" />}
                            </Button>
                        ))}

                        <Button
                            onClick={() => { onTabChange('CUSTOM_PAGE'); setShowSidebar(false); }}
                            variant="ghost"
                            fullWidth
                            className="justify-start gap-4 p-4 hover:bg-slate-50 relative"
                        >
                            <div className="bg-teal-100 text-teal-600 p-2 rounded-lg"><Zap size={20} /></div>
                            What's New
                            {hasNewUpdate && (
                                <span className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
                            )}
                        </Button>
                    </div>

                    <div className="p-4 border-t border-slate-100">
                        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-sm truncate text-slate-800">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ... (Rest of dashboard components) ... */}
        {/* REVISION HUB CHECK */}
        {activeTab === 'REVISION' && (
          (() => {
              const access = checkFeatureAccess('REVISION_HUB', user, settings || {});
              if (!access.hasAccess) {
                  // AUTO REDIRECT IF LOCKED (Or show lock screen)
                  return (
                      <div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center animate-in fade-in">
                          <div className="bg-slate-100 p-6 rounded-full mb-6 relative">
                              <BrainCircuit size={64} className="text-slate-400" />
                              <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-2 rounded-full border-4 border-white">
                                  <Lock size={20} />
                              </div>
                          </div>
                          <h2 className="text-2xl font-black text-slate-800 mb-2">Revision Hub Locked</h2>
                          <p className="text-slate-500 mb-6 max-w-xs">
                              {access.reason === 'FEED_LOCKED' ? 'This feature is currently disabled by Admin.' : 'Upgrade your plan to unlock smart revision tools.'}
                          </p>
                          <Button onClick={() => onTabChange('STORE')} variant="primary">View Plans</Button>
                      </div>
                  );
              }
              return (
                  <RevisionHub
                      user={user}
                      onTabChange={onTabChange}
                      settings={settings}
                      onUpdateUser={handleUserUpdate}
                      onNavigateContent={(type, chapterId, topicName, subjectName) => {
                          setTopicFilter(topicName);
                          if (type === 'PDF') {
                              setLoadingChapters(true);
                              fetchChapters(user.board || 'CBSE', user.classLevel || '10', user.stream || 'Science', null, 'English').then(allChapters => {
                                  const ch = allChapters.find(c => c.id === chapterId);
                                  if (ch) {
                                      onTabChange('PDF');
                                      const subjects = getSubjectsList(user.classLevel || '10', user.stream || 'Science');
                                      let targetSubject = selectedSubject;
                                      if (subjectName) { targetSubject = subjects.find(s => s.name === subjectName) || subjects[0]; } else if (!targetSubject) { targetSubject = subjects[0]; }
                                      setSelectedSubject(targetSubject);
                                      setSelectedChapter(ch);
                                      setContentViewStep('PLAYER');
                                      setFullScreen(true);
                                  } else { showAlert("Content not found or not loaded.", "ERROR"); }
                                  setLoadingChapters(false);
                              });
                          }
                      }}
                  />
              );
          })()
        )}

        {/* ... (Other Tabs with similar checks if needed) ... */}

        {/* STUDENT AI ASSISTANT (Chat Check) */}
        <StudentAiAssistant 
            user={user} 
            settings={settings} 
            isOpen={activeTab === 'AI_CHAT'} 
            onClose={() => onTabChange('HOME')} 
        />
    </div>
  );
};
