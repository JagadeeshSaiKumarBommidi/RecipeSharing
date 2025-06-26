@echo off
echo.
echo ================================================
echo   Alternative: Running from Local Directory
echo ================================================
echo.
echo OneDrive can cause permission issues with Node.js projects.
echo This script will copy your project to a local directory and run it from there.
echo.

set LOCAL_DIR=C:\temp\RecipeSharing
set SOURCE_DIR=%~dp0

echo Step 1: Creating local directory...
if exist "%LOCAL_DIR%" (
    echo Removing existing local copy...
    rmdir /s /q "%LOCAL_DIR%"
)
mkdir "%LOCAL_DIR%"
echo ✅ Local directory created: %LOCAL_DIR%

echo.
echo Step 2: Copying project files...
echo This may take a moment...

REM Copy all files except node_modules and cache directories
xcopy "%SOURCE_DIR%*" "%LOCAL_DIR%\" /E /I /H /Y /EXCLUDE:%SOURCE_DIR%copy-exclude.txt >nul 2>&1

REM Create exclude file for xcopy
echo node_modules\ > "%LOCAL_DIR%\copy-exclude.txt"
echo .git\ >> "%LOCAL_DIR%\copy-exclude.txt"
echo uploads\ >> "%LOCAL_DIR%\copy-exclude.txt"

REM Copy again with exclusions
robocopy "%SOURCE_DIR%" "%LOCAL_DIR%" /E /XD node_modules .git uploads .vscode /XF *.log /NFL /NDL /NJH /NJS

echo ✅ Project files copied

echo.
echo Step 3: Installing dependencies in local directory...
cd /d "%LOCAL_DIR%"
npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo Step 4: Starting the application from local directory...
echo.
echo Project is now running from: %LOCAL_DIR%
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.

start "RecipeSharing (Local)" cmd /k "npm run dev"

echo.
echo ✅ Application started from local directory!
echo.
echo This copy will not sync with OneDrive, avoiding permission issues.
echo Make your changes in: %LOCAL_DIR%
echo.

timeout 5 >nul
start http://localhost:5173

echo.
echo When you're done developing, you can copy changes back:
echo From: %LOCAL_DIR%
echo To:   %SOURCE_DIR%
echo.
pause
