import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENAIP_API_KEY || '';

export async function GET(request: Request) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'FI'; // Default to Finland if not specified

    // Construct the API URL for airspaces
    const url = `https://api.core.openaip.net/api/airspaces?country=${country}`;

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'x-openaip-api-key': API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch airspaces: ${res.status} ${res.statusText}`);
    }

    const airspaces = await res.json();
    console.log('Fetched airspaces:', airspaces);
    return NextResponse.json(airspaces);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}