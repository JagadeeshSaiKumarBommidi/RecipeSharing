@echo off
echo.
echo ================================================
echo   Fixing "ERR_CONNECTION_REFUSED" Error
echo ================================================
echo.
echo This error means the server isn't running. Let's fix it step by step.
echo.

cd /d "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"

echo Step 1: Checking if you're in the right directory...
if not exist package.json (
    echo ❌ package.json not found
    echo Please make sure you're in the RecipeSharing project directory
    pause
    exit /b 1
)
echo ✅ Found package.json

echo.
echo Step 2: Checking for .env file...
if not exist .env (
    echo ❌ .env file missing - this is likely the cause!
    echo Creating .env file...
    (
        echo # Database Configuration
        echo MONGODB_URI=mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing
        echo.
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=recipe-sharing-super-secret-jwt-key-2025
        echo.
        echo # Client URL ^(for CORS^)
        echo CLIENT_URL=http://localhost:5173
    ) > .env
    echo ✅ Created .env file
) else (
    echo ✅ .env file exists
)

echo.
echo Step 3: Installing/checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)
echo ✅ Dependencies ready

echo.
echo Step 4: Testing server configuration...
echo Running server test...
npm run test-server
if %errorlevel% neq 0 (
    echo ❌ Server configuration test failed
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo Step 5: Killing any processes using required ports...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5000') do (
    echo Stopping process on port 5000 ^(PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5173') do (
    echo Stopping process on port 5173 ^(PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo Step 6: Starting the application...
echo.
echo ================================================
echo   Starting Servers
echo ================================================
echo.
echo The application will start in a new window.
echo.
echo Once started:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:5000
echo - Health check: http://localhost:5000/api/health
echo.
echo If you still get connection refused:
echo 1. Wait 10-15 seconds for servers to fully start
echo 2. Check the server window for error messages
echo 3. Try refreshing your browser
echo.

start "RecipeSharing Servers" cmd /c "npm run dev & pause"

echo ✅ Application starting...
echo.
echo If problems persist:
echo - Run diagnose.bat for detailed diagnostics
echo - Check server logs in the new window
echo - Verify your MongoDB connection
echo.

timeout 5 >nul
echo Opening browser...
start http://localhost:5173

pause
