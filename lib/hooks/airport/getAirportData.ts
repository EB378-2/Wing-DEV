"use client";

import { useEffect, useState } from "react";

export interface AirportDetails {
  _id: string;
  name: string;
  icaoCode: string;
  iataCode?: string;
  altIdentifier?: string;
  type?: number;
  country: string;
  geometry?: {
    type: string;
    coordinates: [number, number]; // lon, lat
  };
  elevation?: {
    value: number;
    unit: number;
    referenceDatum: number;
  };
  runways?: any[];       // Full runway info
  frequencies?: any[];   // ATC frequencies
  services?: any;        // Services available
  hoursOfOperation?: any;
  contact?: string;
  remarks?: string;
  telephoneServices?: any[];
  images?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface UseAirportDetailsResult {
  airport: AirportDetails | null;
  error: string;
  loading: boolean;
}

export function useAirportData(icaoCode: string): UseAirportDetailsResult {
  const [airport, setAirport] = useState<AirportDetails | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!icaoCode || icaoCode.length !== 4) return;
    const controller = new AbortController();

    async function fetchAirportDetails() {
      try {
        setError("");
        setLoading(true);

        const response = await fetch(`/api/openAip/airports?icao=${icaoCode}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(await response.text());

        const result: AirportDetails = await response.json();
        console.log("Fetched Airport Details:", result);

        setAirport(result);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to fetch airport details");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAirportDetails();
    return () => controller.abort();
  }, [icaoCode]);

  return { airport, error, loading };
}
