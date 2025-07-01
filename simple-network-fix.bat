@echo off
echo 🔄 RecipeShare Network Fix (No Admin Required)
echo =============================================
echo.

REM Get network IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "network_ip=%%a"
    goto :got_ip
)
:got_ip
set network_ip=%network_ip: =%
echo 🌐 Network IP: %network_ip%
echo.

echo 🛑 Stopping existing processes...
taskkill /F /IM node.exe > nul 2>&1
echo ✅ Processes stopped
echo.

echo 🔧 Configuring environment...
REM Create .env.local for frontend
echo VITE_API_URL=http://%network_ip%:5000/api> .env.local
echo VITE_SOCKET_URL=http://%network_ip%:5000>> .env.local

REM Update backend .env
powershell -Command "if (Test-Path '.env') { (Get-Content .env) -replace '^HOST=.*', 'HOST=0.0.0.0' -replace '^CLIENT_URL=.*', 'CLIENT_URL=*' | Set-Content .env }"
echo ✅ Environment configured
echo.

echo 📦 Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)
echo ✅ Frontend built
echo.

echo 🚀 Starting backend server...
cd server
start "RecipeShare Backend" cmd /k "set HOST=0.0.0.0 && set PORT=5000 && set CLIENT_URL=* && echo Backend starting on %network_ip%:5000 && node index.js"
cd ..

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo 🚀 Starting frontend server...
start "RecipeShare Frontend" cmd /k "echo Frontend starting on %network_ip%:4173 && npm run preview -- --host 0.0.0.0 --port 4173"

echo.
echo ✅ Servers started!
echo.
echo 🌐 Your network URLs:
echo    Frontend: http://%network_ip%:4173
echo    Backend:  http://%network_ip%:5000
echo    Health:   http://%network_ip%:5000/api/health
echo.
echo 📱 From another device on the same WiFi:
echo    1. Open browser
echo    2. Go to: http://%network_ip%:4173
echo    3. Create account and enjoy!
echo.
echo ⚠️  If connection is refused:
echo    - Check both devices are on same WiFi
echo    - Try disabling Windows Firewall temporarily
echo    - Or run as administrator for firewall config
echo.
echo 🔍 Test connectivity: test-network.bat
echo.
pause
