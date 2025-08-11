"use client";

import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';

export default function Home() {
  const [dep, setDep] = useState('');
  const [arr, setArr] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!dep || !arr) return;
    setLoading(true);
    try {
      const resp = await fetch(`/api/route-weather?dep=${dep}&arr=${arr}`);
      const data = await resp.json();
      console.log('Weather data:', data);
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Route Weather Checker
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Departure ICAO"
            value={dep}
            onChange={(e) => setDep(e.target.value.toUpperCase())}
          />
          <TextField
            label="Arrival ICAO"
            value={arr}
            onChange={(e) => setArr(e.target.value.toUpperCase())}
          />
          <Button variant="contained" onClick={fetchWeather} disabled={loading}>
            {loading ? 'Loading...' : 'Get Weather'}
          </Button>
        </Box>
      </Paper>

      {weather && (
        <Box>
          <Typography variant="h5" gutterBottom>Departure & Arrival METARs</Typography>
          <List>
            {Object.entries(weather.departure_arrival_weather || {}).map(([station, report]: any) => (
              <ListItem key={station}>
                <ListItemText
                  primary={`${station}${report.isFallback ? ` (using nearest: ${report.station || station})` : ''}: ${report.raw}`}
                />
              </ListItem>
            ))}
          </List>

          <List>
            {Object.entries(weather.route_weather || {}).map(([station, report]: any) => (
              <ListItem key={station}>
                <ListItemText
                  primary={`${station}${report.isFallback ? ` (using nearest: ${report.station || station})` : ''}: ${report.raw}`}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Enroute Weather</Typography>
          <List>
            {Object.entries(weather.route_weather || {}).map(([station, report]: any) => (
              <ListItem key={station}>
                <ListItemText primary={`${station}: ${report.raw}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
}
