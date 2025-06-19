const express = require('express');
const CarOwner = require('../models/CarOwner');
const router = express.Router();

// Create Car Owner
router.post('/', async (req, res) => {
  try {
    const carOwner = new CarOwner(req.body);
    await carOwner.save();
    res.status(201).json(carOwner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Car Owners
router.get('/', async (req, res) => {
  try {
    const owners = await CarOwner.find();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car owners' });
  }
});

// Get Car Owner by ID
router.get('/:id', async (req, res) => {
  try {
    const owner = await CarOwner.findById(req.params.id);
    if (!owner) return res.status(404).json({ error: 'Car owner not found' });
    res.json(owner);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching car owner' });
  }
});

// Update Car Owner
router.put('/:id', async (req, res) => {
  try {
    const owner = await CarOwner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!owner) return res.status(404).json({ error: 'Car owner not found' });
    res.json(owner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Update Car Owner Location
router.put('/:id/location', async (req, res) => {
  try {
    const { location } = req.body;

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

    const owner = await CarOwner.findByIdAndUpdate(
      req.params.id,
      { location },
      { new: true, runValidators: true }
    );

    if (!owner) {
      return res.status(404).json({ message: 'Car owner not found' });
    }

    res.json({ message: 'Location updated successfully', owner });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Car Owner
router.delete('/:id', async (req, res) => {
  try {
    const owner = await CarOwner.findByIdAndDelete(req.params.id);
    if (!owner) return res.status(404).json({ error: 'Car owner not found' });
    res.json({ message: 'Car owner deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car owner' });
  }
});

module.exports = router;
