import { User, ActiveSubscription, SystemSettings } from '../types';

export const recalculateSubscriptionStatus = (user: User, settings?: SystemSettings): User => {
    const now = new Date();
    let updatedUser = { ...user };

    // 0. Check Free Access Override (Admin Config)
    if (settings?.freeAccessConfig) {
        const { validUntil, classes } = settings.freeAccessConfig;
        if (validUntil && new Date(validUntil) > now) {
            // Check Class Match
            const userClass = user.classLevel || '';
            // Handle comma separated list cleaning if needed, but config assumes array
            if (classes && classes.length > 0 && (classes.includes(userClass) || classes.includes('ALL'))) {
                // Override as ULTRA
                updatedUser.isPremium = true;
                updatedUser.subscriptionTier = 'CUSTOM'; // Special Tier
                updatedUser.subscriptionLevel = 'ULTRA';
                updatedUser.subscriptionEndDate = validUntil;
                updatedUser.customSubscriptionName = 'Admin Free Access';
                return updatedUser;
            }
        }
    }

    // 1. Migration: If no activeSubscriptions but legacy fields exist, migrate them.
    if ((!updatedUser.activeSubscriptions || updatedUser.activeSubscriptions.length === 0) && updatedUser.subscriptionEndDate) {
        const legacyEndDate = new Date(updatedUser.subscriptionEndDate);
        if (legacyEndDate > now) {
            const currentTier = updatedUser.subscriptionTier === 'FREE' ? 'MONTHLY' : (updatedUser.subscriptionTier || 'MONTHLY');
            const legacySub: ActiveSubscription = {
                id: `legacy_${Date.now()}`,
                tier: currentTier,
                level: updatedUser.subscriptionLevel || 'BASIC',
                startDate: new Date().toISOString(), // Approximation
                endDate: updatedUser.subscriptionEndDate,
                source: updatedUser.grantedByAdmin ? 'ADMIN' : 'PURCHASE'
            };
            updatedUser.activeSubscriptions = [legacySub];
        }
    }

    // If still no active subs or empty array
    if (!updatedUser.activeSubscriptions || updatedUser.activeSubscriptions.length === 0) {
        // Check if we should reset legacy fields (only if they are expired or inconsistent)
        // If we migrated above, we have activeSubs. If we didn't migrate (because expired or missing), then yes, reset.
        updatedUser.isPremium = false;
        updatedUser.subscriptionTier = 'FREE';
        updatedUser.subscriptionLevel = undefined;
        updatedUser.subscriptionEndDate = undefined;
        return updatedUser;
    }

    // 2. Filter Active Subscriptions (We only consider those not expired for the status)
    const activeSubs = updatedUser.activeSubscriptions.filter(sub => new Date(sub.endDate) > now);

    if (activeSubs.length === 0) {
        updatedUser.isPremium = false;
        updatedUser.subscriptionTier = 'FREE';
        updatedUser.subscriptionLevel = undefined;
        updatedUser.subscriptionEndDate = undefined;
        return updatedUser;
    }

    // 3. Find Best Subscription
    // Priority: Tier Value (LIFETIME > YEARLY > ...) -> Level (ULTRA > BASIC) -> Expiry (Later > Earlier)

    let bestSub = activeSubs[0];

    // Helper to score Tier Value
    const getTierScore = (tier: string) => {
        if (tier === 'LIFETIME') return 10;
        if (tier === 'YEARLY') return 5;
        if (tier === '3_MONTHLY') return 4;
        if (tier === 'MONTHLY') return 3;
        if (tier === 'WEEKLY') return 2;
        return 1;
    };

    // Helper to score Level
    const getLevelScore = (level: string) => {
        if (level === 'ULTRA') return 2;
        if (level === 'BASIC') return 1;
        return 0;
    };

    for (const sub of activeSubs) {
        // Compare Tier Value first (LIFETIME should always win over WEEKLY, unless user prefers highest level)
        // User Request: "pahle ka subscription khatam na ho... jayada valu wala jo hoga wo rahega"
        // Interpretation: Keep the one with Higher Value OR Longer Duration.

        // Let's create a combined score: TierScore * 10 + LevelScore
        // LIFETIME ULTRA = 10 * 10 + 2 = 102
        // LIFETIME BASIC = 10 * 10 + 1 = 101
        // WEEKLY ULTRA = 2 * 10 + 2 = 22

        // But what if I have WEEKLY ULTRA (active now) vs LIFETIME BASIC (active forever)?
        // The user likely wants access to ULTRA features if they paid for it temporarily.
        // So, Level should arguably trump Tier for *feature access*, but Expiry determines longevity.

        // Wait, the user said: "agar pahle ka subscription jayada der ka hai to wo rahega jayada valu wala jo hoga jayada time ke kiye jo hoga wo rahega"
        // "If previous sub is longer duration, it stays. The one with more value/time stays."

        // Actually, `recalculateSubscriptionStatus` calculates the *Effective Status* for the UI.
        // It doesn't delete the other subscriptions from `activeSubscriptions`.
        // So we just need to decide which one to *show* as active status.
        // If I have Lifetime Basic and 4-hour Weekly Ultra... I probably want to use Ultra features right now.
        // But the display might say "Weekly" and scare the user that Lifetime is gone.
        // The fix is ensuring we display the *Best Access Level* available.

        const bestScore = getLevelScore(bestSub.level);
        const currentScore = getLevelScore(sub.level);

        if (currentScore > bestScore) {
            bestSub = sub; // Upgrade Level (e.g. Basic -> Ultra)
        } else if (currentScore === bestScore) {
            // Equal Level: Pick the one that lasts longer
            if (new Date(sub.endDate) > new Date(bestSub.endDate)) {
                bestSub = sub;
            }
        }
    }

    // 4. Update User Fields with the Best Subscription details
    updatedUser.isPremium = true;
    updatedUser.subscriptionTier = bestSub.tier;
    updatedUser.subscriptionLevel = bestSub.level;
    updatedUser.subscriptionEndDate = bestSub.endDate;

    return updatedUser;
};

export const addSubscription = (user: User, newSub: ActiveSubscription, settings?: SystemSettings): User => {
    const updatedUser = { ...user };
    if (!updatedUser.activeSubscriptions) updatedUser.activeSubscriptions = [];

    // User requested concurrent subscriptions ("Basic saath me rahega")
    // So we simply add it to the list.
    updatedUser.activeSubscriptions.push(newSub);

    // Recalculate the effective status
    return recalculateSubscriptionStatus(updatedUser, settings);
};
