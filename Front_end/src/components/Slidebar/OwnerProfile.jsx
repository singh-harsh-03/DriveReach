import { useState, useEffect } from "react";

const OwnerProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    company: "",
  });

  useEffect(() => {
    // 🔁 Fetch initial data (mocked for now)
    const storedName = localStorage.getItem("ownerName") || "John Doe";
    setOwnerDetails((prev) => ({ ...prev, name: storedName }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOwnerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // ✅ This would typically make an API call to save details
    localStorage.setItem("ownerName", ownerDetails.name);
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Profile</h2>

      <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
        <div>
          <div className="relative w-32 h-32">
            <img
              src={
                previewImage ||
                "https://www.w3schools.com/w3images/avatar2.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <p className="text-sm text-center text-gray-500 mt-2">
            Click to change
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={ownerDetails.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              name="email"
              value={ownerDetails.email}
              onChange={handleInputChange}
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              value={ownerDetails.phone}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Location
            </label>
            <input
              name="location"
              value={ownerDetails.location}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="City, State"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-200"
      >
        Save Changes
      </button>
    </div>
  );
};

export default OwnerProfile;
