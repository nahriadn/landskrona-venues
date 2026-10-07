const fs = require('fs');

let content = fs.readFileSync('src/app/venue/[id]/page.tsx', 'utf8');

// Replace the weird manual SVG arrow with Lucide CheckCircle
const badSvg = /<svg className="w-5 h-5 mr-3 text-slate-400 mt-0\.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"><\/path><\/svg>/;

content = content.replace(badSvg, '<CheckCircle className="w-5 h-5 mr-3 text-morkbla opacity-70 mt-0.5" />');

// Let's check if there are any other weird SVGs. (Contact email uses a mail icon, that's fine)

fs.writeFileSync('src/app/venue/[id]/page.tsx', content);
