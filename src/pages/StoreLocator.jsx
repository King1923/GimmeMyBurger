import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import GoogleMapComponent from './GoogleMap';
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

  const handleMarkerClick = (marker) => {
    // Navigate to the navigation page with destination and marker name in state
    navigate('/navigation', {
      state: {
        destination: { lat: marker.latitude, lng: marker.longitude },
        markerName: marker.name,
      },
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Locate Us
        </Typography>
        <GoogleMapComponent
          markers={markers}
          defaultCenter={defaultCenter}
          currentLocation={currentLocation}
          onMarkerClick={handleMarkerClick}
        />
        {/* Legend */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="subtitle1">Legend:</Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mt: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img
                src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                alt="Your Location"
                style={{ width: 20, height: 20 }}
              />
              <Typography variant="body2">Your Location</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img
                src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                alt="Store Location"
                style={{ width: 20, height: 20 }}
              />
              <Typography variant="body2">Store Location</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default StoreLocator;
