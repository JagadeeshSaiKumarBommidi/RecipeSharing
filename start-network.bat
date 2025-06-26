@echo off
echo.
echo ================================================
echo   RecipeSharing - Network Accessible Mode
echo ================================================
echo.

cd /d "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"

echo Finding your network IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set LOCAL_IP=%%b
        goto :found
    )
)
:found

if "%LOCAL_IP%"=="" (
    echo ❌ Could not determine IP address
    set LOCAL_IP=localhost
)

echo Your IP address: %LOCAL_IP%
echo.

echo Setting up for network access...
echo - Backend will be accessible at: http://%LOCAL_IP%:5000
echo - Frontend will be accessible at: http://%LOCAL_IP%:5173
echo.

echo Adding Windows Firewall rules...
netsh advfirewall firewall add rule name="RecipeSharing Backend Port 5000" dir=in action=allow protocol=TCP localport=5000 >nul 2>&1
netsh advfirewall firewall add rule name="RecipeSharing Frontend Port 5173" dir=in action=allow protocol=TCP localport=5173 >nul 2>&1

echo ✅ Firewall configured
echo.

echo Starting servers with network access...
echo.

REM Set environment variables for network access
set HOST=0.0.0.0
set CLIENT_URL=http://%LOCAL_IP%:5173

echo ================================================
echo   Server Information
echo ================================================
echo.
echo Backend API: http://%LOCAL_IP%:5000
echo Frontend: http://%LOCAL_IP%:5173
echo Health Check: http://%LOCAL_IP%:5000/api/health
echo.
echo Share these URLs with other systems on your network
echo.

start "RecipeSharing Backend (Network)" cmd /k "set HOST=0.0.0.0 && set CLIENT_URL=http://%LOCAL_IP%:5173 && npm run server"

timeout 3 >nul

start "RecipeSharing Frontend (Network)" cmd /k "npm run client -- --host 0.0.0.0"

echo.
echo ✅ Servers starting with network access enabled
echo.
echo Other systems can now access your app using:
echo - Frontend: http://%LOCAL_IP%:5173
echo - Must be on the same network (WiFi/LAN)
echo.
echo If still getting network errors:
echo 1. Check Windows Firewall settings
echo 2. Check antivirus/security software
echo 3. Verify both systems are on same network
echo 4. Try disabling Windows Firewall temporarily
echo.

timeout 5 >nul
echo Opening local browser...
start http://localhost:5173

pause
