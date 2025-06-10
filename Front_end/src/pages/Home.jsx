import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import driverImage from "../assets/driver.jpg"; // Assuming you have an image in your assets folder

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 lg:px-20 flex flex-col md:flex-row items-center justify-between min-h-screen">

        {/* Left Section - Text & Buttons */}
        <div className="md:w-1/2 text-center md:text-left">
          <p className="text-green-600 text-lg font-semibold">Find Trusted Drivers Nearby</p>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mt-2">
            Book a driver for your car hassle-free.
          </h1>
          <p className="text-gray-500 text-lg mt-3">
            We connect you with verified professional drivers in minutes.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
          <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded text-lg font-medium hover:bg-blue-700">
              Login
            </Link>
            <Link to="/signup" className="bg-blue-500 text-white px-6 py-3 rounded text-lg font-medium hover:bg-blue-700">
              Sign Up
            </Link>
            <Link to="/owner" className="bg-gray-800 text-white px-6 py-3 rounded text-lg font-medium hover:bg-gray-900">
              Owner
            </Link>
            <Link to="/driver" className="bg-gray-300 text-gray-800 px-6 py-3 rounded text-lg font-medium hover:bg-gray-400">
              Driver
            </Link>
          </div>
        </div>

        {/* Right Section - Illustration/Image */}
        <div className="md:w-1/2 flex justify-center">
          <img src={driverImage} alt="Driver Service" className="w-full" />
        </div>

      </div>
    </div>
  );
};

export default Home;
