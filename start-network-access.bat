@echo off
echo 🌐 RecipeShare - Network Access Solution
echo =======================================
echo.

echo 🔍 PROBLEM: Frontend built with localhost:5000 API URL
echo 💡 SOLUTION: Create network-accessible version
echo.

echo 📋 Step 1: Find your IP address...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set IP=%%b
        set IP=!IP: =!
        echo    📍 Your IP: !IP!
    )
)
setlocal enabledelayedexpansion

echo.
set /p user_ip="Enter your IP address from above: "

if "%user_ip%"=="" (
    echo ❌ IP address is required
    pause
    exit /b 1
)

echo.
echo 🔧 Step 2: Create network environment configuration...
echo.

REM Create .env.network file
echo # Network Access Configuration > .env.network
echo VITE_API_URL=http://%user_ip%:5000 >> .env.network
echo VITE_SOCKET_URL=http://%user_ip%:5000 >> .env.network
echo VITE_NODE_ENV=development >> .env.network

echo ✅ Network environment created
echo.

echo 🏗️ Step 3: Building network-accessible frontend...
echo.

REM Copy network env to .env.local (Vite uses this)
copy .env.network .env.local >nul

REM Clean previous build
if exist "dist" rmdir /s /q "dist"

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

echo 🚀 Step 4: Starting network-accessible server...
echo.

REM Start backend server
echo ⏳ Starting backend server...
start /B npm run server

REM Wait for server to start
timeout /t 3 /nobreak >nul

REM Start serving the built frontend
echo ⏳ Starting frontend server...
echo.
echo 📋 Network Access URLs:
echo 🔧 Backend:  http://%user_ip%:5000/api/health
echo 🌐 Frontend: http://%user_ip%:4173
echo.
echo 💡 Test backend first, then frontend
echo 🔍 Both should work from other devices
echo.

REM Serve the dist folder on port 4173
npx vite preview --host 0.0.0.0 --port 4173

pause
