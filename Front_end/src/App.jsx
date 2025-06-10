import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./components/Signup";
import Login  from "./components/login";
import OwnerDashboard from "./components/OwnerDashboard";
import DriverDashboard from "./components/DriverDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login"  element={<Login/>} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
      </Routes>
    </Router>
  
  );
}

export default App;
