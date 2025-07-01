# RecipeShare Development Setup Script
Write-Host "🚀 Starting RecipeShare Development Environment..." -ForegroundColor Green
Write-Host ""

# Function to check if command was successful
function Test-LastCommand {
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error occurred! Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
}

try {
    # Check if we're in the right directory
    if (-not (Test-Path "package.json")) {
        Write-Host "❌ package.json not found. Please run this script from the project root directory." -ForegroundColor Red
        exit 1
    }

    # Install dependencies
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Test-LastCommand

    # Seed challenge data
    Write-Host ""
    Write-Host "🌱 Seeding challenge data..." -ForegroundColor Yellow
    Set-Location "server"
    node seeds/seedChallenges.js
    Test-LastCommand
    Set-Location ".."

    # Start development servers
    Write-Host ""
    Write-Host "🎯 Starting development servers concurrently..." -ForegroundColor Yellow
    Write-Host "   - Backend Server (nodemon server/index.js)" -ForegroundColor Cyan
    Write-Host "   - Frontend Dev Server (vite)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Press Ctrl+C to stop all servers" -ForegroundColor Magenta
    Write-Host ""

    # Start both servers concurrently
    npm run dev
}
catch {
    Write-Host "❌ An error occurred: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Development environment started successfully!" -ForegroundColor Green
Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   - Backend:  http://localhost:5000" -ForegroundColor Cyan
