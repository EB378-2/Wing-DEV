// services/airportApi.ts
export interface Airport {
  _id: string;
  name: string;
  icaoCode: string;
  iataCode?: string;
  country: string;
  type: number;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  elevation?: {
    value: number;
    unit: number;
  };
}

export interface AirportSearchResponse {
  items: Airport[];
  totalCount: number;
}

export const searchAirports = async (searchTerm: string): Promise<Airport[]> => {
  if (!searchTerm.trim() || searchTerm.length < 2) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      search: searchTerm,
      limit: '10'
    });

    const response = await fetch(`/api/openAip/searchAirport?${params}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    const data: AirportSearchResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Failed to search airports:', error);
    throw error;
  }
};

export const getAirportByIcao = async (icaoCode: string): Promise<Airport | null> => {
  if (!icaoCode.trim()) {
    return null;
  }

  try {
    const response = await fetch(`/api/openAip/searchAirport?icao=${icaoCode}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Airport not found
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch airport:', error);
    throw error;
  }
};