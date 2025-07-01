#!/usr/bin/env node

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

console.log('🚀 Quick RecipeSharing Diagnostic');
console.log('==================================');

// Check environment variables
console.log('\n🔧 Environment Variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('- PORT:', process.env.PORT || 'not set (will use 5000)');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');

// Check if uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
console.log('\n📁 Directory Check:');
console.log('- uploads directory:', fs.existsSync(uploadsDir) ? '✅ Exists' : '❌ Missing');

// Check if key files exist
console.log('\n📄 File Check:');
const keyFiles = [
  'server/index.js',
  'server/routes/auth.js',
  'server/routes/recipes.js',
  'server/routes/stories.js',
  'server/routes/challenges.js',
  'server/models/User.js',
  'server/models/Recipe.js',
  'server/models/Story.js',
  'server/models/Challenge.js'
];

keyFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`- ${file}:`, exists ? '✅ Exists' : '❌ Missing');
});

console.log('\n✅ Quick diagnostic complete!');
