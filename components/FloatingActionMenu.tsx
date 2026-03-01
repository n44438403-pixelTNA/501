import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SystemSettings, User } from '../types';
import { ALL_FEATURES, Feature } from '../utils/featureRegistry';
import { checkFeatureAccess } from '../utils/permissionUtils';
import { Crown, User as UserIcon, ShoppingBag, X, Zap, Menu, ChevronUp, Book, CheckSquare, BrainCircuit, BarChart3, AlertCircle, PlayCircle, Sparkles, Wrench, Gamepad2, Trophy, Shield, Gift, Terminal, MessageSquare, FileText, Video, Headphones, Lock } from 'lucide-react';

interface Props {
    settings: SystemSettings;
    user: User;
    isFlashSaleActive?: boolean;
    onOpenProfile: () => void;
    onOpenStore: () => void;
    onNavigate?: (path: string) => void;
}

// Icon Mapper
const getIconComponent = (iconName?: string) => {
    switch(iconName) {
        case 'Book': return Book;
        case 'CheckSquare': return CheckSquare;
        case 'BrainCircuit': return BrainCircuit;
        case 'BarChart3': return BarChart3;
        case 'AlertCircle': return AlertCircle;
        case 'PlayCircle': return PlayCircle;
        case 'Sparkles': return Sparkles;
        case 'Wrench': return Wrench;
        case 'Gamepad2': return Gamepad2;
        case 'Trophy': return Trophy;
        case 'Crown': return Crown;
        case 'Shield': return Shield;
        case 'Gift': return Gift;
        case 'Terminal': return Terminal;
        case 'MessageSquare': return MessageSquare;
        case 'FileText': return FileText;
        case 'Video': return Video;
        case 'Headphones': return Headphones;
        default: return Zap;
    }
};

