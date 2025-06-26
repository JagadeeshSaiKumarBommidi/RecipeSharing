# RecipeSharing - Deployment Guide

## 🚀 Deployment Architecture

Your RecipeSharing app needs to be deployed in two parts:

### Frontend (React) → Netlify ✅
### Backend (Node.js/Express) → Heroku/Railway/Vercel ⚠️

## 📋 Step-by-Step Deployment

### Part 1: Deploy Backend First

#### Option A: Deploy to Heroku
1. **Create Heroku account**: https://heroku.com
2. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
3. **Deploy backend**:
   ```bash
   # Login to Heroku
   heroku login
   
   # Create new app
   heroku create your-recipe-backend
   
   # Set environment variables
   heroku config:set MONGODB_URI="mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing"
   heroku config:set JWT_SECRET="recipe-sharing-super-secret-jwt-key-2025"
   heroku config:set NODE_ENV="production"
   heroku config:set CLIENT_URL="https://your-frontend-app.netlify.app"
   
   # Deploy
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

#### Option B: Deploy to Railway (Recommended)
1. **Create Railway account**: https://railway.app
2. **Connect GitHub repository**
3. **Set environment variables**:
   - `MONGODB_URI`: mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing
   - `JWT_SECRET`: recipe-sharing-super-secret-jwt-key-2025
   - `NODE_ENV`: production
   - `CLIENT_URL`: https://your-frontend-app.netlify.app
4. **Deploy automatically**

### Part 2: Deploy Frontend to Netlify

1. **Update environment variables**:
   Create `.env.production` in your project root:
   ```env
   VITE_API_URL=https://your-backend-app.herokuapp.com
   VITE_SOCKET_URL=https://your-backend-app.herokuapp.com
   ```

2. **Build the frontend**:
   ```bash
   npm run build
   ```

3. **Deploy to Netlify**:
   - **Option A**: Drag and drop `dist` folder to Netlify
   - **Option B**: Connect GitHub repository to Netlify

#### Netlify Configuration:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment variables**:
  - `VITE_API_URL`: https://your-backend-app.herokuapp.com
  - `VITE_SOCKET_URL`: https://your-backend-app.herokuapp.com

## ⚙️ Pre-Deployment Checklist

### Backend Preparation:
- [ ] Environment variables configured
- [ ] MongoDB connection string updated
- [ ] CORS configured for frontend domain
- [ ] Health check endpoint working
- [ ] Error handling implemented

### Frontend Preparation:
- [ ] API endpoints updated to use environment variables
- [ ] Socket.io connection updated
- [ ] Build process working locally
- [ ] Environment variables set for production

## 🔧 Configuration Files

### package.json (Backend)
Add start script for production:
```json
{
  "scripts": {
    "start": "node server/index.js",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server/index.js",
    "build": "npm install"
  }
}
```

### netlify.toml
Already created in your project root with proper redirects.

## 🌐 Environment Variables Summary

### Backend (.env):
```env
MONGODB_URI=mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing
JWT_SECRET=recipe-sharing-super-secret-jwt-key-2025
NODE_ENV=production
CLIENT_URL=https://your-frontend-app.netlify.app
PORT=5000
```

### Frontend (Production):
```env
VITE_API_URL=https://your-backend-app.herokuapp.com
VITE_SOCKET_URL=https://your-backend-app.herokuapp.com
```

## 🚨 Important Notes

1. **CORS Configuration**: Update CLIENT_URL in backend to match your Netlify domain
2. **Database**: Your MongoDB Atlas connection should work in production
3. **File Uploads**: Consider using cloud storage (AWS S3, Cloudinary) for production
4. **Real-time Features**: Socket.io should work across domains with proper CORS
5. **API Calls**: All frontend API calls must use the deployed backend URL

## 🔍 Testing Deployment

1. **Backend Health Check**: 
   Visit `https://your-backend-app.herokuapp.com/api/health`

2. **Frontend**: 
   Visit `https://your-frontend-app.netlify.app`

3. **API Connection**: 
   Check browser network tab for API calls

## 🛠️ Troubleshooting

### Common Issues:
- **CORS errors**: Check CLIENT_URL in backend matches frontend domain
- **API not found**: Verify backend URL in frontend environment variables
- **Database connection**: Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- **Environment variables**: Double-check all variables are set correctly

### Debug Commands:
```bash
# Check backend health
curl https://your-backend-app.herokuapp.com/api/health

# Check environment variables (locally)
npm run test-server
```

## 📝 Next Steps

1. Deploy backend to Heroku/Railway
2. Get backend URL
3. Update frontend environment variables
4. Deploy frontend to Netlify
5. Test the complete application
6. Update CORS settings if needed

Your RecipeSharing app will be live once both parts are deployed! 🎉
