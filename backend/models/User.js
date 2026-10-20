const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true,
  },
  pin: {
    type: String,
    required: [true, 'Please add a PIN'],
    select: false,
    // Note: Validation happens in the route before hashing
    // After hashing, PIN will be much longer than 6 characters
  },
  businessName: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['seller', 'customer'],
    required: [true, 'Please specify user role'],
    default: 'seller',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound unique index on phone + role
// This allows the same phone number for both seller and customer, but not duplicate within the same role
userSchema.index({ phone: 1, role: 1 }, { unique: true });

// Hash PIN before saving
userSchema.pre('save', async function (next) {
  // Only hash if pin is modified and not already hashed (less than 20 chars means it's not hashed yet)
  if (!this.isModified('pin') || this.pin.length > 20) {
    return next();
  }
  
  // Validate PIN is 6 digits before hashing
  if (!/^\d{6}$/.test(this.pin)) {
    return next(new Error('PIN must be exactly 6 digits'));
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare PINs
userSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model('User', userSchema);

