const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(/\{t\('admin\.block_title', '[^]*?Blockera Datum'\)'\)\}/g, "{t('admin.block_title', 'Spärra Tider / Blockera Datum')}");

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
