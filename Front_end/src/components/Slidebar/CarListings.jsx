import { useState } from "react";
import { FaTrash } from "react-icons/fa";

const CarListings = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    name: "",
    model: "",
    number: "",
    fuelType: "",
    capacity: "",
    rentPrice: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCar((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleAddCar = () => {
    const { name, model, number, fuelType, capacity, rentPrice, image } = newCar;
    if (name && model && number && fuelType && capacity && rentPrice && image) {
      setCars([...cars, newCar]);
      setNewCar({
        name: "",
        model: "",
        number: "",
        fuelType: "",
        capacity: "",
        rentPrice: "",
        image: null,
      });
    } else {
      alert("Please fill all fields and upload an image.");
    }
  };

  const handleDeleteCar = (index) => {
    const updatedCars = [...cars];
    updatedCars.splice(index, 1);
    setCars(updatedCars);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-10 text-center text-blue-800">
        🚘 My Car Listings
      </h2>

      {/* Upload Form */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">
          📤 Upload a New Car
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Car Name
              </label>
              <input
                type="text"
                name="name"
                value={newCar.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="e.g. Maruti Suzuki"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={newCar.model}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="e.g. Swift Dzire VXI"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Car Number
              </label>
              <input
                type="text"
                name="number"
                value={newCar.number}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="e.g. MH12 AB 1234"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Fuel Type
              </label>
              <select
                name="fuelType"
                value={newCar.fuelType}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option value="">Select Fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Seating Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={newCar.capacity}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="e.g. 5"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Rent Price (₹/day)
              </label>
              <input
                type="number"
                name="rentPrice"
                value={newCar.rentPrice}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="e.g. 1500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Upload Car Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />
            </div>

            <button
              onClick={handleAddCar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mt-2"
            >
              Add Car
            </button>
          </div>

          {/* Image Preview */}
          {newCar.image && (
            <div className="rounded-xl overflow-hidden border shadow-sm h-64">
              <img
                src={newCar.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <p className="text-center py-2 font-medium text-gray-600">Preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Car List */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          📋 Listed Cars
        </h3>

        {cars.length === 0 ? (
          <p className="text-gray-500 text-center">No cars listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg shadow-md hover:shadow-xl transition duration-300"
              >
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-48 w-full object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h4 className="text-xl font-bold text-gray-800 mb-1">
                    {car.name} - {car.model}
                  </h4>
                  <p className="text-sm text-gray-600">Number: {car.number}</p>
                  <p className="text-sm text-gray-600">Fuel: {car.fuelType}</p>
                  <p className="text-sm text-gray-600">
                    Seats: {car.capacity}
                  </p>
                  <p className="text-md font-semibold text-gray-800 mt-1">
                    ₹{car.rentPrice} / day
                  </p>

                  <button
                    onClick={() => handleDeleteCar(index)}
                    className="mt-4 flex items-center text-red-600 hover:underline text-sm"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarListings;
