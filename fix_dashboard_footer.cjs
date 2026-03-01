const fs = require('fs');

let code = fs.readFileSync('components/StudentDashboard.tsx', 'utf8');

// The issue: the user says "white screen aaya hai aur ushke niche revisun hub hai tum revisun hub ke material ko upar likho aur devlopd by nafin ko niche"
// This happens because min-h-[calc(100vh-100px)] on the content wrapper combined with an absolutely positioned or tall content like Revision Hub might push things weirdly.
// Also, RevisionHub already has a lot of content, we don't necessarily want flex-1 to stretch the wrapper if RevisionHub handles its own scrolling.

// Let's remove the flex container on the main content area and just let normal document flow handle it.

const oldWrapper = `<div className="p-4 flex flex-col min-h-[calc(100vh-100px)]">
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

const newWrapper = `<div className="p-4 relative pb-20">
            {renderMainContent()}

            {settings?.showFooter !== false && (
                <div className="mt-12 mb-4 text-center">
                    <p
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: settings?.footerColor || '#cbd5e1' }}
                    >
                        Developed by Nadim Anwar
                    </p>
                </div>
            )}
        </div>`;

code = code.replace(oldWrapper, newWrapper);

fs.writeFileSync('components/StudentDashboard.tsx', code);
