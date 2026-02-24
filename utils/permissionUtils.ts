import { SystemSettings, User } from '../types';
import { ALL_FEATURES } from './featureRegistry';

export type UserTier = 'FREE' | 'BASIC' | 'ULTRA';

export interface FeatureAccessResult {
    hasAccess: boolean;
    cost: number;
    limit?: number; // Limit for current tier
    allowedTiers: UserTier[];
    userTier: UserTier;
    isDummy: boolean;
    reason?: 'TIER_RESTRICTED' | 'CREDIT_LOCKED' | 'DUMMY_FEATURE' | 'GRANTED';
}

/**
 * Determines the effective tier of a user.
 */
export const getUserTier = (user: User | null): UserTier => {
    if (!user) return 'FREE';

    // Check if subscription is active
    const isSubscribed = user.subscriptionTier && user.subscriptionTier !== 'FREE';

    // Also check legacy isPremium flag if needed, or rely on subscriptionTier
    const isPremium = user.isPremium || isSubscribed;

    if (!isPremium) return 'FREE';

    // If premium, check level
    if (user.subscriptionLevel === 'ULTRA') return 'ULTRA';

    // Default to BASIC for any other premium status
    return 'BASIC';
};

/**
 * Checks if a user has access to a specific feature based on dynamic settings.
 * Prioritizes the 'Feature Access Page' configuration.
 */
export const checkFeatureAccess = (
    featureId: string,
    user: User | null,
    settings: SystemSettings
): FeatureAccessResult => {
    const userTier = getUserTier(user);

    // 1. Get Dynamic Config from Settings (Priority)
    // We treat featureConfig as the single source of truth for access control.
    const dynamicConfig = settings.featureConfig?.[featureId];

    // 2. Get Static Config from Registry (Fallback)
    const staticConfig = ALL_FEATURES.find(f => f.id === featureId);

    // 3. Determine Allowed Tiers
    let allowedTiers: UserTier[] = [];

    if (dynamicConfig) {
        // Strict Dynamic Control
        if (dynamicConfig.allowedTiers) {
            allowedTiers = dynamicConfig.allowedTiers;
        } else if (dynamicConfig.minTier) {
            // Legacy Dynamic Support (MinTier) - converting to list
            if (dynamicConfig.minTier === 'ULTRA') allowedTiers = ['ULTRA'];
            else if (dynamicConfig.minTier === 'BASIC') allowedTiers = ['BASIC', 'ULTRA'];
            else allowedTiers = ['FREE', 'BASIC', 'ULTRA'];
        } else {
            // Config exists but no tiers specified? Default to Open.
            allowedTiers = ['FREE', 'BASIC', 'ULTRA'];
        }
    } else {
        // No Dynamic Config found -> Default to OPEN to avoid locking out unconfigured features.
        // Once an admin saves the Feature Access Page, the config will exist.
        allowedTiers = ['FREE', 'BASIC', 'ULTRA'];
    }

    // 3. Determine Cost
    const cost = dynamicConfig?.creditCost !== undefined ? dynamicConfig.creditCost : 0;

    // 4. Determine Dummy Status
    // Priority: Dynamic Config -> Static Registry
    const isDummy = dynamicConfig?.isDummy !== undefined ? dynamicConfig.isDummy : (staticConfig?.isDummy === true);

    // 5. Determine Limit
    let limit: number | undefined;
    if (dynamicConfig?.limits) {
        if (userTier === 'FREE') limit = dynamicConfig.limits.free;
        else if (userTier === 'BASIC') limit = dynamicConfig.limits.basic;
        else if (userTier === 'ULTRA') limit = dynamicConfig.limits.ultra;
    }

    // 6. Check Access
    const hasAccess = allowedTiers.includes(userTier);

    let reason: FeatureAccessResult['reason'] = hasAccess ? 'GRANTED' : 'TIER_RESTRICTED';

    if (isDummy) {
        // Dummy features might be visible but not interactive, or handled by UI
        reason = 'DUMMY_FEATURE';
    }

    return {
        hasAccess,
        cost,
        limit,
        allowedTiers,
        userTier,
        isDummy,
        reason
    };
};
