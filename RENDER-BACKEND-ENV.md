# 🎯 RENDER BACKEND ENVIRONMENT VARIABLES

## 🚨 CRITICAL: Set These in Your Render Backend Service

**Go to: https://dashboard.render.com → recipesharing-3 (backend) → Settings → Environment Variables**

### Required Environment Variables:

```
MONGODB_URI=mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing
JWT_SECRET=RecipeSharing-JWT-Secret-Key-2025-SuperSecure-Random-String-12345
NODE_ENV=production
PORT=10000
CLIENT_URL=https://recipesharing-3-frontend.onrender.com
```

## 🔧 What Each Variable Does:

- **MONGODB_URI**: Database connection string
- **JWT_SECRET**: Secret key for authentication tokens
- **NODE_ENV**: Sets environment to production
- **PORT**: Port number (Render uses 10000 by default)
- **CLIENT_URL**: Frontend URL for CORS configuration

## 🚀 After Setting Environment Variables:

1. **Save Changes** in Render dashboard
2. **Backend will automatically redeploy** (2-3 minutes)
3. **CORS errors should be resolved**

## 🔍 How to Verify:

1. Wait for backend redeploy
2. Try login at: https://recipesharing-3-frontend.onrender.com
3. Check browser console - should see successful API calls
4. No more CORS errors!

## 📋 Current Status:

✅ **Frontend**: Correctly configured, using production backend URL  
✅ **Backend Code**: CORS configuration updated to allow frontend  
🔄 **Backend Deploy**: Environment variables need to be set in Render  

---

**Once you set CLIENT_URL in Render, your app should work perfectly! 🎉**
