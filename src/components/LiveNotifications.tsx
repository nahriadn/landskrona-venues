
'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Bell, CalendarCheck, FileCheck, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LiveNotifications({ session, lang }: { session?: string, lang: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    // Listen to changes on the bookings table
    const channel = supabase
      .channel('bookings-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (session === 'admin' && payload.eventType === 'INSERT') {
            const newBooking = payload.new;
            toast.custom((t) => (
              <div className={(t.visible ? 'animate-enter' : 'animate-leave') + " max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto border-l-4 border-morkbla flex ring-1 ring-black ring-opacity-5 overflow-hidden"}>
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-ljusturkos-50 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-morkbla" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-bold text-slate-900">
                        {lang === 'en' ? 'New Booking Request' : 'Ny Bokningsförfrågan'}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 font-medium">
                        {lang === 'en' ? 'A new request has been submitted for ' + newBooking.date + '.' : 'En ny förfrågan har inkommit för ' + newBooking.date + '.'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-slate-100">
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      router.push('/admin');
                    }}
                    className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-bold text-morkbla hover:bg-slate-50 transition-colors"
                  >
                    {lang === 'en' ? 'View' : 'Visa'}
                  </button>
                </div>
              </div>
            ), { duration: 6000 });
          }

          if (session === 'client' && payload.eventType === 'UPDATE') {
            const updatedBooking = payload.new;
            const oldBooking = payload.old;
            
            if (updatedBooking.status !== oldBooking.status && (updatedBooking.status === 'approved' || updatedBooking.status === 'rejected')) {
              const isApproved = updatedBooking.status === 'approved';
              
              toast.custom((t) => (
                <div className={(t.visible ? 'animate-enter' : 'animate-leave') + " max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto border-l-4 " + (isApproved ? 'border-green-500' : 'border-red-500') + " flex ring-1 ring-black ring-opacity-5 overflow-hidden"}>
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className={"h-10 w-10 rounded-full flex items-center justify-center " + (isApproved ? 'bg-green-50' : 'bg-red-50')}>
                          {isApproved ? <FileCheck className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-bold text-slate-900">
                          {isApproved ? (lang === 'en' ? 'Booking Approved!' : 'Bokning Godkänd!') : (lang === 'en' ? 'Booking Rejected' : 'Bokning Avslagen')}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 font-medium">
                          {lang === 'en' 
                            ? 'Your request for ' + updatedBooking.date + ' was ' + (isApproved ? 'approved' : 'rejected') + '.' 
                            : 'Din förfrågan för ' + updatedBooking.date + ' blev ' + (isApproved ? 'godkänd' : 'avslagen') + '.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-l border-slate-100">
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        router.push('/profile');
                      }}
                      className={"w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-bold transition-colors " + (isApproved ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50')}
                    >
                      {lang === 'en' ? 'View' : 'Visa'}
                    </button>
                  </div>
                </div>
              ), { duration: 6000 });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, lang, router]);

  return null;
}
