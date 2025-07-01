@echo off
cls
echo 🚨 QUICK FIX for "Network error. Please try again"
echo ================================================
echo.

echo 🎯 This script will fix the most common network access issues
echo.
echo ⚠️  IMPORTANT: Run this as Administrator for best results
echo    Right-click and select "Run as administrator"
echo.
pause

echo 🔥 Step 1: Configuring Windows Firewall...
echo.

REM Remove existing rules first
netsh advfirewall firewall delete rule name="RecipeShare Backend" >nul 2>&1
netsh advfirewall firewall delete rule name="RecipeShare Frontend" >nul 2>&1

REM Add new comprehensive rules
echo Adding firewall rules...
netsh advfirewall firewall add rule name="RecipeShare Backend" dir=in action=allow protocol=TCP localport=5000 profile=any
netsh advfirewall firewall add rule name="RecipeShare Frontend" dir=in action=allow protocol=TCP localport=5173 profile=any

REM Also add outbound rules
netsh advfirewall firewall add rule name="RecipeShare Backend Out" dir=out action=allow protocol=TCP localport=5000 profile=any
netsh advfirewall firewall add rule name="RecipeShare Frontend Out" dir=out action=allow protocol=TCP localport=5173 profile=any

echo ✅ Firewall rules configured
echo.

echo 🌐 Step 2: Enabling network discovery...
echo.
netsh advfirewall firewall set rule group="Network Discovery" new enable=Yes >nul 2>&1
netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=Yes >nul 2>&1
echo ✅ Network discovery enabled
echo.

echo 📡 Step 3: Finding your IP address...
echo.
echo Your IP addresses:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set IP=%%b
        set IP=!IP: =!
        echo    📍 !IP!
    )
)
setlocal enabledelayedexpansion

echo.
echo 🔍 Step 4: Testing server accessibility...
echo.

REM Wait a moment for rules to take effect
timeout /t 2 /nobreak >nul

REM Test if server is running
curl -s -m 5 http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server is running locally
) else (
    echo ❌ Server is NOT running
    echo.
    echo 🚀 Please start your server:
    echo    1. Open terminal in project folder
    echo    2. Run: npm run dev
    echo    3. Wait for "Server running on 0.0.0.0:5000"
    echo    4. Then test from other device
    echo.
    pause
    exit /b 1
)

echo.
echo 🎉 CONFIGURATION COMPLETE!
echo.
echo 📱 TO TEST FROM OTHER DEVICE:
echo.
echo 1️⃣ Make sure your server is running (npm run dev)
echo 2️⃣ On your other device (phone/tablet/computer):
echo    - Connect to the SAME WiFi network
echo    - Open a web browser
echo    - Go to: http://YOUR_IP:5173
echo    - Replace YOUR_IP with one of the addresses above
echo.
echo 3️⃣ To test just the API:
echo    - Go to: http://YOUR_IP:5000/api/health
echo    - You should see: {"status":"OK",...}
echo.
echo 🔧 IF STILL NOT WORKING:
echo.
echo A) TEMPORARY SOLUTION - Disable Windows Firewall:
echo    - Press Win + R, type: firewall.cpl
echo    - Click "Turn Windows Defender Firewall on or off"
echo    - Turn OFF for Private networks (temporarily)
echo    - Test access, then turn back ON
echo.
echo B) CHECK YOUR ROUTER:
echo    - Some routers block device-to-device communication
echo    - Look for "AP Isolation" or "Client Isolation" 
echo    - Disable it if found
echo.
echo C) ANTIVIRUS SOFTWARE:
echo    - Temporarily disable antivirus
echo    - Test access
echo    - Add exception for ports 5000 and 5173
echo.
echo D) NETWORK TROUBLESHOOTER:
echo    - Go to Settings ^> Network ^> Status
echo    - Click "Network troubleshooter"
echo    - Follow the steps
echo.
echo 📞 VERIFY SAME NETWORK:
echo    - Both devices should be on same WiFi
echo    - Try pinging this computer from other device
echo    - On other device: ping YOUR_IP
echo.
pause
