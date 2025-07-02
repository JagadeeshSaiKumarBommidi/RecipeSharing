@echo off
echo 🚨 FRONTEND 502 ERROR - EMERGENCY DIAGNOSIS
echo ==========================================
echo.
echo 🔍 ISSUE: Frontend service returning 502 Bad Gateway
echo 📋 CAUSE: Frontend deployment failed or service crashed
echo.
echo 🎯 IMMEDIATE ACTIONS:
echo --------------------
echo.
echo 1. CHECK RENDER FRONTEND SERVICE STATUS:
echo   - Go to: https://dashboard.render.com
echo   - Click: recipesharing-3-frontend
echo   - Check: Deploy status (should show "Live" in green)
echo   - If failed: Look at build logs for errors
echo.
echo 2. COMMON CAUSES OF 502 ERRORS:
echo   - Build failed during deployment
echo   - Static site misconfigured as Web Service
echo   - Build command failed
echo   - Publish directory wrong
echo.
echo 3. QUICK FIXES TO TRY:
echo   a) Manual Redeploy:
echo      - Click "Manual Deploy" button
echo      - Wait 3-5 minutes
echo.
echo   b) Check Service Type:
echo      - Should be "Static Site" (NOT Web Service)
echo      - If Web Service: Delete and recreate as Static Site
echo.
echo   c) Verify Configuration:
echo      - Build Command: cd frontend ^&^& npm install ^&^& npm run build
echo      - Publish Directory: frontend/dist
echo.
echo 4. CHECK BUILD LOGS:
echo   - In Render dashboard, click on latest deploy
echo   - Look for build errors
echo   - Common issues: "vite not found", "dist folder missing"
echo.
echo 🚀 MOST LIKELY FIX:
echo ------------------
echo Your frontend is probably still configured as Web Service
echo instead of Static Site. This causes 502 errors.
echo.
echo SOLUTION:
echo 1. Delete current frontend service
echo 2. Create New → Static Site
echo 3. Configure:
echo    - Build: cd frontend ^&^& npm install ^&^& npm run build
echo    - Publish: frontend/dist
echo.
echo ⏱️ EXPECTED RESULT:
echo ------------------
echo After fixing service type and redeploying:
echo ✅ Frontend loads properly
echo ✅ No more 502 errors
echo ✅ Ready to test login functionality
echo.
echo 📞 NEED HELP?
echo ------------
echo Check the build logs in Render dashboard first.
echo Look for specific error messages.
echo.
pause
