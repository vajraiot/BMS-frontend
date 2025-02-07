import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';

const MapComponent = ({ mapMarkers = [] }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDRsvO4B8wU4AtMjhgRkjRx0YVdrfwouN4"
  });

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  if (!isLoaded) return <div>Loading maps...</div>;
  if (loadError) return <div>Error loading maps...</div>;

  // Ensure mapMarkers is an array before mapping
  const markers = Array.isArray(mapMarkers) ? mapMarkers : [];

  return (
    <GoogleMap
      center={{ lat: 17.4065, lng: 78.4772 }}
      zoom={5}
      mapContainerStyle={{ height: '430px', width: '100%' }}
    >
      {markers.map((marker, index) => {
        const iconColor = marker.statusType === 1 ? 'green' : (marker.statusType === 0 ? 'red' : 'yellow');

        return (
          <Marker
            key={index}
            position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
            icon={{
              url: `https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-${iconColor}.png`,
              scaledSize: isLoaded ? new window.google.maps.Size(15, 25) : null,
            }}
            onClick={() => handleMarkerClick(marker)}
          >
            {selectedMarker === marker && (
              <InfoWindow onCloseClick={handleCloseInfoWindow}>
                <div>
                  <strong>{marker.name}</strong><br />
                  Sub-Station ID: {marker.siteId}<br />
                  Longitude: {marker.lng}<br />
                  Vendor: {marker.vendor || 'N/A'}
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  );
};

export default MapComponent;