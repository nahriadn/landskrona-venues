'use client';

import { useState, useEffect } from 'react';
import { getTranslation } from '@/lib/i18n';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, ChevronRight, ChevronLeft, Building, Mail, XCircle } from 'lucide-react';

export default function BookingWidget({ venueId, lang }: { venueId: string, lang: string }) {
  const t = getTranslation(lang);
  
  // Stepper state
  const [step, setStep] = useState(1);
  
  // Selection state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [orgNum, setOrgNum] = useState('');
  const [email, setEmail] = useState('');

  // Lock/Booking state
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [isLocking, setIsLocking] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [customAlert, setCustomAlert] = useState<string | null>(null);

  // Calendar logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
  
  const monthName = currentMonth.toLocaleString(lang === 'sv' ? 'sv-SE' : lang === 'da' ? 'da-DK' : 'en-US', { month: 'long' });

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, venueId]);

  const fetchAvailability = async (date: Date) => {
    const dStr = date.toISOString().split('T')[0];
    try {
      const res = await fetch(`/api/slots?venueId=${venueId}&date=${dStr}`);
      if (res.ok) {
        const data = await res.json();
        setUnavailableSlots(data.unavailableSlots || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateDays = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isPast = date < new Date(new Date().setHours(0,0,0,0));
      const isSelected = selectedDate?.getDate() === d && selectedDate?.getMonth() === month;
      
      days.push(
        <button
          key={d}
          disabled={isPast}
          onClick={() => {
            setSelectedDate(date);
            setSelectedSlot(null);
            setCustomAlert(null);
          }}
          className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-morkbla ${
            isSelected 
              ? 'bg-morkbla text-white shadow-md scale-110' 
              : isPast 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-700 hover:bg-ljusturkos-100 hover:text-morkbla'
          }`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // STEPS LOGIC
  const handleNextToForm = async () => {
    if (!selectedDate || !selectedSlot) return;
    setIsLocking(true);
    setCustomAlert(null);
    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'lock',
          venueId,
          date: selectedDate.toISOString().split('T')[0],
          slotTime: selectedSlot
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setStep(2); // Move to form
    } catch (err: any) {
      setCustomAlert(err.message === 'Already booked' ? t("widget.alert" as any) : "Error locking slot.");
      fetchAvailability(selectedDate);
    } finally {
      setIsLocking(false);
    }
  };

  const handleCancelLock = async () => {
    if (!selectedDate || !selectedSlot) return;
    try {
      await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unlock',
          venueId,
          date: selectedDate.toISOString().split('T')[0],
          slotTime: selectedSlot
        })
      });
    } catch (e) {}
    setStep(1); // Go back
  };

  const handleNextToConfirm = () => {
    if (!name || !email) {
      setCustomAlert(lang === 'en' ? 'Please fill in all required fields' : 'Vänligen fyll i alla obligatoriska fält');
      return;
    }
    setCustomAlert(null);
    setStep(3);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) return;
    setIsPaying(true);
    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'book',
          venueId,
          date: selectedDate.toISOString().split('T')[0],
          slotTime: selectedSlot,
          name,
          orgNum,
          email
        })
      });
      
      if (res.ok) {
        setSuccessMessage(`${t("widget.success" as any)} ${selectedSlot}!`);
        setStep(4); // Success step
      }
    } catch (err) {
      setCustomAlert(lang === 'en' ? 'Booking failed.' : 'Bokningen misslyckades.');
    } finally {
      setIsPaying(false);
    }
  };

  const daysLabels = lang === 'sv' ? ["Må", "Ti", "On", "To", "Fr", "Lö", "Sö"] : 
                     lang === 'da' ? ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"] : 
                                     ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  
  const slots = ["08:00 - 12:00", "13:00 - 17:00", "18:00 - 22:00"];

  if (step === 4) {
    return (
      <section className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-beige-200 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-4">
          {lang === 'en' ? 'Booking Request Sent!' : 'Bokningsförfrågan Skickad!'}
        </h3>
        <p className="text-slate-600 font-medium mb-8">
          {successMessage}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-morkbla hover:bg-morkbla-900 text-white font-bold py-4 rounded-xl transition-all shadow-md"
        >
          {lang === 'en' ? 'Back to Venue' : 'Tillbaka till lokal'}
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-beige-200 overflow-hidden relative">
      
      {/* Stepper Header */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-morkbla text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
          <span className={`text-xs font-bold uppercase tracking-widest hidden sm:block ${step >= 1 ? 'text-morkbla' : 'text-slate-400'}`}>{lang === 'en' ? 'Time' : 'Tid'}</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-morkbla' : 'bg-slate-200'}`}></div>
        
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-morkbla text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
          <span className={`text-xs font-bold uppercase tracking-widest hidden sm:block ${step >= 2 ? 'text-morkbla' : 'text-slate-400'}`}>{lang === 'en' ? 'Details' : 'Uppgifter'}</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 3 ? 'bg-morkbla' : 'bg-slate-200'}`}></div>
        
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-morkbla text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
          <span className={`text-xs font-bold uppercase tracking-widest hidden sm:block ${step >= 3 ? 'text-morkbla' : 'text-slate-400'}`}>{lang === 'en' ? 'Confirm' : 'Bekräfta'}</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        
        {customAlert && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-3 animate-in fade-in duration-300">
            <XCircle className="w-5 h-5 shrink-0" />
            {customAlert}
          </div>
        )}

        {/* STEP 1: Date & Time */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <h3 className="text-xl font-bold text-morkbla mb-6 tracking-tight capitalize">{t("widget.select_date" as any)}</h3>
            
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-ljusturkos-50 rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <div className="font-bold text-lg text-morkbla capitalize">
                {monthName} {year}
              </div>
              <button onClick={handleNextMonth} className="p-2 hover:bg-ljusturkos-50 rounded-full transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-8 text-center">
              {daysLabels.map(day => (
                <div key={day} className="text-xs font-bold text-slate-400 uppercase py-2">{day}</div>
              ))}
              {generateDays()}
            </div>

            {/* Time Slots */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-sm font-bold text-slate-700 mb-4">{t("widget.select_time" as any)}</h4>
              <div className="flex flex-col gap-3 mb-8">
                {!selectedDate ? (
                  <p className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                    {lang === 'en' ? 'Select a date first' : 'Välj ett datum först'}
                  </p>
                ) : (
                  slots.map((slot) => {
                    const isUnavailable = unavailableSlots.includes(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        disabled={isUnavailable}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          isSelected ? 'border-morkbla bg-morkbla text-white shadow-md' 
                          : isUnavailable ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                          : 'border-slate-200 hover:border-ljusturkos-300 hover:bg-ljusturkos-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 opacity-70" />
                          <span className="font-bold text-lg">{slot}</span>
                        </div>
                        {isUnavailable && <span className="text-xs font-bold uppercase tracking-widest bg-slate-200 px-2 py-1 rounded-md text-slate-500">{t("widget.locked" as any)}</span>}
                        {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                      </button>
                    );
                  })
                )}
              </div>

              <button
                onClick={handleNextToForm}
                disabled={!selectedDate || !selectedSlot || isLocking}
                className={`w-full py-4 px-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center ${
                  selectedDate && selectedSlot && !isLocking
                    ? 'bg-morkbla hover:bg-morkbla-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isLocking ? (lang === 'en' ? 'Locking...' : 'Reserverar...') : (lang === 'en' ? 'Continue' : 'Fortsätt')}
                {!isLocking && <ChevronRight className="w-5 h-5 ml-2" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Your Details */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="bg-ljusturkos-50 border-l-4 border-ljusturkos p-4 rounded-r-xl mb-6 flex items-start text-morkbla-800">
              <CalendarIcon className="w-5 h-5 mr-3 shrink-0" />
              <div>
                <p className="text-sm font-bold">{t("widget.locked_msg" as any)}</p>
                <p className="text-xs font-medium text-morkbla-600 mt-1">{selectedDate?.toLocaleDateString()} | {selectedSlot}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-morkbla mb-6 tracking-tight">{lang === 'en' ? 'Your Details' : 'Dina Uppgifter'}</h3>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> {lang === 'en' ? 'Name / Org Name *' : 'Namn / Föreningsnamn *'}
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" /> {lang === 'en' ? 'Org Number (Optional)' : 'Organisationsnummer (Valfritt)'}
                </label>
                <input 
                  type="text" 
                  value={orgNum} 
                  onChange={e => setOrgNum(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> {lang === 'en' ? 'Email Address *' : 'E-postadress *'}
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelLock}
                className="w-1/3 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {t("auth.cancel" as any)}
              </button>
              <button
                onClick={handleNextToConfirm}
                className="w-2/3 py-4 rounded-xl font-bold text-white bg-morkbla hover:bg-morkbla-900 transition-all shadow-md flex items-center justify-center"
              >
                {lang === 'en' ? 'Review Booking' : 'Granska Bokning'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirm */}
        {step === 3 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <h3 className="text-xl font-bold text-morkbla mb-6 tracking-tight">{lang === 'en' ? 'Review & Confirm' : 'Granska & Bekräfta'}</h3>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 space-y-4">
              <div className="flex justify-between border-b border-slate-200 pb-4">
                <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">{lang === 'en' ? 'Date & Time' : 'Datum & Tid'}</span>
                <span className="font-bold text-slate-800 text-right">{selectedDate?.toLocaleDateString()}<br/>{selectedSlot}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-4">
                <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">{lang === 'en' ? 'Booker' : 'Bokare'}</span>
                <span className="font-bold text-slate-800 text-right">{name}<br/><span className="text-slate-500 text-sm font-medium">{orgNum}</span></span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">{lang === 'en' ? 'Contact' : 'Kontakt'}</span>
                <span className="font-bold text-slate-800 text-right">{email}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {lang === 'en' ? 'Back' : 'Tillbaka'}
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isPaying}
                className="w-2/3 py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-md flex items-center justify-center"
              >
                {isPaying ? (lang === 'en' ? 'Sending...' : 'Skickar...') : (lang === 'en' ? 'Confirm Booking' : 'Skicka Förfrågan')}
                {!isPaying && <CheckCircle className="w-5 h-5 ml-2" />}
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
