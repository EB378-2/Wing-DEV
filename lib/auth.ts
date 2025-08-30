// lib/auth.ts
let accessToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAccessToken() {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && tokenExpiry > Date.now()) {
    return accessToken;
  }

  // Request new token
  const response = await fetch('https://api.autorouter.aero/v1.0/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AUTOROUTER_CLIENT_ID!,
      client_secret: process.env.AUTOROUTER_CLIENT_SECRET!,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with AutoRouter API');
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute as buffer

  return accessToken;
}