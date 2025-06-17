import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 28.6139, // Default location (Delhi, India)
  lng: 77.2090,
};

const MapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDVChpDPTFjEYbl2blsVUL4s2mTnePMpNU", // Replace with your API Key
  });

  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [destinationLocation, setDestinationLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Error getting location");
        }
      );
    }
  }, []);

  const handleDestinationSearch = async () => {
    if (!destination) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: destination }, (results, status) => {
      if (status === "OK" && results[0]) {
        setDestinationLocation({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      } else {
        console.error("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  if (!isLoaded) return <p>Loading Maps...</p>;


  return (
    <GoogleMap mapContainerStyle={containerStyle} center={userLocation || center} zoom={14}>
      {userLocation && <Marker position={userLocation} />}
    </GoogleMap>
  );
};

export default MapComponent;