export const FloatingActionMenu: React.FC<Props> = ({ settings, user, isFlashSaleActive, onOpenProfile, onOpenStore, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    // const [showPlanModal, setShowPlanModal] = useState(false); // Unused
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 200 });

    // Dynamic Menu Items from NSTA Control
    const dynamicMenuItems = useMemo(() => {
        // STRICT NSTA CONTROL: Only show items that are explicitly configured in NSTA Control
        if (!settings.featureConfig) return [];

        return ALL_FEATURES.filter(f => {
            const config = settings.featureConfig?.[f.id];

            // 1. Must exist in NSTA Config AND be visible
            if (!config || config.visible === false) return false;

            // 2. Filter by relevant groups to ensure ALL visible features show in the menu
            const isRelevant = true; // Show all features that are visible in NSTA config

            return isRelevant;
        }).map(f => {
            // Merge config into feature object for easy access
            const config = settings.featureConfig?.[f.id];
            return { ...f, ...config };
        });
    }, [settings.featureConfig]);

    // Drag Refs
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLDivElement>(null);

    // Initial Position Fix
    useEffect(() => {
        const handleResize = () => {
            setPosition(p => ({
                x: Math.min(p.x, window.innerWidth - 80),
                y: Math.min(p.y, window.innerHeight - 200)
            }));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



            // 1. Swipe Up from Bottom Edge (Bottom 100px)
            if (touchStartY > window.innerHeight - 100 && dy < -50 && Math.abs(dx) < 50) {
                setIsOpen(true);
            }
        };

        window.addEventListener('touchstart', handleGlobalTouchStart);
        window.addEventListener('touchend', handleGlobalTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleGlobalTouchStart);
            window.removeEventListener('touchend', handleGlobalTouchEnd);
        };
    }, []);


    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        isDraggingRef.current = false;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartRef.current = { x: clientX, y: clientY };
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const dx = Math.abs(clientX - dragStartRef.current.x);
        const dy = Math.abs(clientY - dragStartRef.current.y);

        if (dx > 10 || dy > 10) {
            isDraggingRef.current = true;
        }

        if (isDraggingRef.current) {
            const newX = Math.max(10, Math.min(window.innerWidth - 74, clientX - 32));
            const newY = Math.max(10, Math.min(window.innerHeight - 74, clientY - 32));
            setPosition({ x: newX, y: newY });
        }
    };

    const handleTouchEnd = () => {
        setTimeout(() => {
            isDraggingRef.current = false;
        }, 100);
    };

    const toggleMenu = () => {
        if (!isDraggingRef.current) {
            setIsOpen(prev => !prev);
        }
    };

    return (
        <>
            {/* MAIN FAB BUTTON (Draggable - Mobile Optimized) */}
            <div
                ref={buttonRef}
                className="fixed z-[9990] flex flex-col items-center gap-3 touch-none select-none"
                style={{ left: position.x, top: position.y, transform: 'translate(0, 0)' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
            >
                <button
                    onClick={toggleMenu}
                    className={`relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border-2 border-white/50 backdrop-blur-md ${isFlashSaleActive ? 'bg-gradient-to-r from-red-500 to-pink-600 animate-pulse' : 'bg-slate-900/90'} ${isOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`}
                >
                    {settings.appLogo ? (
                        <img src={settings.appLogo} alt="Menu" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <Menu size={24} className="text-white" />
                    )}

                    {/* Flash Sale Badge */}
                    {isFlashSaleActive && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white animate-bounce flex items-center justify-center">
                            <Zap size={10} className="text-red-900 fill-red-900" />
                        </div>
                    )}
                </button>
            </div>

            {/* BOTTOM SHEET MENU (Plan 2.0) */}
            <div className={`fixed inset-0 z-[9991] flex flex-col justify-end transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>

                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsOpen(false)}
                ></div>

                {/* Sheet Content */}
                <div className={`bg-white w-full rounded-t-3xl shadow-2xl transform transition-transform duration-300 relative z-10 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>

                    {/* Pull Handle */}
                    <div className="flex justify-center p-2" onClick={() => setIsOpen(false)}>
                        <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
                    </div>

                    <div className="p-6 pt-2 pb-10">
                        {/* Header: User Profile */}
                        <div className="flex items-center gap-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-200 flex items-center gap-1">
                                        <Crown size={10} className="fill-yellow-800" /> {user.credits} CR
                                    </span>
                                    <span>•</span>
                                    <span>{user.subscriptionTier || 'Free Plan'}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="ml-auto p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-red-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* PLAN MATRIX STYLE LAYOUT */}
                        <div className="flex flex-col max-h-[60vh] overflow-y-auto">

                            {/* FIXED ACTIONS ROW */}
                            <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
                                <button
                                    onClick={() => { setIsOpen(false); onOpenStore(); }}
                                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-all"
                                >
                                    <ShoppingBag size={18} /> Visit Store
                                </button>
                                <button
                                    onClick={() => { setIsOpen(false); onOpenProfile(); }}
                                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 text-white font-bold shadow-lg hover:bg-slate-900 transition-all"
                                >
                                    <UserIcon size={18} /> Profile
                                </button>
                            </div>

                            {/* MATRIX HEADER - 5 COLUMNS */}
                            <div className="grid grid-cols-12 gap-1 bg-slate-100 p-2 rounded-t-xl border-b border-slate-200 text-[8px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10 text-center">
                                <div className="col-span-4 text-left pl-2">Feature</div>
                                <div className="col-span-2 text-green-600">Free</div>
                                <div className="col-span-2 text-blue-600">Basic</div>
                                <div className="col-span-2 text-purple-600">Ultra</div>
                                <div className="col-span-2 text-orange-600">Cost</div>
                            </div>

                            {/* DYNAMIC MATRIX ROWS */}
                            <div className="bg-white border border-slate-100 rounded-b-xl overflow-hidden">
                                {dynamicMenuItems.map((item, idx) => {
                                    const Icon = getIconComponent(item.icon);

                                    // Helpers for Limits
                                    const getLimit = (tier: string) => {
                                        if (!item.allowedTiers?.includes(tier)) return <Lock size={8} className="mx-auto text-slate-300" />;
                                        const limit = item.limits?.[tier.toLowerCase()];
                                        return limit !== undefined ? `${limit}` : <Zap size={8} className="mx-auto text-green-500 fill-green-500" />;
                                    };

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                setIsOpen(false);
                                                if (onNavigate && item.path) onNavigate(item.path);
                                            }}
                                            className={`grid grid-cols-12 gap-1 p-2 border-b border-slate-50 items-center hover:bg-slate-50 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                                        >
                                            {/* Feature Name */}
                                            <div className="col-span-4 flex items-center gap-1.5 overflow-hidden">
                                                <div className={`p-1 rounded-md shrink-0 ${item.color ? `bg-${item.color}-50 text-${item.color}-600` : 'bg-slate-100 text-slate-500'}`}>
                                                    <Icon size={12} />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-700 leading-tight truncate">{item.label}</span>
                                            </div>

                                            {/* Free Tier */}
                                            <div className="col-span-2 text-center text-[9px] font-bold text-slate-500">
                                                {getLimit('FREE')}
                                            </div>

                                            {/* Basic Tier */}
                                            <div className="col-span-2 text-center text-[9px] font-bold text-slate-600 bg-blue-50/30 py-0.5 rounded">
                                                {getLimit('BASIC')}
                                            </div>

                                            {/* Ultra Tier */}
                                            <div className="col-span-2 text-center text-[9px] font-bold text-slate-600 bg-purple-50/30 py-0.5 rounded">
                                                {getLimit('ULTRA')}
                                            </div>

                                            {/* COST Column (5th) */}
                                            <div className="col-span-2 text-center flex items-center justify-center">
                                                {item.creditCost > 0 ? (
                                                    <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full border border-orange-100">
                                                        {item.creditCost}
                                                    </span>
                                                ) : (
                                                    <span className="text-[8px] text-slate-300">-</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer / Tip */}
                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-slate-400 font-medium">
                                Explore all premium features to supercharge your learning
                            </p>
                            <ChevronUp size={16} className="mx-auto text-slate-300 animate-bounce mt-1" />
                        </div>
                    </div>
                </div>
            </div>

            {/* PLAN MODAL REMOVED */}
        </>
    );
};
