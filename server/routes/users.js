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

// Get user's followers
router.get('/followers', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'username fullName profilePicture bio createdAt')
      .select('followers');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add followedAt field based on createdAt for now (you can extend this later with a proper follow timestamp)
    const followersWithTimestamp = user.followers.map(follower => ({
      ...follower.toObject(),
      followedAt: follower.createdAt
    }));
    
    res.json(followersWithTimestamp);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ message: 'Error fetching followers' });
  }
});

// Follow/unfollow user
router.post('/:userId/follow', async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;
    
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }
    
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    
    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isAlreadyFollowing = currentUser.following.includes(targetUserId);
    
    if (isAlreadyFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => !id.equals(targetUserId));
      targetUser.followers = targetUser.followers.filter(id => !id.equals(currentUserId));
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }
    
    await currentUser.save();
    await targetUser.save();
    
    res.json({ 
      following: !isAlreadyFollowing,
      message: isAlreadyFollowing ? 'User unfollowed' : 'User followed'
    });
  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    res.status(500).json({ message: 'Error following user' });
  }
});

export default router;