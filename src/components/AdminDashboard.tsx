'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, Users, ChevronRight, Search, FileText, Settings, Plus, Edit2, Trash2, Save, Ban } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';
import mockBookingsData from '@/data/bookings.json';

export default function AdminDashboard({ lang = 'sv' }: { lang?: string }) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'venues' | 'block'>('bookings');
  
  // Bookings State
  const [bookings, setBookings] = useState(mockBookingsData);
  const [filter, setFilter] = useState('all');
  
  // Venues CMS State
  const [venues, setVenues] = useState<any[]>([]);
  const [editingVenue, setEditingVenue] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const t = getTranslation(lang);

  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => setVenues(data))
      .catch(err => console.error("Failed to load venues", err));
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const saveVenues = async (updatedVenues: any[]) => {
    setIsSaving(true);
    try {
      await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedVenues)
      });
      setVenues(updatedVenues);
      setEditingVenue(null);
    } catch (err) {
      alert(t('admin.err_save', 'Kunde inte spara lokalerna.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewVenue = () => {
    const newId = `lokal-${Date.now()}`;
    const newVenue = {
      id: newId,
      name: t('admin.new_venue_name', 'Ny Lokal') as string,
      description: t('admin.new_venue_desc', 'Beskrivning av den nya lokalen...') as string,
      capacity: 50,
      price: 0,
      imageUrl: "https://www.landskrona.se/static/Krona-a64d03cf5f50a5558970d089cc0048de.png",
      features: []
    };
    setEditingVenue(newVenue);
  };

  const handleSaveVenueEdit = () => {
    if (!editingVenue) return;
    
    let updated = [...venues];
    const exists = updated.findIndex(v => v.id === editingVenue.id);
    if (exists >= 0) {
      updated[exists] = editingVenue;
    } else {
      updated.push(editingVenue);
    }
    saveVenues(updated);
  };

  const handleDeleteVenue = (id: string) => {
    if (confirm(t('admin.confirm_delete', 'Är du säker på att du vill ta bort denna lokal?'))) {
      const updated = venues.filter(v => v.id !== id);
      saveVenues(updated);
    }
  };

  const getVenueName = (id: string) => venues.find(v => v.id === id)?.name || id;

  const filteredBookings = bookings.filter(b => filter === 'all' ? true : b.status === filter);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl flex-grow pb-24">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-morkbla tracking-tight">{t("admin.title" as any)}</h1>
          <p className="text-slate-600 font-medium mt-1 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
            {t("admin.logged_in" as any)}
          </p>
        </div>
        <div className="flex bg-beige-200 p-1 rounded-xl shadow-inner overflow-x-auto">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'bookings' ? 'bg-white text-morkbla shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <Calendar className="w-4 h-4" /> {t('admin.tab_bookings', 'Bokningar')}
          </button>
          <button 
            onClick={() => setActiveTab('venues')}
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'venues' ? 'bg-white text-morkbla shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <Settings className="w-4 h-4" /> {t('admin.tab_venues', 'Lokaler (CMS)')}
          </button>
          <button 
            onClick={() => setActiveTab('block')}
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'block' ? 'bg-white text-morkbla shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <Ban className="w-4 h-4" /> {t('admin.block_tab', 'Spärra Tider')}
          </button>
        </div>
      </div>

      {activeTab === 'bookings' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
            <div className="bg-white p-7 rounded-2xl border border-beige-200 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-semibold text-xs mb-2 uppercase tracking-widest">{t("admin.kpi_new" as any)}</p>
                <h3 className="text-4xl font-bold text-slate-800">{pendingCount}</h3>
              </div>
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border border-amber-100">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-7 rounded-2xl border border-beige-200 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-semibold text-xs mb-2 uppercase tracking-widest">{t("admin.kpi_approved" as any)}</p>
                <h3 className="text-4xl font-bold text-slate-800">12</h3>
              </div>
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-7 rounded-2xl border border-beige-200 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-semibold text-xs mb-2 uppercase tracking-widest">{t("admin.kpi_occupancy" as any)}</p>
                <h3 className="text-4xl font-bold text-slate-800">68%</h3>
              </div>
              <div className="w-14 h-14 bg-ljusturkos-50 text-morkbla rounded-full flex items-center justify-center border border-ljusturkos-200">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Bookings Management Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-beige-200 overflow-hidden relative z-10">
            <div className="p-6 md:p-8 border-b border-beige-200 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-slate-50/50">
              <h2 className="text-xl font-bold text-morkbla flex items-center">
                {t("admin.table_title" as any)}
                <span className="ml-3 bg-morkbla text-white text-xs py-0.5 px-2 rounded-full font-bold">{bookings.length}</span>
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-auto">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder={t("admin.search" as any) as string} className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-beige-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-morkbla focus:border-morkbla shadow-sm" />
                </div>
                <div className="flex bg-beige-100 p-1 rounded-lg w-full sm:w-auto shadow-inner">
                  <button onClick={() => setFilter('all')} className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${filter === 'all' ? 'bg-white text-morkbla shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t("admin.filter_all" as any)}</button>
                  <button onClick={() => setFilter('pending')} className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${filter === 'pending' ? 'bg-white text-morkbla shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    {t("admin.filter_pending" as any)} {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-slate-400 text-xs uppercase tracking-widest border-b border-beige-100">
                    <th className="p-5 pl-6 md:pl-8 font-semibold">{t("admin.col_booking" as any)}</th>
                    <th className="p-5 font-semibold">{t("admin.col_user" as any)}</th>
                    <th className="p-5 font-semibold">{t("admin.col_venue" as any)}</th>
                    <th className="p-5 font-semibold text-center">{t("admin.col_status" as any)}</th>
                    <th className="p-5 pr-6 md:pr-8 font-semibold text-right">{t("admin.col_action" as any)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige-100 bg-white">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="p-5 pl-6 md:pl-8">
                        <div className="font-bold text-slate-800 tracking-tight">{booking.id}</div>
                        <div className="text-sm text-slate-500 mt-1 font-medium">{booking.date} &bull; {booking.slotTime}</div>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-slate-800 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-slate-400" />
                          {booking.user}
                        </div>
                        <div className="text-sm text-slate-500 mt-1 truncate max-w-[250px]">{booking.purpose}</div>
                      </td>
                      <td className="p-5">
                        <span className="bg-ljusturkos-50 text-morkbla-900 px-3 py-1.5 rounded-lg text-xs font-bold border border-ljusturkos-100 whitespace-nowrap">
                          {getVenueName(booking.venueId)}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        {booking.status === 'pending' && <span className="inline-flex items-center text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-200/50 shadow-sm"><Clock className="w-3.5 h-3.5 mr-1.5" /> {t("admin.status_pending" as any)}</span>}
                        {booking.status === 'approved' && <span className="inline-flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-200/50 shadow-sm"><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> {t("admin.status_approved" as any)}</span>}
                        {booking.status === 'rejected' && <span className="inline-flex items-center text-red-700 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-200/50 shadow-sm"><XCircle className="w-3.5 h-3.5 mr-1.5" /> {t("admin.status_rejected" as any)}</span>}
                      </td>
                      <td className="p-5 pr-6 md:pr-8 text-right">
                        {booking.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleStatusChange(booking.id, 'approved')} className="p-2 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white rounded-lg transition-all shadow-sm"><CheckCircle className="w-5 h-5" /></button>
                            <button onClick={() => handleStatusChange(booking.id, 'rejected')} className="p-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition-all shadow-sm"><XCircle className="w-5 h-5" /></button>
                          </div>
                        ) : (
                          <button className="text-slate-400 hover:text-morkbla transition-colors font-bold text-sm flex items-center justify-end w-full">
                            {t("admin.action_manage" as any)} <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'venues' && (
        <div className="bg-white rounded-2xl shadow-sm border border-beige-200 overflow-hidden relative z-10">
          <div className="p-6 md:p-8 border-b border-beige-200 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-slate-50/50">
            <h2 className="text-xl font-bold text-morkbla flex items-center">
              Hantera {t('admin.tab_venues', 'Lokaler (CMS)')}
              <span className="ml-3 bg-morkbla text-white text-xs py-0.5 px-2 rounded-full font-bold">{venues.length}</span>
            </h2>
            <button onClick={handleAddNewVenue} className="bg-[#136377] hover:bg-[#0f4f60] text-white font-bold py-2.5 px-5 rounded-lg flex items-center transition-all shadow-sm">
              <Plus className="w-5 h-5 mr-2" /> {t('admin.add_venue', 'Lägg till ny lokal')}
            </button>
          </div>

          <div className="p-6 md:p-8">
            {editingVenue ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-bold text-slate-800 mb-4">{editingVenue.id.startsWith('lokal-') ? t('admin.create_venue', 'Skapa ny lokal') : t('admin.edit_venue', 'Redigera lokal')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t('admin.f_name', 'Namn')}</label>
                    <input type="text" value={editingVenue.name} onChange={e => setEditingVenue({...editingVenue, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-morkbla outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t('admin.f_image', 'Bild-URL')}</label>
                    <input type="text" value={editingVenue.imageUrl} onChange={e => setEditingVenue({...editingVenue, imageUrl: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-morkbla outline-none" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t('admin.f_desc', 'Beskrivning')}</label>
                  <textarea rows={3} value={editingVenue.description} onChange={e => setEditingVenue({...editingVenue, description: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-morkbla outline-none resize-none"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t('admin.f_capacity', 'Kapacitet (antal pers)')}</label>
                    <input type="number" value={editingVenue.capacity} onChange={e => setEditingVenue({...editingVenue, capacity: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-morkbla outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t('admin.f_price', 'Pris (kr)')}</label>
                    <input type="number" value={editingVenue.price || 0} onChange={e => setEditingVenue({...editingVenue, price: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-morkbla outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button onClick={() => setEditingVenue(null)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors">{t('admin.btn_cancel', 'Avbryt')}</button>
                  <button onClick={handleSaveVenueEdit} disabled={isSaving} className="px-5 py-2.5 bg-morkbla text-white font-bold hover:bg-morkbla-800 rounded-lg transition-colors flex items-center">
                    {isSaving ? t('admin.btn_saving', 'Sparar...') : <><Save className="w-4 h-4 mr-2" /> {t('admin.btn_save', 'Spara ändringar')}</>}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {venues.map(venue => (
                <div key={venue.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col">
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex-grow">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{venue.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{venue.description}</p>
                    <div className="flex items-center text-xs font-semibold text-slate-500 bg-slate-50 p-2 rounded-lg inline-block">
                      {t('admin.lbl_capacity', 'Kapacitet: ')}{venue.capacity} {t('admin.lbl_pers', 'pers')}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-between">
                    <button onClick={() => setEditingVenue(venue)} className="text-[#136377] hover:text-[#0f4f60] font-bold text-sm flex items-center transition-colors">
                      <Edit2 className="w-4 h-4 mr-1.5" /> Redigera
                    </button>
                    <button onClick={() => handleDeleteVenue(venue.id)} className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center transition-colors">
                      <Trash2 className="w-4 h-4 mr-1.5" /> Ta bort
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'block' && (
        <div className="bg-white rounded-2xl shadow-sm border border-beige-200 overflow-hidden relative z-10 max-w-3xl">
          <div className="p-6 md:p-8 border-b border-beige-200 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-slate-50/50">
            <h2 className="text-xl font-bold text-morkbla flex items-center">
              {t('admin.block_title', 'Spärra Tider / Blockera Datum')}
            </h2>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-slate-600 mb-6">{t('admin.block_desc', 'Använd detta formulär för att spärra utvalda tider i bokningsportalen för underhåll eller interna evenemang.')}</p>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert(t('admin.success_block', 'Tiden har spärrats!')); }}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('admin.b_select_venue', 'Välj Lokal')}</label>
                <select className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none text-slate-800 bg-slate-50 focus:bg-white">
                  <option value="">{t('admin.b_select', 'Välj...')}</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('admin.b_date', 'Datum')}</label>
                  <input type="date" required className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none text-slate-800 bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('admin.b_timeslot', 'Tidslucka')}</label>
                  <select required className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none text-slate-800 bg-slate-50 focus:bg-white">
                    <option value="">{t('admin.b_select_time', 'Välj tid...')}</option>
                    <option value="08:00 - 12:00">{t('admin.b_morning', 'Förmiddag (08:00 - 12:00)')}</option>
                    <option value="13:00 - 17:00">{t('admin.b_afternoon', 'Eftermiddag (13:00 - 17:00)')}</option>
                    <option value="18:00 - 22:00">{t('admin.b_evening', 'Kväll (18:00 - 22:00)')}</option>
                    <option value="all">{t('admin.b_fullday', 'Heldag')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('admin.b_reason', 'Anledning (Intern anteckning)')}</label>
                <input type="text" placeholder={t('admin.b_reason_ph', 'T.ex. Renovering, internt möte...') as string} required className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none text-slate-800 bg-slate-50 focus:bg-white" />
              </div>
              <button type="submit" className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm flex items-center justify-center">
                <Ban className="w-5 h-5 mr-2" /> Spärra vald tid
              </button>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
