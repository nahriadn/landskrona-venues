const fs = require('fs');

// 1. Fix AdminDashboard.tsx
let admin = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
admin = admin.replace(
  /<Ban className="w-5 h-5 mr-2" \/> Spärra vald tid/g,
  `<Ban className="w-5 h-5 mr-2" /> {t('admin.b_submit', 'Spärra vald tid')}`
);
fs.writeFileSync('src/components/AdminDashboard.tsx', admin);

// 2. Fix HamburgerMenu.tsx
let hm = fs.readFileSync('src/components/HamburgerMenu.tsx', 'utf8');
hm = hm.replace(/Mina Sidor/g, `{t('profile.title', 'Mina Sidor')}`);
hm = hm.replace(/Logga ut/g, `{t('menu.logout', 'Logga ut')}`);
fs.writeFileSync('src/components/HamburgerMenu.tsx', hm);

// 3. Fix BankIDSimulator.tsx
let bank = fs.readFileSync('src/components/BankIDSimulator.tsx', 'utf8');
bank = bank.replace(
  /Logga in som Förening \/ Klient/g,
  `{lang === 'en' ? 'Log in as Association / Client' : lang === 'da' ? 'Log ind som Forening / Klient' : 'Logga in som Förening / Klient'}`
);
bank = bank.replace(
  /Logga in som Administratör/g,
  `{lang === 'en' ? 'Log in as Administrator' : lang === 'da' ? 'Log ind som Administrator' : 'Logga in som Administratör'}`
);
fs.writeFileSync('src/components/BankIDSimulator.tsx', bank);

// 4. Fix CookieBanner.tsx
let cookie = fs.readFileSync('src/components/CookieBanner.tsx', 'utf8');
cookie = cookie.replace(
  /Genom att fortsätta använda webbplatsen godkänner du att vi använder kakor\. Vi hanterar dina personuppgifter/g,
  `{t('cookie.text', 'Genom att fortsätta använda webbplatsen godkänner du att vi använder kakor. Vi hanterar dina personuppgifter')}`
);
cookie = cookie.replace(
  /i enlighet med GDPR\./g,
  `{t('cookie.gdpr', 'i enlighet med GDPR.')}`
);
cookie = cookie.replace(
  /Jag förstår/g,
  `{t('cookie.understand', 'Jag förstår')}`
);
fs.writeFileSync('src/components/CookieBanner.tsx', cookie);
