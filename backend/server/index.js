import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables FIRST
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('🔧 Environment Check:');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing');
console.log('- PORT:', process.env.PORT || '5000 (default)');
console.log('');

// Now import modules that depend on environment variables
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import recipeRoutes from './routes/recipes.js';
import friendRoutes from './routes/friends.js';
import chatRoutes from './routes/chat.js';
import challengeRoutes from './routes/challenges.js';
import storyRoutes from './routes/stories.js';
import { authenticateToken } from './middleware/auth.js';

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => console.error(`   - ${envVar}`));
  console.error('💡 Please create a .env file based on .env.example');
  process.exit(1);
}

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Get network IP for CORS
import { networkInterfaces } from 'os';

const getNetworkIPs = () => {
  const nets = networkInterfaces();
  const results = [];
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.push(`http://${net.address}:4173`);
        results.push(`http://${net.address}:5173`);
      }
    }
  }
  return results;
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // TEMPORARY: Allow all origins for testing
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: false // Must be false when origin is "*"
  }
});

// Middleware
app.use(cors({
  origin: "*", // TEMPORARY: Allow all origins for testing
  credentials: false // Must be false when origin is "*"
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipesharing';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.error('💡 Make sure MongoDB is running and the connection string is correct');
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/recipes', authenticateToken, recipeRoutes);
app.use('/api/friends', authenticateToken, friendRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/challenges', authenticateToken, challengeRoutes);
app.use('/api/stories', authenticateToken, storyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint for easy testing
app.get('/', (req, res) => {
  res.json({
    message: 'RecipeShare API Server',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      users: '/api/users/*',
      recipes: '/api/recipes/*',
      stories: '/api/stories/*',
      challenges: '/api/challenges/*'
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Socket.io for real-time chat
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { recipientId, message, senderId } = data;
      const recipientSocketId = connectedUsers.get(recipientId);
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('newMessage', {
          senderId,
          message,
          timestamp: new Date()
        });
      }
      
      socket.emit('messageSent', { success: true });
    } catch (error) {
      socket.emit('messageError', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const HOST = (process.env.HOST || '0.0.0.0').trim(); // Allow override for network access, trim whitespace

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
  console.log(`🗄️  Database: ${MONGODB_URI.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas'}`);
  
  // Show network accessibility info
  if (HOST === '0.0.0.0') {
    console.log('🌐 Server accessible from network');
    console.log('💡 Other systems can access via your IP address');
    
    // Show available network interfaces
    import('os').then(os => {
      const interfaces = os.networkInterfaces();
      console.log('📡 Available network addresses:');
      Object.keys(interfaces).forEach(name => {
        interfaces[name].forEach(iface => {
          if (iface.family === 'IPv4' && !iface.internal) {
            console.log(`   - http://${iface.address}:${PORT} (${name})`);
          }
        });
      });
      console.log('🔧 Health check: Add /api/health to any URL above');
    });
  } else {
    console.log('🔒 Server only accessible from localhost');
    console.log('💡 Set HOST=0.0.0.0 for network access');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});