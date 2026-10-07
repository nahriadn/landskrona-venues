'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/lib/i18n';
import { Lock } from 'lucide-react';

export default function BankIDSimulator({ lang }: { lang: string }) {
  const [state, setState] = useState<'idle' | 'qr' | 'loading' | 'success'>('idle');
  const t = getTranslation(lang);
  const router = useRouter();
  
  // Vault State
  const [showVault, setShowVault] = useState(false);
  const [vaultCode, setVaultCode] = useState('');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);

  const startLogin = () => setState('qr');
  
  const simulateAuth = () => {
    setState('loading');
    setTimeout(() => {
      setState('success');
      // Set the fake auth cookie for demo purposes
      document.cookie = "session=client; path=/";
      // Redirect after showing the message for 5 seconds
      setTimeout(() => {
        router.push('/profile');
        router.refresh();
      }, 5000);
    }, 2000);
  };

  const handleVaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vaultCode === '981030') {
      setIsVaultUnlocked(true);
      setShowVault(false);
    } else {
      alert(lang === 'en' ? 'Incorrect code' : 'Fel kod');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden p-8 md:p-10 flex flex-col items-center text-center relative">
      <img src="/BankID_logo.svg" alt="BankID" className="h-24 w-auto mb-8 object-contain" />
      
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
            className="bg-white p-3 border-4 border-[#136377] rounded-2xl inline-block mb-6 cursor-pointer hover:scale-105 transition-transform shadow-md" 
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
        <div className="flex flex-col items-center py-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">{t("auth.success" as any)}</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm font-medium mb-6 text-left">
            <span className="font-bold block mb-1">Demonstration</span>
            {lang === 'en' 
              ? 'This is a simulated BankID process. For production, integration with a certified BankID broker (e.g. Criipto, GrandID) is required.' 
              : 'Detta är en simulerad BankID-process. För produktion krävs integration med en certifierad BankID-mäklare (ex. Criipto, GrandID).'}
          </div>

          <p className="text-slate-500 text-sm font-medium animate-pulse">{t("auth.redirecting" as any)}</p>
        </div>
      )}

      {/* Demo Credentials Vault */}
      <div className="w-full mt-10 pt-6 border-t border-slate-100 flex flex-col items-center">
        {!isVaultUnlocked ? (
          <>
            <button onClick={() => setShowVault(!showVault)} className="p-2 text-slate-300 hover:text-morkbla transition-colors rounded-full hover:bg-slate-50" title="Unlock Presenter Tools">
              <Lock className="w-5 h-5" />
            </button>
            {showVault && (
              <form onSubmit={handleVaultSubmit} className="mt-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
                <input 
                  type="password" 
                  value={vaultCode}
                  onChange={(e) => setVaultCode(e.target.value)}
                  placeholder="PIN" 
                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-center text-sm focus:ring-2 focus:ring-morkbla outline-none"
                  autoFocus
                />
                <button type="submit" className="bg-morkbla text-white px-3 py-2 rounded-lg text-sm font-bold">Lås upp</button>
              </form>
            )}
          </>
        ) : (
          <div className="w-full animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Presenter Tools</p>
              <button onClick={() => setIsVaultUnlocked(false)} className="text-xs text-morkbla hover:underline font-bold">Lås</button>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => { document.cookie = "session=client; path=/"; router.push('/profile'); router.refresh(); }} className="w-full text-left px-5 py-4 bg-slate-50 hover:bg-ljusturkos-50 border border-slate-200 rounded-xl transition-colors group flex justify-between items-center">
                <div>
                  <p className="font-bold text-morkbla-900">{lang === 'en' ? 'Log in as Client' : 'Logga in som Klient'}</p>
                  <p className="text-xs text-slate-500">test.forening@gmail.com</p>
                </div>
              </button>
              <button onClick={() => { document.cookie = "session=admin; path=/"; router.push('/admin'); router.refresh(); }} className="w-full text-left px-5 py-4 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-xl transition-colors group flex justify-between items-center">
                <div>
                  <p className="font-bold text-red-900">{lang === 'en' ? 'Log in as Admin' : 'Logga in som Admin'}</p>
                  <p className="text-xs text-slate-500">admin@landskrona.se</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
