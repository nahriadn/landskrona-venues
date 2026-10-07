import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import mockBookingsData from '@/data/bookings.json';

export async function GET() {
  const liveBookings = Array.from(store.confirmedBookings.entries()).map(([key, data]) => {
    const [venueId, date, slotTime] = key.split('|');
    return { 
      id: "REQ-" + Math.floor(Math.random() * 10000), 
      venueId, 
      date, 
      slotTime,
      user: data.name || "Private Citizen",
      purpose: data.type === 'admin' ? "Admin Block" : "Booking Request",
      status: "pending", // They start as pending in admin
      bookedAt: data.bookedAt
    };
  });
  
  // Sort by newest booking first
  liveBookings.sort((a, b) => b.bookedAt - a.bookedAt);
  
  const combined = [...liveBookings, ...mockBookingsData];
  return NextResponse.json({ bookings: combined });
}

export async function POST(request: Request) {
  const { venueId, date, slotTime, reason } = await request.json();
  
  if (!venueId || !date || !slotTime) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Handle 'all' as Full Day
  const slotsToBlock = (slotTime === 'all' || slotTime === 'Full Day')
    ? ["08:00 - 12:00", "13:00 - 17:00", "18:00 - 22:00"] 
    : [slotTime];
  
  slotsToBlock.forEach(slot => {
    const key = `${venueId}|${date}|${slot}`;
    store.confirmedBookings.set(key, { type: 'admin', bookedAt: Date.now(), name: reason });
    store.lockedSlots.delete(key); 
  });

  return NextResponse.json({ success: true });
}
