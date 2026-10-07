'use client';
import { useState, useEffect } from 'react';
import { Calendar, Settings, FileText, Ban, Download, CheckCircle, XCircle, ChevronRight, Plus, Trash2, Save, Upload } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

// Helper modal
function CustomModal({ isOpen, type, title, message, onConfirm, onCancel, confirmText, cancelText }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 \${type === 'confirm' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
            {type === 'confirm' ? <Settings className="w-8 h-8" /> : <Ban className="w-8 h-8" />}
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title || (type === 'confirm' ? 'Bekräfta' : 'Oops!')}</h3>
          <p className="text-slate-600 mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            {type === 'confirm' && (
              <button onClick={onCancel} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 px-6 rounded-xl transition-colors">
                {cancelText || 'Avbryt'}
              </button>
            )}
            <button onClick={onConfirm} className={`font-bold py-2.5 px-6 rounded-xl transition-colors \${type === 'confirm' ? 'bg-morkbla text-white hover:bg-morkbla-900' : 'w-full bg-slate-800 hover:bg-slate-900 text-white'}`}>
              {confirmText || 'OK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ lang = 'sv' }: { lang?: string }) {
  const t = getTranslation(lang);
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Custom Modal State
  const [modal, setModal] = useState<{isOpen: boolean, type: 'alert'|'confirm', title?: string, message: string, onConfirm?: () => void, onCancel?: () => void}>({isOpen: false, type: 'alert', message: ''});
  const showAlert = (msg: string, title?: string) => setModal({isOpen: true, type: 'alert', title, message: msg, onConfirm: () => setModal(m => ({...m, isOpen: false}))});
  const showConfirm = (msg: string, onConfirm: () => void, title?: string) => setModal({isOpen: true, type: 'confirm', title, message: msg, onConfirm: () => { onConfirm(); setModal(m => ({...m, isOpen: false})); }, onCancel: () => setModal(m => ({...m, isOpen: false}))});

  const [bookings, setBookings] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/admin/bookings').then(res => res.json()).then(data => setBookings(data.bookings || [])).catch(err => console.error(err));
    fetch('/api/venues').then(res => res.json()).then(data => setVenues(data || [])).catch(console.error);
  }, []);

  const [editingVenue, setEditingVenue] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleStatusChange = (id: string, newStatus: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    const booking = bookings.find(b => b.id === id);
    if (booking && booking.id.startsWith('REQ-')) {
      fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reqId: booking.id, status: newStatus })
      }).catch(console.error);
    }
  };

  const handleSaveVenue = async () => {
    if (!editingVenue) return;
    setIsSaving(true);
    try {
      const existing = venues.findIndex(v => v.id === editingVenue.id);
      const updatedVenues = [...venues];
      if (existing >= 0) {
        updatedVenues[existing] = editingVenue;
      } else {
        updatedVenues.push(editingVenue);
      }
      
      const res = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedVenues),
      });
      if (!res.ok) throw new Error();
      setVenues(updatedVenues);
      setEditingVenue(null);
    } catch (e) {
      showAlert(t('admin.err_save', 'Kunde inte spara lokalerna.') as string);
    }
    setIsSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingVenue) return;
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `\${Math.random()}.\${fileExt}`;
      const { data, error } = await supabase.storage.from('venues').upload(fileName, file);
      
      if (error) throw error;
      
      if (data) {
        const { data: publicUrlData } = supabase.storage.from('venues').getPublicUrl(fileName);
        setEditingVenue({ ...editingVenue, imageUrl: publicUrlData.publicUrl });
      }
    } catch (err: any) {
      showAlert("Image upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVenue = (id: string) => {
    showConfirm(t('admin.confirm_delete', 'Är du säker på att du vill ta bort denna lokal?') as string, async () => {
      const updatedVenues = venues.filter(v => v.id !== id);
      try {
        await fetch('/api/venues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedVenues),
        });
        setVenues(updatedVenues);
      } catch (e) {
        showAlert("Kunde inte ta bort lokal.");
      }
    });
  };

  const [filter, setFilter] = useState('all');
  const filteredBookings = filter === 'pending' ? bookings.filter(b => b.status === 'pending') : bookings;

  return (
    <main className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-7xl">
      <CustomModal {...modal} />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-5">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Admin Profile" 
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-morkbla-900 tracking-tight">{t('admin.title', 'Personalinloggning')}</h1>
            <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              {t('admin.logged_in', 'Inloggad som Handläggare (Kulturförvaltningen)')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-100/50 p-2 rounded-2xl flex overflow-x-auto mb-8 shadow-inner no-scrollbar">
        <button onClick={() => setActiveTab('bookings')} className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap \${activeTab === 'bookings' ? 'bg-white text-morkbla shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
          <Calendar className="w-4 h-4" /> {t('admin.tab_bookings', 'Bokningar')}
        </button>
        <button onClick={() => setActiveTab('venues')} className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap \${activeTab === 'venues' ? 'bg-white text-morkbla shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
          <Settings className="w-4 h-4" /> {t('admin.tab_venues', 'Lokaler (CMS)')}
        </button>
        <button onClick={() => setActiveTab('block')} className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap \${activeTab === 'block' ? 'bg-white text-morkbla shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
          <Ban className="w-4 h-4" /> {t('admin.block_tab', 'Spärra Tider')}
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-morkbla flex items-center">
              <FileText className="w-5 h-5 mr-3 text-ljusturkos" />
              {t('admin.table_title', 'Inkommande Bokningsförfrågningar')}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {t('admin.filter_all', 'Alla')}
              </button>
              <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${filter === 'pending' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {t('admin.filter_pending', 'Obehandlade')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-widest text-slate-500 font-bold">
                  <th className="p-5 pl-8">{t('admin.col_booking', 'Boknings-ID')}</th>
                  <th className="p-5">{t('admin.col_user', 'Användare / Syfte')}</th>
                  <th className="p-5">{t('admin.col_venue', 'Lokal & Tid')}</th>
                  <th className="p-5">{t('admin.col_status', 'Status')}</th>
                  <th className="p-5 text-right pr-8">{t('admin.col_action', 'Åtgärd')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                      {t('admin.no_results_desc', 'Kunde inte hitta några bokningar som matchar ditt valda filter.')}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5 pl-8 text-sm font-semibold text-slate-700">{booking.id}</td>
                      <td className="p-5">
                        <div className="font-bold text-slate-800">{booking.user}</div>
                        <div className="text-sm text-slate-500 mt-0.5">{booking.purpose}</div>
                      </td>
                      <td className="p-5">
                        <div className="font-semibold text-slate-800">{venues.find(v => v.id === booking.venueId)?.name || booking.venueId}</div>
                        <div className="text-sm text-slate-500 mt-0.5">{booking.date} | {booking.slotTime}</div>
                      </td>
                      <td className="p-5">
                        {booking.status === 'pending' && <span className="inline-flex items-center text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200/50 shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></span> {t('admin.status_pending', 'Granskas')}</span>}
                        {booking.status === 'approved' && <span className="inline-flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-200/50 shadow-sm"><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> {t('admin.status_approved', 'Godkänd')}</span>}
                        {booking.status === 'rejected' && <span className="inline-flex items-center text-red-700 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-200/50 shadow-sm"><XCircle className="w-3.5 h-3.5 mr-1.5" /> {t('admin.status_rejected', 'Avslagen')}</span>}
                      </td>
                      <td className="p-5 text-right pr-8">
                        {booking.status === 'pending' ? (
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleStatusChange(booking.id, 'approved')} className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                              {t('admin.action_approve', 'Godkänn')}
                            </button>
                            <button onClick={() => handleStatusChange(booking.id, 'rejected')} className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                              {t('admin.action_reject', 'Neka')}
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => handleStatusChange(booking.id, 'pending')} className="text-sm font-bold text-slate-400 hover:text-morkbla transition-colors flex items-center justify-end w-full">
                            {t('admin.action_manage', 'Hantera')} <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'venues' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-morkbla flex items-center">
              <Settings className="w-5 h-5 mr-3 text-ljusturkos" />
              Hantera {t('admin.tab_venues', 'Lokaler (CMS)')}
            </h2>
            <button 
              onClick={() => {
                const newId = `lokal-\${Date.now()}`;
                setEditingVenue({
                  id: newId,
                  name: t('admin.new_venue_name', 'Ny Lokal') as string,
                  description: t('admin.new_venue_desc', 'Beskrivning av den nya lokalen...') as string,
                  imageUrl: '', capacity: 50, price: 0,
                  features: [], accessibility: [], rules: [], contact: ''
                });
              }}
              className="bg-morkbla hover:bg-morkbla-900 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm flex items-center text-sm"
            >
              <Plus className="w-5 h-5 mr-2" /> {t('admin.add_venue', 'Lägg till ny lokal')}
            </button>
          </div>

          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-3">
              {venues.map(venue => (
                <button 
                  key={venue.id}
                  onClick={() => setEditingVenue(venue)}
                  className={`w-full text-left p-4 rounded-xl border transition-all \${editingVenue?.id === venue.id ? 'border-morkbla bg-slate-50 ring-2 ring-morkbla/10 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <h3 className="font-bold text-slate-800">{venue.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{venue.description}</p>
                </button>
              ))}
            </div>
            
            <div className="w-full md:w-2/3">
              {editingVenue ? (
                <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">{editingVenue.id.startsWith('lokal-') ? t('admin.create_venue', 'Skapa ny lokal') : t('admin.edit_venue', 'Redigera lokal')}</h3>
                    <button onClick={() => handleDeleteVenue(editingVenue.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title={t('admin.btn_delete', 'Ta bort lokal') as string}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{t('admin.f_name', 'Namn')}</label>
                      <input type="text" value={editingVenue.name} onChange={e => setEditingVenue({...editingVenue, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-morkbla outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{t('admin.f_image', 'Bild')}</label>
                      <div className="flex gap-4 items-center">
                        {editingVenue.imageUrl && (
                          <img src={editingVenue.imageUrl} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                        )}
                        <label className="cursor-pointer bg-white border border-slate-300 hover:border-morkbla hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-bold text-slate-700">
                          <Upload className="w-4 h-4" />
                          {isUploading ? 'Laddar upp...' : 'Ladda upp bild'}
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{t('admin.f_desc', 'Beskrivning')}</label>
                      <textarea value={editingVenue.description} onChange={e => setEditingVenue({...editingVenue, description: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-morkbla outline-none h-24 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">{t('admin.f_capacity', 'Kapacitet (antal pers)')}</label>
                        <input type="number" value={editingVenue.capacity} onChange={e => setEditingVenue({...editingVenue, capacity: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-morkbla outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">{t('admin.f_price', 'Pris (kr)')}</label>
                        <input type="number" value={editingVenue.price || 0} onChange={e => setEditingVenue({...editingVenue, price: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-morkbla outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3 justify-end pt-6 border-t border-slate-200">
                    <button onClick={() => setEditingVenue(null)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors">{t('admin.btn_cancel', 'Avbryt')}</button>
                    <button onClick={handleSaveVenue} disabled={isSaving} className="bg-morkbla hover:bg-morkbla-900 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-sm flex items-center">
                      {isSaving ? t('admin.btn_saving', 'Sparar...') : <><Save className="w-4 h-4 mr-2" /> {t('admin.btn_save', 'Spara ändringar')}</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                  <Settings className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="font-medium text-slate-500">Välj en lokal i listan för att redigera den,</p>
                  <p className="text-sm">eller skapa en ny för att lägga till i portalen.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'block' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <h2 className="text-xl font-bold text-morkbla flex items-center">
              {t('admin.block_title', 'Spärra Tider / Blockera Datum')}
            </h2>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-slate-600 mb-6">{t('admin.block_desc', 'Använd detta formulär för att spärra utvalda tider i bokningsportalen för underhåll eller interna evenemang.')}</p>
            
            <form className="space-y-6 max-w-xl" onSubmit={async (e) => { 
              e.preventDefault(); 
              const form = e.target as any;
              const venueId = form.elements[0].value;
              const date = form.elements[1].value;
              const slotTime = form.elements[2].value;
              const reason = form.elements[3].value;
              
              if (!venueId || !date || !slotTime || !reason) {
                showAlert("Missing fields"); return;
              }
              
              await fetch('/api/admin/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ venueId, date, slotTime, reason })
              });
              
              showAlert(t('admin.success_block', 'Tiden har spärrats!') as string);
              form.reset();
              fetch('/api/admin/bookings').then(res => res.json()).then(data => setBookings(data.bookings || []));
            }}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('admin.b_select_venue', 'Välj Lokal')}</label>
                <select required className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none text-slate-800 bg-slate-50 focus:bg-white appearance-none">
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
                  <select required className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none text-slate-800 bg-slate-50 focus:bg-white appearance-none">
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
              <div className="pt-2">
                <button type="submit" className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm flex items-center justify-center">
                  <Ban className="w-5 h-5 mr-2" /> {t('admin.b_submit', 'Spärra vald tid')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
