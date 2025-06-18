// routes/rideRequest.js
const express = require("express");
const router = express.Router();
const RideRequest = require("../models/rideRequest");

// Create ride request
router.post("/", async (req, res) => {
  try {
    const request = new RideRequest(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get requests for driver
router.get("/driver/:driverId", async (req, res) => {
  try {
    const requests = await RideRequest.find({ driverId: req.params.driverId }).populate("ownerId carId");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update status (accept/reject)
router.put("/:requestId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const request = await RideRequest.findByIdAndUpdate(
      req.params.requestId,
      { status },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
