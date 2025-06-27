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

  useEffect(() => {
    // Get user data
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserId(user.id);
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
        setCurrentLocation(location);
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
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />

      {/* Profile and Notifications Icons */}
      <div className="relative">
        <div className="absolute top-6 right-20 z-50">
          <Notifications userType="driver" notifications={notifications} />
        </div>
        <div className="absolute top-6 right-6 z-50">
          <ProfileDropdown navigate={navigate} />
        </div>

        <div className="container mx-auto p-6 mt-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Driver Dashboard</h2>
            
            {/* Online/Offline Toggle Button */}
            <button
              onClick={toggleStatus}
              className={`px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 ${
                isOnline 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-white' : 'bg-gray-500'}`}></span>
              {isOnline ? 'Online' : 'Offline'}
            </button>
          </div>
          
          {/* Status Banner */}
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
          
          {/* Map Component with current location */}
          <MapComponent 
            userLocation={currentLocation ? [currentLocation.longitude, currentLocation.latitude] : undefined}
            isDriver={true}
          />

          {/* Earnings Section */}
          <h3 className="text-2xl font-semibold mt-8">Earnings</h3>
          <p className="text-lg mt-2">💰 Total Earnings: ₹25,000</p>
          <p className="text-lg">✅ Completed Rides: 50</p>

          {/* Driver Profile */}
          <h3 className="text-2xl font-semibold mt-8">Profile</h3>
          <div className="border p-4 shadow-md">
            <p>👤 Name: John Doe</p>
            <p>🚗 Experience: 5 Years</p>
            <p>🆔 License: DL-123456789</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DriverDashboard;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "./Navbar";
// import MapComponent from "./MapComponent";
// import ProfileDropdown from "./DriverProfileDropdown";

// const DriverDashboard = () => {
//   const [requests, setRequests] = useState([]);
//   const driverId = localStorage.getItem("driverId"); // From login

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const res = await axios.get(`http://localhost:5000/api/ride-requests/driver/${driverId}`);
//       setRequests(res.data);
//     };
//     fetchRequests();
//   }, []);

//   const updateRequestStatus = async (requestId, status) => {
//     await axios.put(`http://localhost:5000/api/ride-requests/${requestId}/status`, { status });
//     setRequests((prev) =>
//       prev.map((r) => (r._id === requestId ? { ...r, status } : r))
//     );
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="relative">
//         <div className="absolute top-6 right-6 z-50">
//           <ProfileDropdown />
//         </div>
//         <div className="container mx-auto p-6 mt-20">
//           <h2 className="text-3xl font-bold mb-4">Driver Dashboard</h2>
//           <MapComponent />
//           <h3 className="text-2xl font-semibold">New Ride Requests</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//             {requests.map((req) => (
//               <div key={req._id} className="border p-4 shadow-md">
//                 <h4 className="text-xl font-bold">{req?.ownerId?.name}</h4>
//                 <p>📍 Location: {req.location?.coordinates?.join(", ")}</p>
//                 <p>Status: {req.status}</p>
//                 <div className="mt-3">
//                   <button
//                     className="bg-green-500 text-white px-4 py-2 rounded mr-2"
//                     onClick={() => updateRequestStatus(req._id, "accepted")}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     className="bg-red-500 text-white px-4 py-2 rounded"
//                     onClick={() => updateRequestStatus(req._id, "rejected")}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//              {[1, 2, 3].map((ride) => (
//                <div key={ride} className="border p-4 shadow-md">
//                  <h4 className="text-xl font-bold">Ride {ride}</h4>
//                  <p>📍 Pickup: XYZ Location</p>
//                  <p>💰 Fare: ₹300</p>
//                  <div className="mt-3">
//                    <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
//                      Accept
//                    </button>
//                    <button className="bg-red-500 text-white px-4 py-2 rounded">
//                      Reject
//                    </button>
//                  </div>
//               </div>
//             ))}
//         </div>
//         </div>
//       </div>
      //  {/* ✅ Footer at the bottom */}
      //  <Footer />
//     </div>
//   );
// };

// export default DriverDashboard;
