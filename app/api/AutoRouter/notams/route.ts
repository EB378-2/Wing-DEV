// app/api/AutoRouter/notams/route.ts
import { getAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NOTAM, NOTAMResponse } from '@/types/notam';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const icaoCode = searchParams.get('icao') || '';
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    const token = await getAccessToken();
    
    const apiUrl = new URL('https://api.autorouter.aero/v1.0/notam');
    apiUrl.searchParams.append('itemas', `["${icaoCode}"]`);
    apiUrl.searchParams.append('offset', offset);
    apiUrl.searchParams.append('limit', limit);

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    const result: NOTAMResponse = await response.json();

    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch NOTAMs');
    }    

    // Transform the NOTAMs into a more UI-friendly format
    const formattedNotams = result.rows.map(notam => ({
      id: notam.id,
      title: `${notam.series}${notam.number.toString().padStart(4, '0')}/${notam.year}`,
      description: notam.iteme,
      location: notam.itema.join(', '),
      effectiveDate: new Date(notam.startvalidity * 1000).toISOString(),
      expiryDate: new Date(notam.endvalidity * 1000).toISOString(),
      lat: notam.lat,
      lon: notam.lon,
      rawData: notam // Keep original data if needed
    }));

    
    

    return NextResponse.json({
      total: result.total,
      notams: formattedNotams
    });
    
  } catch (error) {
    console.error('NOTAM fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}