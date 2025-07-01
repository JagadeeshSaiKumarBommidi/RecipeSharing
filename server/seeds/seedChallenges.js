import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const seedChallenge = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📁 Connected to MongoDB for seeding');

    // Delete existing challenges
    await Challenge.deleteMany({});
    console.log('🗑️ Cleared existing challenges');

    // Create sample challenge
    const challenge = new Challenge({
      title: 'Comfort Food Week',
      description: 'Share your favorite comfort food recipe and win prizes!',
      emoji: '🏆',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Started 7 days ago
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Ends in 7 days
      prize: 'Recipe Feature + $50 Gift Card',
      rules: [
        'Recipe must be comfort food related',
        'Include at least one photo',
        'Use hashtag #ComfortFoodWeek',
        'Must be original recipe or family recipe'
      ],
      hashtags: ['#ComfortFoodWeek', '#Comfort', '#HomeCooking'],
      isActive: true,
      participants: [] // Will be populated when users join
    });

    await challenge.save();
    console.log('✅ Created sample challenge:', challenge.title);

    // Create another upcoming challenge
    const upcomingChallenge = new Challenge({
      title: 'Summer BBQ Challenge',
      description: 'Show us your best grilling recipes for summer!',
      emoji: '🔥',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Starts in 7 days
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // Ends in 21 days
      prize: 'Premium Grill Set + Feature',
      rules: [
        'Must be grilled or BBQ recipe',
        'Include cooking tips',
        'Use hashtag #SummerBBQ',
        'Share your grilling technique'
      ],
      hashtags: ['#SummerBBQ', '#Grilling', '#Summer'],
      isActive: false, // Not active yet
      participants: []
    });

    await upcomingChallenge.save();
    console.log('✅ Created upcoming challenge:', upcomingChallenge.title);

    console.log('🎉 Challenge seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
};

seedChallenge();
