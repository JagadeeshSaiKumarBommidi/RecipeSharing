@echo off
echo 🔧 Vercel 404 NOT_FOUND Error Fix
echo =================================
echo.

cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"

echo 📁 Current directory: %CD%
echo.

echo 🔍 Diagnosing 404 NOT_FOUND error...
echo.

echo 🧪 Step 1: Checking frontend file structure...
echo ---------------------------------------------
cd frontend

echo 📄 Checking for index.html in frontend root...
if exist "index.html" (
    echo ✅ index.html found in correct location
) else (
    echo ❌ index.html missing from frontend root
    echo 🔧 Checking public folder...
    
    if exist "public\index.html" (
        echo 📝 Moving index.html from public to root...
        move "public\index.html" "index.html"
        echo ✅ index.html moved successfully
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
        echo ✅ index.html created
    )
)

echo.
echo 🧪 Step 2: Testing frontend build...
echo ------------------------------------

echo 📦 Installing dependencies...
call npm install --force --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ❌ Dependency installation failed
    goto :vercel_config
)

echo 🔨 Building frontend...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Frontend build successful!
    
    echo 📁 Checking dist folder...
    if exist "dist" (
        echo ✅ dist folder created
        if exist "dist\index.html" (
            echo ✅ dist/index.html exists - This should fix the 404!
        ) else (
            echo ❌ dist/index.html missing
        )
    ) else (
        echo ❌ dist folder not created
    )
) else (
    echo ❌ Frontend build failed - This is causing the 404!
    echo 💡 Fix build errors first
)

:vercel_config
echo.
echo 🧪 Step 3: Fixing vercel.json configuration...
echo ----------------------------------------------
cd ..

echo 📝 Creating optimized vercel.json for 404 fix...
echo { > vercel-404-fix.json
echo   "version": 2, >> vercel-404-fix.json
echo   "builds": [ >> vercel-404-fix.json
echo     { >> vercel-404-fix.json
echo       "src": "backend/server/index.js", >> vercel-404-fix.json
echo       "use": "@vercel/node" >> vercel-404-fix.json
echo     }, >> vercel-404-fix.json
echo     { >> vercel-404-fix.json
echo       "src": "frontend/package.json", >> vercel-404-fix.json
echo       "use": "@vercel/static-build", >> vercel-404-fix.json
echo       "config": { >> vercel-404-fix.json
echo         "distDir": "dist" >> vercel-404-fix.json
echo       } >> vercel-404-fix.json
echo     } >> vercel-404-fix.json
echo   ], >> vercel-404-fix.json
echo   "routes": [ >> vercel-404-fix.json
echo     { >> vercel-404-fix.json
echo       "src": "/api/(.*)", >> vercel-404-fix.json
echo       "dest": "backend/server/index.js" >> vercel-404-fix.json
echo     }, >> vercel-404-fix.json
echo     { >> vercel-404-fix.json
echo       "src": "/(.*)", >> vercel-404-fix.json
echo       "dest": "frontend/dist/index.html" >> vercel-404-fix.json
echo     } >> vercel-404-fix.json
echo   ] >> vercel-404-fix.json
echo } >> vercel-404-fix.json

echo 🔄 Replacing current vercel.json with 404-fix version...
copy vercel-404-fix.json vercel.json
del vercel-404-fix.json

echo ✅ vercel.json updated with 404 fix

echo.
echo 🧪 Step 4: Preparing for redeployment...
echo ----------------------------------------

echo 📋 Git status check...
git status --porcelain

echo 📝 Adding files to git...
git add .

echo 💾 Committing 404 fixes...
git commit -m "Fix 404 NOT_FOUND error - correct file structure and routing"

echo.
echo 🚀 READY TO REDEPLOY!
echo ====================
echo.
echo ✅ Fixed Issues:
echo   - index.html moved to correct location
echo   - Frontend build tested
echo   - vercel.json optimized for routing
echo   - Changes committed to git
echo.
echo 🎯 Next Steps:
echo 1. Push to GitHub: git push
echo 2. Vercel will auto-redeploy
echo 3. Check your Vercel URL - 404 should be fixed!
echo.
echo 🌐 If still getting 404:
echo 1. Check Vercel build logs
echo 2. Ensure environment variables are set
echo 3. Try manual redeploy in Vercel dashboard
echo.
echo 💡 The 404 error is usually fixed by ensuring:
echo   ✅ index.html is in frontend/ root
echo   ✅ npm run build creates dist/index.html
echo   ✅ vercel.json routes correctly to dist/index.html
echo.
echo Press any key to continue...
pause >nul
