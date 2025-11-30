# CORS Debugging Guide for Render Deployment

## Current Error
```
Access to fetch at 'https://recipesharing-3.onrender.com/api/auth/login' from origin 'https://recipesharing-1-18f6.onrender.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This means the backend is **NOT sending CORS headers** in response to the OPTIONS preflight request.

---

## Step-by-Step Debugging

### Step 1: Check if Backend is Running
Open in browser or use curl:
```bash
curl -i https://recipesharing-3.onrender.com/api/health
```

**Expected Response:**
```
HTTP/2 200
content-type: application/json
access-control-allow-origin: ...
...

{"status":"OK","timestamp":"...","uptime":...}
```

**If you get 404 or no response:** Backend is not running or failed to start.

---

### Step 2: Check Backend Logs in Render

1. Go to **Render Dashboard** → Your backend service (`recipesharing-3`)
2. Click **Logs** tab
3. Look for these critical lines:

**✅ Good signs:**
```
✅ JWT_SECRET: ✅ Loaded
✅ MONGODB_URI: ✅ Loaded
🔐 CORS allowed origins: [ 'http://localhost:5173', ..., 'https://recipesharing-1-18f6.onrender.com' ]
✅ Connected to MongoDB
Server running on 0.0.0.0:5000
```

**❌ Bad signs:**
```
❌ Missing required environment variables
❌ MongoDB connection error
Error: ...
```

---

### Step 3: Test CORS Preflight Manually

Open your browser console on https://recipesharing-1-18f6.onrender.com and run:

```javascript
fetch('https://recipesharing-3.onrender.com/api/health', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://recipesharing-1-18f6.onrender.com',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type,authorization'
  }
}).then(r => {
  console.log('✅ OPTIONS Status:', r.status);
  console.log('✅ CORS Headers:', {
    'Access-Control-Allow-Origin': r.headers.get('Access-Control-Allow-Origin'),
    'Access-Control-Allow-Methods': r.headers.get('Access-Control-Allow-Methods'),
    'Access-Control-Allow-Headers': r.headers.get('Access-Control-Allow-Headers')
  });
}).catch(e => console.error('❌ OPTIONS failed:', e));
```

**Expected output:**
```
✅ OPTIONS Status: 200
✅ CORS Headers: {
  'Access-Control-Allow-Origin': 'https://recipesharing-1-18f6.onrender.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}
```

---

### Step 4: Check Network Tab Details

1. Open **DevTools** (F12) on your frontend
2. Go to **Network** tab
3. Try to log in
4. Find the **OPTIONS** request to `/api/auth/login`
5. Click on it and check:

**Request Headers:**
- `Origin: https://recipesharing-1-18f6.onrender.com`
- `Access-Control-Request-Method: POST`
- `Access-Control-Request-Headers: content-type,authorization`

**Response Headers (should be present):**
- `Access-Control-Allow-Origin: https://recipesharing-1-18f6.onrender.com`
- `Access-Control-Allow-Methods: ...`
- `Access-Control-Allow-Headers: ...`

**If Response Headers are EMPTY:** Backend didn't respond or crashed before sending headers.

---

## Common Causes & Solutions

### Cause 1: Backend Not Redeployed with Latest Code
**Solution:** 
1. Go to Render Dashboard → Backend service
2. Click **Redeploy from Git**
3. Wait 2-3 minutes
4. Check logs for successful startup

### Cause 2: MongoDB Connection Failure Crashes Backend
**Symptom:** Logs show `MongoDB connection error` and process exits.

**Solution:**
1. Go to **MongoDB Atlas** → **Network Access**
2. Make sure `0.0.0.0/0` is added (you said you did this ✅)
3. Verify your `MONGODB_URI` secret in Render is correct
4. Restart the backend service

### Cause 3: Environment Variables Not Set
**Symptom:** Logs show `❌ Missing required environment variables`

**Solution:**
1. Go to Render Dashboard → Backend service → **Environment**
2. Add these variables:
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@...
   JWT_SECRET=<your-64-char-hex-secret>
   NODE_ENV=production
   CLIENT_URL=https://recipesharing-1-18f6.onrender.com
   ```
3. Save and redeploy

### Cause 4: CORS Middleware Not Running
**Symptom:** Backend responds but no CORS headers present.

**Solution:** This should be fixed by the latest code push. The backend now:
- Has explicit OPTIONS handler
- Logs all CORS decisions
- Hardcodes your frontend URL as fallback

### Cause 5: Render Health Check Failing
**Symptom:** Service shows as "unhealthy" or keeps restarting.

**Solution:**
1. Check if `/api/health` endpoint works
2. Verify `healthCheckPath: /api/health` in render.yaml
3. Increase health check timeout in Render settings

---

## Quick Fix Checklist

Run through this checklist:

- [ ] Backend service is "Live" (green) in Render Dashboard
- [ ] Latest code is deployed (check commit hash in Render)
- [ ] Backend logs show: `🔐 CORS allowed origins: [...'https://recipesharing-1-18f6.onrender.com'...]`
- [ ] Backend logs show: `✅ Connected to MongoDB`
- [ ] Backend logs show: `Server running on ...`
- [ ] `/api/health` returns 200 when accessed directly
- [ ] OPTIONS request to `/api/auth/login` returns 200 (not 403/404)
- [ ] MongoDB Atlas Network Access includes `0.0.0.0/0` or Render's IP
- [ ] `MONGODB_URI` and `JWT_SECRET` are set in Render environment
- [ ] Frontend URL in browser matches the one in backend's allowed origins

---

## Emergency Workaround (Temporary)

If nothing works, temporarily allow ALL origins (NOT for production):

1. In `backend/server/index.js`, find the CORS middleware
2. Change to:
```javascript
app.use(cors({
  origin: true, // TEMPORARY: Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```
3. Commit and push
4. Redeploy backend

**Important:** This is insecure and should only be used to verify CORS is the issue. Revert immediately after testing.

---

## Need More Help?

Share the following info:

1. **Render Backend Logs** (last 50 lines)
2. **Network tab screenshot** showing the OPTIONS request headers and response
3. **Browser console errors** (full error message)
4. Result of the manual OPTIONS test (Step 3 above)

This will help diagnose the exact issue.
