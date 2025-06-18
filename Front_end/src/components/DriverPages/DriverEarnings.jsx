// ✅ DriverEarnings.jsx
import { FaMoneyBillWave, FaCalendarWeek, FaGift, FaWallet } from "react-icons/fa";

const DriverEarnings = () => {
  const totalEarnings = 25000;
  const completedRides = 50;
  const weeklyEarnings = 3200;
  const lastPayout = 7000;
  const lastPayoutDate = "June 14, 2025";

  return (
    <div className="p-6 max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">💰 Driver Earnings Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Total Earnings */}
        <div className="flex items-center bg-green-100 p-5 rounded-lg shadow">
          <FaMoneyBillWave className="text-4xl text-green-600 mr-4" />
          <div>
            <p className="text-lg font-semibold text-green-700">Total Earnings</p>
            <p className="text-2xl font-bold">₹{totalEarnings}</p>
          </div>
        </div>

        {/* Weekly Earnings */}
        <div className="flex items-center bg-blue-100 p-5 rounded-lg shadow">
          <FaCalendarWeek className="text-4xl text-blue-600 mr-4" />
          <div>
            <p className="text-lg font-semibold text-blue-700">This Week</p>
            <p className="text-2xl font-bold">₹{weeklyEarnings}</p>
            <p className="text-sm text-gray-600">12 rides completed</p>
          </div>
        </div>

        {/* Completed Rides */}
        <div className="flex items-center bg-yellow-100 p-5 rounded-lg shadow">
          <FaGift className="text-4xl text-yellow-600 mr-4" />
          <div>
            <p className="text-lg font-semibold text-yellow-700">Completed Rides</p>
            <p className="text-2xl font-bold">{completedRides}</p>
            <p className="text-sm text-gray-600">🎉 Great job!</p>
          </div>
        </div>

        {/* Last Payout */}
        <div className="flex items-center bg-purple-100 p-5 rounded-lg shadow">
          <FaWallet className="text-4xl text-purple-600 mr-4" />
          <div>
            <p className="text-lg font-semibold text-purple-700">Last Payout</p>
            <p className="text-2xl font-bold">₹{lastPayout}</p>
            <p className="text-sm text-gray-600">on {lastPayoutDate}</p>
          </div>
        </div>
      </div>

      {/* Placeholder for Graph */}
      <div className="mt-10 p-6 border-dashed border-2 border-gray-300 rounded-lg text-center text-gray-500">
        📊 Earnings Graph Coming Soon...
      </div>
    </div>
  );
};

export default DriverEarnings;
