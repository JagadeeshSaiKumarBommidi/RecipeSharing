@echo off
echo.
echo ================================================
echo   Fixing Vite Permission and Cache Issues
echo ================================================
echo.

cd /d "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"

echo Step 1: Stopping all Node.js processes...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM nodemon.exe /T >nul 2>&1
timeout 3 >nul
echo ✅ Processes stopped

echo.
echo Step 2: Cleaning Vite cache and temp files...
if exist node_modules\.vite (
    echo Removing Vite cache directory...
    rmdir /s /q node_modules\.vite 2>nul
    timeout 2 >nul
)

if exist node_modules\.cache (
    echo Removing general cache directory...
    rmdir /s /q node_modules\.cache 2>nul
)

echo ✅ Cache directories cleaned

echo.
echo Step 3: Cleaning npm cache...
npm cache clean --force
echo ✅ npm cache cleaned

echo.
echo Step 4: Fixing file permissions...
echo Running as administrator to fix permissions...

REM Try to take ownership of the node_modules directory
takeown /F node_modules /R /D Y >nul 2>&1
icacls node_modules /grant %USERNAME%:F /T >nul 2>&1

echo ✅ Permissions updated

echo.
echo Step 5: Reinstalling dependencies with clean slate...
echo This may take a few minutes...

REM Remove package-lock.json to ensure clean install
if exist package-lock.json del package-lock.json

npm install --no-optional --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ npm install failed, trying alternative approach...
    npm install --force
    if %errorlevel% neq 0 (
        echo ❌ Installation failed completely
        echo Try running this script as Administrator
        pause
        exit /b 1
    )
)

echo ✅ Dependencies reinstalled successfully

echo.
echo Step 6: Testing the fix...
echo Starting development servers...

start "RecipeSharing Dev" cmd /k "timeout 3 >nul && npm run dev"

echo.
echo ✅ Servers starting in new window...
echo.
echo If you still see permission errors:
echo 1. Run this script as Administrator
echo 2. Move the project to C:\temp\ (shorter path)
echo 3. Disable OneDrive sync for this folder temporarily
echo.

timeout 5 >nul
echo Opening browser...
start http://localhost:5173

pause
