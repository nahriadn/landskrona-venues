const fs = require('fs');
let content = fs.readFileSync('src/components/SiteHeader.tsx', 'utf8');

// Replace the bad label in Desktop Dropdown
content = content.replace(
  /<p className="text-xs font-bold text-slate-400 uppercase tracking-widest">\{t\('profile\.type', 'Användare'\)\}<\/p>/g,
  `<p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === 'en' ? 'Signed in as' : lang === 'da' ? 'Logget ind som' : 'Inloggad som'}</p>`
);

// Replace the bad label in Mobile Dropdown
content = content.replace(
  /<p className="text-xs text-white\/50 uppercase tracking-widest">\{t\('profile\.type', 'Användare'\)\}<\/p>/g,
  `<p className="text-xs text-white/50 uppercase tracking-widest">{lang === 'en' ? 'Signed in as' : lang === 'da' ? 'Logget ind som' : 'Inloggad som'}</p>`
);

fs.writeFileSync('src/components/SiteHeader.tsx', content);
