import { useState, useEffect } from "react";

const DriverEditProfile = () => {
  const [driver, setDriver] = useState({
    name: "",
    phone: "",
    license: "",
    experience: "",
    rating: "", // View only
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      setDriver({
        name: stored.name || "",
        phone: stored.phone || "",
        license: stored.license || "",
        experience: stored.experience || "",
        rating: stored.rating || "N/A", // Still shown
      });
    }
  }, []);

  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save only editable data
    const { name, phone, license, experience, rating } = driver;
    localStorage.setItem(
      "user",
      JSON.stringify({ name, phone, license, experience, rating })
    );

    alert("✅ Profile updated successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">👤 Edit Driver Profile</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={driver.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={driver.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* License */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">License Number</label>
          <input
            type="text"
            name="license"
            value={driver.license}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Experience (Years)</label>
          <input
            type="number"
            name="experience"
            value={driver.experience}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Rating (Disabled) */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Rating</label>
          <input
            type="text"
            value={driver.rating}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default DriverEditProfile;
