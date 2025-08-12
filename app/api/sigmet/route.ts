import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://example.com/sigmet', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch SIGMET: ${res.status} ${res.statusText}`);
    }

    const sigmet = await res.json(); // store data in variable

    return NextResponse.json(sigmet);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
