const fs = require('fs');
let code = fs.readFileSync('components/StudentDashboard.tsx', 'utf8');

// The user requested: "edit profil karne oe usi time pop up aajaye edit jarne ka aur ye edit me class aur board dono chamge karne ka option limited higa dono ka kimit bas jo hai pahle se same"
// The popup is currently shown conditionally based on editMode. The user wants it to be immediate and respect limits. It already maps allowed classes if configured. Let's make sure it defaults properly.
const editProfileOld = `                              <select
                                  value={profileData.classLevel}
                                  onChange={(e) => setProfileData({...profileData, classLevel: e.target.value as any})}
                                  className="w-full p-3 rounded-xl border border-slate-200 font-bold bg-slate-50"
                              >
                                  {['6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                              </select>`;

const editProfileNew = `                              <select
                                  value={profileData.classLevel}
                                  onChange={(e) => setProfileData({...profileData, classLevel: e.target.value as any})}
                                  className="w-full p-3 rounded-xl border border-slate-200 font-bold bg-slate-50"
                              >
                                  {(settings?.allowedClasses || ['6','7','8','9','10','11','12','COMPETITION']).map(c => <option key={c} value={c}>{c === 'COMPETITION' ? 'Competition' : \`Class \${c}\`}</option>)}
                              </select>`;

code = code.replace(editProfileOld, editProfileNew);

const boardOld = `                              <select
                                  value={profileData.board}
                                  onChange={(e) => setProfileData({...profileData, board: e.target.value as any})}
                                  className="w-full p-3 rounded-xl border border-slate-200 font-bold bg-slate-50"
                              >
                                  <option value="CBSE">CBSE (English)</option>
                                  <option value="BSEB">BSEB (Hindi)</option>
                              </select>`;

const boardNew = `                              <select
                                  value={profileData.board}
                                  onChange={(e) => setProfileData({...profileData, board: e.target.value as any})}
                                  className="w-full p-3 rounded-xl border border-slate-200 font-bold bg-slate-50"
                              >
                                  {(settings?.allowedBoards || ['CBSE', 'BSEB']).map(b => (
                                      <option key={b} value={b}>{b} {b === 'CBSE' ? '(English)' : b === 'BSEB' ? '(Hindi)' : ''}</option>
                                  ))}
                              </select>`;

code = code.replace(boardOld, boardNew);

fs.writeFileSync('components/StudentDashboard.tsx', code);
