@echo off
echo 🔄 Starting RecipeShare Frontend with Network Access...
echo.

REM Kill any existing processes on port 4173
echo 🛑 Stopping any existing servers on port 4173...
netstat -ano | findstr :4173 > nul
if %errorlevel% == 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4173') do (
        taskkill /PID %%a /F > nul 2>&1
    )
    echo ✅ Stopped existing processes
) else (
    echo ℹ️  No existing processes found on port 4173
)
echo.

REM Wait a moment for ports to be released
timeout /t 2 /nobreak > nul

REM Get network IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "network_ip=%%a"
    goto :got_ip
)
:got_ip
set network_ip=%network_ip: =%

echo 🌐 Network IP detected: %network_ip%

REM Create .env.local with network IP
echo VITE_API_URL=http://%network_ip%:5000/api> .env.local
echo ✅ Created .env.local with network API URL

REM Build the frontend if dist doesn't exist or is empty
if not exist "dist\index.html" (
    echo 📦 Building frontend...
    npm run build
    if %errorlevel% neq 0 (
        echo ❌ Build failed!
        pause
        exit /b 1
    )
    echo ✅ Frontend built successfully
) else (
    echo ℹ️  Using existing build
)

REM Start the preview server with network access
echo 🚀 Starting frontend preview server...
echo 📡 HOST: 0.0.0.0
echo 🔌 PORT: 4173
echo 🌐 Access from network: http://%network_ip%:4173
echo.

npm run preview -- --host 0.0.0.0 --port 4173
