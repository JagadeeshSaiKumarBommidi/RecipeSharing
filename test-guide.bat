@echo off
echo 🚀 RecipeShare Development Server Status
echo ========================================
echo.
echo ✅ Frontend (Vite): http://localhost:5173/
echo ⏳ Backend (Express): Starting on port 5000...
echo.
echo 💡 Manual Testing Steps:
echo 1. Wait for "Connected to MongoDB" message
echo 2. Look for "Server running on 0.0.0.0:5000" message  
echo 3. Open browser to http://localhost:5173
echo 4. Test registration/login
echo 5. Test sidebar features (Load buttons)
echo 6. Test story creation (+ button)
echo.
echo 🔍 To test server connectivity, run:
echo    node test-server-connectivity.js
echo.
echo 📱 Key Features to Test:
echo    - Left sidebar: Stats, Liked, Saved, Followers
echo    - Story creation: Text, Photo, Video, Camera
echo    - Feed: Recipe display and interactions
echo    - Profile: User management
echo.
pause
