const fs = require('fs');

let code = fs.readFileSync('components/Store.tsx', 'utf8');

const regex = /<p className="text-slate-500 text-\[10px\] uppercase font-bold">\s*\{finalPrice < pkg\.price \? \(\s*<>\s*<span className="line-through mr-1 opacity-50">₹\{pkg\.price\}<\/span>\s*<span className="text-green-400">₹\{finalPrice\}<\/span>\s*<\/>\s*\) : `₹\$\{pkg\.price\}`\}\s*<\/p>/g;

const newText = `<p className="text-slate-500 text-[10px] uppercase font-bold">
                                  {(finalPrice < pkg.price || pkg.dummyPrice) ? (
                                      <>
                                          <span className="line-through mr-1 opacity-50 text-red-400">₹{pkg.dummyPrice || pkg.price}</span>
                                          <span className="text-green-400">₹{finalPrice}</span>
                                      </>
                                  ) : \`₹\${pkg.price}\`}
                              </p>`;

code = code.replace(regex, newText);

fs.writeFileSync('components/Store.tsx', code);
