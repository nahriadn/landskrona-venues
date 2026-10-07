const fs = require('fs');

function fixRelative(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start"/,
    'className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start relative"'
  );
  fs.writeFileSync(filePath, content);
}

fixRelative('src/app/login/page.tsx');
fixRelative('src/app/register/page.tsx');
