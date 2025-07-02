import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, User, Clock, Users, Edit, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Stories } from './Stories';
import { StoryRing } from './StoryRing';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  images: string[];
  videos: string[];
  cookingTime: number;
  difficulty: string;
  category: string;
  author: {
    _id: string;
    username: string;
    fullName: string;
    profilePicture?: string;
  };
  likes: Array<{ user: string; createdAt: string }>;
  comments: Array<{
    _id: string;
    user: { username: string; fullName: string; profilePicture?: string };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
}

interface StoryGroup {
  author: {
    _id: string;
    username: string;
    fullName: string;
    profilePicture?: string;
  };
  stories: Array<{
    _id: string;
    content: string;
    backgroundColor: string;
    textColor: string;
    createdAt: string;
  }>;
  hasUnviewed: boolean;
}

export const Feed: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  // const [page, setPage] = useState(1);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', cookingTime: 0, difficulty: '', category: '' });
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [showStories, setShowStories] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchRecipes();
    fetchStories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/feed?limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stories/feed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStoryGroups(data);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleLike = async (recipeId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const updatedRecipe = await response.json();
        setRecipes(prev => prev.map(recipe => 
          recipe._id === recipeId ? updatedRecipe : recipe
        ));
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  const handleComment = async (recipeId: string) => {
    const commentText = commentTexts[recipeId];
    if (!commentText?.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: commentText })
      });

      if (response.ok) {
        const updatedRecipe = await response.json();
        setRecipes(prev => prev.map(recipe => 
          recipe._id === recipeId ? updatedRecipe : recipe
        ));
        setCommentTexts(prev => ({ ...prev, [recipeId]: '' }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const isLiked = (recipe: Recipe) => {
    return recipe.likes.some(like => like.user === user?.id);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe._id);
    setEditForm({
      title: recipe.title,
      description: recipe.description,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      category: recipe.category
    });
    setShowDropdown(null);
  };

  const handleSaveEdit = async (recipeId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedRecipe = await response.json();
        setRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe._id === recipeId ? updatedRecipe : recipe
          )
        );
        setEditingRecipe(null);
        setEditForm({ title: '', description: '', cookingTime: 0, difficulty: '', category: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update recipe');
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe');
    }
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
    setEditForm({ title: '', description: '', cookingTime: 0, difficulty: '', category: '' });
  };

  const handleDelete = async (recipeId: string) => {
    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId));
        setShowDropdown(null);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  const isAuthor = (recipe: Recipe) => {
    return recipe.author._id === user?.id;
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse">
            <div className="p-4 flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/6"></div>
              </div>
            </div>
            <div className="h-80 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto flex gap-6 p-4 pb-20 md:pb-4">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 space-y-6">
          {/* Quick Actions */}
          <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-blue-200 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all">
                <Heart className="w-5 h-5" />
                <span>Liked Recipes</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-blue-200 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all">
                <Bookmark className="w-5 h-5" />
                <span>Saved Recipes</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-blue-200 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all">
                <Users className="w-5 h-5" />
                <span>My Followers</span>
              </button>
            </div>
          </div>

          {/* Trending Categories */}
          <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Trending Categories</h3>
            <div className="space-y-2">
              {['Italian', 'Asian Fusion', 'Desserts', 'Healthy', 'Quick Meals'].map((category) => (
                <button key={category} className="w-full text-left p-2 text-blue-200 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
                  #{category}
                </button>
              ))}
            </div>
          </div>

          {/* Recipe Stats */}
          <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Recipes Posted</span>
                <span className="text-white font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Total Likes</span>
                <span className="text-white font-semibold">284</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Followers</span>
                <span className="text-white font-semibold">67</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
          {/* Stories Section */}
          <div className="mb-8">
            <div className="flex space-x-4 overflow-x-auto py-4 scrollbar-hide bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
              {/* Add Your Story */}
              <StoryRing
                author={{
                  _id: user?.id || '',
                  username: user?.username || '',
                  fullName: user?.fullName || '',
                  profilePicture: user?.profilePicture
                }}
                hasUnviewed={false}
                isOwn={true}
                onClick={() => setShowCreateStory(true)}
              />
              
              {/* Friends' Stories */}
              {storyGroups.map((storyGroup) => (
                <StoryRing
                  key={storyGroup.author._id}
                  author={storyGroup.author}
                  hasUnviewed={storyGroup.hasUnviewed}
                  onClick={() => setShowStories(true)}
                />
              ))}
            </div>
          </div>

      {/* Stories Viewer */}
      {showStories && (
        <Stories onClose={() => setShowStories(false)} />
      )}

      {/* Create Story Modal */}
      {showCreateStory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 w-96 max-w-[90vw] border border-blue-600/30 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">Create Story</h2>
              <button
                onClick={() => setShowCreateStory(false)}
                className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-blue-200" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="w-full h-48 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 rounded-2xl flex items-center justify-center p-6 mb-4 border border-blue-500/30">
                <textarea
                  placeholder="Share what's on your mind..."
                  className="w-full h-full bg-transparent text-blue-100 text-center text-lg resize-none outline-none placeholder-blue-300/60"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateStory(false)}
                className="flex-1 px-6 py-3 border border-slate-600 text-blue-200 rounded-xl hover:bg-slate-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // Simple story creation - can be enhanced later
                  setShowCreateStory(false);
                  await fetchStories(); // Refresh stories
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
              >
                Share Story
              </button>
            </div>
          </div>
        </div>
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes yet!</h3>
          <p className="text-gray-600 mb-6">Follow other users or create your first recipe to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recipes.map((recipe) => (
            <article key={recipe._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    {recipe.author.profilePicture ? (
                      <img
                        src={recipe.author.profilePicture}
                        alt={recipe.author.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{recipe.author.fullName}</h3>
                    <p className="text-sm text-gray-500">@{recipe.author.username}</p>
                  </div>
                </div>
                <div className="relative dropdown-container">
                  <button 
                    onClick={() => setShowDropdown(showDropdown === recipe._id ? null : recipe._id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </button>
                  {showDropdown === recipe._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      {isAuthor(recipe) && (
                        <>
                          <button
                            onClick={() => handleEdit(recipe)}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Recipe
                          </button>
                          <button
                            onClick={() => handleDelete(recipe._id)}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Recipe
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setShowDropdown(null)}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share Recipe
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Media */}
              {recipe.images.length > 0 && (
                <div className="aspect-square bg-gray-100">
                  <img
                    src={recipe.images[0]}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(recipe._id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        isLiked(recipe) ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isLiked(recipe) ? 'fill-current' : ''}`} />
                      <span className="font-medium">{recipe.likes.length}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                      <span className="font-medium">{recipe.comments.length}</span>
                    </button>
                    <button className="text-gray-700 hover:text-green-500 transition-colors">
                      <Share className="w-6 h-6" />
                    </button>
                  </div>
                  <button className="text-gray-700 hover:text-yellow-500 transition-colors">
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>

                {/* Recipe Info */}
                <div className="mb-4">
                  {editingRecipe === recipe._id ? (
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full text-xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Recipe title..."
                        />
                      </div>
                      <div>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Recipe description..."
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input
                            type="number"
                            value={editForm.cookingTime}
                            onChange={(e) => setEditForm(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 0 }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Minutes"
                            min="1"
                          />
                        </div>
                        <div>
                          <select
                            value={editForm.difficulty}
                            onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                        <div>
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Snack">Snack</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(recipe._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h2>
                      <p className="text-gray-700 mb-3">{recipe.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {recipe.cookingTime} mins
                        </div>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-lg font-medium">
                          {recipe.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
                          {recipe.category}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Comments */}
                {recipe.comments.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {recipe.comments.slice(0, 2).map((comment) => (
                      <div key={comment._id} className="flex space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                          {comment.user.profilePicture ? (
                            <img
                              src={comment.user.profilePicture}
                              alt={comment.user.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold text-gray-900">{comment.user.username}</span>{' '}
                            <span className="text-gray-700">{comment.text}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentTexts[recipe._id] || ''}
                      onChange={(e) => setCommentTexts(prev => ({ ...prev, [recipe._id]: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleComment(recipe._id)}
                    />
                    <button
                      onClick={() => handleComment(recipe._id)}
                      className="px-4 py-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit Recipe */}
              {editingRecipe === recipe._id && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex flex-col space-y-4">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      placeholder="Recipe title"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      placeholder="Recipe description"
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-x-4">
                      <input
                        type="number"
                        value={editForm.cookingTime}
                        onChange={(e) => setEditForm(prev => ({ ...prev, cookingTime: Number(e.target.value) }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        placeholder="Cooking time (mins)"
                      />
                      <input
                        type="text"
                        value={editForm.difficulty}
                        onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        placeholder="Difficulty level"
                      />
                    </div>
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      placeholder="Category"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(recipe._id)}
                        className="flex-1 px-4 py-2 text-sm font-semibold bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dropdown Menu for Author */}
              {isAuthor(recipe) && showDropdown === recipe._id && (
                <div className="absolute right-4 top-16 w-48 bg-white rounded-lg shadow-md overflow-hidden z-10">
                  <button
                    onClick={() => handleEdit(recipe)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                  </button>
                </div>
              )}

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDropdown(prev => (prev === recipe._id ? null : recipe._id))}
                  className="w-full text-left flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span>More options</span>
                </button>
            </div>
          )}

          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No recipes yet!</h3>
              <p className="text-blue-200 mb-6">Follow other users or create your first recipe to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {recipes.map((recipe) => (
                <article key={recipe._id} className="premium-bg-card rounded-2xl premium-shadow border border-slate-700/50 overflow-hidden backdrop-blur-xl">
                  {/* Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-700 rounded-full overflow-hidden ring-2 ring-blue-500/30">
                        {recipe.author.profilePicture ? (
                          <img
                            src={recipe.author.profilePicture}
                            alt={recipe.author.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{recipe.author.fullName}</h3>
                        <p className="text-sm text-blue-300">@{recipe.author.username}</p>
                      </div>
                    </div>
                    <div className="relative dropdown-container">
                      <button 
                        onClick={() => setShowDropdown(showDropdown === recipe._id ? null : recipe._id)}
                        className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5 text-blue-300" />
                      </button>
                      {showDropdown === recipe._id && (
                        <div className="absolute right-0 mt-2 w-48 premium-bg-card rounded-lg premium-shadow border border-slate-600/50 z-10 backdrop-blur-xl">
                          {isAuthor(recipe) && (
                            <>
                              <button
                                onClick={() => handleEdit(recipe)}
                                className="w-full flex items-center px-4 py-2 text-sm text-blue-200 hover:bg-slate-700/50 transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Recipe
                              </button>
                              <button
                                onClick={() => handleDelete(recipe._id)}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Recipe
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recipe Images */}
                  {recipe.images && recipe.images.length > 0 && (
                    <div className="relative">
                      <img
                        src={recipe.images[0]}
                        alt={recipe.title}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  )}

                  {/* Recipe Content */}
                  <div className="p-4">
                    <div className="flex items-center space-x-4 mb-3 text-sm text-blue-300">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.cookingTime} mins</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">
                        {recipe.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">
                        {recipe.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">{recipe.title}</h2>
                    <p className="text-blue-200 mb-4 leading-relaxed">{recipe.description}</p>

                    {/* Recipe Actions */}
                    <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(recipe._id)}
                          className={`flex items-center space-x-2 transition-all ${
                            recipe.likes.some(like => like.user === user?.id)
                              ? 'text-red-400'
                              : 'text-blue-300 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${recipe.likes.some(like => like.user === user?.id) ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">{recipe.likes.length}</span>
                        </button>

                        <button className="flex items-center space-x-2 text-blue-300 hover:text-white transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{recipe.comments.length}</span>
                        </button>

                        <button className="flex items-center space-x-2 text-blue-300 hover:text-white transition-colors">
                          <Share className="w-5 h-5" />
                        </button>
                      </div>

                      <button className="text-blue-300 hover:text-white transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Comments */}
                    {recipe.comments.length > 0 && (
                      <div className="mt-4 space-y-3 border-t border-slate-700/50 pt-4">
                        {recipe.comments.slice(0, 2).map((comment) => (
                          <div key={comment._id} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-slate-700 rounded-full overflow-hidden">
                              {comment.user.profilePicture ? (
                                <img
                                  src={comment.user.profilePicture}
                                  alt={comment.user.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-blue-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-semibold text-white">{comment.user.fullName}</span>
                                <span className="text-blue-200 ml-2">{comment.text}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="mt-4 border-t border-slate-700/50 pt-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full overflow-hidden">
                          {user?.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-400" />
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          value={commentTexts[recipe._id] || ''}
                          onChange={(e) => setCommentTexts(prev => ({ ...prev, [recipe._id]: e.target.value }))}
                          placeholder="Add a comment..."
                          className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/50 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-blue-300/50 backdrop-blur-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleComment(recipe._id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleComment(recipe._id)}
                          className="px-4 py-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Edit Recipe */}
                  {editingRecipe === recipe._id && (
                    <div className="p-4 border-t border-slate-700/50">
                      <div className="flex flex-col space-y-4">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-blue-300/50"
                          placeholder="Recipe title"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-blue-300/50"
                          placeholder="Recipe description"
                          rows={3}
                        />
                        <div className="grid grid-cols-2 gap-x-4">
                          <input
                            type="number"
                            value={editForm.cookingTime}
                            onChange={(e) => setEditForm(prev => ({ ...prev, cookingTime: Number(e.target.value) }))}
                            className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-blue-300/50"
                            placeholder="Cooking time (mins)"
                          />
                          <input
                            type="text"
                            value={editForm.difficulty}
                            onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value }))}
                            className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-blue-300/50"
                            placeholder="Difficulty level"
                          />
                        </div>
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                          className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-blue-300/50"
                          placeholder="Category"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit(recipe._id)}
                            className="flex-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 px-4 py-2 text-sm font-semibold bg-slate-700 text-blue-200 rounded-lg hover:bg-slate-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 space-y-6">
          {/* Suggested Friends */}
          <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Suggested Friends</h3>
            <div className="space-y-4">
              {[
                { name: 'Sarah Wilson', username: 'sarahcooks', recipes: 24 },
                { name: 'Mike Chen', username: 'mikekitchen', recipes: 18 },
                { name: 'Emma Davis', username: 'emmabakes', recipes: 31 }
              ].map((friend) => (
                <div key={friend.username} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{friend.name}</p>
                      <p className="text-blue-300 text-xs">{friend.recipes} recipes</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs rounded-full hover:from-blue-700 hover:to-blue-600 transition-all">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Challenge */}
          <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Challenge</h3>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Comfort Food Week</h4>
              <p className="text-blue-200 text-sm mb-4">Share your favorite comfort food recipe and win prizes!</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all text-sm font-semibold">
                Join Challenge
              </button>
            </div>
          </div>

          {/* Popular Recipes */}
          <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Popular This Week</h3>
            <div className="space-y-3">
              {[
                { title: 'Creamy Pasta Carbonara', likes: 142 },
                { title: 'Korean BBQ Tacos', likes: 128 },
                { title: 'Chocolate Lava Cake', likes: 156 }
              ].map((recipe, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-slate-700/30 rounded-lg transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{recipe.title}</p>
                    <p className="text-blue-300 text-xs">{recipe.likes} likes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Tips */}
          <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">💡 Pro Tip</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              "Always taste your food as you cook! Seasoning should be adjusted throughout the cooking process, not just at the end."
            </p>
            <p className="text-blue-300 text-xs mt-2">- Chef Maria Rodriguez</p>
          </div>
        </div>
      </div>
    </div>
  );
};