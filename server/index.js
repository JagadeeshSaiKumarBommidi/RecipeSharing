import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import recipeRoutes from './routes/recipes.js';
import friendRoutes from './routes/friends.js';
import chatRoutes from './routes/chat.js';
import { authenticateToken } from './middleware/auth.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://Admin:Root@recipesharing.ias6bgr.mongodb.net/RecipeSharing';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/recipes', authenticateToken, recipeRoutes);
app.use('/api/friends', authenticateToken, friendRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);

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
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});