@echo off
echo 🚀 RecipeShare Server Restart (Step 2 of Action Plan)
echo ====================================================
echo.

echo 🛑 Stopping any existing servers...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM nodemon.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo 🧹 Cleaning temporary files...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache" >nul 2>&1
if exist ".vite" rmdir /s /q ".vite" >nul 2>&1

echo 📁 Ensuring directories exist...
if not exist "uploads" mkdir uploads
if not exist "uploads\stories" mkdir uploads\stories

echo 🚀 Starting development server...
echo.
echo ⏳ Watch for these messages:
echo    ✅ Connected to MongoDB
echo    🚀 Server running on 0.0.0.0:5000  
echo    🌐 Server accessible from network
echo    📡 Available network addresses: ...
echo.
echo 💡 Keep this window open while testing
echo 🔍 To stop server: Press Ctrl+C
echo.

npm run dev
