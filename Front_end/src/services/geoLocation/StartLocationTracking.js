// StartLocationTracking.js
export function StartLocationTracking(successCallback, errorCallback) {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return null;
    }
  
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        successCallback({ latitude, longitude });
      },
      (error) => {
        if (errorCallback) {
          errorCallback(error);
        } else {
          console.error('Geolocation error:', error);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  
    return watchId;
  }
  