const fs = require('fs');
let c = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

c = c.replace(/const form = e\.target;/, 'const form = e.target as any;');

fs.writeFileSync('src/components/AdminDashboard.tsx', c);
