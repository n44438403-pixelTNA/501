
import React from 'react';
import { Feature, ALL_FEATURES } from '../../utils/featureRegistry';
import { FeatureCard } from './FeatureCard';

interface Props {
    onNavigate: (featureId: string) => void;
    activeFeatureId?: string;
    badges?: Record<string, string | number>;
}

export const DashboardLayer1: React.FC<Props> = ({ onNavigate, activeFeatureId, badges }) => {
    // Filter Level 1 Core Features
    const coreFeatures = ALL_FEATURES.filter(f => f.group === 'CORE' && f.surfaceLevel === 1 && !f.adminVisible);

    return (
        <div className="grid grid-cols-2 gap-3 mb-6">
            {coreFeatures.map(feature => (
                <FeatureCard
                    key={feature.id}
                    feature={feature}
                    onClick={() => onNavigate(feature.id)}
                    isActive={activeFeatureId === feature.id}
                    badge={badges?.[feature.id]}
                />
            ))}
        </div>
    );
};
