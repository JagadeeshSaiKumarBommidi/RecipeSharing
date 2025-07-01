@echo off
echo 🔄 Starting RecipeShare Server with Network Access...
echo.

REM Kill any existing processes on port 5000
echo 🛑 Stopping any existing servers on port 5000...
netstat -ano | findstr :5000 > nul
if %errorlevel% == 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /PID %%a /F > nul 2>&1
    )
    echo ✅ Stopped existing processes
) else (
    echo ℹ️  No existing processes found on port 5000
)
echo.

REM Wait a moment for ports to be released
timeout /t 2 /nobreak > nul

REM Navigate to server directory
cd /d "%~dp0server"

REM Set environment variables for network access
set HOST=0.0.0.0
set PORT=5000
set NODE_ENV=development

REM Start the server
echo 🚀 Starting server with network access...
echo 📡 HOST: %HOST%
echo 🔌 PORT: %PORT%
echo.

node index.js
