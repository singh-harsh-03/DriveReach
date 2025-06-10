import { useState } from "react";

const Login = () => {
  const [role, setRole] = useState("owner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    console.log("Login Details:");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", role);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Login</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            className="border p-2 w-full"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border p-2 w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="border p-2 w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="owner">Car Owner</option>
            <option value="driver">Driver</option>
          </select>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded shadow-md w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
