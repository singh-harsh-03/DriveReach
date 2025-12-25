// import { Link } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <nav className="bg-blue-600 p-4 flex justify-between items-center text-white w-full fixed top-0 shadow-md">
//       <h1 className="text-2xl font-bold">DriveReach</h1>
//     </nav>
//   );
// };

// export default Navbar;

import { Link } from "react-router-dom";
import Notifications from "./Notifications";

const Navbar = () => {
  // Check if the current user is a driver
  const isDriver = localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")).role === "driver"
    : false;

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300"
      >
        DriveReach
      </Link>

      <div className="space-x-6 hidden md:flex">
        <Link to="/#about" className="text-gray-700 hover:text-blue-600 font-medium">
          About
        </Link>
        <Link to="/#contact" className="text-gray-700 hover:text-blue-600 font-medium">
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
