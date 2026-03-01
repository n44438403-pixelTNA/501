const fs = require('fs');
let code = fs.readFileSync('components/AdminPowerManager.tsx', 'utf8');

const packageOld = `                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-slate-400 font-bold">₹</span>
                                        <input type="number" value={pkg.price} onChange={e => {
                                            const updated = [...localSettings.packages];
                                            updated[idx].price = Number(e.target.value);
                                            updateSetting('packages', updated);
                                        }} className="font-black text-slate-800 text-lg w-full outline-none" />
                                    </div>`;

const packageNew = `                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-slate-400 font-bold">₹</span>
                                        <input type="number" value={pkg.price} onChange={e => {
                                            const updated = [...localSettings.packages];
                                            updated[idx].price = Number(e.target.value);
                                            updateSetting('packages', updated);
                                        }} className="font-black text-slate-800 text-lg w-full outline-none" placeholder="Real Price" />
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-red-400 font-bold">Cut ₹</span>
                                        <input type="number" value={pkg.dummyPrice || ''} onChange={e => {
                                            const updated = [...localSettings.packages];
                                            updated[idx].dummyPrice = Number(e.target.value);
                                            updateSetting('packages', updated);
                                        }} className="font-bold text-red-500 text-sm w-full outline-none bg-red-50 p-1 rounded border border-red-100 line-through" placeholder="Dummy Price" />
                                    </div>`;

code = code.replace(packageOld, packageNew);
fs.writeFileSync('components/AdminPowerManager.tsx', code);
