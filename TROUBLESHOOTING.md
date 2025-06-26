# RecipeSharing - Troubleshooting Guide

## Common Server Issues and Solutions

### 1. "Server won't start" or "Port already in use"

**Problem**: Error like "EADDRINUSE: address already in use :::5000"

**Solutions**:
```bash
# Check what's running on port 5000
netstat -ano | findstr :5000

# Kill the process using the port (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port in .env file
PORT=5001
```

### 2. "MongoDB connection error"

**Problem**: Cannot connect to MongoDB database

**Solutions**:

**For MongoDB Atlas**:
- Verify connection string in `.env` file
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure network access is configured properly
- Verify username/password are correct

**For Local MongoDB**:
- Install MongoDB locally: https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # Or start manually
  mongod --dbpath "C:\data\db"
  ```
- Use local connection string: `MONGODB_URI=mongodb://localhost:27017/recipesharing`

### 3. "Missing environment variables"

**Problem**: Environment variables not loaded

**Solutions**:
- Ensure `.env` file exists in project root
- Copy from template: `copy .env.example .env`
- Check file encoding (should be UTF-8 without BOM)
- Restart the server after changing `.env`

### 4. "JWT Authentication errors"

**Problem**: Token-related authentication issues

**Solutions**:
- Ensure `JWT_SECRET` is set in `.env`
- Clear browser localStorage/cookies
- Check if Authorization header is being sent
- Verify token format: `Bearer <token>`

### 5. "File upload issues"

**Problem**: Cannot upload images/videos

**Solutions**:
- Ensure `uploads/` directory exists and is writable
- Check file size limits (current: 50MB)
- Verify file types are supported
- Check disk space availability

### 6. "CORS errors in browser"

**Problem**: Cross-origin request blocked

**Solutions**:
- Verify `CLIENT_URL` in `.env` matches your frontend URL
- Check browser console for specific CORS error
- Ensure credentials are included if needed
- For development, both client and server should run on localhost

### 7. "Socket.io connection failed"

**Problem**: Real-time chat not working

**Solutions**:
- Check if WebSocket connections are blocked by firewall
- Verify client and server Socket.io versions match
- Check browser network tab for WebSocket errors
- Ensure CORS is properly configured for Socket.io

### 8. "Module not found errors"

**Problem**: Import/require errors

**Solutions**:
```bash
# Reinstall dependencies
npm install

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

### 9. "Database validation errors"

**Problem**: MongoDB schema validation fails

**Solutions**:
- Check required fields in models
- Verify data types match schema
- Check for unique constraint violations
- Use MongoDB Compass to inspect data

### 10. "Performance issues"

**Problem**: Slow response times

**Solutions**:
- Add database indexes for frequently queried fields
- Enable MongoDB connection pooling
- Implement request rate limiting
- Use compression middleware
- Optimize database queries

## Development Commands

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build for production
npm run build

# Run linting
npm run lint

# Fix security vulnerabilities
npm audit fix

# Check Node.js version
node --version

# Check npm version
npm --version
```

## Useful Tools

- **MongoDB Compass**: GUI for MongoDB database inspection
- **Postman**: API testing tool
- **Browser DevTools**: Network tab for debugging requests
- **VS Code Extensions**: 
  - MongoDB for VS Code
  - REST Client
  - GitLens

## Environment Variables Reference

```env
# Required
MONGODB_URI=mongodb://localhost:27017/recipesharing
JWT_SECRET=your-unique-secret-key

# Optional
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Getting Help

1. Check server console for error messages
2. Check browser console for client-side errors
3. Verify all environment variables are set
4. Test API endpoints individually
5. Check MongoDB connection and data

If problems persist, please provide:
- Error messages from console
- Your environment (.env) configuration (without secrets)
- Steps to reproduce the issue
- System information (OS, Node.js version)
