import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "pk.eyJ1IjoicHJhdGFwcmFqYXJ5YW4yMTIiLCJhIjoiY21jMXExZjBvMDA2MjJsc2ZqMW1mdzVyayJ9._kfmaEpG6LSw0wnbyjYrGA";

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState([74.7973, 34.0837]); // Default to Srinagar
  const [destination, setDestination] = useState("");
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);

  // Dummy driver locations near Srinagar
  const srinagarDrivers = [
    { id: 1, location: [74.8073, 34.0837], name: "Driver 1" },
    { id: 2, location: [74.8023, 34.0887], name: "Driver 2" },
    { id: 3, location: [74.7923, 34.0787], name: "Driver 3" },
    { id: 4, location: [74.8073, 34.0837], name: "Driver 4" },
    { id: 5, location: [74.8003, 34.0887], name: "Driver 5" },
    { id: 6, location: [74.7590, 34.0787], name: "Driver 6" }
  ];

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: userLocation,
      zoom: 14
    });

    // Add controls
    map.addControl(new mapboxgl.NavigationControl());

    // Add user marker
    new mapboxgl.Marker({ color: "blue" })
      .setLngLat(userLocation)
      .addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Handle destination search
  const handleDestinationSearch = async () => {
    if (!destination) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          destination
        )}.json?access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center;
        setDestinationLocation([lng, lat]);
        
        // If searching for Srinagar, show drivers
        if (destination.toLowerCase().includes("srinagar")) {
          setDrivers(srinagarDrivers);
        } else {
          setDrivers([]);
        }
      }
    } catch (error) {
      console.error("Error fetching destination:", error);
    }
  };

  // Update map when destination or drivers change
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear existing destination marker
    const markers = document.querySelectorAll('.mapboxgl-marker:not(.user-marker)');
    markers.forEach(marker => marker.remove());

    // Add destination marker if exists
    if (destinationLocation) {
      new mapboxgl.Marker({ color: "red" })
        .setLngLat(destinationLocation)
        .addTo(map);
      
      map.flyTo({ center: destinationLocation, zoom: 14 });
    }

    // Clear existing driver markers
    const driverMarkers = document.querySelectorAll('.driver-marker');
    driverMarkers.forEach(marker => marker.remove());

    // Add driver markers
    drivers.forEach(driver => {
      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.innerHTML = '🚖';
      el.style.fontSize = '24px';
      
      new mapboxgl.Marker(el)
        .setLngLat(driver.location)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${driver.name}</strong>`))
        .addTo(map);
    });

  }, [destinationLocation, drivers]);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Try 'Srinagar' to see drivers"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={handleDestinationSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <div
        ref={mapContainerRef}
        className="w-full h-96 rounded-lg shadow-lg"
      />
      {drivers.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="font-bold">Available Drivers:</h3>
          <ul>
            {drivers.map(driver => (
              <li key={driver.id}>{driver.name} - {driver.location.join(", ")}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapComponent;