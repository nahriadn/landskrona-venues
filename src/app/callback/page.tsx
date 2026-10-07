import { cookies } from 'next/headers';
import { getTranslation } from '@/lib/i18n';

export default async function CallbackPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';
  const t = getTranslation(lang);

  return (
    <>
      <main className="container mx-auto px-4 lg:px-8 py-12 max-w-3xl flex-grow pb-24">
        <div className="bg-white rounded-3xl shadow-md border border-beige-200 p-8 md:p-12 mt-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-ljusturkos-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

          <h1 className="text-3xl md:text-4xl font-bold text-morkbla mb-4 tracking-tight relative z-10">{t("callback.title" as any)}</h1>
          <p className="text-slate-600 font-medium mb-10 text-lg relative z-10">
            {t("callback.subtitle" as any)}
          </p>

          <form className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t("callback.name" as any)}</label>
              <input type="text" className="w-full px-5 py-4 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white" placeholder={t("callback.name_ph" as any) as string} />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t("callback.phone" as any)}</label>
              <input type="tel" className="w-full px-5 py-4 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white" placeholder={t("callback.phone_ph" as any) as string} />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t("callback.time" as any)}</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border border-beige-300 rounded-xl cursor-pointer hover:bg-ljusturkos-50 transition-colors">
                  <input type="radio" name="time" className="w-5 h-5 text-morkbla focus:ring-morkbla border-slate-300" defaultChecked />
                  <span className="ml-3 font-semibold text-slate-700">{t("callback.time_am" as any)}</span>
                </label>
                <label className="flex items-center p-4 border border-beige-300 rounded-xl cursor-pointer hover:bg-ljusturkos-50 transition-colors">
                  <input type="radio" name="time" className="w-5 h-5 text-morkbla focus:ring-morkbla border-slate-300" />
                  <span className="ml-3 font-semibold text-slate-700">{t("callback.time_pm" as any)}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t("callback.reason" as any)}</label>
              <textarea rows={3} className="w-full px-5 py-4 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white resize-none" placeholder={t("callback.reason_ph" as any) as string}></textarea>
            </div>

            <button type="button" className="w-full bg-[#136377] hover:bg-[#0f4f60] text-white font-bold py-5 px-4 rounded-xl transition-all shadow-md text-lg mt-4 flex items-center justify-center">
              <img src="https://www.landskrona.se/icons/phone-bold.svg" className="w-6 h-6 mr-3 brightness-0 invert" alt="Phone" />
              {t("callback.submit" as any)}
            </button>
          </form>

        </div>
      </main>
    </>
  );
}
