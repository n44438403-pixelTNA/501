const fs = require('fs');

let code = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

const regex = /\{localSettings\.specialDiscountEvent\?\.enabled && \([\s\S]*?\}\s*\)\}/;

const bonusUI = `                            {localSettings.specialDiscountEvent?.enabled && (
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
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Discount Percent (%)</label>
                                        <input type="number" value={localSettings.specialDiscountEvent?.discountPercent || 0} onChange={e => {
                                            setLocalSettings(prev => ({
                                                ...prev,
                                                specialDiscountEvent: { ...prev.specialDiscountEvent!, discountPercent: Number(e.target.value) }
                                            }));
                                        }} className="w-full p-2 border rounded-lg mt-1 text-sm bg-white" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mt-4">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-blue-500" /> Daily Login Bonus Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Free User Bonus</label>
                                    <input type="number" value={localSettings.loginBonusConfig?.freeBonus ?? 2} onChange={e => {
                                        setLocalSettings(prev => ({
                                            ...prev,
                                            loginBonusConfig: { ...(prev.loginBonusConfig || { freeBonus: 2, basicBonus: 5, ultraBonus: 10, strictStreak: false }), freeBonus: Number(e.target.value) }
                                        }));
                                    }} className="w-full p-2 border rounded-lg mt-1 text-sm bg-white font-bold" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Basic User Bonus</label>
                                    <input type="number" value={localSettings.loginBonusConfig?.basicBonus ?? 5} onChange={e => {
                                        setLocalSettings(prev => ({
                                            ...prev,
                                            loginBonusConfig: { ...(prev.loginBonusConfig || { freeBonus: 2, basicBonus: 5, ultraBonus: 10, strictStreak: false }), basicBonus: Number(e.target.value) }
                                        }));
                                    }} className="w-full p-2 border rounded-lg mt-1 text-sm bg-white font-bold text-blue-600" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Ultra User Bonus</label>
                                    <input type="number" value={localSettings.loginBonusConfig?.ultraBonus ?? 10} onChange={e => {
                                        setLocalSettings(prev => ({
                                            ...prev,
                                            loginBonusConfig: { ...(prev.loginBonusConfig || { freeBonus: 2, basicBonus: 5, ultraBonus: 10, strictStreak: false }), ultraBonus: Number(e.target.value) }
                                        }));
                                    }} className="w-full p-2 border rounded-lg mt-1 text-sm bg-white font-bold text-purple-600" />
                                </div>
                            </div>
                        </div>`;

code = code.replace(regex, bonusUI);

fs.writeFileSync('components/AdminDashboard.tsx', code);
