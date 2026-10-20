@echo off
echo.
echo ========================================
echo   Frontend Server Starting...
echo ========================================
echo.
cd frontend
echo ^> Frontend Server is running!
echo.
echo   Main App:     http://localhost:8000/index.html
echo   Dashboard:    http://localhost:8000/dashboard.html
echo   Test Page:    http://localhost:8000/test-connection.html
echo.
echo   Open the main app URL in your browser!
echo.
echo   Press Ctrl+C to stop the server
echo ========================================
echo.
python -m http.server 8000


