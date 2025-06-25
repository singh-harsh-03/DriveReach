// src/services/geophancing/sendLocationToBackend.js

export const sendLocationToBackend = async (userId, role) => {
  if (!('geolocation' in navigator)) {
    console.error("Geolocation is not supported by this browser.");
    return;
  }

  let link = "";
  if (role === "driver") {
  link = `http://localhost:5000/api/driver/${userId}/location`;
  } else {
  link = `http://localhost:5000/api/carowner/${userId}/location`;
  }

  // Function to send a single location update
  const updateLocation = async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(link, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          }),
        });

      const data = await response.json();
      console.log("Location updated successfully:", data);
      } catch (error) {
        console.error("Error sending location to backend:", error);
      }
  };

  // Watch position and continuously update
  const watchId = navigator.geolocation.watchPosition(
    updateLocation,
    (error) => {
      console.error("Error getting device location:", error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );

  // Return the watch ID so it can be cleared when needed
  return watchId;
};

// Function to stop sending location updates
export const stopLocationUpdates = (watchId) => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    console.log("Location updates stopped");
  }
};
