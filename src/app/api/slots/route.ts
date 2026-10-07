import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venueId');
  const date = searchParams.get('date');

  if (!venueId || !date) {
    return NextResponse.json({ error: 'Missing venueId or date' }, { status: 400 });
  }

  // Cleanup expired locks
  const now = Date.now();
  for (const [key, lock] of Array.from(store.lockedSlots.entries())) {
    if (now > lock.expiresAt) {
      store.lockedSlots.delete(key);
    }
  }

  const prefix = `${venueId}|${date}|`;
  const unavailableSlots: string[] = [];

  for (const key of Array.from(store.lockedSlots.keys())) {
    if (key.startsWith(prefix)) {
      unavailableSlots.push(key.replace(prefix, ''));
    }
  }
  
  for (const key of Array.from(store.confirmedBookings.keys())) {
    if (key.startsWith(prefix)) {
      unavailableSlots.push(key.replace(prefix, ''));
    }
  }

  return NextResponse.json({ unavailableSlots });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, venueId, date, slotTime, name, orgNum, email } = body;
  
  if (!action || !venueId || !date || !slotTime) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const key = `${venueId}|${date}|${slotTime}`;
  
  if (action === 'lock') {
    if (store.confirmedBookings.has(key)) {
      return NextResponse.json({ success: false, error: 'Already booked' }, { status: 409 });
    }
    
    const existingLock = store.lockedSlots.get(key);
    if (existingLock && existingLock.expiresAt > Date.now()) {
      return NextResponse.json({ success: false, error: 'Currently locked by another user' }, { status: 409 });
    }

    store.lockedSlots.set(key, { expiresAt: Date.now() + 10 * 60 * 1000 });
    return NextResponse.json({ success: true });
  }
  
  if (action === 'release') {
    store.lockedSlots.delete(key);
    return NextResponse.json({ success: true });
  }
  
  if (action === 'confirm') {
    store.lockedSlots.delete(key);
    store.confirmedBookings.set(key, { 
      type: 'public', 
      name, 
      orgNum, 
      email, 
      bookedAt: Date.now() 
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
