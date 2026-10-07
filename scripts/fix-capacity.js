const fs = require('fs');
let c = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

c = c.replace(/\{t\('admin\.f_capacity', 'Kapacitet \(antal \{t\('admin\.lbl_pers', 'pers'\)\}\)'\)\}/g, "{t('admin.f_capacity', 'Kapacitet (antal pers)')}");

fs.writeFileSync('src/components/AdminDashboard.tsx', c);
