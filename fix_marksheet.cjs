const fs = require('fs');

let code = fs.readFileSync('components/MarksheetCard.tsx', 'utf8');

// 1. Better OMR Render
const oldOMRRender = `const renderOMRRow = (qIndex: number, selected: number, correct: number) => {
      const options = [0, 1, 2, 3];
      return (
          <div key={qIndex} className="flex items-center gap-3 mb-2">
              <span className="w-6 text-[10px] font-bold text-slate-500 text-right">{qIndex + 1}</span>
              <div className="flex gap-1.5">
                  {options.map((opt) => {
                      let bgClass = "bg-white border border-slate-300 text-slate-400";
                      if (selected === opt) {
                          if (correct === opt) bgClass = "bg-green-600 border-green-600 text-white shadow-sm";
                          else bgClass = "bg-red-500 border-red-500 text-white shadow-sm";
                      } else if (correct === opt && selected !== -1) {
                          bgClass = "bg-green-600 border-green-600 text-white opacity-80";
                      } else if (correct === opt && selected === -1) {
                          bgClass = "border-green-500 text-green-600 bg-green-50";
                      }
                      return (
                          <div key={opt} className={\`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all \${bgClass}\`}>
                              {String.fromCharCode(65 + opt)}
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };`;

const newOMRRender = `const renderOMRRow = (qIndex: number, selected: number, correct: number) => {
      const options = [0, 1, 2, 3];
      return (
          <div key={qIndex} className="flex items-center gap-2 mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100 w-full">
              <span className="w-8 text-[11px] font-black text-slate-600 text-center border-r border-slate-200 pr-2">{qIndex + 1}</span>
              <div className="flex gap-2 w-full justify-around">
                  {options.map((opt) => {
                      let bgClass = "bg-white border-2 border-slate-300 text-slate-400";
                      if (selected === opt) {
                          if (correct === opt) bgClass = "bg-green-500 border-green-600 text-white shadow-md shadow-green-200";
                          else bgClass = "bg-red-500 border-red-600 text-white shadow-md shadow-red-200";
                      } else if (correct === opt && selected !== -1) {
                          bgClass = "bg-green-100 border-green-400 text-green-700 opacity-90";
                      } else if (correct === opt && selected === -1) {
                          bgClass = "bg-green-50 border-green-400 text-green-600";
                      }
                      return (
                          <div key={opt} className={\`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all \${bgClass}\`}>
                              {String.fromCharCode(65 + opt)}
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };`;

code = code.replace(oldOMRRender, newOMRRender);


// 2. Add Stats to OMR View
const oldOMRGrid = `<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6">
                            <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2"><Grid size={18} /> OMR Response Sheet</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                                {currentData.map((data) => renderOMRRow(data.qIndex, data.selected, data.correct))}
                            </div>`;

const newOMRGrid = `<div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 mt-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
                            <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <Grid size={20} className="text-blue-600" /> OMR Response Sheet
                            </h3>

                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><div className="w-3 h-3 rounded-full bg-green-500 border border-green-600"></div> Correct</div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><div className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></div> Incorrect</div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><div className="w-3 h-3 rounded-full bg-white border-2 border-slate-300"></div> Skipped</div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
                                {currentData.map((data) => renderOMRRow(data.qIndex, data.selected, data.correct))}
                            </div>`;

code = code.replace(oldOMRGrid, newOMRGrid);

// Apply similar to renderFullOMR
const oldFullOMR = `const renderFullOMR = () => (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6">
          <h3 className="font-black text-slate-800 text-lg mb-4">Complete OMR Sheet</h3>
          <div className="grid grid-cols-4 gap-x-4 gap-y-2">
              {result.omrData?.map((data) => renderOMRRow(data.qIndex, data.selected, data.correct))}
          </div>
      </div>
  );`;

const newFullOMR = `const renderFullOMR = () => (
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 mt-6 relative overflow-hidden break-inside-avoid">
          <h3 className="font-black text-slate-800 text-lg mb-4 border-b pb-3 flex items-center gap-2">
              <Grid size={20} className="text-blue-600" /> Complete OMR Sheet
          </h3>
          <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><div className="w-3 h-3 rounded-full bg-green-500 border border-green-600"></div> Correct</div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><div className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></div> Incorrect</div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><div className="w-3 h-3 rounded-full bg-white border-2 border-slate-300"></div> Skipped</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.omrData?.map((data) => renderOMRRow(data.qIndex, data.selected, data.correct))}
          </div>
      </div>
  );`;

code = code.replace(oldFullOMR, newFullOMR);

fs.writeFileSync('components/MarksheetCard.tsx', code);
