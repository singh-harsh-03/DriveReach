// ProfileDropdown.jsx
import { useState, useEffect } from "react";
import { FaUserCircle, FaStar, FaCar, FaHistory, FaWallet, FaSignOutAlt } from "react-icons/fa";

const ProfileDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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

  return (
    <div
      className="relative inline-block text-left"
      onClick={() => setShowDropdown(true)}
    >
      {/* Profile Icon */}
      <FaUserCircle className="text-4xl cursor-pointer text-gray-700" />

      {/* Dropdown Panel */}
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
              <FaWallet className="mx-auto text-gray-700" />
              <p className="text-xs mt-1">Earnings</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <FaCar className="mx-auto text-gray-700" />
              <p className="text-xs mt-1">5 yrs</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <FaHistory className="mx-auto text-gray-700" />
              <p className="text-xs mt-1">50 Rides</p>
            </div>
          </div>

          <button className="w-full text-sm text-left py-2 border-t pt-2 text-gray-700 hover:underline">
            ⚙️ Edit Profile
          </button>
        
          <button className="w-full text-sm text-left py-2 text-red-600 hover:underline font-semibold">
            <FaSignOutAlt className="inline mr-2" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
