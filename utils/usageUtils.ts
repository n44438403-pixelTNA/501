import { User } from '../types';

export const checkFeatureLimit = (featureId: string, user: User, limit?: number): boolean => {
    if (limit === undefined || limit === null) return true; // No limit
    if (limit < 0) return true; // Unlimited

    const today = new Date().toDateString();
    const usageKey = `nst_usage_${user.id}_${featureId}_${today}`;
    const currentUsage = parseInt(localStorage.getItem(usageKey) || '0');

    return currentUsage < limit;
};

export const incrementFeatureUsage = (featureId: string, user: User) => {
    const today = new Date().toDateString();
    const usageKey = `nst_usage_${user.id}_${featureId}_${today}`;
    const currentUsage = parseInt(localStorage.getItem(usageKey) || '0');
    localStorage.setItem(usageKey, (currentUsage + 1).toString());
};

export const getFeatureUsageCount = (featureId: string, user: User): number => {
    const today = new Date().toDateString();
    const usageKey = `nst_usage_${user.id}_${featureId}_${today}`;
    return parseInt(localStorage.getItem(usageKey) || '0');
};
