import React from 'react';
import GoogleMapComponent from './GoogleMap';
import ClientNavbar from '../client/ClientNavbar';
import ClientFooter from '../client/ClientFooter';
import { Box, Typography } from '@mui/material';

function StoreLocator() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <ClientNavbar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Locate Us
        </Typography>
        <GoogleMapComponent />
      </Box>

      {/* Footer */}
      <ClientFooter />
    </Box>
  );
}

export default StoreLocator;
