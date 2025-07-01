@echo off
echo 🌐 RecipeShare Network Access Setup
echo =====================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found
    echo Please run this script from the RecipeSharing project root
    pause
    exit /b 1
)

REM Get network IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "network_ip=%%a"
    goto :got_ip
)
:got_ip
set network_ip=%network_ip: =%

echo 🌐 Your network IP: %network_ip%
echo.

REM Kill existing processes
echo 🛑 Stopping existing servers...
netstat -ano | findstr :5000 > nul
if %errorlevel% == 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /PID %%a /F > nul 2>&1
    )
)

netstat -ano | findstr :4173 > nul
if %errorlevel% == 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4173') do (
        taskkill /PID %%a /F > nul 2>&1
    )
)
echo ✅ Cleared existing processes
echo.

REM Check for .env file
if not exist ".env" (
    echo 🔧 Creating .env file...
    echo MONGODB_URI=mongodb://localhost:27017/recipesharing> .env
    echo JWT_SECRET=your-super-secret-key-here>> .env
    echo HOST=0.0.0.0>> .env
    echo PORT=5000>> .env
    echo CLIENT_URL=http://%network_ip%:4173>> .env
    echo ✅ Created .env file
) else (
    echo ℹ️  .env file exists
)

REM Update .env to ensure network access
echo 🔧 Updating .env for network access...
powershell -Command "(Get-Content .env) -replace '^HOST=.*', 'HOST=0.0.0.0' -replace '^CLIENT_URL=.*', 'CLIENT_URL=http://%network_ip%:4173' | Set-Content .env"

REM Create .env.local for frontend
echo 🔧 Creating frontend config...
echo VITE_API_URL=http://%network_ip%:5000/api> .env.local
echo ✅ Frontend configured for network access
echo.

REM Build frontend if needed
if not exist "dist\index.html" (
    echo 📦 Building frontend...
    npm run build
    if %errorlevel% neq 0 (
        echo ❌ Build failed!
        pause
        exit /b 1
    )
    echo ✅ Frontend built
) else (
    echo ℹ️  Using existing frontend build
)
echo.

REM Configure Windows Firewall
echo 🔥 Configuring Windows Firewall...
netsh advfirewall firewall delete rule name="RecipeShare Backend" > nul 2>&1
netsh advfirewall firewall delete rule name="RecipeShare Frontend" > nul 2>&1
netsh advfirewall firewall add rule name="RecipeShare Backend" dir=in action=allow protocol=TCP localport=5000 > nul 2>&1
netsh advfirewall firewall add rule name="RecipeShare Frontend" dir=in action=allow protocol=TCP localport=4173 > nul 2>&1
echo ✅ Firewall configured
echo.

echo 🚀 Ready to start servers!
echo.
echo 📋 Network Access Information:
echo    Backend:  http://%network_ip%:5000
echo    Frontend: http://%network_ip%:4173
echo    Health:   http://%network_ip%:5000/api/health
echo.
echo 💡 Share these URLs with devices on your WiFi network
echo.

choice /c YN /m "Start both servers now? (Y/N)"
if %errorlevel% == 2 (
    echo.
    echo 📝 To start manually:
    echo    Backend:  start-server-network.bat
    echo    Frontend: start-frontend-network.bat
    pause
    exit /b 0
)

echo.
echo 🎯 Starting servers...
echo ⚠️  Keep this window open - closing it will stop the servers
echo.

REM Start backend in background
start "RecipeShare Backend" cmd /c "cd /d \"%~dp0\" && start-server-network.bat"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in background
start "RecipeShare Frontend" cmd /c "cd /d \"%~dp0\" && start-frontend-network.bat"

echo.
echo ✅ Servers starting in separate windows...
echo.
echo 🔍 Test network access:
echo    1. Open browser on another device
echo    2. Connect to same WiFi network
echo    3. Visit: http://%network_ip%:4173
echo.
echo Press any key to exit this setup window...
pause > nul
