import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaStar,
  FaCar,
  FaHistory,
  FaWallet,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";

const DriverProfileDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showDropdown]);

  const handleNavigation = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/driver-login");
  };

  return (
    <div className="relative inline-block text-left">
      <FaUserCircle
        className="text-4xl cursor-pointer text-gray-700"
        onClick={() => setShowDropdown(!showDropdown)}
      />

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4 z-50">
          <div className="flex items-center mb-4">
            <FaUserCircle className="text-5xl text-gray-500 mr-3" />
            <div>
              <h4 className="font-bold text-lg">{user.name || "Driver"}</h4>
              <p className="flex items-center text-sm text-gray-500">
                <FaStar className="text-yellow-400 mr-1" /> {user.rating || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <button
            className="w-full text-sm text-left py-2 border-t pt-2 text-gray-700 hover:underline"
            onClick={() => handleNavigation("/driver/profile")}
          >
            <FaUserEdit className="inline mr-2" />
            Edit Profile
          </button>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <FaCar className="mx-auto text-gray-700" />
              <p className="text-xs mt-1">5 yrs</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <FaHistory className="mx-auto text-gray-700" />
              <button
            className="w-full text-sm text-left py-2 text-gray-700 hover:underline"
            onClick={() => handleNavigation("/driver/history")}
          >
            📖 Ride History
          </button>
            </div>
          </div>

          <button
            className="w-full text-sm text-left py-2 text-gray-700 hover:underline"
            onClick={() => handleNavigation("/driver/earnings")}
          >
            💰 View Earnings
          </button>
          <button
            className="w-full text-sm text-left py-2 text-red-600 hover:underline font-semibold"
            onClick={handleSignOut}
          >
            <FaSignOutAlt className="inline mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default DriverProfileDropdown;
