//abhi dekhana h ise kam baki h iska 

import React, { useEffect, useState } from 'react';
import { gunLocationService } from '../services/geoLocation/gunLocationService';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = 'AIzaSyDVChpDPTFjEYbl2blsVUL4s2mTnePMpNU';  // Your Mapbox token

const LocationTracker = ({ userId, isDriver }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [viewport, setViewport] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 14
  });

  useEffect(() => {
    let cleanup = () => {};

    const initializeLocation = async () => {
      try {
        // Test GunDB connection
        const isConnected = await gunLocationService.testConnection();
        setConnectionStatus(isConnected ? 'Connected' : 'Connection Failed');

        if (isDriver) {
          // Start tracking if we're the driver
          gunLocationService.startTracking(userId);
          cleanup = () => gunLocationService.stopTracking();
        } else {
          // Subscribe to driver's location if we're the passenger/owner
          gunLocationService.subscribeToLocation(userId, (newLocation) => {
            setLocation(newLocation);
            setViewport(prev => ({
              ...prev,
              longitude: newLocation.longitude,
              latitude: newLocation.latitude
            }));
            setConnectionStatus('Receiving Updates');
          });

          // Get last known location
          const lastLocation = await gunLocationService.getLastLocation(userId);
          if (lastLocation) {
            setLocation(lastLocation);
            setViewport(prev => ({
              ...prev,
              longitude: lastLocation.longitude,
              latitude: lastLocation.latitude
            }));
          }

          cleanup = () => gunLocationService.unsubscribeFromLocation(userId);
        }
      } catch (err) {
        setError(err.message);
        setConnectionStatus('Error');
      }
    };

    initializeLocation();

    return () => cleanup();
  }, [userId, isDriver]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {isDriver ? 'Your Location' : 'Driver Location'}
        </h3>
        <p className="text-sm text-gray-500">Status: {connectionStatus}</p>
      </div>

      {location ? (
        <>
          <div className="mb-4 space-y-2">
            <p>Latitude: {location.latitude.toFixed(6)}</p>
            <p>Longitude: {location.longitude.toFixed(6)}</p>
            {location.accuracy && (
              <p>Accuracy: ±{location.accuracy.toFixed(1)} meters</p>
            )}
            <p className="text-sm text-gray-500">
              Last updated: {new Date(location.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="h-64 w-full rounded overflow-hidden">
            <Map
              {...viewport}
              onMove={evt => setViewport(evt.viewport)}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
            >
              <Marker
                longitude={location.longitude}
                latitude={location.latitude}
                color={isDriver ? "#FF0000" : "#00FF00"}
              />
            </Map>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Waiting for location updates...
        </div>
      )}
    </div>
  );
};

export default LocationTracker;
