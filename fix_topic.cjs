const fs = require('fs');

let code = fs.readFileSync('components/MarksheetCard.tsx', 'utf8');

const regex = /const renderTopicBreakdown = \(\) => \{\s*\/\/ Topic Breakdown removed\s*return null;\s*\};/;

const newTopic = `const renderTopicBreakdown = () => {
        if (!result.topicAnalysis) return null;

        const topics = Object.keys(result.topicAnalysis);
        if (topics.length === 0) return null;

        return (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 mt-6 break-inside-avoid">
                <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2 border-b pb-3">
                    <BrainCircuit size={20} className="text-purple-600" /> Topic & Sub-Topic Analysis
                </h3>
                <p className="text-xs text-slate-500 mb-6">Review your performance by topic. Read the attached notes to improve weak areas.</p>
                <div className="space-y-4">
                    {topics.map((topic, i) => {
                        const analysis = result.topicAnalysis![topic];
                        const percent = analysis.total > 0 ? Math.round((analysis.correct / analysis.total) * 100) : 0;
                        let status = 'AVERAGE';
                        let colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';
                        if (percent >= 80) { status = 'STRONG'; colorClass = 'bg-green-100 text-green-700 border-green-200'; }
                        else if (percent < 50) { status = 'WEAK'; colorClass = 'bg-red-100 text-red-700 border-red-200'; }

                        // Extract notes safely from questions related to this topic if available
                        // In the previous version, notes are sometimes bundled in q.note
                        const topicQs = questions?.filter(q => q.topic === topic) || [];
                        const topicNotes = topicQs.map(q => q.note).filter(Boolean);
                        // Deduplicate notes by simple set or string match
                        const uniqueNotes = Array.from(new Set(topicNotes));

                        return (
                            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-black text-slate-800 uppercase flex items-center gap-2">
                                            {topic}
                                        </h4>
                                        <div className="flex gap-2 mt-2">
                                            <span className={\`text-[10px] font-bold px-2 py-0.5 rounded border \${colorClass}\`}>
                                                {status} ({percent}%)
                                            </span>
                                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">
                                                {analysis.correct}/{analysis.total} Correct
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {uniqueNotes.length > 0 && (
                                    <div className="p-4 bg-blue-50/30">
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                                            <BookOpen size={12} /> Topic Notes
                                        </p>
                                        <div className="space-y-3">
                                            {uniqueNotes.map((note, nIdx) => (
                                                <div key={nIdx} className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-blue-100 shadow-sm" dangerouslySetInnerHTML={{ __html: renderMathInHtml(note) }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {uniqueNotes.length === 0 && status !== 'STRONG' && (
                                    <div className="p-4 bg-slate-50 text-xs text-slate-500 italic text-center">
                                        No specific notes available for this sub-topic. Review your textbook.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };`;

code = code.replace(regex, newTopic);

fs.writeFileSync('components/MarksheetCard.tsx', code);
