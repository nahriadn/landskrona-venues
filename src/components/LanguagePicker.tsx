'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function LanguagePicker({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'sv', name: 'Svenska', flagUrl: 'https://flagcdn.com/w40/se.png' },
    { code: 'en', name: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png' },
    { code: 'da', name: 'Dansk', flagUrl: 'https://flagcdn.com/w40/dk.png' },
  ];

  const current = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    document.cookie = `lang=${code}; path=/; max-age=31536000`;
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-white hover:text-morkbla-200 transition-colors font-semibold text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Select language"
      >
        <img src={current.flagUrl} alt="" className="w-5 h-auto rounded-[2px]" />
        <span className="hidden md:inline">{current.name}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map(l => (
            <button 
              key={l.code} 
              onClick={() => handleSelect(l.code)} 
              className={`w-full text-left px-5 py-3.5 text-sm flex items-center gap-3 transition-colors focus:outline-none focus:bg-ljusturkos-50 hover:bg-ljusturkos-50 ${
                currentLang === l.code ? 'font-bold text-morkbla bg-ljusturkos-50/60' : 'text-slate-700 font-medium'
              }`}
            >
              <img src={l.flagUrl} alt="" className="w-5 h-auto rounded-[2px]" />
              {l.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
