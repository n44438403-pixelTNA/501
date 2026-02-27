
import { Subject } from './types';
import { FULL_SYLLABUS } from './utils/full_syllabus_data';
// @ts-ignore
// import { COMPETITION_DATA } from './competition_syllabus';

export const APP_VERSION = "1.0.1";
export const ADMIN_EMAIL = "nadiman0636indo@gmail.com";
export const SUPPORT_EMAIL = "nadiman0636indo@gmail.com";

export const DEFAULT_CONTENT_INFO_CONFIG = {
    freeNotes: {
        enabled: true,
        title: "Strong Concepts. Clear Theory. Exam-Ready Notes.",
        details: "NCERT + syllabus aligned structured notes\nEasy language, clear explanation\nIdeal for first reading & basic exam preparation",
        bestFor: "School / college students\nFirst-time learners\nFoundation building"
    },
    premiumNotes: {
        enabled: true,
        title: "Think Like a Topper. Write Like an Examiner.",
        details: "Deep analytical notes with answer-writing framework\nCase studies, criticism & evaluation included\nDesigned for high-scoring answers in competitive exams",
        bestFor: "Serious aspirants\nCompetition / State PSC / advanced exams\nStudents targeting top marks"
    },
    freeVideo: {
        enabled: true,
        title: "Concept Clarity & Foundation Building",
        details: "Easy to understand explanations\nCovers syllabus basics thoroughly\nGood for revision and concept grasping",
        bestFor: "School students\nBasic understanding\nQuick Revision"
    },
    premiumVideo: {
        enabled: true,
        title: "Advanced Analysis & Exam Strategy",
        details: "In-depth topic coverage with advanced examples\nExam-oriented problem solving tricks\nDeep dive into complex concepts",
        bestFor: "Competitive exam aspirants\nAdvanced learners\nToppers targeting 100%"
    }
};

export const DEFAULT_APP_FEATURES = [
    { id: 'f1', title: 'Smart Video Lectures', enabled: true, order: 1 },
    { id: 'f2', title: 'PDF Notes Library', enabled: true, order: 2 },
    { id: 'f3', title: 'MCQ Practice Zone', enabled: true, order: 3 },
    { id: 'f4', title: 'Weekly Tests', enabled: false, order: 4 },
    { id: 'f5', title: 'Leaderboard', enabled: true, order: 5 },
    { id: 'f6', title: 'Engagement Rewards', enabled: true, order: 6 },
    { id: 'f7', title: 'Universal Chat', enabled: false, order: 7 },
    { id: 'f8', title: 'Private Admin Support', enabled: true, order: 8 },
    { id: 'f9', title: 'Spin Wheel Game', enabled: true, order: 9 },
    { id: 'f10', title: 'Credit System', enabled: true, order: 10 },
    { id: 'f11', title: 'Subscription Plans', enabled: true, order: 11 },
    { id: 'f12', title: 'Store', enabled: true, order: 12 },
    { id: 'f13', title: 'Profile Customization', enabled: true, order: 13 },
    { id: 'f14', title: 'Study Timer', enabled: true, order: 14 },
    { id: 'f15', title: 'Streak System', enabled: true, order: 15 },
    { id: 'f16', title: 'User Inbox', enabled: true, order: 16 },
    { id: 'f17', title: 'Admin Dashboard', enabled: true, order: 17 },
    { id: 'f18', title: 'Content Manager', enabled: true, order: 18 },
    { id: 'f19', title: 'Bulk Upload', enabled: true, order: 19 },
    { id: 'f20', title: 'Security System', enabled: true, order: 20 },
    { id: 'f21', title: 'Performance History', enabled: true, order: 21 },
    { id: 'f22', title: 'Dark/Light Mode', enabled: true, order: 22 },
    { id: 'f23', title: 'Responsive Design', enabled: true, order: 23 },
    { id: 'f24', title: 'PDF Watermarking', enabled: true, order: 24 },
    { id: 'f25', title: 'Auto-Sync', enabled: true, order: 25 },
    { id: 'f26', title: 'Offline Capabilities', enabled: true, order: 26 },
    { id: 'f27', title: 'Guest Access', enabled: true, order: 27 },
    { id: 'f28', title: 'Passwordless Login', enabled: true, order: 28 },
    { id: 'f29', title: 'Custom Subjects', enabled: true, order: 29 },
    { id: 'f30', title: 'Gift Codes', enabled: true, order: 30 },
    { id: 'f31', title: 'Featured Shortcuts', enabled: true, order: 31 },
    { id: 'f32', title: 'Notice Board', enabled: true, order: 32 },
    { id: 'f33', title: 'Startup Ad', enabled: true, order: 33 },
    { id: 'f34', title: 'External Apps', enabled: true, order: 34 },
    { id: 'f35', title: 'Activity Log', enabled: true, order: 35 },
    { id: 'f36', title: 'AI Question Generator', enabled: true, order: 36 },
    { id: 'f37', title: 'Payment Gateway Integration', enabled: true, order: 37 },
    { id: 'f38', title: 'Class Management', enabled: true, order: 38 },
    { id: 'f39', title: 'Stream Support', enabled: true, order: 39 },
    { id: 'f40', title: 'Board Support', enabled: true, order: 40 },
    { id: 'f41', title: 'Multi-Language Support', enabled: true, order: 41 },
    { id: 'f42', title: 'Fast Search', enabled: true, order: 42 },
    { id: 'f43', title: 'Recycle Bin', enabled: true, order: 43 },
    { id: 'f44', title: 'Data Backup', enabled: true, order: 44 },
    { id: 'f45', title: 'Deployment Tools', enabled: true, order: 45 },
    { id: 'f46', title: 'Role Management', enabled: true, order: 46 },
    { id: 'f47', title: 'Ban System', enabled: true, order: 47 },
    { id: 'f48', title: 'Impersonation Mode', enabled: true, order: 48 },
    { id: 'f49', title: 'Daily Goals', enabled: true, order: 49 },
    { id: 'f50', title: 'Visual Analytics', enabled: true, order: 50 }
];

