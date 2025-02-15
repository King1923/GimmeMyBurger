// StoreLocator.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import GoogleMapComponent from './GoogleMap'; // Ensure this component uses `defaultCenter` if provided
import ClientNavbar from '../client/ClientNavbar';
import ClientFooter from '../client/ClientFooter';

// Define the default center as Singapore
const defaultCenter = {
  lat: 1.3521,  // Singapore's latitude
  lng: 103.8198,  // Singapore's longitude
};

function StoreLocator() {
  const [markers, setMarkers] = useState([]);

  // On mount, load the markers from localStorage (persisted by AdminStoreLocator)
  useEffect(() => {
    const storedMarkers = localStorage.getItem('markers');
    if (storedMarkers) {
      setMarkers(JSON.parse(storedMarkers));
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <ClientNavbar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Locate Us
        </Typography>
        <GoogleMapComponent markers={markers} defaultCenter={defaultCenter} />
      </Box>

      {/* Footer */}
      <ClientFooter />
    </Box>
  );
}

export default StoreLocator;
