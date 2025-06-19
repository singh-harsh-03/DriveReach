const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  handleBookingResponse
} = require('../controllers/notificationController');

// Create a new notification
router.post('/', auth, createNotification);

// Get user's notifications
router.get('/', auth, getUserNotifications);

// Mark notification as read
router.put('/:id/read', auth, markAsRead);

// Handle booking response (accept/reject)
router.post('/booking-response', auth, handleBookingResponse);

module.exports = router; 