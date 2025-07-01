@echo off
echo 🚨 RecipeShare Server Recovery
echo =============================
echo.

echo 🔄 Step 1: Stopping any running processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM nodemon.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo 🧹 Step 2: Cleaning up...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache" 2>nul
if exist ".vite" rmdir /s /q ".vite" 2>nul
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" 2>nul

echo 📁 Step 3: Ensuring directories exist...
if not exist "uploads" mkdir uploads
if not exist "uploads\stories" mkdir uploads\stories
if not exist "uploads\recipes" mkdir uploads\recipes
if not exist "uploads\profiles" mkdir uploads\profiles

echo 🔧 Step 4: Checking dependencies...
call npm install --silent

echo 🚀 Step 5: Starting server in debug mode...
echo.
echo ⏳ Starting backend server...
echo 💡 Watch for these messages:
echo    - "Connected to MongoDB"
echo    - "Server running on 0.0.0.0:5000"
echo.
echo 🔍 If server fails, check:
echo    - MongoDB connection string in .env
echo    - Network connectivity
echo    - Port 5000 availability
echo.
echo 📊 Press Ctrl+C to stop the server
echo.
start /B npm run server

echo 🌐 Step 6: Starting frontend...
timeout /t 3 /nobreak >nul
start /B npm run client

echo.
echo ✅ Recovery process initiated!
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo.
echo 💡 To test connectivity: node test-server-connectivity.js
echo.
pause
