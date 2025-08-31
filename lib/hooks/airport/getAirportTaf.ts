"use client";

import { useEffect, useState } from "react";

// --- TAF Types ---
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

// Type for TAF mapped to ICAO
interface TAFData {
  raw: string;
  station: string;
  isFallback?: boolean;
  fallbackFor?: string;
  forecast?: TAFForecast[];
}

// Hook return type
interface UseAirportTAFResult {
  taf: Record<string, TAFData> | null;
  error: string;
  loading: boolean;
}

export function useAirportTaf(icaoCode: string): UseAirportTAFResult {
  const [taf, setTaf] = useState<Record<string, TAFData> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!icaoCode || icaoCode.length !== 4) return;
    const controller = new AbortController();

    async function fetchTaf() {
      try {
        setError("");
        setLoading(true);

        const response = await fetch(`/api/avwx/taf?dep=${icaoCode}&arr=${icaoCode}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(await response.text());

        const result = await response.json();

        // Map ICAO to TAF data
        const depTaf: TAFData = result?.departure_arrival_weather?.[icaoCode] || {
          raw: "No TAF data available",
          station: icaoCode,
        };

        setTaf({ [icaoCode]: depTaf });

      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to fetch TAF");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchTaf();

    return () => controller.abort();
  }, [icaoCode]);

  return { taf, error, loading };
}
