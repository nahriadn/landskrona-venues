import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venueId');
  const date = searchParams.get('date');

  if (!venueId || !date) {
    return NextResponse.json({ error: 'Missing venueId or date' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('slot_time')
    .eq('venue_id', venueId)
    .eq('date', date)
    .in('status', ['pending', 'approved', 'blocked']);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }

  const unavailableSlots = data.map(d => d.slot_time);
  return NextResponse.json({ unavailableSlots });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, venueId, date, slotTime, name, orgNum, email, phone } = body;
  
  if (!action || !venueId || !date || !slotTime) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const reqId = `REQ-\${Math.floor(Math.random() * 100000)}`;

  if (action === 'lock') {
    // Check if it exists
    const { data } = await supabase
      .from('bookings')
      .select('id')
      .eq('venue_id', venueId)
      .eq('date', date)
      .eq('slot_time', slotTime)
      .in('status', ['pending', 'approved', 'blocked']);
      
    if (data && data.length > 0) {
      return NextResponse.json({ success: false, error: 'Already booked' }, { status: 409 });
    }

    // Insert lock (as pending)
    await supabase.from('bookings').insert({
      req_id: reqId,
      venue_id: venueId,
      date,
      slot_time: slotTime,
      status: 'pending',
      type: 'public',
      booked_at: Date.now()
    });

    return NextResponse.json({ success: true });
  }
  
  if (action === 'release') {
    await supabase
      .from('bookings')
      .delete()
      .eq('venue_id', venueId)
      .eq('date', date)
      .eq('slot_time', slotTime)
      .eq('status', 'pending');
      
    return NextResponse.json({ success: true });
  }
  
  if (action === 'confirm') {
    await supabase
      .from('bookings')
      .update({
        user_name: name || 'Private Citizen',
        org_num: orgNum,
        email: email,
        phone: phone
      })
      .eq('venue_id', venueId)
      .eq('date', date)
      .eq('slot_time', slotTime)
      .eq('status', 'pending');

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
