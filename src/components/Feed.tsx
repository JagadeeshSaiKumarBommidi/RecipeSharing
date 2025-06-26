import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, User, Clock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

export const Feed: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const { user } = useAuth();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/feed?page=${page}&limit=10`, {
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
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
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
            </article>
          ))}
        </div>
      )}
    </div>
  );
};