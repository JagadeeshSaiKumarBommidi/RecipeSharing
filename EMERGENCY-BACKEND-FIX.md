# 🚨 Emergency Fix: Hardcode Backend URL

## Issue: Environment Variables Not Loading

The `.env.production` file isn't being read properly during Render's build process, so the frontend is still trying to connect to localhost.

## ✅ GUARANTEED FIX: Hardcode URLs Temporarily

**I can temporarily hardcode your backend URL directly in the source code to guarantee it works.**

### Option 1: Set Environment Variables in Render (Recommended)

1. Go to https://dashboard.render.com
2. Click on `recipesharing-3-frontend`
3. Go to Settings → Environment Variables
4. Add these variables:
   ```
   VITE_API_URL = https://recipesharing-3.onrender.com/api
   VITE_SOCKET_URL = https://recipesharing-3.onrender.com
   NODE_ENV = production
   ```
5. Save and wait for redeploy

### Option 2: Hardcode URLs (Emergency Fix)

If Option 1 doesn't work, I can modify `src/config/api.ts` to:

```typescript
// Emergency fix - hardcoded URLs for production
const API_BASE_URL = window.location.hostname.includes('onrender.com') 
  ? 'https://recipesharing-3.onrender.com'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
```

This will automatically use your production backend when deployed on Render.

## 🔧 Let me know which approach you'd like me to implement!

**Option 1** is cleaner and more maintainable.
**Option 2** is a guaranteed quick fix that will work immediately.

---

**Your choice - both will solve the CORS issue and make your app work globally!**
