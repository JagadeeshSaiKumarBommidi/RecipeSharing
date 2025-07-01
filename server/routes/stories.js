import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Story from '../models/Story.js';
import User from '../models/User.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/stories';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// Create a story
router.post('/', upload.single('media'), async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { content, backgroundColor, textColor, fontSize, textAlign, type } = req.body;
    
    // Validate required fields
    if (!content && !req.file) {
      return res.status(400).json({ message: 'Story must have either content or media' });
    }
    
    const storyData = {
      author: req.user._id,
      content: content || '',
      backgroundColor: backgroundColor || '#1e293b',
      textColor: textColor || '#ffffff'
    };
    
    // Add media file if uploaded
    if (req.file) {
      storyData.image = `/uploads/stories/${req.file.filename}`;
    }
    
    // Add text styling for text stories
    if (type === 'text') {
      storyData.fontSize = parseInt(fontSize) || 24;
      storyData.textAlign = textAlign || 'center';
    }
    
    const story = new Story(storyData);
    await story.save();
    
    const populatedStory = await Story.findById(story._id)
      .populate('author', 'username fullName profilePicture');
    
    res.status(201).json(populatedStory);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ message: 'Error creating story', error: error.message });
  }
});

// Get stories from friends and own stories
router.get('/feed', async (req, res) => {
  try {
    // Check if user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get current user with friends list
    const currentUser = await User.findById(req.user._id).populate('friends');
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendIds = currentUser.friends ? currentUser.friends.map(friend => friend._id) : [];
    
    // Include current user's ID to show their own stories
    const userIds = [req.user._id, ...friendIds];
    
    // Get active stories from friends and self
    const stories = await Story.find({
      author: { $in: userIds },
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
    .populate('author', 'username fullName profilePicture')
    .populate('views.user', 'username fullName')
    .sort({ createdAt: -1 });
    
    // Group stories by author
    const storiesByAuthor = {};
    stories.forEach(story => {
      const authorId = story.author._id.toString();
      if (!storiesByAuthor[authorId]) {
        storiesByAuthor[authorId] = {
          author: story.author,
          stories: [],
          hasUnviewed: false
        };
      }
      
      // Check if current user has viewed this story
      const hasViewed = story.views.some(view => 
        view.user && view.user._id && view.user._id.toString() === req.user._id.toString()
      );
      if (!hasViewed) {
        storiesByAuthor[authorId].hasUnviewed = true;
      }
      
      storiesByAuthor[authorId].stories.push(story);
    });
    
    // Convert to array and sort by latest story
    const groupedStories = Object.values(storiesByAuthor).sort((a, b) => {
      const latestA = Math.max(...a.stories.map(s => new Date(s.createdAt)));
      const latestB = Math.max(...b.stories.map(s => new Date(s.createdAt)));
      return latestB - latestA;
    });
    
    res.json(groupedStories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Error fetching stories', error: error.message });
  }
});

// Get a specific story
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'username fullName profilePicture')
      .populate('views.user', 'username fullName');
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ message: 'Error fetching story' });
  }
});

// Mark story as viewed
router.post('/:id/view', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    // Check if user already viewed this story
    const alreadyViewed = story.views.some(view => view.user.toString() === req.user._id.toString());
    
    if (!alreadyViewed) {
      story.views.push({ user: req.user._id });
      await story.save();
    }
    
    const updatedStory = await Story.findById(req.params.id)
      .populate('author', 'username fullName profilePicture')
      .populate('views.user', 'username fullName');
    
    res.json(updatedStory);
  } catch (error) {
    console.error('Error marking story as viewed:', error);
    res.status(500).json({ message: 'Error marking story as viewed' });
  }
});

// Delete a story
router.delete('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    // Check if user is the author of the story
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this story' });
    }
    
    await Story.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Error deleting story' });
  }
});

// Get story views
router.get('/:id/views', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('views.user', 'username fullName profilePicture');
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    // Check if user is the author of the story
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view story analytics' });
    }
    
    res.json(story.views);
  } catch (error) {
    console.error('Error fetching story views:', error);
    res.status(500).json({ message: 'Error fetching story views' });
  }
});

export default router;
