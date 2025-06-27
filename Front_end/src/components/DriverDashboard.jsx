import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Navbar from "./Navbar";
import MapComponent from "./MapComponent";
import { gunLocationService } from '../services/geoLocation/gunLocationService';
import ProfileDropdown from "./DriverProfileDropdown";
import Notifications from "./Notifications";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./Footer";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [ownerLocation, setOwnerLocation] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [driverProfile, setDriverProfile] = useState(null);
  const [earnings, setEarnings] = useState({ total: 0, completedRides: 0 });

  
  // Function to update driver's online/offline status
  const updateDriverStatus = async (driverId, online) => {
    try {
      const response = await fetch(`http://localhost:5000/api/driver/${driverId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentStatus: online ? 'online' : 'offline'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setIsOnline(online);
      // Show status update toast
      toast.success(`You are now ${online ? 'online' : 'offline'}!`, {
        position: "top-right",
        autoClose: 3000
      });

      // Start or stop location tracking based on status
      if (online) {
        gunLocationService.startTracking(driverId);
      } else {
        gunLocationService.stopTracking();
      }
    } catch (error) {
      console.error('Error updating driver status:', error);
      toast.error('Failed to update online status');
    }
  };

  // Toggle status handler
  const toggleStatus = () => {
    if (userId) {
      updateDriverStatus(userId, !isOnline);
    }
  };

  // Function to handle booking response
  const handleBookingResponse = async (notificationId, status, ownerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to respond to booking');
      }

      // Update notifications list
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, bookingDetails: { ...notif.bookingDetails, status } }
            : notif
        )
      );

      if (status === 'accepted') {
        setActiveBooking({ ownerId });
        
        // Start tracking owner's location
        const startTrackingOwner = async () => {
          try {
            // Unsubscribe from any existing owner location subscription
            if (activeBooking?.ownerId) {
              gunLocationService.unsubscribeFromLocation(activeBooking.ownerId);
            }

            // Subscribe to owner's location updates
            gunLocationService.subscribeToLocation(ownerId, (location) => {
              if (location) {
                console.log('📍 Received owner location update:', location);
                setOwnerLocation([location.longitude, location.latitude]);
              }
            });

            // Get initial owner location
            const lastLocation = await gunLocationService.getLastLocation(ownerId);
            if (lastLocation) {
              console.log('📍 Initial owner location:', lastLocation);
              setOwnerLocation([lastLocation.longitude, lastLocation.latitude]);
            } else {
              console.log('⚠️ No initial owner location available');
            }
          } catch (error) {
            console.error('Error tracking owner location:', error);
            toast.error('Failed to track owner location');
          }
        };

        startTrackingOwner();
      }

      toast.success(`Booking ${status}!`);
    } catch (error) {
      console.error('Error responding to booking:', error);
      toast.error('Failed to respond to booking');
    }
  };

  // Subscribe to own location updates
  useEffect(() => {
    if (!userId || !isOnline) return;

    const watchLocation = () => {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser");
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Format location data consistently
          setCurrentLocation({
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          });
          console.log('📍 Driver location updated:', { latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Failed to get your location. Please enable location services.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    };

    const cleanup = watchLocation();
    return () => {
      if (cleanup) cleanup();
    };
  }, [userId, isOnline]);

  // Initialize socket connection and fetch notifications
  useEffect(() => {
    // Get user data
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserId(user.id);
      // Fetch profile and earnings data
      fetchDriverProfile();
      fetchEarnings();
    }

    // Initialize socket connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Join driver's room for notifications
    if (user) {
      newSocket.emit("join", user.id);
    }

    // Listen for new booking requests
    newSocket.on("newNotification", (notification) => {
      if (notification.type === "booking_request") {
        setNotifications(prev => {
          const updatedNotifications = [notification, ...prev].slice(0, 5);
          return updatedNotifications;
        });
        toast.info("New booking request received!", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    });

    // Subscribe to own location updates
    if (user) {
      gunLocationService.subscribeToLocation(user.id, (location) => {
        if (location) {
          setCurrentLocation(location);
        }
      });
    }

    // Fetch notifications
    fetchNotifications();

    return () => {
      newSocket.disconnect();
      if (user) {
        gunLocationService.stopTracking();
        gunLocationService.unsubscribeFromLocation(user.id);
      }
      // Cleanup owner location subscription if exists
      if (activeBooking?.ownerId) {
        gunLocationService.unsubscribeFromLocation(activeBooking.ownerId);
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.slice(0, 5));
        
        // Check for active booking
        const activeNotification = data.find(n => 
          n.type === "booking_request" && 
          n.bookingDetails?.status === "accepted"
        );
        
        if (activeNotification) {
          const ownerId = activeNotification.sender;
          setActiveBooking({ ownerId });
          
          // Subscribe to owner's location
          gunLocationService.subscribeToLocation(ownerId, (location) => {
            if (location) {
              console.log('📍 Received owner location update:', location);
              setOwnerLocation([location.longitude, location.latitude]);
            }
          });

          // Get initial owner location
          const lastLocation = await gunLocationService.getLastLocation(ownerId);
          if (lastLocation) {
            console.log('📍 Initial owner location:', lastLocation);
            setOwnerLocation([lastLocation.longitude, lastLocation.latitude]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="relative">
        {/* Profile and Notifications Icons */}
        <div className="absolute top-6 right-20 z-50">
          <Notifications 
            notifications={notifications} 
            userType="driver"
            onBookingResponse={handleBookingResponse}
          />
        </div>
        <div className="absolute top-6 right-6 z-50">
          <ProfileDropdown />
        </div>

        <div className="container mx-auto p-6 mt-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Driver Dashboard</h2>
            <button
              onClick={toggleStatus}
              className={`px-6 py-2 rounded-full font-semibold ${
                isOnline
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isOnline ? "🟢 Online" : "🔴 Offline"}
            </button>
          </div>

          {!isOnline && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You are currently offline. Go online to receive ride requests.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Map Component with current location and owner's location if available */}
          <MapComponent 
            userLocation={currentLocation ? [currentLocation.longitude, currentLocation.latitude] : [74.7973, 34.0837]}
            driverLocation={ownerLocation}
            isDriver={true}
            driverId={activeBooking?.ownerId}
            drivers={[]}
            onDriverSelect={() => {}}
          />

          {/* Earnings Section */}
          <h3 className="text-2xl font-semibold mt-8">Earnings</h3>
          <p className="text-lg mt-2">💰 Total Earnings: ₹{earnings.total}</p>
          <p className="text-lg">✅ Completed Rides: {earnings.completedRides}</p>

          {/* Driver Profile */}
          {/* <h3 className="text-2xl font-semibold mt-8">Profile</h3>
          {driverProfile ? (
            <div className="border p-4 shadow-md">
              <p>👤 Name: {driverProfile.name}</p>
              <p>📱 Mobile: {driverProfile.mobile}</p>
              <p>🚗 Experience: {driverProfile.experience} Years</p>
              <p>🆔 License: {driverProfile.licenseNumber}</p>
              <p>📍 Address: {driverProfile.address}</p>
              {driverProfile.vehicleDetails && (
                <>
                  <p>🚘 Vehicle: {driverProfile.vehicleDetails.make} {driverProfile.vehicleDetails.model}</p>
                  <p>🔢 Vehicle Number: {driverProfile.vehicleDetails.number}</p>
                </>
              )}
            </div> */}
          {/* ) : (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          )} */}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default DriverDashboard;
