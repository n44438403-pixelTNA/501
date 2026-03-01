const fs = require('fs');

let code = fs.readFileSync('types.ts', 'utf8');
const regex = /export interface LoginBonusConfig \{\s*freeBonus: number;\s*basicBonus: number;\s*ultraBonus: number;\s*strictStreak: boolean;\s*\/\/\s*If true, breaking streak forfeits next day bonus or resets heavily\s*main\s*\}/;

const fix = `export interface LoginBonusConfig {
    freeBonus: number;
    basicBonus: number;
    ultraBonus: number;
    strictStreak: boolean;
}`;

code = code.replace(regex, fix);
fs.writeFileSync('types.ts', code);
