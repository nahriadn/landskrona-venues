const fs = require('fs');
let s1 = fs.readFileSync('src/components/SiteHeader.tsx', 'utf8');
s1 = s1.replace(/\\`/g, '`');
fs.writeFileSync('src/components/SiteHeader.tsx', s1);
