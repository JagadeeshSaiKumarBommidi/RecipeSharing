@echo off
echo 🔥 CRITICAL FIX: Updating ALL hardcoded URLs
echo ============================================
echo.
echo 📋 ISSUE: Multiple components have hardcoded localhost:5000
echo ✅ SOLUTION: Manual fix of each component
echo.
echo 🎯 FILES TO MANUALLY UPDATE:
echo ---------------------------
echo.
echo 1. AuthPage.tsx - ✅ FIXED
echo    - Added API_ENDPOINTS import
echo    - Replaced hardcoded URL with API_ENDPOINTS.AUTH.LOGIN/SIGNUP
echo.
echo 2. Chat.tsx - ✅ FIXED
echo    - Added SOCKET_URL_CONFIG import
echo    - Fixed socket connection URL
echo    - Fixed all fetch URLs to use API_ENDPOINTS
echo.
echo 3. CreateRecipe.tsx - ❌ NEEDS FIXING
echo    - Line 116: http://localhost:5000/api/recipes
echo    - Should use: API_ENDPOINTS.RECIPES.CREATE
echo.
echo 4. Feed.tsx - ❌ NEEDS FIXING (Multiple URLs)
echo    - Line 140: /api/recipes/feed
echo    - Line 159: /api/stories/feed
echo    - Line 176: /api/challenges/current
echo    - Line 193: /api/users/suggestions/new
echo    - Line 204: /api/recipes/user/
echo    - Line 233: /api/recipes/user/
echo    - Line 248: /api/users/profile
echo    - Line 272: /api/recipes/saved
echo    - Line 291: /api/recipes/liked
echo    - Line 311: /api/recipes/saved
echo    - Line 331: /api/users/followers-list
echo    - Line 351: /api/recipes/popular
echo.
echo 5. CreateStory.tsx - ❌ NEEDS FIXING
echo    - Line 200: http://localhost:5000/api/stories
echo.
echo ⚡ QUICK SOLUTION: Let me commit current fixes and push
echo ====================================================
echo I'll commit AuthPage.tsx and Chat.tsx fixes first,
echo then fix the remaining files in the next batch.
echo.
echo This will immediately fix the login/signup issue
echo which is the most critical problem.
echo.
echo 🚀 EXPECTED RESULT AFTER FIRST FIX:
echo ----------------------------------
echo ✅ Login/Signup will work (AuthPage fixed)
echo ✅ Chat will work (Chat fixed)
echo ❌ Some other features may still use localhost
echo   (will fix in next iteration)
echo.
pause
