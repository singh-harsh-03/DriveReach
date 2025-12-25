const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require('../middleware/auth');

// Create a new order
router.post('/create-order', auth, paymentController.createOrder);

// Verify payment
router.post('/verify', auth, paymentController.verifyPayment);

module.exports = router;