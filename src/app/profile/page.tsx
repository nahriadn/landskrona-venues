import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const lang = cookieStore.get('lang')?.value || 'sv';
  const t = getTranslation(lang);
  
  if (session !== 'client' && session !== 'admin') {
    redirect('/login');
  }

  const user = session === 'admin' 
    ? { 
        name: lang === 'en' ? 'Admin Officer' : lang === 'da' ? 'Admin Officer' : 'Admin Handläggare', 
        email: 'admin@landskrona.se', 
        org: lang === 'en' ? 'Cultural Administration' : lang === 'da' ? 'Kulturforvaltningen' : 'Kulturförvaltningen', 
        type: lang === 'en' ? 'Municipal Operations' : lang === 'da' ? 'Kommunal Virksomhed' : 'Kommunal Verksamhet' 
      }
    : { 
        name: lang === 'en' ? 'Test Association' : lang === 'da' ? 'Test Forening' : 'Test Förening', 
        email: 'test.forening@gmail.com', 
        org: lang === 'en' ? 'Landskrona Sports Association' : lang === 'da' ? 'Landskrona Idrætsforening' : 'Landskrona Idrottsförening', 
        type: lang === 'en' ? 'Registered Association' : lang === 'da' ? 'Registreret Forening' : 'Registrerad Förening' 
      };

  // Fetch real bookings from DB
  const { data: dbBookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('type', 'public')
    .order('booked_at', { ascending: false })
    .limit(5);

  const { data: venues } = await supabase.from('venues').select('id, name');

  const getVenueName = (id: string) => {
    const v = venues?.find(v => v.id === id);
    return v ? v.name : id;
  };

  return (
    <main className="container mx-auto px-4 lg:px-8 py-12 max-w-5xl flex-grow">
      <h1 className="text-4xl font-bold text-morkbla-900 mb-8 tracking-tight">{t('profile.title', 'Mina Sidor')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-beige-200">
          <div className="w-20 h-20 bg-ljusturkos-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl font-bold text-morkbla">{user.name.charAt(0)}</span>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-1">{user.name}</h2>
          <p className="text-slate-500 font-medium mb-6">{user.email}</p>
          
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('profile.org', 'Organisation')}</p>
              <p className="font-semibold text-slate-700">{user.org}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('profile.type', 'Användartyp')}</p>
              <p className="font-semibold text-slate-700">{user.type}</p>
            </div>
          </div>

          <button className="w-full mt-8 py-3 px-4 border-2 border-morkbla text-morkbla hover:bg-morkbla hover:text-white font-bold rounded-xl transition-colors">
            {t('profile.edit', 'Redigera uppgifter')}
          </button>
        </div>

        {/* Bookings / Dashboard section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-beige-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{t('profile.bookings', 'Dina Kommande Bokningar')}</h2>
            
            <div className="space-y-4">
              {dbBookings && dbBookings.length > 0 ? dbBookings.map((booking: any) => (
                <div key={booking.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-slate-100 rounded-xl bg-slate-50">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-bold text-morkbla-900 text-lg capitalize">{booking.reason || t('admin.tab_bookings', 'Bokning')}</h3>
                    <p className="text-sm text-slate-500 flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {getVenueName(booking.venue_id)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 \${
                      booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status === 'approved' ? t('admin.status_approved', 'Godkänd') : 
                       booking.status === 'rejected' ? t('admin.status_rejected', 'Nekad') : 
                       t('admin.status_pending', 'Granskas')}
                    </span>
                    <p className="font-semibold text-slate-700">{booking.date}, {booking.slot_time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-slate-500">{t('admin.no_results_desc', 'Inga bokningar funna.')}</p>
              )}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-beige-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">{t('profile.cancel_title', 'Behöver du avboka?')}</h2>
            <p className="text-slate-600 mb-4 text-sm">{t('profile.cancel_desc', 'Avbokning måste ske senast 24 timmar innan hyrestillfället för att undvika avgift.')}</p>
            <button className="text-sm font-bold text-red-600 hover:underline">{t('profile.cancel_btn', 'Kontakta kundtjänst för avbokning')}</button>
          </div>
        </div>

      </div>
    </main>
  );
}
