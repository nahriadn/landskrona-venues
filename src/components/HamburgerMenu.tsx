'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/lib/i18n';

export default function HamburgerMenu({ lang, session }: { lang: string, session?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(lang);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded p-2 flex items-center justify-center ${isOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
        aria-label="Menu"
      >
        <img src="https://www.landskrona.se/icons/icon-menu.svg" alt="Meny" className="w-8 h-8 brightness-0 invert" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-2">
            <Link href="/contact" onClick={() => setIsOpen(false)} className="block px-5 py-3 text-sm text-slate-700 hover:bg-ljusturkos-50 hover:text-morkbla transition-colors font-medium">
              {t("menu.contact" as any)}
            </Link>
            <Link href="/callback" onClick={() => setIsOpen(false)} className="block px-5 py-3 text-sm text-slate-700 hover:bg-ljusturkos-50 hover:text-morkbla transition-colors font-medium">
              {t("menu.callback" as any)}
            </Link>
            <div className="h-px bg-slate-100 my-1 mx-4"></div>
            
            {!session ? (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="block px-5 py-3 text-sm text-slate-700 hover:bg-ljusturkos-50 hover:text-morkbla transition-colors font-medium">
                  {t("menu.login" as any)}
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="block px-5 py-3 text-sm text-slate-700 hover:bg-ljusturkos-50 hover:text-morkbla transition-colors font-medium">
                  {t("menu.register" as any)}
                </Link>
              </>
            ) : (
              <>
                {session === 'admin' ? (
                  <Link href="/admin" onClick={() => setIsOpen(false)} className="block px-5 py-3 text-sm font-bold text-morkbla bg-ljusturkos-50 hover:bg-ljusturkos-100 transition-colors">
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="block px-5 py-3 text-sm font-bold text-morkbla bg-ljusturkos-50 hover:bg-ljusturkos-100 transition-colors">
                    {t('profile.title', 'Mina Sidor')}
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                  {t('menu.logout', 'Logga ut')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
