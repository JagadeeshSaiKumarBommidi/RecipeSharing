import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Test database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipesharing';

console.log('🔍 Testing API endpoints...');
console.log('MongoDB URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Test if models can be imported
    import('./models/User.js').then(() => {
      console.log('✅ User model loaded');
    }).catch(err => {
      console.error('❌ User model error:', err);
    });
    
    import('./models/Recipe.js').then(() => {
      console.log('✅ Recipe model loaded');
    }).catch(err => {
      console.error('❌ Recipe model error:', err);
    });
    
    import('./models/Story.js').then(() => {
      console.log('✅ Story model loaded');
    }).catch(err => {
      console.error('❌ Story model error:', err);
    });
    
    import('./models/Challenge.js').then(() => {
      console.log('✅ Challenge model loaded');
    }).catch(err => {
      console.error('❌ Challenge model error:', err);
    });
    
    // Test routes
    import('./routes/stories.js').then(() => {
      console.log('✅ Stories routes loaded');
    }).catch(err => {
      console.error('❌ Stories routes error:', err);
    });
    
    import('./routes/challenges.js').then(() => {
      console.log('✅ Challenges routes loaded');
    }).catch(err => {
      console.error('❌ Challenges routes error:', err);
    });
    
    import('./routes/recipes.js').then(() => {
      console.log('✅ Recipes routes loaded');
    }).catch(err => {
      console.error('❌ Recipes routes error:', err);
    });
    
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
