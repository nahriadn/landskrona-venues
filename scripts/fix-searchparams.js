const fs = require('fs');

function fix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/export default async function (.*)\(\{ searchParams \}: \{ searchParams: \{ error\?: string \} \}\) \{/, 'export default async function $1({ searchParams }: { searchParams: Promise<{ error?: string }> }) {\n  const resolvedSearchParams = await searchParams;');
  
  content = content.replace(/searchParams\?\.error/g, 'resolvedSearchParams?.error');
  fs.writeFileSync(filePath, content);
}

fix('src/app/login/page.tsx');
fix('src/app/register/page.tsx');
