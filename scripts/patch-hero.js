const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(/"hero\.title": "Boka lokaler/, '"hero.badge": "Officiell Bokningsportal",\\n    "hero.title": "Boka lokaler');
content = content.replace(/"hero\.title": "Book venues/, '"hero.badge": "Official Booking Portal",\\n    "hero.title": "Book venues');
content = content.replace(/"hero\.title": "Book lokaler/, '"hero.badge": "Officiel Bookingportal",\\n    "hero.title": "Book lokaler');

fs.writeFileSync('src/lib/i18n.ts', content);
