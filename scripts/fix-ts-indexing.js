const fs = require('fs');
let c = fs.readFileSync('src/lib/i18n.ts', 'utf8');
c = c.replace(/return dict\[key\] \|\| translations\.sv\[key\]/g, 'return (dict as any)[key] || (translations.sv as any)[key]');
fs.writeFileSync('src/lib/i18n.ts', c);
