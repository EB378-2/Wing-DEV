// components/AirportSuggestions.tsx
import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Box,
  Alert
} from '@mui/material';
import { Airport } from '../../services/airportApi';

interface AirportSuggestionsProps {
  suggestions: Airport[];
  onSelect: (airport: Airport) => void;
  visible: boolean;
  searchTerm?: string;
  loading: boolean;
  error?: string | null;
}

export const airportTypeMap: Record<number, string> = {
  0: 'Airport',
  1: 'Balloonport',
  2: 'Gliderport',
  3: 'Heliport',
  4: 'Ultralight',
  5: 'Airstrip',
  6: 'Seaplane Base',
  7: 'Closed',
  8: 'Military',
  9: 'Private',
  10: 'International',
  11: 'Regional',
  12: 'National',
  13: 'Other'
};

export const formatElevation = (elevation?: { value: number; unit: number }) => {
  if (!elevation) return 'N/A';
  const unit = elevation.unit === 0 ? 'ft' : 'm';
  return `${elevation.value} ${unit}`;
};

export const AirportSuggestions: React.FC<AirportSuggestionsProps> = ({
  suggestions,
  onSelect,
  visible,
  searchTerm = '',
  loading,
  error
}) => {
  if (!visible) return null;

  const hasValidSearchTerm = searchTerm && searchTerm.length >= 2;

  if (error) {
    return (
      <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, p: 2, mt: 0.5 }}>
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, p: 2, mt: 0.5 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Searching airports...
        </Typography>
      </Paper>
    );
  }

  if (suggestions.length === 0 && hasValidSearchTerm) {
    return (
      <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, p: 2, mt: 0.5 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No airports found matching &quot;{searchTerm}&quot;
        </Typography>
      </Paper>
    );
  }

  if (suggestions.length > 0) {
    return (
      <Paper 
        sx={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          zIndex: 1000, 
          maxHeight: 300, 
          overflow: 'auto',
          mt: 0.5,
          boxShadow: 3
        }}
      >
        <List dense>
          {suggestions.map((airport) => (
            <ListItem
              key={airport._id}
              onClick={() => onSelect(airport)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" component="span">
                      {airport.icaoCode}
                    </Typography>
                    {airport.iataCode && (
                      <Typography variant="body2" color="text.secondary" component="span">
                        ({airport.iataCode})
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ flex: 1 }} component="span">
                      {airport.name}
                    </Typography>
                  </Box>
                }
                secondary={
                  // FIX: Use a span component instead of default p for secondary text
                  <Box 
                    component="span" 
                    sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}
                  >
                    <Chip
                      size="small"
                      label={airportTypeMap[airport.type] || `Type ${airport.type}`}
                      variant="outlined"
                      component="span" // Explicitly set component to span
                    />
                    <Chip
                      size="small"
                      label={airport.country}
                      variant="outlined"
                      component="span" // Explicitly set component to span
                    />
                    <Chip
                      size="small"
                      label={`Elev: ${formatElevation(airport.elevation)}`}
                      variant="outlined"
                      component="span" // Explicitly set component to span
                    />
                  </Box>
                }
                // FIX: Set the secondaryTypographyProps to use span instead of p
                secondaryTypographyProps={{ component: 'span' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }

  return null;
};