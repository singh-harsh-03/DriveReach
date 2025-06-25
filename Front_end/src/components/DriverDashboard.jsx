import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Navbar from "./Navbar";
import MapComponent from "./MapComponent";
import ProfileDropdown from "./DriverProfileDropdown";
import Notifications from "./Notifications";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./Footer"; // ✅ Import Footer (adjust path if needed)

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Join driver's room for notifications
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      newSocket.emit("join", user.id);
    }

    // Listen for new booking requests
    newSocket.on("newNotification", (notification) => {
      if (notification.type === "booking_request") {
        setNotifications(prev => {
          // Add new notification and keep only 5 most recent
          const updatedNotifications = [notification, ...prev].slice(0, 5);
          return updatedNotifications;
        });
        toast.info("New booking request received!", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    });

    // Fetch notifications
    fetchNotifications();

    return () => newSocket.disconnect();
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
        // Keep only 5 most recent notifications
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
          <h2 className="text-3xl font-bold mb-4">Driver Dashboard</h2>
          
           {/* Google Maps Component */}
           <MapComponent />

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
