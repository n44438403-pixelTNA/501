const fs = require('fs');

let code = fs.readFileSync('types.ts', 'utf8');

const regex = /export interface CreditPackage \{\s*id: string;\s*name: string;\s*credits: number;\s*price: number;\s*color\?: string;/;
const replacement = `export interface CreditPackage {\n  id: string;\n  name: string;\n  credits: number;\n  price: number;\n  dummyPrice?: number; // NEW: Strike-through dummy price\n  color?: string;`;

code = code.replace(regex, replacement);

fs.writeFileSync('types.ts', code);
