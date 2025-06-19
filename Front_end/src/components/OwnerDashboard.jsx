import MapComponent from "./MapComponent";
import OwnerProfileDropdown from "./OwnerSidebar";
import OwnerSidebar from "./OwnerSidebar";
import Footer from "./Footer"; // ✅ Import Footer (adjust path if needed)
import Navbar from "./Navbar";
import BookingSystem from "./BookingSystem";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const OwnerDashboard = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [socket, setSocket] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Join user's room for notifications
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      newSocket.emit("join", user.id);
    }

    // Listen for booking responses
    newSocket.on("bookingResponse", (data) => {
      const { responseNotification } = data;
      const status = responseNotification.bookingDetails.status;
      const driverName = responseNotification.sender.name || "Driver";
      
      // Add the new notification to the state
      setNotifications(prev => [responseNotification, ...prev]);

      // Show a more detailed alert
      if (status === 'accepted') {
        alert(`Great news! ${driverName} has accepted your booking request for ${responseNotification.bookingDetails.startDate}. They will contact you shortly.`);
      } else {
        alert(`${driverName} has declined your booking request. You can try booking another driver.`);
      }
    });

    // Fetch drivers and notifications
    fetchDrivers();
    fetchNotifications();

    return () => newSocket.disconnect();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/carowner/drivers", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch drivers");
      }

      const data = await response.json();
      setDrivers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("Failed to load drivers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (driver) => {
    setSelectedDriver(driver);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (bookingDetails) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      // Ensure we have valid IDs before making the request
      if (!selectedDriver?._id) {
        throw new Error("Invalid driver data");
      }

      if (!user?.id) {
        throw new Error("User data not found");
      }

      const notificationData = {
        type: "booking_request",
        sender: user.id,
        senderModel: "CarOwner",
        recipient: selectedDriver._id,
        recipientModel: "Driver",
        message: `Booking request from ${user.name || 'a car owner'} for ${bookingDetails.numberOfDays} days starting ${bookingDetails.startDate}`,
        bookingDetails: {
          startDate: bookingDetails.startDate,
          numberOfDays: bookingDetails.numberOfDays,
          message: bookingDetails.message,
          status: "pending"
        }
      };
      
      // Create notification for the driver
      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(errorData.error || "Failed to send booking request");
      }

      const newNotification = await response.json();
      setNotifications(prev => [newNotification, ...prev]);

      setShowBookingModal(false);
      setSelectedDriver(null);
      alert(`Booking request sent to ${selectedDriver.name}! You'll be notified when they respond.`);
    } catch (error) {
      console.error("Error sending booking request:", error);
      alert(error.message || "Failed to send booking request. Please try again.");
    }
  };

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
            {loading ? (
              <div className="col-span-3 text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading drivers...</p>
              </div>
            ) : error ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={fetchDrivers}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            ) : drivers.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-600">No drivers available at the moment.</p>
              </div>
            ) : (
              drivers.map((driver) => (
                <div key={driver._id} className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-xl font-bold">{driver.name}</h4>
                      <p className="text-gray-600">{driver.experience} Years Experience</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="flex items-center text-gray-600">
                      <span className="mr-2">📱</span>
                      {driver.mobile}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <span className="mr-2">📍</span>
                      {driver.address}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <span className="mr-2">🚗</span>
                      License: {driver.licenseNo}
                    </p>
                  </div>

                  <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    onClick={() => handleBookNow(driver)}
                  >
                    <span className="mr-2">🚗</span>
                    Book Now
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Ride History */}
          <h3 className="text-2xl font-semibold mt-8">Your Previous Rides</h3>
          <ul className="mt-3">
            <li className="border p-3 shadow-sm">🛺 Ride to Airport - ₹500</li>
            <li className="border p-3 shadow-sm mt-2">🚗 Ride to Office - ₹200</li>
          </ul>
        </div>
      </div>
      
      {/* ✅ Footer at the bottom */}
      <Footer />

      {/* Booking Modal */}
      {showBookingModal && selectedDriver && (
        <BookingSystem
          driver={selectedDriver}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDriver(null);
          }}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;