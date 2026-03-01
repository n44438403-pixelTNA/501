const fs = require('fs');

let code = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

const packageManagerOld = `                          {/* PACKAGE MANAGER */}
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
                              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ShoppingBag size={18} /> Store Packages Manager</h4>

                              <div className="grid gap-3 mb-6">
                                  {(!localSettings.packages || localSettings.packages.length === 0) && <p className="text-xs text-slate-400">No packages defined. Default list will be shown to users.</p>}
                                  {localSettings.packages?.map(pkg => (
                                      <div key={pkg.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                          <div>
                                              <p className="font-bold text-sm text-slate-800">{pkg.name}</p>
                                              <p className="text-xs text-slate-500">₹{pkg.price} = {pkg.credits} Credits</p>
                                          </div>
                                          <button onClick={() => removePackage(pkg.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
                                      </div>
                                  ))}
                              </div>

                              <div className="flex gap-2 items-end">
                                  <div className="flex-1">
                                      <label className="text-[10px] font-bold uppercase text-slate-400">Name</label>
                                      <input type="text" placeholder="Pro Pack" value={newPkgName} onChange={e => setNewPkgName(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                                  </div>
                                  <div className="w-20">
                                      <label className="text-[10px] font-bold uppercase text-slate-400">Price (₹)</label>
                                      <input type="number" placeholder="99" value={newPkgPrice} onChange={e => setNewPkgPrice(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                                  </div>
                                  <div className="w-24">
                                      <label className="text-[10px] font-bold uppercase text-slate-400">Credits</label>
                                      <input type="number" placeholder="100" value={newPkgCredits} onChange={e => setNewPkgCredits(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                                  </div>
                                  <button onClick={addPackage} className="bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700">Add</button>
                              </div>
                          </div>`;

code = code.replace(packageManagerOld, '');

fs.writeFileSync('components/AdminDashboard.tsx', code);
