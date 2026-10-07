'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguagePicker from './LanguagePicker';
import HamburgerMenu from './HamburgerMenu';

export default function SiteHeader({ lang, tBack, session }: { lang: string, tBack: string, session?: string }) {
  const pathname = usePathname();
  const isVenuePage = pathname.startsWith('/venue/');

  return (
    <header className="bg-morkbla py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <img src="https://www.landskrona.se/static/Logo-42a3cc36d82d4d2766e9f7c0358f2eda.svg" alt="Landskrona stad" className="h-8 md:h-10" />
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <LanguagePicker currentLang={lang} />
          {isVenuePage && (
            <Link 
              href="/" 
              className="text-white hover:text-bla-100 transition-colors flex items-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white rounded p-1 mr-1" 
              aria-label="Back"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span className="hidden sm:inline">{tBack}</span>
            </Link>
          )}
          <HamburgerMenu lang={lang} session={session} />
        </div>
      </div>
    </header>
  );
}
