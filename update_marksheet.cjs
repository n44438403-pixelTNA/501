const fs = require('fs');

let code = fs.readFileSync('components/MarksheetCard.tsx', 'utf8');

// The user states: "mcq me har ek topic ka analysis aaraha hai aysa na higa jab mcq ka pura topic clear ho jayega tab aayega analysis . Aur analysis me  analysis page me jo niche question,,option aur explanation aaraha hai  normal jaise mcq me tha wo wala question sab solution naam ka ek page banega ushme jayega wo sab."
// So the current "SOLUTION" tab must just show "Full Solution & Analysis" which we already implemented in `renderDetailedSolutions`.
// The issue is `renderGranularAnalysis` is still being called inside the 'SOLUTION' tab in the UI:
// {activeTab === 'SOLUTION' && isAnalysisUnlocked && (
//                     <div className="animate-in slide-in-from-bottom-4">
//                         {/* NEW: Granular Analysis View (Default) */}
//                         <div className="mb-8">
//                             {renderGranularAnalysis()}
//                         </div>

//                         {questions && questions.length > 0 ? (
//                             <div className="space-y-6">
//                                 {questions.map((q, idx) => {

// Let's replace the whole SOLUTION tab logic with just `renderDetailedSolutions()` since it's already styled nicely.

const oldSolutionTab = `{activeTab === 'SOLUTION' && isAnalysisUnlocked && (
                    <div className="animate-in slide-in-from-bottom-4">
                        {/* NEW: Granular Analysis View (Default) */}
                        <div className="mb-8">
                            {renderGranularAnalysis()}
                        </div>

                        {questions && questions.length > 0 ? (
                            <div className="space-y-6">
                                {questions.map((q, idx) => {
                                    const omrEntry = result.omrData?.find(d => d.qIndex === idx);
                                    const userSelected = omrEntry ? omrEntry.selected : -1;
                                    const isCorrect = userSelected === q.correctAnswer;
                                    const isSkipped = userSelected === -1;
                                    return (
                                        <div key={idx} className={\`bg-white rounded-2xl border \${isCorrect ? 'border-green-200' : isSkipped ? 'border-slate-200' : 'border-red-200'} shadow-sm overflow-hidden\`}>
                                            <div className={\`p-4 \${isCorrect ? 'bg-green-50' : isSkipped ? 'bg-slate-50' : 'bg-red-50'} border-b \${isCorrect ? 'border-green-100' : isSkipped ? 'border-slate-100' : 'border-red-100'} flex gap-3\`}>
                                                <span className={\`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 \${isCorrect ? 'bg-green-100 text-green-700' : isSkipped ? 'bg-slate-200 text-slate-600' : 'bg-red-100 text-red-600'}\`}>{idx + 1}</span>
                                                <div className="flex-1"><div className="text-sm font-bold text-slate-800 leading-snug" dangerouslySetInnerHTML={{ __html: renderMathInHtml(q.question) }} /></div>
                                            </div>
                                            {q.options && (
                                                <div className="p-4 space-y-2 bg-white">
                                                    {q.options.map((opt: string, optIdx: number) => {
                                                        const isThisCorrect = optIdx === q.correctAnswer;
                                                        const isThisSelected = optIdx === userSelected;
                                                        let optClass = "text-slate-600";
                                                        if (isThisCorrect) optClass = "text-green-700 font-bold bg-green-50 border border-green-200 px-3 py-2 rounded-lg";
                                                        else if (isThisSelected) optClass = "text-red-700 font-bold bg-red-50 border border-red-200 px-3 py-2 rounded-lg";
                                                        else optClass = "px-3 py-2 border border-transparent";
                                                        return (
                                                            <div key={optIdx} className={\`text-xs flex items-start gap-2 \${optClass}\`}>
                                                                <span className="font-bold opacity-50 mt-0.5">{String.fromCharCode(65 + optIdx)}.</span>
                                                                <div dangerouslySetInnerHTML={{ __html: renderMathInHtml(opt) }} />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {q.explanation && (
                                                <div className="p-4 bg-blue-50 border-t border-blue-100">
                                                    <div className="text-xs text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: renderMathInHtml(q.explanation) }} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : <p>No questions data.</p>}
                    </div>
                )}`;

const newSolutionTab = `{activeTab === 'SOLUTION' && isAnalysisUnlocked && (
                    <div className="animate-in slide-in-from-bottom-4">
                        {renderDetailedSolutions()}
                    </div>
                )}`;

// Handle the regex replacing carefully
const startIdx = code.indexOf("{activeTab === 'SOLUTION' && isAnalysisUnlocked && (");
const endIdx = code.indexOf("{activeTab === 'OMR' && isAnalysisUnlocked && (");

if (startIdx !== -1 && endIdx !== -1) {
    const updatedCode = code.substring(0, startIdx) + newSolutionTab + "\n\n                " + code.substring(endIdx);
    fs.writeFileSync('components/MarksheetCard.tsx', updatedCode);
    console.log("Updated Marksheet SOLUTION tab to solely use renderDetailedSolutions");
} else {
    console.log("Could not find blocks to replace");
}
