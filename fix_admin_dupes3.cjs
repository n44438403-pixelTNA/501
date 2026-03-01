const fs = require('fs');

let code = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

const regex = /\s*\{\/\* PACKAGE MANAGER \*\/\}\n\s*<div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">[\s\S]*?<button onClick=\{addPackage\} className="bg-emerald-600 text-white p-2 rounded-lg h-\[38px\] w-\[38px\] flex items-center justify-center hover:bg-emerald-700 shadow"><Plus size=\{20\} \/><\/button>\n\s*<\/div>\n\s*<\/div>/;

code = code.replace(regex, '');

fs.writeFileSync('components/AdminDashboard.tsx', code);
