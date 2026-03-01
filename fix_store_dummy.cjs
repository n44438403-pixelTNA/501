const fs = require('fs');

let code = fs.readFileSync('components/Store.tsx', 'utf8');

const oldRender = `                              <Crown size={24} className="text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
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
                              </div>`;

const newRender = `                              <Crown size={24} className="text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                              <p className="text-white font-bold text-md mb-1">{pkg.credits + extraCredits}</p>
                              <div className="mt-auto w-full">
                                  {(finalPrice < pkg.price || pkg.dummyPrice) && (
                                      <p className="text-[10px] text-red-400 line-through mb-0.5 font-bold">₹{pkg.dummyPrice || pkg.price}</p>
                                  )}
                                  <button
                                      onClick={() => initiatePurchase({...pkg, price: finalPrice, credits: pkg.credits + extraCredits})} // Pass total credits
                                      className="w-full py-2 bg-amber-500 text-black font-black text-sm rounded-xl hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                                  >
                                      ₹{finalPrice}
                                  </button>
                              </div>`;

code = code.replace(oldRender, newRender);

fs.writeFileSync('components/Store.tsx', code);
