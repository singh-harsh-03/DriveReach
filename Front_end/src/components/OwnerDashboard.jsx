import { useEffect, useState } from "react";
import axios from "axios";
import MapComponent from "./MapComponent";
import OwnerSidebar from "./OwnerSidebar";
import Navbar from "./Navbar";
import Footer from "./Footer"; // ✅ Import Footer (adjust path if needed)

const OwnerDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await axios.get("http://localhost:5000/api/drivers");
      setDrivers(res.data);
    };
    fetchDrivers();
  }, []);

  const sendRideRequest = async (driverId) => {
    const ownerId = localStorage.getItem("ownerId");
    const carId = "your-car-id"; // 🔧 Replace with actual car ID selection logic

    try {
      await axios.post("http://localhost:5000/api/ride-requests", {
        ownerId,
        driverId,
        carId,
        location: {
          type: "Point",
          coordinates: [77.2090, 28.6139], // 🔧 Replace with actual geolocation
        },
      });
      alert("Request sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow relative">
        <div className="absolute top-6 right-6 z-50">
          <OwnerSidebar />
        </div>

        <div className="container mx-auto p-6 mt-20">
          <h2 className="text-3xl font-bold mb-4">Find a Driver</h2>

          {/* Location Search Input */}
          <input
            type="text"
            placeholder="Enter your location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-3 w-full mb-6"
          />

          {/* Google Maps */}
          <MapComponent />

          {/* Driver Listings */}
          <h3 className="text-2xl font-semibold mt-6">Available Drivers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {drivers.map((driver) => (
              <div key={driver._id} className="border p-4 shadow-md">
                <h4 className="text-xl font-bold">{driver.name}</h4>
                <p>⭐ Rating | 🚗 {driver.experience} Years Experience</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-3 rounded"
                  onClick={() => sendRideRequest(driver._id)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