export const DEFAULT_SUBJECTS = {
  physics: { id: 'physics', name: 'Physics', icon: 'physics', color: 'bg-blue-50 text-blue-600' },
  chemistry: { id: 'chemistry', name: 'Chemistry', icon: 'flask', color: 'bg-purple-50 text-purple-600' },
  biology: { id: 'biology', name: 'Biology', icon: 'bio', color: 'bg-green-50 text-green-600' },
  math: { id: 'math', name: 'Mathematics', icon: 'math', color: 'bg-emerald-50 text-emerald-600' },
  history: { id: 'history', name: 'History', icon: 'history', color: 'bg-rose-50 text-rose-600' },
  geography: { id: 'geography', name: 'Geography', icon: 'geo', color: 'bg-indigo-50 text-indigo-600' },
  polity: { id: 'polity', name: 'Political Science', icon: 'gov', color: 'bg-amber-50 text-amber-600' },
  economics: { id: 'economics', name: 'Economics', icon: 'social', color: 'bg-cyan-50 text-cyan-600' },
  business: { id: 'business', name: 'Business Studies', icon: 'business', color: 'bg-blue-50 text-blue-600' },
  accounts: { id: 'accounts', name: 'Accountancy', icon: 'accounts', color: 'bg-emerald-50 text-emerald-600' },
  science: { id: 'science', name: 'Science', icon: 'science', color: 'bg-blue-50 text-blue-600' },
  sst: { id: 'sst', name: 'Social Science', icon: 'geo', color: 'bg-orange-50 text-orange-600' },
  english: { id: 'english', name: 'English', icon: 'english', color: 'bg-sky-50 text-sky-600' },
  hindi: { id: 'hindi', name: 'Hindi', icon: 'hindi', color: 'bg-orange-50 text-orange-600' },
  sanskrit: { id: 'sanskrit', name: 'Sanskrit', icon: 'book', color: 'bg-yellow-50 text-yellow-600' },
  computer: { id: 'computer', name: 'Computer Science', icon: 'computer', color: 'bg-slate-50 text-slate-600' }
};

export const getSubjectsList = (classLevel: string, stream: string | null, board?: string): Subject[] => {
  const isSenior = ['11', '12'].includes(classLevel);
  let pool = { ...DEFAULT_SUBJECTS };
  try {
      const stored = localStorage.getItem('nst_custom_subjects_pool');
      if (stored) {
          pool = JSON.parse(stored);
      }
  } catch (e) {
      console.error("Error loading dynamic subjects", e);
  }

  const allKeys = Object.keys(pool);
  const coreKeys = Object.keys(DEFAULT_SUBJECTS);
  const customKeys = allKeys.filter(k => !coreKeys.includes(k));

  let selectedSubjects: Subject[] = [];
  const commonSubjects = [pool.english, pool.hindi, pool.computer];

  if (classLevel === 'COMPETITION') {
      selectedSubjects = [
          pool.history,
          pool.polity,
          pool.geography,
          pool.economics,
          pool.physics,
          pool.chemistry,
          pool.biology,
          pool.math
      ].filter(Boolean);
  }
  else if (!isSenior) {
      selectedSubjects = [
          pool.math,
          pool.science,
          pool.sst,
          pool.english,
          pool.hindi,
          pool.sanskrit,
          pool.computer
      ].filter(Boolean);
  }
  else {
      if (stream === 'Science') {
          selectedSubjects = [pool.physics, pool.chemistry, pool.math, pool.biology, ...commonSubjects];
      } else if (stream === 'Commerce') {
          selectedSubjects = [pool.accounts, pool.business, pool.economics, pool.math, ...commonSubjects];
      } else if (stream === 'Arts') {
          selectedSubjects = [pool.history, pool.geography, pool.polity, pool.economics, ...commonSubjects];
      }
      selectedSubjects = selectedSubjects.filter(Boolean);
  }

  customKeys.forEach(key => {
      if (pool[key]) selectedSubjects.push(pool[key]);
  });

  if (board === 'BSEB') {
      const hindiMap: Record<string, string> = {
          'Physics': 'भौतिकी',
          'Chemistry': 'रसायन शास्त्र',
          'Biology': 'जीव विज्ञान',
          'Mathematics': 'गणित',
          'History': 'इतिहास',
          'Geography': 'भूगोल',
          'Political Science': 'राजनीति विज्ञान',
          'Economics': 'अर्थशास्त्र',
          'Business Studies': 'व्यवसाय अध्ययन',
          'Accountancy': 'लेखाशास्त्र',
          'Science': 'विज्ञान',
          'Social Science': 'सामाजिक विज्ञान',
          'English': 'अंग्रेजी',
          'Hindi': 'हिन्दी',
          'Sanskrit': 'संस्कृत',
          'Computer Science': 'कंप्यूटर विज्ञान'
      };

      selectedSubjects = selectedSubjects.map(s => ({
          ...s,
          name: hindiMap[s.name] || s.name
      }));
  }

  return selectedSubjects;
};

