const fs = require('fs');

let code = fs.readFileSync('components/AdminPowerManager.tsx', 'utf8');

const packageInputsOld = `                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-slate-400 font-bold">CR:</span>
                                        <input type="number" value={pkg.credits} onChange={e => {
                                            const updated = [...localSettings.packages];
                                            updated[idx].credits = Number(e.target.value);
                                            updateSetting('packages', updated);
                                        }} className="w-full p-2 border rounded-lg bg-slate-50 text-sm font-bold text-blue-600" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-slate-400 font-bold">₹:</span>
                                        <input type="number" value={pkg.price} onChange={e => {
                                            const updated = [...localSettings.packages];
                                            updated[idx].price = Number(e.target.value);
                                            updateSetting('packages', updated);
                                        }} className="w-full p-2 border rounded-lg bg-slate-50 text-sm font-bold text-slate-800" />
                                    </div>`;

const packageInputsNew = `                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-slate-400 font-bold">CR:</span>
                                        <input type="number" value={pkg.credits} onChange={e => {
                                            const updated = [...(localSettings.packages || [])];
                                            updated[idx].credits = Number(e.target.value);
                                            updateSetting('packages', updated);
                                        }} className="w-full p-2 border rounded-lg bg-slate-50 text-sm font-bold text-blue-600" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-slate-400 font-bold">₹:</span>
                                        <input type="number" value={pkg.price} onChange={e => {
                                            const updated = [...(localSettings.packages || [])];
                                            updated[idx].price = Number(e.target.value);
                                            updateSetting('packages', updated);
                                        }} className="w-full p-2 border rounded-lg bg-slate-50 text-sm font-bold text-slate-800" placeholder="Real Price" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-slate-400 font-bold">Cut ₹:</span>
                                        <input type="number" value={pkg.dummyPrice || ''} onChange={e => {
                                            const updated = [...(localSettings.packages || [])];
                                            updated[idx].dummyPrice = Number(e.target.value);
                                            updateSetting('packages', updated);
                                        }} className="w-full p-2 border border-red-200 rounded-lg bg-red-50 text-sm font-bold text-red-400 line-through" placeholder="Dummy Price" />
                                    </div>`;

code = code.replace(packageInputsOld, packageInputsNew);

fs.writeFileSync('components/AdminPowerManager.tsx', code);
