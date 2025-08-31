import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENAIP_API_KEY || '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const icao = searchParams.get('icao')?.toUpperCase();

    if (!icao) {
      return NextResponse.json(
        { error: 'Missing required query parameter: icao' },
        { status: 400 }
      );
    }

    const url = `https://api.core.openaip.net/api/airports?search=${icao}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'x-openaip-api-key': API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch airport ${icao}: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const airport = data.items?.[0] || null;

    if (!airport) {
      return NextResponse.json(
        { error: `Airport ${icao} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(airport);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
