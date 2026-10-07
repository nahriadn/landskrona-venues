const fs = require('fs');
let content = fs.readFileSync('src/components/BookingWidget.tsx', 'utf8');

// 1. Add phone state
content = content.replace(
  "const [email, setEmail] = useState('');",
  "const [email, setEmail] = useState('');\n  const [phone, setPhone] = useState('');"
);

// 2. Add phone import
content = content.replace(
  "import { Calendar as CalendarIcon, Clock, User, CheckCircle, ChevronRight, ChevronLeft, Building, Mail, XCircle } from 'lucide-react';",
  "import { Calendar as CalendarIcon, Clock, User, CheckCircle, ChevronRight, ChevronLeft, Building, Mail, XCircle, Phone } from 'lucide-react';"
);

// 3. Add phone to booking payload
content = content.replace(
  `          orgNum,
          email
        })`,
  `          orgNum,
          email,
          phone
        })`
);

// 4. Update validation in handleNextToConfirm
content = content.replace(
  `  const handleNextToConfirm = () => {
    if (!name || !email) {
      setCustomAlert(lang === 'en' ? 'Please fill in all required fields' : 'Vänligen fyll i alla obligatoriska fält');
      return;
    }
    setCustomAlert(null);
    setStep(3);
  };`,
  `  const handleNextToConfirm = () => {
    if (!name || !email || !phone) {
      setCustomAlert(lang === 'en' ? 'Please fill in all required fields' : 'Vänligen fyll i alla obligatoriska fält');
      return;
    }
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      setCustomAlert(lang === 'en' ? 'Please enter a valid email address' : 'Vänligen ange en giltig e-postadress');
      return;
    }
    setCustomAlert(null);
    setStep(3);
  };`
);

// Fallback if the strict replacement failed
if (content.indexOf('emailRegex') === -1) {
  content = content.replace(
    /const handleNextToConfirm = \(\) => \{[\s\S]*?setStep\(3\);\n  \};/,
    `const handleNextToConfirm = () => {
    if (!name || !email || !phone) {
      setCustomAlert(lang === 'en' ? 'Please fill in all required fields' : 'Vänligen fyll i alla obligatoriska fält');
      return;
    }
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      setCustomAlert(lang === 'en' ? 'Please enter a valid email address' : 'Vänligen ange en giltig e-postadress');
      return;
    }
    setCustomAlert(null);
    setStep(3);
  };`
  );
}

// 5. Add Phone field in Step 2
const emailFieldStr = `<div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> {lang === 'en' ? 'Email Address *' : 'E-postadress *'}
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla outline-none transition-all font-medium"
                />
              </div>`;

const phoneFieldStr = `${emailFieldStr}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> {lang === 'en' ? 'Phone Number *' : 'Telefonnummer *'}
                </label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla outline-none transition-all font-medium"
                />
              </div>`;

content = content.replace(emailFieldStr, phoneFieldStr);

// Fallback for CRLF
if (content.indexOf('Telefonnummer') === -1) {
  const emailFieldStrCRLF = emailFieldStr.replace(/\\n/g, '\\r\\n');
  content = content.replace(emailFieldStrCRLF, phoneFieldStr);
}

// 6. Show Phone in Step 3
content = content.replace(
  `<span className="font-bold text-slate-800 text-right">{email}</span>`,
  `<span className="font-bold text-slate-800 text-right">{email}<br/><span className="text-slate-500 text-sm font-medium">{phone}</span></span>`
);

fs.writeFileSync('src/components/BookingWidget.tsx', content);
