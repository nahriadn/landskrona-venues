const fs = require('fs');
const path = require('path');

const i18n = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// 1. Extract all keys in EN block
const enMatch = i18n.match(/en: \{([\s\S]*?)\},[\s\S]*da: \{/);
const enKeys = new Set();
if (enMatch) {
  const matches = enMatch[1].matchAll(/"([^"]+)":/g);
  for (const m of matches) {
    enKeys.add(m[1]);
  }
}

// 2. Scan all .tsx files for t('key')
const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
};

const usedKeys = new Set();
const allFiles = walk('src');
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match t('key' or t("key"
  const regex = /t\(['"]([^'"]+)['"]/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    usedKeys.add(m[1]);
  }
});

// 3. Find missing keys
const missing = [];
for (const key of usedKeys) {
  if (!enKeys.has(key)) {
    missing.push(key);
  }
}

console.log("Missing from EN dictionary:", missing);
