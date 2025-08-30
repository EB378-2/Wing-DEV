// app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Verify state matches what you sent
  // ...

  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code missing' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch('https://api.autorouter.aero/v1.0/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.AUTOROUTER_APP_CLIENT_ID!,
        client_secret: process.env.AUTOROUTER_APP_CLIENT_SECRET!,
        code: code,
        redirect_uri: process.env.AUTOROUTER_REDIRECT_URI!,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    
    // Store the token securely (in cookies or session)
    // ...

    return NextResponse.redirect('/dashboard');
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}