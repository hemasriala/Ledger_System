const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: [true, 'Please specify transaction type'],
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount must be positive'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  customerPhone: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);

