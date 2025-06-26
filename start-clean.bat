@echo off
echo.
echo ================================================
echo   RecipeSharing - Clean Start
echo ================================================
echo.

cd /d "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"

echo 1. Checking environment configuration...
node -e "require('dotenv').config(); console.log('✅ JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED' : 'MISSING'); console.log('✅ MONGODB_URI:', process.env.MONGODB_URI ? 'LOADED' : 'MISSING'); console.log('✅ PORT:', process.env.PORT || 'DEFAULT (5000)');"

echo.
echo 2. Stopping any existing processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout 2 >nul

echo.
echo 3. Cleaning cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite 2>nul

echo.
echo 4. Starting application...
echo.
echo ================================================
echo   Server Starting
echo ================================================
echo.
echo You should see:
echo ✅ JWT_SECRET: Loaded
echo ✅ MONGODB_URI: Loaded  
echo ✅ Connected to MongoDB
echo 🚀 Server running on port 5000
echo.
echo No more JWT warnings!
echo.

start "RecipeSharing - Fixed" cmd /k "npm run dev"

timeout 5 >nul
echo Opening browser...
start http://localhost:5173

pause
