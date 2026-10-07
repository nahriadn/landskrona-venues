import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import mockBookingsData from '@/data/bookings.json';

export async function GET() {
  const { data: dbBookings, error } = await supabase
    .from('bookings')
    .select('*')
    .order('booked_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }

  const liveBookings = dbBookings.map(b => ({
    id: b.req_id || `DB-\${b.id}`,
    venueId: b.venue_id,
    date: b.date,
    slotTime: b.slot_time,
    user: b.user_name || "Admin/System",
    purpose: b.type === 'admin' ? b.reason || "Admin Block" : b.reason || "Booking Request",
    status: b.status || "pending",
    bookedAt: b.booked_at
  }));
  
  const combined = [...liveBookings, ...mockBookingsData];
  return NextResponse.json({ bookings: combined });
}

export async function POST(request: Request) {
  const { venueId, date, slotTime, reason } = await request.json();
  
  if (!venueId || !date || !slotTime) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Handle 'all' as Full Day
  const slotsToBlock = (slotTime === 'all' || slotTime === 'Full Day' || slotTime === 'Heldag')
    ? ["08:00 - 12:00", "13:00 - 17:00", "18:00 - 22:00"] 
    : [slotTime];
  
  for (const slot of slotsToBlock) {
    // Check if exists
    const { data } = await supabase
      .from('bookings')
      .select('id')
      .eq('venue_id', venueId)
      .eq('date', date)
      .eq('slot_time', slot)
      .limit(1);

    if (data && data.length > 0) {
      // Update to approved/blocked
      await supabase
        .from('bookings')
        .update({ status: 'approved', reason: reason })
        .eq('id', data[0].id);
    } else {
      // Create new admin block
      await supabase.from('bookings').insert({
        req_id: `BLK-\${Math.floor(Math.random() * 100000)}`,
        venue_id: venueId,
        date: date,
        slot_time: slot,
        status: 'blocked',
        type: 'admin',
        reason: reason || 'Admin block',
        booked_at: Date.now()
      });
    }
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const { reqId, status } = await request.json();
  if (!reqId || !status) return NextResponse.json({error: 'Missing fields'}, {status: 400});
  await supabase.from('bookings').update({ status }).eq('req_id', reqId);
  return NextResponse.json({ success: true });
}
