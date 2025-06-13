//abhi dekhana h ise kam baki h iska 

import { useEffect, useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import { ShareMyLocation } from '../services/geoLocation/ShareMyLocation';
import { ReciveLiveLocation } from '../services/geoLocation/ReciveLiveLocation';
import { StartLocationTracking } from '../services/geoLocation/StartLocationTracking';
import { StopLocationTracking } from '../services/geoLocation/StopLocationTracking';
import { GetPathCoordinates } from '../services/geoLocation/GetPathCoordinates';

const MAPBOX_TOKEN = 'AIzaSyDVChpDPTFjEYbl2blsVUL4s2mTnePMpNU';  //  Mapbox token

export default function LocationTracker() {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    const id = StartLocationTracking(
      (location) => {
        console.log('Live location:', location);
        setPickup(location);
        ShareMyLocation(location);
      },
      (error) => {
        console.error('Location error:', error);
      }
    );

    setWatchId(id);

    setTimeout(() => {
      const dest = ReciveLiveLocation();
      setDestination(dest);
    }, 3000);

    return () => {
      StopLocationTracking(watchId);
    };
  }, []);

  const pathCoordinates = pickup && destination ? GetPathCoordinates(pickup, destination) : null;

  const lineLayer = {
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#3b82f6',
      'line-width': 4,
    },
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Map
        initialViewState={{
          longitude: pickup ? pickup.longitude : 78.9629,
          latitude: pickup ? pickup.latitude : 20.5937,
          zoom: 5,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {pickup && (
          <Marker longitude={pickup.longitude} latitude={pickup.latitude} color="red" />
        )}
        {destination && (
          <Marker longitude={destination.longitude} latitude={destination.latitude} color="green" />
        )}
        {pathCoordinates && (
          <Source id="route" type="geojson" data={{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: pathCoordinates,
            },
          }}>
            <Layer {...lineLayer} />
          </Source>
        )}
      </Map>
    </div>
  );
}
