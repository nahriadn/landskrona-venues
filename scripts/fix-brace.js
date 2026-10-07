const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
  /<button onClick=\{\(\) => setFilter\('all'\)\}\} className=/g,
  `<button onClick={() => setFilter('all')} className=`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
