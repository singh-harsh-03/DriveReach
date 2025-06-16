import { useState } from "react";
import { FaClock, FaMapMarkerAlt, FaCar, FaUser, FaFileInvoice } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RideHistory = () => {
  const navigate = useNavigate();

  const [rides] = useState([
    {
      id: "RC1023",
      driver: "Raj Kumar",
      car: "Hyundai Creta",
      startLocation: "Sector 21, Gurgaon",
      endLocation: "T3, IGI Airport",
      date: "2025-06-12",
      time: "07:45 AM",
      fare: 500,
      status: "Completed",
    },
    {
      id: "RC1022",
      driver: "Anjali Mehta",
      car: "Maruti Ertiga",
      startLocation: "Saket, Delhi",
      endLocation: "Cyberhub, Gurgaon",
      date: "2025-06-10",
      time: "09:30 AM",
      fare: 350,
      status: "Completed",
    },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Ride History</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="flex justify-between mb-2">
              <h4 className="text-lg font-bold">Ride ID: {ride.id}</h4>
              <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
                {ride.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <FaUser className="mr-2" /> Driver: {ride.driver}
            </div>
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <FaCar className="mr-2" /> Car: {ride.car}
            </div>
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> From: {ride.startLocation}
            </div>
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> To: {ride.endLocation}
            </div>
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <FaClock className="mr-2" /> {ride.date} at {ride.time}
            </div>
            <div className="text-md font-semibold mt-2">Fare: ₹{ride.fare}</div>

            <button
              className="mt-4 text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded inline-flex items-center"
              onClick={() => navigate(`/owner/history/${ride.id}`)}
            >
              <FaFileInvoice className="mr-2" /> View Receipt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideHistory;
