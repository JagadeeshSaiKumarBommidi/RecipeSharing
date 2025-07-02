# Recipe Sharing App 🍳

A full-stack social recipe sharing application built with React and Node.js.

## 📁 Project Structure

```
recipe-sharing-app/
├── backend/                 # Express.js API server
│   ├── server/
│   │   ├── index.js        # Main server file
│   │   ├── models/         # Mongoose data models
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Custom middleware
│   │   └── seeds/          # Database seed files
│   ├── uploads/            # File upload directory
│   ├── package.json        # Backend dependencies
│   ├── .env               # Backend environment variables
│   └── .env.example       # Environment template
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config/        # App configuration
│   │   └── context/       # React context providers
│   ├── public/            # Static assets
│   ├── dist/              # Built files (generated)
│   ├── package.json       # Frontend dependencies
│   └── .env.local         # Frontend environment variables
├── package.json           # Root package.json
├── vercel.json           # Vercel deployment config
└── README.md
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm (comes with Node.js)

### Easy Installation & Startup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd recipe-sharing-app
   ```

2. **Start the application (Windows)**
   ```batch
   start-app.bat
   ```
   
   Or for manual setup:
   ```batch
   # Backend
   cd backend
   npm install
   npm start
   
   # Frontend (new terminal)
   cd frontend
   npm install --no-workspaces --force --legacy-peer-deps
   npm run dev
   ```

3. **Test the application**
   ```batch
   test-servers.bat
   ```

### 🛠️ Helper Scripts (Windows)

- **`start-app.bat`** - Installs dependencies and starts both servers
- **`ultimate-frontend-fix.bat`** - Advanced frontend troubleshooting
- **`test-servers.bat`** - Tests servers and opens in browser
- **`prepare-deployment.bat`** - Prepares project for Vercel deployment

### 🌐 Access URLs (Local)
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Network**: Replace `localhost` with your IP address

## 🚀 Production Deployment

### Deploy to Vercel (Global Access)

1. **Prepare for deployment**
   ```batch
   prepare-deployment.bat
   ```

2. **Follow the complete deployment guide**
   📖 See [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md) for detailed instructions

3. **Quick deployment steps**:
   - Push to GitHub
   - Import to Vercel
   - Add environment variables
   - Deploy!

### ✅ After Deployment:
- **Global Access**: `https://your-app.vercel.app`
- **Mobile Friendly**: Works on any device
- **Secure HTTPS**: Automatic SSL
- **Fast CDN**: Loads quickly worldwide
- **Share Anywhere**: Send URL to friends

## 🎯 Features

- **User Authentication** - Secure signup/login
- **Recipe Sharing** - Create and share recipes with images
- **Real-time Chat** - Socket.io powered messaging
- **Friends System** - Connect with other users
- **Feed** - Browse all shared recipes
- **Profile Management** - Customize your profile
- **Responsive Design** - Works on all devices

## 🛠️ Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipesharing
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
HOST=0.0.0.0
CLIENT_URL=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🔧 Troubleshooting

### Frontend Won't Start
1. Run `ultimate-frontend-fix.bat`
2. Ensure `index.html` is in frontend root directory
3. Clear npm cache: `npm cache clean --force`

### Backend Issues
1. Check MongoDB connection
2. Verify environment variables
3. Ensure port 5000 is available

### Deployment Issues
1. Run `prepare-deployment.bat`
2. Check build process works locally
3. Verify all environment variables are set in Vercel

## 📱 Global Access Features

Once deployed to Vercel:

### ✅ Access from Anywhere:
- **Any Device**: Phone, tablet, laptop, desktop
- **Any Location**: Works worldwide with internet
- **Any Browser**: Chrome, Safari, Firefox, Edge
- **Any Network**: WiFi, mobile data, etc.

### ✅ Share with Anyone:
- **Simple URL**: Just share the Vercel link
- **No Installation**: Works directly in browser
- **Real-time**: Multiple users can interact simultaneously
- **Mobile Optimized**: Great experience on phones

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time features
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.io** for real-time communication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Deployment
- **Vercel** for hosting
- **MongoDB Atlas** for database
- **GitHub** for version control

## 📞 Support

If you encounter issues:

1. **Check helper scripts** - Many common issues are automatically fixed
2. **Read troubleshooting guides** - Comprehensive solutions provided
3. **Check logs** - Server windows show detailed error messages
4. **Verify environment** - Ensure all variables are correctly set

## 🎉 Success Indicators

Your app is working when:
- ✅ Both servers start without errors
- ✅ Frontend loads at http://localhost:5173
- ✅ You can create accounts and login
- ✅ Recipe creation and sharing works
- ✅ Real-time chat functions
- ✅ Network access works from other devices

## 📈 Next Steps

1. **Deploy to production** using Vercel
2. **Add custom domain** (optional)
3. **Enable analytics** to track usage
4. **Scale database** as users grow
5. **Add more features** as needed

---

**🚀 Ready to share recipes with the world? Deploy to Vercel for global access!**
