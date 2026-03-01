const fs = require('fs');

let code = fs.readFileSync('components/StudentDashboard.tsx', 'utf8');

const oldFooterBlock = `        {/* MAIN CONTENT AREA */}
        <div className="p-4">
            {renderMainContent()}

            {settings?.showFooter !== false && (
                <div className="mt-8 mb-4 text-center">
                    <p
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: settings?.footerColor || '#cbd5e1' }}
                    >
                        Developed by Nadim Anwar
                    </p>
                </div>
            )}
        </div>`;

const newFooterBlock = `        {/* MAIN CONTENT AREA */}
        <div className="p-4 flex flex-col min-h-[calc(100vh-100px)]">
            <div className="flex-1">
                {renderMainContent()}
            </div>

            {settings?.showFooter !== false && (
                <div className="mt-auto pt-8 pb-4 text-center shrink-0">
                    <p
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: settings?.footerColor || '#cbd5e1' }}
                    >
                        Developed by Nadim Anwar
                    </p>
                </div>
            )}
        </div>`;

code = code.replace(oldFooterBlock, newFooterBlock);

fs.writeFileSync('components/StudentDashboard.tsx', code);
