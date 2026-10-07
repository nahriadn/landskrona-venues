const fs = require('fs');
let s1 = fs.readFileSync('src/app/api/admin/bookings/route.ts', 'utf8');
s1 = s1.replace(/\\`/g, '`');
fs.writeFileSync('src/app/api/admin/bookings/route.ts', s1);

let s2 = fs.readFileSync('src/app/api/slots/route.ts', 'utf8');
s2 = s2.replace(/\\`/g, '`');
fs.writeFileSync('src/app/api/slots/route.ts', s2);