export const STATIC_SYLLABUS: Record<string, string[]> = FULL_SYLLABUS;

export const ADMIN_PERMISSIONS = [
    'VIEW_DASHBOARD', 'VIEW_USERS', 'MANAGE_USERS', 'DELETE_USERS',
    'MANAGE_SUBS', 'GRANT_FREE_SUB', 'VIEW_REVENUE',
    'MANAGE_CONTENT', 'UPLOAD_VIDEO', 'UPLOAD_PDF', 'CREATE_MCQ', 'CREATE_TEST', 'MANAGE_AI_NOTES',
    'MANAGE_SETTINGS', 'EDIT_APP_NAME', 'EDIT_THEME', 'MANAGE_API_KEYS',
    'MANAGE_NOTICES', 'SEND_NOTIFICATIONS', 'MANAGE_CHAT', 'BAN_USERS',
    'VIEW_LOGS', 'VIEW_DATABASE', 'MANAGE_GIFT_CODES', 'MANAGE_SUB_ADMINS',
    'MANAGE_REWARDS', 'MANAGE_STORE', 'MANAGE_PACKAGES', 'MANAGE_PLANS',
    'MANAGE_ADS', 'MANAGE_EXTERNAL_APPS', 'MANAGE_SYLLABUS',
    'VIEW_DEMANDS', 'APPROVE_LOGIN_REQS', 'DEPLOY_APP', 'RESET_SYSTEM'
];

