
import { useState } from "react";

const Signup = () => {
  const [role, setRole] = useState("owner");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    carModel: "",
    carNumber: "",
    aadharNumber: "",
    dlNumber: "",
    experience: "",
    dlFile: null,
  });

  // ✅ Corrected handleChange function
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      mobile: formData.phone,
      address: formData.address,
      role,
    };
  
    if (role === "owner") {
      payload.carNumber = formData.carNumber;
    } else if (role === "driver") {
      payload.aadharNumber = formData.aadharNumber;
      payload.licenseNo = formData.dlNumber;
      payload.experience = formData.experience;
      // dlFile skipped
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log("Signup successful:", data.message);
  
        // ✅ Clear form after successful submission
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          carModel: "",
          carNumber: "",
          aadharNumber: "",
          dlNumber: "",
          experience: "",
          dlFile: null,
        });
  
        setRole("owner"); // Optional: reset role too
      } else {
        console.log("Signup error:", data.message);
      }
    } catch (error) {
      console.log("Signup failed:", error.message);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg w-96 overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign Up</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Common Fields */}
          <input className="border p-2 w-full" type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input className="border p-2 w-full" type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="border p-2 w-full" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input className="border p-2 w-full" type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input className="border p-2 w-full" type="text" name="address" placeholder="Address" onChange={handleChange} required />

          {/* Role Selection */}
          <select className="border p-2 w-full" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="owner">Car Owner</option>
            <option value="driver">Driver</option>
          </select>

          {/* Owner-Specific Fields */}
          {role === "owner" && (
            <>
              <input className="border p-2 w-full" type="text" name="carModel" placeholder="Car Model" onChange={handleChange} />
              <input className="border p-2 w-full" type="text" name="carNumber" placeholder="Car Number" onChange={handleChange} />
            </>
          )}

          {/* Driver-Specific Fields */}
          {role === "driver" && (
            <>
              <input className="border p-2 w-full" type="text" name="aadharNumber" placeholder="Aadhar Number" onChange={handleChange} />
              <input className="border p-2 w-full" type="text" name="dlNumber" placeholder="DL Number" onChange={handleChange} />
              <input className="border p-2 w-full" type="number" name="experience" placeholder="Experience (Years)" onChange={handleChange} />
              <div>
                <label className="block text-gray-700 mb-1">Upload Driver's License</label>
                <input className="border p-2 w-full" type="file" name="dlFile" accept="image/*" onChange={handleChange} />
              </div>
            </>
          )}

          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded shadow-md w-full">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
