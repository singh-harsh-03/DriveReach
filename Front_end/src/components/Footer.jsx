import React from "react";
import "../pages/home.css";// Reuse your CSS

const Footer = () => {
  return (
    <footer className="advanced-footer" id="contact">
      <div className="footer-container">
        {/* Column 1 - About */}
        <div className="footer-column">
          <h3>DriveReach</h3>
          <p>
            DriveReach is your trusted partner in connecting vehicle owners with
            professional, verified drivers for daily, hourly, or intercity rides.
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
  );
};

export default Footer;
