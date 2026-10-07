const fs = require('fs');
const content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const match = content.match(/en: \{([\s\S]*?)\},[\s\S]*da: \{/);
if (match) {
  const enBlock = match[1];
  console.log("Found en block keys:");
  const keys = [...enBlock.matchAll(/"(admin\.[^"]+)"/g)].map(m => m[1]);
  console.log(keys);
} else {
  console.log("Could not find en block");
}
