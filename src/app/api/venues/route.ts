import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'venues.json');

let memoryVenuesCache: any = null;

export async function GET() {
  try {
    if (memoryVenuesCache) {
      return NextResponse.json(memoryVenuesCache);
    }
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const venues = JSON.parse(fileContents);
    return NextResponse.json(venues);
  } catch (error) {
    if (memoryVenuesCache) return NextResponse.json(memoryVenuesCache);
    return NextResponse.json({ error: 'Failed to read venues data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newVenues = await request.json();
    memoryVenuesCache = newVenues;
    
    try {
      // This will fail on Vercel (read-only FS) but succeed locally/Docker
      fs.writeFileSync(dataFilePath, JSON.stringify(newVenues, null, 2), 'utf8');
    } catch (fsError) {
      console.warn("Could not write to FS (expected in Vercel), using memory cache.");
    }

    return NextResponse.json({ success: true, message: 'Venues updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save venues data' }, { status: 500 });
  }
}
