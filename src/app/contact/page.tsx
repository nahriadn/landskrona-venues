import { cookies } from 'next/headers';
import { getTranslation } from '@/lib/i18n';

export default async function ContactPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';
  const t = getTranslation(lang);

  return (
    <>
      {/* Hero */}
      <section className="bg-morkbla text-white py-16 lg:py-24 relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-morkbla-900/20"></div>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t("contact.title" as any)}</h1>
          <p className="text-lg text-bla-100 max-w-2xl mx-auto font-medium">{t("contact.subtitle" as any)}</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-12 pb-24 max-w-7xl flex-grow -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Contact Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-beige-200 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-morkbla mb-8 tracking-tight">{t("contact.details_title" as any)}</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-ljusturkos-50 flex items-center justify-center mr-5 shrink-0">
                  <img src="https://www.landskrona.se/icons/maps.svg" className="w-6 h-6 opacity-70" alt="Adress" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{t("contact.visiting" as any)}</h3>
                  <p className="text-slate-600 mt-1 font-medium">Stadshuset, Drottninggatan 7</p>
                  <p className="text-slate-600 font-medium">261 80 Landskrona</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-ljusturkos-50 flex items-center justify-center mr-5 shrink-0">
                  <img src="https://www.landskrona.se/icons/network-phone.svg" className="w-6 h-6 opacity-70" alt="Telefon" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{t("contact.phone" as any)}</h3>
                  <p className="text-slate-600 mt-1 font-medium">0418-47 00 00</p>
                  <p className="text-sm text-slate-500 mt-1">{t("contact.phone_hours" as any)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-ljusturkos-50 flex items-center justify-center mr-5 shrink-0">
                  <img src="https://www.landskrona.se/icons/email-bold.svg" className="w-5 h-5 opacity-70" alt="E-post" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{t("contact.email" as any)}</h3>
                  <p className="text-slate-600 mt-1 font-medium">
                    <a href="mailto:kultur@landskrona.se" className="text-morkbla hover:underline">kultur@landskrona.se</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-beige-200 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-morkbla mb-8 tracking-tight">{t("contact.form_title" as any)}</h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t("contact.fname" as any)}</label>
                  <input type="text" className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t("contact.lname" as any)}</label>
                  <input type="text" className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t("contact.email_label" as any)}</label>
                <input type="email" className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t("contact.subject" as any)}</label>
                <select className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white">
                  <option>{t("contact.subject_opt1" as any)}</option>
                  <option>{t("contact.subject_opt2" as any)}</option>
                  <option>{t("contact.subject_opt3" as any)}</option>
                  <option>{t("contact.subject_opt4" as any)}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t("contact.message" as any)}</label>
                <textarea rows={4} className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white resize-none"></textarea>
              </div>

              <button type="button" className="w-full bg-morkbla hover:bg-morkbla-800 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md mt-4">
                {t("contact.send" as any)}
              </button>
            </form>
          </div>

        </div>
      </main>
    </>
  );
}
