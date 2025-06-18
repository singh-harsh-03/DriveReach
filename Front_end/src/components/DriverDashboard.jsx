// import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";
// import MapComponent from "./MapComponent";
// import ProfileDropdown from "./DriverProfileDropdown";


// const DriverDashboard = () => {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <Navbar />

//       {/* ✅ Profile Icon Positioned in top-right */}
//       <div className="relative">
//         <div className="absolute top-6 right-6 z-50">
//           <ProfileDropdown navigate={navigate} />
//         </div>

//         <div className="container mx-auto p-6 mt-20">
//           <h2 className="text-3xl font-bold mb-4">Driver Dashboard</h2>

//           {/* Google Maps Component */}
//           <MapComponent />

//           {/* Ride Requests */}
//           <h3 className="text-2xl font-semibold">New Ride Requests</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//             {[1, 2, 3].map((ride) => (
//               <div key={ride} className="border p-4 shadow-md">
//                 <h4 className="text-xl font-bold">Ride {ride}</h4>
//                 <p>📍 Pickup: XYZ Location</p>
//                 <p>💰 Fare: ₹300</p>
//                 <div className="mt-3">
//                   <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
//                     Accept
//                   </button>
//                   <button className="bg-red-500 text-white px-4 py-2 rounded">
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Earnings Section */}
//           <h3 className="text-2xl font-semibold mt-8">Earnings</h3>
//           <p className="text-lg mt-2">💰 Total Earnings: ₹25,000</p>
//           <p className="text-lg">✅ Completed Rides: 50</p>

//           {/* Driver Profile */}
//           <h3 className="text-2xl font-semibold mt-8">Profile</h3>
//           <div className="border p-4 shadow-md">
//             <p>👤 Name: John Doe</p>
//             <p>🚗 Experience: 5 Years</p>
//             <p>🆔 License: DL-123456789</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DriverDashboard;

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import MapComponent from "./MapComponent";
import ProfileDropdown from "./DriverProfileDropdown";
import Footer from "./Footer"; // ✅ Import Footer (adjust path if needed)

const DriverDashboard = () => {
  const [requests, setRequests] = useState([]);
  const driverId = localStorage.getItem("driverId"); // From login

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await axios.get(`http://localhost:5000/api/ride-requests/driver/${driverId}`);
      setRequests(res.data);
    };
    fetchRequests();
  }, []);

  const updateRequestStatus = async (requestId, status) => {
    await axios.put(`http://localhost:5000/api/ride-requests/${requestId}/status`, { status });
    setRequests((prev) =>
      prev.map((r) => (r._id === requestId ? { ...r, status } : r))
    );
  };

  return (
    <div>
      <Navbar />
      <div className="relative">
        <div className="absolute top-6 right-6 z-50">
          <ProfileDropdown />
        </div>
        <div className="container mx-auto p-6 mt-20">
          <h2 className="text-3xl font-bold mb-4">Driver Dashboard</h2>
          <MapComponent />
          <h3 className="text-2xl font-semibold">New Ride Requests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {requests.map((req) => (
              <div key={req._id} className="border p-4 shadow-md">
                <h4 className="text-xl font-bold">{req?.ownerId?.name}</h4>
                <p>📍 Location: {req.location?.coordinates?.join(", ")}</p>
                <p>Status: {req.status}</p>
                <div className="mt-3">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => updateRequestStatus(req._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => updateRequestStatus(req._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
       {/* ✅ Footer at the bottom */}
       <Footer />
    </div>
  );
};

export default DriverDashboard;
