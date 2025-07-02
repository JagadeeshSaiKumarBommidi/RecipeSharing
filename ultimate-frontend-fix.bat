@echo off
echo 🎯 Ultimate Frontend Fix & Start
echo =================================
echo.

cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing\frontend"

echo 📁 Directory: %CD%
echo.

echo 🔧 Step 1: Fix project structure...
if not exist "index.html" (
    if exist "public\index.html" (
        echo 📝 Moving index.html to root...
        move "public\index.html" "index.html"
    ) else (
        echo 📝 Creating index.html...
        echo ^<!DOCTYPE html^> > index.html
        echo ^<html lang="en"^> >> index.html
        echo ^<head^> >> index.html
        echo ^<meta charset="UTF-8" /^> >> index.html
        echo ^<meta name="viewport" content="width=device-width, initial-scale=1.0" /^> >> index.html
        echo ^<title^>Recipe Share^</title^> >> index.html
        echo ^</head^> >> index.html
        echo ^<body^> >> index.html
        echo ^<div id="root"^>^</div^> >> index.html
        echo ^<script type="module" src="/src/main.tsx"^>^</script^> >> index.html
        echo ^</body^> >> index.html
        echo ^</html^> >> index.html
    )
)

echo 🧹 Step 2: Clean install dependencies...
if exist "package-lock.json" del "package-lock.json"
if exist "node_modules" rmdir /s /q "node_modules"

echo 📦 Installing dependencies...
npm install --no-workspaces --force --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ❌ npm install failed, trying with cache clean...
    npm cache clean --force
    npm install --no-workspaces --force --legacy-peer-deps
    
    if %errorlevel% neq 0 (
        echo ❌ Installation still failed
        echo.
        echo Manual fix needed:
        echo 1. Check Node.js version: node --version
        echo 2. Should be 18+ 
        echo 3. If not, download from https://nodejs.org
        pause
        exit /b 1
    )
)

echo ✅ Dependencies installed successfully!
echo.

echo 🔍 Step 3: Verify installation...
if not exist "node_modules\vite" (
    echo ❌ Vite not installed properly
    pause
    exit /b 1
)

echo ✅ Vite found in node_modules
echo.

echo 🚀 Step 4: Starting development server...
echo.
echo 🌐 Server will be available at:
echo    Local:   http://localhost:5173
echo    Network: http://YOUR_IP:5173
echo.
echo 💡 Find your IP with: ipconfig
echo 💡 Stop server with: Ctrl+C
echo.

npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ❌ Server failed to start
    echo.
    echo 🔍 Troubleshooting steps:
    echo 1. Check if port is in use: netstat -ano ^| findstr :5173
    echo 2. Check for syntax errors in config files
    echo 3. Try restarting your computer
    echo 4. Check Windows Firewall settings
    echo.
    pause
)

echo.
echo Press any key to exit...
pause >nul
