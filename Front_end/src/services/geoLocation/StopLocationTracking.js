
export function StopLocationTracking(watchId) {
    if (navigator.geolocation && watchId != null) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
  