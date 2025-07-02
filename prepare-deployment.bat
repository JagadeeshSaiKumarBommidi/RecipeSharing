@echo off
echo 🚀 Vercel Deployment Preparation Script
echo ======================================
echo.

cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"

echo 📁 Current directory: %CD%
echo.

echo 🔍 Step 1: Checking if Git is initialized...
if not exist ".git" (
    echo 📝 Initializing Git repository...
    git init
    echo ✅ Git initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 🔍 Step 2: Checking project structure for deployment...
if not exist "vercel.json" (
    echo ❌ vercel.json not found
) else (
    echo ✅ vercel.json found
)

if not exist "frontend\index.html" (
    echo ❌ frontend\index.html missing
) else (
    echo ✅ frontend\index.html found
)

if not exist "backend\server\index.js" (
    echo ❌ backend\server\index.js missing
) else (
    echo ✅ backend\server\index.js found
)

echo.
echo 🔍 Step 3: Checking for environment files...
if not exist "backend\.env.example" (
    echo 📝 Creating backend\.env.example...
    echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipesharing > backend\.env.example
    echo JWT_SECRET=your-super-secret-jwt-key >> backend\.env.example
    echo PORT=5000 >> backend\.env.example
    echo HOST=0.0.0.0 >> backend\.env.example
    echo CLIENT_URL=https://your-app.vercel.app >> backend\.env.example
    echo NODE_ENV=production >> backend\.env.example
    echo ✅ Created backend\.env.example
) else (
    echo ✅ backend\.env.example exists
)

if not exist "frontend\.env.example" (
    echo 📝 Creating frontend\.env.example...
    echo VITE_API_URL=https://your-app.vercel.app/api > frontend\.env.example
    echo VITE_SOCKET_URL=https://your-app.vercel.app >> frontend\.env.example
    echo ✅ Created frontend\.env.example
) else (
    echo ✅ frontend\.env.example exists
)

echo.
echo 🔍 Step 4: Creating deployment documentation...
if not exist "DEPLOYMENT.md" (
    echo 📝 Creating DEPLOYMENT.md...
    echo # Deployment Information > DEPLOYMENT.md
    echo. >> DEPLOYMENT.md
    echo This app is configured for Vercel deployment. >> DEPLOYMENT.md
    echo See VERCEL-DEPLOYMENT.md for complete instructions. >> DEPLOYMENT.md
    echo ✅ Created DEPLOYMENT.md
)

echo.
echo 🔍 Step 5: Testing build process...
echo 📦 Testing frontend build...
cd frontend
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Frontend builds successfully!
) else (
    echo ❌ Frontend build failed
    echo 💡 Fix build errors before deploying
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ Pre-deployment checks complete!
echo.
echo 📋 Next Steps:
echo 1. Create GitHub repository at https://github.com
echo 2. Push your code:
echo    git add .
echo    git commit -m "Ready for deployment"
echo    git remote add origin https://github.com/YOUR_USERNAME/recipe-sharing-app.git
echo    git push -u origin main
echo.
echo 3. Deploy to Vercel:
echo    - Go to https://vercel.com
echo    - Import your GitHub repository
echo    - Add environment variables (see VERCEL-DEPLOYMENT.md)
echo    - Deploy!
echo.
echo 4. Your app will be globally accessible at:
echo    https://your-app-name.vercel.app
echo.
echo 🌍 Global Access Features:
echo ✅ Accessible from any device worldwide
echo ✅ Works on mobile, tablet, desktop
echo ✅ Secure HTTPS by default
echo ✅ Fast loading with CDN
echo ✅ Share URL with anyone
echo.
echo 📖 Read VERCEL-DEPLOYMENT.md for detailed instructions
echo.
echo Press any key to continue...
pause >nul
