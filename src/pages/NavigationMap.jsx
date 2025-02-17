import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { Box, Typography } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 1.3521,
  lng: 103.8198,
};

function NavigationMap({ destination }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState('');

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setError('Error retrieving your location.')
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Request directions once both locations are available
  useEffect(() => {
    if (currentLocation && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentLocation,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            setError('Error fetching directions.');
            console.error('Directions request failed due to ', status);
          }
        }
      );
    }
  }, [currentLocation, destination]);

  return (
    <Box>
      {error && <Typography color="error">{error}</Typography>}
      <LoadScript googleMapsApiKey="AIzaSyBNxX3ljGhriIMNevt02quEXGO6fhIqhls">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={destination || defaultCenter}
          zoom={10}
        >
          {/* Render user's current location */}
          {currentLocation && (
            <Marker
              position={currentLocation}
              title="Your Location"
              icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
            />
          )}
          {/* Render destination marker */}
          {destination && (
            <Marker position={destination} title="Destination" />
          )}
          {/* Render route */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
}

export default NavigationMap;
