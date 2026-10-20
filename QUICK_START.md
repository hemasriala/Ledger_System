# Quick Start Guide

## Starting the Application

### 1. Start Backend Server
```bash
cd backend
node server.js
```

You should see:
```
✓ Server is running!
  Local:   http://localhost:5000
  Network: http://0.0.0.0:5000
  API:     http://localhost:5000/api

  Health Check: http://localhost:5000/api/health
```

### 2. Start Frontend Server (in a new terminal)

**Option A: Using the batch file (Windows)**
```bash
start-frontend.bat
```

**Option B: Using PowerShell script**
```bash
powershell -ExecutionPolicy Bypass -File start-frontend.ps1
```

**Option C: Manual Python command**
```bash
cd frontend
python -m http.server 8000
```

**Option D: Manual Node.js command**
```bash
cd frontend
npx http-server -p 8000 --yes
```

### 3. Access the Application

Once both servers are running, open your browser and go to:

**Main App (Login/Register):**
```
http://localhost:8000/index.html
```

**Dashboard (after login):**
```
http://localhost:8000/dashboard.html
```

## URLs Reference

- **Frontend Main App:** http://localhost:8000/index.html
- **Frontend Dashboard:** http://localhost:8000/dashboard.html
- **Frontend Test Page:** http://localhost:8000/test-connection.html
- **Backend API:** http://localhost:5000/api
- **Backend Health Check:** http://localhost:5000/api/health

## Troubleshooting

- Make sure MongoDB is running
- Backend must be on port 5000
- Frontend must be on port 8000
- Check browser console (F12) for any errors
- Verify backend is running before using frontend


