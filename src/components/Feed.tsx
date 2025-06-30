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
    <div className="max-w-2xl mx-auto p-4 pb-20 md:pb-4">
      {/* Stories Section */}
      <div className="mb-6">
        <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Story</h2>
              <button
                onClick={() => setShowCreateStory(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center p-4 mb-4">
                <textarea
                  placeholder="Share what's on your mind..."
                  className="w-full h-full bg-transparent text-white text-center text-lg resize-none outline-none placeholder-gray-200"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateStory(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // Simple story creation - can be enhanced later
                  setShowCreateStory(false);
                  await fetchStories(); // Refresh stories
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
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
            </article>
          ))}
        </div>
      )}
    </div>
  );
};