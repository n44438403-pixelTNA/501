const fs = require('fs');

let code = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

// I need to find the <FeatureGroupList ... /> and the available tabs, but more importantly, I need to know where RulesPage is imported or can be placed.
// Let's import it first if not present
if (!code.includes("import { RulesPage }")) {
    code = code.replace(/import \{ FeatureAccessPage \} from '\.\/admin\/FeatureAccessPage';/, "import { FeatureAccessPage } from './admin/FeatureAccessPage';\nimport { RulesPage } from './RulesPage';");
}

const docsOld = `{/* --- DOCUMENTATION TAB --- */}
      {activeTab === 'DOCUMENTATION' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                  <button onClick={() => setActiveTab('DASHBOARD')} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200"><ArrowLeft size={20} /></button>
                  <h3 className="text-xl font-black text-slate-800">System Documentation</h3>
              </div>
              <DocumentationTab />
          </div>
      )}`;

const docsNew = `{/* --- APP RULES TAB --- */}
      {activeTab === 'APP_RULES' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-in slide-in-from-right">
              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                  <button onClick={() => setActiveTab('DASHBOARD')} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200"><ArrowLeft size={20} /></button>
                  <h3 className="text-xl font-black text-slate-800">App Rules & Manual</h3>
              </div>
              <RulesPage onBack={() => setActiveTab('DASHBOARD')} settings={localSettings} isAdmin={true} />
          </div>
      )}

      {/* --- DOCUMENTATION TAB --- */}
      {activeTab === 'DOCUMENTATION' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                  <button onClick={() => setActiveTab('DASHBOARD')} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200"><ArrowLeft size={20} /></button>
                  <h3 className="text-xl font-black text-slate-800">System Documentation</h3>
              </div>
              <DocumentationTab />
          </div>
      )}`;

code = code.replace(docsOld, docsNew);

fs.writeFileSync('components/AdminDashboard.tsx', code);
