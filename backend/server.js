const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✓ Server is running!`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://0.0.0.0:${PORT}`);
  console.log(`  API:     http://localhost:${PORT}/api`);
  console.log(`\n  Health Check: http://localhost:${PORT}/api/health\n`);
});

