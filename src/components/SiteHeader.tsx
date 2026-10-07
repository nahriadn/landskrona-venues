'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, UserPlus, LogOut, User, LayoutDashboard, Phone, MessageSquare, ChevronDown, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import LanguagePicker from './LanguagePicker';
import { getTranslation } from '@/lib/i18n';

export default function SiteHeader({ lang, tBack, session }: { lang: string, tBack: string, session?: string }) {
  const pathname = usePathname();
  const isVenuePage = pathname.startsWith('/venue/');
  const t = getTranslation(lang);
  const router = useRouter();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setIsUserMenuOpen(false);
    setIsMobileOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-morkbla shadow-lg sticky top-0 z-50 text-white border-b border-morkbla-900/50">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl h-20 flex items-center justify-between">
        
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <img src="https://www.landskrona.se/static/Logo-42a3cc36d82d4d2766e9f7c0358f2eda.svg" alt="Landskrona stad" className="h-8 md:h-9" />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold hover:text-ljusturkos transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 opacity-70" />
              Boka Lokal
            </Link>
            <Link href="/contact" className="text-sm font-bold text-white/80 hover:text-white transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4 opacity-70" />
              {t("menu.contact" as any)}
            </Link>
            <Link href="/callback" className="text-sm font-bold text-white/80 hover:text-white transition-colors flex items-center gap-2">
              <MessageSquare className="w-4 h-4 opacity-70" />
              {t("menu.callback" as any)}
            </Link>
          </nav>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <LanguagePicker currentLang={lang} />
          
          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3 border-l border-white/20 pl-5">
            {!session ? (
              <div className="flex items-center gap-3">
                <Link href="/register" className="text-sm font-bold text-white/90 hover:text-white transition-colors flex items-center gap-2 px-2">
                  <UserPlus className="w-4 h-4 opacity-70" />
                  {t("menu.register" as any)}
                </Link>
                <Link href="/login" className="bg-white hover:bg-slate-100 text-morkbla text-sm font-bold py-2.5 px-6 rounded-full transition-all shadow-sm flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  {t("menu.login" as any)}
                </Link>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-2.5 px-5 rounded-full transition-all flex items-center gap-2 border border-white/10"
                >
                  <User className="w-4 h-4" />
                  {session === 'admin' ? 'Admin' : t('profile.title', 'Mina Sidor')}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 \${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <div className="px-5 py-3 border-b border-slate-100 mb-1 bg-slate-50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('profile.type', 'Användare')}</p>
                        <p className="text-sm font-bold text-morkbla truncate">{session === 'admin' ? 'Administratör' : 'Test Förening'}</p>
                      </div>
                      
                      <Link href={session === 'admin' ? '/admin' : '/profile'} onClick={() => setIsUserMenuOpen(false)} className="px-5 py-3 text-sm font-bold text-slate-700 hover:text-morkbla hover:bg-ljusturkos-50 transition-colors flex items-center gap-3">
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        {session === 'admin' ? 'Admin Dashboard' : t('profile.title', 'Mina Sidor')}
                      </Link>
                      
                      <button onClick={handleLogout} className="w-full px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 text-left">
                        <LogOut className="w-4 h-4 text-red-400" />
                        {t('menu.logout', 'Logga ut')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-colors text-white"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-morkbla border-t border-white/10 shadow-2xl animate-in slide-in-from-top-2 duration-200 z-40">
          <div className="px-4 py-6 space-y-4">
            <Link href="/" onClick={() => setIsMobileOpen(false)} className="block px-4 py-3 text-lg font-bold text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5 opacity-70" /> Boka Lokal
            </Link>
            <Link href="/contact" onClick={() => setIsMobileOpen(false)} className="block px-4 py-3 text-lg font-bold text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3">
              <Phone className="w-5 h-5 opacity-70" /> {t("menu.contact" as any)}
            </Link>
            <Link href="/callback" onClick={() => setIsMobileOpen(false)} className="block px-4 py-3 text-lg font-bold text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3">
              <MessageSquare className="w-5 h-5 opacity-70" /> {t("menu.callback" as any)}
            </Link>
            
            <div className="h-px bg-white/10 my-2 mx-4"></div>
            
            {!session ? (
              <div className="space-y-3 pt-2">
                <Link href="/login" onClick={() => setIsMobileOpen(false)} className="block w-full text-center bg-white hover:bg-slate-100 text-morkbla text-lg font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm">
                  {t("menu.login" as any)}
                </Link>
                <Link href="/register" onClick={() => setIsMobileOpen(false)} className="block w-full text-center bg-white/10 hover:bg-white/20 text-white text-lg font-bold py-3.5 px-6 rounded-xl transition-all border border-white/20">
                  {t("menu.register" as any)}
                </Link>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <Link href={session === 'admin' ? '/admin' : '/profile'} onClick={() => setIsMobileOpen(false)} className="block px-4 py-3 text-lg font-bold text-ljusturkos hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3">
                  <User className="w-5 h-5" /> {session === 'admin' ? 'Admin Dashboard' : t('profile.title', 'Mina Sidor')}
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-lg font-bold text-red-400 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3">
                  <LogOut className="w-5 h-5" /> {t('menu.logout', 'Logga ut')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
