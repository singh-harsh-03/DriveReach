import { useState } from "react";

const BookingSystem = ({ driver, onClose, onSubmit }) => {
  const [bookingDetails, setBookingDetails] = useState({
    startDate: "",
    numberOfDays: 1,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      onSubmit(bookingDetails);
  };

  // Get today's date for min date in date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Book Driver</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <h4 className="font-bold text-lg">{driver.name}</h4>
              <p className="text-gray-600">{driver.experience} Years Experience</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">📱 {driver.mobile}</p>
            <p className="text-sm text-gray-600">📍 {driver.address}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              min={today}
              value={bookingDetails.startDate}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Days
            </label>
            <input
              type="number"
              name="numberOfDays"
              min="1"
              max="30"
              value={bookingDetails.numberOfDays}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Maximum 30 days</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message to Driver
            </label>
            <textarea
              name="message"
              value={bookingDetails.message}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Describe your requirements, pickup location, or any special instructions..."
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h5 className="font-medium mb-2">Estimated Cost</h5>
            <p className="text-2xl font-bold text-blue-600">₹{bookingDetails.numberOfDays * 500}</p>
            <p className="text-sm text-gray-500">Base rate: ₹500 per day</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex-1 flex items-center justify-center"
            >
              Continue to Confirmation
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingSystem;
