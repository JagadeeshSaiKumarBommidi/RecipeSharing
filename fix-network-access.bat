@echo off
cls
echo 🚨 FIXING Network Access Issues
echo ================================
echo.

echo 🛑 Step 1: Stop any running servers...
echo.
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM nodemon.exe /T >nul 2>&1
echo ✅ Stopped existing servers
timeout /t 3 /nobreak >nul

echo.
echo 📡 Step 2: Find your correct IP address...
echo.
echo 📋 Available IP addresses:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set IP=%%b
        call set IP=%%IP: =%%
        echo    📍 %%IP%%
    )
)

echo.
echo 💡 Based on your output, your IP appears to be: 192.168.1.5
echo 🔍 Please verify this is your network IP (not 127.0.0.1)
echo.
set /p user_ip="Enter your network IP address (e.g., 192.168.1.5): "

if "%user_ip%"=="" (
    echo ❌ IP address is required
    pause
    exit /b 1
)

REM Validate IP format (basic check)
echo %user_ip% | findstr /R /C:"[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*" >nul
if %errorlevel% neq 0 (
    echo ❌ Invalid IP format. Please enter format like: 192.168.1.5
    pause
    exit /b 1
)

echo.
echo 🔧 Step 3: Create network environment configuration...
echo.

REM Create .env.local with network configuration
echo # Network Access Configuration > .env.local
echo VITE_API_URL=http://%user_ip%:5000 >> .env.local
echo VITE_SOCKET_URL=http://%user_ip%:5000 >> .env.local
echo NODE_ENV=development >> .env.local

echo ✅ Network environment created (.env.local)
echo.

echo 🏗️ Step 4: Building network-accessible frontend...
echo.

REM Clean previous build
if exist "dist" rmdir /s /q "dist" >nul 2>&1

REM Build with network configuration
call npm run build

if exist "dist" (
    echo ✅ Network build successful!
    echo.
    echo 📁 Built files location: dist/
    echo 🌐 API configured for: http://%user_ip%:5000
    echo.
) else (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo 🚀 Step 5: Starting servers...
echo.

REM Start backend in background
echo ⏳ Starting backend server on port 5000...
start /B cmd /C "npm run server"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Test backend
echo 🧪 Testing backend connectivity...
curl -s -m 5 http://%user_ip%:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is accessible
) else (
    echo ⚠️ Backend may still be starting...
)

echo.
echo 📋 NETWORK ACCESS INFORMATION:
echo ===============================
echo.
echo 🔧 Backend URLs:
echo    📍 Local:   http://localhost:5000/api/health
echo    📍 Network: http://%user_ip%:5000/api/health
echo.
echo 🌐 Frontend URLs:
echo    📍 Local:   http://localhost:4173
echo    📍 Network: http://%user_ip%:4173
echo.
echo 📱 FOR OTHER DEVICES:
echo    1. Connect to SAME WiFi network
echo    2. Test backend: http://%user_ip%:5000/api/health
echo    3. Access app: http://%user_ip%:4173
echo.

echo ⏳ Starting frontend server (this will keep running)...
echo 💡 Press Ctrl+C to stop both servers
echo.

REM Start frontend server (this will block)
npx vite preview --host 0.0.0.0 --port 4173
