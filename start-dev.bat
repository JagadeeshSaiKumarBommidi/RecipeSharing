@echo off
echo 🚀 Starting RecipeShare Development Environment...
echo.

echo 📦 Installing dependencies...
call npm install
if errorlevel 1 goto error

echo.
echo 🌱 Seeding challenge data...
cd server
call node seeds/seedChallenges.js
if errorlevel 1 goto error
cd ..

echo.
echo 🎯 Starting development servers concurrently...
echo   - Backend Server (nodemon server/index.js)
echo   - Frontend Dev Server (vite)
echo.

call npm run dev

goto end

:error
echo ❌ Error occurred during setup!
pause
exit /b 1

:end
echo.
echo ✅ Development environment started successfully!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:5000
echo.
pause
