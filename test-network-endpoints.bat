@echo off
echo 🧪 Testing Network Access - IP: 192.168.1.5
echo ==========================================
echo.

echo 🔍 Testing backend endpoints...
echo.

echo 1️⃣ Testing health endpoint...
curl -s http://192.168.1.5:5000/api/health
if %errorlevel% equ 0 (
    echo.
    echo ✅ Health endpoint working!
) else (
    echo ❌ Health endpoint failed
)

echo.
echo 2️⃣ Testing root endpoint...
curl -s http://192.168.1.5:5000/
if %errorlevel% equ 0 (
    echo.
    echo ✅ Root endpoint working!
) else (
    echo ❌ Root endpoint failed
)

echo.
echo 3️⃣ Testing invalid endpoint (should show "Route not found")...
curl -s http://192.168.1.5:5000/invalid
if %errorlevel% equ 0 (
    echo.
    echo ℹ️ This should show "Route not found" - that's normal!
) else (
    echo ❌ Server not responding
)

echo.
echo 📋 CORRECT URLS FOR TESTING:
echo ============================
echo.
echo ✅ BACKEND HEALTH: http://192.168.1.5:5000/api/health
echo    Expected: {"status":"OK","timestamp":"...","uptime":...}
echo.
echo ✅ FRONTEND APP: http://192.168.1.5:4173
echo    Expected: Full RecipeShare application loads
echo.
echo ❌ WRONG URL: http://192.168.1.5:5000 (just the IP:port)
echo    Result: {"message":"Route not found"}
echo.
echo 💡 EXPLANATION:
echo - http://192.168.1.5:5000 = Backend server root (no specific endpoint)
echo - http://192.168.1.5:5000/api/health = Health check endpoint ✅
echo - http://192.168.1.5:4173 = Frontend application ✅
echo.

pause
