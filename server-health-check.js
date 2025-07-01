#!/usr/bin/env node

// Server health monitor - checks for common issues that cause crashes
import fs from 'fs';
import path from 'path';

console.log('🔍 RecipeShare Server Health Check');
console.log('===================================');

// Function to check file exists and has content
function checkFile(filePath, description) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${description}: File missing (${filePath})`);
      return false;
    }
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      console.log(`⚠️ ${description}: File is empty (${filePath})`);
      return false;
    }
    console.log(`✅ ${description}: OK`);
    return true;
  } catch (error) {
    console.log(`❌ ${description}: Error - ${error.message}`);
    return false;
  }
}

// Check critical files
console.log('\n📋 Critical Files Check:');
checkFile('.env', 'Environment file');
checkFile('server/index.js', 'Main server file');
checkFile('server/models/User.js', 'User model');
checkFile('server/models/Recipe.js', 'Recipe model');
checkFile('server/models/Story.js', 'Story model');
checkFile('server/routes/auth.js', 'Auth routes');
checkFile('server/routes/recipes.js', 'Recipe routes');
checkFile('server/routes/users.js', 'User routes');
checkFile('server/routes/stories.js', 'Story routes');

// Check directories
console.log('\n📁 Directory Check:');
const dirs = ['uploads', 'uploads/stories', 'uploads/recipes', 'uploads/profiles'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`❌ Missing directory: ${dir} - creating...`);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  } else {
    console.log(`✅ Directory exists: ${dir}`);
  }
});

// Check package.json scripts
console.log('\n📦 Package Scripts Check:');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['dev', 'server', 'client'];
  requiredScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`✅ Script "${script}": ${pkg.scripts[script]}`);
    } else {
      console.log(`❌ Missing script: ${script}`);
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check environment variables format
console.log('\n🔧 Environment Variables Format Check:');
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  lines.forEach(line => {
    if (line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key.trim() && value.trim()) {
        console.log(`✅ ${key.trim()}: Set`);
      } else {
        console.log(`⚠️ ${key.trim()}: Empty or malformed`);
      }
    }
  });
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
}

console.log('\n🎯 Recommendations:');
console.log('1. If all checks pass ✅, try: npm run server');
console.log('2. If MongoDB connection fails, check MONGODB_URI');
console.log('3. If port conflicts, change PORT in .env');
console.log('4. Check server console for specific error messages');
console.log('5. Use server-recovery.bat for automated restart');
