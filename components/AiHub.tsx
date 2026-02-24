import React, { useState, useEffect } from 'react';
import { User, SystemSettings, StudentTab } from '../types';
import { Bot, Sparkles, BrainCircuit, FileText, Zap } from 'lucide-react';
import { CustomAlert } from './CustomDialogs';
import { BannerCarousel } from './BannerCarousel';

interface Props {
    user: User;
    onTabChange: (tab: StudentTab) => void;
    settings?: SystemSettings;
}

export const AiHub: React.FC<Props> = ({ user, onTabChange, settings }) => {
    const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, type: 'SUCCESS'|'ERROR'|'INFO', title?: string, message: string}>({isOpen: false, type: 'INFO', message: ''});
    const [discountStatus, setDiscountStatus] = useState<'WAITING' | 'ACTIVE' | 'NONE'>('NONE');
    const [showDiscountBanner, setShowDiscountBanner] = useState(false);

    useEffect(() => {
        const evt = settings?.specialDiscountEvent;
        const checkStatus = () => {
             if (!evt?.enabled) { setShowDiscountBanner(false); setDiscountStatus('NONE'); return; }
             const now = Date.now();
             const startsAt = evt.startsAt ? new Date(evt.startsAt).getTime() : now;
             const endsAt = evt.endsAt ? new Date(evt.endsAt).getTime() : now;
             if (now < startsAt) {
                 setDiscountStatus('WAITING'); setShowDiscountBanner(true);
             } else if (now < endsAt) {
                 setDiscountStatus('ACTIVE'); setShowDiscountBanner(true);
             } else {
                 setDiscountStatus('NONE'); setShowDiscountBanner(false);
             }
        };
        checkStatus();
        if (evt?.enabled) { const interval = setInterval(checkStatus, 1000); return () => clearInterval(interval); }
        else { setShowDiscountBanner(false); setDiscountStatus('NONE'); }
    }, [settings?.specialDiscountEvent]);

    const getEventSlides = () => {
        const slides: any[] = [];

        // Requested Feature Banners
        const featureBanners = [
            {
                id: 'feat-sub',
                title: 'Unlock Premium Subscription',
                subtitle: 'Access everything with Ultra Plan.',
                image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800',
                link: 'STORE'
            },
            {
                id: 'feat-notes-deep',
                title: 'Ultra Notes Deep Dive',
                subtitle: 'Detailed notes with audio explanations.',
                image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800',
                link: 'PDF'
            },
            {
                id: 'feat-slide',
                title: 'Ultra Slide',
                subtitle: 'Visual learning with audio sync.',
                image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
                link: 'PDF'
            },
            {
                id: 'feat-video',
                title: 'Ultra Video Lectures',
                subtitle: 'High-quality video content.',
                image: 'https://images.unsplash.com/photo-1492619879851-f42b0416955d?auto=format&fit=crop&q=80&w=800',
                link: 'VIDEO'
            },
            {
                id: 'feat-mcq',
                title: 'Premium MCQ Practice',
                subtitle: 'Unlimited tests and analysis.',
                image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800',
                link: 'MCQ'
            },
            {
                id: 'feat-audio',
                title: 'Premium Audio Library',
                subtitle: 'Learn on the go with podcasts.',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
                link: 'AUDIO'
            },
            {
                id: 'feat-rev',
                title: 'Premium Revision Hub',
                subtitle: 'Smart revision based on your weak topics.',
                image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
                link: 'REVISION'
            },
            {
                id: 'feat-ai',
                title: 'AI Hub Ultra Analysis',
                subtitle: 'Deep insights powered by AI.',
                image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
                link: 'AI_HUB'
            }
        ];

        slides.push(...featureBanners);

        if (settings?.activeEvents) {
            settings.activeEvents.forEach(evt => {
                if (evt.enabled) {
                    slides.push({
                        id: `evt-${evt.title}`,
                        image: evt.imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
                        title: evt.title,
                        subtitle: evt.subtitle,
                        link: evt.actionUrl
                    });
                }
            });
        }

        if (settings?.exploreBanners) {
             settings.exploreBanners.forEach(b => {
                 if (b.enabled && b.priority > 5) {
                     slides.push({
                         id: b.id,
                         image: b.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
                         title: b.title,
                         subtitle: b.subtitle,
                         link: b.actionUrl
                     });
                 }
             });
        }

        if (slides.length === 0) {
            slides.push({
                id: 'default-welcome',
                image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
                title: `Welcome, ${user.name}!`,
                subtitle: 'Start your learning journey today.',
                link: 'COURSES'
            });
        }

        return slides;
    };

    const eventSlides = getEventSlides();

    return (
        <div className="space-y-6 pb-24 p-4 animate-in fade-in">
             {/* EVENT BANNERS */}
             {eventSlides.length > 0 && (
                <div className="h-48 shadow-lg rounded-2xl overflow-hidden">
                    <BannerCarousel
                        slides={eventSlides}
                        autoPlay={true}
                        interval={4000}
                        onBannerClick={(link) => {
                            if (link === 'STORE') onTabChange('STORE');
                            else if (link) window.open(link, '_blank');
                        }}
                    />
                </div>
            )}

            {/* DISCOUNT BANNER */}
            {showDiscountBanner && discountStatus === 'ACTIVE' && (
                <button
                    onClick={() => onTabChange('STORE')}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 p-4 rounded-xl text-white shadow-lg flex items-center justify-between animate-pulse"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🎉</span>
                        <div className="text-left">
                            <p className="font-black text-sm uppercase">{settings?.specialDiscountEvent?.eventName || 'Special Offer'} is Live!</p>
                            <p className="text-xs opacity-90">Get {settings?.specialDiscountEvent?.discountPercent}% OFF on all plans.</p>
                        </div>
                    </div>
                    <div className="bg-white text-red-600 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                        CLAIM NOW
                    </div>
                </button>
            )}

            {/* HEADER */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
                        <Sparkles className="text-yellow-400" /> AI Center
                    </h2>
                    <p className="text-indigo-200 text-sm">Your personal learning assistant powered by advanced AI.</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* AI TOOLS COMPRESSED VIEW */}
            <div className="grid grid-cols-1 gap-4">
                {/* 1. CHAT TUTOR */}
                <button
                    onClick={() => onTabChange('AI_CHAT')}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
                        <Bot size={24} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-800">Chat with AI Tutor</h3>
                        <p className="text-xs text-slate-500">Instant answers to any question.</p>
                    </div>
                    <div className="text-slate-300">
                        <Zap size={16} />
                    </div>
                </button>

                {/* 2. NOTES GENERATOR */}
                <button
                    onClick={() => onTabChange('AI_STUDIO' as any)} // Assuming mapped to AI Modal logic in parent
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className="bg-pink-100 text-pink-600 p-3 rounded-xl">
                        <FileText size={24} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-800">Generate Notes</h3>
                        <p className="text-xs text-slate-500">Create custom summaries instantly.</p>
                    </div>
                    <div className="text-slate-300">
                        <Zap size={16} />
                    </div>
                </button>

                {/* 3. DEEP ANALYSIS */}
                <button
                    onClick={() => onTabChange('DEEP_ANALYSIS')}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                        <BrainCircuit size={24} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-800">Deep Performance Analysis</h3>
                        <p className="text-xs text-slate-500">AI insights on your weak areas.</p>
                    </div>
                    <div className="text-slate-300">
                        <Zap size={16} />
                    </div>
                </button>
            </div>

            <CustomAlert
                isOpen={alertConfig.isOpen}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={() => setAlertConfig(prev => ({...prev, isOpen: false}))}
            />
        </div>
    );
};
