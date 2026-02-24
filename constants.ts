
import { Subject } from './types';
// @ts-ignore
import { COMPETITION_DATA } from './competition_syllabus';

export const APP_VERSION = "1.0.1"; // NEW: Current App Version
export const ADMIN_EMAIL = "nadiman0636indo@gmail.com";
export const SUPPORT_EMAIL = "nadiman0636indo@gmail.com";

export const STATIC_SYLLABUS = {
    "Math": ["Algebra", "Geometry"],
    "Science": ["Physics", "Chemistry"]
};

export const DEFAULT_SUBJECTS: Record<string, Subject> = {
    math: { id: 'math', name: 'Mathematics', icon: 'Calculator', color: 'bg-blue-100 text-blue-600' },
    science: { id: 'science', name: 'Science', icon: 'FlaskConical', color: 'bg-green-100 text-green-600' },
    english: { id: 'english', name: 'English', icon: 'BookA', color: 'bg-yellow-100 text-yellow-600' },
    social: { id: 'social', name: 'Social Studies', icon: 'Globe', color: 'bg-orange-100 text-orange-600' }
};

export const getSubjectsList = (classLevel: string, stream: string | null): Subject[] => {
    return Object.values(DEFAULT_SUBJECTS);
};

export const ADMIN_PERMISSIONS = [
    'MANAGE_USERS', 'MANAGE_SUB_ADMINS', 'MANAGE_SUBS', 'MANAGE_CONTENT', 'MANAGE_SETTINGS', 'VIEW_LOGS', 'VIEW_DEMANDS', 'APPROVE_LOGIN_REQS', 'MANAGE_GIFT_CODES'
];

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
    { id: 'f1', title: 'Smart Video Lectures', enabled: true, order: 1, category: 'CONTENT' },
    { id: 'f2', title: 'PDF Notes Library', enabled: true, order: 2, category: 'CONTENT' },
    { id: 'f3', title: 'MCQ Practice Zone', enabled: true, order: 3, category: 'MCQ' },
    { id: 'f4', title: 'Weekly Tests', enabled: false, order: 4, category: 'MCQ' },
    { id: 'f5', title: 'Leaderboard', enabled: true, order: 5, category: 'GAMES' },
    { id: 'f6', title: 'Engagement Rewards', enabled: true, order: 6, category: 'GAMES' },
    { id: 'f7', title: 'Universal Chat', enabled: false, order: 7, category: 'TOOLS' },
    { id: 'f8', title: 'Private Admin Support', enabled: true, order: 8, category: 'TOOLS' },
    { id: 'f9', title: 'Spin Wheel Game', enabled: true, order: 9, category: 'GAMES' },
    { id: 'f10', title: 'Credit System', enabled: true, order: 10, category: 'GAMES' },
    { id: 'f11', title: 'Subscription Plans', enabled: true, order: 11, category: 'TOOLS' },
    { id: 'f12', title: 'Store', enabled: true, order: 12, category: 'TOOLS' },
    { id: 'f13', title: 'Profile Customization', enabled: true, order: 13, category: 'TOOLS' },
    { id: 'f14', title: 'Study Timer', enabled: true, order: 14, category: 'TOOLS' },
    { id: 'f15', title: 'Streak System', enabled: true, order: 15, category: 'GAMES' },
    { id: 'f16', title: 'User Inbox', enabled: true, order: 16, category: 'TOOLS' },
    { id: 'f17', title: 'Admin Dashboard', enabled: true, order: 17, category: 'ADMIN' },
    { id: 'f18', title: 'Content Manager', enabled: true, order: 18, category: 'ADMIN' },
    { id: 'f19', title: 'Bulk Upload', enabled: true, order: 19, category: 'ADMIN' },
    { id: 'f20', title: 'Security System', enabled: true, order: 20, category: 'ADMIN' },
    { id: 'f21', title: 'Performance History', enabled: true, order: 21, category: 'ANALYSIS' },
    { id: 'f22', title: 'Dark/Light Mode', enabled: true, order: 22, category: 'TOOLS' },
    { id: 'f23', title: 'Responsive Design', enabled: true, order: 23, category: 'TOOLS' },
    { id: 'f24', title: 'PDF Watermarking', enabled: true, order: 24, category: 'CONTENT' },
    { id: 'f25', title: 'Auto-Sync', enabled: true, order: 25, category: 'TOOLS' },
    { id: 'f26', title: 'Offline Capabilities', enabled: true, order: 26, category: 'TOOLS' },
    { id: 'f27', title: 'Guest Access', enabled: true, order: 27, category: 'TOOLS' },
    { id: 'f28', title: 'Passwordless Login', enabled: true, order: 28, category: 'TOOLS' },
    { id: 'f29', title: 'Custom Subjects', enabled: true, order: 29, category: 'CONTENT' },
    { id: 'f30', title: 'Gift Codes', enabled: true, order: 30, category: 'TOOLS' },
    { id: 'f31', title: 'Featured Shortcuts', enabled: true, order: 31, category: 'TOOLS' },
    { id: 'f32', title: 'Notice Board', enabled: true, order: 32, category: 'TOOLS' },
    { id: 'f33', title: 'Startup Ad', enabled: true, order: 33, category: 'TOOLS' },
    { id: 'f34', title: 'External Apps', enabled: true, order: 34, category: 'TOOLS' },
    { id: 'f35', title: 'Activity Log', enabled: true, order: 35, category: 'ANALYSIS' },
    { id: 'f36', title: 'AI Question Generator', enabled: true, order: 36, category: 'AI' },
    { id: 'f37', title: 'Payment Gateway Integration', enabled: true, order: 37, category: 'TOOLS' },
    { id: 'f38', title: 'Class Management', enabled: true, order: 38, category: 'CONTENT' },
    { id: 'f39', title: 'Stream Support', enabled: true, order: 39, category: 'CONTENT' },
    { id: 'f40', title: 'Board Support', enabled: true, order: 40, category: 'CONTENT' },
    { id: 'f41', title: 'Multi-Language Support', enabled: true, order: 41, category: 'CONTENT' },
    { id: 'f42', title: 'Fast Search', enabled: true, order: 42, category: 'TOOLS' },
    { id: 'f43', title: 'Recycle Bin', enabled: true, order: 43, category: 'ADMIN' },
    { id: 'f44', title: 'Data Backup', enabled: true, order: 44, category: 'ADMIN' },
    { id: 'f45', title: 'Deployment Tools', enabled: true, order: 45, category: 'ADMIN' },
    { id: 'f46', title: 'Role Management', enabled: true, order: 46, category: 'ADMIN' },
    { id: 'f47', title: 'Ban System', enabled: true, order: 47, category: 'ADMIN' },
    { id: 'f48', title: 'Impersonation Mode', enabled: true, order: 48, category: 'ADMIN' },
    { id: 'f49', title: 'Daily Goals', enabled: true, order: 49, category: 'TOOLS' },
    { id: 'f50', title: 'Visual Analytics', enabled: true, order: 50, category: 'ANALYSIS' }
];

