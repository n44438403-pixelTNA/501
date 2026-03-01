const fs = require('fs');
let code = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

const regex = /                      <\/div>\n                  <\/div>\n\n                  \{\/\* TIME INTERVALS \*\/\}/;

code = code.replace(regex, `                      </div>\n                  </div>\n                  </div>\n\n                  {/* TIME INTERVALS */}`);

fs.writeFileSync('components/AdminDashboard.tsx', code);
