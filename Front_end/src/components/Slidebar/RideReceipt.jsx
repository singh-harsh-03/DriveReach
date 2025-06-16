import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPrint, FaFilePdf } from "react-icons/fa";

const mockData = {
  RC1023: {
    id: "RC1023",
    driver: "Raj Kumar",
    car: "Hyundai Creta",
    date: "2025-06-12",
    time: "07:45 AM",
    fare: 500,
    startLocation: "Sector 21, Gurgaon",
    endLocation: "T3, IGI Airport",
    distance: "24 km",
    duration: "45 min",
    paymentMode: "UPI",
  },
  RC1022: {
    id: "RC1022",
    driver: "Anjali Mehta",
    car: "Maruti Ertiga",
    date: "2025-06-10",
    time: "09:30 AM",
    fare: 350,
    startLocation: "Saket, Delhi",
    endLocation: "Cyberhub, Gurgaon",
    distance: "18 km",
    duration: "35 min",
    paymentMode: "Cash",
  },
};

const RideReceipt = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const ride = mockData[rideId];

  if (!ride) return <div className="p-6">Ride not found.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
        <button onClick={() => navigate(-1)} className="text-sm mb-4 text-blue-600 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to History
        </button>

        <h2 className="text-2xl font-bold mb-4">Ride Receipt - {ride.id}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong>Driver:</strong> {ride.driver}</div>
          <div><strong>Car:</strong> {ride.car}</div>
          <div><strong>Date:</strong> {ride.date}</div>
          <div><strong>Time:</strong> {ride.time}</div>
          <div><strong>From:</strong> {ride.startLocation}</div>
          <div><strong>To:</strong> {ride.endLocation}</div>
          <div><strong>Distance:</strong> {ride.distance}</div>
          <div><strong>Duration:</strong> {ride.duration}</div>
          <div><strong>Payment:</strong> {ride.paymentMode}</div>
          <div><strong>Total Fare:</strong> ₹{ride.fare}</div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <FaFilePdf className="mr-2" /> Download PDF
          </button>
          <button onClick={() => window.print()} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded flex items-center">
            <FaPrint className="mr-2" /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideReceipt;
