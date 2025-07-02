@echo off
echo 🚀 Simple Frontend Starter (No Workspaces)
echo ==========================================
echo.

cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing\frontend"

echo 📁 Current directory: %CD%
echo 📦 Installing dependencies with npm (no workspaces)...
echo.

npm install --no-workspaces --force --legacy-peer-deps

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencies installed successfully!
    echo 🚀 Starting development server...
    echo.
    echo 🌐 Frontend will be available at:
    echo    http://localhost:5173 (local)
    echo    http://YOUR_IP:5173 (network)
    echo.
    echo 💡 To stop the server, press Ctrl+C
    echo.
    
    npm run dev
) else (
    echo.
    echo ❌ Installation failed. Trying alternative...
    echo.
    
    echo 🔧 Clearing npm cache and retrying...
    npm cache clean --force
    
    echo 🔄 Retrying installation...
    npm install --no-workspaces --force --legacy-peer-deps --verbose
    
    if %errorlevel% equ 0 (
        echo.
        echo ✅ Installation successful on retry!
        npm run dev
    ) else (
        echo.
        echo ❌ Installation still failing. Manual steps needed:
        echo.
        echo 1. Make sure Node.js is properly installed:
        echo    node --version
        echo    npm --version
        echo.
        echo 2. Try running these commands manually:
        echo    cd frontend
        echo    npm cache clean --force
        echo    del package-lock.json
        echo    rd /s /q node_modules
        echo    npm install --force --legacy-peer-deps
        echo    npm run dev
        echo.
        echo 3. If still failing, check the README.md for more solutions
    )
)

echo.
echo Press any key to close...
pause >nul
