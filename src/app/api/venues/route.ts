import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: venues, error } = await supabase.from('venues').select('*');
    if (error) throw error;
    
    // Convert back to camelCase for the frontend
    const formatted = venues.map((v: any) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      imageUrl: v.image_url,
      capacity: v.capacity,
      price: v.price,
      features: v.features,
      accessibility: v.accessibility,
      rules: v.rules,
      contact: v.contact
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read venues data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newVenues = await request.json();
    
    // Instead of replacing all, upsert them
    const formatted = newVenues.map((v: any) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      image_url: v.imageUrl,
      capacity: v.capacity,
      price: v.price,
      features: v.features,
      accessibility: v.accessibility,
      rules: v.rules,
      contact: v.contact
    }));

    const { error } = await supabase.from('venues').upsert(formatted);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Venues updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save venues data' }, { status: 500 });
  }
}
