'use client';

import { useEffect, useState } from 'react';
import { getEnrouteNotams } from '@/lib/hooks/getEnrouteNotams';

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

// Props
interface AircraftNotamsProps {
  dep?: [number, number];
  arr?: [number, number];
  airspaces?: Airspace[];
  notams?: Notam[];
  icaoCode?: string;
  limit?: number;
}

interface FormattedNOTAM {
  id: number;
  title: string;
  description: string;
  location: string;
  effectiveDate: string;
  expiryDate: string;
}


export default function AircraftNotams({
  dep = [24.5748, 60.1905],
  arr = [22.1940, 59.2009],
  airspaces = [],
  notams = [],
  icaoCode = 'EFIN', 
  limit = 100000 
}: AircraftNotamsProps) {
  const [enrouteNotams, setEnrouteNotams] = useState<Notam[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [notam, setNotams] = useState<FormattedNOTAM[]>([]);
  const [airspace, setAirspaces] = useState<Airspace[]>([]);
  const [error, setError] = useState('');


  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchNotams() {
      try {
        setError('');

        // Step 1: Fetch raw NOTAMs
        const params = new URLSearchParams({
          icao: icaoCode,
          limit: limit.toString(),
        });

        const response = await fetch(`/api/AutoRouter/notams?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const result = await response.json();
        console.log("✅ Relevant NOTAMs response:", result);

        setNotams(result || []);
        setTotal(result.total || 0);

      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch NOTAMs'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          console.log("Finalized NOTAM fetch");
        }
      }
    }

    async function fetchAirspaces() {
      try {

        const response = await fetch(`/api/openAip/airspaces`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const result = await response.json();
        console.log("✅ Relevant NOTAMs response:", result);

        setAirspaces(result || []);

      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch NOTAMs'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
        }
      }
    }

    fetchNotams();
    fetchAirspaces();
    console.log("Airspaces:", airspace);
    return () => controller.abort();
  }, [icaoCode, limit]);

  useEffect(() => {

    const { enrouteNotams } = getEnrouteNotams(dep, arr, airspace, notam);
    setEnrouteNotams(enrouteNotams);
  }, [dep, arr, airspaces, notams]);

  if (loading) return <div className="p-4 text-center">Calculating enroute NOTAMs...</div>;
  console.log("Enroute NOTAMs:", enrouteNotams);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Enroute NOTAMs ({enrouteNotams.length})
      </h2>
    </div>
  );
}