export const ALL_APP_FEATURES = [
    { id: 'MY_COURSE', title: 'My Course', enabled: true },
    { id: 'MY_ANALYSIS', title: 'My Analysis', enabled: true },
    { id: 'STUDY_GOAL_PERF', title: 'Study Goal Performance', enabled: true },
    { id: 'STUDENT_MENU', title: 'Student Menu', enabled: true },
    { id: 'HISTORY_PAGE', title: 'History Page', enabled: true },
    { id: 'PROFILE_PAGE', title: 'Profile Page', enabled: true },
    { id: 'INBOX', title: 'Inbox', enabled: true },
    { id: 'INBOX_MARKSHEET', title: 'Inbox Marksheet', enabled: true },
    { id: 'MY_PLAN', title: 'My Plan', enabled: true },
    { id: 'FLOATING_BTN', title: 'Floating Button', enabled: true },
    { id: 'STORE_PAGE', title: 'Store Page', enabled: true },
    { id: 'UNIVERSAL_INFO', title: 'Universal Information', enabled: true },
    { id: 'REVISION_HUB', title: 'Revision Hub (Base)', enabled: true },
    { id: 'REVISION_HUB_FREE', title: 'Free Revision Hub', enabled: true },
    { id: 'REVISION_HUB_PREMIUM', title: 'Premium Revision Hub', enabled: true },
    { id: 'TODAY_TASK', title: 'Today Task', enabled: true },
    { id: 'MCQ_TAB', title: 'MCQ Tab (Revision)', enabled: true },
    { id: 'MISTAKE_TAB', title: 'Mistake Tab', enabled: true },
    { id: 'WEEK_STRENGTH', title: 'Week Analysis', enabled: true },
    { id: 'AVG_STRENGTH', title: 'Average Strength', enabled: true },
    { id: 'STRONG_STRENGTH', title: 'Strong Strength', enabled: true },
    { id: 'AI_PLAN', title: 'AI Plan', enabled: true },
    { id: 'YESTERDAY_REPORT', title: 'Yesterday Report', enabled: true },
    { id: 'START_REVISION', title: 'Start Revision Button', enabled: true },
    { id: 'MASTERY_30_DAY', title: '30 Day Mastery', enabled: true },
    { id: 'WHATS_NEW_VIDEO', title: 'Whats New Video Lectures', enabled: true },
    { id: 'FREE_VIDEOS', title: 'Free Videos', enabled: true },
    { id: 'PREMIUM_VIDEOS', title: 'Premium Videos', enabled: true },
    { id: 'VIDEO_LIB', title: 'Video Library', enabled: true },
    { id: 'NOTES_LIB', title: 'Notes Library', enabled: true },
    { id: 'FREE_NOTES', title: 'Free Notes', enabled: true },
    { id: 'PREMIUM_NOTES', title: 'Premium Notes', enabled: true },
    { id: 'TOPIC_NOTES', title: 'Topic Notes', enabled: true },
    { id: 'RECOMMEND_NOTES', title: 'Recommended Notes', enabled: true },
    { id: 'MCQ_LIB', title: 'MCQ Library', enabled: true },
    { id: 'FREE_MCQ', title: 'Free MCQ', enabled: true },
    { id: 'PREMIUM_MCQ', title: 'Premium MCQ', enabled: true },
    { id: 'MISTAKES_PAGE', title: 'Mistakes Page', enabled: true },
    { id: 'RECENT_TESTS', title: 'Recent Tests', enabled: true },
    { id: 'AUDIO_LIB', title: 'Audio Library', enabled: true },
    { id: 'TTS_FEATURE', title: 'Text-to-Speech (TTS)', enabled: true },
    { id: 'AI_HUB_BANNER', title: 'AI Hub Banner', enabled: true },
    { id: 'DEEP_ANALYSIS', title: 'Deep Analysis', enabled: true },
    { id: 'AI_CHAT_TURBO', title: 'AI Chat Turbo', enabled: true },
    { id: 'AI_INSIGHT_MAP', title: 'AI Insight Roadmap', enabled: true },
    { id: 'PREMIUM_ANALYSIS', title: 'Premium Analysis', enabled: true },
    { id: 'PLAY_GAME', title: 'Play Game', enabled: true },
    { id: 'REDEEM_PRIZES', title: 'Redeem Prizes', enabled: true },
    { id: 'DISCOUNT_EVENT', title: 'Discount Event', enabled: true },
    { id: 'ACCURACY_STAT', title: 'Accuracy Stat', enabled: true },
    { id: 'SPEED_STAT', title: 'Speed Stat', enabled: true },
    { id: 'PERF_TREND', title: 'Performance Trend', enabled: true },
    { id: 'STRONG_AREA', title: 'Strong Areas', enabled: true },
    { id: 'AREA_IMPROVING', title: 'Area Improving', enabled: true },
    { id: 'FOCUS_NEEDED', title: 'Focus Needed', enabled: true },
    { id: 'OFFICIAL_MARKSHEET', title: 'Official Marksheet', enabled: true },
    { id: 'OMR_SHEET', title: 'OMR Sheet', enabled: true },
    { id: 'PROGRESS_DELTA', title: 'Progress Delta', enabled: true },
    { id: 'MISTAKE_PATTERN', title: 'Mistake Pattern Analysis', enabled: true },
    { id: 'TOPIC_BREAKDOWN', title: 'Topic Breakdown', enabled: true },
    { id: 'TOPIC_DIST', title: 'Topic Strength Distribution', enabled: true },
    { id: 'DOWNLOAD_ANALYSIS', title: 'Download Full Analysis', enabled: true },
    { id: 'REQUEST_CONTENT', title: 'Requested Content', enabled: true },
    { id: 'f4', title: 'Weekly Tests', enabled: true },
    { id: 'f5', title: 'Live Leaderboard', enabled: true },
    { id: 'f6', title: 'Engagement Rewards', enabled: true },
    { id: 'f7', title: 'Universal Chat', enabled: true },
    { id: 'f8', title: 'Private Admin Support', enabled: true },
    { id: 'f9', title: 'Spin Wheel Game', enabled: true },
    { id: 'f10', title: 'Credit System', enabled: true },
    { id: 'f11', title: 'Subscription Plans', enabled: true },
    { id: 'f12', title: 'Store', enabled: true },
    { id: 'f13', title: 'Profile Customization', enabled: true },
    { id: 'f14', title: 'Study Timer', enabled: true },
    { id: 'f15', title: 'Streak System', enabled: true },
    { id: 'f16', title: 'User Inbox', enabled: true },
    { id: 'f17', title: 'Admin Dashboard', enabled: true },
    { id: 'f18', title: 'Content Manager', enabled: true },
    { id: 'f19', title: 'Bulk Upload', enabled: true },
    { id: 'f20', title: 'Security System', enabled: true },
    { id: 'f21', title: 'Performance History', enabled: true },
    { id: 'f22', title: 'Dark/Light Mode', enabled: true },
    { id: 'f23', title: 'Responsive Design', enabled: true },
    { id: 'f25', title: 'Auto-Sync', enabled: true },
    { id: 'f26', title: 'Offline Capabilities', enabled: true },
    { id: 'f27', title: 'Guest Access', enabled: true },
    { id: 'f28', title: 'Passwordless Login', enabled: true },
    { id: 'f29', title: 'Custom Subjects', enabled: true },
    { id: 'f30', title: 'Gift Codes', enabled: true },
    { id: 'f31', title: 'Featured Shortcuts', enabled: true },
    { id: 'f32', title: 'Notice Board', enabled: true },
    { id: 'f33', title: 'Startup Ad', enabled: true },
    { id: 'f34', title: 'External Apps', enabled: true },
    { id: 'f35', title: 'Activity Log', enabled: true },
    { id: 'f36', title: 'AI Question Generator', enabled: true },
    { id: 'f37', title: 'Payment Gateway Integration', enabled: true },
    { id: 'f38', title: 'Class Management', enabled: true },
    { id: 'f39', title: 'Stream Support', enabled: true },
    { id: 'f40', title: 'Board Support', enabled: true },
    { id: 'f41', title: 'Multi-Language Support', enabled: true },
    { id: 'f42', title: 'Fast Search', enabled: true },
    { id: 'f43', title: 'Recycle Bin', enabled: true },
    { id: 'f44', title: 'Data Backup', enabled: true },
    { id: 'f45', title: 'Deployment Tools', enabled: true },
    { id: 'f46', title: 'Role Management', enabled: true },
    { id: 'f47', title: 'Ban System', enabled: true },
    { id: 'f48', title: 'Impersonation Mode', enabled: true },
    { id: 'f49', title: 'Daily Goals', enabled: true },
    { id: 'f50', title: 'Visual Analytics', enabled: true },
    { id: 'f51', title: 'Detailed Marksheet', enabled: true },
    { id: 'f52', title: 'Question Analysis', enabled: true },
    { id: 'f53', title: 'Time Management Stats', enabled: true },
    { id: 'f54', title: 'Subject Wise Progress', enabled: true },
    { id: 'f55', title: 'Topic Strength Meter', enabled: true },
    { id: 'f56', title: 'Weakness Detector', enabled: true },
    { id: 'f57', title: 'Video Resume', enabled: true },
    { id: 'f58', title: 'PDF Bookmark', enabled: true },
    { id: 'f59', title: 'Night Mode Reading', enabled: true },
    { id: 'f60', title: 'Text-to-Speech Notes', enabled: true },
    { id: 'f61', title: 'Search within PDF', enabled: true },
    { id: 'f62', title: 'Video Quality Control', enabled: true },
    { id: 'f63', title: 'Playback Speed Control', enabled: true },
    { id: 'f64', title: 'Picture-in-Picture Mode', enabled: true },
    { id: 'f65', title: 'Background Audio Play', enabled: true },
    { id: 'f66', title: 'Live Class Integration', enabled: true },
    { id: 'f67', title: 'Recorded Sessions', enabled: true },
    { id: 'f68', title: 'Doubt Clearing', enabled: true },
    { id: 'f69', title: 'Assignment Submission', enabled: true },
    { id: 'f70', title: 'Peer Comparison', enabled: true },
    { id: 'f71', title: 'Global Rank', enabled: true },
    { id: 'f72', title: 'State Rank', enabled: true },
    { id: 'f73', title: 'School Rank', enabled: true },
    { id: 'f74', title: 'Badges & Achievements', enabled: true },
    { id: 'f75', title: 'Referral System', enabled: true },
    { id: 'f76', title: 'Social Share', enabled: true },
    { id: 'f77', title: 'In-App Feedback', enabled: true },
    { id: 'f78', title: 'Bug Reporting', enabled: true },
    { id: 'f79', title: 'Feature Request', enabled: true },
    { id: 'f80', title: 'Privacy Control', enabled: true },
    { id: 'f81', title: 'Account Deletion', enabled: true },
    { id: 'f82', title: 'Data Export', enabled: true },
    { id: 'f83', title: 'Login History', enabled: true },
    { id: 'f84', title: 'Device Management', enabled: true },
    { id: 'f85', title: 'Session Timeout', enabled: true },
    { id: 'f86', title: 'Two-Factor Auth', enabled: true },
    { id: 'f87', title: 'Parent Connect', enabled: true },
    { id: 'f88', title: 'Attendance Tracker', enabled: true },
    { id: 'f89', title: 'Fee Management', enabled: true },
    { id: 'f90', title: 'Library Management', enabled: true },
    { id: 'f91', title: 'Transport Tracker', enabled: true },
    { id: 'f92', title: 'Hostel Management', enabled: true },
    { id: 'f93', title: 'Event Calendar', enabled: true },
    { id: 'f94', title: 'Holiday List', enabled: true },
    { id: 'f95', title: 'Exam Schedule', enabled: true },
    { id: 'f96', title: 'Result Publication', enabled: true },
    { id: 'f97', title: 'Syllabus Tracker', enabled: true },
    { id: 'f98', title: 'Lesson Planner', enabled: true },
    { id: 'f99', title: 'Teacher Remarks', enabled: true },
    { id: 'f100', title: 'Student Diary', enabled: true },
    { id: 'f101', title: 'AI Tutor', enabled: true },
    { id: 'f102', title: 'Voice Search', enabled: true },
    { id: 'f103', title: 'Gesture Control', enabled: true }
];

