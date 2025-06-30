import express from 'express';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

const router = express.Router();

// Create recipe
router.post('/', async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      author: req.user._id
    };
    
    const recipe = new Recipe(recipeData);
    await recipe.save();
    
    // Add recipe to user's recipes array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { recipes: recipe._id }
    });
    
    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate('author', 'username fullName profilePicture');
    
    res.status(201).json(populatedRecipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Error creating recipe' });
  }
});

// Get all recipes (feed)
router.get('/feed', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find({ isPublic: true })
      .populate('author', 'username fullName profilePicture')
      .populate('likes.user', 'username fullName')
      .populate('comments.user', 'username fullName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username fullName profilePicture')
      .populate('likes.user', 'username fullName')
      .populate('comments.user', 'username fullName profilePicture');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe' });
  }
});

// Like/Unlike recipe
router.post('/:id/like', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const existingLike = recipe.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );
    
    if (existingLike) {
      // Unlike
      recipe.likes = recipe.likes.filter(
        like => like.user.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      recipe.likes.push({ user: req.user._id });
    }
    
    await recipe.save();
    
    const updatedRecipe = await Recipe.findById(req.params.id)
      .populate('author', 'username fullName profilePicture')
      .populate('likes.user', 'username fullName');
    
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error updating like' });
  }
});

// Add comment
router.post('/:id/comment', async (req, res) => {
  try {
    const { text } = req.body;
    
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    recipe.comments.push({
      user: req.user._id,
      text
    });
    
    await recipe.save();
    
    const updatedRecipe = await Recipe.findById(req.params.id)
      .populate('author', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture');
    
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Get user's recipes
router.get('/user/:userId', async (req, res) => {
  try {
    const recipes = await Recipe.find({ 
      author: req.params.userId,
      isPublic: true 
    })
    .populate('author', 'username fullName profilePicture')
    .sort({ createdAt: -1 });
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user recipes' });
  }
});

// Update recipe
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if user is the author of the recipe
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('author', 'username fullName profilePicture')
     .populate('likes.user', 'username fullName')
     .populate('comments.user', 'username fullName profilePicture');
    
    res.json(updatedRecipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Error updating recipe' });
  }
});

// Delete recipe
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if user is the author of the recipe
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }
    
    // Remove recipe from user's recipes array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { recipes: recipe._id }
    });
    
    // Delete the recipe
    await Recipe.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
});

export default router;