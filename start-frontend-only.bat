@echo off
echo 🎨 Frontend Development Server Starter
echo =====================================
echo.

cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing\frontend"
echo 📁 Current directory: %CD%
echo.

echo 🔍 Checking project structure...
if not exist "package.json" (
    echo ❌ package.json not found in frontend directory
    pause
    exit /b 1
)

if not exist "src\main.tsx" (
    echo ❌ src\main.tsx not found
    pause
    exit /b 1
)

if not exist "index.html" (
    echo 🔧 index.html not in root, checking public folder...
    if exist "public\index.html" (
        echo 📝 Moving index.html from public to root (Vite requirement)...
        move "public\index.html" "index.html"
        echo ✅ index.html moved successfully
    ) else (
        echo ❌ index.html not found anywhere
        pause
        exit /b 1
    )
)

echo 🔍 Checking if node_modules exists...
if not exist "node_modules" (
    echo 📦 node_modules not found, installing dependencies...
    npm install --no-workspaces --force --legacy-peer-deps
    
    if %errorlevel% neq 0 (
        echo ❌ Dependency installation failed
        pause
        exit /b 1
    )
) else (
    echo ✅ node_modules found
)

echo 🧪 Checking Vite installation...
npx vite --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Vite not found, installing...
    npm install vite@latest --save-dev
)

echo.
echo 🚀 Starting Vite development server...
echo.
echo 🌐 Server will be available at:
echo    http://localhost:5173 (local)
echo    http://YOUR_IP:5173 (network)
echo.
echo 💡 To stop the server, press Ctrl+C
echo 💡 To find your IP, run: ipconfig
echo.

npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ❌ Server failed to start. Common fixes:
    echo.
    echo 1. Check if port 5173 is already in use:
    echo    netstat -ano | findstr :5173
    echo.
    echo 2. Try clearing npm cache:
    echo    npm cache clean --force
    echo.
    echo 3. Reinstall dependencies:
    echo    rmdir /s /q node_modules
    echo    del package-lock.json
    echo    npm install
    echo.
    echo 4. Check for syntax errors in vite.config.ts
    echo.
    pause
)

echo.
echo Press any key to close...
pause >nul
