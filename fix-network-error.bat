@echo off
echo.
echo ================================================
echo   Network Error Fix - Backend Accessibility
echo ================================================
echo.

echo The "Network error" occurs because your backend is only accessible 
echo from localhost. Other systems can't reach localhost:5000 on your computer.
echo.

echo Solutions:
echo.
echo 1. QUICK FIX - Make your backend accessible on your network:
echo    - Update server to listen on all interfaces (0.0.0.0)
echo    - Allow port 5000 through Windows Firewall
echo    - Share your IP address with other systems
echo.
echo 2. PROPER FIX - Deploy backend to cloud:
echo    - Deploy to Heroku, Railway, or Vercel
echo    - Update frontend to use the deployed backend URL
echo.

set /p choice="Choose solution (1 for Quick Fix, 2 for Cloud Deployment): "

if "%choice%"=="1" goto :quickfix
if "%choice%"=="2" goto :cloudfix

:quickfix
echo.
echo ================================================
echo   Quick Fix - Network Accessible Backend
echo ================================================
echo.

echo Step 1: Finding your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set ip=%%a
    goto :found
)
:found
set ip=%ip: =%
echo Your IP address: %ip%

echo.
echo Step 2: Configuring Windows Firewall...
echo Adding firewall rule for port 5000...
netsh advfirewall firewall add rule name="RecipeSharing Backend" dir=in action=allow protocol=TCP localport=5000 >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Firewall rule added successfully
) else (
    echo ⚠️  Run this script as Administrator to add firewall rule
)

echo.
echo Step 3: Starting backend on all interfaces...
echo Your backend will be accessible at: http://%ip%:5000
echo Other systems can access it using this URL
echo.

cd /d "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing"

echo Starting server...
start "RecipeSharing Backend - Network Accessible" cmd /k "set HOST=0.0.0.0 && npm run server"

echo.
echo ✅ Backend starting on all network interfaces
echo.
echo Share this URL with other systems:
echo Frontend: http://%ip%:5173
echo Backend API: http://%ip%:5000
echo Health Check: http://%ip%:5000/api/health
echo.

timeout 3 >nul
echo Starting frontend...
start "RecipeSharing Frontend" cmd /k "npm run client"

echo.
echo ⚠️  Important Notes:
echo - Other systems must be on the same network
echo - Firewall must allow port 5000 and 5173
echo - Antivirus might block connections
echo.
goto :end

:cloudfix
echo.
echo ================================================
echo   Cloud Deployment Guide
echo ================================================
echo.
echo For permanent solution, deploy your backend to cloud:
echo.
echo Option 1: Heroku (Recommended)
echo 1. Create account: https://heroku.com
echo 2. Install Heroku CLI
echo 3. Run: heroku create your-app-name
echo 4. Set environment variables
echo 5. Deploy: git push heroku main
echo.
echo Option 2: Railway (Modern)
echo 1. Create account: https://railway.app
echo 2. Connect GitHub repository
echo 3. Set environment variables
echo 4. Auto-deploy
echo.
echo Option 3: Vercel (Serverless)
echo 1. Create account: https://vercel.com
echo 2. Import project
echo 3. Configure as Node.js app
echo.
echo After deployment:
echo 1. Get your backend URL
echo 2. Update frontend environment variables
echo 3. Redeploy frontend
echo.
echo Detailed guide: See DEPLOYMENT.md file
echo.

:end
pause
