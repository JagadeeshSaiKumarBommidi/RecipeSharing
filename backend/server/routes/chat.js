import express from 'express';
import { Message, Conversation } from '../models/Chat.js';
import User from '../models/User.js';

const router = express.Router();

// Get conversations
router.get('/conversations', async (req, res) => {
  try {
    // Get all conversations
    const conversations = await Conversation.find({
      participants: req.user._id
    })
    .populate('participants', 'username fullName profilePicture')
    .populate('lastMessage')
    .sort({ lastActivity: -1 });

    // Add unread count for each conversation
    const conversationsWithUnread = await Promise.all(conversations.map(async (conversation) => {
      // Find the other participant
      const otherParticipant = conversation.participants.find(
        p => p._id.toString() !== req.user._id.toString()
      );
      
      if (!otherParticipant) return conversation;
      
      // Count unread messages from this participant
      const unreadCount = await Message.countDocuments({
        sender: otherParticipant._id,
        recipient: req.user._id,
        isRead: false
      });
      
      // Convert to a plain object so we can add properties
      const convObj = conversation.toObject();
      convObj.unreadCount = unreadCount;
      
      return convObj;
    }));

    res.json(conversationsWithUnread);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
});

// Get messages for a conversation
router.get('/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    })
    .populate('sender', 'username fullName profilePicture')
    .populate('recipient', 'username fullName profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send message
router.post('/send', async (req, res) => {
  try {
    const { recipientId, message, messageType = 'text' } = req.body;

    // Create message
    const newMessage = new Message({
      sender: req.user._id,
      recipient: recipientId,
      message,
      messageType
    });

    await newMessage.save();

    // Update or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, recipientId],
        lastMessage: newMessage._id,
        lastActivity: new Date()
      });
    } else {
      conversation.lastMessage = newMessage._id;
      conversation.lastActivity = new Date();
    }

    await conversation.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'username fullName profilePicture')
      .populate('recipient', 'username fullName profilePicture');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Mark messages as read
router.put('/read/:userId', async (req, res) => {
  try {
    await Message.updateMany(
      {
        sender: req.params.userId,
        recipient: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages as read' });
  }
});

export default router;