// components/Airport/AirportSearch.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  CircularProgress,
  IconButton,
  Typography,
  Link
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import { useAirportSearch } from '@/lib/hooks/airport/useAirportSearch';
import { AirportSuggestions } from './AirportSuggestions';
import { Airport } from '@/services/airportApi';

interface AirportSearchProps {
  onAirportSelect: (airport: Airport | null) => void;
  onIcaoSelect?: (icao: string) => void;
  placeholder?: string;
  label?: string;
}

export const AirportSearch: React.FC<AirportSearchProps> = ({
  onAirportSelect,
  onIcaoSelect,
  placeholder = "e.g., EDDM, MUC, or Munich",
  label = "Search Airport by ICAO, IATA, or Name"
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    inputValue,
    setInputValue,
    suggestions,
    loading,
    error,
    selectedAirport,
    clearSearch,
    selectAirport
  } = useAirportSearch();

  // Safe value that's never undefined
  const safeInputValue = inputValue || '';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    setInputValue(value);
    setShowSuggestions(true);
    
    if (selectedAirport && value !== selectedAirport.icaoCode) {
      onAirportSelect(null);
      // Only call onIcaoSelect if it's provided and value is not empty
      if (onIcaoSelect && value) {
        onIcaoSelect(value);
      } else if (onIcaoSelect) {
        onIcaoSelect('');
      }
    }
  };

  const handleSuggestionClick = (airport: Airport) => {
    selectAirport(airport);
    setShowSuggestions(false);
    onAirportSelect(airport);
    // Only call onIcaoSelect if it's provided
    if (onIcaoSelect) {
      onIcaoSelect(airport.icaoCode);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowSuggestions(false);
    onAirportSelect(null);
    // Only call onIcaoSelect if it's provided
    if (onIcaoSelect) {
      onIcaoSelect('');
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        label={label}
        value={safeInputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <>
              {loading && <CircularProgress size={20} />}
              {safeInputValue && (
                <IconButton size="small" onClick={handleClearSearch}>
                  <Clear />
                </IconButton>
              )}
            </>
          )
        }}
        placeholder={placeholder}
      />

      <AirportSuggestions
        suggestions={suggestions}
        onSelect={handleSuggestionClick}
        visible={showSuggestions}
        searchTerm={safeInputValue}
        loading={loading}
        error={error}
      />
    </Box>
  );
};

export default AirportSearch;