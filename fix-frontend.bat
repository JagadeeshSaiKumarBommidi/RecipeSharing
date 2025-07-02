@echo off
echo 🔧 Advanced npm cache and dependency fix...
echo.

cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing\frontend"

echo 🧹 Deep cleaning npm cache...
npm cache clean --force 2>nul
rmdir /s /q "%APPDATA%\npm-cache" 2>nul

echo 🔧 Resetting npm configuration globally...
cd /d C:\
npm config delete prefix 2>nul
npm config delete cache 2>nul
npm config set registry https://registry.npmjs.org/
npm config set cache C:\Users\bommi\AppData\Local\npm-cache

echo 🗑️ Removing corrupted files...
cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing\frontend"
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock

echo 📦 Trying npm install with --no-workspaces...
npm install --no-workspaces --registry https://registry.npmjs.org/

if %errorlevel% equ 0 (
    echo ✅ npm installation successful!
    echo 🚀 Starting frontend server...
    npm run dev
) else (
    echo ❌ npm failed. Trying alternative approaches...
    echo.
    
    echo 🔧 Attempting npm install with force and legacy peer deps...
    npm install --force --legacy-peer-deps --no-workspaces
    
    if %errorlevel% equ 0 (
        echo ✅ npm installation successful with force flags!
        echo 🚀 Starting frontend server...
        npm run dev
    ) else (
        echo 📦 Installing Yarn via npm...
        cd /d C:\
        npm install -g yarn --force 2>nul
        
        echo 🔄 Refreshing environment...
        call refreshenv 2>nul
        
        cd "c:\Users\bommi\OneDrive\Desktop\Java Fullstack Training\RecipeSharing\frontend"
        
        echo 🧪 Testing if Yarn is available...
        yarn --version >nul 2>&1
        
        if %errorlevel% equ 0 (
            echo ✅ Yarn is now available!
            echo 🔄 Installing dependencies with Yarn...
            yarn install
            
            if %errorlevel% equ 0 (
                echo ✅ Yarn installation successful!
                echo 🚀 Starting frontend server...
                yarn dev
            ) else (
                echo ❌ Yarn install failed.
                goto :manual_instructions
            )
        ) else (
            echo ❌ Yarn installation failed or not in PATH.
            goto :manual_instructions
        )
    )
)

goto :end

:manual_instructions
echo.
echo ❌ Automatic fixes failed. Here are manual solutions:
echo.
echo 🎯 OPTION 1 - Use npm (recommended):
echo 1. cd frontend
echo 2. npm install --force --legacy-peer-deps
echo 3. npm run dev
echo.
echo 🎯 OPTION 2 - Install Yarn manually:
echo 1. Download and install Node.js from https://nodejs.org
echo 2. Open new Command Prompt as Administrator
echo 3. Run: npm install -g yarn
echo 4. Close and reopen Command Prompt
echo 5. cd frontend
echo 6. yarn install
echo 7. yarn dev
echo.
echo 🎯 OPTION 3 - Use npx (no installation needed):
echo 1. cd frontend  
echo 2. npx yarn install
echo 3. npx yarn dev

:end

pause
