@echo off
echo 🚀 Executing IMMEDIATE ACTION PLAN
echo ==================================
echo.

echo 📋 STEP 1: Running network-quick-fix.bat as Administrator
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not running as Administrator
    echo.
    echo 🔧 SOLUTION: Right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo ✅ Running as Administrator
echo.

echo 🔥 Configuring Windows Firewall rules...
echo.

REM Remove any existing rules
netsh advfirewall firewall delete rule name="RecipeShare Backend" >nul 2>&1
netsh advfirewall firewall delete rule name="RecipeShare Frontend" >nul 2>&1
netsh advfirewall firewall delete rule name="RecipeShare Backend Out" >nul 2>&1
netsh advfirewall firewall delete rule name="RecipeShare Frontend Out" >nul 2>&1

REM Add comprehensive firewall rules
echo Adding inbound rules...
netsh advfirewall firewall add rule name="RecipeShare Backend" dir=in action=allow protocol=TCP localport=5000 profile=any
netsh advfirewall firewall add rule name="RecipeShare Frontend" dir=in action=allow protocol=TCP localport=5173 profile=any

echo Adding outbound rules...
netsh advfirewall firewall add rule name="RecipeShare Backend Out" dir=out action=allow protocol=TCP localport=5000 profile=any
netsh advfirewall firewall add rule name="RecipeShare Frontend Out" dir=out action=allow protocol=TCP localport=5173 profile=any

REM Add Node.js program rules
echo Adding Node.js program rules...
where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('where node') do (
        netsh advfirewall firewall add rule name="Node.js RecipeShare" dir=in action=allow program="%%i" profile=any
        netsh advfirewall firewall add rule name="Node.js RecipeShare Out" dir=out action=allow program="%%i" profile=any
    )
    echo ✅ Node.js program rules added
) else (
    echo ⚠️ Node.js not found in PATH
)

echo.
echo 🌐 Enabling network discovery...
netsh advfirewall firewall set rule group="Network Discovery" new enable=Yes profile=any
netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=Yes profile=any

echo.
echo ✅ STEP 1 COMPLETE: Firewall configured
echo.

echo 📡 Your IP addresses for testing:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo    📍 %%b
    )
)

echo.
echo 🚀 STEP 2: Now restart your server
echo.
echo Open a NEW terminal window and run:
echo    cd "your-project-folder"
echo    npm run dev
echo.
echo Wait for these messages:
echo    ✅ Connected to MongoDB  
echo    🚀 Server running on 0.0.0.0:5000
echo    🌐 Server accessible from network
echo.

set /p continue="Press Enter when server is running..."

echo.
echo 🧪 STEP 3: Running diagnostic again...
echo.
cd /d "%~dp0"
node ultimate-network-diagnostic.js

echo.
echo 📱 STEP 4: Test from other device
echo.
echo 1. Connect other device to SAME WiFi network
echo 2. Open browser on other device  
echo 3. Go to: http://YOUR_IP:5000/api/health
echo 4. Replace YOUR_IP with one of the addresses above
echo 5. Should see: {"status":"OK",...}
echo 6. If health works, try: http://YOUR_IP:5173
echo.

echo 🎯 If still not working, run: nuclear-network-fix.bat
echo.
pause
