# RecipeShare - Render Deployment Guide
# ====================================

## 🚀 DEPLOYMENT TARGETS FOR RENDER

### 📋 **What You Need to Deploy:**

1. **Backend Service** (Node.js Web Service)
   - **Target File**: `server/index.js`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: Auto-assigned by Render (usually 10000)

2. **Frontend Service** (Static Site)
   - **Target Directory**: `dist/` (after build)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `./dist`

## 🔧 **STEP-BY-STEP DEPLOYMENT:**

### **Step 1: Prepare Your Repository**
```bash
# Build the frontend locally to test (creates dist/ folder)
npm run build

# Make sure all files are committed
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

**🚨 IMPORTANT:** The `dist/` folder is created by running `npm run build`. If you don't see it:
1. Run `build-frontend.bat` to build and troubleshoot
2. Or manually run `npm run build` 
3. The `dist/` folder should appear after successful build

### **Step 2: Deploy Backend Service**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `recipeshare-backend`
   - **Environment**: `Node`
   - **Root Directory**: `.` (leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or paid tier)

5. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing
   JWT_SECRET=RecipeSharing-JWT-Secret-Key-2025-SuperSecure-Random-String-12345-Production
   CLIENT_URL=https://YOUR_FRONTEND_URL.onrender.com
   HOST=0.0.0.0
   ```

6. Click "Create Web Service"
7. **Copy the backend URL** (e.g., `https://recipeshare-backend.onrender.com`)

### **Step 3: Deploy Frontend Service**
1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `recipeshare-frontend`
   - **Root Directory**: `.` (leave empty)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `./dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com
   VITE_SOCKET_URL=https://YOUR_BACKEND_URL.onrender.com
   VITE_NODE_ENV=production
   ```

5. Click "Create Static Site"
6. **Copy the frontend URL** (e.g., `https://recipeshare-frontend.onrender.com`)

### **Step 4: Update CORS Configuration**
1. Go back to your backend service
2. Update environment variables:
   - Set `CLIENT_URL` to your actual frontend URL
3. Backend will automatically redeploy

## 📱 **FINAL URLS:**
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`

## 🔍 **TROUBLESHOOTING:**

### **❌ "dist/ folder not found":**
The `dist/` folder is created when you build the frontend:
```bash
# Run this locally to create dist/ folder
npm run build

# Or use the helper script
build-frontend.bat
```
**Note:** You don't need to commit the `dist/` folder. Render will create it during deployment.

### **Common Issues:**
1. **Build Fails**: Check Node.js version compatibility
2. **CORS Errors**: Ensure CLIENT_URL is set correctly
3. **Database Connection**: Verify MONGODB_URI is correct
4. **API Not Found**: Check VITE_API_URL points to backend
5. **TypeScript Errors**: Fix any TS compilation errors before building

### **Render-Specific Notes:**
- ✅ Free tier services sleep after 15 minutes of inactivity
- ✅ First request after sleep takes ~30 seconds to wake up
- ✅ Use paid tier for production applications
- ✅ Render automatically uses HTTPS

## 🛠️ **Alternative: Single Deployment**

If you want to deploy as a single service (backend serves frontend):

1. Deploy only the backend service
2. Set build command: `npm install && npm run build`
3. Serve static files from Express (already configured in your server)
4. Use only one Render service

## 🎯 **QUICK DEPLOYMENT CHECKLIST:**

- [ ] Repository pushed to GitHub
- [ ] Backend service created on Render
- [ ] Environment variables set for backend
- [ ] Frontend service created on Render  
- [ ] Environment variables set for frontend
- [ ] CORS updated with actual URLs
- [ ] Test both services work

## 📞 **DEPLOYMENT COMMANDS:**

You don't need to run these locally, Render will run them:

**Backend Build**: `npm install`
**Backend Start**: `npm start`
**Frontend Build**: `npm run build`

## 🌐 **FILES RENDER WILL USE:**

1. **package.json** - Dependencies and scripts
2. **server/index.js** - Main backend entry point
3. **src/** - Frontend source code
4. **render.yaml** - Optional deployment configuration
5. **.env.production** - Production environment reference
