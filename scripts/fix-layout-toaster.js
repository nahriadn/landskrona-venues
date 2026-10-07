const fs = require('fs');

let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

layout = layout.replace('import CookieBanner from "@/components/CookieBanner";', 
`import CookieBanner from "@/components/CookieBanner";
import { Toaster } from 'react-hot-toast';
import LiveNotifications from '@/components/LiveNotifications';`);

layout = layout.replace('{/* Main Content Area */}', 
`<Toaster position="top-right" />
        <LiveNotifications session={session} lang={lang} />
        
        {/* Main Content Area */}`);

fs.writeFileSync('src/app/layout.tsx', layout);
