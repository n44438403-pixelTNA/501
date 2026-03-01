const fs = require('fs');
let code = fs.readFileSync('components/MarksheetCard.tsx', 'utf8');

// Remove the global footer from MarksheetCard as well (since it's a popup)
code = code.replace(/<div className="text-center py-2 bg-slate-50 border-t border-slate-100">\s*<p className="text-\[9px\] font-black uppercase text-slate-400 tracking-widest">Developed by Nadim Anwar<\/p>\s*<\/div>/, '');

fs.writeFileSync('components/MarksheetCard.tsx', code);
