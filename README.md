# Ledger Transaction System

A full-stack web application for sellers to record and manage their financial transactions (ledgers). Built with MERN stack (MongoDB, Express, Node.js) for backend and vanilla HTML, CSS, and JavaScript for frontend.

## Features

- **User Authentication**
  - User registration for sellers
  - Secure login/logout
  - JWT token-based authentication

- **Transaction Management**
  - Add credit/debit transactions
  - View all transactions in a table
  - Edit existing transactions
  - Delete transactions
  - Search/filter transactions
  - Transaction categories

- **Dashboard**
  - Summary cards showing total credit, debit, and balance
  - Real-time updates
  - Responsive design

## Project Structure

```
CSP/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/
│   │   ├── User.js            # User/Seller model
│   │   └── Transaction.js     # Transaction model
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── transactionRoutes.js # Transaction routes
│   ├── .env                   # Environment variables (create this)
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Express server
├── frontend/
│   ├── css/
│   │   └── style.css          # Stylesheet
│   ├── js/
│   │   ├── api.js             # API helper functions
│   │   ├── auth.js            # Authentication logic
│   │   └── dashboard.js       # Dashboard logic
│   ├── index.html             # Login/Register page
│   └── dashboard.html         # Main dashboard
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running locally, or MongoDB Atlas connection string)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ledger_db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

**Note:** If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

4. Make sure MongoDB is running on your system.

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. The frontend is static HTML/CSS/JS, so no build process is needed.

2. Open `frontend/index.html` in a web browser, or use a local development server:

Using Python:
```bash
cd frontend
python -m http.server 8000
```

Using Node.js http-server:
```bash
cd frontend
npx http-server -p 8000
```

3. Access the application at `http://localhost:8000`

**Important:** Make sure the backend API URL in `frontend/js/api.js` matches your backend server URL (default is `http://localhost:5000`).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new seller
- `POST /api/auth/login` - Login seller
- `GET /api/auth/me` - Get current user (protected)

### Transactions
- `GET /api/transactions` - Get all transactions (protected)
- `POST /api/transactions` - Create new transaction (protected)
- `GET /api/transactions/:id` - Get single transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

## Usage

1. **Register/Login**: Start by creating an account or logging in on the index page.

2. **Add Transactions**: 
   - Select transaction type (Credit/Debit)
   - Enter amount, description, date, and optional category
   - Click "Add Transaction"

3. **Manage Transactions**:
   - View all transactions in the table
   - Use search to filter transactions
   - Click "Edit" to modify a transaction
   - Click "Delete" to remove a transaction

4. **Monitor Summary**: View total credit, debit, and balance in the summary cards at the top.

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- HTML5
- CSS3 (with modern styling)
- Vanilla JavaScript (ES6+)
- Fetch API for HTTP requests

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens for secure authentication
- Protected API routes
- Input validation

## Notes

- Make sure to change the `JWT_SECRET` in production
- Ensure MongoDB is running before starting the backend
- CORS is enabled for development; configure appropriately for production

