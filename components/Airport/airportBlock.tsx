"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Typography,
  List, 
  ListItem, 
  Collapse,
  IconButton,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useAirportNotams } from '@/lib/hooks/airport/getAirportNotams';
import { useAirportMetar } from '@/lib/hooks/airport/getAirportMetar';
import { useAirportTaf } from '@/lib/hooks/airport/getAirportTaf';
import { useAirportData } from '@/lib/hooks/airport/getAirportData';
import { AirportDataBlock } from '@/components/Airport/AirportDataBlock';
import { NOTAMBlock } from '@/components/Airport/AirportNotamBlock';

export function AirportBlock({ airport }: { airport: string }) {
  const [loading, setLoading] = useState(false);
  const [expandedStations, setExpandedStations] = useState<Record<string, boolean>>({});

  const toggleExpand = (station: string) => {
    setExpandedStations(prev => ({
      ...prev,
      [station]: !prev[station]
    }));
  };

  const { notams: airportNotams, total: airportNotamsTotal, error: airportNotamsError, loading: airportNotamsLoading } = useAirportNotams(airport);
  console.log("Airport NOTAMs:", airportNotams, airportNotamsTotal, airportNotamsError, airportNotamsLoading);
  const { metar: airportMetar, error: airportMetarError, loading: airportMetarLoading } = useAirportMetar(airport);
  console.log("Airport Metar:", airportMetar, airportMetarError, airportMetarLoading);
  const { taf: airportTaf, error: airportTafError, loading: airportTafLoading } = useAirportTaf(airport);
  console.log("Airport Taf:", airportTaf, airportTafError, airportTafLoading);
  const { airport: airportData, error: airportDataError, loading: airportDataLoading } = useAirportData(airport);
  console.log("Airport Data:", airportData, airportDataError, airportDataLoading);
  

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
                flightRules === 'IFR' ? 'warning' :
                flightRules === 'LIFR' ? 'error' : 'default'
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
      <>
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && airport && (
        <Box mt={4}>
          {/* Departure & Arrival Section */}
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>METAR</Typography>
          <List>
            {Object.entries(airportMetar || {}).map(([station, report]: any) => (
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
            {Object.entries(airportTaf || {}).map(([station, report]: any) => (
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
          <AirportDataBlock data={airportData} />

          <NOTAMBlock notams={airportNotams} total={airportNotamsTotal} icaoCode={airport.toUpperCase()} loading={airportNotamsLoading} error={airportNotamsError} />
          {airport === 'EFNU' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ width: '100%', aspectRatio: '16/9' }}>
                <iframe
                  title="EFNU Info"
                  src="https://info.efnu.fi/"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </Box>

              {/* Webcams */}
              {[
                "https://atis.efnu.fi/webcam/cam-efnu-wx1.jpg",
                "https://atis.efnu.fi/webcam/cam-efnu-wx2.jpg",
                "https://atis.efnu.fi/webcam/cam-efnu-wx3.jpg"
              ].map((src, idx) => (
                <Box key={idx} sx={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img
                    src={src}
                    alt={`EFNU Webcam ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>
              ))}
            </Box>
          )}

        </Box>
      )}
    </>
  );
}