"use client";

import React, { useState } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Grid
} from '@mui/material';
import { AirportSearch } from '@/components/Airport/AirportSearch';
import { AirportBlock } from '@/components/Airport/airportBlock';
import AircraftNotams from '@/components/AircraftNotams';

export default function AirportPage() {
  const [depAirport, setDepAirport] = useState('');
  const [arrAirport, setArrAirport] = useState('');

  return (
    <Paper sx={{ p: 4, mb: 4, minHeight: '100vh' }}>
      {/* Title */}
      <Typography 
        variant="h4" 
        gutterBottom 
        align="center"
        sx={{ fontWeight: 'bold', mb: 4 }}
      >
        Marshal Protocol
      </Typography>

      {/* Airport Search Inputs */}
      <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
        {/* Departure */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Departure</Typography>
            <AirportSearch 
              onAirportSelect={(selectedAirport) => setDepAirport(selectedAirport ? selectedAirport.icaoCode : '')}
              placeholder="ICAO, IATA, or City"
            />
          </Box>
        </Grid>

        {/* Arrival */}
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Arrival</Typography>
            <AirportSearch 
              onAirportSelect={(selectedAirport) => setArrAirport(selectedAirport ? selectedAirport.icaoCode : '')}
              placeholder="ICAO, IATA, or City"
            />
          </Box>
        </Grid>
      </Grid>

      {/* Selected Airport Blocks */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AirportBlock airport={depAirport} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AirportBlock airport={arrAirport} />
        </Grid>
      </Grid>

      <AircraftNotams/>


    </Paper>
  );
}