// NavigationMap.jsx

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

    // Get the user's current location
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

    // Use the onLoad callback to ensure the Google Maps API is loaded
    const onMapLoad = (map) => {
        // Ensure both current location and destination are available and that google.maps exists
        if (currentLocation && destination && window.google && window.google.maps) {
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
                        console.error('Directions request failed due to', status);
                    }
                }
            );
        }
    };

    return (
        <Box>
            {error && <Typography color="error">{error}</Typography>}
            <LoadScript googleMapsApiKey="AIzaSyBNxX3ljGhriIMNevt02quEXGO6fhIqhls">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={destination || defaultCenter}
                    zoom={10}
                    onLoad={onMapLoad}
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
                    {/* Render the route if available */}
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </LoadScript>
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
    );
}

export default NavigationMap;
