import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import GoogleMapComponent from './GoogleMap';
import ClientNavbar from '../client/ClientNavbar';
import ClientFooter from '../client/ClientFooter';
import { useNavigate } from 'react-router-dom';
import http from '../http';

const defaultCenter = {
  lat: 1.3521,
  lng: 103.8198,
};

function StoreLocator() {
  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch markers from the API
    const fetchMarkers = async () => {
      try {
        const res = await http.get('/api/Markers');
        setMarkers(res.data);
      } catch (err) {
        console.error('Error fetching markers:', err);
      }
    };
    fetchMarkers();

    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Locate Us
        </Typography>
        <GoogleMapComponent
          markers={markers}
          defaultCenter={defaultCenter}
          currentLocation={currentLocation}
        />
      </Box>

      {/* Footer */}
    </Box>
  );
}

export default StoreLocator;
