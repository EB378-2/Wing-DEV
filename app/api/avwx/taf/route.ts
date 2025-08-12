import type { NextRequest } from 'next/server';

const BASE_URL = 'https://avwx.rest/api';
const API_TOKEN = process.env.AVWX_API_TOKEN || '';

// Define coordinate point type
interface CoordinatePoint {
  lat: number;
  lon: number;
}

// Define TAF forecast period type
interface TAFForecast {
  altimeter?: string;
  clouds: {
    repr: string;
    type: string;
    altitude: number;
    modifier: string | null;
    direction: string | null;
  }[];
  flight_rules: string;
  other: any[];
  sanitized: string;
  visibility: {
    repr: string;
    value: number | null;
    spoken: string;
  };
  wind_direction: {
    repr: string;
    value: number;
    spoken: string;
  };
  wind_gust: {
    repr: string;
    value: number | null;
    spoken: string;
  } | null;
  wind_speed: {
    repr: string;
    value: number;
    spoken: string;
  };
  wx_codes: {
    repr: string;
    value: string;
  }[];
  end_time: {
    repr: string;
    dt: string;
  };
  icing: any[];
  probability: number | null;
  raw: string;
  start_time: {
    repr: string;
    dt: string;
  };
  turbulence: any[];
  type: string;
  wind_shear: string | null;
  summary: string;
}

// Define complete TAF response type
interface TAFResponse {
  meta: {
    timestamp: string;
  };
  raw: string;
  station: string;
  time: {
    repr: string;
    dt: string;
  };
  remarks: string;
  forecast: TAFForecast[];
  start_time: {
    repr: string;
    dt: string;
  };
  end_time: {
    repr: string;
    dt: string;
  };
  max_temp?: string;
  min_temp?: string;
  alts: any;
  temps: any;
  units: {
    altimeter: string;
    altitude: string;
    temperature: string;
    visibility: string;
    wind_speed: string;
  };
}

// Helper function to fetch data from AVWX API
async function fetchAvwxJson(url: string): Promise<any> {
  const headers = { Authorization: `Token ${API_TOKEN}` };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return res.json();
}

// Get station info by ICAO code
async function getStationInfo(icao: string): Promise<any> {
  return fetchAvwxJson(`${BASE_URL}/station/${icao}?format=json`);
}

// Calculate intermediate points along a great circle route
function calculateRoutePoints(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  numPoints: number
): CoordinatePoint[] {
  // Convert degrees to radians
  const toRad = (deg: number) => deg * Math.PI / 180;
  const toDeg = (rad: number) => rad * 180 / Math.PI;
  
  const φ1 = toRad(lat1);
  const λ1 = toRad(lon1);
  const φ2 = toRad(lat2);
  const λ2 = toRad(lon2);
  
  // Calculate angular distance
  const Δλ = λ2 - λ1;
  const angularDistance = Math.acos(
    Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  );
  
  const points: CoordinatePoint[] = [];
  
  for (let i = 1; i <= numPoints; i++) {
    const f = i / (numPoints + 1);
    const A = Math.sin((1 - f) * angularDistance) / Math.sin(angularDistance);
    const B = Math.sin(f * angularDistance) / Math.sin(angularDistance);
    
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    
    const φ = Math.atan2(z, Math.sqrt(x*x + y*y));
    const λ = Math.atan2(y, x);
    
    points.push({
      lat: toDeg(φ),
      lon: toDeg(λ)
    });
  }
  
  return points;
}

