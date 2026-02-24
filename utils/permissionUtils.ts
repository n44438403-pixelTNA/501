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
 * Checks if a user has access to a specific feature based on dynamic settings and static registry.
 */
export const checkFeatureAccess = (
    featureId: string,
    user: User | null,
    settings: SystemSettings
): FeatureAccessResult => {
    const userTier = getUserTier(user);

    // 1. Get Dynamic Config from Settings
    const dynamicConfig = settings.featureConfig?.[featureId];

    // 2. Get Static Config from Registry
    const staticConfig = ALL_FEATURES.find(f => f.id === featureId);

    // 3. Determine Allowed Tiers
    let allowedTiers: UserTier[] = [];

    // FEED CONTROL (Priority if visible is explicitly TRUE or undefined (default true for new config))
    // Note: If dynamicConfig exists, we check visibility. If it doesn't exist, we fall through.

    // NOTE: Removed Matrix fallback. Dynamic Config is the single source of truth if it exists.
    // If dynamicConfig doesn't exist, we fall back to Static Registry defaults.

    if (dynamicConfig) {
        // Use Granular Dynamic Config
        if (dynamicConfig.allowedTiers && dynamicConfig.allowedTiers.length > 0) {
            allowedTiers = dynamicConfig.allowedTiers;
        } else if (dynamicConfig.minTier) {
            // Fallback to Legacy Dynamic MinTier (Migration support)
            if (dynamicConfig.minTier === 'ULTRA') allowedTiers = ['ULTRA'];
            else if (dynamicConfig.minTier === 'BASIC') allowedTiers = ['BASIC', 'ULTRA'];
            else allowedTiers = ['FREE', 'BASIC', 'ULTRA'];
        } else {
             // If dynamic config exists but no tiers specified, assume strict or open?
             // Usually if config is saved, tiers are populated.
             // If empty, it means "No Access" unless configured otherwise.
             // But existing behavior might have been "Open". Let's match previous behavior logic:
             // "Fallback to Static Registry if Dynamic Config exists but has no restrictions set"
             // But usually dynamic config *should* have restrictions.
             // Let's rely on what's in the object. If allowedTiers is empty/undefined, we might check static.
             if (staticConfig?.requiredSubscription) {
                if (staticConfig.requiredSubscription === 'ULTRA') allowedTiers = ['ULTRA'];
                else if (staticConfig.requiredSubscription === 'BASIC') allowedTiers = ['BASIC', 'ULTRA'];
                else allowedTiers = ['FREE', 'BASIC', 'ULTRA'];
             } else {
                allowedTiers = ['FREE', 'BASIC', 'ULTRA'];
             }
        }
    } else {
        // No Dynamic Config -> Use Static Registry Defaults
        if (staticConfig?.requiredSubscription) {
            if (staticConfig.requiredSubscription === 'ULTRA') allowedTiers = ['ULTRA'];
            else if (staticConfig.requiredSubscription === 'BASIC') allowedTiers = ['BASIC', 'ULTRA'];
            else allowedTiers = ['FREE', 'BASIC', 'ULTRA'];
        } else {
            allowedTiers = ['FREE', 'BASIC', 'ULTRA'];
        }
    }

    // 4. Determine Cost
    const cost = dynamicConfig?.creditCost !== undefined ? dynamicConfig.creditCost : 0;

    // 5. Determine Dummy Status
    const isDummy = dynamicConfig?.isDummy === true;

    // 6. Determine Limit
    let limit: number | undefined;
    if (dynamicConfig?.limits) {
        if (userTier === 'FREE') limit = dynamicConfig.limits.free;
        else if (userTier === 'BASIC') limit = dynamicConfig.limits.basic;
        else if (userTier === 'ULTRA') limit = dynamicConfig.limits.ultra;
    }

    // 7. Check Access
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
