@echo off
echo.
echo ================================================
echo   RecipeSharing Application Startup
echo ================================================
echo.

echo Checking Node.js version...
node --version
echo.

echo Checking npm version...
npm --version
echo.

echo Checking if .env file exists...
if exist .env (
    echo ✅ .env file found
) else (
    echo ❌ .env file not found
    echo Please create .env file from .env.example
    pause
    exit /b 1
)
echo.

echo Checking if node_modules exists...
if exist node_modules (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed
    echo Running npm install...
    npm install
)
echo.

echo Starting the application...
echo Press Ctrl+C to stop the server
echo.
npm run dev
