import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Collapse, 
  IconButton, 
  Divider,
  Grid,
  Paper,
  Stack,
  useTheme
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess, 
  FlightTakeoff, 
  FlightLand, 
  LocalGasStation,
  Phone,
  Email,
  Language,
  Schedule,
  Warning
} from '@mui/icons-material';

interface AirportDataProps {
  data: any;
}

export const AirportDataBlock: React.FC<AirportDataProps> = ({ data }) => {
  const [expandedRunways, setExpandedRunways] = useState<Record<string, boolean>>({});
  const [expandedServices, setExpandedServices] = useState(false);
  const theme = useTheme();

  const toggleExpand = (id: string) => {
    setExpandedRunways(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!data) return <Typography>No airport data available</Typography>;

  const { 
    name, 
    icaoCode, 
    iataCode, 
    country, 
    type, 
    private: isPrivate, 
    ppr, 
    services, 
    frequencies, 
    runways, 
    hoursOfOperation, 
    contact,
    elevation,
    weather,
    notams
  } = data;

  // Categorize frequencies by type for better organization
  const categorizedFrequencies = {
    atc: frequencies?.filter((f: any) => f.type === 'ATC') || [],
    unicom: frequencies?.filter((f: any) => f.type === 'UNICOM') || [],
    awos: frequencies?.filter((f: any) => f.type === 'AWOS/ASOS') || [],
    other: frequencies?.filter((f: any) => 
      f.type !== 'ATC' && f.type !== 'UNICOM' && f.type !== 'AWOS/ASOS') || []
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {icaoCode}{iataCode && ` / ${iataCode}`}
            </Typography>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {country} • {type} • {isPrivate ? 'Private' : 'Public'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {ppr && (
              <Chip 
                icon={<Warning />} 
                label="PPR Required" 
                color="warning" 
                size="small" 
                variant="outlined" 
              />
            )}
            {elevation && (
              <Chip 
                label={`Elev: ${elevation.value} ${elevation.unit}`} 
                size="small" 
                variant="outlined" 
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          {/* Left Column - Critical Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Frequencies */}
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <FlightTakeoff sx={{ mr: 1 }} /> Frequencies
              </Typography>
              
              {categorizedFrequencies.atc.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="overline" color="text.secondary">ATC</Typography>
                  {categorizedFrequencies.atc.map((f: any) => (
                    <Box key={f._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{f.name}:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {f.value} {f.unit}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              
              {categorizedFrequencies.unicom.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="overline" color="text.secondary">UNICOM</Typography>
                  {categorizedFrequencies.unicom.map((f: any) => (
                    <Box key={f._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{f.name}:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {f.value} {f.unit}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              
              {categorizedFrequencies.awos.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="overline" color="text.secondary">Weather</Typography>
                  {categorizedFrequencies.awos.map((f: any) => (
                    <Box key={f._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{f.name}:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {f.value} {f.unit}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              
              {categorizedFrequencies.other.length > 0 && (
                <Box>
                  <Typography variant="overline" color="text.secondary">Other</Typography>
                  {categorizedFrequencies.other.map((f: any) => (
                    <Box key={f._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{f.name}:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {f.value} {f.unit}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>

            {/* Runways */}
            {runways?.length > 0 && (
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <FlightLand sx={{ mr: 1 }} /> Runways
                </Typography>
                
                {runways.map((r: any) => (
                  <Box key={r._id} sx={{ mb: 2 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: expandedRunways[r._id] ? theme.palette.action.selected : 'transparent',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover
                        }
                      }}
                      onClick={() => toggleExpand(r._id)}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        RWY {r.designator}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {r.dimension.length.value} {r.dimension.length.unit} × {r.dimension.width.value} {r.dimension.width.unit}
                        </Typography>
                        <IconButton size="small">
                          {expandedRunways[r._id] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Collapse in={expandedRunways[r._id]} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 2, pt: 1 }}>
                        <Grid container spacing={1}>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2">True Heading: {r.trueHeading}°</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2">Surface: {r.surface?.composition?.join(', ') || 'N/A'}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2">
                              {r.landingOnly ? 'Landing Only' : r.takeOffOnly ? 'Takeoff Only' : 'Full Use'}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2">
                              {r.mainRunway ? 'Main Runway' : 'Secondary'}
                            </Typography>
                          </Grid>
                          
                          {r.instrumentApproachAids?.length > 0 && (
                            <Grid size={{ xs: 12 }}>
                              <Typography variant="body2" fontWeight="medium" sx={{ mt: 1 }}>
                                Approach Aids:
                              </Typography>
                              {r.instrumentApproachAids.map((i: any) => (
                                <Box key={i._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">{i.identifier} ({i.type})</Typography>
                                  <Typography variant="body2">{i.frequency.value} {i.frequency.unit}</Typography>
                                </Box>
                              ))}
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </Paper>
            )}
          </Grid>

          {/* Right Column - Additional Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Services */}
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalGasStation sx={{ mr: 1 }} /> Services & Facilities
                </Typography>
                <IconButton size="small" onClick={() => setExpandedServices(!expandedServices)}>
                  {expandedServices ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              
              <Collapse in={expandedServices} timeout="auto" unmountOnExit>
                {services ? (
                  <Box>
                    {services.fuelTypes?.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="overline" color="text.secondary">Fuel Available</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {services.fuelTypes.map((f: any, idx: number) => (
                            <Chip key={idx} label={f} size="small" color="primary" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    )}
                    
                    {services.handlingFacilities?.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="overline" color="text.secondary">Handling</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {services.handlingFacilities.map((h: any, idx: number) => (
                            <Chip key={idx} label={h} size="small" />
                          ))}
                        </Stack>
                      </Box>
                    )}
                    
                    {services.passengerFacilities?.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="overline" color="text.secondary">Passenger Facilities</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {services.passengerFacilities.map((p: any, idx: number) => (
                            <Chip key={idx} label={p} size="small" />
                          ))}
                        </Stack>
                      </Box>
                    )}
                    
                    {services.gliderTowing?.length > 0 && (
                      <Box>
                        <Typography variant="overline" color="text.secondary">Glider Operations</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {services.gliderTowing.map((g: any, idx: number) => (
                            <Chip key={idx} label={g} size="small" />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2">No services information available</Typography>
                )}
              </Collapse>
            </Paper>

            {/* Hours of Operation */}
            {hoursOfOperation?.operatingHours?.length > 0 && (
              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ mr: 1 }} /> Operating Hours
                </Typography>
                
                {hoursOfOperation.operatingHours.map((h: any, idx: number) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{h.dayOfWeek}:</Typography>
                    <Typography variant="body2">
                      {h.startTime} - {h.endTime}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}

            {/* Contact Information */}
            {contact && (
              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 1 }} /> Contact
                </Typography>
                
                {contact.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{contact.phone}</Typography>
                  </Box>
                )}
                
                {contact.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{contact.email}</Typography>
                  </Box>
                )}
                
                {contact.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Language sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      component="a" 
                      href={contact.website} 
                      target="_blank" 
                      rel="noopener"
                      sx={{ color: 'primary.main', textDecoration: 'none' }}
                    >
                      {contact.website}
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}

            {/* Weather Information */}
            {weather && (
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Weather Information
                </Typography>
                
                {weather.awos && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    AWOS/ASOS: {weather.awos}
                  </Typography>
                )}
                
                {weather.weatherCam && (
                  <Typography 
                    variant="body2" 
                    component="a" 
                    href={weather.weatherCam} 
                    target="_blank" 
                    rel="noopener"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    View Weather Camera
                  </Typography>
                )}
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* NOTAMs Section */}
        {notams && notams.length > 0 && (
          <Paper elevation={1} sx={{ p: 2, mt: 2, backgroundColor: 'warning.light' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Warning sx={{ mr: 1 }} /> Active NOTAMs
            </Typography>
            
            {notams.map((notam: any, idx: number) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  {notam.title}
                </Typography>
                <Typography variant="body2">
                  {notam.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Effective: {notam.effectiveFrom} to {notam.effectiveUntil}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};