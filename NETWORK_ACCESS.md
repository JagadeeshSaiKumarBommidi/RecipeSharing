# 🌐 RecipeShare Network Access Guide

## Quick Start (Network Access)

**EASIEST METHOD:** Run this single command to fix network access:
```bash
fix-network-connection.bat
```

This script will:
- Stop any existing servers
- Configure Windows Firewall
- Set up environment variables for network access
- Build the frontend
- Start both backend and frontend with network binding
- Show you the URLs to share with other devices

## Network URLs
After running the script, your app will be accessible at:
- **Frontend:** `http://192.168.1.5:4173` (share this with others)
- **Backend:** `http://192.168.1.5:5000`
- **Health Check:** `http://192.168.1.5:5000/api/health`

## Troubleshooting Network Issues

### If you get "Connection Refused" errors:

1. **Run the network fix script:**
   ```bash
   fix-network-connection.bat
   ```

2. **Test connectivity:**
   ```bash
   test-network.bat
   ```

3. **Check Windows Firewall:**
   The script automatically configures firewall rules, but if issues persist:
   - Open Windows Defender Firewall
   - Allow apps through firewall
   - Make sure ports 5000 and 4173 are allowed

### If servers won't start:

1. **Kill existing processes:**
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Check if ports are in use:**
   ```bash
   netstat -an | findstr :5000
   netstat -an | findstr :4173
   ```

3. **Free the ports:**
   ```bash
   netstat -ano | findstr :5000
   # Note the PID and kill it:
   taskkill /PID [PID_NUMBER] /F
   ```

## Manual Network Setup

If the automated script doesn't work, here's the manual process:

### 1. Configure Backend for Network Access
Edit `.env` file:
```env
HOST=0.0.0.0
PORT=5000
CLIENT_URL=http://192.168.1.5:4173
```

### 2. Configure Frontend for Network Access
Create `.env.local`:
```env
VITE_API_URL=http://192.168.1.5:5000/api
```

### 3. Build Frontend
```bash
npm run build
```

### 4. Start Backend (Network Mode)
```bash
cd server
set HOST=0.0.0.0
set PORT=5000
node index.js
```

### 5. Start Frontend (Network Mode)
```bash
npm run preview -- --host 0.0.0.0 --port 4173
```

## Access from Other Devices

1. **Connect devices to same WiFi network**
2. **Open browser on another device**
3. **Visit:** `http://192.168.1.5:4173`
4. **Create account and start using the app!**

## Security Notes

- The app is only accessible on your local network (WiFi)
- Not accessible from the internet (secure for local testing)
- For internet access, deploy to Render (see RENDER_GUIDE.md)

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Connection Refused | Run `fix-network-connection.bat` |
| Can't access from phone | Check both devices on same WiFi |
| Server won't start | Kill existing node processes |
| Build fails | Run `npm install` first |
| CORS errors | Check CLIENT_URL in .env |

## Available Scripts

| Script | Purpose |
|--------|---------|
| `fix-network-connection.bat` | ⭐ Complete network setup |
| `test-network.bat` | Test network connectivity |
| `network-setup.bat` | Interactive network setup |
| `start-server-network.bat` | Start only backend |
| `start-frontend-network.bat` | Start only frontend |

**Need help?** Run `fix-network-connection.bat` - it fixes 99% of network issues automatically!
