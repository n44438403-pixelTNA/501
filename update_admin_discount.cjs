const fs = require('fs');

let code = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

// I need to add support for a "discount expiry" and "start date" in the UI.

const discountHtmlOld = `                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500" /> Flash Sale / Discount Event</h3>
                            <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div>
                                    <p className="font-bold text-sm text-slate-800">Enable Discount Event</p>
                                    <p className="text-[10px] text-slate-500">Show special discount banners and apply auto-discounts in Store.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={localSettings.specialDiscountEvent?.enabled || false} onChange={e => {
                                        setLocalSettings(prev => ({
                                            ...prev,
                                            specialDiscountEvent: { ...(prev.specialDiscountEvent || { eventName: '', discountPercent: 0, showToFreeUsers: true, showToPremiumUsers: true }), enabled: e.target.checked }
                                        }));
                                    }} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>`;

const discountHtmlNew = `                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500" /> Flash Sale / Discount Event</h3>
                            <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div>
                                    <p className="font-bold text-sm text-slate-800">Enable Discount Event</p>
                                    <p className="text-[10px] text-slate-500">Show special discount banners and apply auto-discounts in Store.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={localSettings.specialDiscountEvent?.enabled || false} onChange={e => {
                                        setLocalSettings(prev => ({
                                            ...prev,
                                            specialDiscountEvent: { ...(prev.specialDiscountEvent || { eventName: '', discountPercent: 0, showToFreeUsers: true, showToPremiumUsers: true }), enabled: e.target.checked }
                                        }));
                                    }} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>

                            {localSettings.specialDiscountEvent?.enabled && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Starts At (Optional)</label>
                                        <input type="datetime-local" value={localSettings.specialDiscountEvent?.startsAt ? new Date(new Date(localSettings.specialDiscountEvent.startsAt).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''} onChange={e => {
                                            setLocalSettings(prev => ({
                                                ...prev,
                                                specialDiscountEvent: { ...prev.specialDiscountEvent!, startsAt: e.target.value ? new Date(e.target.value).toISOString() : undefined }
                                            }));
                                        }} className="w-full p-2 border rounded-lg mt-1 text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Ends At (Optional)</label>
                                        <input type="datetime-local" value={localSettings.specialDiscountEvent?.endsAt ? new Date(new Date(localSettings.specialDiscountEvent.endsAt).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''} onChange={e => {
                                            setLocalSettings(prev => ({
                                                ...prev,
                                                specialDiscountEvent: { ...prev.specialDiscountEvent!, endsAt: e.target.value ? new Date(e.target.value).toISOString() : undefined }
                                            }));
                                        }} className="w-full p-2 border rounded-lg mt-1 text-sm bg-white" />
                                    </div>
                                </div>
                            )}`;

code = code.replace(discountHtmlOld, discountHtmlNew);

fs.writeFileSync('components/AdminDashboard.tsx', code);
