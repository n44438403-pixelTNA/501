const fs = require('fs');

let code = fs.readFileSync('utils/featureRegistry.ts', 'utf8');

const regex = /export const ALL_FEATURES: Feature\[\] = \[/;
const newFeat = `export const ALL_FEATURES: Feature[] = [
    {
        id: 'ADMIN_RULES_PAGE',
        name: 'App Rules & Manual',
        description: 'Read the admin documentation and student rules',
        group: 'ADVANCED',
        icon: 'BookOpen',
        adminTab: 'APP_RULES',
        adminVisible: true
    },`;

code = code.replace(regex, newFeat);

fs.writeFileSync('utils/featureRegistry.ts', code);
