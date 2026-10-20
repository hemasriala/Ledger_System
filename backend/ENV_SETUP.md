# Environment Variables Setup

Create a `.env` file in the `backend` directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ledger_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

## Configuration Details

- **PORT**: The port on which the Express server will run (default: 5000)
- **MONGODB_URI**: MongoDB connection string
  - For local MongoDB: `mongodb://localhost:27017/ledger_db`
  - For MongoDB Atlas: Use your Atlas connection string
- **JWT_SECRET**: Secret key for signing JWT tokens (change this to a random string in production)
- **JWT_EXPIRE**: Token expiration time (e.g., 7d for 7 days)

## Important Notes

- Never commit the `.env` file to version control
- Change `JWT_SECRET` to a strong random string in production
- Make sure MongoDB is running before starting the server
