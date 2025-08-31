// hooks/useAirportSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { Airport, searchAirports } from '@/services/airportApi';

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useAirportSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  const debouncedSearchTerm = useDebounce(inputValue, 300);

  const fetchAirports = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await searchAirports(searchTerm);
      setSuggestions(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch airports';
      setError(errorMessage);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchAirports(debouncedSearchTerm);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm, fetchAirports]);

  const clearSearch = () => {
    setInputValue('');
    setSelectedAirport(null);
    setSuggestions([]);
    setError(null);
  };

  const selectAirport = (airport: Airport) => {
    setInputValue(airport.icaoCode);
    setSelectedAirport(airport);
    setSuggestions([]);
  };

  return {
    inputValue,
    setInputValue,
    suggestions,
    loading,
    error,
    selectedAirport,
    clearSearch,
    selectAirport
  };
};