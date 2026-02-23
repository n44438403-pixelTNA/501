export type FeatureGroup = 'CORE' | 'REVISION' | 'AI' | 'ANALYTICS' | 'GAME' | 'ADMIN' | 'ADVANCED' | 'CONTENT';
export type SubscriptionTier = 'FREE' | 'BASIC' | 'ULTRA';
export type SurfaceLevel = 1 | 2 | 3; // 1 = Dashboard, 2 = Tools, 3 = Drawer/Hidden

export interface AppFeatureDef {
    id: string;
    label: string;
    group: FeatureGroup;
    surfaceLevel: SurfaceLevel;
    requiredSubscription: SubscriptionTier;
    adminVisible: boolean; // Can Admin toggle this?
    isExperimental?: boolean;
    description?: string;
    defaultEnabled: boolean;
}

export const ALL_FEATURES: AppFeatureDef[] = [
    // --- CORE ---
    {
        id: 'COURSES',
        label: 'My Courses (Video/Notes)',
        group: 'CORE',
        surfaceLevel: 1,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true,
        description: 'Access to Subject, Chapter, Video, and Notes selection.'
    },
    {
        id: 'MCQ_PRACTICE',
        label: 'MCQ Practice',
        group: 'CORE',
        surfaceLevel: 1,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true
    },
    {
        id: 'WEEKLY_TEST',
        label: 'Weekly Tests',
        group: 'CORE',
        surfaceLevel: 2,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true
    },

    // --- REVISION ---
    {
        id: 'REVISION_HUB',
        label: 'Revision Hub',
        group: 'REVISION',
        surfaceLevel: 1,
        requiredSubscription: 'FREE', // Hub itself is free, content varies
        adminVisible: true,
        defaultEnabled: true,
        description: 'Central hub for spaced repetition and pending tasks.'
    },
    {
        id: 'MCQ_REVIEW',
        label: 'Mistake Review',
        group: 'REVISION',
        surfaceLevel: 2,
        requiredSubscription: 'BASIC',
        adminVisible: true,
        defaultEnabled: true
    },

    // --- AI ---
    {
        id: 'AI_CHAT',
        label: 'Student AI Assistant',
        group: 'AI',
        surfaceLevel: 2,
        requiredSubscription: 'BASIC',
        adminVisible: true,
        defaultEnabled: true
    },
    {
        id: 'AI_NOTES',
        label: 'AI Notes Generator',
        group: 'AI',
        surfaceLevel: 2,
        requiredSubscription: 'BASIC',
        adminVisible: true,
        defaultEnabled: true
    },
    {
        id: 'AI_DEEP_ANALYSIS',
        label: 'Deep Analysis (Ultra)',
        group: 'AI',
        surfaceLevel: 2,
        requiredSubscription: 'ULTRA',
        adminVisible: true,
        defaultEnabled: true
    },

    // --- ANALYTICS ---
    {
        id: 'ANALYTICS_DASHBOARD',
        label: 'My Analysis',
        group: 'ANALYTICS',
        surfaceLevel: 1,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true
    },
    {
        id: 'LEADERBOARD',
        label: 'Leaderboard',
        group: 'ANALYTICS',
        surfaceLevel: 2,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true
    },
    {
        id: 'MARKSHEET',
        label: 'Official Marksheet',
        group: 'ANALYTICS',
        surfaceLevel: 3,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true
    },

    // --- GAME ---
    {
        id: 'SPIN_WHEEL',
        label: 'Spin & Win',
        group: 'GAME',
        surfaceLevel: 2,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true
    },
    {
        id: 'DAILY_CHALLENGE',
        label: 'Daily Challenge',
        group: 'GAME',
        surfaceLevel: 1,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true
    },

    // --- CONTENT ---
    {
        id: 'AUDIO_LIBRARY',
        label: 'Audio Library',
        group: 'CONTENT',
        surfaceLevel: 2,
        requiredSubscription: 'BASIC',
        adminVisible: true,
        defaultEnabled: true
    },
    {
        id: 'UNIVERSAL_VIDEO',
        label: 'Universal Video',
        group: 'CONTENT',
        surfaceLevel: 1,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true
    },

    // --- ADVANCED / ADMIN CONTROLLED ---
    {
        id: 'COMPETITION_MODE',
        label: 'Competition Mode',
        group: 'ADVANCED',
        surfaceLevel: 3,
        requiredSubscription: 'ULTRA',
        adminVisible: true,
        defaultEnabled: true
    },
    {
        id: 'OFFLINE_DOWNLOAD',
        label: 'Offline Downloads',
        group: 'ADVANCED',
        surfaceLevel: 3,
        requiredSubscription: 'BASIC',
        adminVisible: true,
        defaultEnabled: true
    },
    {
        id: 'REDEEM_SYSTEM',
        label: 'Redeem Codes',
        group: 'ADVANCED',
        surfaceLevel: 3,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true
    },
    {
        id: 'PROFILE_EDIT',
        label: 'Profile Editing',
        group: 'ADVANCED',
        surfaceLevel: 3,
        requiredSubscription: 'FREE',
        adminVisible: true,
        defaultEnabled: true
    }
];

export const getFeaturesByGroup = (group: FeatureGroup) => {
    return ALL_FEATURES.filter(f => f.group === group);
};

export const getFeature = (id: string) => {
    return ALL_FEATURES.find(f => f.id === id);
};
