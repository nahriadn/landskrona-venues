const fs = require('fs');
let content = fs.readFileSync('src/app/login/page.tsx', 'utf8');
content = content.replace(/\{searchParams\?\.error/g, '{resolvedSearchParams?.error');
fs.writeFileSync('src/app/login/page.tsx', content);
