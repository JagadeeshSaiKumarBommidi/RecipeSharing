@echo off
echo.
echo ================================================
echo   RecipeSharing - Quick Fix Script
echo ================================================
echo.

echo Step 1: Navigating to project directory...
cd /d "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"
if %errorlevel% neq 0 (
    echo ❌ Could not navigate to project directory
    echo Please make sure the path is correct
    pause
    exit /b 1
)
echo ✅ In project directory: %cd%

echo.
echo Step 2: Creating .env file if missing...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo ✅ Created .env file from template
    ) else (
        echo Creating basic .env file...
        echo # Database Configuration > .env
        echo MONGODB_URI=mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing >> .env
        echo. >> .env
        echo # Server Configuration >> .env
        echo PORT=5000 >> .env
        echo NODE_ENV=development >> .env
        echo. >> .env
        echo # JWT Configuration >> .env
        echo JWT_SECRET=recipe-sharing-super-secret-jwt-key-2025 >> .env
        echo. >> .env
        echo # Client URL (for CORS) >> .env
        echo CLIENT_URL=http://localhost:5173 >> .env
        echo ✅ Created basic .env file
    )
) else (
    echo ✅ .env file already exists
)

echo.
echo Step 3: Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    echo Trying to clear cache and reinstall...
    npm cache clean --force
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Still failed to install dependencies
        echo Please check your internet connection and try again
        pause
        exit /b 1
    )
)
echo ✅ Dependencies installed

echo.
echo Step 4: Creating required directories...
if not exist uploads mkdir uploads
echo ✅ Directories ready

echo.
echo Step 5: Checking for port conflicts...
echo Checking if port 5000 is free...
netstat -an | find ":5000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 is in use. Trying to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        echo Killing process %%a
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo.
echo Step 6: Starting the application...
echo.
echo ================================================
echo   Starting RecipeSharing Application
echo ================================================
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers
echo.

start "RecipeSharing" cmd /k "npm run dev"

echo.
echo ✅ Application started in new window
echo.
echo If you see errors, please:
echo 1. Check the new command window for error messages
echo 2. Run diagnose.bat for detailed diagnostics
echo 3. Check TROUBLESHOOTING.md for solutions
echo.
pause
