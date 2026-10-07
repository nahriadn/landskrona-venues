const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
code = code.replace(/}\r?\n'use client';\r?\n?/g, '}');
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
