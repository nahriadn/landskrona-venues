const fs = require('fs');

let page = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

page = page.replace(
  /const user = session === 'admin' \n\s*\? \{ name: 'Admin Handläggare', email: 'admin@landskrona\.se', org: 'Kulturförvaltningen', type: 'Kommunal Verksamhet' \}\n\s*: \{ name: 'Test Förening', email: 'test\.forening@gmail\.com', org: 'Landskrona Idrottsförening', type: 'Registrerad Förening' \};/,
  `const user = session === 'admin' 
    ? { 
        name: lang === 'en' ? 'Admin Officer' : lang === 'da' ? 'Admin Officer' : 'Admin Handläggare', 
        email: 'admin@landskrona.se', 
        org: lang === 'en' ? 'Cultural Administration' : lang === 'da' ? 'Kulturforvaltningen' : 'Kulturförvaltningen', 
        type: lang === 'en' ? 'Municipal Operations' : lang === 'da' ? 'Kommunal Virksomhed' : 'Kommunal Verksamhet' 
      }
    : { 
        name: lang === 'en' ? 'Test Association' : lang === 'da' ? 'Test Forening' : 'Test Förening', 
        email: 'test.forening@gmail.com', 
        org: lang === 'en' ? 'Landskrona Sports Association' : lang === 'da' ? 'Landskrona Idrætsforening' : 'Landskrona Idrottsförening', 
        type: lang === 'en' ? 'Registered Association' : lang === 'da' ? 'Registreret Forening' : 'Registrerad Förening' 
      };`
);

fs.writeFileSync('src/app/profile/page.tsx', page);