export const LEVEL_UNLOCKABLE_FEATURES = [
    { id: 'MCQ_PRACTICE', label: 'MCQ Practice Zone' },
    { id: 'AUDIO_LIBRARY', label: 'Audio Library & Podcasts' },
    { id: 'AI_GENERATOR', label: 'AI Notes Generator' },
    { id: 'GAMES', label: 'Games & Spin Wheel' },
    { id: 'COMPETITION_MODE', label: 'Competition Mode' },
    { id: 'ADVANCED_ANALYSIS', label: 'Advanced Analysis' },
    { id: 'REVISION_HUB', label: 'Revision Hub Access' },
    { id: 'WEEKLY_TESTS', label: 'Weekly Tests' }
];

export const LEVEL_UP_CONFIG = [
    { level: 1, featureId: 'BASIC_ACCESS', label: 'Basic App Access', description: 'Video Lectures & Notes' },
    { level: 2, featureId: 'PDF_DOWNLOAD', label: 'PDF Download', description: 'Download Notes Offline' },
    { level: 3, featureId: 'SEARCH', label: 'Search Content', description: 'Find topics instantly' },
    { level: 4, featureId: 'THEME', label: 'Dark Mode', description: 'Toggle Dark/Light Theme' },
    { level: 5, featureId: 'MCQ_PRACTICE', label: 'MCQ Practice', description: 'Practice Questions' },
    { level: 6, featureId: 'STREAK_PROTECT', label: 'Streak Freeze', description: '1 Day Streak Protection' },
    { level: 7, featureId: 'PROFILE_BADGE_1', label: 'Newbie Badge', description: 'Profile Badge Unlocked' },
    { level: 8, featureId: 'TTS_BASIC', label: 'Text-to-Speech', description: 'Listen to Notes' },
    { level: 9, featureId: 'DAILY_GOAL', label: 'Custom Goals', description: 'Set Daily Study Targets' },
    { level: 10, featureId: 'GAMES', label: 'Spin Wheel', description: 'Daily Spin & Win' },
    { level: 11, featureId: 'QUIZ_HISTORY', label: 'Quiz History', description: 'View Past Attempts' },
    { level: 12, featureId: 'AUDIO_LIBRARY', label: 'Audio Library', description: 'Access Audio Lectures' },
    { level: 13, featureId: 'NOTES_BOOKMARK', label: 'Bookmark Notes', description: 'Save Important Notes' },
    { level: 14, featureId: 'VIDEO_SPEED', label: 'Video Speed', description: 'Control Playback Speed' },
    { level: 15, featureId: 'LEADERBOARD', label: 'Global Leaderboard', description: 'Compete with others' },
    { level: 16, featureId: 'BADGE_LEARNER', label: 'Learner Badge', description: 'Profile Badge Unlocked' },
    { level: 17, featureId: 'AVATAR_CUSTOM', label: 'Custom Avatar', description: 'Change Profile Picture' },
    { level: 18, featureId: 'WEEKLY_TESTS', label: 'Weekly Tests', description: 'Participate in Tests' },
    { level: 19, featureId: 'RESULT_SHARE', label: 'Share Results', description: 'Share Marksheets' },
    { level: 20, featureId: 'REVISION_HUB', label: 'Revision Hub', description: 'Smart Revision Tools' },
    { level: 21, featureId: 'FLASH_CARDS', label: 'Flash Cards', description: 'Quick Recall Mode' },
    { level: 22, featureId: 'TTS_SPEED', label: 'TTS Speed Control', description: 'Adjust Audio Speed' },
    { level: 23, featureId: 'FOCUS_MODE', label: 'Focus Mode', description: 'Distraction Free View' },
    { level: 24, featureId: 'BADGE_SCHOLAR', label: 'Scholar Badge', description: 'Profile Badge Unlocked' },
    { level: 25, featureId: 'AI_GENERATOR', label: 'AI Notes', description: 'Generate Custom Notes' },
    { level: 26, featureId: 'PDF_ANNOTATE', label: 'PDF Annotate', description: 'Highlight & Draw on PDF' },
    { level: 27, featureId: 'VIDEO_PIP', label: 'Picture-in-Picture', description: 'Multitask Video' },
    { level: 28, featureId: 'ANALYTICS_BASIC', label: 'Basic Stats', description: 'View Study Graphs' },
    { level: 29, featureId: 'TOPIC_TEST', label: 'Topic Tests', description: 'Specific Topic Quizzes' },
    { level: 30, featureId: 'COMPETITION_MODE', label: 'Competition Mode', description: 'Unlock JEE/NEET Content' },
    { level: 31, featureId: 'BADGE_ELITE', label: 'Elite Badge', description: 'Profile Badge Unlocked' },
    { level: 32, featureId: 'GROUP_CHAT', label: 'Study Groups', description: 'Join Study Circles' },
    { level: 33, featureId: 'DOUBT_ASK', label: 'Ask Doubts', description: 'Post Questions to Admin' },
    { level: 34, featureId: 'OFFLINE_SYNC', label: 'Auto Sync', description: 'Background Data Sync' },
    { level: 35, featureId: 'ADVANCED_ANALYSIS', label: 'Deep Analysis', description: 'Full Performance Report' },
    { level: 36, featureId: 'MENTOR_ACCESS', label: 'Mentor Access', description: 'Request Guidance' },
    { level: 37, featureId: 'BADGE_MASTER', label: 'Master Badge', description: 'Profile Badge Unlocked' },
    { level: 38, featureId: 'AI_QUIZ_GEN', label: 'AI Quiz Gen', description: 'Create Custom Quizzes' },
    { level: 39, featureId: 'PRIORITY_REQ', label: 'Priority Request', description: 'Fast Content Requests' },
    { level: 40, featureId: 'AI_TUTOR', label: 'AI Tutor Chat', description: 'Chat with AI Mentor' },
    { level: 41, featureId: 'LIVE_CLASS', label: 'Live Classes', description: 'Join Live Sessions' },
    { level: 42, featureId: 'RECORDED_LIVE', label: 'Recorded Live', description: 'Watch Past Classes' },
    { level: 43, featureId: 'BADGE_LEGEND', label: 'Legend Badge', description: 'Profile Badge Unlocked' },
    { level: 44, featureId: 'VIP_STORE', label: 'VIP Store', description: 'Exclusive Items' },
    { level: 45, featureId: 'PRIORITY_SUPPORT', label: 'Priority Support', description: 'Direct Admin Access' },
    { level: 46, featureId: 'BETA_ACCESS', label: 'Beta Access', description: 'Try New Features First' },
    { level: 47, featureId: 'THEME_CUSTOM', label: 'Custom Themes', description: 'Personalize App Look' },
    { level: 48, featureId: 'BADGE_GODLIKE', label: 'Godlike Badge', description: 'Profile Badge Unlocked' },
    { level: 49, featureId: 'ADMIN_CHAT', label: 'Direct Line', description: 'Chat with Founder' },
    { level: 50, featureId: 'ULTIMATE_ACCESS', label: 'Ultimate Badge', description: 'Legend Status Unlocked' }
];

