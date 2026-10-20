# Simple HTTP Server for Frontend
# This script starts a local HTTP server to serve the frontend files

Write-Host ""
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Check if Python is available
$pythonAvailable = $false
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0 -or $pythonVersion -match "Python") {
        $pythonAvailable = $true
        Write-Host "Using Python: $pythonVersion" -ForegroundColor Gray
    }
} catch {
    $pythonAvailable = $false
}

if ($pythonAvailable) {
    Set-Location frontend
    Write-Host ""
    Write-Host "[OK] Frontend Server is running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Main App:     http://localhost:8000/index.html" -ForegroundColor White
    Write-Host "  Dashboard:    http://localhost:8000/dashboard.html" -ForegroundColor White
    Write-Host "  Test Page:    http://localhost:8000/test-connection.html" -ForegroundColor White
    Write-Host ""
    Write-Host "  Open the main app URL in your browser to get started!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Serving files from: $(Get-Location)" -ForegroundColor Gray
    Write-Host ""
    python -m http.server 8000
} else {
    Write-Host "Python not found. Trying Node.js http-server..." -ForegroundColor Yellow
    
    # Check if http-server is available
    $httpServerAvailable = $false
    try {
        $null = npx http-server --version 2>&1
        $httpServerAvailable = $true
    } catch {
        $httpServerAvailable = $false
    }
    
    if ($httpServerAvailable) {
        Set-Location frontend
        Write-Host ""
        Write-Host "[OK] Frontend Server is running!" -ForegroundColor Green
        Write-Host ""
        Write-Host "  Main App:     http://localhost:8000/index.html" -ForegroundColor White
        Write-Host "  Dashboard:    http://localhost:8000/dashboard.html" -ForegroundColor White
        Write-Host "  Test Page:    http://localhost:8000/test-connection.html" -ForegroundColor White
        Write-Host ""
        Write-Host "  Open the main app URL in your browser to get started!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  Serving files from: $(Get-Location)" -ForegroundColor Gray
        Write-Host ""
        npx http-server -p 8000 --yes
    } else {
        Write-Host ""
        Write-Host "[ERROR] Neither Python nor http-server found." -ForegroundColor Red
        Write-Host "  Please install Python or run: npm install -g http-server" -ForegroundColor Yellow
        Write-Host ""
    }
}
