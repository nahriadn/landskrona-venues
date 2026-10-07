const fs = require('fs');

let profileTsx = fs.readFileSync('src/app/profile/page.tsx', 'utf8');
profileTsx = profileTsx.replace(/\\n/g, '\n');
fs.writeFileSync('src/app/profile/page.tsx', profileTsx);
