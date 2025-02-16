import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const GoogleMapComponent = ({ markers = [], defaultCenter }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBNxX3ljGhriIMNevt02quEXGO6fhIqhls">
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={10}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.latitude, lng: marker.longitude }}
            title={marker.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
