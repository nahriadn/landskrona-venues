const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// The file might have encoding issues when read/written, so let's match safely
content = content.replace(/\{t\('admin\.block_title',\s*'[^]*?Blockera[^]*?'\)\}/g, "{t('admin.block_title', 'Spärra Tider / Blockera Datum')}");

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
