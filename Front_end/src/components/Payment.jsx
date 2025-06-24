import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/payment", { amount });
      setStatus(res.data.message);
    } catch (err) {
      setStatus("Payment failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Make a Payment</h2>
      <form onSubmit={handlePayment}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
          Pay
        </button>
      </form>
      {status && <div className="mt-4">{status}</div>}
    </div>
  );
};

export default Payment;