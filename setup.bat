@echo off
echo.
echo ================================================
echo   RecipeSharing - First Time Setup
echo ================================================
echo.

echo 1. Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

echo.
echo 2. Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully
)

echo.
echo 3. Setting up environment file...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo ✅ Created .env file from template
        echo ⚠️  Please edit .env file with your MongoDB connection details
    ) else (
        echo ❌ .env.example file not found
    )
) else (
    echo ✅ .env file already exists
)

echo.
echo 4. Creating uploads directory...
if not exist uploads mkdir uploads
echo ✅ Uploads directory ready

echo.
echo ================================================
echo   Setup Complete!
echo ================================================
echo.
echo Next steps:
echo 1. Edit .env file with your MongoDB connection string
echo 2. Run 'npm run dev' to start the application
echo 3. Open http://localhost:5173 in your browser
echo.
echo For MongoDB Atlas:
echo - Create account at https://cloud.mongodb.com/
echo - Create a new cluster
echo - Get connection string and update MONGODB_URI in .env
echo.
echo For local MongoDB:
echo - Install MongoDB locally
echo - Use: MONGODB_URI=mongodb://localhost:27017/recipesharing
echo.
pause
