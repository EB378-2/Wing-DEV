"use client";

import { useEffect, useState } from "react";

interface FormattedNOTAM {
  id: number;
  title: string;
  description: string;
  location: string;
  effectiveDate: string;
  expiryDate: string;
}

interface NotamApiResponse {
  total: number;
  notams: FormattedNOTAM[];
}

export function useAirportNotams(icaoCode: string) {
  const [total, setTotal] = useState(0);
  const [notams, setNotams] = useState<FormattedNOTAM[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!icaoCode || icaoCode.length !== 4) return;
    const controller = new AbortController();

    async function fetchNotams() {
      try {
        setError("");
        setLoading(true);

        const params = new URLSearchParams({
          icao: icaoCode,
          limit: "1000",
        });

        const response = await fetch(`/api/AutoRouter/notams?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(await response.text());

        const result: NotamApiResponse = await response.json();

        console.log("Fetched NOTAMs:", result);

        setNotams(result.notams || []);
        setTotal(result.total || 0);
        setLoading(false);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to fetch NOTAMs");
        }
      }
    }

    fetchNotams();
    return () => controller.abort();
  }, [icaoCode]);

  return { notams, total, error, loading};
}
