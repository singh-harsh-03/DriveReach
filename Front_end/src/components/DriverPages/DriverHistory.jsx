import { useEffect, useState } from "react";
import { FaClock, FaLocationArrow, FaRupeeSign, FaCheckCircle } from "react-icons/fa";

const DriverHistory = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    // Load dummy or saved ride history
    const history = JSON.parse(localStorage.getItem("driverRideHistory")) || [
      {
        id: 1,
        date: "2025-06-15",
        pickup: "Sector 62, Noida",
        drop: "Connaught Place, Delhi",
        fare: 540,
        status: "Completed",
        time: "10:15 AM",
      },
      {
        id: 2,
        date: "2025-06-13",
        pickup: "Indirapuram",
        drop: "Gurugram Cyberhub",
        fare: 720,
        status: "Completed",
        time: "3:45 PM",
      },
      {
        id: 3,
        date: "2025-06-10",
        pickup: "Ghaziabad",
        drop: "New Delhi Railway Station",
        fare: 450,
        status: "Completed",
        time: "9:00 AM",
      },
    ];
    setRides(history);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🕘 Ride History</h2>

      {rides.length === 0 ? (
        <p className="text-gray-600">No rides completed yet.</p>
      ) : (
        <div className="space-y-6">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="border rounded-lg p-5 shadow hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                <div>
                  <h4 className="text-xl font-semibold mb-1">🚘 Ride #{ride.id}</h4>
                  <p className="text-gray-600 flex items-center">
                    <FaClock className="mr-2" />
                    {ride.date} at {ride.time}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-green-600 font-semibold flex items-center">
                    <FaCheckCircle className="mr-2" />
                    {ride.status}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                <p className="text-gray-700 flex items-center">
                  <FaLocationArrow className="mr-2 text-blue-500 rotate-45" />
                  Pickup: <span className="ml-1 font-medium">{ride.pickup}</span>
                </p>
                <p className="text-gray-700 flex items-center">
                  <FaLocationArrow className="mr-2 text-red-500 -rotate-45" />
                  Drop: <span className="ml-1 font-medium">{ride.drop}</span>
                </p>
              </div>

              <div className="mt-3 flex items-center">
                <FaRupeeSign className="text-green-600 mr-2" />
                <span className="text-lg font-bold">₹{ride.fare}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverHistory;
