const fs = require('fs');
let code = fs.readFileSync('components/AdminPowerManager.tsx', 'utf8');

const tableOld = `                                        <tr key={plan.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                                            <td className="p-3">
                                                <input value={plan.name} onChange={e => {
                                                    const updated = [...localSettings.subscriptionPlans!];
                                                    updated[idx].name = e.target.value;
                                                    updateSetting('subscriptionPlans', updated);
                                                }} className="bg-transparent font-bold text-slate-800 w-full outline-none" />
                                            </td>
                                            <td className="p-3">
                                                 <input value={plan.duration} onChange={e => {
                                                    const updated = [...localSettings.subscriptionPlans!];
                                                    updated[idx].duration = e.target.value;
                                                    updateSetting('subscriptionPlans', updated);
                                                }} className="bg-transparent text-slate-600 w-full outline-none" />
                                            </td>
                                            <td className="p-3">
                                                <input type="number" value={plan.basicPrice} onChange={e => {
                                                    const updated = [...localSettings.subscriptionPlans!];
                                                    updated[idx].basicPrice = Number(e.target.value);
                                                    updateSetting('subscriptionPlans', updated);
                                                }} className="bg-transparent font-bold text-blue-600 w-20 outline-none" />
                                            </td>
                                            <td className="p-3">
                                                 <input type="number" value={plan.ultraPrice} onChange={e => {
                                                    const updated = [...localSettings.subscriptionPlans!];
                                                    updated[idx].ultraPrice = Number(e.target.value);
                                                    updateSetting('subscriptionPlans', updated);
                                                }} className="bg-transparent font-bold text-purple-600 w-20 outline-none" />
                                            </td>
                                            <td className="p-3 text-center">
                                                 <button onClick={() => {
                                                    if(confirm("Delete Plan?")) {
                                                        const updated = localSettings.subscriptionPlans!.filter((_, i) => i !== idx);
                                                        updateSetting('subscriptionPlans', updated);
                                                    }
                                                }} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>`;

const tableNew = `                                        <tr key={plan.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                                            <td className="p-3">
                                                <input value={plan.name} onChange={e => {
                                                    const updated = [...localSettings.subscriptionPlans!];
                                                    updated[idx].name = e.target.value;
                                                    updateSetting('subscriptionPlans', updated);
                                                }} className="bg-transparent font-bold text-slate-800 w-full outline-none" />
                                            </td>
                                            <td className="p-3">
                                                 <input value={plan.duration} onChange={e => {
                                                    const updated = [...localSettings.subscriptionPlans!];
                                                    updated[idx].duration = e.target.value;
                                                    updateSetting('subscriptionPlans', updated);
                                                }} className="bg-transparent text-slate-600 w-20 outline-none" />
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col gap-1">
                                                    <input type="number" value={plan.basicPrice} onChange={e => {
                                                        const updated = [...localSettings.subscriptionPlans!];
                                                        updated[idx].basicPrice = Number(e.target.value);
                                                        updateSetting('subscriptionPlans', updated);
                                                    }} className="bg-transparent font-bold text-blue-600 w-20 outline-none" placeholder="Real ₹" />
                                                    <input type="number" value={plan.basicOriginalPrice} onChange={e => {
                                                        const updated = [...localSettings.subscriptionPlans!];
                                                        updated[idx].basicOriginalPrice = Number(e.target.value);
                                                        updateSetting('subscriptionPlans', updated);
                                                    }} className="bg-transparent text-[10px] text-red-400 w-20 outline-none line-through" placeholder="Cut ₹" />
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                 <div className="flex flex-col gap-1">
                                                     <input type="number" value={plan.ultraPrice} onChange={e => {
                                                        const updated = [...localSettings.subscriptionPlans!];
                                                        updated[idx].ultraPrice = Number(e.target.value);
                                                        updateSetting('subscriptionPlans', updated);
                                                    }} className="bg-transparent font-bold text-purple-600 w-20 outline-none" placeholder="Real ₹" />
                                                     <input type="number" value={plan.ultraOriginalPrice} onChange={e => {
                                                        const updated = [...localSettings.subscriptionPlans!];
                                                        updated[idx].ultraOriginalPrice = Number(e.target.value);
                                                        updateSetting('subscriptionPlans', updated);
                                                    }} className="bg-transparent text-[10px] text-red-400 w-20 outline-none line-through" placeholder="Cut ₹" />
                                                 </div>
                                            </td>
                                            <td className="p-3 text-center">
                                                 <button onClick={() => {
                                                    if(confirm("Delete Plan?")) {
                                                        const updated = localSettings.subscriptionPlans!.filter((_, i) => i !== idx);
                                                        updateSetting('subscriptionPlans', updated);
                                                    }
                                                }} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>`;

code = code.replace(tableOld, tableNew);
fs.writeFileSync('components/AdminPowerManager.tsx', code);
