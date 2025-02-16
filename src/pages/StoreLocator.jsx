import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import GoogleMapComponent from './GoogleMap';
import ClientNavbar from '../client/ClientNavbar';
import ClientFooter from '../client/ClientFooter';
import http from '../http';

const defaultCenter = {
  lat: 1.3521,
  lng: 103.8198,
};

function StoreLocator() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const res = await http.get('/api/Markers');
        setMarkers(res.data);
      } catch (err) {
        console.error('Error fetching markers:', err);
      }
    };
    fetchMarkers();
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
