import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const GoogleMapComponent = ({ markers = [], defaultCenter, currentLocation, onMarkerClick }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBNxX3ljGhriIMNevt02quEXGO6fhIqhls">
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={10}>
        {/* Render each marker from the API */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.latitude, lng: marker.longitude }}
            title={marker.name}
          />
        ))}

        {/* Render the user's current location */}
        {currentLocation && (
          <Marker
            position={currentLocation}
            title="Your Location"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
