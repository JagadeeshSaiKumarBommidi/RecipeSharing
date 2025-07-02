@echo off
echo 🔍 Frontend Diagnostic Tool
echo ===========================
echo.

cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing\frontend"
echo 📁 Working directory: %CD%
echo.

echo 🧪 Step 1: Checking Node.js and npm...
node --version
npm --version
echo.

echo 🧪 Step 2: Checking project files...
echo 📄 package.json: 
if exist "package.json" (echo ✅ Found) else (echo ❌ Missing)

echo 📄 index.html: 
if exist "index.html" (echo ✅ Found) else (echo ❌ Missing)

echo 📄 vite.config.ts: 
if exist "vite.config.ts" (echo ✅ Found) else (echo ❌ Missing)

echo 📄 src\main.tsx: 
if exist "src\main.tsx" (echo ✅ Found) else (echo ❌ Missing)

echo 📁 node_modules: 
if exist "node_modules" (echo ✅ Found) else (echo ❌ Missing)
echo.

echo 🧪 Step 3: Checking Vite installation...
echo Vite version:
npx vite --version
echo.

echo 🧪 Step 4: Checking port availability...
echo Checking if port 5173 is available...
netstat -ano | findstr :5173
if %errorlevel% equ 0 (
    echo ⚠️ Port 5173 is already in use
) else (
    echo ✅ Port 5173 is available
)
echo.

echo 🧪 Step 5: Testing Vite startup (this will start the server)...
echo Press Ctrl+C to stop the server when it starts...
echo.
pause

echo Starting Vite...
npm run dev
