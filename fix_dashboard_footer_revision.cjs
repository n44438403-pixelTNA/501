const fs = require('fs');

let code = fs.readFileSync('components/StudentDashboard.tsx', 'utf8');

const oldFooter = `{settings?.showFooter !== false && (
                <div className="mt-12 mb-4 text-center">
                    <p
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: settings?.footerColor || '#cbd5e1' }}
                    >
                        Developed by Nadim Anwar
                    </p>
                </div>
            )}`;

const newFooter = `{settings?.showFooter !== false && activeTab !== 'REVISION' && (
                <div className="mt-12 mb-4 text-center">
                    <p
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: settings?.footerColor || '#cbd5e1' }}
                    >
                        Developed by Nadim Anwar
                    </p>
                </div>
            )}`;

code = code.replace(oldFooter, newFooter);

fs.writeFileSync('components/StudentDashboard.tsx', code);
