# Deploying RecipeSharing to Render

This document explains the recommended, secure steps to deploy the RecipeSharing app to Render.

## High-level approach (best practice)
- Use the `render.yaml` already in the repo to let Render create services automatically.
- Do NOT commit secrets to the repository. Use Render's Dashboard to create secrets (Environment -> Add Secret).
- Ensure your MongoDB Atlas cluster allows connections from Render (either add Render egress IPs to Atlas access list or temporarily allow 0.0.0.0/0 for testing).
- The backend will run a `prestart` step which verifies required environment variables before starting.

## Required secrets / env vars (backend service)
Add the following in Render Dashboard (Backend service -> Environment):

- `MONGODB_URI` (value: your Atlas connection string, e.g. `mongodb+srv://<user>:<pass>@cluster0.../dbname?retryWrites=true&w=majority`)
- `JWT_SECRET` (value: generate a strong secret; see below)
- (optional) `CLIENT_URL` (e.g. `https://<your-frontend>.onrender.com`)

## Frontend environment (static site)
Add these env vars to the frontend service so the built app points to the deployed backend:

- `VITE_API_URL` = `https://<your-backend-service>.onrender.com`
- `VITE_SOCKET_URL` = `https://<your-backend-service>.onrender.com`

> Note: After adding these, trigger a new build/deploy for the frontend so Vite embeds the correct URLs in the production build.

## Atlas network access
Render services run from Render's infrastructure. You must allow Render's outbound IPs to access Atlas:

- Option A (quick testing): In Atlas UI → Network Access → Add IP Address → `0.0.0.0/0` (NOT recommended for production).
- Option B (recommended): Add Render's static egress IP(s) for your account (see Render docs or account settings) to the Atlas access list.
- Option C (advanced): Use VPC peering / Private networking between Render and Atlas if available.

## How to generate a strong `JWT_SECRET`
Run one of these locally and copy the output into the Render secret value for `JWT_SECRET`:

PowerShell (Node crypto hex, 64 bytes):
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

OpenSSL (hex):
```powershell
openssl rand -hex 64
```

PowerShell (base64):
```powershell
$bytes = New-Object 'System.Byte[]' 48
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

## How to deploy
1. Push your branch with `render.yaml` to the connected Git repo.
2. In Render Dashboard, import the `render.yaml` or create services manually matching the file.
3. Add the required secrets in the backend service (MONGODB_URI, JWT_SECRET).
4. For frontend, add `VITE_API_URL` and `VITE_SOCKET_URL` then redeploy (so the build picks them up).
5. Monitor backend logs; when you see `✅ Connected to MongoDB`, the API is ready.
6. Visit the frontend URL and test the app.

## Troubleshooting
- If logs show `MongooseServerSelectionError` (could not connect to any servers):
  - Verify `MONGODB_URI` is correct and the DB user exists with the expected password.
  - Verify Atlas IP Access List includes the Render egress IP(s) or use `0.0.0.0/0` for testing.
- If logs say missing env variables: ensure you added the secrets in the Render Dashboard; the backend will exit early because of the `prestart` check.

## Security notes
- Do not store secrets in source control. Use Render's secret store.
- Rotate DB credentials if they have been committed to the repository history.
- Prefer locking down Atlas access to specific Render IPs or using VPC peering.

If you'd like, I can:
- Convert `render.yaml` to include Render secret resources (you must confirm secret names).
- Add a CI step that validates `render.yaml` before push.

*** End of file ***