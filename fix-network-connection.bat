@echo off
echo 🔄 RecipeShare Network Quick Fix
echo =================================
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

echo 🛑 Stopping all existing processes...
REM Kill Node.js processes
taskkill /F /IM node.exe > nul 2>&1
REM Kill processes on specific ports
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /PID %%a /F > nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4173') do taskkill /PID %%a /F > nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /PID %%a /F > nul 2>&1
echo ✅ Processes stopped
echo.

echo 🔥 Configuring Windows Firewall...
netsh advfirewall firewall delete rule name="RecipeShare Backend" > nul 2>&1
netsh advfirewall firewall delete rule name="RecipeShare Frontend" > nul 2>&1
netsh advfirewall firewall add rule name="RecipeShare Backend" dir=in action=allow protocol=TCP localport=5000 > nul 2>&1
netsh advfirewall firewall add rule name="RecipeShare Frontend" dir=in action=allow protocol=TCP localport=4173 > nul 2>&1
echo ✅ Firewall configured
echo.

echo 🔧 Updating environment configuration...
REM Update .env for network access
if exist ".env" (
    powershell -Command "(Get-Content .env) -replace '^HOST=.*', 'HOST=0.0.0.0' -replace '^CLIENT_URL=.*', 'CLIENT_URL=http://%network_ip%:4173' | Set-Content .env"
) else (
    echo HOST=0.0.0.0> .env
    echo PORT=5000>> .env
    echo CLIENT_URL=http://%network_ip%:4173>> .env
    echo MONGODB_URI=mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing>> .env
    echo JWT_SECRET=RecipeSharing-JWT-Secret-Key-2025-SuperSecure-Random-String-12345>> .env
)

REM Create frontend network config
echo VITE_API_URL=http://%network_ip%:5000/api> .env.local
echo ✅ Environment configured
echo.

echo 📦 Building frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)
echo ✅ Frontend built
echo.

echo 🚀 Starting servers with network access...
echo ⚠️  Keep these windows open - closing them stops the servers
echo.

REM Start backend with explicit network binding
start "RecipeShare Backend" cmd /c "cd /d \"%~dp0\" && set HOST=0.0.0.0 && set PORT=5000 && cd server && echo 🚀 Starting backend on %network_ip%:5000 && node index.js && pause"

REM Wait for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend with network binding  
start "RecipeShare Frontend" cmd /c "cd /d \"%~dp0\" && echo 🚀 Starting frontend on %network_ip%:4173 && npm run preview -- --host 0.0.0.0 --port 4173 && pause"

echo.
echo ✅ Servers started in separate windows
echo.
echo 🌐 Network Access URLs:
echo    Frontend: http://%network_ip%:4173
echo    Backend:  http://%network_ip%:5000  
echo    Health:   http://%network_ip%:5000/api/health
echo.
echo 📱 Share these URLs with other devices on your WiFi
echo 🔍 Run test-network.bat to verify connectivity
echo.
echo 💡 Wait 5-10 seconds for servers to fully start
echo.
pause
