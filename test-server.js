// Simple server test script
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

console.log('🔍 Testing server configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('- PORT:', process.env.PORT || 'not set (will use 5000)');
console.log('- CLIENT_URL:', process.env.CLIENT_URL || 'not set (will use localhost:5173)');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ set' : '❌ not set');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ set' : '❌ not set');

if (!process.env.MONGODB_URI) {
  console.log('\n❌ MONGODB_URI is required but not set in .env file');
  process.exit(1);
}

console.log('\n🔗 Testing MongoDB connection...');

// Test MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Close connection and exit
    mongoose.connection.close();
    console.log('\n✅ All tests passed! Server should start normally.');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed:');
    console.log('Error:', err.message);
    console.log('\n💡 Possible solutions:');
    console.log('1. Check your internet connection');
    console.log('2. Verify MongoDB Atlas credentials');
    console.log('3. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('4. For local MongoDB, ensure MongoDB service is running');
    process.exit(1);
  });

// Timeout after 10 seconds
setTimeout(() => {
  console.log('\n⏰ Connection test timed out');
  console.log('This might indicate network issues or incorrect MongoDB URI');
  process.exit(1);
}, 10000);
