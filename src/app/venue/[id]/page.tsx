import BookingWidget from '@/components/BookingWidget';
import { getTranslation, getLocalizedVenues } from '@/lib/i18n';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';
  const t = getTranslation(lang);
  
  const dataFilePath = path.join(process.cwd(), 'src', 'data', 'venues.json');
  let venuesData = [];
  try {
    venuesData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  } catch(e) {
    console.error("Failed to read venues data", e);
  }

  const localizedVenues = getLocalizedVenues(venuesData, lang);
  
  const venue = localizedVenues.find(v => v.id === id);
  
  if (!venue) {
    notFound();
  }

  return (
    <>
      {/* Main Grid */}
      <main className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Venue Details */}
          <div className="lg:col-span-7 xl:col-span-8">
            <article className="bg-white rounded-2xl shadow-sm border border-beige-200 overflow-hidden">
              {/* Feature Image */}
              <div className="w-full h-72 md:h-96 relative">
                <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h2 className="absolute bottom-6 left-8 text-3xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">
                  {venue.name.split(' (')[0]}
                </h2>
              </div>
              
              <div className="p-8 md:p-10">
                
                {venue.capacity > 0 && (
                  <div className="inline-flex items-center text-morkbla mb-8 bg-ljusturkos-50 px-5 py-2 rounded-full text-sm font-bold border border-ljusturkos-200 uppercase tracking-widest shadow-sm">
                    <img src="https://www.landskrona.se/icons/business-deal-handshake.svg" className="w-5 h-5 mr-2 opacity-80" alt="Capacity" />
                    {t("venue.capacity" as any)} {venue.capacity}
                  </div>
                )}

                <div className="prose prose-lg text-slate-700 max-w-none mb-10 leading-relaxed font-medium">
                  <p>{venue.description}</p>
                </div>

                {venue.features && venue.features.length > 0 && (
                  <div className="bg-ljusturkos-50 p-6 md:p-8 rounded-xl border border-ljusturkos-200 mb-8">
                    <h3 className="font-bold text-morkbla mb-5 text-xl tracking-tight">{t("venue.features" as any)}</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {venue.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start text-morkbla-900 bg-white p-4 rounded-lg shadow-sm border border-ljusturkos-100">
                          <CheckCircle className="w-6 h-6 mr-3 text-morkbla opacity-70" />
                          <span className="font-semibold">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {venue.accessibility && venue.accessibility.length > 0 && (
                  <div className="mb-10">
                    <h3 className="font-bold text-slate-800 mb-4 text-xl tracking-tight">Tillgänglighet</h3>
                    <ul className="space-y-3">
                      {venue.accessibility.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start text-slate-700">
                          <CheckCircle className="w-5 h-5 mr-3 text-morkbla opacity-70 mt-0.5" />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {venue.rules && venue.rules.length > 0 && (
                  <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100 mb-8">
                    <h3 className="font-bold text-slate-800 mb-4 text-xl tracking-tight">Ordningsregler & Villkor</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 font-medium">
                      {venue.rules.map((rule: string, idx: number) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {venue.contact && (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <p className="text-slate-700 font-medium flex items-center">
                      <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      {venue.contact}
                    </p>
                  </div>
                )}

                {/* Optional Gallery Grid */}
                {venue.gallery && venue.gallery.length > 0 && (
                  <div className="mt-10">
                    <div className="grid grid-cols-2 gap-4">
                      {venue.gallery.map((imgUrl: string, i: number) => (
                        <img key={i} src={imgUrl} className="rounded-lg w-full h-48 object-cover shadow-sm border border-slate-200" alt="Gallery" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <BookingWidget venueId={venue.id} lang={lang} />
          </div>
        </div>
      </main>
    </>
  );
}