// Get nearest station to a coordinate point
async function getNearestStation(lat: number, lon: number): Promise<string | null> {
  try {
    const stations = await fetchAvwxJson(
      `${BASE_URL}/station/near/${lat},${lon}?n=1&airport=true&reporting=true&format=json`
    );
    
    if (stations?.length > 0 && stations[0].station?.icao) {
      return stations[0].station.icao;
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Error finding station near ${lat},${lon}: ${errMsg}`);
  }
  return null;
}

// Enhanced TAF fetch with fallback logic
async function fetchTafWithNearestFallback(icao: string, stationInfo?: any): Promise<{
  raw: string;
  station: string;
  isFallback: boolean;
  forecast?: TAFForecast[];
  fallbackFor?: string;
  error?: string;
}> {
  try {
    // Try direct TAF fetch first
    const taf: TAFResponse = await fetchAvwxJson(`${BASE_URL}/taf/${icao}?format=json`);
    if (taf?.raw) {
      return { 
        ...taf,
        isFallback: false,
        station: icao
      };
    }
    throw new Error(`No TAF data for ${icao}`);
  } catch (err) {
    // If direct fetch fails, try nearest station
    try {
      let info = stationInfo;
      if (!info) {
        info = await getStationInfo(icao);
      }

      if (!info?.latitude || !info?.longitude) {
        throw new Error(`No coordinates for ${icao}`);
      }

      const nearestIcao = await getNearestStation(info.latitude, info.longitude);
      if (!nearestIcao) {
        return {
          raw: `No TAF available for ${icao} or nearby stations`,
          station: icao,
          isFallback: true,
        };
      }

      const nearestTaf: TAFResponse = await fetchAvwxJson(`${BASE_URL}/taf/${nearestIcao}?format=json`);
      if (nearestTaf?.raw) {
        return {
          ...nearestTaf,
          isFallback: true,
          fallbackFor: icao,
          station: nearestIcao,
        };
      }
      throw new Error(`No TAF for nearest station ${nearestIcao}`);
    } catch (innerErr) {
      const errMsg = innerErr instanceof Error ? innerErr.message : 'Unknown error';
      return {
        raw: `No TAF available for ${icao}. Error: ${errMsg}`,
        station: icao,
        isFallback: true,
      };
    }
  }
}

// Define type for enroute weather result
interface EnrouteWeatherResult {
  lat: number;
  lon: number;
  station?: string;
  taf?: {
    raw: string;
    forecast?: TAFForecast[];
  };
  error?: string;
}

// Fetch weather for enroute points
async function fetchEnrouteWeather(points: CoordinatePoint[]): Promise<EnrouteWeatherResult[]> {
  const results: EnrouteWeatherResult[] = [];
  
  for (const point of points) {
    try {
      const stationIcao = await getNearestStation(point.lat, point.lon);
      if (!stationIcao) {
        results.push({
          lat: point.lat,
          lon: point.lon,
          error: 'No nearby reporting station'
        });
        continue;
      }

      const taf: TAFResponse = await fetchAvwxJson(`${BASE_URL}/taf/${stationIcao}?format=json`);
      if (taf?.raw) {
        results.push({
          lat: point.lat,
          lon: point.lon,
          station: stationIcao,
          taf: {
            raw: taf.raw,
            forecast: taf.forecast
          },
        });
      } else {
        results.push({
          lat: point.lat,
          lon: point.lon,
          station: stationIcao,
          error: 'No TAF available for station'
        });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      results.push({
        lat: point.lat,
        lon: point.lon,
        error: `Weather fetch error: ${errMsg}`
      });
    }
  }
  
  return results;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dep = searchParams.get('dep')?.toUpperCase() || '';
  const arr = searchParams.get('arr')?.toUpperCase() || '';
  
  // Safely parse points parameter
  let numPoints = 3;
  const pointsParam = searchParams.get('points');
  if (pointsParam) {
    const parsed = parseInt(pointsParam, 10);
    if (!isNaN(parsed)) {
      numPoints = Math.min(5, Math.max(1, parsed)); // Ensure 1-5 range
    }
  }

  if (!dep || !arr) {
    return new Response(
      JSON.stringify({ error: 'Missing dep or arr parameter' }), 
      { status: 400 }
    );
  }

  try {
    // Get station coordinates for route calculation
    const [depStation, arrStation] = await Promise.all([
      getStationInfo(dep),
      getStationInfo(arr)
    ]);

    // Initialize with explicit type
    let enroutePoints: CoordinatePoint[] = [];
    
    if (depStation?.latitude && depStation?.longitude && 
        arrStation?.latitude && arrStation?.longitude) {
      enroutePoints = calculateRoutePoints(
        depStation.latitude,
        depStation.longitude,
        arrStation.latitude,
        arrStation.longitude,
        numPoints
      );
    }

    // Fetch all weather data in parallel
    const [depTaf, arrTaf, enrouteWeather] = await Promise.all([
      fetchTafWithNearestFallback(dep, depStation),
      fetchTafWithNearestFallback(arr, arrStation),
      fetchEnrouteWeather(enroutePoints)
    ]);

    return new Response(
      JSON.stringify({
        departure_arrival_weather: {
          [dep]: depTaf,
          [arr]: arrTaf,
        },
        route_weather: enrouteWeather,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: `Failed to fetch weather: ${errMsg}` }),
      { status: 500 }
    );
  }
}