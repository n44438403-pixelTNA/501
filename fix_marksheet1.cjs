const fs = require('fs');

let code = fs.readFileSync('components/MarksheetCard.tsx', 'utf8');

const newMarksheetFunc = `
  const renderMarksheetStyle1 = () => (
      <div id="marksheet-style-1" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 relative overflow-hidden break-inside-avoid">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
              <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{result.chapterTitle}</h2>
                  <p className="text-slate-500 font-medium mt-1">{result.subjectName}</p>
              </div>
              <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Score</div>
                  <div className={\`text-4xl font-black \${scorePercent >= 80 ? 'text-green-600' : scorePercent >= 50 ? 'text-blue-600' : 'text-red-600'}\`}>
                      {result.score}/{totalQ}
                  </div>
              </div>
          </div>

          {/* User Info */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between mb-8 border border-slate-100">
              <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-black text-blue-600 shadow-sm border border-slate-200">
                      {user.name.charAt(0)}
                  </div>
                  <div>
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">ID: {user.displayId || user.id.slice(0, 8)}</p>
                  </div>
              </div>
              <div className="text-right">
                  <p className="text-xs font-bold text-slate-500">{new Date(result.date).toLocaleDateString()}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(result.date).toLocaleTimeString()}</p>
              </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                  <p className="text-2xl font-black text-slate-800">{scorePercent}%</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Taken</p>
                  <p className="text-xl font-black text-slate-800">{Math.floor(result.totalTimeSeconds / 60)}m {result.totalTimeSeconds % 60}s</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Speed</p>
                  <p className="text-xl font-black text-slate-800">{result.averageTimePerQuestion.toFixed(1)}s</p>
                  <p className="text-[8px] text-slate-400 uppercase">per question</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grade</p>
                  <span className={\`px-3 py-1 rounded-full text-xs font-black \${tagColor}\`}>
                      {result.performanceTag.replace('_', ' ')}
                  </span>
              </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart size={16} className="text-blue-500" /> Question Breakdown
              </h4>
              <div className="flex h-4 rounded-full overflow-hidden mb-4 bg-white border border-slate-200 shadow-inner">
                  <div style={{ width: \`\${(correct / totalQ) * 100}%\` }} className="bg-green-500 hover:opacity-90 transition-opacity" title={\`Correct: \${correct}\`}></div>
                  <div style={{ width: \`\${(incorrect / totalQ) * 100}%\` }} className="bg-red-500 hover:opacity-90 transition-opacity" title={\`Incorrect: \${incorrect}\`}></div>
                  <div style={{ width: \`\${(skipped / totalQ) * 100}%\` }} className="bg-slate-300 hover:opacity-90 transition-opacity" title={\`Skipped: \${skipped}\`}></div>
              </div>
              <div className="flex justify-between text-xs font-bold px-2">
                  <span className="text-green-700 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> {correct} Correct</span>
                  <span className="text-red-700 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> {incorrect} Incorrect</span>
                  <span className="text-slate-600 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300"></div> {skipped} Skipped</span>
              </div>
          </div>
      </div>
  );
`;

const insertPoint = `  const renderAnalysisContent = () => {`;
code = code.replace(insertPoint, newMarksheetFunc + '\n' + insertPoint);

fs.writeFileSync('components/MarksheetCard.tsx', code);
