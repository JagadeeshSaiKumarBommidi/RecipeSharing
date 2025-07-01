@echo off
echo 🎯 Quick Network Fix - Using Your IP: 192.168.1.5
echo ================================================
echo.

echo 🛑 Stopping existing servers...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM nodemon.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo 🔧 Creating network configuration...
echo # Network Configuration for 192.168.1.5 > .env.local
echo VITE_API_URL=http://192.168.1.5:5000 >> .env.local
echo VITE_SOCKET_URL=http://192.168.1.5:5000 >> .env.local
echo NODE_ENV=development >> .env.local

echo ✅ Configuration created
echo.

echo 🏗️ Rebuilding frontend with network IP...
if exist "dist" rmdir /s /q "dist"
call npm run build

echo.
echo 🚀 Starting backend server with network binding...
start /B cmd /C "set HOST=0.0.0.0&& set PORT=5000&& npm run server"
echo ⏳ Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo 🧪 Testing backend connectivity...
curl -s -m 5 http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend running on localhost
) else (
    echo ❌ Backend not responding on localhost
)

curl -s -m 5 http://192.168.1.5:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend accessible from network
) else (
    echo ❌ Backend not accessible from network - checking firewall...
)

echo.
echo 📋 YOUR NETWORK URLS:
echo ====================
echo 🔧 Backend Health Check: http://192.168.1.5:5000/api/health
echo 🔧 Backend Root:         http://192.168.1.5:5000/
echo 🌐 Frontend App:         http://192.168.1.5:4173
echo.
echo 📱 TESTING STEPS:
echo 1. Test backend health: http://192.168.1.5:5000/api/health
echo 2. Should see: {"status":"OK",...}
echo 3. Then test frontend: http://192.168.1.5:4173
echo 4. Frontend should load the full app
echo.

echo ⏳ Starting frontend server...
npx vite preview --host 0.0.0.0 --port 4173
