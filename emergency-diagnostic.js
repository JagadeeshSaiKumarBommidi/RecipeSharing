#!/usr/bin/env node

// Emergency diagnostic script to check server status and fix common issues
import fs from 'fs';
import path from 'path';

console.log('🚨 Emergency Server Diagnostic');
console.log('=============================');

// Check if server process is still running
console.log('\n🔍 Checking server status...');

// Check for common issues
console.log('\n📋 Common Issues Checklist:');

// 1. Check if uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('❌ uploads directory missing - creating it...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
} else {
  console.log('✅ uploads directory exists');
}

// 2. Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file missing');
} else {
  console.log('✅ .env file exists');
}

// 3. Check for package.json
if (!fs.existsSync('package.json')) {
  console.log('❌ package.json missing');
} else {
  console.log('✅ package.json exists');
}

// 4. Check server file
if (!fs.existsSync('server/index.js')) {
  console.log('❌ server/index.js missing');
} else {
  console.log('✅ server/index.js exists');
}

console.log('\n🛠️ Recommended Actions:');
console.log('1. Stop the current server (Ctrl+C in the terminal)');
console.log('2. Run: npm run server (to restart just the backend)');
console.log('3. Check for error messages in the console');
console.log('4. If MongoDB connection fails, check your MONGODB_URI');
console.log('5. Run: node test-server-connectivity.js (to test endpoints)');

console.log('\n💡 If server keeps crashing:');
console.log('- Check for syntax errors in server files');
console.log('- Verify all dependencies are installed');
console.log('- Check MongoDB connection string');
console.log('- Review server logs for specific error messages');
