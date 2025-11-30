# MongoDB Atlas IP Whitelist Guide for Render

This document shows you exactly how to allow your Render deployment to connect to MongoDB Atlas.

## Problem
Your backend on Render (`recipesharing-3.onrender.com`) cannot connect to MongoDB Atlas. You'll see an error like:
```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster
```

This happens because MongoDB Atlas has a Network Access / IP Access List that blocks connections from unknown IPs by default. Render's servers need to be whitelisted.

## Solution: Add Render's IP(s) to Atlas Network Access

### Step-by-step (Atlas UI)

1. **Open MongoDB Atlas Console**
   - Go to https://cloud.mongodb.com/
   - Log in with your MongoDB Atlas account
   - Select your **Project** (e.g., "RecipeSharing")

2. **Navigate to Network Access**
   - In the left sidebar, click **Network Access** (under Security)
   - You should see a tab labeled "IP Access List"
   - This shows all IPs allowed to connect to your cluster

3. **Add Render's IP (Option A — Temporary Testing)**
   - Click **Add IP Address** (top right)
   - In the dialog:
     - **Comment**: "Render deployment" (optional, for your reference)
     - **IP Address or CIDR Block**: enter `0.0.0.0/0` (allows all IPs — NOT secure for production)
   - Click **Confirm**
   - Wait 2–5 minutes for the whitelist to update

4. **Test the connection**
   - In Render Dashboard, restart your backend service or redeploy
   - Monitor the logs: look for `✅ Connected to MongoDB` or the error message
   - If successful, the API should now start accepting requests

### Step-by-step (Option B — Recommended for Production)

Get Render's static egress IPs and whitelist only those:

1. **Find Render's Egress IPs**
   - Render's free tier does not provide static outbound IPs by default
   - You can either:
     - Upgrade to Render's **paid Pro plan** which provides static IPs
     - Use Render's **Private Services** / **VPC** (if available in your region)
     - Open Atlas to 0.0.0.0/0 temporarily, then upgrade later

2. **If you have static Render IPs:**
   - In MongoDB Atlas → Network Access → Add IP Address
   - Enter each Render IP in CIDR format (e.g., `203.0.113.45/32`)
   - Click **Confirm**
   - Wait for the update to propagate

3. **If using Private Services / VPC:**
   - Set up VPC peering between Render and MongoDB Atlas (advanced)
   - Follow Render and Atlas documentation for this setup

## After Whitelisting: Update Render Backend Environment

1. **Confirm MONGODB_URI is set in Render**
   - Go to Render Dashboard → your backend service
   - Click **Environment** (or **Settings**)
   - Ensure the secret `MONGODB_URI` is set to your full Atlas connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/recipesharing?retryWrites=true&w=majority
     ```
   - If you modified it, re-deploy

2. **Set frontend origin in Render (fixes CORS)**
   - In the same backend service environment, add:
     ```
     CLIENT_URL=https://recipesharing-1-18f6.onrender.com
     ```
     (Replace with your actual frontend URL)
   - Or set `CLIENT_URLS` to a comma-separated list if you have multiple frontends

3. **Restart/redeploy**
   - In Render Dashboard, click **Restart Service** or re-deploy from Git
   - Monitor logs for both success messages:
     - `✅ Connected to MongoDB`
     - (No CORS errors from the browser)

## Verify the Fix Works

### Test MongoDB connection
Run this command from your local machine (replace the URL):
```bash
curl -i 'https://recipesharing-3.onrender.com/api/health' \
  -H 'Authorization: Bearer <your-valid-jwt-token>'
```

Expected response (HTTP 200):
```json
{
  "status": "OK",
  "timestamp": "2025-11-30T...",
  "uptime": ...
}
```

### Test CORS from frontend
1. Open your frontend: https://recipesharing-1-18f6.onrender.com
2. Open DevTools (F12) → Console
3. Try to log in
4. In the Network tab, check the preflight OPTIONS request to `/api/auth/login`:
   - Should be **200** (not 403)
   - Response headers should include: `Access-Control-Allow-Origin: https://recipesharing-1-18f6.onrender.com`

## Troubleshooting

### MongoDB still won't connect after whitelisting
- **Check IP**: your Render service's outbound IP might be dynamic. You may need to whitelist `0.0.0.0/0` (less secure) or upgrade to a static IP plan.
- **Check credentials**: ensure the user in MONGODB_URI has the correct password and database role (readWrite).
- **Check URI format**: make sure the cluster name and database name are correct.

### CORS still blocked
- **Check allowed origins**: ensure `CLIENT_URL` or `CLIENT_URLS` in Render includes your actual frontend origin.
- **Redeploy**: after changing env vars, the backend must be restarted or redeployed to pick up the changes.
- **Check origin header**: in DevTools Network → OPTIONS request, check the `Origin` header sent by the browser. It must match one of the allowed origins.

### "User not found" or "Invalid credentials" from MongoDB
- Your Atlas DB user exists but password or username is wrong.
- Go to MongoDB Atlas → Database Access → find your user
- Reset the password and update MONGODB_URI in Render with the new password
- Re-deploy

## Security Best Practices

1. **Do NOT use 0.0.0.0/0 in production long-term.** It allows any IP on the internet to attempt connection (though invalid credentials would still prevent access).
2. **Use IP whitelisting** with static Render IPs (paid plan) or VPC peering for production.
3. **Rotate your DB password** regularly and do NOT store it in source code.
4. **Use strong MONGODB_URI** connection strings with the `retryWrites=true&w=majority` params for reliability.

## Next Steps

After successfully connecting:
1. Verify backend endpoints return data (e.g., `/api/health`)
2. Test the frontend app: sign up, create a recipe, check the feed
3. Monitor Render logs for any errors during use

If you need to rebuild your Render services or redeploy the git repository, these settings should persist in Render's environment secrets/vars (unless you delete them).

