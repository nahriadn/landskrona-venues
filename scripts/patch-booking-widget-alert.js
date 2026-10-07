const fs = require('fs');

let code = fs.readFileSync('src/components/BookingWidget.tsx', 'utf8');

// 1. Add alert state
code = code.replace(
  /const \[successMessage, setSuccessMessage\] = useState<string \| null>\(null\);/,
  `const [successMessage, setSuccessMessage] = useState<string | null>(null);\n  const [customAlert, setCustomAlert] = useState<string | null>(null);`
);

// 2. Replace alert() call
code = code.replace(
  /alert\(t\("widget\.alert" as any\)\);/g,
  `setCustomAlert(t("widget.alert" as any) as string);`
);

// 3. Add Custom Alert UI (at the very bottom, right before final </div> or along with other modals)
// Let's insert it inside the return block. The return block starts with <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col h-full animate-fade-in-up">
const alertHtml = `
      {/* Custom Alert Modal */}
      {customAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Oops!</h3>
              <p className="text-slate-600 mb-6">{customAlert}</p>
              <button 
                onClick={() => setCustomAlert(null)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  /(\s*)(<\/div>\s*)$/, // Match the very last </div>
  `$1${alertHtml}$1$2`
);

fs.writeFileSync('src/components/BookingWidget.tsx', code);
