const fs = require('fs');

let code = fs.readFileSync('components/FloatingActionMenu.tsx', 'utf8');

code = code.replace(/export const FloatingActionMenu: React\.FC<Props> = \(\{ settings, user, isFlashSaleActive, onOpenProfile, onOpenStore, onNavigate \}\) => \{/, 'export const FloatingActionMenu: React.FC<Props> = ({ settings, user, isFlashSaleActive, onOpenProfile, onOpenStore, onNavigate, activeTab }) => {');

fs.writeFileSync('components/FloatingActionMenu.tsx', code);