export const NSTA_DEFAULT_FEATURES = [
    { category: '📑 NOTES', id: 'QUICK_REVISION', label: 'Quick Revision', visible: true, limits: { free: 2, basic: undefined, ultra: undefined }, creditCost: 0 },
    { category: '📑 NOTES', id: 'DEEP_DIVE', label: 'Deep Dive Notes', visible: true, allowedTiers: ['BASIC', 'ULTRA'], limits: {}, creditCost: 0 },
    { category: '📑 NOTES', id: 'PREMIUM_NOTES', label: 'Premium Notes', visible: true, allowedTiers: ['BASIC', 'ULTRA'], limits: { basic: undefined, ultra: undefined }, creditCost: 5 },
    { category: '📑 NOTES', id: 'ADDITIONAL_NOTES', label: 'Additional Resources', visible: true, limits: { free: 1, basic: undefined, ultra: undefined }, creditCost: 0 },
    { category: '🎬 VIDEO', id: 'VIDEO_ACCESS', label: 'Video Lectures', visible: true, limits: { free: 2, basic: undefined, ultra: undefined }, creditCost: 0 },
    { category: '🎧 AUDIO', id: 'AUDIO_LIBRARY', label: 'Audio Library', visible: true, allowedTiers: ['ULTRA'], limits: {}, creditCost: 0 },
    { category: '📝 MCQ', id: 'MCQ_FREE', label: 'Free Practice', visible: true, limits: { free: 50, basic: undefined, ultra: undefined }, creditCost: 0 },
    { category: '📝 MCQ', id: 'MCQ_PREMIUM', label: 'Premium Tests', visible: true, allowedTiers: ['BASIC', 'ULTRA'], limits: {}, creditCost: 0 },
    { category: '🔄 REVISION', id: 'REVISION_HUB_FREE', label: 'Free Revision', visible: true, allowedTiers: ['FREE', 'BASIC', 'ULTRA'], limits: { free: 1 }, creditCost: 0 },
    { category: '🔄 REVISION', id: 'REVISION_HUB_PREMIUM', label: 'Premium Revision', visible: true, allowedTiers: ['BASIC', 'ULTRA'], limits: {}, creditCost: 0 },
    { category: '🤖 AI HUB', id: 'AI_CHAT', label: 'AI Hub Access', visible: true, allowedTiers: ['BASIC', 'ULTRA'], limits: { basic: 5, ultra: undefined }, creditCost: 2 },
];

