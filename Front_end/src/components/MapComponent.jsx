import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

// Replace with your Mapbox public token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState([77.2090, 28.6139]); // default: Delhi
  const [destination, setDestination] = useState("");
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = [position.coords.longitude, position.coords.latitude];
          setUserLocation(loc);
        },
        () => {
          console.error("Error getting user location.");
        }
      );
    }
  }, []);

  // Set mounted state to true after component mounts
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Initialize the map
  useEffect(() => {
    if (!isMounted || !mapContainerRef.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: userLocation,
      zoom: 14,
    });

    // Add zoom and rotate controls
    mapInstance.addControl(new mapboxgl.NavigationControl());

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [userLocation, isMounted]);

  // Add marker for destination
  useEffect(() => {
    if (map && destinationLocation) {
      new mapboxgl.Marker({ color: "red" })
        .setLngLat(destinationLocation)
        .addTo(map);
      map.flyTo({ center: destinationLocation });
    }
  }, [destinationLocation, map]);

  // Add user marker
  useEffect(() => {
    if (map && userLocation) {
      new mapboxgl.Marker()
        .setLngLat(userLocation)
        .addTo(map);
    }
  }, [map, userLocation]);

  // Geocoding using Mapbox API
  const handleDestinationSearch = async () => {
    if (!destination) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          destination
        )}.json?access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setDestinationLocation([lng, lat]);
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error("Error fetching destination:", error);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border px-2 py-1"
        />
        <button
          onClick={handleDestinationSearch}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Search
        </button>
      </div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "400px", borderRadius: "8px" }}
      />
    </div>
  );
};

export default MapComponent;