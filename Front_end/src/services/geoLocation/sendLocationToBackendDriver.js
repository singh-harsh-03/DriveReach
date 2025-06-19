// src/services/geophancing/sendLocationToBackend.js

let locationAlreadySent = false;

export const sendLocationToBackend = async (userId,role) => {
  if (locationAlreadySent) return;

  if (!('geolocation' in navigator)) {
    console.error("Geolocation is not supported by this browser.");
    return;
  }
  let link = "";

if (role === "driver")
  link = `http://localhost:5000/api/driver/${userId}/location`;
else
  link = `http://localhost:5000/api/carowner/${userId}/location`;


  navigator.geolocation.getCurrentPosition(
    async (position) => {
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

        await response.json();
        locationAlreadySent = true;
        
        console.log("Location sent successfully.");
      } catch (error) {
        console.error("Error sending location to backend:", error);
      }
    },
    (error) => {
      console.error("Error getting device location:", error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};
