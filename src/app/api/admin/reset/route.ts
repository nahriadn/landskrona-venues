import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Wipe all bookings to reset the demo
  const { error } = await supabase.from('bookings').delete().neq('id', 0); // Deletes all rows

  if (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
  
  return NextResponse.json({ 
    success: true, 
    message: "Database has been completely wiped. Ready for a fresh demo." 
  });
}
