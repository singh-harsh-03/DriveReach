const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Email is invalid']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^\d{10}$/, 'Mobile number must be 10 digits']
  },
  licenseNo: {
    type: String,
    required: [true, 'Driving License Number is required']
  },
  aadharNumber: {
    type: String,
    required: [true, 'Aadhar Number is required'],
    match: [/^\d{12}$/, 'Aadhar number must be 12 digits']
  },
  experience: {
    type: Number,
    required: [true, 'Driving experience (in years) is required'],
    min: [0, 'Experience cannot be negative']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  role: {
    type: String,
    required: [true, 'role is required']
  },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