// --- ALL APP FEATURES (200+) - Comprehensive List ---
export const ALL_APP_FEATURES = [
    // --- DASHBOARD & MENU ---
    { id: 'MY_COURSE', title: 'My Course', enabled: true, category: 'DASHBOARD' },
    { id: 'MY_ANALYSIS', title: 'My Analysis', enabled: true, category: 'ANALYSIS' },
    { id: 'STUDY_GOAL_PERF', title: 'Study Goal Performance', enabled: true, category: 'ANALYSIS' },
    { id: 'STUDENT_MENU', title: 'Student Menu', enabled: true, category: 'DASHBOARD' },
    { id: 'HISTORY_PAGE', title: 'History Page', enabled: true, category: 'ANALYSIS' },
    { id: 'PROFILE_PAGE', title: 'Profile Page', enabled: true, category: 'DASHBOARD' },
    { id: 'INBOX', title: 'Inbox', enabled: true, category: 'TOOLS' },
    { id: 'INBOX_MARKSHEET', title: 'Inbox Marksheet', enabled: true, category: 'ANALYSIS' },
    { id: 'MY_PLAN', title: 'My Plan', enabled: true, category: 'TOOLS' },
    { id: 'FLOATING_BTN', title: 'Floating Button', enabled: true, category: 'DASHBOARD' },
    { id: 'STORE_PAGE', title: 'Store Page', enabled: true, category: 'TOOLS' },
    { id: 'UNIVERSAL_INFO', title: 'Universal Information', enabled: true, category: 'TOOLS' },

    // --- REVISION HUB ---
    { id: 'REVISION_HUB', title: 'Revision Hub (Base)', enabled: true, category: 'REVISION' },
    { id: 'REVISION_HUB_FREE', title: 'Free Revision Hub', enabled: true, category: 'REVISION' },
    { id: 'REVISION_HUB_PREMIUM', title: 'Premium Revision Hub', enabled: true, category: 'REVISION' },
    { id: 'TODAY_TASK', title: 'Today Task', enabled: true, category: 'REVISION' },
    { id: 'MCQ_TAB', title: 'MCQ Tab (Revision)', enabled: true, category: 'REVISION' },
    { id: 'MISTAKE_TAB', title: 'Mistake Tab', enabled: true, category: 'REVISION' },
    { id: 'WEEK_STRENGTH', title: 'Week Analysis', enabled: true, category: 'ANALYSIS' },
    { id: 'AVG_STRENGTH', title: 'Average Strength', enabled: true, category: 'ANALYSIS' },
    { id: 'STRONG_STRENGTH', title: 'Strong Strength', enabled: true, category: 'ANALYSIS' },
    { id: 'AI_PLAN', title: 'AI Plan', enabled: true, category: 'REVISION' },
    { id: 'YESTERDAY_REPORT', title: 'Yesterday Report', enabled: true, category: 'ANALYSIS' },
    { id: 'START_REVISION', title: 'Start Revision Button', enabled: true, category: 'REVISION' },
    { id: 'MASTERY_30_DAY', title: '30 Day Mastery', enabled: true, category: 'REVISION' },

    // --- CONTENT: VIDEO ---
    { id: 'WHATS_NEW_VIDEO', title: 'Whats New Video Lectures', enabled: true, category: 'CONTENT' },
    { id: 'FREE_VIDEOS', title: 'Free Videos', enabled: true, category: 'CONTENT' },
    { id: 'PREMIUM_VIDEOS', title: 'Premium Videos', enabled: true, category: 'CONTENT' },
    { id: 'VIDEO_LIB', title: 'Video Library', enabled: true, category: 'CONTENT' },

    // --- CONTENT: NOTES ---
    { id: 'NOTES_LIB', title: 'Notes Library', enabled: true, category: 'CONTENT' },
    { id: 'FREE_NOTES', title: 'Free Notes', enabled: true, category: 'CONTENT' },
    { id: 'PREMIUM_NOTES', title: 'Premium Notes', enabled: true, category: 'CONTENT' },
    { id: 'TOPIC_NOTES', title: 'Topic Notes', enabled: true, category: 'CONTENT' },
    { id: 'RECOMMEND_NOTES', title: 'Recommended Notes', enabled: true, category: 'CONTENT' },

    // --- CONTENT: MCQ ---
    { id: 'MCQ_LIB', title: 'MCQ Library', enabled: true, category: 'MCQ' },
    { id: 'FREE_MCQ', title: 'Free MCQ', enabled: true, category: 'MCQ' },
    { id: 'PREMIUM_MCQ', title: 'Premium MCQ', enabled: true, category: 'MCQ' },
    { id: 'MISTAKES_PAGE', title: 'Mistakes Page', enabled: true, category: 'MCQ' },
    { id: 'RECENT_TESTS', title: 'Recent Tests', enabled: true, category: 'MCQ' },

    { id: 'DEEP_DIVE', title: 'Deep Dive Notes', enabled: true, category: 'CONTENT' },
    { id: 'AUDIO_SLIDE', title: 'Audio Slides', enabled: true, category: 'CONTENT' },

    // --- AUDIO & TTS ---
    { id: 'AUDIO_LIB', title: 'Audio Library', enabled: true, category: 'CONTENT' },
    { id: 'TTS_FEATURE', title: 'Text-to-Speech (TTS)', enabled: true, category: 'TOOLS' },

    // --- AI FEATURES ---
    { id: 'AI_HUB_BANNER', title: 'AI Hub Banner', enabled: true, category: 'AI' },
    { id: 'DEEP_ANALYSIS', title: 'Deep Analysis', enabled: true, category: 'AI' },
    { id: 'AI_CHAT_TURBO', title: 'AI Chat Turbo', enabled: true, category: 'AI' },
    { id: 'AI_INSIGHT_MAP', title: 'AI Insight Roadmap', enabled: true, category: 'AI' },
    { id: 'PREMIUM_ANALYSIS', title: 'Premium Analysis', enabled: true, category: 'AI' },

    // --- GAMIFICATION ---
    { id: 'PLAY_GAME', title: 'Play Game', enabled: true, category: 'GAMES' },
    { id: 'REDEEM_PRIZES', title: 'Redeem Prizes', enabled: true, category: 'GAMES' },
    { id: 'DISCOUNT_EVENT', title: 'Discount Event', enabled: true, category: 'GAMES' },

    // --- ANALYTICS & STATS ---
    { id: 'ACCURACY_STAT', title: 'Accuracy Stat', enabled: true, category: 'ANALYSIS' },
    { id: 'SPEED_STAT', title: 'Speed Stat', enabled: true, category: 'ANALYSIS' },
    { id: 'PERF_TREND', title: 'Performance Trend', enabled: true, category: 'ANALYSIS' },
    { id: 'STRONG_AREA', title: 'Strong Areas', enabled: true, category: 'ANALYSIS' },
    { id: 'AREA_IMPROVING', title: 'Area Improving', enabled: true, category: 'ANALYSIS' },
    { id: 'FOCUS_NEEDED', title: 'Focus Needed', enabled: true, category: 'ANALYSIS' },
    { id: 'OFFICIAL_MARKSHEET', title: 'Official Marksheet', enabled: true, category: 'ANALYSIS' },
    { id: 'OMR_SHEET', title: 'OMR Sheet', enabled: true, category: 'ANALYSIS' },
    { id: 'PROGRESS_DELTA', title: 'Progress Delta', enabled: true, category: 'ANALYSIS' },
    { id: 'MISTAKE_PATTERN', title: 'Mistake Pattern Analysis', enabled: true, category: 'ANALYSIS' },
    { id: 'TOPIC_BREAKDOWN', title: 'Topic Breakdown', enabled: true, category: 'ANALYSIS' },
    { id: 'TOPIC_DIST', title: 'Topic Strength Distribution', enabled: true, category: 'ANALYSIS' },
    { id: 'DOWNLOAD_ANALYSIS', title: 'Download Full Analysis', enabled: true, category: 'ANALYSIS' },

    // --- MISC ---
    { id: 'REQUEST_CONTENT', title: 'Requested Content', enabled: true, category: 'TOOLS' },

    // --- LEGACY (Keep compatible) ---
    { id: 'f4', title: 'Weekly Tests', enabled: true, category: 'MCQ' },
    { id: 'f5', title: 'Live Leaderboard', enabled: true, category: 'GAMES' },
    { id: 'f6', title: 'Engagement Rewards', enabled: true, category: 'GAMES' },
    { id: 'f7', title: 'Universal Chat', enabled: true, category: 'TOOLS' },
    { id: 'f8', title: 'Private Admin Support', enabled: true, category: 'TOOLS' },
    { id: 'f9', title: 'Spin Wheel Game', enabled: true, category: 'GAMES' },
    { id: 'f10', title: 'Credit System', enabled: true, category: 'GAMES' },
    { id: 'f11', title: 'Subscription Plans', enabled: true, category: 'TOOLS' },
    { id: 'f12', title: 'Store', enabled: true, category: 'TOOLS' },
    { id: 'f13', title: 'Profile Customization', enabled: true, category: 'TOOLS' },
    { id: 'f14', title: 'Study Timer', enabled: true, category: 'TOOLS' },
    { id: 'f15', title: 'Streak System', enabled: true, category: 'GAMES' },
    { id: 'f16', title: 'User Inbox', enabled: true, category: 'TOOLS' },
    { id: 'f17', title: 'Admin Dashboard', enabled: true, category: 'ADMIN' },
    { id: 'f18', title: 'Content Manager', enabled: true, category: 'ADMIN' },
    { id: 'f19', title: 'Bulk Upload', enabled: true, category: 'ADMIN' },
    { id: 'f20', title: 'Security System', enabled: true, category: 'ADMIN' },
    { id: 'f21', title: 'Performance History', enabled: true, category: 'ANALYSIS' },
    { id: 'f22', title: 'Dark/Light Mode', enabled: true, category: 'TOOLS' },
    { id: 'f23', title: 'Responsive Design', enabled: true, category: 'TOOLS' },
    { id: 'f25', title: 'Auto-Sync', enabled: true, category: 'TOOLS' },
    { id: 'f26', title: 'Offline Capabilities', enabled: true, category: 'TOOLS' },
    { id: 'f27', title: 'Guest Access', enabled: true, category: 'TOOLS' },
    { id: 'f28', title: 'Passwordless Login', enabled: true, category: 'TOOLS' },
    { id: 'f29', title: 'Custom Subjects', enabled: true, category: 'CONTENT' },
    { id: 'f30', title: 'Gift Codes', enabled: true, category: 'TOOLS' },
    { id: 'f31', title: 'Featured Shortcuts', enabled: true, category: 'TOOLS' },
    { id: 'f32', title: 'Notice Board', enabled: true, category: 'TOOLS' },
    { id: 'f33', title: 'Startup Ad', enabled: true, category: 'TOOLS' },
    { id: 'f34', title: 'External Apps', enabled: true, category: 'TOOLS' },
    { id: 'f35', title: 'Activity Log', enabled: true, category: 'ANALYSIS' },
    { id: 'f36', title: 'AI Question Generator', enabled: true, category: 'AI' },
    { id: 'f37', title: 'Payment Gateway Integration', enabled: true, category: 'TOOLS' },
    { id: 'f38', title: 'Class Management', enabled: true, category: 'CONTENT' },
    { id: 'f39', title: 'Stream Support', enabled: true, category: 'CONTENT' },
    { id: 'f40', title: 'Board Support', enabled: true, category: 'CONTENT' },
    { id: 'f41', title: 'Multi-Language Support', enabled: true, category: 'CONTENT' },
    { id: 'f42', title: 'Fast Search', enabled: true, category: 'TOOLS' },
    { id: 'f43', title: 'Recycle Bin', enabled: true, category: 'ADMIN' },
    { id: 'f44', title: 'Data Backup', enabled: true, category: 'ADMIN' },
    { id: 'f45', title: 'Deployment Tools', enabled: true, category: 'ADMIN' },
    { id: 'f46', title: 'Role Management', enabled: true, category: 'ADMIN' },
    { id: 'f47', title: 'Ban System', enabled: true, category: 'ADMIN' },
    { id: 'f48', title: 'Impersonation Mode', enabled: true, category: 'ADMIN' },
    { id: 'f49', title: 'Daily Goals', enabled: true, category: 'TOOLS' },
    { id: 'f50', title: 'Visual Analytics', enabled: true, category: 'ANALYSIS' },
    { id: 'f51', title: 'Detailed Marksheet', enabled: true, category: 'ANALYSIS' },
    { id: 'f52', title: 'Question Analysis', enabled: true, category: 'ANALYSIS' },
    { id: 'f53', title: 'Time Management Stats', enabled: true, category: 'ANALYSIS' },
    { id: 'f54', title: 'Subject Wise Progress', enabled: true, category: 'ANALYSIS' },
    { id: 'f55', title: 'Topic Strength Meter', enabled: true, category: 'ANALYSIS' },
    { id: 'f56', title: 'Weakness Detector', enabled: true, category: 'ANALYSIS' },
    { id: 'f57', title: 'Video Resume', enabled: true, category: 'CONTENT' },
    { id: 'f58', title: 'PDF Bookmark', enabled: true, category: 'CONTENT' },
    { id: 'f59', title: 'Night Mode Reading', enabled: true, category: 'TOOLS' },
    { id: 'f60', title: 'Text-to-Speech Notes', enabled: true, category: 'TOOLS' },
    { id: 'f61', title: 'Search within PDF', enabled: true, category: 'CONTENT' },
    { id: 'f62', title: 'Video Quality Control', enabled: true, category: 'CONTENT' },
    { id: 'f63', title: 'Playback Speed Control', enabled: true, category: 'CONTENT' },
    { id: 'f64', title: 'Picture-in-Picture Mode', enabled: true, category: 'CONTENT' },
    { id: 'f65', title: 'Background Audio Play', enabled: true, category: 'CONTENT' },
    { id: 'f66', title: 'Live Class Integration', enabled: true, category: 'CONTENT' },
    { id: 'f67', title: 'Recorded Sessions', enabled: true, category: 'CONTENT' },
    { id: 'f68', title: 'Doubt Clearing', enabled: true, category: 'TOOLS' },
    { id: 'f69', title: 'Assignment Submission', enabled: true, category: 'CONTENT' },
    { id: 'f70', title: 'Peer Comparison', enabled: true, category: 'ANALYSIS' },
    { id: 'f71', title: 'Global Rank', enabled: true, category: 'GAMES' },
    { id: 'f72', title: 'State Rank', enabled: true, category: 'GAMES' },
    { id: 'f73', title: 'School Rank', enabled: true, category: 'GAMES' },
    { id: 'f74', title: 'Badges & Achievements', enabled: true, category: 'GAMES' },
    { id: 'f75', title: 'Referral System', enabled: true, category: 'GAMES' },
    { id: 'f76', title: 'Social Share', enabled: true, category: 'TOOLS' },
    { id: 'f77', title: 'In-App Feedback', enabled: true, category: 'TOOLS' },
    { id: 'f78', title: 'Bug Reporting', enabled: true, category: 'TOOLS' },
    { id: 'f79', title: 'Feature Request', enabled: true, category: 'TOOLS' },
    { id: 'f80', title: 'Privacy Control', enabled: true, category: 'TOOLS' },
    { id: 'f81', title: 'Account Deletion', enabled: true, category: 'TOOLS' },
    { id: 'f82', title: 'Data Export', enabled: true, category: 'TOOLS' },
    { id: 'f83', title: 'Login History', enabled: true, category: 'TOOLS' },
    { id: 'f84', title: 'Device Management', enabled: true, category: 'TOOLS' },
    { id: 'f85', title: 'Session Timeout', enabled: true, category: 'TOOLS' },
    { id: 'f86', title: 'Two-Factor Auth', enabled: true, category: 'TOOLS' },
    { id: 'f87', title: 'Parent Connect', enabled: true, category: 'TOOLS' },
    { id: 'f88', title: 'Attendance Tracker', enabled: true, category: 'TOOLS' },
    { id: 'f89', title: 'Fee Management', enabled: true, category: 'TOOLS' },
    { id: 'f90', title: 'Library Management', enabled: true, category: 'TOOLS' },
    { id: 'f91', title: 'Transport Tracker', enabled: true, category: 'TOOLS' },
    { id: 'f92', title: 'Hostel Management', enabled: true, category: 'TOOLS' },
    { id: 'f93', title: 'Event Calendar', enabled: true, category: 'TOOLS' },
    { id: 'f94', title: 'Holiday List', enabled: true, category: 'TOOLS' },
    { id: 'f95', title: 'Exam Schedule', enabled: true, category: 'CONTENT' },
    { id: 'f96', title: 'Result Publication', enabled: true, category: 'CONTENT' },
    { id: 'f97', title: 'Syllabus Tracker', enabled: true, category: 'CONTENT' },
    { id: 'f98', title: 'Lesson Planner', enabled: true, category: 'CONTENT' },
    { id: 'f99', title: 'Teacher Remarks', enabled: true, category: 'ANALYSIS' },
    { id: 'f100', title: 'Student Diary', enabled: true, category: 'TOOLS' },
    { id: 'f101', title: 'AI Tutor', enabled: true, category: 'AI' },
    { id: 'f102', title: 'Voice Search', enabled: true, category: 'TOOLS' },
    { id: 'f103', title: 'Gesture Control', enabled: true, category: 'TOOLS' }
];

