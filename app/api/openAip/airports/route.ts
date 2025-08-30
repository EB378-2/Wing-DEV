import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENAIP_API_KEY || '';

export async function GET(request: Request) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const dep = searchParams.get('dep');
    const arr = searchParams.get('arr');

    if (!dep || !arr) {
      return NextResponse.json(
        { error: 'Missing required query parameters: dep and arr' },
        { status: 400 }
      );
    }

    // Construct the search query string; here I'm assuming you want to search both airports somehow
    // For demonstration, let's fetch airports matching either dep or arr codes separately and combine
    // Or if you want to fetch only departure or arrival, adjust accordingly

    // For example, to fetch airports matching either dep or arr:
    const url = `https://api.core.openaip.net/api/airports?searchOptLwc=true&search=${dep},${arr}&country=FI`;

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'x-openaip-api-key': API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch airports: ${res.status} ${res.statusText}`);
    }

    const airports = await res.json();
    console.log(airports);

    return NextResponse.json(airports);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
