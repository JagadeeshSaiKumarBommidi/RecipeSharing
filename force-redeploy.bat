@echo off
echo 🚨 EMERGENCY: Force Rebuild and Redeploy
echo ==========================================
echo.
echo 🔍 ISSUE: Old build still has localhost URLs
echo 📋 SOLUTION: Force complete rebuild on Render
echo.
echo ⚡ STEP 1: Trigger Manual Redeploy
echo --------------------------------
echo 1. Go to: https://dashboard.render.com
echo 2. Click on: recipesharing-3-frontend
echo 3. Click: "Manual Deploy" button (top right)
echo 4. Select: "Deploy latest commit"
echo 5. Wait 3-5 minutes for complete rebuild
echo.
echo 🎯 STEP 2: Clear Browser Cache
echo -----------------------------
echo 1. Open your app: https://recipesharing-3-frontend.onrender.com
echo 2. Press: Ctrl + Shift + R (hard refresh)
echo 3. Or: F12 → Application → Storage → Clear Storage
echo.
echo 🔍 STEP 3: Verify Fix
echo --------------------
echo 1. Open: https://recipesharing-3-frontend.onrender.com
echo 2. Press: F12 (Dev Tools) → Console tab
echo 3. Look for: "API_BASE_URL: https://recipesharing-3.onrender.com"
echo 4. Should NOT see: "localhost:5000" anywhere
echo.
echo 💡 WHY THIS HAPPENS:
echo -------------------
echo Sometimes Render caches the old build
echo The JavaScript bundle still contains old localhost URLs
echo Manual redeploy forces a complete rebuild
echo.
echo 🚀 WHAT I'VE FIXED:
echo ------------------
echo ✅ Enhanced hostname detection
echo ✅ Force production URLs on Render
echo ✅ Better error handling
echo ✅ Additional debug logging
echo.
echo 🎯 AFTER MANUAL REDEPLOY:
echo ------------------------
echo Console should show:
echo - isRenderProduction: true
echo - API_BASE_URL: https://recipesharing-3.onrender.com
echo - All requests go to production backend
echo.
echo ❌ STILL NOT WORKING?
echo --------------------
echo If manual redeploy doesn't work, I can:
echo 1. Set environment variables in Render dashboard
echo 2. Create a completely hardcoded version
echo 3. Use a different deployment strategy
echo.
echo 🌍 EXPECTED RESULT:
echo ------------------
echo After manual redeploy + hard refresh:
echo ✅ No more localhost requests
echo ✅ No CORS errors
echo ✅ App works globally
echo.
pause
