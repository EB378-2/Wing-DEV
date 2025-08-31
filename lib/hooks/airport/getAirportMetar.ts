"use client";

import { useEffect, useState } from "react";

interface MetarData {
  raw?: string;
  station?: string;
  isFallback?: boolean;
  fallbackFor?: string;
  [key: string]: any;
}

interface UseAirportMetarResult {
  metar: Record<string, MetarData> | null;
  error: string;
  loading: boolean;
}

export function useAirportMetar(icaoCode: string): UseAirportMetarResult {
  const [metar, setMetar] = useState<Record<string, MetarData> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!icaoCode || icaoCode.length !== 4) return;
    const controller = new AbortController();

    async function fetchMetar() {
      try {
        setError("");
        setLoading(true);

        const response = await fetch(`/api/avwx/metar?dep=${icaoCode}&arr=${icaoCode}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(await response.text());

        const result = await response.json();

        // Map the departure ICAO to the METAR report
        const depMetar = result?.departure_arrival_weather?.[icaoCode] || {
          raw: "No METAR data available",
          station: icaoCode
        };

        setMetar({ [icaoCode]: depMetar });

      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to fetch METAR");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchMetar();

    return () => controller.abort();
  }, [icaoCode]);

  return { metar, error, loading };
}
