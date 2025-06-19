const express = require('express');
const CarOwner = require('../models/CarOwner');
const Driver = require('../models/Driver');
const router = express.Router();

// Create Car Owner
router.post('/', async (req, res) => {
  try {
    const carOwner = new CarOwner(req.body);
    await carOwner.save();
    return res.status(201).json(carOwner);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Get All Car Owners
router.get('/profile', async (req, res) => {
  try {
    const owners = await CarOwner.find();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car owners' });
  }
});

router.get('/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find();
    return res.json(drivers);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch drivers' });
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
