# .env File Verification Checklist

Your `.env` file should contain these 4 required variables:

## Required Variables:

1. **PORT** (optional, defaults to 5000)
   ```
   PORT=5000
   ```

2. **MONGODB_URI** (REQUIRED)
   ```
   MONGODB_URI=mongodb://localhost:27017/ledger_db
   ```
   - For local MongoDB: `mongodb://localhost:27017/ledger_db`
   - For MongoDB Atlas: Your connection string from Atlas dashboard
   - Make sure MongoDB is running if using local instance

3. **JWT_SECRET** (REQUIRED - must be a random string)
   ```
   JWT_SECRET=your_jwt_secret_key
   ```
   - Should be a long random string (at least 32 characters recommended)
   - Example: `JWT_SECRET=abc123xyz789secretkey456def789ghi012jkl345`
   - DO NOT use the literal string "your_jwt_secret_key" in production

4. **JWT_EXPIRE** (optional, defaults to 7d)
   ```
   JWT_EXPIRE=7d
   ```
   - Common values: `7d`, `30d`, `24h`, `1h`

## Quick Test:

Run this command in the backend directory to test if your .env loads correctly:
```bash
node -e "require('dotenv').config(); console.log('PORT:', process.env.PORT); console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set ✓' : 'Missing ✗'); console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set ✓' : 'Missing ✗'); console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE || '7d');"
```

## Common Issues:

- **Missing variables**: All 4 variables should be present
- **Wrong MongoDB URI**: Check if MongoDB is running and the URI is correct
- **JWT_SECRET too weak**: Use a longer, random string for security
- **File location**: `.env` must be in the `backend/` folder (same level as `server.js`)
- **File encoding**: Make sure the file is saved as plain text (not UTF-8 with BOM)


