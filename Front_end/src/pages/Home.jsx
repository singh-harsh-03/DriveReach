// import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import driverImage from "../assets/driver.jpg"; // Assuming you have an image in your assets folder

// const Home = () => {
//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Navbar />
//       <div className="container mx-auto px-6 lg:px-20 flex flex-col md:flex-row items-center justify-between min-h-screen">

//         {/* Left Section - Text & Buttons */}
//         <div className="md:w-1/2 text-center md:text-left">
//           <p className="text-green-600 text-lg font-semibold">Find Trusted Drivers Nearby</p>
//           <h1 className="text-5xl font-bold text-gray-900 leading-tight mt-2">
//             Book a driver for your car hassle-free.
//           </h1>
//           <p className="text-gray-500 text-lg mt-3">
//             We connect you with verified professional drivers in minutes.
//           </p>

//           {/* Buttons */}
//           <div className="mt-6 flex flex-col md:flex-row gap-4">
//           <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded text-lg font-medium hover:bg-blue-700">
//               Login
//             </Link>
//             <Link to="/signup" className="bg-blue-500 text-white px-6 py-3 rounded text-lg font-medium hover:bg-blue-700">
//               Sign Up
//             </Link>
//             <Link to="/owner" className="bg-gray-800 text-white px-6 py-3 rounded text-lg font-medium hover:bg-gray-900">
//               Owner
//             </Link>
//             <Link to="/driver" className="bg-gray-300 text-gray-800 px-6 py-3 rounded text-lg font-medium hover:bg-gray-400">
//               Driver
//             </Link>
//           </div>
//         </div>

//         {/* Right Section - Illustration/Image */}
//         <div className="md:w-1/2 flex justify-center">
//           <img src={driverImage} alt="Driver Service" className="w-full" />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Home;
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../pages/home.css";
import driverImage from "../assets/driver.jpg";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
  <div className="hero-text">
    <h1>Drive With Confidence</h1>
    <p className="tagline">India's #1 Platform for Hiring Verified Drivers</p>

    <ul className="features-list">
      <li>✔ 100% Background-Verified Drivers</li>
      <li>✔ Instant Matching with Available Drivers</li>
      <li>✔ Hourly, Daily, or Intercity Bookings</li>
      <li>✔ Real-Time Tracking & Transparent Pricing</li>
    </ul>

    <div className="cta-buttons">
      <a href="/login" className="btn primary-btn">Login</a>
      <a href="/signup" className="btn secondary-btn">Sign Up</a>
    </div>

    <p className="trust-note">Trusted by 10,000+ customers across 20+ cities</p>
  </div>

  <div className="hero-image">
    <img src={driverImage} alt="Driver Service" />
  </div>
</section>


      {/* Divider Wave */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#fff"
            fillOpacity="1"
            d="M0,224L48,197.3C96,171,192,117,288,112C384,107,480,149,576,154.7C672,160,768,128,864,106.7C960,85,1056,75,1152,85.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <section id="about" className="about-section">
  <div className="about-content">
    <h2 className="about-title">About <span className="highlight">DriveReach</span></h2>
    <p className="about-text">
      <i className="fas fa-car-side text-blue-400 mr-2"></i>
      DriveReach is a cutting-edge transportation platform bridging the gap between car owners and verified professional drivers.
    </p>
    <p className="about-text">
      <i className="fas fa-bolt text-yellow-400 mr-2"></i>
      With smart AI-matching, we ensure fast availability, transparent pricing, and seamless real-time tracking.
    </p>
    <p className="about-text">
      <i className="fas fa-map-marker-alt text-green-400 mr-2"></i>
      Whether it's daily commutes or long-distance rides, DriveReach delivers safety, reliability, and comfort — all at your fingertips.
    </p>
  </div>
</section>


      {/* Footer */}
      <footer id="contact" className="advanced-footer">
  <div className="footer-container">
    {/* Column 1 - About */}
    <div className="footer-column">
      <h3>DriveReach</h3>
      <p>
        DriveReach is your trusted partner in connecting vehicle owners with professional, verified drivers for daily, hourly, or intercity rides.
      </p>
    </div>

    {/* Column 2 - Quick Links */}
    <div className="footer-column">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="/#about">About Us</a></li>
        <li><a href="/#contact">Contact</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/signup">Sign Up</a></li>
      </ul>
    </div>

    {/* Column 3 - Contact Info */}
    <div className="footer-column">
      <h4>Contact</h4>
      <p>Email: support@drivereach.com</p>
      <p>Phone: +91-9876543210</p>
      <p>Location: Connaught Place, New Delhi</p>
    </div>

    {/* Column 4 - Social Links */}
    <div className="footer-column">
      <h4>Follow Us</h4>
      <div className="social-icons">
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-linkedin-in"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2025 DriveReach. All rights reserved.</p>
  </div>
</footer>

    </div>
  );
};

export default Home;
