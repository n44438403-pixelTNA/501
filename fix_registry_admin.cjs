const fs = require('fs');
let code = fs.readFileSync('utils/featureRegistry.ts', 'utf8');

// Remove DOCUMENTATION feature
code = code.replace(/\{\s*id: 'ADMIN_DOCS'[\s\S]*?\},/, '');

// Change ADMIN_RULES_PAGE to Admin Settings Index
const rulesRegex = /\{\s*id: 'ADMIN_RULES_PAGE',[\s\S]*?adminVisible: true\s*\}/;
const newIndex = `{
        id: 'ADMIN_INDEX',
        name: 'Admin Settings Index',
        description: 'Find where every power and setting is located',
        group: 'ADVANCED',
        icon: 'Map',
        adminTab: 'ADMIN_INDEX',
        adminVisible: true
    }`;

code = code.replace(rulesRegex, newIndex);

fs.writeFileSync('utils/featureRegistry.ts', code);
