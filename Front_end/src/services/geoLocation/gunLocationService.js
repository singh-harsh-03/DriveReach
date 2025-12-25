import Gun from 'gun';
import 'gun/lib/open';
import 'gun/lib/load';
import 'gun/lib/then';

// Initialize Gun with the server peer
const gun = Gun({
  peers: ['http://localhost:5000/gun'],
  localStorage: true, // Enable localStorage for browser
  retry: Infinity // Keep retrying to connect
});

class GunLocationService {
  constructor() {
    this.locationNode = gun.get('locations');
    this.watchId = null;
    this.currentUserId = null;
    this.lastUpdateTime = null;
  }

  // Start tracking and broadcasting location
  startTracking(userId) {
    this.currentUserId = userId;
    console.log('🔫 Starting location tracking for user:', userId);
    this.lastUpdateTime = Date.now();

    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser.');
    }

    // Clear any existing watch
    this.stopTracking();

    // Start watching location
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentTime = Date.now();
        const timeSinceLastUpdate = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;

        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: currentTime
        };

        // Update location in GunDB
        this.locationNode.get(userId).put(location, (ack) => {
          if (ack.err) {
            console.error('❌ Error updating location:', ack.err);
          } else {
            console.log('✅ Location updated in GunDB:', location);
            console.log(`⏱️ Time since last update: ${timeSinceLastUpdate}ms`);
          }
        });
      },
      (error) => {
        console.error('❌ Geolocation error:', error);
        throw error;
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  // Stop tracking location
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log('🛑 Stopped location tracking');
    }
  }

  // Subscribe to a user's location updates
  subscribeToLocation(userId, callback) {
    console.log('🔄 Subscribing to location updates for user:', userId);
    
    return this.locationNode.get(userId).on((location) => {
      if (location && location.latitude && location.longitude) {
        callback({
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: location.timestamp
        });
      }
    });
  }

  // Unsubscribe from location updates
  unsubscribeFromLocation(userId) {
    console.log('❌ Unsubscribing from location updates for user:', userId);
    this.locationNode.get(userId).off();
  }

  // Get last known location
  async getLastLocation(userId) {
    return new Promise((resolve) => {
      this.locationNode.get(userId).once((location) => {
        if (location && location.latitude && location.longitude) {
          resolve({
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            timestamp: location.timestamp
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  // Test the GunDB connection
  async testConnection() {
    try {
      const testData = { test: 'data', timestamp: Date.now() };
      await gun.get('test').put(testData);
      const result = await gun.get('test').then();
      console.log('✅ GunDB connection test successful:', result);
      return true;
    } catch (error) {
      console.error('❌ GunDB connection test failed:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const gunLocationService = new GunLocationService(); 