const fs = require('fs');
let c = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// SV
c = c.replace(/"auth\.success": "Inloggning lyckades!",/g, `"auth.success": "Inloggning lyckades!",
      "menu.logout": "Logga ut",
      "cookie.text": "Genom att fortsätta använda webbplatsen godkänner du att vi använder kakor. Vi hanterar dina personuppgifter",
      "cookie.gdpr": "i enlighet med GDPR.",
      "cookie.understand": "Jag förstår",`);

// EN
c = c.replace(/"auth\.success": "Login successful!",/g, `"auth.success": "Login successful!",
      "menu.logout": "Log out",
      "cookie.text": "By continuing to use the website, you agree to our use of cookies. We handle your personal data",
      "cookie.gdpr": "in accordance with GDPR.",
      "cookie.understand": "I understand",`);

// DA
c = c.replace(/"auth\.success": "Login vellykket!",/g, `"auth.success": "Login vellykket!",
      "menu.logout": "Log ud",
      "cookie.text": "Ved at fortsætte med at bruge hjemmesiden accepterer du vores brug af cookies. Vi håndterer dine personoplysninger",
      "cookie.gdpr": "i overensstemmelse med GDPR.",
      "cookie.understand": "Jeg forstår",`);

fs.writeFileSync('src/lib/i18n.ts', c);
