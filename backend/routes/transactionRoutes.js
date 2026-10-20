const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', async (req, res) => {
  try {
    // --- FIX 1: CHANGED 'customerEmail' TO 'customerPhone' ---
    const { type, amount, description, category, date, customerPhone } = req.body;

    // Validation
    if (!type || !amount || !description) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // If customer phone is provided, validate it exists as a customer
    if (customerPhone) {
      const cleanPhone = customerPhone.replace(/\D/g, '');
      const customer = await User.findOne({ 
        phone: cleanPhone,
        role: 'customer' 
      });
      
      if (!customer) {
        return res.status(400).json({ 
          message: `No customer found with phone number: ${customerPhone}. Please make sure the customer is registered.` 
        });
      }
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      description,
      category: category || '',
      customerPhone: customerPhone ? customerPhone.replace(/\D/g, '') : undefined,
      date: date || new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/transactions
// @desc    Get all transactions for logged in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    let transactions;
    
    // If user is a seller, get their own transactions
    // If user is a customer, get transactions linked to their email
    if (req.user.role === 'seller') {
      transactions = await Transaction.find({ user: req.user._id })
        .sort({ date: -1, createdAt: -1 });
    } else if (req.user.role === 'customer') {
      // Get transactions where customerPhone matches customer's phone
      transactions = await Transaction.find({ 
        customerPhone: req.user.phone 
      })
        .populate('user', 'name businessName phone')
        .sort({ date: -1, createdAt: -1 });
    } else {
      transactions = [];
    }

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    // --- FIX 2: UPDATED QUERY LOGIC FOR CUSTOMERS ---
    let query;
    if (req.user.role === 'seller') {
      // Sellers can only find transactions they created
      query = { _id: req.params.id, user: req.user._id };
    } else if (req.user.role === 'customer') {
      // Customers can only find transactions where they are linked
      query = { _id: req.params.id, customerPhone: req.user.phone };
    } else {
      // Block any other roles just in case
      return res.status(403).json({ message: 'Not authorized for this role' });
    }

    const transaction = await Transaction.findOne(query);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // If it's a customer, populate the seller's info
    if (req.user.role === 'customer') {
        await transaction.populate('user', 'name businessName phone');
    }
    // --- END OF FIX 2 ---

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { type, amount, description, category, date, customerPhone } = req.body;

    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Only sellers can update transactions
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can update transactions' });
    }

    // If customer phone is being updated, validate it exists
    if (customerPhone !== undefined && customerPhone !== transaction.customerPhone) {
      if (customerPhone) {
        const cleanPhone = customerPhone.replace(/\D/g, '');
        const customer = await User.findOne({ 
          phone: cleanPhone,
          role: 'customer' 
        });
        
        if (!customer) {
          return res.status(400).json({ 
            message: `No customer found with phone number: ${customerPhone}. Please make sure the customer is registered.` 
          });
        }
        transaction.customerPhone = cleanPhone;
      } else {
        transaction.customerPhone = undefined;
      }
    }

    if (type) transaction.type = type;
    if (amount !== undefined) transaction.amount = amount;
    if (description) transaction.description = description;
    if (category !== undefined) transaction.category = category;
    if (date) transaction.date = date;

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.deleteOne();

    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;