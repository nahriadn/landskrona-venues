const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
let lines = content.split('\\n');
lines[313] = "              {t('admin.block_title', 'Spärra Tider / Blockera Datum')}";
fs.writeFileSync('src/components/AdminDashboard.tsx', lines.join('\\n'));
