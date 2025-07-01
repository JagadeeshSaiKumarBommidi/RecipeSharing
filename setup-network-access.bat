@echo off
echo 🔥 Windows Firewall Configuration for RecipeShare
echo ================================================
echo.

echo 🔍 Checking current firewall rules...
netsh advfirewall firewall show rule name="RecipeShare Backend" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend firewall rule already exists
) else (
    echo ➕ Adding firewall rule for backend (port 5000)...
    netsh advfirewall firewall add rule name="RecipeShare Backend" dir=in action=allow protocol=TCP localport=5000
    if %errorlevel% equ 0 (
        echo ✅ Backend firewall rule added successfully
    ) else (
        echo ❌ Failed to add backend firewall rule (Run as Administrator?)
    )
)

netsh advfirewall firewall show rule name="RecipeShare Frontend" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend firewall rule already exists
) else (
    echo ➕ Adding firewall rule for frontend (port 5173)...
    netsh advfirewall firewall add rule name="RecipeShare Frontend" dir=in action=allow protocol=TCP localport=5173
    if %errorlevel% equ 0 (
        echo ✅ Frontend firewall rule added successfully
    ) else (
        echo ❌ Failed to add frontend firewall rule (Run as Administrator?)
    )
)

echo.
echo 🌐 Network Information:
echo.
echo 📡 Your IP Addresses:
ipconfig | findstr /i "IPv4"

echo.
echo 🚀 After starting your server, other devices can access:
echo.
echo 📱 Frontend: http://YOUR_IP:5173
echo 🔧 Backend:  http://YOUR_IP:5000
echo.
echo 💡 Replace YOUR_IP with one of the addresses shown above
echo.
echo 🔥 Firewall Status:
netsh advfirewall show allprofiles state
echo.
echo ⚠️  Note: If you still can't access from other devices:
echo    1. Check your router settings
echo    2. Ensure devices are on the same network
echo    3. Try temporarily disabling Windows Firewall for testing
echo.
pause
