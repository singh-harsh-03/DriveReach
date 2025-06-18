const mongoose = require('mongoose');

const carOwnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
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
  // carNumber: {
  //   type: String,
  //   required: [true, 'Car number is required']
  // },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  role: {
    type: String,
    required: [true, 'role is required']
  },
}, { timestamps: true });

module.exports = mongoose.model('CarOwner', carOwnerSchema);
