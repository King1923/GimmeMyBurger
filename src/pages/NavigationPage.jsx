import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import NavigationMap from './NavigationMap';

function NavigationPage() {
  const location = useLocation();
  const { destination, markerName } = location.state || {};

  if (!destination) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6">No destination selected.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Directions to {markerName}
      </Typography>
      <NavigationMap destination={destination} />
    </Box>
  );
}

export default NavigationPage;
