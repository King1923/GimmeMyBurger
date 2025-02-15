// AdminStoreLocator.jsx

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import AdminSidebar from '../admin/AdminSideBar';

// Define the container style and default center (Singapore)
const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 1.3521,  // Singapore's latitude
  lng: 103.8198,  // Singapore's longitude
};

// A Google Map component that accepts an array of marker objects
const AdminGoogleMap = ({ markers }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBNxX3ljGhriIMNevt02quEXGO6fhIqhls">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

function AdminStoreLocator() {
  // State to hold the list of marker positions and form values
  const [markers, setMarkers] = useState([]);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState('');

  // Handler for adding a new location/marker
  const handleAddLocation = () => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    
    // Validate that the inputs are valid numbers
    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Please enter valid numbers for latitude and longitude.');
      return;
    }
    // Optionally, validate the coordinate ranges
    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setError('Coordinates are out of valid range.');
      return;
    }

    // Add the new marker to the markers array
    setMarkers((prevMarkers) => [...prevMarkers, { lat: latNum, lng: lngNum }]);
    // Reset the form fields and error message
    setLat('');
    setLng('');
    setError('');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>
          Admin: Add Store Locations
        </Typography>
        {/* Form for entering new marker coordinates */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" onClick={handleAddLocation} fullWidth>
              Add Location
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error" align="center">
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Google Map displaying all added markers */}
        <AdminGoogleMap markers={markers} />
      </Box>
    </Box>
  );
}

export default AdminStoreLocator;
