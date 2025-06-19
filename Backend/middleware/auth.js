const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');
const CarOwner = require('../models/CarOwner');

const JWT_SECRET = "Driver project authentication and login jwt string ";

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user based on role
    let user;
    switch (decoded.role) {
      // case 'user':
      //   user = await User.findById(decoded.id).select('-password');
      //   break;
      case 'driver':
        user = await Driver.findById(decoded.id).select('-password');
        break;
      case 'owner': // Changed from 'carowner' to 'owner'
        user = await CarOwner.findById(decoded.id).select('-password');
        break;
      default:
        return res.status(401).json({ error: 'Invalid token' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    req.user = user;
    req.userRole = decoded.role;
    console.log(req.userRole);
    console.log(req.user);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth; 