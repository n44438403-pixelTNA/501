const fs = require('fs');

let code = fs.readFileSync('components/RulesPage.tsx', 'utf8');

const regex = /\{isAdmin && \([\s\S]*?<\/div>\n\s*\)\}\n\n    <\/div>/;

const newAdminMap = `{isAdmin && (
          <div className="bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-800 text-slate-300 mt-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all"></div>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <Map className="text-purple-400" size={28} /> Admin Settings Map
              </h2>
              <p className="text-sm text-slate-400 mb-6">A quick guide to finding exactly where to change specific app settings and features.</p>

              <div className="space-y-6 relative z-10">

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-blue-400/50 transition-colors">
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><CreditCard size={18} className="text-blue-400" /> Subscription & Packages</h3>
                      <p className="text-xs text-slate-400 mb-2">Where to change prices, dummy prices, limits, and add/remove plans.</p>
                      <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-sm font-mono text-blue-300">
                          Advanced Settings <span className="text-slate-500">→</span> Power Config <span className="text-slate-500">→</span> Pricing / Packages / Plans
                      </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-colors">
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Eye size={18} className="text-emerald-400" /> App Features (Hide/Show)</h3>
                      <p className="text-xs text-slate-400 mb-2">Where to turn features on/off completely, change their coin cost, or restrict to Ultra only.</p>
                      <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-sm font-mono text-emerald-300">
                          NSTA Control <span className="text-slate-500">→</span> Manage App Soul
                      </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-amber-400/50 transition-colors">
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Zap size={18} className="text-amber-400" /> Discounts & Login Bonus</h3>
                      <p className="text-xs text-slate-400 mb-2">Where to schedule flash sales, set discount percentages, and configure daily free coins.</p>
                      <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-sm font-mono text-amber-300">
                          Core Management <span className="text-slate-500">→</span> Event Manager
                      </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-rose-400/50 transition-colors">
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Smartphone size={18} className="text-rose-400" /> Force App Update (APK/PlayStore)</h3>
                      <p className="text-xs text-slate-400 mb-2">Where to lock out old app versions and force users to download the newest update.</p>
                      <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-sm font-mono text-rose-300">
                          Core Management <span className="text-slate-500">→</span> Deploy Update
                      </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-colors">
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Users size={18} className="text-cyan-400" /> Sub-Admins & Powers</h3>
                      <p className="text-xs text-slate-400 mb-2">Where to promote users to sub-admin and grant them specific access.</p>
                      <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-sm font-mono text-cyan-300">
                          Advanced Settings <span className="text-slate-500">→</span> Sub-Admins
                      </div>
                  </div>

              </div>
          </div>
      )}

    </div>`;

code = code.replace(regex, newAdminMap);

// Inject missing Lucide icons Map, CreditCard, Eye, Zap, Smartphone, Users
code = code.replace(/import \{ Shield, BookOpen, Lock, Coins, MessageCircle, Crown, Info, CheckCircle2, AlertTriangle, KeyRound, Languages \} from 'lucide-react';/, "import { Shield, BookOpen, Lock, Coins, MessageCircle, Crown, Info, CheckCircle2, AlertTriangle, KeyRound, Languages, Map, CreditCard, Eye, Zap, Smartphone, Users } from 'lucide-react';");

fs.writeFileSync('components/RulesPage.tsx', code);
