'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/lib/i18n';

export default function BankIDSimulator({ lang = 'sv' }: { lang?: string }) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'qr' | 'loading' | 'success'>('idle');
  const t = getTranslation(lang);

  const startLogin = () => setState('qr');
  
  const simulateAuth = () => {
    setState('loading');
    setTimeout(() => {
      setState('success');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }, 3000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden p-8 md:p-10 flex flex-col items-center text-center">
      <img 
        src="/BankID_logo.svg" 
        alt="BankID" 
        className="h-24 w-auto mb-8 object-contain" 
      />
      
      {state === 'idle' && (
        <div className="w-full animate-in fade-in duration-300">
          <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">{t("auth.title" as any)}</h2>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">{t("auth.subtitle" as any)}</p>
          <button onClick={startLogin} className="w-full flex items-center justify-center gap-3 bg-[#136377] hover:bg-[#0f4f60] text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md focus:ring-4 focus:ring-[#136377]/30">
            <img src="/BankID_logo_white.svg" alt="" className="h-6 w-auto object-contain" />
            {t("auth.mobile" as any)}
          </button>
          <button className="w-full mt-4 flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-4 px-4 rounded-xl border-2 border-slate-200 transition-all focus:ring-4 focus:ring-slate-100">
            <img src="/BankID_logo.svg" alt="" className="h-6 w-auto object-contain" />
            {t("auth.device" as any)}
          </button>
        </div>
      )}

      {state === 'qr' && (
        <div className="w-full animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">{t("auth.start" as any)}</h2>
          <div 
            className="bg-white p-3 border-4 border-[#136377] rounded-2xl inline-block mb-6 cursor-pointer hover:scale-105 transition-transform" 
            onClick={simulateAuth}
            title="Simulate scan"
          >
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=bankid-mock" alt="QR Code" className="opacity-90" />
          </div>
          <p className="text-slate-600 font-medium">{t("auth.scan" as any)}</p>
          <p className="text-xs text-slate-400 mt-2">{t("auth.prototype" as any)}</p>
          <button onClick={() => setState('idle')} className="mt-8 text-sm font-bold text-morkbla hover:underline">{t("auth.cancel" as any)}</button>
        </div>
      )}

      {state === 'loading' && (
        <div className="flex flex-col items-center py-10 animate-in fade-in duration-300">
          <div className="w-14 h-14 border-4 border-[#136377]/20 border-t-[#136377] rounded-full animate-spin mb-8"></div>
          <h2 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">{t("auth.waiting" as any)}</h2>
          <p className="text-slate-500 font-medium">{t("auth.open" as any)}</p>
        </div>
      )}

      {state === 'success' && (
        <div className="flex flex-col items-center py-10 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{t("auth.success" as any)}</h2>
          <p className="text-slate-500 mt-3 font-medium">{t("auth.redirecting" as any)}</p>
        </div>
      )}

      {/* Demo Credentials Section (For Presentation Purposes) */}
      <div className="w-full mt-10 pt-8 border-t border-slate-100 text-left">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Demonstration</p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              document.cookie = `session=client; path=/; max-age=86400`;
              router.push('/profile');
            }}
            className="w-full text-left px-5 py-4 bg-slate-50 hover:bg-ljusturkos-50 border border-slate-200 rounded-xl transition-colors group flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-morkbla-900">{lang === 'en' ? 'Log in as Association / Client' : lang === 'da' ? 'Log ind som Forening / Klient' : 'Logga in som Förening / Klient'}</p>
              <p className="text-xs text-slate-500">test.forening@gmail.com</p>
            </div>
            <svg className="w-5 h-5 text-slate-400 group-hover:text-morkbla" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          <button 
            onClick={() => {
              document.cookie = `session=admin; path=/; max-age=86400`;
              router.push('/admin');
            }}
            className="w-full text-left px-5 py-4 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-xl transition-colors group flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-red-900">{lang === 'en' ? 'Log in as Administrator' : lang === 'da' ? 'Log ind som Administrator' : 'Logga in som Administratör'}</p>
              <p className="text-xs text-slate-500">Kulturförvaltningen (admin@landskrona.se)</p>
            </div>
            <svg className="w-5 h-5 text-slate-400 group-hover:text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
