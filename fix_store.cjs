const fs = require('fs');
let code = fs.readFileSync('components/Store.tsx', 'utf8');

const packageUIOld = `                          extraCredits = Math.floor(pkg.credits * (bonusConfig.percent / 100));
                      }

                      return (
                          <div key={pkg.id} className="bg-[#18181b] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between items-center text-center shadow-lg relative group hover:border-amber-500/50 transition-colors">
                              {/* Extra Credits Badge */}
                              {extraCredits > 0 && (
                                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border border-amber-300">
                                      +{extraCredits} BONUS
                                  </div>
                              )}

                              <Crown size={24} className="text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                              <p className="text-white font-bold text-md mb-1">{pkg.credits + extraCredits}</p>
                              <div className="mt-auto w-full">
                                  {finalPrice < pkg.price && (
                                      <p className="text-[10px] text-slate-500 line-through mb-0.5">₹{pkg.price}</p>
                                  )}
                                  <button
                                      onClick={() => initiatePurchase({...pkg, price: finalPrice, credits: pkg.credits + extraCredits})} // Pass total credits
                                      className="w-full py-2 bg-amber-500 text-black font-black text-sm rounded-xl hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                                  >
                                      ₹{finalPrice}
                                  </button>
                              </div>
                          </div>
                      );
                  })}
              </div>`;

const packageUINew = `                          extraCredits = Math.floor(pkg.credits * (bonusConfig.percent / 100));
                      }

                      return (
                          <div key={pkg.id} className="bg-[#18181b] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between items-center text-center shadow-lg relative group hover:border-amber-500/50 transition-colors">
                              {/* Extra Credits Badge */}
                              {extraCredits > 0 && (
                                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border border-amber-300">
                                      +{extraCredits} BONUS
                                  </div>
                              )}

                              <Crown size={24} className="text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                              <p className="text-white font-bold text-md mb-1">{pkg.credits + extraCredits}</p>
                              <div className="mt-auto w-full">
                                  {(finalPrice < pkg.price || pkg.dummyPrice) && (
                                      <p className="text-[10px] text-red-400 line-through mb-0.5">₹{pkg.dummyPrice || pkg.price}</p>
                                  )}
                                  <button
                                      onClick={() => initiatePurchase({...pkg, price: finalPrice, credits: pkg.credits + extraCredits})} // Pass total credits
                                      className="w-full py-2 bg-amber-500 text-black font-black text-sm rounded-xl hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                                  >
                                      ₹{finalPrice}
                                  </button>
                              </div>
                          </div>
                      );
                  })}
              </div>`;

code = code.replace(packageUIOld, packageUINew);

fs.writeFileSync('components/Store.tsx', code);
