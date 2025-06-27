import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "pk.eyJ1IjoicHJhdGFwcmFqYXJ5YW4yMTIiLCJhIjoiY21jMXExZjBvMDA2MjJsc2ZqMW1mdzVyayJ9._kfmaEpG6LSw0wnbyjYrGA";

const MapComponent = ({ userLocation, driverLocation, isDriver, driverId, drivers, onDriverSelect }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);
  const [error, setError] = useState(null);

  // Function to clear existing markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  // Function to draw route between two points
  const drawRoute = async (start, end) => {
    try {
      // Remove existing route if any
      if (routeRef.current) {
        const layers = ['route', 'route-outline'];
        layers.forEach(layer => {
          if (mapRef.current.getLayer(layer)) {
            mapRef.current.removeLayer(layer);
          }
        });
        if (mapRef.current.getSource('route')) {
          mapRef.current.removeSource('route');
        }
      }

      // Get directions from Mapbox API
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
      
      if (!json.routes || json.routes.length === 0) {
        throw new Error('No route found');
      }

      const route = json.routes[0].geometry;

      // Add the route to the map
      mapRef.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route
        }
      });

      // Add outline for the route
      mapRef.current.addLayer({
        id: 'route-outline',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#2196F3',
          'line-width': 8,
          'line-opacity': 0.8
        }
      });

      // Add the route line
      mapRef.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#1976D2',
          'line-width': 4,
          'line-opacity': 1
        }
      });

      // Fit map to show the entire route
      const coordinates = route.coordinates;
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      mapRef.current.fitBounds(bounds, {
        padding: 50
      });

      routeRef.current = route;
    } catch (err) {
     // console.error('Error drawing route:', err);
    }
  };

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: userLocation || [74.7973, 34.0837],
      zoom: 14
    });

    // Add controls
    map.addControl(new mapboxgl.NavigationControl());

    mapRef.current = map;

    return () => {
      clearMarkers();
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Update markers and route when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    clearMarkers();

    // Add user marker
    if (userLocation && Array.isArray(userLocation) && userLocation.length === 2) {
      const userMarker = new mapboxgl.Marker({ color: isDriver ? "#FF0000" : "#2196F3" })
        .setLngLat(userLocation)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${isDriver ? 'Your Location' : 'Your Location'}</strong>`))
        .addTo(mapRef.current);
      markersRef.current.push(userMarker);
    }

    // Add driver/owner marker and draw route if both locations are available
    if (driverLocation && userLocation && 
        Array.isArray(driverLocation) && Array.isArray(userLocation) && 
        driverLocation.length === 2 && userLocation.length === 2) {
      const markerColor = isDriver ? "#2196F3" : "#4CAF50"; // Blue for owner, Green for driver
      const markerText = isDriver ? "Car Owner Location" : "Driver Location";
      
      const otherMarker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat(driverLocation)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${markerText}</strong>`))
        .addTo(mapRef.current);
      markersRef.current.push(otherMarker);

      // Always draw route between user and driver/owner locations
      drawRoute(userLocation, driverLocation);

      // Fit map to show both markers
      const bounds = new mapboxgl.LngLatBounds()
        .extend(userLocation)
        .extend(driverLocation);

      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 1000
      });
    }

    // Add other drivers' markers if available
    if (drivers && !isDriver) {
      drivers.forEach(driver => {
        if (driver.location?.coordinates) {
          const [longitude, latitude] = driver.location.coordinates;
          const el = document.createElement('div');
          el.className = 'driver-marker';
          el.innerHTML = '🚖';
          el.style.fontSize = '24px';
          el.style.cursor = 'pointer';
          
          const marker = new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`
              <strong>${driver.name}</strong><br/>
              ${driver.distance ? `${driver.distance.toFixed(1)} km away` : ''}
            `))
            .addTo(mapRef.current);
          
          el.addEventListener('click', () => {
            if (onDriverSelect) {
              onDriverSelect(driver);
            }
          });
          
          markersRef.current.push(marker);
        }
      });
    }

  }, [userLocation, driverLocation, drivers, isDriver]);

  return (
    <div className="relative">
      {error && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      <div
        ref={mapContainerRef}
        className="w-full h-96 rounded-lg shadow-lg"
      />
    </div>
  );
};

export default MapComponent;