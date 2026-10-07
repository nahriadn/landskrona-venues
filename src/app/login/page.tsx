import BankIDSimulator from '@/components/BankIDSimulator';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslation } from '@/lib/i18n';
import Link from 'next/link';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';
  const t = getTranslation(lang);

  async function simulateEmailLogin() {
    'use server';
    const cookiesList = await cookies();
    cookiesList.set('session', 'client', { path: '/' });
    redirect('/profile');
  }

  return (
    <div className="flex-grow relative flex flex-col bg-beige">
      {/* Decorative Hero Background (Matches Main Page) */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-morkbla-900 z-0 overflow-hidden">
        <img 
          src="https://cms.landskrona.se/wp-content/uploads/2023/02/landskrona-stadsbibliotek-1536x1018-1.jpeg" 
          alt="" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-morkbla-900/50 to-beige"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 lg:py-16 max-w-5xl flex-grow flex flex-col justify-center">
        
        <div className="text-center mb-12">
          <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 inline-block backdrop-blur-md uppercase tracking-widest shadow-sm">
            {lang === 'en' ? 'Secure Authentication' : lang === 'da' ? 'Sikker Godkendelse' : 'Säker Inloggning'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-morkbla-900 drop-shadow-sm mb-4 tracking-tight">
            {lang === 'en' ? 'Welcome back' : lang === 'da' ? 'Velkommen tilbage' : 'Välkommen tillbaka'}
          </h1>
          <p className="text-slate-600/90 text-lg font-medium max-w-xl mx-auto">
            {lang === 'en' ? 'Choose how you want to log in to Landskrona Venues' : lang === 'da' ? 'Vælg hvordan du vil logge ind på Landskrona Lokaler' : 'Välj hur du vill logga in på Landskrona Lokaler'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-stretch relative">
          
          {/* Vertical OR Badge Divider for Desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-beige-200 rounded-full items-center justify-center z-20 shadow-sm">
            <span className="text-xs font-bold text-slate-400">
              {lang === 'en' ? 'OR' : lang === 'da' ? 'EL' : 'ELLER'}
            </span>
          </div>

          {/* Left Card: BankID */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-beige-200 overflow-hidden flex flex-col relative group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-ljusturkos group-hover:bg-morkbla transition-colors"></div>
            <div className="p-8 md:p-10 flex-grow flex flex-col items-center">
              <div className="mb-6 text-center">
                <span className="inline-block bg-ljusturkos-50 text-morkbla-900 border border-ljusturkos-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  {lang === 'en' ? 'Recommended' : lang === 'da' ? 'Anbefalet' : 'Rekommenderas'}
                </span>
                <h2 className="text-2xl font-bold text-slate-800">
                  {lang === 'en' ? 'Log in with BankID' : lang === 'da' ? 'Log ind med BankID' : 'Logga in med BankID'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  {lang === 'en' ? 'Fast and secure for Swedish citizens and corporate signatories.' : lang === 'da' ? 'Hurtigt og sikkert for svenske borgere og tegningsberettigede.' : 'Snabbt och säkert för privatpersoner och firmatecknare.'}
                </p>
              </div>
              <div className="w-full flex-grow flex flex-col justify-center">
                <BankIDSimulator lang={lang} />
              </div>
            </div>
          </div>

          {/* Right Card: Email/Password */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-beige-200 overflow-hidden flex flex-col relative group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-300 group-hover:bg-slate-400 transition-colors"></div>
            <div className="p-8 md:p-10 flex-grow flex flex-col">
              <div className="mb-8 text-center">
                <div className="inline-block h-6 mb-3"></div> {/* Spacer to align titles */}
                <h2 className="text-2xl font-bold text-slate-800">
                  {lang === 'en' ? 'Log in with Email' : lang === 'da' ? 'Log ind med E-mail' : 'Logga in med E-post'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  {lang === 'en' ? 'For international users, guest speakers, or those without BankID.' : lang === 'da' ? 'For internationale brugere eller dem uden BankID.' : 'För internationella användare eller för dig som saknar svenskt BankID.'}
                </p>
              </div>
              
              <div className="w-full flex-grow flex flex-col justify-center">
                <form className="space-y-5" action={simulateEmailLogin}>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      {lang === 'en' ? 'Email address' : lang === 'da' ? 'E-mailadresse' : 'E-postadress'}
                    </label>
                    <input 
                      type="email" 
                      placeholder="namn@exempel.se" 
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-bold text-slate-700">
                        {lang === 'en' ? 'Password' : lang === 'da' ? 'Adgangskode' : 'Lösenord'}
                      </label>
                      <a href="#" className="text-xs font-bold text-morkbla hover:underline">
                        {lang === 'en' ? 'Forgot password?' : lang === 'da' ? 'Glemt adgangskode?' : 'Glömt lösenordet?'}
                      </a>
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800 font-medium"
                    />
                  </div>
                  
                  <div className="pt-6">
                    <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md active:scale-[0.98]">
                      {lang === 'en' ? 'Log In' : lang === 'da' ? 'Log ind' : 'Logga in'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500 font-medium">
                    {lang === 'en' ? "Don't have an account?" : lang === 'da' ? 'Har du ikke en konto?' : 'Saknar du konto?'}
                    <Link href="/register" className="ml-2 font-bold text-morkbla hover:underline">
                      {lang === 'en' ? 'Create one here' : lang === 'da' ? 'Opret en her' : 'Skapa ett här'}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
