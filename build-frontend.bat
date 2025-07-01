@echo off
echo 🏗️ Building RecipeShare Frontend for Production
echo ==============================================
echo.

echo 🧹 Step 1: Cleaning previous builds...
if exist "dist" rmdir /s /q "dist"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

echo.
echo 📦 Step 2: Installing dependencies...
call npm install

echo.
echo 🔨 Step 3: Building frontend...
echo.
echo ⏳ This may take a few minutes...
call npm run build

echo.
echo 🔍 Step 4: Checking build results...
if exist "dist" (
    echo ✅ Build successful! dist/ folder created
    echo.
    echo 📁 Contents of dist/ folder:
    dir /b dist
    echo.
    echo 📊 Build statistics:
    for /f %%i in ('dir /s /b dist\*.* ^| find /c /v ""') do echo    Total files: %%i
    for /f %%i in ('dir /s dist ^| find "bytes" ^| find /c /v ""') do echo    Total size: %%i
    echo.
    echo 🎉 Frontend is ready for deployment!
    echo 📂 Target folder: dist/
    echo 🌐 Entry point: dist/index.html
) else (
    echo ❌ Build failed! dist/ folder not created
    echo.
    echo 🔍 Common issues:
    echo 1. TypeScript compilation errors
    echo 2. Missing dependencies
    echo 3. Environment variable issues
    echo 4. Import/export errors
    echo.
    echo 💡 Check the error messages above for details
)

echo.
echo 📋 Build Summary:
echo ================
if exist "dist" (
    echo Status: ✅ SUCCESS
    echo Target: dist/ folder ready for Render deployment
    echo Deploy: Use 'npm run build' as Build Command in Render
    echo Publish: Use './dist' as Publish Directory in Render
) else (
    echo Status: ❌ FAILED
    echo Action: Fix the errors shown above and try again
    echo Help: Check package.json scripts and dependencies
)

echo.
pause
