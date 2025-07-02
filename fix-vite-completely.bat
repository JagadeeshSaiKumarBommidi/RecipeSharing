@echo off
echo 🔧 Complete Vite Installation Fix
echo =================================
echo.

cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing\frontend"

echo 📁 Current directory: %CD%
echo.

echo 🧹 Step 1: Complete cleanup...
echo -------------------------------
echo 🗑️ Removing corrupted files...
if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo Removing package-lock.json...
    del package-lock.json
)
if exist "yarn.lock" (
    echo Removing yarn.lock...
    del yarn.lock
)

echo 🧹 Clearing npm cache...
npm cache clean --force

echo.
echo 📦 Step 2: Fresh dependency installation...
echo ------------------------------------------
echo 🔄 Installing all dependencies...
npm install --no-workspaces --force --legacy-peer-deps --verbose

if %errorlevel% neq 0 (
    echo ❌ npm install failed, trying alternative approach...
    echo.
    echo 🔧 Trying with different flags...
    npm install --force --legacy-peer-deps
    
    if %errorlevel% neq 0 (
        echo ❌ Still failing, trying manual Vite installation...
        npm install vite@latest @vitejs/plugin-react@latest --save-dev --force
    )
)

echo.
echo 🧪 Step 3: Testing Vite installation...
echo --------------------------------------
echo 🔍 Checking if Vite is available...

echo Testing: vite --version
call npx vite --version
if %errorlevel% equ 0 (
    echo ✅ Vite is working via npx!
) else (
    echo ❌ Vite still not working via npx
)

echo.
echo Testing: npm run build
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    
    echo 📁 Checking dist folder...
    if exist "dist" (
        echo ✅ dist folder created
        dir dist
    ) else (
        echo ❌ dist folder not created
    )
) else (
    echo ❌ Build failed
    echo.
    echo 🛠️ Manual fix needed - trying direct vite installation...
    echo.
    
    echo Installing Vite globally...
    npm install -g vite@latest
    
    echo Installing Vite locally...
    npm install vite@latest --save-dev --force
    
    echo Testing again...
    npx vite --version
)

echo.
echo 🧪 Step 4: Alternative build method...
echo ------------------------------------
if not exist "dist" (
    echo 🔧 Trying npx vite build...
    npx vite build
    
    if %errorlevel% equ 0 (
        echo ✅ npx vite build worked!
    ) else (
        echo ❌ npx vite build also failed
    )
)

echo.
echo 📋 DIAGNOSTIC SUMMARY
echo ====================
echo.

if exist "node_modules\vite" (
    echo ✅ Vite installed in node_modules
) else (
    echo ❌ Vite missing from node_modules
)

if exist "dist\index.html" (
    echo ✅ Build output exists (dist/index.html)
) else (
    echo ❌ Build output missing
)

echo.
echo 🎯 SOLUTION STATUS:
echo.
if exist "dist\index.html" (
    echo ✅ SUCCESS! Vite is working and build completed
    echo 🚀 Your 404 error should now be fixed
    echo.
    echo Next steps:
    echo 1. git add .
    echo 2. git commit -m "Fix Vite installation and build"
    echo 3. git push
    echo 4. Check your Vercel deployment
) else (
    echo ❌ STILL HAVING ISSUES
    echo.
    echo 🛠️ Manual steps to try:
    echo 1. Download and install latest Node.js from https://nodejs.org
    echo 2. Restart your computer
    echo 3. Run this script again
    echo 4. If still failing, try: npm install -g npm@latest
)

echo.
echo Press any key to continue...
pause >nul
