@echo off
echo 🚀 Recipe Sharing App - Full Startup
echo =====================================
echo.

echo 🏠 Navigating to project root...
cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"

echo 📁 Current directory: %CD%
echo.

echo 🔧 Step 1: Starting Backend Server...
echo --------------------------------------
cd backend
echo 📁 Backend directory: %CD%

echo 📦 Installing backend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Backend dependency installation failed
    pause
    exit /b 1
)

echo 🚀 Starting backend server...
start "Backend Server" cmd /k "npm start"

echo ⏱️ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 🎨 Step 2: Starting Frontend Server...
echo --------------------------------------
cd ..\frontend
echo 📁 Frontend directory: %CD%

echo 📦 Installing frontend dependencies (if needed)...
call npm install --no-workspaces --force --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed
    pause
    exit /b 1
)

echo 🚀 Starting frontend server...
echo 📍 Checking if index.html exists in root...
if not exist "index.html" (
    echo 🔧 Moving index.html from public to root (required by Vite)...
    if exist "public\index.html" (
        move "public\index.html" "index.html"
        echo ✅ index.html moved successfully
    ) else (
        echo ❌ index.html not found in public folder
    )
)

echo 🔍 Verifying Vite configuration...
if not exist "vite.config.ts" (
    echo ❌ vite.config.ts not found
    pause
    exit /b 1
)

echo 🚀 Starting frontend development server...
start "Frontend Server" cmd /k "echo Starting Vite dev server... && npm run dev && pause"

echo.
echo ✅ Both servers are starting!
echo.
echo 🌐 Access URLs:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.
echo 📱 Network Access (replace YOUR_IP with your actual IP):
echo    Frontend: http://YOUR_IP:5173
echo    Backend:  http://YOUR_IP:5000
echo.
echo 💡 To find your IP address, run: ipconfig
echo.
echo 🛑 To stop servers, close their respective command windows
echo    or press Ctrl+C in each window
echo.
echo Press any key to close this window...
pause >nul
