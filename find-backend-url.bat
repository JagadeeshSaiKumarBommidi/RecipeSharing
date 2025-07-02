@echo off
echo 🔍 BACKEND URL FINDER - RENDER DEPLOYMENT
echo ==========================================
echo.
echo 🚨 PROBLEM: Frontend tries to connect to localhost:5000
echo 📍 SOLUTION: Update .env.production with correct backend URL
echo.
echo 🎯 STEP 1: Find Your Backend Service
echo ----------------------------------
echo 1. Go to: https://dashboard.render.com
echo 2. Look for a service with:
echo    - Type: Web Service
echo    - Name: Something like "recipesharing-backend" or "recipe-sharing-backend"
echo    - Build Command: cd backend && npm install
echo    - Start Command: cd backend && npm start
echo.
echo 🎯 STEP 2: Get Backend URL
echo -------------------------
echo 1. Click on your backend service
echo 2. Copy the URL (looks like: https://your-backend-name.onrender.com)
echo.
echo 🎯 STEP 3: Update Environment File
echo ---------------------------------
echo 1. Edit: frontend\.env.production
echo 2. Change VITE_API_URL to: https://YOUR-BACKEND-URL.onrender.com/api
echo 3. Change VITE_SOCKET_URL to: https://YOUR-BACKEND-URL.onrender.com
echo.
echo 📝 EXAMPLE:
echo ----------
echo If your backend URL is: https://recipesharing-backend-abc123.onrender.com
echo Then set:
echo VITE_API_URL=https://recipesharing-backend-abc123.onrender.com/api
echo VITE_SOCKET_URL=https://recipesharing-backend-abc123.onrender.com
echo.
echo 🚀 STEP 4: Redeploy Frontend
echo ---------------------------
echo 1. git add .
echo 2. git commit -m "Fix backend URL for production"
echo 3. git push
echo 4. Frontend will auto-redeploy with correct backend URL
echo.
echo ❌ NO BACKEND SERVICE YET?
echo ========================
echo If you don't have a backend service on Render:
echo 1. Create New → Web Service
echo 2. Connect GitHub repository
echo 3. Configure:
echo    - Build Command: cd backend && npm install
echo    - Start Command: cd backend && npm start
echo    - Environment Variables: (see RENDER-DEPLOYMENT.md)
echo.
echo 🌍 AFTER FIX: Frontend will connect to deployed backend!
echo.
pause
