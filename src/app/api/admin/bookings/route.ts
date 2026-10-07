import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const bookings = Array.from(store.confirmedBookings.entries()).map(([key, data]) => {
    const [venueId, date, slotTime] = key.split('|');
    return { id: key, venueId, date, slotTime, ...data };
  });
  
  // Sort by newest booking first
  bookings.sort((a, b) => b.bookedAt - a.bookedAt);
  
  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  const { venueId, date, slotTime } = await request.json();
  
  if (!venueId || !date || !slotTime) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const slotsToBlock = slotTime === 'Full Day' 
    ? ["08:00 - 12:00", "13:00 - 17:00", "18:00 - 22:00"] 
    : [slotTime];
  
  slotsToBlock.forEach(slot => {
    const key = `${venueId}|${date}|${slot}`;
    store.confirmedBookings.set(key, { type: 'admin', bookedAt: Date.now() });
    store.lockedSlots.delete(key); // Clear any active public locks if admin forces a block
  });

  return NextResponse.json({ success: true });
}
