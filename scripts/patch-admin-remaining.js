const fs = require('fs');
let c = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

c = c.replace(/> Redigera</g, "> {t('admin.btn_edit', 'Redigera')}");
c = c.replace(/> Ta bort</g, "> {t('admin.btn_delete', 'Ta bort')}");
c = c.replace(/> Spärra vald tid</g, "> {t('admin.b_submit', 'Spärra vald tid')}");

fs.writeFileSync('src/components/AdminDashboard.tsx', c);
