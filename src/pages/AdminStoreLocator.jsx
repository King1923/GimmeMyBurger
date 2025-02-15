// AdminStoreLocator.jsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminSidebar from '../admin/AdminSideBar';

// Map container style and default center (Singapore)
const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 1.3521, // Singapore's latitude
  lng: 103.8198, // Singapore's longitude
};

// A Google Map component that accepts markers and a click handler for editing
const AdminGoogleMap = ({ markers, onMarkerClick }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBNxX3ljGhriIMNevt02quEXGO6fhIqhls">
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={10}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => onMarkerClick(marker)}
            title={marker.name} // Shows the marker name as a tooltip
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

function AdminStoreLocator() {
  // State to manage markers and form values
  const [markers, setMarkers] = useState([]);
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState('');
  const [editingMarkerId, setEditingMarkerId] = useState(null);

  // Add a new marker or update an existing one
  const handleAddOrUpdateMarker = () => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Validate marker name
    if (!name.trim()) {
      setError('Please enter a name for the marker.');
      return;
    }

    // Validate coordinates
    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Please enter valid numbers for latitude and longitude.');
      return;
    }
    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setError('Coordinates are out of valid range.');
      return;
    }

    if (editingMarkerId) {
      // Update the marker being edited
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker.id === editingMarkerId ? { ...marker, name, lat: latNum, lng: lngNum } : marker
        )
      );
      setEditingMarkerId(null);
    } else {
      // Add a new marker (using Date.now() as a simple unique ID)
      const newMarker = { id: Date.now(), name, lat: latNum, lng: lngNum };
      setMarkers((prev) => [...prev, newMarker]);
    }

    // Reset the form
    setName('');
    setLat('');
    setLng('');
    setError('');
  };

  // Delete a marker
  const handleDeleteMarker = (id) => {
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== id));
    if (editingMarkerId === id) {
      handleCancelEdit();
    }
  };

  // Populate the form with marker data for editing
  const handleEditMarker = (marker) => {
    setEditingMarkerId(marker.id);
    setName(marker.name);
    setLat(marker.lat.toString());
    setLng(marker.lng.toString());
    setError('');
  };

  // Cancel edit mode and clear the form
  const handleCancelEdit = () => {
    setEditingMarkerId(null);
    setName('');
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
          Manage Store Locations
        </Typography>

        {/* Form for adding/updating markers */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Marker Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" onClick={handleAddOrUpdateMarker} fullWidth>
              {editingMarkerId ? 'Update Location' : 'Add Location'}
            </Button>
          </Grid>
          {editingMarkerId && (
            <Grid item xs={12} sm={3}>
              <Button variant="outlined" onClick={handleCancelEdit} fullWidth>
                Cancel
              </Button>
            </Grid>
          )}
          {error && (
            <Grid item xs={12}>
              <Typography color="error" align="center">
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Google Map displaying markers */}
        <AdminGoogleMap markers={markers} onMarkerClick={handleEditMarker} />

        {/* List of markers with edit and delete options */}
        <Typography variant="h5" align="center" sx={{ mt: 3, mb: 1 }}>
          Markers List
        </Typography>
        <List>
          {markers.map((marker) => (
            <ListItem
              key={marker.id}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditMarker(marker)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteMarker(marker.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={`${marker.name}: Latitude: ${marker.lat}, Longitude: ${marker.lng}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default AdminStoreLocator;

