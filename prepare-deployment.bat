@echo off
echo.
echo ================================================
echo   RecipeSharing - Deployment Preparation
echo ================================================
echo.

cd /d "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"

echo Step 1: Building frontend for production...
npm run build:frontend
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
echo ✅ Frontend built successfully

echo.
echo Step 2: Testing backend configuration...
npm run test-server
if %errorlevel% neq 0 (
    echo ❌ Backend configuration test failed
    pause
    exit /b 1
)
echo ✅ Backend configuration valid

echo.
echo Step 3: Creating deployment checklist...
echo.
echo ================================================
echo   Deployment Checklist
echo ================================================
echo.
echo Backend Deployment (Choose one):
echo □ Deploy to Heroku: https://heroku.com
echo □ Deploy to Railway: https://railway.app  
echo □ Deploy to Vercel: https://vercel.com
echo.
echo Frontend Deployment:
echo □ Deploy to Netlify: https://netlify.com
echo □ Build folder ready: dist/
echo.
echo Environment Variables:
echo □ Backend: MONGODB_URI, JWT_SECRET, CLIENT_URL
echo □ Frontend: VITE_API_URL, VITE_SOCKET_URL
echo.
echo Configuration Files:
echo ✅ netlify.toml created
echo ✅ DEPLOYMENT.md guide created
echo ✅ API configuration created
echo.
echo Next Steps:
echo 1. Deploy backend first (get URL)
echo 2. Update frontend environment variables
echo 3. Deploy frontend to Netlify
echo 4. Test the deployed application
echo.
echo Files ready for deployment:
echo - Frontend: dist/ folder
echo - Backend: entire project
echo - Config: netlify.toml, package.json
echo.

pause
