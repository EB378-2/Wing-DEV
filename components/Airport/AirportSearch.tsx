// components/AirportSearch.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
  Link
} from '@mui/material';
import { Clear, Flight } from '@mui/icons-material';
import { useAirportSearch } from '@/lib/hooks/airport/useAirportSearch';
import { AirportSuggestions } from './AirportSuggestions';
import { Airport } from '@/services/airportApi';

interface AirportSearchProps {
  onAirportSelect: (airport: Airport | null) => void;
  initialValue?: string;
  placeholder?: string;
  label?: string;
}

export const AirportSearch: React.FC<AirportSearchProps> = ({
  onAirportSelect,
  initialValue = '',
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    setInputValue(value);
    setShowSuggestions(true);
    
    if (selectedAirport && value !== selectedAirport.icaoCode) {
      onAirportSelect(null);
    }
  };

  const handleSuggestionClick = (airport: Airport) => {
    selectAirport(airport);
    setShowSuggestions(false);
    onAirportSelect(airport);
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowSuggestions(false);
    onAirportSelect(null);
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
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <>
              {loading && <CircularProgress size={20} />}
              {inputValue && (
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
        searchTerm={inputValue}
        loading={loading}
        error={error}
      />

      {selectedAirport && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Data provided by{' '}
          <Link href="https://www.openaip.net" target="_blank" rel="noopener">
            OpenAIP
          </Link>
        </Typography>
      )}
    </Box>
  );
};

export default AirportSearch;