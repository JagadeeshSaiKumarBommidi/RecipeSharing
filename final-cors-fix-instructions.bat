@echo off
echo 🎯 FINAL CORS FIX - SET ENVIRONMENT VARIABLE
echo ============================================
echo.
echo 🔍 CURRENT STATUS:
echo -----------------
echo ✅ Frontend Working: https://recipesharing-xgnp.onrender.com
echo ✅ Backend Code: CORS updated with new frontend URL
echo ❌ Backend Environment: CLIENT_URL needs to be set in Render
echo.
echo 🚨 CRITICAL ACTION REQUIRED:
echo ---------------------------
echo.
echo 1. GO TO RENDER DASHBOARD:
echo   https://dashboard.render.com
echo.
echo 2. CLICK ON BACKEND SERVICE:
echo   recipesharing-3 (Web Service)
echo.
echo 3. GO TO SETTINGS:
echo   Click "Settings" in left sidebar
echo.
echo 4. SCROLL TO ENVIRONMENT VARIABLES:
echo   Look for "Environment Variables" section
echo.
echo 5. ADD/UPDATE THIS VARIABLE:
echo   Key: CLIENT_URL
echo   Value: https://recipesharing-xgnp.onrender.com
echo.
echo 6. SAVE CHANGES:
echo   Click "Save Changes" button
echo   Backend will automatically redeploy (2-3 minutes)
echo.
echo 💡 OTHER REQUIRED ENVIRONMENT VARIABLES:
echo ---------------------------------------
echo Make sure these are also set in Render:
echo.
echo MONGODB_URI=mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing
echo JWT_SECRET=RecipeSharing-JWT-Secret-Key-2025-SuperSecure-Random-String-12345
echo NODE_ENV=production
echo PORT=10000
echo CLIENT_URL=https://recipesharing-xgnp.onrender.com
echo.
echo ⏱️ EXPECTED TIMELINE:
echo --------------------
echo 1. Set CLIENT_URL environment variable: 1 minute
echo 2. Backend redeploys automatically: 2-3 minutes
echo 3. CORS error disappears: Immediately after redeploy
echo 4. Login/Signup works: Ready to test!
echo.
echo 🎉 AFTER SETTING ENVIRONMENT VARIABLE:
echo -------------------------------------
echo ✅ No more CORS errors
echo ✅ Login/Signup will work
echo ✅ All API calls will succeed
echo ✅ Your Recipe Sharing App will be fully functional!
echo.
echo 📞 VERIFICATION STEPS:
echo ---------------------
echo 1. Wait for backend redeploy (check Render dashboard)
echo 2. Go to: https://recipesharing-xgnp.onrender.com
echo 3. Try to login/signup
echo 4. Check browser console - should see successful API calls
echo 5. No CORS errors in console!
echo.
pause
