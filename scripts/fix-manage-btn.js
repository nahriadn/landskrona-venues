const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
    /<button className="text-slate-400 hover:text-morkbla transition-colors font-bold text-sm[^>]*>/,
    `<button onClick={() => handleStatusChange(booking.id, 'pending')} className="text-slate-400 hover:text-morkbla transition-colors font-bold text-sm flex items-center justify-end w-full">`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
