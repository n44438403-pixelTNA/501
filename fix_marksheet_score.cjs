const fs = require('fs');

let code = fs.readFileSync('components/MarksheetCard.tsx', 'utf8');

const oldFunc = `  const renderMarksheetStyle1 = () => (`;
const newFunc = `  const renderMarksheetStyle1 = () => {
      const totalQ = result.totalQuestions || 1;
      const scorePercent = Math.round((result.score / totalQ) * 100);
      const correct = result.correctCount || 0;
      const skipped = result.omrData?.filter(d => d.selected === -1).length || 0;
      const incorrect = totalQ - correct - skipped;
      let tagColor = "bg-slate-100 text-slate-600";
      switch(result.performanceTag) {
          case 'EXCELLENT': tagColor = "bg-green-100 text-green-700"; break;
          case 'GOOD': tagColor = "bg-blue-100 text-blue-700"; break;
          case 'BAD': tagColor = "bg-orange-100 text-orange-700"; break;
          case 'VERY_BAD': tagColor = "bg-red-100 text-red-700"; break;
      }
      return (`;

code = code.replace(oldFunc, newFunc);
code = code.replace(/<\/div>\n      <\/div>\n  \);/, `</div>\n      </div>\n  );\n  };`);

fs.writeFileSync('components/MarksheetCard.tsx', code);
