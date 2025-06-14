import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaStar,
  FaCar,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";

const OwnerSidebar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("ownerName") || "Owner";
    setOwnerName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ownerName");
    navigate("/login");
  };

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <FaUserCircle className="text-4xl cursor-pointer text-gray-700" />

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4 z-50">
          <div className="flex items-center mb-4">
            <FaUserCircle className="text-5xl text-gray-500 mr-3" />
            <div>
              <h4 className="font-bold text-lg">{ownerName}</h4>
              <p className="flex items-center text-sm text-gray-500">
                <FaStar className="text-yellow-400 mr-1" /> Car Owner
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center mb-4">
            <div
              className="bg-gray-100 p-2 rounded-lg cursor-pointer"
              onClick={() => navigate("/owner/listings")}
            >
              <FaCar className="mx-auto text-gray-700" />
              <p className="text-xs mt-1">My Cars</p>
            </div>
            <div
              className="bg-gray-100 p-2 rounded-lg cursor-pointer"
              onClick={() => navigate("/owner/history")}
            >
              <FaHistory className="mx-auto text-gray-700" />
              <p className="text-xs mt-1">History</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/owner/profile")}
            className="w-full text-sm text-left py-2 border-t pt-2 text-gray-700 hover:underline"
          >
            ⚙️ Edit Profile
          </button>
          <button
            className="w-full text-sm text-left py-2 text-red-600 hover:underline font-semibold"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="inline mr-2" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default OwnerSidebar;
