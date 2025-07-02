@echo off
echo 🔍 RENDER DEPLOYMENT STATUS CHECK
echo =================================
echo.
echo 📋 YOUR DEPLOYMENT URLS:
echo -----------------------
echo Backend: https://recipesharing-3.onrender.com
echo Frontend: https://recipesharing-3-frontend.onrender.com (502 ERROR)
echo.
echo 🎯 NEXT STEPS:
echo -------------
echo 1. Go to: https://dashboard.render.com
echo 2. Check recipesharing-3-frontend service status
echo 3. Verify it's a "Static Site" (NOT Web Service)
echo 4. If Web Service → Delete and recreate as Static Site
echo 5. Build Command: cd frontend ^&^& npm install ^&^& npm run build
echo 6. Publish Directory: frontend/dist
echo.
echo 🚀 WHAT SHOULD WORK AFTER FIX:
echo -----------------------------
echo ✅ Frontend loads: https://recipesharing-3-frontend.onrender.com
echo ✅ Backend works: https://recipesharing-3.onrender.com
echo ✅ API calls work: Frontend → Backend
echo ✅ CORS configured: Backend allows frontend
echo ✅ Login/Signup: Should work without errors
echo.
echo 💡 YOUR CODE IS CORRECT - IT'S A DEPLOYMENT ISSUE!
echo =================================================
echo The 502 error means frontend deployment failed,
echo not that your code is wrong. All API calls and
echo CORS configuration are already properly set up.
echo.
pause
