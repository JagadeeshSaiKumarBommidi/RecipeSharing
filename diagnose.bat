@echo off
echo.
echo ================================================
echo   RecipeSharing - Diagnostic Tool
echo ================================================
echo.

echo 1. Checking current directory...
echo Current directory: %cd%
echo.

echo 2. Checking if package.json exists...
if exist package.json (
    echo ✅ package.json found
) else (
    echo ❌ package.json not found - you may be in the wrong directory
    echo Please navigate to the RecipeSharing project folder
    pause
    exit /b 1
)

echo.
echo 3. Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js version:
    node --version
)

echo.
echo 4. Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed or not in PATH
    pause
    exit /b 1
) else (
    echo ✅ npm version:
    npm --version
)

echo.
echo 5. Checking if .env file exists...
if exist .env (
    echo ✅ .env file found
    echo Contents (without sensitive data):
    findstr /V "MONGODB_URI JWT_SECRET" .env
) else (
    echo ❌ .env file not found
    echo Creating .env file from template...
    if exist .env.example (
        copy .env.example .env
        echo ✅ Created .env file
        echo ⚠️  Please edit .env file with your configuration
    ) else (
        echo ❌ .env.example file not found
    )
)

echo.
echo 6. Checking if node_modules exists...
if exist node_modules (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    ) else (
        echo ✅ Dependencies installed successfully
    )
)

echo.
echo 7. Checking if uploads directory exists...
if exist uploads (
    echo ✅ uploads directory exists
) else (
    echo ⚠️  uploads directory not found, creating...
    mkdir uploads
    echo ✅ uploads directory created
)

echo.
echo 8. Testing server startup...
echo Starting server in test mode...
timeout 3 >nul
node server/index.js --test >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Server failed to start
    echo Running detailed error check...
    node server/index.js
    pause
    exit /b 1
) else (
    echo ✅ Server configuration appears valid
)

echo.
echo 9. Checking ports...
echo Checking if port 5000 is available...
netstat -an | find ":5000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 is already in use
    echo You may need to:
    echo   - Stop other applications using port 5000
    echo   - Change PORT in .env file to a different port
    netstat -ano | findstr :5000
) else (
    echo ✅ Port 5000 is available
)

echo.
echo Checking if port 5173 is available...
netstat -an | find ":5173" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5173 is already in use
    echo You may need to stop other applications using port 5173
    netstat -ano | findstr :5173
) else (
    echo ✅ Port 5173 is available
)

echo.
echo ================================================
echo   Diagnostic Complete
echo ================================================
echo.
echo If all checks passed, try running:
echo   npm run dev
echo.
echo If you see errors, please check the troubleshooting guide:
echo   TROUBLESHOOTING.md
echo.
pause
