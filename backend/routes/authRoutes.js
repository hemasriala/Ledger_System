const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user (seller or customer)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, phone, pin, businessName, role } = req.body;

    // --- FIX 1: 'cleanPhone' IS NOW DECLARED ONCE HERE ---
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits

    // Log incoming request for debugging
    console.log('Registration request:', { name, phone: cleanPhone.substring(0, 4) + '****', pin: '****', role, hasBusinessName: !!businessName });

    // Validation
    if (!name || !phone || !pin || !role) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be exactly 6 digits' });
    }

    // Validate phone number format (basic validation)
    // --- FIX 2: REMOVED THE REDECLARATION OF 'cleanPhone' ---
    console.log('Cleaned phone:', cleanPhone);
    if (cleanPhone.length < 10) {
      return res.status(400).json({ message: 'Please enter a valid phone number' });
    }

    // Validate role
    if (!['seller', 'customer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be seller or customer' });
    }

    // Check if user exists with same phone AND role
    const existingUser = await User.findOne({ phone: cleanPhone, role: role });
    console.log('Existing user check:', { phone: cleanPhone, role, found: !!existingUser });
    
    if (existingUser) {
      console.log('User already exists with same phone and role');
      return res.status(400).json({ 
        message: `Phone number already registered as ${role}. Please use a different phone number or login instead.` 
      });
    }

    // Check if phone exists with different role (this should be allowed)
    const phoneWithDifferentRole = await User.findOne({ phone: cleanPhone });
    if (phoneWithDifferentRole) {
      console.log(`Phone ${cleanPhone} exists as ${phoneWithDifferentRole.role}, allowing registration as ${role}`);
    }

    // Create user
    const userData = {
      name,
      phone: cleanPhone,
      pin,
      role: role,
    };
    
    // Only add businessName if provided (sellers might have it)
    if (businessName) {
      userData.businessName = businessName;
    }

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        businessName: user.businessName || '',
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    // Handle duplicate key errors (phone already exists)
    if (error.code === 11000) {
      console.error('Duplicate key error:', error);
      // Check if it's the compound index error
      if (error.keyPattern && error.keyPattern.phone && error.keyPattern.role) {
        return res.status(400).json({ 
          message: `Phone number already registered as ${error.keyValue?.role || 'user'}. Please use a different phone number or login instead.` 
        });
      }
      return res.status(400).json({ 
        message: 'Phone number already registered. Please run: node fix-phone-index.js to fix database indexes.' 
      });
    }
    
    // Handle other errors
    res.status(500).json({ 
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (seller or customer)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { phone, pin, role } = req.body;

    // Validation
    if (!phone || !pin) {
      return res.status(400).json({ message: 'Please provide phone number and PIN' });
    }

    // Validate PIN format
    if (!/^\d{6}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be exactly 6 digits' });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');

    // Check for user
    const user = await User.findOne({ phone: cleanPhone }).select('+pin');
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or PIN' });
    }

    // Check PIN
    const isMatch = await user.matchPin(pin);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or PIN' });
    }

    // Check role if provided
    if (role && user.role !== role) {
      return res.status(403).json({ message: `Access denied. This account is for ${user.role}s, not ${role}s` });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      businessName: user.businessName,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      businessName: user.businessName,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;