"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useAirportNotams } from '@/lib/hooks/getAirportNotams';

interface FormattedNOTAM {
  id: string;
  title: string;
  description: string;
  location: string;
  effectiveDate: string;
}

export default function Home() {
  const [dep, setDep] = useState('');
  const [arr, setArr] = useState('');
  const [metar, setMetar] = useState<any>(null);
  const [taf, setTaf] = useState<any>(null);
  const [airports, setAirports] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expandedStations, setExpandedStations] = useState<Record<string, boolean>>({});

  const toggleExpand = (station: string) => {
    setExpandedStations(prev => ({
      ...prev,
      [station]: !prev[station]
    }));
  };

  const fetchMetar = async () => {
    if (!dep || !arr) return;
    setLoading(true);
    try {
      const resp = await fetch(`/api/avwx/metar?dep=${dep}&arr=${arr}`);
      const data = await resp.json();
      setMetar(data);
    } catch (err) {
      console.error('Error fetching metar:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaf = async () => {
    if (!dep || !arr) return;
    setLoading(true);
    try {
      const resp = await fetch(`/api/avwx/taf?dep=${dep}&arr=${arr}`);
      const data = await resp.json();
      setTaf(data);
    } catch (err) {
      console.error('Error fetching taf:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAirport = async () => {
    if (!dep || !arr) return;
    setLoading(true);
    try {
      const resp = await fetch(`/api/openAip/airports?dep=${dep}&arr=${arr}`);
      const data = await resp.json();
      setAirports(data);
    } catch (err) {
      console.error('Error fetching airport:', err);
    } finally {
      setLoading(false);
    }
  };

  const { notams: arrivalNotams, total: arrTotal, error: arrError } = useAirportNotams(arr);
  console.log("Arrival NOTAMs:", arrivalNotams, arrTotal, arrError);
  const { notams: departureNotams, total: depTotal, error: depError } = useAirportNotams(dep);
  console.log("Departure NOTAMs:", departureNotams, depTotal, depError);

  const handleFetch = async () => {
    await Promise.all([fetchMetar(), fetchTaf(), fetchAirport()]);
  };

  const renderTafForecast = (forecast: any[] | undefined) => {
    if (!forecast || !Array.isArray(forecast)) {
      return (
        <Typography variant="body2" color="text.secondary">
          No forecast data available
        </Typography>
      );
    }

    return forecast.map((period, idx) => {
      // Safely access nested properties with optional chaining and null checks
      const startTime = period?.start_time?.repr || 'Unknown start';
      const endTime = period?.end_time?.repr || 'Unknown end';
      const windDir = period?.wind_direction?.value ?? '---';
      const windSpeed = period?.wind_speed?.value ?? '---';
      const windGust = period?.wind_gust?.value;
      const visibility = period?.visibility?.repr || 'Unknown';
      const flightRules = period?.flight_rules || 'Unknown';
      const clouds = period?.clouds || [];
      const wxCodes = period?.wx_codes || [];
      const summary = period?.summary || 'No summary available';

      return (
        <Box key={idx} sx={{ mb: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="subtitle2">
            {startTime} - {endTime}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            <Chip 
              label={`Wind: ${windDir}° at ${windSpeed}kt`} 
              size="small" 
              color="primary" 
            />
            {windGust && (
              <Chip 
                label={`Gust: ${windGust}kt`} 
                size="small" 
                color="secondary" 
              />
            )}
            <Chip 
              label={`Visibility: ${visibility}`} 
              size="small" 
            />
            <Chip 
              label={`Flight Rules: ${flightRules}`} 
              size="small" 
              color={
                flightRules === 'VFR' ? 'success' :
                flightRules === 'MVFR' ? 'info' :
                flightRules === 'IFR' ? 'warning' : 'default'
              }
            />
          </Box>
          {clouds.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption">Clouds:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {clouds.map((cloud: any, i: number) => (
                  <Chip 
                    key={i}
                    label={`${cloud.type || 'Cloud'} at ${cloud.altitude || '???'}ft`} 
                    size="small" 
                  />
                ))}
              </Box>
            </Box>
          )}
          {wxCodes.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption">Weather:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {wxCodes.map((wx: any, i: number) => (
                  <Chip 
                    key={i}
                    label={wx.value || 'Weather'} 
                    size="small" 
                  />
                ))}
              </Box>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary">
            {summary}
          </Typography>
        </Box>
      );
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Marshal Protocol - Weather & NOTAMs
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="Departure ICAO"
            value={dep}
            onChange={(e) => setDep(e.target.value.toUpperCase())}
            size="small"
          />
          <TextField
            label="Arrival ICAO"
            value={arr}
            onChange={(e) => setArr(e.target.value.toUpperCase())}
            size="small"
          />
          <Button 
            variant="contained" 
            onClick={handleFetch} 
            disabled={loading}
            sx={{ minWidth: 180, height: 40 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Get Weather Data'}
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && metar && taf && (
        <Box>
          {/* Departure & Arrival Section */}
          <Typography variant="h5" gutterBottom>Departure & Arrival</Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>METAR</Typography>
          <List>
            {Object.entries(metar.departure_arrival_weather || {}).map(([station, report]: any) => (
              <ListItem key={`metar-${station}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography fontWeight="bold">
                    {station}{report?.isFallback ? ` (using nearest: ${report.station || station})` : ''}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleTimeString()}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {report?.raw || 'No METAR data available'}
                </Typography>
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>TAF</Typography>
          <List>
            {Object.entries(taf.departure_arrival_weather || {}).map(([station, report]: any) => (
              <React.Fragment key={`taf-${station}`}>
                <ListItem 
                  sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    bgcolor: expandedStations[station] ? 'action.hover' : 'inherit'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography fontWeight="bold">
                      {station}{report?.isFallback ? ` (using nearest: ${report.station || station})` : ''}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    {report?.forecast && (
                      <IconButton 
                        size="small" 
                        onClick={() => toggleExpand(station)}
                        aria-label="Toggle forecast details"
                      >
                        {expandedStations[station] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {report?.raw || 'No TAF data available'}
                  </Typography>
                </ListItem>
                {report?.forecast && (
                  <Collapse in={expandedStations[station]} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4, pr: 2, py: 2 }}>
                      {renderTafForecast(report.forecast)}
                    </Box>
                  </Collapse>
                )}
                <Divider />
              </React.Fragment>
            ))}
          </List>

          {/* Enroute Weather Section */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Enroute Weather</Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>METAR</Typography>
          <List>
            {metar.route_weather?.map((point: any, index: number) => (
              <ListItem key={`enroute-metar-${index}`}>
                <ListItemText
                  primary={
                    point?.error 
                      ? `Point ${index + 1} (${point.lat?.toFixed(2) || '??'}, ${point.lon?.toFixed(2) || '??'}): ${point.error}`
                      : `Point ${index + 1} (${point.lat?.toFixed(2) || '??'}, ${point.lon?.toFixed(2) || '??'}): ${point.station || 'Unknown'} - ${point.metar || 'No METAR data'}`
                  }
                  secondary={point?.error ? undefined : `Flight Rules: ${point.flight_rules || 'Unknown'}`}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>TAF</Typography>
          <List>
            {taf.route_weather?.map((point: any, index: number) => (
              <React.Fragment key={`enroute-taf-${index}`}>
                <ListItem 
                  sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    bgcolor: expandedStations[`enroute-${index}`] ? 'action.hover' : 'inherit'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <ListItemText
                      primary={
                        point?.error 
                          ? `Point ${index + 1} (${point.lat?.toFixed(2) || '??'}, ${point.lon?.toFixed(2) || '??'}): ${point.error}`
                          : `Point ${index + 1} (${point.lat?.toFixed(2) || '??'}, ${point.lon?.toFixed(2) || '??'}): ${point.station || 'Unknown'}`
                      }
                    />
                    {!point?.error && point?.taf?.forecast && (
                      <IconButton 
                        size="small" 
                        onClick={() => toggleExpand(`enroute-${index}`)}
                        aria-label="Toggle forecast details"
                      >
                        {expandedStations[`enroute-${index}`] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </Box>
                  {!point?.error && point?.taf && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {point.taf.raw || 'No TAF data available'}
                    </Typography>
                  )}
                </ListItem>
                {!point?.error && point?.taf?.forecast && (
                  <Collapse in={expandedStations[`enroute-${index}`]} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4, pr: 2, py: 2 }}>
                      {renderTafForecast(point.taf.forecast)}
                    </Box>
                  </Collapse>
                )}
                <Divider />
              </React.Fragment>
            ))}
          </List>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={3}>
            {/* Departure */}
            <Card>
              <CardContent>
                <Typography variant="h6">Departure NOTAMs ({depTotal})</Typography>
                {depError && <Typography color="error">Error: {depError}</Typography>}
                {Array.isArray(departureNotams) && departureNotams.map((n) => (
                  <Box key={n.id} sx={{ mb: 1, p: 1, bgcolor: "grey.100", borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">{n.title}</Typography>
                    <Typography variant="caption">{n.description}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
            {/* Arrival */}
            <Card>
              <CardContent>
                <Typography variant="h6">Arrival NOTAMs ({arrTotal})</Typography>
                {arrError && <Typography color="error">Error: {arrError}</Typography>}
                {Array.isArray(arrivalNotams) && arrivalNotams.map((n, i) => (
                  <Box key={i} sx={{ mb: 1, p: 1, bgcolor: "grey.100", borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">{n.id}</Typography>
                    <Typography variant="caption">{n.description}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Container>
  );
}