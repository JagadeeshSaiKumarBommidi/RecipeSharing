# 🔧 Frontend CORS Error - Backend Connection Fix

## 🚨 Current Issue

**Error**: `Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'https://recipesharing-3-frontend.onrender.com' has been blocked by CORS policy`

**Root Cause**: Your frontend is deployed and working, but it's trying to connect to `localhost:5000` instead of your deployed backend.

## ✅ SOLUTION STEPS

### Step 1: Check Your Backend Service

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Look for your backend service** - it should be:
   - **Type**: Web Service (NOT Static Site)
   - **Name**: Something like `recipesharing-backend`
   - **Build**: `cd backend && npm install`
   - **Start**: `cd backend && npm start`

### Step 2: Get Your Backend URL

1. **Click on your backend service**
2. **Copy the service URL** (e.g., `https://recipesharing-backend-xyz123.onrender.com`)

### Step 3: Update Frontend Environment

**I've created `frontend/.env.production` with a placeholder URL.**

**You need to update it with your actual backend URL:**

```bash
# In frontend/.env.production
VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
VITE_SOCKET_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com
NODE_ENV=production
```

### Step 4: Commit and Deploy

```bash
git add .
git commit -m "Fix backend URL for production deployment"
git push
```

## 🚀 If You Don't Have a Backend Service Yet

### Create Backend Service on Render:

1. **Create New → Web Service**
2. **Connect your GitHub repository**
3. **Configure exactly**:
   ```
   Name: recipesharing-backend
   Branch: main
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```
4. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing
   JWT_SECRET=RecipeSharing-JWT-Secret-Key-2025-SuperSecure-Random-String-12345
   NODE_ENV=production
   PORT=10000
   CLIENT_URL=https://recipesharing-3-frontend.onrender.com
   ```

## 🎯 Expected Result

After fixing the backend URL:
- ✅ Frontend connects to deployed backend (not localhost)
- ✅ No more CORS errors
- ✅ Authentication works globally
- ✅ All API calls work properly

## 🔍 How to Verify Fix

1. **Open browser dev tools** on your deployed frontend
2. **Go to Network tab**
3. **Try to login/signup**
4. **Check requests go to**: `https://your-backend.onrender.com/api/*` (NOT localhost)

## 📋 Common Backend URLs on Render

Your backend URL will look like one of these:
- `https://recipesharing-backend.onrender.com`
- `https://recipe-sharing-backend-abc123.onrender.com`
- `https://recipesharing-backend-xyz789.onrender.com`

The exact URL depends on your service name and Render's naming.

---

**🎉 After this fix, your full-stack app will work perfectly worldwide!**
