import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./components/Signup";
import Login from "./components/login";
import OwnerDashboard from "./components/OwnerDashboard";
import DriverDashboard from "./components/DriverDashboard";

// ✅ Import Owner Sidebar Pages
import OwnerProfile from "./components/Slidebar/OwnerProfile";
import CarListings from "./components/Slidebar/CarListings";
import RideHistory from "./components/Slidebar/RideHistory";
import RideReceipt from "./components/Slidebar/RideReceipt"; 

import DriverProfile from "./components/DriverPages/DriverProfile";
import DriverEarnings from "./components/DriverPages/DriverEarnings";
import DriverHistory from "./components/DriverPages/DriverHistory";
import Payment from "./components/Payment";


function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />

        {/* ✅ Owner Functional Pages */}
        <Route path="/owner/profile" element={<OwnerProfile />} />
        <Route path="/owner/listings" element={<CarListings />} />
        <Route path="/owner/history" element={<RideHistory />} />
        <Route path="/owner/history/:rideId" element={<RideReceipt />} />
        <Route path="/owner/payment" element={<Payment />} /> 


         {/* Driver Functional Pages */}
         <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/driver/earnings" element={<DriverEarnings />} />
        <Route path="/driver/history" element={<DriverHistory />} />

      </Routes>
    </Router>
  );
}

export default App;

