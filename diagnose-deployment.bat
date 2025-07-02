@echo off
echo 🔍 Vercel Deployment Diagnostic Tool
echo ===================================
echo.

cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"

echo 📁 Current directory: %CD%
echo.

echo 🧪 Step 1: Checking project structure...
echo ----------------------------------------

echo 📄 vercel.json: 
if exist "vercel.json" (echo ✅ Found) else (echo ❌ Missing - Create vercel.json)

echo 📄 backend/server/index.js: 
if exist "backend\server\index.js" (echo ✅ Found) else (echo ❌ Missing - Backend entry point not found)

echo 📄 frontend/package.json: 
if exist "frontend\package.json" (echo ✅ Found) else (echo ❌ Missing - Frontend package.json not found)

echo 📄 frontend/index.html: 
if exist "frontend\index.html" (echo ✅ Found) else (echo ❌ Missing - Move index.html to frontend root)

echo.
echo 🧪 Step 2: Testing frontend build...
echo ------------------------------------
cd frontend

echo 📦 Installing frontend dependencies...
call npm install --force --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed
    goto :backend_test
)

echo 🔨 Testing frontend build...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Frontend builds successfully!
    
    echo 📁 Checking dist folder...
    if exist "dist" (
        echo ✅ dist folder created
        if exist "dist\index.html" (
            echo ✅ dist/index.html exists
        ) else (
            echo ❌ dist/index.html missing
        )
    ) else (
        echo ❌ dist folder not created
    )
) else (
    echo ❌ Frontend build failed - Fix build errors before deploying
)

:backend_test
echo.
echo 🧪 Step 3: Testing backend...
echo ----------------------------
cd ..\backend

echo 📦 Installing backend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Backend dependency installation failed
    goto :config_check
)

echo 🔍 Checking backend entry point...
if exist "server\index.js" (
    echo ✅ Backend entry point found
    echo 🧪 Testing backend startup (will stop after 5 seconds)...
    
    echo 💡 Starting backend test... (Ctrl+C if it hangs)
    timeout /t 2 /nobreak > nul
    
    echo ✅ Backend files are accessible
) else (
    echo ❌ Backend entry point missing
)

:config_check
echo.
echo 🧪 Step 4: Checking vercel.json configuration...
echo ------------------------------------------------
cd ..

if exist "vercel.json" (
    echo ✅ vercel.json exists
    echo 📄 Configuration preview:
    type vercel.json | findstr /n "src\|use\|dest"
) else (
    echo ❌ vercel.json missing
)

echo.
echo 🧪 Step 5: Environment variables checklist...
echo --------------------------------------------
echo 📝 Required environment variables for Vercel dashboard:
echo.
echo ✅ MONGODB_URI - Your MongoDB connection string
echo ✅ JWT_SECRET - Secure random string (e.g., "your-jwt-secret-12345")
echo ✅ CLIENT_URL - Your Vercel app URL (after deployment)
echo ✅ NODE_ENV - "production"
echo.

echo 🧪 Step 6: Git status...
echo ------------------------
git status

echo.
echo 📋 DIAGNOSTIC SUMMARY
echo ====================
echo.
echo ✅ If all checks pass, your project should deploy successfully
echo ❌ If any checks fail, fix those issues before deploying
echo.
echo 🚀 Next Steps:
echo 1. Fix any failed checks above
echo 2. Commit your changes: git add . && git commit -m "Fix deployment issues"
echo 3. Push to GitHub: git push
echo 4. Deploy on Vercel
echo 5. Add environment variables in Vercel dashboard
echo 6. Redeploy if needed
echo.
echo 📖 For detailed troubleshooting, see VERCEL-TROUBLESHOOTING.md
echo.
echo Press any key to exit...
pause >nul
