// app/api/openAip/searchAirport/route.ts
import { NextRequest, NextResponse } from 'next/server';

const OPENAPI_API_KEY = process.env.OPENAIP_API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toUpperCase();
    const icao = searchParams.get('icao')?.toUpperCase();
    const limit = searchParams.get('limit') || '10';
    const fields = searchParams.get('fields') || '_id,name,icaoCode,iataCode,country,type,geometry,elevation';

    if (!OPENAPI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAIP API key not configured' },
        { status: 500 }
      );
    }

    if (!search && !icao) {
      return NextResponse.json(
        { error: 'Missing required query parameter: search or icao' },
        { status: 400 }
      );
    }

    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (icao) params.append('icaoCode', icao);
    params.append('limit', limit);
    params.append('fields', fields);

    const url = `https://api.core.openaip.net/api/airports?${params.toString()}`;
    
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'x-openaip-api-key': OPENAPI_API_KEY,
      },
      // Optional: Add timeout
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return NextResponse.json(
          { error: 'Invalid OpenAIP API key' },
          { status: 401 }
        );
      }
      throw new Error(`OpenAIP API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    // If searching by specific ICAO, return the first match or null
    if (icao) {
      const airport = data.items?.find((a: any) => a.icaoCode === icao) || null;
      return NextResponse.json(airport);
    }

    // Return search results
    return NextResponse.json({
      items: data.items || [],
      totalCount: data.totalCount || 0
    });

  } catch (error: any) {
    console.error('Airport API error:', error);
    
    if (error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}