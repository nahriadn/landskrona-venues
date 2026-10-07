const fs = require('fs');
let c = fs.readFileSync('src/lib/i18n.ts', 'utf8');
c = c.replace(/"hero\.badge": "Officiell Bokningsportal",\\n    "hero\.title"/g, '"hero.badge": "Officiell Bokningsportal",\n    "hero.title"');
c = c.replace(/"hero\.badge": "Official Booking Portal",\\n    "hero\.title"/g, '"hero.badge": "Official Booking Portal",\n    "hero.title"');
c = c.replace(/"hero\.badge": "Officiel Bookingportal",\\n    "hero\.title"/g, '"hero.badge": "Officiel Bookingportal",\n    "hero.title"');
fs.writeFileSync('src/lib/i18n.ts', c);
