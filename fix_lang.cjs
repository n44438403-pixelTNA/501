const fs = require('fs');

let code = fs.readFileSync('components/StudentDashboard.tsx', 'utf8');

// Ensure Globe is imported
if(!code.includes('Globe,')) {
   code = code.replace(/import \{ Layout,/, 'import { Globe, Layout,');
}

// In the header, add language switcher button
const headerSearch = `<div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-slate-800 leading-none">
                                    {settings?.appName || 'Student App'}
                                </h2>
                            </div>`;

const headerReplace = `<div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-slate-800 leading-none">
                                    {settings?.appName || 'Student App'}
                                </h2>
                                <button
                                    onClick={() => {
                                        const newBoard = user.board === 'CBSE' ? 'BSEB' : 'CBSE';
                                        handleUserUpdate({ ...user, board: newBoard });
                                        showAlert(\`Language switched to \${newBoard === 'CBSE' ? 'English' : 'Hindi'}\`, 'SUCCESS');
                                    }}
                                    className="ml-2 flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[9px] font-black border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                >
                                    <Globe size={12} /> {user.board === 'CBSE' ? 'EN' : 'HI'}
                                </button>
                            </div>`;

code = code.replace(headerSearch, headerReplace);

fs.writeFileSync('components/StudentDashboard.tsx', code);
