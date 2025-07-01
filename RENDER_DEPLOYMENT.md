# Render Deployment Configuration for RecipeShare
# This file contains all the settings needed for Render deployment

# ===========================================
# BACKEND DEPLOYMENT (Node.js Service)
# ===========================================

# Build Command: npm install
# Start Command: npm start
# Environment: Node
# Root Directory: . (project root)
# Entry Point: server/index.js

# Environment Variables to set in Render Dashboard:
# NODE_ENV=production
# PORT=10000 (Render default, will be auto-assigned)
# MONGODB_URI=your_mongodb_atlas_connection_string
# JWT_SECRET=your_jwt_secret_key
# CLIENT_URL=https://your-frontend-url.onrender.com

# ===========================================
# FRONTEND DEPLOYMENT (Static Site)
# ===========================================

# Build Command: npm run build
# Publish Directory: dist
# Environment: Static Site
# Root Directory: . (project root)

# Environment Variables for Frontend:
# VITE_API_URL=https://your-backend-url.onrender.com
# VITE_SOCKET_URL=https://your-backend-url.onrender.com

# ===========================================
# FILES NEEDED FOR DEPLOYMENT
# ===========================================

# 1. package.json (with proper scripts)
# 2. render.yaml (optional, for infrastructure as code)
# 3. .env.example (for reference)
# 4. netlify.toml (already exists, but render.yaml is preferred)
# 5. Dockerfile (optional, for Docker deployment)
