const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');
content = content.replace(/\\\\n/g, '\\n');
fs.writeFileSync('src/lib/i18n.ts', content);
