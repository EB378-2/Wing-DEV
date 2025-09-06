'use client';

import { useEffect, useState, useMemo } from 'react';
import { getEnrouteNotams } from '@/lib/hooks/enroute/getEnrouteNotams';

// Example types
interface Airspace {
  id: string;
  name: string;
  class?: string;
  geometry: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
}

interface Notam {
  id: number;
  title: string;
  description: string;
  location: string;
  effectiveDate: string;
  expiryDate: string;
  airspaces?: string[];
  lat: number;
  lon: number;
  radius?: number; // NM
}

interface AircraftNotamsProps {
  dep?: [number, number];
  arr?: [number, number];
  icaoCode?: string;
  limit?: number;
}

export default function AircraftNotams({
  dep = [24.5748, 60.1905],
  arr = [22.1940, 59.2009],
  icaoCode = 'EFIN',
  limit = 100000,
}: AircraftNotamsProps) {
  const [notams, setNotams] = useState<Notam[]>([]);
  const [airspaces, setAirspaces] = useState<Airspace[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch NOTAMs + Airspaces once
  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError('');

        // NOTAMs
        const notamParams = new URLSearchParams({
          icao: icaoCode,
          limit: limit.toString(),
        });
        const notamRes = await fetch(`/api/AutoRouter/notams?${notamParams}`, {
          signal: controller.signal,
        });
        if (!notamRes.ok) throw new Error(await notamRes.text());
        const notamResult = await notamRes.json();
        setNotams(notamResult || []);

        // Airspaces
        const airspaceRes = await fetch(`/api/openAip/airspaces`, {
          signal: controller.signal,
        });
        if (!airspaceRes.ok) throw new Error(await airspaceRes.text());
        const airspaceResult = await airspaceRes.json();
        console.log("Fetched Airspaces:", airspaceResult);
        setAirspaces(airspaceResult || []);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [icaoCode, limit]);

  // 🔹 Compute enroute NOTAMs ONCE per input change
  const enrouteNotams = useMemo(() => {
    return getEnrouteNotams(dep, arr, airspaces, notams).enrouteNotams;
  }, [dep, arr, airspaces, notams]);
  const enrouteAirspace = useMemo(() => {
    return getEnrouteNotams(dep, arr, airspaces, notams).relevantAirspaces;
  }, [dep, arr, airspaces, notams]);
  const enrouteNotamsV2 = useMemo(() => {
    return getEnrouteNotams(dep, arr, airspaces, notams).inAirspaceNotams;
  }, [dep, arr, airspaces, notams]);

  if (loading) return <div className="p-4 text-center">Loading NOTAMs...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Enroute V2 NOTAMs ({enrouteNotamsV2.length})
        Enroute Airspace ({enrouteAirspace.length})
      </h2>
      <ul className="list-disc ml-6">
        {enrouteNotams.map((n) => (
          <li key={n.id}>
            <strong>{n.title}</strong> — {n.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
