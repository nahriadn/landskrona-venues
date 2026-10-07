const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(/Spärra Tider \/ Blockera Datum/g, "{t('admin.block_title', 'Spärra Tider / Blockera Datum')}");
content = content.replace(/> Spärra Tider/g, "> {t('admin.block_tab', 'Spärra Tider')}");
content = content.replace(/>Spärra Tider</g, ">{t('admin.block_tab', 'Spärra Tider')}<");

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
