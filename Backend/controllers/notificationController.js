const Notification = require('../models/Notification');
const Driver = require('../models/Driver');
const CarOwner = require('../models/CarOwner');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();

    // Emit socket event for real-time notification
    req.app.get('io').to(notification.recipient.toString()).emit('newNotification', notification);

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id
    })
    .sort({ createdAt: -1 }) // Sort by creation date, newest first
    .limit(5); // Only return the 5 most recent notifications
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle booking response (accept/reject)
exports.handleBookingResponse = async (req, res) => {
  try {
    const { notificationId, status } = req.body;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Update notification status
    notification.bookingDetails.status = status;
    notification.read = true; // Mark as read when responded to
    await notification.save();

    // Create response notification for car owner
    const responseNotification = new Notification({
      type: status === 'accepted' ? 'booking_accepted' : 'booking_rejected',
      sender: notification.recipient,
      senderModel: 'Driver',
      recipient: notification.sender,
      recipientModel: 'CarOwner',
      message: `Driver has ${status} your booking request`,
      bookingDetails: notification.bookingDetails
    });
    await responseNotification.save();

    // Emit socket events
    const io = req.app.get('io');
    io.to(notification.sender.toString()).emit('bookingResponse', {
      originalNotification: notification,
      responseNotification
    });

    res.json({ message: `Booking ${status} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 