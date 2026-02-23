
import React, { useState } from 'react';
import { ALL_FEATURES, FeatureGroup } from '../../utils/featureRegistry';
import { FeatureCard } from './FeatureCard';
import { ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';

interface Props {
    onNavigate: (featureId: string) => void;
}

export const DashboardLayer2: React.FC<Props> = ({ onNavigate }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Filter Level 2 Features
    const secondaryFeatures = ALL_FEATURES.filter(f => f.surfaceLevel === 2 && !f.adminVisible);

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between mb-4 px-2 group"
            >
                <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-800 transition-colors">
                    <LayoutGrid size={18} />
                    <span className="font-bold text-xs uppercase tracking-widest">Explore More Tools</span>
                </div>
                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={18} className="text-slate-400" />
                </div>
            </button>

            <div className={`grid gap-3 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                {secondaryFeatures.map(feature => (
                    <FeatureCard
                        key={feature.id}
                        feature={feature}
                        onClick={() => onNavigate(feature.id)}
                    />
                ))}
            </div>
        </div>
    );
};
