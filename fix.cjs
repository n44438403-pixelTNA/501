const fs = require('fs');

let code = fs.readFileSync('components/RevisionHub.tsx', 'utf8');

const regex = /<button\s*onClick=\{[^}]*setShowReport[^}]*\}[\s\S]*?Monthly Report\s*<\/button>/;
code = code.replace(regex, '');

fs.writeFileSync('components/RevisionHub.tsx', code);
