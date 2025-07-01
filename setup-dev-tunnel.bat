@echo off
echo 🌐 RecipeShare Dev Tunnel Setup
echo ===============================
echo.

echo 📋 Dev tunnels allow access from anywhere on the internet
echo 🔒 Your app will be accessible via HTTPS URLs
echo.

echo 🎯 STEP 1: Create Backend Dev Tunnel
echo ====================================
echo.
echo 🚀 Creating tunnel for backend (port 5000)...
echo.
echo 💡 In VS Code, open Command Palette (Ctrl+Shift+P)
echo 💡 Type: "Ports: Focus on Ports View" 
echo 💡 Or go to Terminal ^> Ports tab
echo.
echo 📋 Instructions:
echo 1. Start your server: npm run dev
echo 2. In VS Code Ports tab, find port 5000
echo 3. Right-click port 5000 ^> "Port Visibility" ^> "Public" 
echo 4. Copy the generated HTTPS URL
echo 5. It will look like: https://abcd1234-5000.inc1.devtunnels.ms
echo.

set /p backend_url="📝 Paste your backend tunnel URL here: "

if "%backend_url%"=="" (
    echo ❌ Backend URL is required
    pause
    exit /b 1
)

echo.
echo 🎯 STEP 2: Configure Environment
echo ===============================
echo.

REM Create .env file with dev tunnel configuration
echo # Dev Tunnel Configuration > .env.local
echo VITE_API_URL=%backend_url% >> .env.local
echo VITE_SOCKET_URL=%backend_url% >> .env.local
echo VITE_APP_URL=https://6x56z9gt-5173.inc1.devtunnels.ms >> .env.local
echo NODE_ENV=development >> .env.local

echo ✅ Environment configured with dev tunnel URLs
echo.

echo 🎯 STEP 3: Update Server CORS
echo =============================
echo.

REM Backup original .env
if exist .env copy .env .env.backup >nul

REM Update .env with tunnel URLs
echo. >> .env
echo # Dev Tunnel Configuration >> .env
echo CLIENT_URL=https://6x56z9gt-5173.inc1.devtunnels.ms >> .env

echo ✅ Server CORS updated for dev tunnel
echo.

echo 🎯 STEP 4: Test Configuration
echo ============================
echo.
echo 📋 Your URLs:
echo 🌐 Frontend: https://6x56z9gt-5173.inc1.devtunnels.ms
echo 🔧 Backend:  %backend_url%
echo.

echo 🧪 Testing backend accessibility...
curl -s -m 10 "%backend_url%/api/health" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is accessible via dev tunnel
) else (
    echo ❌ Backend is not accessible
    echo 💡 Make sure:
    echo    1. Server is running: npm run dev
    echo    2. Port 5000 is set to "Public" in VS Code Ports
    echo    3. Backend URL is correct
)

echo.
echo 🚀 STEP 5: Restart Development Server
echo ====================================
echo.
echo 🛑 Stop current server (Ctrl+C in the terminal)
echo 🔄 Restart with: npm run dev
echo ⏳ Wait for server to start
echo 🌐 Access via: https://6x56z9gt-5173.inc1.devtunnels.ms
echo.

echo 📱 STEP 6: Test from Any Device
echo ===============================
echo.
echo 1. Open browser on ANY device (phone, tablet, other computer)
echo 2. Go to: https://6x56z9gt-5173.inc1.devtunnels.ms
echo 3. No need for same WiFi network!
echo 4. App should load and work normally
echo.

echo 🔍 Troubleshooting:
echo - If frontend loads but API fails: Check backend tunnel URL
echo - If nothing loads: Check if port 5173 is set to "Public"
echo - If CORS errors: Restart server after configuration
echo.

echo 💡 Dev tunnels expire when VS Code closes
echo 💡 URLs may change when you restart VS Code
echo.

pause
