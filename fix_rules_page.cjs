const fs = require('fs');

let code = fs.readFileSync('components/RulesPage.tsx', 'utf8');

// Update Props interface
code = code.replace(/interface Props \{\n  onBack: \(\) => void;\n  settings\?: any;\n\}/, `interface Props {\n  onBack: () => void;\n  settings?: any;\n  isAdmin?: boolean;\n}`);

// Find functional component definition and add isAdmin
code = code.replace(/export const RulesPage: React.FC<Props> = \(\{ onBack, settings \}\) => \{/, `export const RulesPage: React.FC<Props> = ({ onBack, settings, isAdmin }) => {`);

// Add Admin Documentation
const rulesEndRegex = /          <\/div>\n      <\/div>\n  \);\n\};/;

const newContent = `              {isAdmin && (
                  <div className="bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-800 text-slate-300 mt-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all"></div>
                      <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                          <Crown className="text-purple-400" size={28} /> Admin Core Features Guide
                      </h2>

                      <div className="space-y-6">
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><KeyRound size={18} className="text-indigo-400" /> Manage App Soul</h3>
                              <p className="text-sm leading-relaxed mb-2">Controls the absolute visibility, tier restrictions, and credit costs for every feature in the app. Use this to completely hide a feature or change it from Free to Ultra.</p>
                              <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
                                  <li>Toggle "Visible" to turn a feature on or off globally.</li>
                                  <li>Set "Credit Cost" to define how many coins are spent when using a feature.</li>
                                  <li>Enable/Disable Dummy price (Cut ₹) from the Power Settings -> Credit Packages tab.</li>
                              </ul>
                          </div>

                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><BookOpen size={18} className="text-emerald-400" /> Content Engine</h3>
                              <p className="text-sm leading-relaxed mb-2">Upload and manage learning materials.</p>
                              <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
                                  <li><strong>Audio/Video:</strong> Create structured playlists with free/premium locking.</li>
                                  <li><strong>Deep Dive Notes:</strong> Upload chunked HTML for smooth scrolling.</li>
                                  <li><strong>MCQ Engine:</strong> Paste formatted text to auto-generate quizzes and test data.</li>
                                  <li><strong>Generate Code:</strong> Click the key icon to copy a direct-access URL for a specific lesson to share via notifications or WhatsApp.</li>
                              </ul>
                          </div>

                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Shield size={18} className="text-amber-400" /> Store & Discount Engine</h3>
                              <p className="text-sm leading-relaxed mb-2">Manage revenue paths and active sales.</p>
                              <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
                                  <li>Use the "Deploy Update" tab to manage the App Update Grace period.</li>
                                  <li>Set exact Start and End dates for Flash Sales in the "Event Manager" tab. This natively handles countdown timers on the Student Store.</li>
                                  <li>Adjust "Daily Login Bonus" inside the Event Manager to change Free/Basic/Ultra daily coin drip.</li>
                              </ul>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>
  );
};`;

code = code.replace(rulesEndRegex, newContent);

fs.writeFileSync('components/RulesPage.tsx', code);
