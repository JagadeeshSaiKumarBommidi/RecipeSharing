import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Send friend request
router.post('/request/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already friends or request already sent
    if (currentUser.friends.includes(userId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    if (currentUser.friendRequests.sent.includes(userId)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add to sent requests for current user
    currentUser.friendRequests.sent.push(userId);
    await currentUser.save();

    // Add to received requests for target user
    targetUser.friendRequests.received.push(currentUserId);
    await targetUser.save();

    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request' });
  }
});

// Accept friend request
router.post('/accept/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const requestUser = await User.findById(userId);

    if (!requestUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if friend request exists
    if (!currentUser.friendRequests.received.includes(userId)) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }

    // Add to friends lists
    currentUser.friends.push(userId);
    requestUser.friends.push(currentUserId);

    // Remove from friend requests
    currentUser.friendRequests.received = currentUser.friendRequests.received.filter(
      id => id.toString() !== userId
    );
    requestUser.friendRequests.sent = requestUser.friendRequests.sent.filter(
      id => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await requestUser.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting friend request' });
  }
});

// Reject friend request
router.post('/reject/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const requestUser = await User.findById(userId);

    if (!requestUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from friend requests
    currentUser.friendRequests.received = currentUser.friendRequests.received.filter(
      id => id.toString() !== userId
    );
    requestUser.friendRequests.sent = requestUser.friendRequests.sent.filter(
      id => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await requestUser.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting friend request' });
  }
});

// Get friend requests
router.get('/requests', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friendRequests.received', 'username fullName profilePicture')
      .populate('friendRequests.sent', 'username fullName profilePicture');

    res.json({
      received: user.friendRequests.received,
      sent: user.friendRequests.sent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friend requests' });
  }
});

// Get friends list
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'username fullName profilePicture bio');

    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends' });
  }
});

export default router;