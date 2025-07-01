@echo off
echo 🚨 Network Access Troubleshooting for RecipeShare
echo =================================================
echo.

echo 🔍 Step 1: Checking if server is running locally...
echo.
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server is running locally
) else (
    echo ❌ Server is NOT running locally
    echo 💡 Please start the server first: npm run dev
    pause
    exit /b 1
)

echo.
echo 🌐 Step 2: Finding your IP addresses...
echo.
echo 📡 Available IP addresses:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo    - %%b
    )
)

echo.
echo 🔥 Step 3: Checking Windows Firewall...
echo.

REM Check if firewall rules exist
netsh advfirewall firewall show rule name="RecipeShare Backend" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend firewall rule exists
) else (
    echo ❌ Backend firewall rule missing
    echo ➕ Adding firewall rule for port 5000...
    netsh advfirewall firewall add rule name="RecipeShare Backend" dir=in action=allow protocol=TCP localport=5000 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Backend firewall rule added
    ) else (
        echo ❌ Failed to add firewall rule (Run as Administrator)
    )
)

netsh advfirewall firewall show rule name="RecipeShare Frontend" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend firewall rule exists
) else (
    echo ❌ Frontend firewall rule missing
    echo ➕ Adding firewall rule for port 5173...
    netsh advfirewall firewall add rule name="RecipeShare Frontend" dir=in action=allow protocol=TCP localport=5173 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Frontend firewall rule added
    ) else (
        echo ❌ Failed to add firewall rule (Run as Administrator)
    )
)

echo.
echo 🔌 Step 4: Testing port accessibility...
echo.
netstat -an | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 5000 is listening
    netstat -an | findstr :5000
) else (
    echo ❌ Port 5000 is not listening
    echo 💡 Make sure the server is running
)

echo.
echo 🧪 Step 5: Quick network tests...
echo.

REM Test localhost
echo Testing localhost:5000...
curl -s -m 5 http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ localhost:5000 - OK
) else (
    echo ❌ localhost:5000 - Failed
)

echo.
echo 🛠️ SOLUTIONS TO TRY:
echo.
echo 1️⃣ TEMPORARY FIREWALL DISABLE (for testing):
echo    - Open Windows Defender Firewall
echo    - Turn off firewall for Private networks temporarily
echo    - Test access from other device
echo    - Turn firewall back on after testing
echo.
echo 2️⃣ MANUAL FIREWALL RULE:
echo    - Windows + R, type: wf.msc
echo    - Inbound Rules ^> New Rule ^> Port
echo    - TCP, Specific Ports: 5000,5173
echo    - Allow the connection
echo.
echo 3️⃣ NETWORK DISCOVERY:
echo    - Control Panel ^> Network and Sharing
echo    - Change advanced sharing settings
echo    - Turn on network discovery
echo    - Turn on file and printer sharing
echo.
echo 4️⃣ ROUTER SETTINGS:
echo    - Check if router blocks inter-device communication
echo    - Disable AP Isolation if enabled
echo    - Check if devices are on same network
echo.
echo 5️⃣ ANTIVIRUS/SECURITY SOFTWARE:
echo    - Temporarily disable antivirus
echo    - Check if security software blocks connections
echo.
echo 📱 TO TEST FROM OTHER DEVICE:
echo    1. Find your IP from the list above
echo    2. On other device, open browser
echo    3. Go to: http://YOUR_IP:5000/api/health
echo    4. Should see: {"status":"OK",...}
echo.
echo 🚀 If health check works, try the full app:
echo    - Frontend: http://YOUR_IP:5173
echo.
pause
