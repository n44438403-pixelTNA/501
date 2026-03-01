const fs = require('fs');

let code = fs.readFileSync('components/MarksheetCard.tsx', 'utf8');

// I need to add BarChart to imports if it's missing.
const importMatch = code.match(/import \{([^}]+)\} from 'lucide-react';/);
if (importMatch) {
  let imports = importMatch[1];
  if (!imports.includes('BarChart,')) {
      imports += ', BarChart';
      code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, `import {${imports}} from 'lucide-react';`);
      fs.writeFileSync('components/MarksheetCard.tsx', code);
  }
}
