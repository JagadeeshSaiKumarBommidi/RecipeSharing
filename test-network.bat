@echo off
echo 🔍 Testing Network Connectivity
echo ===============================
echo.

set NETWORK_IP=192.168.1.5

echo 🌐 Testing access to %NETWORK_IP%...
echo.

REM Test if ports are listening
echo 📡 Checking if servers are running...
netstat -an | findstr :5000 > nul
if %errorlevel% == 0 (
    echo ✅ Port 5000 is listening
) else (
    echo ❌ Port 5000 is NOT listening - backend not started
)

netstat -an | findstr :4173 > nul
if %errorlevel% == 0 (
    echo ✅ Port 4173 is listening
) else (
    echo ❌ Port 4173 is NOT listening - frontend not started
)
echo.

REM Test backend health endpoint
echo 🏥 Testing backend health endpoint...
curl -s "http://%NETWORK_IP%:5000/api/health" > nul
if %errorlevel% == 0 (
    echo ✅ Backend health endpoint accessible
    curl -s "http://%NETWORK_IP%:5000/api/health"
) else (
    echo ❌ Backend health endpoint NOT accessible
)
echo.

REM Test frontend
echo 🎨 Testing frontend accessibility...
curl -s "http://%NETWORK_IP%:4173" > nul
if %errorlevel% == 0 (
    echo ✅ Frontend accessible
) else (
    echo ❌ Frontend NOT accessible
)
echo.

echo 📝 Network URLs:
echo    Backend:  http://%NETWORK_IP%:5000
echo    Frontend: http://%NETWORK_IP%:4173
echo    Health:   http://%NETWORK_IP%:5000/api/health
echo.
echo ⚠️  If tests fail, run: network-setup.bat
echo.
pause