export const DEFAULT_PLAN_COMPARISON = [
    {
        name: "1. CORE LEARNING FEATURES",
        features: [
            { id: 'NOTES_LIB', name: "PDF Notes Library", free: "🔒 First 2 Chapters", basic: "✅ Unlimited", ultra: "✅ Unlimited" },
            { id: 'VIDEO_ACCESS', name: "Video Lectures", free: "🔒 First 2 Videos", basic: "✅ Unlimited", ultra: "✅ Unlimited" },
            { id: 'TOPIC_CONTENT', name: "Topic-wise Notes", free: "❌ Locked", basic: "✅ Full Access", ultra: "✅ Full Access" },
            { id: 'AUDIO_LIBRARY', name: "Audio / Podcast", free: "❌ Locked", basic: "❌ Locked", ultra: "✅ Premium Only" },
            { id: 'QUICK_REVISION', name: "Quick Revision", free: "✅ Basic", basic: "✅ Full", ultra: "✅ Full" },
            { id: 'DEEP_DIVE', name: "Deep Dive Notes", free: "❌ Locked", basic: "✅ Yes", ultra: "✅ Yes" },
            { id: 'PREMIUM_NOTES', name: "Premium Notes", free: "❌ Locked", basic: "✅ Yes", ultra: "✅ Yes" },
            { id: 'ADDITIONAL_NOTES', name: "Additional Resources", free: "❌ Locked", basic: "✅ Yes", ultra: "✅ Yes" },
            { id: 'SEARCH', name: "Search Capability", free: "✅ Basic", basic: "✅ Advanced", ultra: "✅ Advanced" },
            { id: 'OFFLINE_SYNC', name: "Save / Offline Mode", free: "❌ No", basic: "✅ Yes", ultra: "✅ Yes" },
            { id: 'WATERMARK', name: "PDF Watermark", free: "⚠️ Free User", basic: "❌ No", ultra: "❌ No" }
        ]
    },
    {
        name: "2. REVISION HUB (USP)",
        features: [
            { id: 'REVISION_HUB', name: "Revision Hub Access", free: "❌ Locked", basic: "⚠️ 1 Day/Week", ultra: "✅ Daily" },
            { id: 'WEAK_SORT', name: "Weak/Avg/Strong Sorting", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { id: 'EXCELLENT_TAB', name: "Excellent (80%+) Tab", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { id: 'AI_PLAN', name: "Auto AI Plan", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { id: 'MISTAKE_PATTERN', name: "Mistake Pattern Analysis", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { id: 'MASTERY_30', name: "30-Day Mastery Logic", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { id: 'START_TODAY', name: "One-Click \"Start Today\"", free: "❌ No", basic: "⚠️ Limited", ultra: "✅ Yes" }
        ]
    },
    {
        name: "3. MCQ SYSTEM",
        features: [
            { id: 'MCQ_FREE', name: "Daily MCQ Limit", free: "30 Questions", basic: "50 Questions", ultra: "100 Questions" },
            { id: 'EXAM_MODE', name: "Exam Mode Timer", free: "❌ No", basic: "✅ Yes", ultra: "✅ Yes" },
            { id: 'SOLUTIONS', name: "Detailed Solutions", free: "❌ Only Right/Wrong", basic: "✅ Text Solution", ultra: "✅ AI Explanation" },
            { id: 'RE_ATTEMPT', name: "Re-attempt Wrong", free: "❌ No", basic: "✅ Yes", ultra: "✅ Instant" },
            { id: 'TOPIC_MCQ', name: "Topic-wise Bulk MCQ", free: "❌ No", basic: "⚠️ Limited", ultra: "✅ Full Access" },
            { id: 'MCQ_HISTORY', name: "History & Logs", free: "⚠️ 3 Days", basic: "✅ Full History", ultra: "✅ Full History" },
            { id: 'PALETTE', name: "Question Palette", free: "✅ Yes", basic: "✅ Yes", ultra: "✅ Yes" }
        ]
    },
    {
        name: "4. AI & SMART FEATURES",
        features: [
            { id: 'AI_CHAT', name: "AI Tutor Chat", free: "❌ No", basic: "🔒 5 Chats/day", ultra: "✅ Unlimited" },
            { id: 'SMART_SORT', name: "Smart Topic Sorting", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { id: 'WEAK_DETECT', name: "Weakness Detection", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { id: 'DYN_PLAN', name: "Dynamic Study Plan", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { id: 'AI_STUDIO', name: "AI Studio", free: "❌ No", basic: "❌ No", ultra: "✅ Full Access" }
        ]
    },
    {
        name: "5. TTS / STUDY TOOLS",
        features: [
            { id: 'TTS_FEATURE', name: "Text-to-Speech (TTS)", free: "⚠️ 1 min demo", basic: "✅ Unlimited", ultra: "✅ Unlimited" },
            { id: 'SPEED_CTRL', name: "Speed Control", free: "❌ No", basic: "❌ No", ultra: "✅ 0.5x – 2x" },
            { id: 'AUTO_SCROLL', name: "Auto Scroll", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { id: 'FOCUS_MODE', name: "Focus Mode", free: "❌ No", basic: "✅ Yes", ultra: "✅ Yes" },
            { id: 'STUDY_TIMER', name: "Study Timer", free: "✅ Basic", basic: "✅ Analytics", ultra: "✅ Analytics" }
        ]
    },
    {
        name: "6. GAMIFICATION & ECONOMY",
        features: [
            { id: 'COINS', name: "Coins / Credits Earning", free: "✅ Normal", basic: "✅ 1.5x Multiplier", ultra: "✅ 3x Multiplier" },
            { id: 'SPIN_WIN', name: "Spin & Win", free: "1 per day", basic: "5 per day", ultra: "10 per day" },
            { id: 'STREAK', name: "Daily Streak Protection", free: "✅ Yes", basic: "✅ Yes", ultra: "✅ Freeze (No loss)" },
            { id: 'LEADERBOARD', name: "Leaderboard Access", free: "View Only", basic: "Participate", ultra: "Top Badge" },
            { id: 'DOUBLE_CREDIT', name: "Double Credit Events", free: "❌ No", basic: "⚠️ Sometimes", ultra: "✅ Always Active" }
        ]
    },
    {
        name: "7. CONTENT REQUEST SYSTEM",
        features: [
            { id: 'REQUEST_CONTENT', name: "Request New Content", free: "❌ No", basic: "✅ Yes", ultra: "✅ VIP Access" },
            { id: 'PRIORITY_REQ', name: "Priority Level", free: "Low", basic: "Normal", ultra: "Top Priority" },
            { id: 'ADMIN_PROMISE', name: "Admin Promise", free: "❌ No", basic: "❌ No", ultra: "24h Delivery" }
        ]
    },
    {
        name: "8. ACCOUNT & SECURITY",
        features: [
            { id: 'GUEST_MODE', name: "Guest Mode", free: "✅ Yes", basic: "❌ No", ultra: "❌ No" },
            { id: 'DEVICE_LIMIT', name: "Device Login Limit", free: "1 Device", basic: "1 Device", ultra: "Multi-Device" },
            { id: 'GHOST_LOGIN', name: "Ghost Login (Admin)", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { id: 'PROFILE_EDIT', name: "Profile Edit", free: "Basic Info", basic: "Full Profile", ultra: "Full Profile" }
        ]
    },
    {
        name: "9. ADMIN POWER (ULTRA EXCLUSIVE)",
        features: [
            { id: 'LIVE_SPY', name: "Live User Spy", free: "❌ No", basic: "❌ No", ultra: "✅ Active" },
            { id: 'LOGIN_AS', name: "Login As User", free: "❌ No", basic: "❌ No", ultra: "✅ Active" },
            { id: 'NOTIFICATIONS', name: "Targeted Notifications", free: "❌ No", basic: "❌ No", ultra: "✅ Active" },
            { id: 'FLASH_SALE', name: "Flash Sale Auto Trigger", free: "❌ No", basic: "❌ No", ultra: "✅ Active" },
            { id: 'ABANDON_DISC', name: "Payment Abandon Discount", free: "❌ No", basic: "❌ No", ultra: "✅ Active" },
            { id: 'CREDIT_PANEL', name: "Credit Control Panel", free: "❌ No", basic: "❌ No", ultra: "✅ Active" }
        ]
    }
];

export const STUDENT_APP_FEATURES = ALL_APP_FEATURES.filter(f =>
    !['f17', 'f18', 'f19', 'f20', 'f34', 'f37', 'f43', 'f44', 'f45', 'f46', 'f47', 'f48', 'f89', 'f90', 'f91', 'f92', 'f88', 'f87'].includes(f.id)
);
