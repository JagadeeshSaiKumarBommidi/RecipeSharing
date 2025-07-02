@echo off
echo 🧪 Testing Recipe Sharing App Servers
echo =====================================
echo.

echo 🔍 Checking if servers are running...
echo.

echo 📡 Testing Backend (Port 5000)...
curl -s http://localhost:5000 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend server is running at http://localhost:5000
) else (
    echo ❌ Backend server is not responding
)

echo.
echo 📡 Testing Frontend (Port 5173)...
curl -s http://localhost:5173 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend server is running at http://localhost:5173
) else (
    echo ❌ Frontend server is not responding
)

echo.
echo 🌐 Opening servers in browser...
echo.

echo 🎯 Opening Frontend...
start http://localhost:5173

echo 🎯 Opening Backend API...
start http://localhost:5000

echo.
echo 💡 If servers are not running, use start-app.bat to start them
echo.
echo Press any key to close...
pause >nul
