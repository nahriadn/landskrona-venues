const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');
content = content.replace(/"hero\.badge"[^]*?"hero\.title"/g, '"hero.badge": "Officiell Bokningsportal",\n    "hero.title"');
content = content.replace(/"hero\.badge"[^]*?"hero\.title"/g, '"hero.badge": "Official Booking Portal",\n    "hero.title"');
content = content.replace(/"hero\.badge"[^]*?"hero\.title"/g, '"hero.badge": "Officiel Bookingportal",\n    "hero.title"');
fs.writeFileSync('src/lib/i18n.ts', content);
