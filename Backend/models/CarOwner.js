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
    minlength: [6, 'Password must be at least 6 characters'],
    match: [
      /^(?=.*[A-Z])(?=.*\d).+$/,
      'Password must contain at least one uppercase letter and one number'
    ]
  }
,  
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^\d{10}$/, 'Mobile number must be 10 digits']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  role: {
    type: String,
    required: [true, 'role is required']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      default: [0, 0]
    }
  }
}, { timestamps: true });
carOwnerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('CarOwner', carOwnerSchema);
