'use client';

import { useState, useEffect } from 'react';
import { getTranslation } from '@/lib/i18n';

export default function BookingWidget({ venueId, lang }: { venueId: string, lang: string }) {
  const t = getTranslation(lang);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // State management for locking system
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [isLocking, setIsLocking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [orgNum, setOrgNum] = useState('');
  const [email, setEmail] = useState('');

  // Calendar logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  const slots = ["08:00 - 12:00", "13:00 - 17:00", "18:00 - 22:00"];
  
  const formatter = new Intl.DateTimeFormat(lang === 'sv' ? 'sv-SE' : lang === 'da' ? 'da-DK' : 'en-US', { month: 'long' });
  const monthName = formatter.format(currentMonth);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const fetchAvailability = async (date: Date) => {
    try {
      const dateStr = formatDate(date);
      const res = await fetch(`/api/slots?venueId=${venueId}&date=${dateStr}`);
      const data = await res.json();
      setUnavailableSlots(data.unavailableSlots || []);
    } catch (err) {
      console.error("Failed to fetch availability", err);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, venueId]);

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  
  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    setSelectedSlot(null); 
    setSuccessMessage(null);
  };

  const handleProceedToCheckout = async () => {
    if (!selectedDate || !selectedSlot) return;
    
    setIsLocking(true);
    const dateStr = formatDate(selectedDate);
    
    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lock', venueId, date: dateStr, slotTime: selectedSlot })
      });
      
      const data = await res.json();
      if (data.success) {
        setShowModal(true);
      } else {
        alert(t("widget.alert" as any));
        fetchAvailability(selectedDate);
        setSelectedSlot(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLocking(false);
    }
  };

  const handleCancelCheckout = async () => {
    setShowModal(false);
    if (!selectedDate || !selectedSlot) return;
    
    const dateStr = formatDate(selectedDate);
    try {
      await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'release', venueId, date: dateStr, slotTime: selectedSlot })
      });
      fetchAvailability(selectedDate);
    } catch (err) {
      console.error("Failed to release lock", err);
    }
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    
    setIsPaying(true);
    const dateStr = formatDate(selectedDate);
    
    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', venueId, date: dateStr, slotTime: selectedSlot, name, orgNum, email })
      });
      
      if (res.ok) {
        setShowModal(false);
        setSuccessMessage(`${t("widget.success" as any)} ${selectedSlot}!`);
        setSelectedSlot(null);
        setName(''); setOrgNum(''); setEmail('');
        fetchAvailability(selectedDate);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPaying(false);
    }
  };

  const daysLabels = lang === 'sv' ? ["Må", "Ti", "On", "To", "Fr", "Lö", "Sö"] : 
                     lang === 'da' ? ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"] : 
                                     ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <>
      <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-beige-200">
        <h3 className="text-xl font-bold text-morkbla mb-6 tracking-tight capitalize">{t("widget.select_date" as any)}</h3>
        
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handlePrevMonth} 
            className="p-2 hover:bg-ljusturkos-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-morkbla"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div className="font-bold text-lg text-morkbla capitalize">
            {monthName} {year}
          </div>
          <button 
            onClick={handleNextMonth} 
            className="p-2 hover:bg-ljusturkos-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-morkbla"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-8 text-center">
          {daysLabels.map(day => (
            <div key={day} className="text-xs font-bold text-slate-400 uppercase py-2 select-none">
              {day}
            </div>
          ))}
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="p-2"></div>
          ))}
          {days.map(day => {
            const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`p-2 w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-colors font-medium ${
                  isSelected 
                    ? 'bg-morkbla text-white shadow-md' 
                    : 'text-slate-700 hover:bg-ljusturkos-50 focus:ring-2 focus:ring-morkbla focus:outline-none'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-start" role="alert">
            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Time Slots Area */}
        <div className={`transition-all duration-300 ${selectedDate ? 'opacity-100 translate-y-0' : 'opacity-30 pointer-events-none -translate-y-2'}`}>
          <h4 className="font-semibold text-slate-700 mb-3 flex justify-between items-center text-sm uppercase tracking-wider">
            <span>{selectedDate ? `${t("widget.available_slots" as any)} ${selectedDate.toLocaleDateString(lang === 'sv' ? 'sv-SE' : lang === 'da' ? 'da-DK' : 'en-US', { month: 'short', day: 'numeric'})}` : t("widget.select_first" as any)}</span>
          </h4>
          <div className="space-y-3 mb-8">
            {slots.map(slot => {
              const isUnavailable = unavailableSlots.includes(slot);
              const isSelected = selectedSlot === slot;
              
              return (
                <button
                  key={slot}
                  onClick={() => !isUnavailable && setSelectedSlot(slot)}
                  className={`w-full py-3.5 px-5 rounded-xl border-2 text-left flex justify-between items-center transition-all focus:outline-none focus:ring-2 focus:ring-morkbla ${
                    isUnavailable 
                      ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60' 
                      : isSelected
                        ? 'border-morkbla bg-morkbla text-white shadow-md'
                        : 'border-beige-200 text-slate-700 hover:border-morkbla hover:bg-ljusturkos-50'
                  }`}
                  disabled={!selectedDate || isUnavailable}
                >
                  <span className="font-bold text-lg">{slot}</span>
                  {isSelected && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  )}
                  {isUnavailable && (
                    <span className="text-xs font-bold uppercase tracking-widest">{t("widget.locked" as any)}</span>
                  )}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={handleProceedToCheckout}
            className={`w-full py-4 px-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              selectedDate && selectedSlot && !isLocking
                ? 'bg-bla-600 hover:bg-bla-700 text-white shadow-md focus:ring-bla-600'
                : 'bg-beige-200 text-slate-400 cursor-not-allowed border border-beige-300'
            }`}
            disabled={!selectedDate || !selectedSlot || isLocking}
          >
            {isLocking ? t("widget.locking" as any) : t("widget.checkout" as any)}
            {!isLocking && <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
          </button>
        </div>
      </section>

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-morkbla-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="bg-morkbla px-6 py-5 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold tracking-tight">{t("widget.modal_title" as any)}</h2>
              <button 
                onClick={handleCancelCheckout} 
                className="text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded p-1 bg-white/10 hover:bg-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 bg-ljusturkos-50 border-b border-ljusturkos-200 flex items-start text-morkbla-800">
              <svg className="w-5 h-5 mr-3 text-morkbla mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <p className="text-sm font-bold">{t("widget.locked_msg" as any)}</p>
                <p className="text-xs text-morkbla-600 mt-1">{selectedDate?.toLocaleDateString()} | {selectedSlot}</p>
              </div>
            </div>

            <form onSubmit={handleSimulatePayment} className="p-6 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1.5">{t("widget.name" as any)}</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white"
                />
              </div>
              
              <div>
                <label htmlFor="orgNum" className="block text-sm font-bold text-slate-700 mb-1.5">{t("widget.org" as any)}</label>
                <input 
                  type="text" 
                  id="orgNum" 
                  value={orgNum}
                  onChange={(e) => setOrgNum(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5">{t("widget.email" as any)}</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-shadow text-slate-800 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex items-start gap-3 mt-4 mb-2">
                <input 
                  type="checkbox" 
                  id="gdpr_consent" 
                  required 
                  className="mt-1 w-4 h-4 text-morkbla border-beige-300 rounded focus:ring-morkbla" 
                />
                <label htmlFor="gdpr_consent" className="text-sm text-slate-600 leading-tight font-medium cursor-pointer">
                  {lang === 'en' ? 'I agree that Landskrona stad stores my data in accordance with GDPR.' : lang === 'da' ? 'Jeg accepterer, at Landskrona stad gemmer mine data i overensstemmelse med GDPR.' : 'Jag godkänner att Landskrona stad lagrar mina uppgifter i enlighet med dataskyddsförordningen (GDPR).'}
                </label>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isPaying}
                  className="w-full bg-slate-900 text-white hover:bg-black font-bold py-4 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors flex justify-center items-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPaying ? t("widget.processing" as any) : t("widget.pay" as any)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
