const fs = require('fs');

let content = fs.readFileSync('src/components/BankIDSimulator.tsx', 'utf8');
content = content.replace(/\\`/g, "");
content = content.replace(/\\\$\\{pinError \? 'bg-red-50 border-red-300 text-red-900 focus:ring-2 focus:ring-red-400' : 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-morkbla'\\}/, " ' + (pinError ? 'bg-red-50 border-red-300 text-red-900 focus:ring-2 focus:ring-red-400' : 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-morkbla') + '");
content = content.replace(/className=\{w-24/, "className={'w-24");
content = content.replace(/morkbla\)\ \+\ \'\}/, "morkbla')}");

fs.writeFileSync('src/components/BankIDSimulator.tsx', content);
