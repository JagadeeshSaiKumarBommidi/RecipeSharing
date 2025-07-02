#!/bin/bash
echo "🚀 Render Deployment Script"
echo "=========================="

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install and build frontend
echo "🎨 Building frontend..."
cd frontend
npm install
npm run build

echo "✅ Frontend build complete!"
echo "📁 Built files are in frontend/dist/"

# Check if build was successful
if [ -f "dist/index.html" ]; then
    echo "✅ Build successful - index.html created"
else
    echo "❌ Build failed - index.html not found"
    exit 1
fi
