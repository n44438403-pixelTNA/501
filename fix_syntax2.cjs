const fs = require('fs');
let code = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

const brokenBlock = `                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Ultra User Bonus</label>
                                    <input type="number" value={localSettings.loginBonusConfig?.ultraBonus ?? 10} onChange={e => {
                                        setLocalSettings(prev => ({
                                            ...prev,
                                            loginBonusConfig: { ...(prev.loginBonusConfig || { freeBonus: 2, basicBonus: 5, ultraBonus: 10, strictStreak: false }), ultraBonus: Number(e.target.value) }
                                        }));
                                    }} className="w-full p-2 border rounded-lg mt-1 text-sm bg-white font-bold text-purple-600" />
                                </div>
                            </div>
                        </div>
                                  className="w-full p-2 border rounded-lg font-bold"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">Scores above this are "Strong"</p>
                          </div>`;

const fixedBlock = `                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Ultra User Bonus</label>
                                    <input type="number" value={localSettings.loginBonusConfig?.ultraBonus ?? 10} onChange={e => {
                                        setLocalSettings(prev => ({
                                            ...prev,
                                            loginBonusConfig: { ...(prev.loginBonusConfig || { freeBonus: 2, basicBonus: 5, ultraBonus: 10, strictStreak: false }), ultraBonus: Number(e.target.value) }
                                        }));
                                    }} className="w-full p-2 border rounded-lg mt-1 text-sm bg-white font-bold text-purple-600" />
                                </div>
                            </div>
                        </div>

                      {/* --- REVISION LOGIC CONFIGURATION --- */}
                      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mt-4">
                          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><BrainCircuit size={18} className="text-purple-500" /> Revision Engine Config</h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase">Strong Topic (Min %)</label>
                              <input
                                  type="number"
                                  value={localSettings.revisionConfig?.thresholds.strong ?? 80}
                                  onChange={(e) => setLocalSettings({
                                      ...localSettings,
                                      revisionConfig: {
                                          ...localSettings.revisionConfig!,
                                          thresholds: {
                                              ...localSettings.revisionConfig?.thresholds!,
                                              strong: parseInt(e.target.value) || 0
                                          }
                                      } as any
                                  })}
                                  className="w-full p-2 border rounded-lg font-bold"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">Scores above this are "Strong"</p>
                          </div>`;

code = code.replace(brokenBlock, fixedBlock);

fs.writeFileSync('components/AdminDashboard.tsx', code);
