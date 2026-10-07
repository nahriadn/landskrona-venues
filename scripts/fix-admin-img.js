const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Replace the div containing the h1 and p tags in AdminDashboard
content = content.replace(
  /<div>\s*<h1 className="text-3xl font-bold text-morkbla-900 tracking-tight">\{t\('admin.title', 'Personalinloggning'\)\}<\/h1>[\s\S]*?<\/div>/,
  `<div className="flex items-center gap-5">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Admin Profile" 
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-morkbla-900 tracking-tight">{t('admin.title', 'Personalinloggning')}</h1>
            <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              {t('admin.logged_in', 'Inloggad som Handläggare (Kulturförvaltningen)')}
            </p>
          </div>
        </div>`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
