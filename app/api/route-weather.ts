import type { NextApiRequest, NextApiResponse } from 'next';

const API_TOKEN = process.env.AVWX_API_TOKEN as string;
const BASE_URL = 'https://avwx.rest/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { dep, arr } = req.query;

  if (!dep || !arr || typeof dep !== 'string' || typeof arr !== 'string') {
    return res.status(400).json({ error: 'Please provide dep and arr ICAO codes' });
  }

  try {
    const headers = { Authorization: `Token ${API_TOKEN}` };

    // Fetch departure & arrival METAR in one call
    const multiUrl = `${BASE_URL}/multi/metar/${dep},${arr}?format=json`;
    const multiResp = await fetch(multiUrl, { headers });
    const multiData = await multiResp.json();

    // Fetch route METAR
    const routeUrl = `${BASE_URL}/route/metar/${dep};${arr}?format=json`;
    const routeResp = await fetch(routeUrl, { headers });
    const routeData = await routeResp.json();

    return res.status(200).json({
      departure_arrival_weather: multiData,
      route_weather: routeData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}
