import express from 'express';
import Challenge from '../models/Challenge.js';

const router = express.Router();

// Get current active challenge
router.get('/current', async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ 
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).populate('participants.user', 'username fullName profilePicture');
    
    if (!challenge) {
      return res.status(404).json({ message: 'No active challenge found' });
    }
    
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching current challenge:', error);
    res.status(500).json({ message: 'Error fetching challenge' });
  }
});

// Join challenge
router.post('/:challengeId/join', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    if (!challenge.isActive) {
      return res.status(400).json({ message: 'Challenge is not active' });
    }
    
    const now = new Date();
    if (now < challenge.startDate || now > challenge.endDate) {
      return res.status(400).json({ message: 'Challenge is not currently running' });
    }
    
    // Check if user already joined
    const alreadyJoined = challenge.participants.some(
      participant => participant.user.toString() === req.user._id.toString()
    );
    
    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }
    
    // Add user to participants
    challenge.participants.push({
      user: req.user._id,
      joinedAt: new Date()
    });
    
    await challenge.save();
    
    // Return updated challenge
    const updatedChallenge = await Challenge.findById(req.params.challengeId)
      .populate('participants.user', 'username fullName profilePicture');
    
    res.json(updatedChallenge);
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ message: 'Error joining challenge' });
  }
});

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('participants.user', 'username fullName profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Error fetching challenges' });
  }
});

// Create challenge (admin only)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      emoji,
      startDate,
      endDate,
      prize,
      rules,
      hashtags
    } = req.body;
    
    const challenge = new Challenge({
      title,
      description,
      emoji,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      prize,
      rules,
      hashtags
    });
    
    await challenge.save();
    
    res.status(201).json(challenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: 'Error creating challenge' });
  }
});

export default router;