// --- LEVEL SYSTEM FEATURES (Unlocks) ---
// ... (rest of the file unchanged) ...
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

// --- LEVEL UP CONFIGURATION (1-50) ---
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

// --- PLAN COMPARISON MATRIX (DEFAULT) ---
export const DEFAULT_PLAN_COMPARISON = [
    {
        name: "1. CORE LEARNING FEATURES",
        features: [
            { name: "PDF Notes Library", free: "🔒 First 2 Chapters", basic: "✅ Unlimited", ultra: "✅ Unlimited" },
            { name: "Video Lectures", free: "🔒 First 2 Videos", basic: "✅ Unlimited", ultra: "✅ Unlimited" },
            { name: "Topic-wise Notes", free: "❌ Locked", basic: "✅ Full Access", ultra: "✅ Full Access" },
            { name: "Audio / Podcast", free: "❌ Locked", basic: "❌ Locked", ultra: "✅ Premium Only" },
            { name: "Search Capability", free: "✅ Basic", basic: "✅ Advanced", ultra: "✅ Advanced" },
            { name: "Save / Offline Mode", free: "❌ No", basic: "✅ Yes", ultra: "✅ Yes" },
            { name: "PDF Watermark", free: "⚠️ Free User", basic: "❌ No", ultra: "❌ No" }
        ]
    },
    {
        name: "2. REVISION HUB (USP)",
        features: [
            { name: "Revision Hub Access", free: "❌ Locked", basic: "⚠️ 1 Day/Week", ultra: "✅ Daily" },
            { name: "Weak/Avg/Strong Sorting", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { name: "Excellent (80%+) Tab", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { name: "Auto AI Plan", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { name: "Mistake Pattern Analysis", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { name: "30-Day Mastery Logic", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { name: "One-Click \"Start Today\"", free: "❌ No", basic: "⚠️ Limited", ultra: "✅ Yes" }
        ]
    },
    {
        name: "3. MCQ SYSTEM",
        features: [
            { name: "Daily MCQ Limit", free: "30 Questions", basic: "50 Questions", ultra: "100 Questions" },
            { name: "Exam Mode Timer", free: "❌ No", basic: "✅ Yes", ultra: "✅ Yes" },
            { name: "Detailed Solutions", free: "❌ Only Right/Wrong", basic: "✅ Text Solution", ultra: "✅ AI Explanation" },
            { name: "Re-attempt Wrong", free: "❌ No", basic: "✅ Yes", ultra: "✅ Instant" },
            { name: "Topic-wise Bulk MCQ", free: "❌ No", basic: "⚠️ Limited", ultra: "✅ Full Access" },
            { name: "History & Logs", free: "⚠️ 3 Days", basic: "✅ Full History", ultra: "✅ Full History" },
            { name: "Question Palette", free: "✅ Yes", basic: "✅ Yes", ultra: "✅ Yes" }
        ]
    },
    {
        name: "4. AI & SMART FEATURES",
        features: [
            { name: "AI Tutor Chat", free: "❌ No", basic: "🔒 5 Chats/day", ultra: "✅ Unlimited" },
            { name: "Smart Topic Sorting", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { name: "Weakness Detection", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { name: "Dynamic Study Plan", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" }
        ]
    },
    {
        name: "5. TTS / STUDY TOOLS",
        features: [
            { name: "Text-to-Speech (TTS)", free: "⚠️ 1 min demo", basic: "✅ Unlimited", ultra: "✅ Unlimited" },
            { name: "Speed Control", free: "❌ No", basic: "❌ No", ultra: "✅ 0.5x – 2x" },
            { name: "Auto Scroll", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { name: "Focus Mode", free: "❌ No", basic: "✅ Yes", ultra: "✅ Yes" },
            { name: "Study Timer", free: "✅ Basic", basic: "✅ Analytics", ultra: "✅ Analytics" }
        ]
    },
    {
        name: "6. GAMIFICATION & ECONOMY",
        features: [
            { name: "Coins / Credits Earning", free: "✅ Normal", basic: "✅ 1.5x Multiplier", ultra: "✅ 3x Multiplier" },
            { name: "Spin & Win", free: "1 per day", basic: "5 per day", ultra: "10 per day" },
            { name: "Daily Streak Protection", free: "✅ Yes", basic: "✅ Yes", ultra: "✅ Freeze (No loss)" },
            { name: "Leaderboard Access", free: "View Only", basic: "Participate", ultra: "Top Badge" },
            { name: "Double Credit Events", free: "❌ No", basic: "⚠️ Sometimes", ultra: "✅ Always Active" }
        ]
    },
    {
        name: "7. CONTENT REQUEST SYSTEM",
        features: [
            { name: "Request New Content", free: "❌ No", basic: "✅ Yes", ultra: "✅ VIP Access" },
            { name: "Priority Level", free: "Low", basic: "Normal", ultra: "Top Priority" },
            { name: "Admin Promise", free: "❌ No", basic: "❌ No", ultra: "24h Delivery" }
        ]
    },
    {
        name: "8. ACCOUNT & SECURITY",
        features: [
            { name: "Guest Mode", free: "✅ Yes", basic: "❌ No", ultra: "❌ No" },
            { name: "Device Login Limit", free: "1 Device", basic: "1 Device", ultra: "Multi-Device" },
            { name: "Ghost Login (Admin)", free: "❌ No", basic: "❌ No", ultra: "✅ Yes" },
            { name: "Profile Edit", free: "Basic Info", basic: "Full Profile", ultra: "Full Profile" }
        ]
    },
    {
        name: "9. ADMIN POWER (ULTRA EXCLUSIVE)",
        features: [
            { name: "Live User Spy", free: "❌ No", basic: "❌ No", ultra: "✅ Active" },
            { name: "Login As User", free: "❌ No", basic: "❌ No", ultra: "✅ Active" },
            { name: "Targeted Notifications", free: "❌ No", basic: "❌ No", ultra: "✅ Active" },
            { name: "Flash Sale Auto Trigger", free: "❌ No", basic: "❌ No", ultra: "✅ Active" },
            { name: "Payment Abandon Discount", free: "❌ No", basic: "❌ No", ultra: "✅ Active" },
            { name: "Credit Control Panel", free: "❌ No", basic: "❌ No", ultra: "✅ Active" }
        ]
    }
];

// --- STUDENT FACING FEATURES (Filtered) ---
export const STUDENT_APP_FEATURES = ALL_APP_FEATURES.filter(f =>
    !['f17', 'f18', 'f19', 'f20', 'f34', 'f37', 'f43', 'f44', 'f45', 'f46', 'f47', 'f48', 'f89', 'f90', 'f91', 'f92', 'f88', 'f87'].includes(f.id)
);
