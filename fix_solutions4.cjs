const fs = require('fs');

let code = fs.readFileSync('components/MarksheetCard.tsx', 'utf8');

const regex = /              return \(\s*<div key=\{idx\} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm break-inside-avoid relative group">[\s\S]*?<\/div>\s*\);\s*\}\)\}\s*<\/div>\s*\);\s*\};/g;

const match = code.match(regex);
if(match) {
   console.log("Matched exactly");
} else {
   console.log("Failed to match");
}
