#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables FIRST
dotenv.config();

console.log('🚀 RecipeSharing Server Diagnostic Tool');
console.log('==========================================');

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

// Test MongoDB connection
console.log('\n🗄️ Database Connection:');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipesharing';

try {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ MongoDB connected successfully');
  
  // Test collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('📊 Available collections:', collections.map(c => c.name).join(', '));
  
} catch (error) {
  console.log('❌ MongoDB connection failed:', error.message);
  process.exit(1);
}

// Import and test routes
console.log('\n🛣️ Testing Route Imports:');

try {
  const { default: authRoutes } = await import('./routes/auth.js');
  console.log('✅ Auth routes imported');
} catch (error) {
  console.log('❌ Auth routes failed:', error.message);
}

try {
  const { default: userRoutes } = await import('./routes/users.js');
  console.log('✅ User routes imported');
} catch (error) {
  console.log('❌ User routes failed:', error.message);
}

try {
  const { default: recipeRoutes } = await import('./routes/recipes.js');
  console.log('✅ Recipe routes imported');
} catch (error) {
  console.log('❌ Recipe routes failed:', error.message);
}

try {
  const { default: storyRoutes } = await import('./routes/stories.js');
  console.log('✅ Story routes imported');
} catch (error) {
  console.log('❌ Story routes failed:', error.message);
}

try {
  const { default: challengeRoutes } = await import('./routes/challenges.js');
  console.log('✅ Challenge routes imported');
} catch (error) {
  console.log('❌ Challenge routes failed:', error.message);
}

// Test model imports
console.log('\n🏗️ Testing Model Imports:');

try {
  const { default: User } = await import('./models/User.js');
  console.log('✅ User model imported');
  
  // Test if we can query users
  const userCount = await User.countDocuments();
  console.log(`📊 Users in database: ${userCount}`);
  
} catch (error) {
  console.log('❌ User model failed:', error.message);
}

try {
  const { default: Recipe } = await import('./models/Recipe.js');
  console.log('✅ Recipe model imported');
  
  const recipeCount = await Recipe.countDocuments();
  console.log(`📊 Recipes in database: ${recipeCount}`);
  
} catch (error) {
  console.log('❌ Recipe model failed:', error.message);
}

try {
  const { default: Story } = await import('./models/Story.js');
  console.log('✅ Story model imported');
  
  const storyCount = await Story.countDocuments();
  console.log(`📊 Stories in database: ${storyCount}`);
  
} catch (error) {
  console.log('❌ Story model failed:', error.message);
}

try {
  const { default: Challenge } = await import('./models/Challenge.js');
  console.log('✅ Challenge model imported');
  
  const challengeCount = await Challenge.countDocuments();
  console.log(`📊 Challenges in database: ${challengeCount}`);
  
} catch (error) {
  console.log('❌ Challenge model failed:', error.message);
}

console.log('\n🎯 Diagnostic Complete!');
console.log('If all tests passed, the server should work correctly.');
console.log('Run "npm run server" to start the actual server.');

process.exit(0);
