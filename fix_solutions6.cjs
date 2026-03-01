const fs = require('fs');
let code = fs.readFileSync('components/MarksheetCard.tsx', 'utf8');

const regex = /const renderDetailedSolutions = \(\) => \([\s\S]*?<\/\div>\n\s*\);\n\s*\};\n\s*const renderFullReport/;

// This means the previous replace didn't match the ending correctly.
const startIdx = code.indexOf('const renderDetailedSolutions = () => (');
const endIdx = code.indexOf('const renderFullReport = () => (');

if (startIdx !== -1 && endIdx !== -1) {
  const newText = `const renderDetailedSolutions = () => (
      <div className="mt-8">
          <h3 className="font-black text-slate-800 text-xl mb-6 flex items-center gap-2 border-b-2 border-slate-100 pb-3">
              <BookOpen size={24} className="text-blue-600" /> Full Solution & Analysis
          </h3>
          <div className="space-y-6">
              {questions?.map((q, idx) => {
                  const omrEntry = result.omrData?.find(d => d.qIndex === idx);
                  const userSelected = omrEntry ? omrEntry.selected : -1;
                  const isCorrect = userSelected === q.correctAnswer;
                  const isSkipped = userSelected === -1;

                  // Prepare TTS Text
                  const cleanQuestion = stripHtml(q.question);
                  const cleanExplanation = q.explanation ? stripHtml(q.explanation) : '';
                  const correctAnswerText = q.options ? stripHtml(q.options[q.correctAnswer]) : '';
                  const ttsText = \`Question \${idx + 1}. \${cleanQuestion}. The correct answer is option \${String.fromCharCode(65 + q.correctAnswer)}, which is \${correctAnswerText}. Explanation: \${cleanExplanation}\`;

                  return (
                      <div key={idx} className={\`bg-white rounded-2xl border-2 p-5 shadow-sm break-inside-avoid relative group transition-all \${isCorrect ? 'border-green-100 hover:border-green-200' : isSkipped ? 'border-slate-200 hover:border-slate-300' : 'border-red-100 hover:border-red-200'}\`}>
                          <div className="absolute top-4 right-4 flex gap-2">
                              <span className={\`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider \${isCorrect ? 'bg-green-100 text-green-700' : isSkipped ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'}\`}>
                                  {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Incorrect'}
                              </span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <SpeakButton text={ttsText} className="bg-slate-100 hover:bg-slate-200 text-slate-600" iconSize={14} />
                              </div>
                          </div>

                          <div className="flex gap-3 mb-4 pr-24">
                              <span className={\`w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-black shadow-sm \${isCorrect ? 'bg-green-500 text-white' : isSkipped ? 'bg-slate-200 text-slate-600' : 'bg-red-500 text-white'}\`}>
                                  Q{idx + 1}
                              </span>
                              <div className="text-sm font-bold text-slate-800 leading-relaxed pt-1" dangerouslySetInnerHTML={{ __html: renderMathInHtml(q.question) }} />
                          </div>

                          {q.options && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 pl-11">
                                  {q.options.map((opt, oIdx) => {
                                      const isThisCorrect = oIdx === q.correctAnswer;
                                      const isThisSelected = oIdx === userSelected;
                                      let optClass = "bg-slate-50 border-slate-200 text-slate-600";

                                      if (isThisCorrect) {
                                          optClass = "bg-green-50 border-green-500 text-green-800 shadow-sm";
                                      } else if (isThisSelected && !isThisCorrect) {
                                          optClass = "bg-red-50 border-red-300 text-red-800";
                                      }

                                      return (
                                          <div key={oIdx} className={\`p-3 rounded-xl border \${optClass} flex items-start gap-3\`}>
                                              <span className={\`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 \${isThisCorrect ? 'bg-green-500 text-white' : isThisSelected ? 'bg-red-500 text-white' : 'bg-white border border-slate-300'}\`}>
                                                  {String.fromCharCode(65 + oIdx)}
                                              </span>
                                              <div className="text-xs font-medium" dangerouslySetInnerHTML={{ __html: renderMathInHtml(opt) }} />
                                          </div>
                                      );
                                  })}
                              </div>
                          )}

                          {q.explanation && (
                              <div className="mt-4 ml-11 p-4 bg-blue-50 border border-blue-100 rounded-xl relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                  <p className="text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest flex items-center gap-1">
                                      <BrainCircuit size={12} /> Expert Explanation
                                  </p>
                                  <div className="text-xs text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: renderMathInHtml(q.explanation) }} />
                              </div>
                          )}
                      </div>
                  );
              })}
          </div>
      </div>
  );

  `;

  const modified = code.substring(0, startIdx) + newText + code.substring(endIdx);
  fs.writeFileSync('components/MarksheetCard.tsx', modified);
  console.log("Replaced using substring");
}
