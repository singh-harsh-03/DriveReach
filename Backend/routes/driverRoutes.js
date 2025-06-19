const express = require('express');
const Driver = require('../models/Driver');
const router = express.Router();
const auth = require('../middleware/auth');

// Create Driver
router.post('/', async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get Driver by ID
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching driver' });
  }
});

// Update Driver
router.put('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//put req
router.put('/:id/location', async (req, res) => {
  try {
    const { location } = req.body;

    // Validate GeoJSON
    if (
      !location ||
      location.type !== 'Point' ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 ||
      typeof location.coordinates[0] !== 'number' ||
      typeof location.coordinates[1] !== 'number'
    ) {
      return res.status(400).json({ message: 'Invalid location format. Expected GeoJSON Point with coordinates [longitude, latitude].' });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { location },
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({ message: 'Location updated successfully', driver });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete Driver
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete driver' });
  }
});

// Get all available drivers
router.get('/available', auth, async (req, res) => {
  try {
    const drivers = await Driver.find({ isAvailable: true })
      .select('name rating experience location'); // Only send necessary fields
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
