# 🔧 Vercel Deployment Troubleshooting Guide

## 🚨 Common Error Solutions

### 1. FUNCTION_INVOCATION_FAILED (500)
**Problem**: Your backend function is crashing
**Solutions**:
```bash
# Check your backend code for errors
cd backend
npm install
npm start  # Test locally first

# Common fixes:
# - Ensure all environment variables are set in Vercel dashboard
# - Check MongoDB connection string
# - Verify all dependencies are in package.json
```

### 2. DEPLOYMENT_NOT_READY_REDIRECTING (303)
**Problem**: Deployment is still building
**Solution**: Wait for deployment to complete, then refresh

### 3. NOT_FOUND (404)
**Problem**: Routes not configured correctly
**Solution**: Check your vercel.json routing configuration

### 4. FUNCTION_INVOCATION_TIMEOUT (504)
**Problem**: Function taking too long to respond
**Solutions**:
- Optimize database queries
- Check MongoDB connection speed
- Reduce function complexity

### 5. BUILD ERRORS
**Problem**: Frontend or backend build failing
**Solutions**:
```bash
# Test builds locally first
cd frontend
npm install
npm run build  # Should succeed without errors

cd ../backend
npm install
node server/index.js  # Should start without errors
```

## 🛠️ Pre-Deployment Checklist

Run this checklist before deploying:

### ✅ Frontend Checklist:
- [ ] `index.html` exists in `frontend/` root directory
- [ ] `npm run build` works locally
- [ ] All dependencies in `package.json`
- [ ] No TypeScript/ESLint errors

### ✅ Backend Checklist:
- [ ] `server/index.js` exists and starts locally
- [ ] All dependencies in `package.json`
- [ ] Environment variables defined
- [ ] MongoDB connection works

### ✅ Configuration Checklist:
- [ ] `vercel.json` has correct build and route configuration
- [ ] No conflicting `builds` and `functions` properties
- [ ] Environment variables added to Vercel dashboard

## 🔍 Debug Your Deployment

### Step 1: Test Locally
```bash
# Frontend
cd frontend
npm install --force
npm run build
npm run preview  # Test production build

# Backend
cd ../backend
npm install
npm start  # Should start on port 5000
```

### Step 2: Check Vercel Logs
1. Go to Vercel Dashboard
2. Click your project
3. Go to "Functions" tab
4. Click on a function to see logs
5. Look for error messages

### Step 3: Verify Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secure random string
- `CLIENT_URL` - Your Vercel app URL
- `NODE_ENV` - "production"

## 🚀 Quick Fix Commands

If deployment fails, try these:

```bash
# 1. Clean reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install --force

cd ../backend
rm -rf node_modules package-lock.json
npm install

# 2. Test build process
cd ../frontend
npm run build

# 3. Commit and redeploy
git add .
git commit -m "Fix deployment issues"
git push
```

## 📱 Alternative: Simplified vercel.json

If you're still having issues, try this minimal configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/index.html"
    }
  ]
}
```

## 🚨 URGENT: 404 NOT_FOUND Error Fix

### ❌ Error: `404: NOT_FOUND` - `Code: NOT_FOUND`

**This is the most common Vercel deployment error!**

**Problem**: Vercel can't find your frontend files or they're in the wrong location.

**Immediate Solutions**:

#### 🔧 Solution 1: Fix File Structure (Most Common)
```bash
# Check if index.html is in the correct location
cd frontend
dir  # Should show index.html in the root of frontend folder

# If index.html is missing or in wrong place:
# Move it from public to root
move public\index.html index.html
```

#### 🔧 Solution 2: Fix vercel.json Routing
Replace your current `vercel.json` with this working version:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server/index.js"
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))",
      "dest": "frontend/dist/$1"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/index.html"
    }
  ]
}
```

#### 🔧 Solution 3: Test Build Locally
```bash
cd frontend
npm install --force
npm run build

# Check if dist folder is created with files
dir dist
# Should show index.html and other files
```

#### 🔧 Solution 4: Emergency Fix - Simple Deployment
If still failing, try this minimal approach:

1. **Delete current vercel.json**
2. **Create new simple vercel.json**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "frontend/dist/index.html"
    }
  ]
}
```

### 🚀 Step-by-Step Fix Process:

1. **Run diagnostic first**:
   ```bash
   diagnose-deployment.bat
   ```

2. **Fix the file structure**:
   ```bash
   cd frontend
   # Ensure index.html is in frontend root
   # Ensure npm run build works
   ```

3. **Commit and redeploy**:
   ```bash
   git add .
   git commit -m "Fix 404 error - correct file structure"
   git push
   ```

### ✅ Success Check:
After fixing, your deployment should:
- ✅ Build without errors
- ✅ Show your React app (not 404)
- ✅ API routes work at /api/*

## 🆘 Emergency Fixes

### If Nothing Works:
1. **Create a new Vercel project**
2. **Use manual deployment**:
   ```bash
   npm install -g vercel
   vercel  # Follow prompts
   ```

3. **Try deploying just frontend first**:
   ```bash
   cd frontend
   vercel  # Deploy frontend only
   ```

4. **Then add backend separately**

## 🎯 Success Indicators

Your deployment is successful when:
- ✅ Build logs show no errors
- ✅ Frontend loads at your Vercel URL
- ✅ API endpoints respond (check /api/health or similar)
- ✅ Database connections work
- ✅ No 500/404 errors

## 📞 Need Help?

1. **Check build logs** in Vercel dashboard
2. **Test everything locally** before deploying
3. **Verify environment variables** are correctly set
4. **Check MongoDB connection** from a tool like MongoDB Compass

Remember: Most deployment failures are due to:
- Missing environment variables
- Build process failures
- Incorrect file paths
- Database connection issues

Fix these first and your deployment should succeed! 🚀
