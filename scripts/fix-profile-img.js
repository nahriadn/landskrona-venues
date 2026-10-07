const fs = require('fs');

let content = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const oldImage = `<div className="w-20 h-20 bg-ljusturkos-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl font-bold text-morkbla">{user.name.charAt(0)}</span>
          </div>`;

const newImage = `<img 
            src={session === 'admin' ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=facearea&facepad=2&w=256&h=256&q=80"} 
            alt="Profile" 
            className="w-20 h-20 rounded-full object-cover mb-6 border-4 border-ljusturkos-100 shadow-sm"
          />`;

content = content.replace(oldImage, newImage);
fs.writeFileSync('src/app/profile/page.tsx', content);
