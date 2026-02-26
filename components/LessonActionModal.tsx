import React from 'react';
import { Chapter, ContentType } from '../types';
import { FileText, CheckSquare, Video, Headphones, X } from 'lucide-react';

interface Props {
    chapter: Chapter;
    onClose: () => void;
    onSelect: (type: ContentType) => void;
}

export const LessonActionModal: React.FC<Props> = ({ chapter, onClose, onSelect }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
                >
                    <X size={20} />
                </button>

                <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-800 leading-tight">{chapter.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">Select content to view</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onSelect('PDF')}
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 border-2 border-blue-100 rounded-2xl active:scale-95 transition-all hover:border-blue-300"
                    >
                        <div className="bg-white p-3 rounded-full shadow-sm text-blue-600">
                            <FileText size={24} />
                        </div>
                        <span className="font-bold text-blue-700 text-sm">Notes</span>
                    </button>

                    <button
                        onClick={() => onSelect('MCQ')}
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-purple-50 border-2 border-purple-100 rounded-2xl active:scale-95 transition-all hover:border-purple-300"
                    >
                        <div className="bg-white p-3 rounded-full shadow-sm text-purple-600">
                            <CheckSquare size={24} />
                        </div>
                        <span className="font-bold text-purple-700 text-sm">MCQ Test</span>
                    </button>

                    <button
                        onClick={() => onSelect('VIDEO')}
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl active:scale-95 transition-all hover:border-rose-300"
                    >
                        <div className="bg-white p-3 rounded-full shadow-sm text-rose-600">
                            <Video size={24} />
                        </div>
                        <span className="font-bold text-rose-700 text-sm">Video</span>
                    </button>

                    <button
                        onClick={() => onSelect('AUDIO')}
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-amber-50 border-2 border-amber-100 rounded-2xl active:scale-95 transition-all hover:border-amber-300"
                    >
                        <div className="bg-white p-3 rounded-full shadow-sm text-amber-600">
                            <Headphones size={24} />
                        </div>
                        <span className="font-bold text-amber-700 text-sm">Audio</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
