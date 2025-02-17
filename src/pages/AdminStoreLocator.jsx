// AdminStoreLocator.jsx

import React, { useState, useEffect } from 'react';
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
import http from '../http'; // your configured HTTP client (e.g., axios)

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 1.3521, // Singapore's latitude
  lng: 103.8198, // Singapore's longitude
};

// Google Map component for admin view
const AdminGoogleMap = ({ markers, onMarkerClick }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBNxX3ljGhriIMNevt02quEXGO6fhIqhls">
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={10}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.latitude, lng: marker.longitude }}
            title={marker.name}
            onClick={() => onMarkerClick(marker)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

function AdminStoreLocator() {
  const [markers, setMarkers] = useState([]);
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState('');
  const [editingMarkerId, setEditingMarkerId] = useState(null);

  // Fetch markers from the API on mount
  useEffect(() => {
    fetchMarkers();
  }, []);

  const fetchMarkers = async () => {
    try {
      const res = await http.get('/api/Markers');
      setMarkers(res.data);
    } catch (err) {
      console.error('Error fetching markers:', err);
    }
  };

  const handleAddOrUpdateMarker = async () => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (!name.trim()) {
      setError('Please enter a marker name.');
      return;
    }
    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Please enter valid numbers for latitude and longitude.');
      return;
    }
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      setError('Coordinates are out of valid range.');
      return;
    }

    try {
      if (editingMarkerId) {
        // Update an existing marker via PUT
        const updatedMarker = { id: editingMarkerId, name, latitude, longitude };
        await http.put(`/api/Markers/${editingMarkerId}`, updatedMarker);
        setMarkers((prev) =>
          prev.map((marker) => (marker.id === editingMarkerId ? updatedMarker : marker))
        );
        setEditingMarkerId(null);
      } else {
        // Add a new marker via POST
        const newMarker = { name, latitude, longitude };
        const res = await http.post('/api/Markers', newMarker);
        setMarkers((prev) => [...prev, res.data]);
      }
      setName('');
      setLat('');
      setLng('');
      setError('');
    } catch (err) {
      console.error('Error saving marker:', err);
      setError('Error saving marker.');
    }
  };

  const handleDeleteMarker = async (id) => {
    try {
      await http.delete(`/api/Markers/${id}`);
      setMarkers((prev) => prev.filter((marker) => marker.id !== id));
      if (editingMarkerId === id) {
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Error deleting marker:', err);
    }
  };

  const handleEditMarker = (marker) => {
    setEditingMarkerId(marker.id);
    setName(marker.name);
    setLat(marker.latitude.toString());
    setLng(marker.longitude.toString());
    setError('');
  };

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
          Admin: Manage Store Locations
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

        {/* Markers List */}
        <Typography variant="h5" align="center" sx={{ mt: 3, mb: 1 }}>
          Markers List
        </Typography>
        <List>
          {markers.map((marker) => (
            <ListItem
              key={marker.id}
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => handleEditMarker(marker)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteMarker(marker.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={`${marker.name} — Lat: ${marker.latitude}, Lng: ${marker.longitude}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default AdminStoreLocator;
