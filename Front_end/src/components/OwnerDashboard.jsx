import Navbar from "./Navbar";
import MapComponent from "./MapComponent";
import OwnerProfileDropdown from "./OwnerSidebar";
import OwnerSidebar from "./OwnerSidebar";

const OwnerDashboard = () => {
  return (
    <div>
      <Navbar />

      {/* ✅ Owner Profile Icon Positioned in top-right */}
      <div className="relative">
        <div className="absolute top-6 right-6 z-50">
          <OwnerSidebar />
        </div>

        <div className="container mx-auto p-6 mt-20">
          <h2 className="text-3xl font-bold mb-4">Find a Driver</h2>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Enter your location..."
            className="border p-3 w-full mb-6"
          />

          {/* Google Maps */}
          <MapComponent />

          {/* Available Drivers */}
          <h3 className="text-2xl font-semibold mt-6">Available Drivers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {[1, 2, 3].map((driver) => (
              <div key={driver} className="border p-4 shadow-md">
                <h4 className="text-xl font-bold">Driver {driver}</h4>
                <p>⭐ 4.5 Rating | 🚗 5 Years Experience</p>
                <button className="bg-blue-500 text-white px-4 py-2 mt-3 rounded">
                  Book Now
                </button>
              </div>
            ))}
          </div>

          {/* Ride History */}
          <h3 className="text-2xl font-semibold mt-8">Your Previous Rides</h3>
          <ul className="mt-3">
            <li className="border p-3 shadow-sm">🛺 Ride to Airport - ₹500</li>
            <li className="border p-3 shadow-sm mt-2">🚗 Ride to Office - ₹200</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
