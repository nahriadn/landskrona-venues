'use client';
import { useState, useEffect } from 'react';
import { getTranslation } from '@/lib/i18n';
import Cookies from 'js-cookie';

export default function CookieBanner({ lang }: { lang: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const t = getTranslation(lang);

  useEffect(() => {
    if (!Cookies.get('gdpr_consent')) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#001f3f] text-white p-6 z-50 border-t-4 border-[#00546f] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="max-w-4xl">
        <h3 className="font-bold text-lg mb-2">Cookies & Integritet</h3>
        <p className="text-sm text-blue-100">
          Landskrona stad använder kakor (cookies) för att ge dig en så bra upplevelse som möjligt av vår webbplats. 
          {t('cookie.text', 'Genom att fortsätta använda webbplatsen godkänner du att vi använder kakor. Vi hanterar dina personuppgifter')} 
          i enlighet med Dataskyddsförordningen (GDPR).
        </p>
      </div>
      <div className="flex gap-4 shrink-0">
        <button 
          onClick={() => {
            Cookies.set('gdpr_consent', 'true', { expires: 365 });
            setIsVisible(false);
          }} 
          className="bg-[#136377] hover:bg-[#0f4f60] text-white px-6 py-3 rounded-lg font-bold transition-colors whitespace-nowrap shadow-sm"
        >
          Godkänn alla
        </button>
        <button 
          onClick={() => setIsVisible(false)}
          className="bg-transparent border border-blue-400 text-blue-200 hover:text-white hover:border-white px-6 py-3 rounded-lg font-bold transition-colors whitespace-nowrap"
        >
          Avvisa onödiga
        </button>
      </div>
    </div>
  );
}
