import dotenv from 'dotenv';
import express from 'express';

// Load environment variables
dotenv.config();

console.log('🚀 Simple Server Test');
console.log('=====================');
console.log('Environment variables loaded successfully');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`✅ Simple test server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
