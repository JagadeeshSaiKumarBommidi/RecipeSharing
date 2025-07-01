@echo off
cls
echo 🚨 NUCLEAR OPTION - Network Access Emergency Fix
echo ===============================================
echo.
echo ⚠️  WARNING: This will temporarily disable security features
echo    Only use this for testing, then re-enable security!
echo.
echo 🎯 This script will:
echo    - Temporarily disable Windows Firewall
echo    - Enable network discovery
echo    - Add comprehensive firewall rules
echo    - Test connectivity
echo.
echo 🔒 IMPORTANT: Run this as Administrator
echo.
set /p choice="Continue? (y/N): "
if /i not "%choice%"=="y" exit /b

echo.
echo 🛡️ Step 1: Backing up current firewall state...
echo.
netsh advfirewall export "firewall-backup.wfw" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Firewall state backed up to firewall-backup.wfw
) else (
    echo ⚠️ Could not backup firewall state
)

echo.
echo 🔥 Step 2: Temporarily disabling Windows Firewall...
echo.
netsh advfirewall set allprofiles state off
if %errorlevel% equ 0 (
    echo ✅ Windows Firewall disabled
) else (
    echo ❌ Failed to disable firewall (need Administrator?)
)

echo.
echo 🌐 Step 3: Enabling network discovery...
echo.
netsh advfirewall firewall set rule group="Network Discovery" new enable=Yes profile=any
netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=Yes profile=any
echo ✅ Network discovery enabled

echo.
echo 📡 Step 4: Your IP addresses:
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo    📍 %%b
    )
)

echo.
echo 🧪 Step 5: Testing server (make sure it's running)...
echo.
timeout /t 2 /nobreak >nul

curl -s -m 5 http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server is running locally
) else (
    echo ❌ Server is NOT running
    echo.
    echo 🚀 Please start your server first:
    echo    npm run dev
    echo.
    echo Then test from another device
    goto :restore
)

echo.
echo 🎉 FIREWALL TEMPORARILY DISABLED!
echo.
echo 📱 NOW TEST FROM OTHER DEVICE:
echo.
echo 1. Make sure other device is on SAME WiFi network
echo 2. Open browser on other device
echo 3. Go to: http://YOUR_IP:5000/api/health
echo 4. Replace YOUR_IP with one of the addresses above
echo 5. You should see: {"status":"OK",...}
echo 6. If that works, try: http://YOUR_IP:5173
echo.
echo ⏳ Test now, then press any key to restore security...
pause

:restore
echo.
echo 🔒 Step 6: Restoring Windows Firewall...
echo.
netsh advfirewall set allprofiles state on
if %errorlevel% equ 0 (
    echo ✅ Windows Firewall restored
) else (
    echo ❌ Failed to restore firewall
)

echo.
echo 🛡️ Step 7: Adding proper firewall rules...
echo.
REM Add comprehensive rules
netsh advfirewall firewall add rule name="RecipeShare Backend" dir=in action=allow protocol=TCP localport=5000 profile=any
netsh advfirewall firewall add rule name="RecipeShare Frontend" dir=in action=allow protocol=TCP localport=5173 profile=any
netsh advfirewall firewall add rule name="RecipeShare Backend Out" dir=out action=allow protocol=TCP localport=5000 profile=any
netsh advfirewall firewall add rule name="RecipeShare Frontend Out" dir=out action=allow protocol=TCP localport=5173 profile=any

REM Add Node.js program rules
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="%ProgramFiles%\nodejs\node.exe" profile=any
netsh advfirewall firewall add rule name="Node.js" dir=out action=allow program="%ProgramFiles%\nodejs\node.exe" profile=any

echo ✅ Firewall rules added

echo.
echo 🎯 RESULTS:
echo.
if %errorlevel% equ 0 (
    echo ✅ If the test worked with firewall disabled:
    echo    - The issue was Windows Firewall
    echo    - Proper rules are now in place
    echo    - Try accessing from other device again
    echo.
    echo ❌ If the test still didn't work:
    echo    - The issue is router/network related
    echo    - Check router AP Isolation settings
    echo    - Ensure devices are on same network
    echo    - Try different network (mobile hotspot)
) else (
    echo ❌ If the test didn't work:
    echo    - Check if server is actually running
    echo    - Verify network connectivity
    echo    - Try mobile hotspot test
)

echo.
echo 🔧 NEXT STEPS:
echo.
echo 1️⃣ If test worked: Your firewall is now properly configured
echo 2️⃣ If test failed: Run ultimate-network-diagnostic.js for detailed analysis
echo 3️⃣ Alternative: Try connecting other device to mobile hotspot and test
echo.
echo 💡 The firewall rules are now permanent and should work going forward
echo.
pause
