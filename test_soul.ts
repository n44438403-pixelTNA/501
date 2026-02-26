import { ALL_FEATURES } from './utils/featureRegistry.ts';

const SOUL_FEATURES = [
    'QUICK_REVISION',
    'DEEP_DIVE',
    'PREMIUM_NOTES',
    'ADDITIONAL_NOTES',
    'VIDEO_ACCESS',
    'MCQ_FREE',
    'MCQ_PREMIUM',
    'AUDIO_LIBRARY',
    'REVISION_HUB_FREE',
    'REVISION_HUB_PREMIUM',
    'AI_STUDIO',
    'MY_ANALYSIS',
    'TOPIC_CONTENT',
    'REQUEST_CONTENT'
];

const soulFeatures = ALL_FEATURES.filter(f => SOUL_FEATURES.includes(f.id));
console.log('Total Soul Features Found:', soulFeatures.length);
soulFeatures.forEach(f => console.log('- ' + f.id));
