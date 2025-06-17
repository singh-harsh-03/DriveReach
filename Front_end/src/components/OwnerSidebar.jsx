import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaStar,
  FaCar,
  FaHistory,
  FaUserEdit,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OwnerSidebar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({}); // owner object from localStorage
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve owner data from localStorage
    const stored = localStorage.getItem("owner") || localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        // if stored is just a name string, handle accordingly
        setUser({ name: stored });
      }
    }
    const image = localStorage.getItem("ownerProfileImage");
    if (image) {
      setProfileImage(image);
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

  const handleNavigation = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  const handleLogout = () => {
    // Clear relevant localStorage keys
    localStorage.removeItem("owner");
    localStorage.removeItem("user");
    localStorage.removeItem("ownerProfileImage");
    // Redirect to login page
    navigate("/owner-login");
  };

  return (
    <div
      className="relative inline-block text-left">
      
      {/* Main icon or profile image */}
      {profileImage ? (
        <img
          src={profileImage}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border border-gray-300 cursor-pointer"
        />
      ) : (
      <FaUserCircle
          className="text-4xl cursor-pointer text-gray-700"
          onClick={() => setShowDropdown(!showDropdown)}
        />
      )}

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4 z-50">
          {/* Profile header */}
          <div className="flex items-center mb-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border border-gray-300 mr-3"
              />
            ) : (
              <FaUserCircle className="text-5xl text-gray-500 mr-3" />
            )}
            <div>
              <h4 className="font-bold text-lg">{user.name || "Owner"}</h4>
              <p className="flex items-center text-sm text-gray-500">
                <FaStar className="text-yellow-400 mr-1" />{" "}
                {user.rating != null ? user.rating : "N/A"}
              </p>
            </div>
          </div>

          {/* Grid of quick links */}
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            {/* My Cars */}
            <div
              className="bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
              onClick={() => {
                setShowDropdown(false);
                navigate("/owner/listings");
              }}
            >
              <FaCar className="mx-auto text-gray-700" />
              <p className="text-xs mt-1">My Cars</p>
            </div>
            {/* Ride History */}
            <div
              className="bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
              onClick={() => {
                setShowDropdown(false);
                navigate("/owner/history");
              }}
            >
              <FaHistory className="mx-auto text-gray-700" />
              <p className="text-xs mt-1">History</p>
            </div>
            {/* Edit Profile */}
            <div
              className="bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
              onClick={() => {
                setShowDropdown(false);
                navigate("/owner/profile");
              }}
            >
              <FaUserEdit className="mx-auto text-gray-700" />
              <p className="text-xs mt-1">Edit Profile</p>
            </div>
          </div>

          {/* Sign Out at bottom */}
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
