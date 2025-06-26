# RecipeSharing

A full-stack social media platform where users can share recipes, connect with friends, and engage in real-time chat.

## Features

- 👥 User authentication and profiles
- 🍳 Recipe creation and sharing
- 👫 Friend system and social interactions
- 💬 Real-time chat messaging
- 📱 Responsive design
- 🖼️ Image and video upload support

## Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Socket.io for real-time features

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Socket.io for real-time chat
- Multer for file uploads

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RecipeSharing
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```
   
2. Edit the `.env` file with your configuration:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/recipesharing
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipesharing
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # JWT Configuration (Change this to a secure random string)
   JWT_SECRET=your-unique-jwt-secret-key-here
   
   # Client URL (for CORS)
   CLIENT_URL=http://localhost:5173
   ```

### 4. Database Setup
- **Option A: Local MongoDB**
  - Install MongoDB locally
  - Start MongoDB service
  - Use `MONGODB_URI=mongodb://localhost:27017/recipesharing`

- **Option B: MongoDB Atlas**
  - Create a MongoDB Atlas account
  - Create a new cluster
  - Get the connection string and update `MONGODB_URI`

### 5. Start the Application
```bash
# Start both client and server
npm run dev

# Or start them separately:
npm run client  # Frontend on http://localhost:5173
npm run server  # Backend on http://localhost:5000
```

## Available Scripts

- `npm run dev` - Start both client and server concurrently
- `npm run client` - Start frontend development server
- `npm run server` - Start backend server with nodemon
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Recipes
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/:id` - Get specific recipe

### Friends
- `GET /api/friends` - Get friends list
- `POST /api/friends/request` - Send friend request

### Chat
- `GET /api/chat` - Get chat messages
- `POST /api/chat` - Send message

## Troubleshooting

### Common Issues

1. **Server won't start**
   - Check if `.env` file exists and has correct values
   - Verify MongoDB connection string
   - Ensure MongoDB is running (if using local)

2. **Database connection errors**
   - Verify MongoDB URI in `.env`
   - Check network connectivity for Atlas
   - Ensure database user has proper permissions

3. **Authentication issues**
   - Verify JWT_SECRET is set in `.env`
   - Check if token is being sent in Authorization header

4. **File upload issues**
   - Ensure `uploads/` directory exists
   - Check file size limits in server configuration

### Development Tips

- Use browser developer tools to check network requests
- Check server logs for detailed error messages
- Use MongoDB Compass to inspect database collections
- Test API endpoints with tools like Postman

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
