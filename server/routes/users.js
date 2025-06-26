import express from 'express';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('friends', 'username fullName profilePicture')
      .populate('following', 'username fullName profilePicture')
      .populate('followers', 'username fullName profilePicture');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { fullName, bio, profilePicture } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, bio, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('friends', 'username fullName profilePicture')
      .populate('recipes');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username fullName profilePicture bio')
    .limit(20);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
});

// Get suggested users (new users for existing users)
router.get('/suggestions/new', async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const excludeIds = [
      req.user._id,
      ...currentUser.friends,
      ...currentUser.following,
      ...currentUser.friendRequests.sent,
      ...currentUser.friendRequests.received
    ];

    const suggestedUsers = await User.find({
      _id: { $nin: excludeIds }
    })
    .select('username fullName profilePicture bio createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user suggestions' });
  }
});

export default router;