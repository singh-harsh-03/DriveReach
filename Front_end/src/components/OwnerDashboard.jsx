import MapComponent from "./MapComponent";
import OwnerProfileDropdown from "./OwnerSidebar";
import OwnerSidebar from "./OwnerSidebar";
import Footer from "./Footer"; // ✅ Import Footer (adjust path if needed)
import Navbar from "./Navbar";
import BookingSystem from "./BookingSystem";
import Notifications from "./Notifications";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const OwnerDashboard = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [socket, setSocket] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

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
      // Update notifications by keeping only the 5 most recent
      setNotifications(prev => {
        const updatedNotifications = [responseNotification, ...prev].slice(0, 5);
        return updatedNotifications;
      });
    });

    // Fetch drivers and notifications
    fetchDrivers();
    fetchNotifications();

    return () => {
      newSocket.disconnect();
      document.body.removeChild(script);
    };
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
      // Ensure we only keep the 5 most recent notifications
      setNotifications(data.slice(0, 5));
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

  const handleBookingSubmit = async (details) => {
    setBookingDetails(details);
    setShowBookingModal(false);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!selectedDriver?._id || !user?.id) {
        throw new Error("Invalid data");
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
      
      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        throw new Error("Failed to send booking request");
      }

      const newNotification = await response.json();
      // Update notifications by keeping only the 5 most recent
      setNotifications(prev => {
        const updatedNotifications = [newNotification, ...prev].slice(0, 5);
        return updatedNotifications;
      });
      
      toast.success(`Booking request sent to ${selectedDriver.name}! You'll be notified of their response.`, {
        position: "top-right",
        autoClose: 5000,
      });

      setShowConfirmation(false);
      setSelectedDriver(null);
      setBookingDetails(null);
    } catch (error) {
      console.error("Error sending booking request:", error);
      toast.error("Failed to send booking request. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handlePayment = async (amount) => {
    try {
      // Create order on the backend
      const orderResponse = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay payment
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DriveConnect',
        description: 'Driver Booking Payment',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (verifyResponse.ok) {
              toast.success('Payment successful!');
              // You can update the booking status or handle post-payment logic here
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user'))?.name || '',
          email: JSON.parse(localStorage.getItem('user'))?.email || ''
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />

      {/* Profile and Notifications Icons */}
      <div className="relative">
        <div className="absolute top-6 right-20 z-50">
          <Notifications userType="owner" notifications={notifications} />
        </div>
        <div className="absolute top-6 right-6 z-50">
          <OwnerSidebar />
        </div>

        <div className="container mx-auto p-6 mt-20">
          <h2 className="text-3xl font-bold mb-4">Find a Driver</h2>

          {/* Google Maps */}
          <MapComponent />

          {/* Confirmation Modal */}
          {showConfirmation && bookingDetails && selectedDriver && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4">Confirm Booking Request</h3>
                <div className="space-y-3">
                  <p><span className="font-semibold">Driver:</span> {selectedDriver.name}</p>
                  <p><span className="font-semibold">Start Date:</span> {bookingDetails.startDate}</p>
                  <p><span className="font-semibold">Duration:</span> {bookingDetails.numberOfDays} days</p>
                  <p><span className="font-semibold">Message:</span> {bookingDetails.message}</p>
                </div>
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleConfirmBooking}
                    className="bg-blue-500 text-white px-6 py-2.5 rounded hover:bg-blue-600 w-full text-center font-medium"
                  >
                    Confirm & Send Request
                  </button>
                  <button
                    onClick={() => handlePayment(2000)}
                    className="bg-green-500 text-white px-6 py-2.5 rounded hover:bg-green-600 w-full text-center font-medium"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmation(false);
                      setSelectedDriver(null);
                      setBookingDetails(null);
                    }}
                    className="bg-gray-500 text-white px-6 py-2.5 rounded hover:bg-gray-600 w-full text-center font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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
      {showBookingModal && (
        <BookingSystem
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookingSubmit}
          driver={selectedDriver}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;