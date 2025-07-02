@echo off
echo 🚨 CRITICAL: Environment Variables Not Loading
echo ============================================
echo.
echo 🔍 ISSUE: Frontend still connects to localhost:5000
echo 📋 ROOT CAUSE: .env.production not being read during Render build
echo.
echo ✅ SOLUTION: Set Environment Variables in Render Dashboard
echo =========================================================
echo.
echo 🎯 STEP 1: Go to Render Dashboard
echo --------------------------------
echo 1. Go to: https://dashboard.render.com
echo 2. Click on: recipesharing-3-frontend (your frontend service)
echo 3. Click on: Settings (left sidebar)
echo 4. Scroll to: Environment Variables section
echo.
echo 🎯 STEP 2: Add These Environment Variables
echo -----------------------------------------
echo Click "Add Environment Variable" and add each of these:
echo.
echo Variable 1:
echo   Key: VITE_API_URL
echo   Value: https://recipesharing-3.onrender.com/api
echo.
echo Variable 2:
echo   Key: VITE_SOCKET_URL  
echo   Value: https://recipesharing-3.onrender.com
echo.
echo Variable 3:
echo   Key: NODE_ENV
echo   Value: production
echo.
echo 🎯 STEP 3: Save and Redeploy
echo ---------------------------
echo 1. Click "Save Changes"
echo 2. Render will automatically redeploy
echo 3. Wait 2-3 minutes for deployment
echo.
echo 🔍 STEP 4: Verify Fix
echo --------------------
echo 1. Open: https://recipesharing-3-frontend.onrender.com
echo 2. Press F12 (Dev Tools) → Console tab
echo 3. Look for: "API_BASE_URL: https://recipesharing-3.onrender.com"
echo 4. Try login - should work without CORS errors
echo.
echo 💡 WHY THIS WORKS:
echo -----------------
echo Render environment variables override .env files
echo This ensures variables are available during build process
echo More secure than committing .env files to git
echo.
echo ⚡ ALTERNATIVE QUICK FIX:
echo -----------------------
echo If environment variables don't work, I can hardcode the URLs
echo in the source code as a temporary solution.
echo.
echo 🎉 EXPECTED RESULT:
echo ------------------
echo After adding environment variables:
echo ✅ No more localhost:5000 requests
echo ✅ Requests go to recipesharing-3.onrender.com
echo ✅ No CORS errors
echo ✅ App works perfectly worldwide
echo.
echo 📞 NEED HELP?
echo ------------
echo If this doesn't work, let me know and I'll hardcode the URLs
echo as a guaranteed fix.
echo.
pause
