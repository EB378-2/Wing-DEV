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
  Alert,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Warning,
  Info,
  Schedule,
  LocationOn,
  Error as ErrorIcon
} from '@mui/icons-material';

interface FormattedNOTAM {
  id: number;
  title: string;
  description: string;
  location: string;
  effectiveDate: string;
  expiryDate: string;
  type?: string;
  severity?: 'low' | 'medium' | 'high';
}

interface NOTAMBlockProps {
  notams: FormattedNOTAM[];
  total: number;
  error?: string;
  loading?: boolean;
  icaoCode: string;
}

export const NOTAMBlock: React.FC<NOTAMBlockProps> = ({ 
  notams, 
  total, 
  error, 
  loading = false, 
  icaoCode 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedNotamId, setExpandedNotamId] = useState<number | null>(null);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleNotamExpand = (id: number) => {
    setExpandedNotamId(expandedNotamId === id ? null : id);
  };

  const getSeverityColor = (severity: string = 'medium') => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'warning';
    }
  };

  const getSeverityIcon = (severity: string = 'medium') => {
    switch (severity) {
      case 'high': return <ErrorIcon />;
      case 'medium': return <Warning />;
      case 'low': return <Info />;
      default: return <Warning />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Extract first line from description
  const getFirstLine = (description: string) => {
    if (!description) return '';
    const firstLine = description.split('\n')[0];
    return firstLine.length > 120 ? firstLine.substring(0, 120) + '...' : firstLine;
  };

  if (loading) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Warning sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6">NOTAMs for {icaoCode}</Typography>
          </Box>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Loading NOTAMs...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 1 }}>
            Error loading NOTAMs: {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (total === 0) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Info sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="h6">NOTAMs for {icaoCode}</Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
            No active NOTAMs for this airport
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        {/* NOTAMs Header */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            mb: 1
          }}
          onClick={toggleExpand}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ mr: 1, color: 'warning.main' }} />
            <Typography variant="h6">
              NOTAMs for {icaoCode} ({total})
            </Typography>
          </Box>
          <IconButton size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Always show first line of NOTAMs, even when collapsed */}
        {!expanded && (
          <Box sx={{ mb: 1 }}>
            {notams.slice(0, 3).map((notam) => (
              <Box key={notam.id} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                  <Chip 
                    icon={getSeverityIcon(notam.severity)} 
                    label={notam.type || 'NOTAM'} 
                    size="small" 
                    color={getSeverityColor(notam.severity)}
                    variant="outlined"
                    sx={{ flexShrink: 0 }}
                  />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {getFirstLine(notam.description) || notam.title}
                  </Typography>
                </Box>
              </Box>
            ))}
            {total > 3 && (
              <Typography variant="caption" color="text.secondary">
                + {total - 3} more NOTAMs - click to expand
              </Typography>
            )}
          </Box>
        )}

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Notices to Airmen - Important information for flight planning
          </Typography>

          <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
            {notams.map((notam) => (
              <Box key={notam.id} sx={{ mb: 1.5 }}>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                  onClick={() => toggleNotamExpand(notam.id)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                      <Chip 
                        icon={getSeverityIcon(notam.severity)} 
                        label={notam.type || 'NOTAM'} 
                        size="small" 
                        color={getSeverityColor(notam.severity)}
                        variant="outlined"
                      />
                      <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
                        {notam.title}
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      {expandedNotamId === notam.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>

                  {/* First line always visible */}
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                    {getFirstLine(notam.description)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Tooltip title="Effective period">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption">
                          {formatDate(notam.effectiveDate)} - {formatDate(notam.expiryDate)}
                        </Typography>
                      </Box>
                    </Tooltip>
                    
                    {notam.location && (
                      <Tooltip title="Location">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {notam.location}
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </Box>

                  <Collapse in={expandedNotamId === notam.id} timeout="auto" unmountOnExit>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {notam.description}
                    </Typography>
                  </Collapse>
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};