import Link from 'next/link';
import { getTranslation, getLocalizedVenues } from '@/lib/i18n';
import { cookies } from 'next/headers';
import { Users, CheckCircle, ArrowRight, MapPin } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';
  const t = getTranslation(lang);
  
  // Read venues dynamically so CMS edits reflect immediately
  const dataFilePath = path.join(process.cwd(), 'src', 'data', 'venues.json');
  let venuesData = [];
  try {
    venuesData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  } catch(e) {
    console.error("Failed to read venues data", e);
  }

  const localizedVenues = getLocalizedVenues(venuesData, lang);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-morkbla-900 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cms.landskrona.se/wp-content/uploads/2023/02/landskrona-stadsbibliotek-1536x1018-1.jpeg" 
            alt="Landskrona Architecture" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-morkbla-900/95 to-morkbla/70 mix-blend-multiply"></div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10 flex flex-col items-center text-center">
          <span className="bg-morkbla-800/60 border border-morkbla-400/30 text-bla-100 text-sm font-semibold px-5 py-2 rounded-full mb-8 backdrop-blur-md shadow-sm uppercase tracking-widest">
            {t("hero.badge" as any, "Officiell Bokningsportal")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.15] text-white drop-shadow-md">
            {t("hero.title" as any)}
          </h2>
          <p className="text-lg md:text-xl text-bla-100/90 max-w-2xl font-medium leading-relaxed mb-4">
            {t("hero.subtitle" as any)}
          </p>
        </div>
      </section>

      {/* Main Content - Venue Cards */}
      <main className="container mx-auto px-4 lg:px-8 py-16 max-w-7xl -mt-12 relative z-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-10">
          {localizedVenues.map((venue) => (
            <article 
              key={venue.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group border border-beige-200"
              aria-labelledby={`venue-title-${venue.id}`}
            >
              {/* Image Header */}
              <div className="h-64 relative overflow-hidden bg-beige-200">
                <img 
                  src={venue.imageUrl} 
                  alt={venue.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-morkbla-900/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-5 left-6 right-6">
                  <h3 id={`venue-title-${venue.id}`} className="text-3xl font-bold text-white drop-shadow-md">
                    {venue.name.split(' (')[0]}
                  </h3>
                  <p className="text-beige-100 text-sm font-medium flex items-center mt-1.5 drop-shadow">
                    <img src="https://www.landskrona.se/icons/maps.svg" className="w-4 h-4 mr-1 brightness-0 invert opacity-90" alt="Map" />
                    {venue.name.split(' (')[1]?.replace(')', '') || 'Landskrona'}
                  </p>
                </div>
              </div>
              
              {/* Content Body */}
              <div className="p-6 lg:p-8 flex-grow flex flex-col">
                
                {venue.capacity > 0 && (
                  <div className="flex items-center text-morkbla mb-5 bg-ljusturkos-50 px-4 py-2 rounded-lg text-sm font-semibold border border-ljusturkos-200 w-fit">
                    <Users className="w-4 h-4 mr-2 text-morkbla" />
                    {t("venue.capacity" as any)} {venue.capacity}
                  </div>
                )}
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {venue.description}
                </p>

                {/* Features List */}
                <div className="mt-auto">
                  {venue.features && venue.features.length > 0 ? (
                    <div className="mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                        {t("venue.features" as any)}
                      </span>
                      <ul className="space-y-3">
                        {venue.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-center text-sm font-medium text-slate-700">
                            <CheckCircle className="w-4 h-4 mr-3 text-morkbla-500 flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="mb-2 h-[88px] flex items-center text-sm text-slate-400 italic"></div> 
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              <div className="p-6 pt-0 mt-auto">
                <Link 
                  href={`/venue/${venue.id}`}
                  className="w-full bg-morkbla text-white py-4 px-4 rounded-xl font-bold text-lg hover:bg-morkbla-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-morkbla focus:ring-offset-2 transition-all duration-200 flex justify-center items-center group/btn"
                  aria-label={`${t("venue.book_button" as any)} - ${venue.name}`}
                >
                  {t("venue.book_button" as any)}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
