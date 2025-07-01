import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, User, Clock, Users, Trophy, Plus } from 'lucide-react';
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
  isSaved?: boolean;
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

interface Challenge {
  _id: string;
  title: string;
  description: string;
  emoji: string;
  startDate: string;
  endDate: string;
  prize: string;
  participantsCount: number;
  isActive: boolean;
}

interface SuggestedUser {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  recipeCount: number;
}

interface UserStats {
  recipesPosted: number;
  totalLikes: number;
  followersCount: number;
}

export const Feed: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [showStories, setShowStories] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    recipesPosted: 0,
    totalLikes: 0,
    followersCount: 0
  });
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  
  const { user } = useAuth();

  useEffect(() => {
    fetchRecipes();
    fetchStories();
    fetchCurrentChallenge();
    fetchSuggestedUsers();
    fetchSavedRecipes();
    if (user?.id) {
      fetchUserStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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

  const fetchCurrentChallenge = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/challenges/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentChallenge(data);
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/suggestions/new', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const usersWithRecipeCount = await Promise.all(
          data.map(async (user: SuggestedUser) => {
            try {
              const recipesResponse = await fetch(`http://localhost:5000/api/recipes/user/${user._id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              const recipes = recipesResponse.ok ? await recipesResponse.json() : [];
              return {
                ...user,
                recipeCount: recipes.length
              };
            } catch {
              return {
                ...user,
                recipeCount: 0
              };
            }
          })
        );
        setSuggestedUsers(usersWithRecipeCount.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const fetchUserStats = async () => {
    if (!user?.id) return;
    
    try {
      const recipesResponse = await fetch(`http://localhost:5000/api/recipes/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      let recipesPosted = 0;
      let totalLikes = 0;
      
      if (recipesResponse.ok) {
        const recipes = await recipesResponse.json();
        recipesPosted = recipes.length;
        totalLikes = recipes.reduce((sum: number, recipe: Recipe) => sum + (recipe.likes?.length || 0), 0);
      }
      
      const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      let followersCount = 0;
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        followersCount = profile.followers?.length || 0;
      }
      
      setUserStats({
        recipesPosted,
        totalLikes,
        followersCount
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recipes/saved', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedRecipes(new Set(data.map((recipe: Recipe) => recipe._id)));
      }
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
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

  const handleSave = async (recipeId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.saved) {
          setSavedRecipes(prev => new Set([...prev, recipeId]));
        } else {
          setSavedRecipes(prev => {
            const newSet = new Set(prev);
            newSet.delete(recipeId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleShare = async (recipe: Recipe) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href + `?recipe=${recipe._id}`
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      const shareText = `Check out this recipe: ${recipe.title}\n${recipe.description}\n${window.location.href}?recipe=${recipe._id}`;
      navigator.clipboard.writeText(shareText);
      setShowShareModal(recipe._id);
      setTimeout(() => setShowShareModal(null), 2000);
    }
  };

  const handleJoinChallenge = async () => {
    if (!currentChallenge) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/challenges/${currentChallenge._id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        // Refresh challenge data
        fetchCurrentChallenge();
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const handleFollowUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setSuggestedUsers(prev => prev.filter(user => user._id !== userId));
        await fetchSuggestedUsers();
      }
    } catch (error) {
      console.error('Error following user:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto flex gap-6 p-4 pb-20 md:pb-4">
          <div className="hidden lg:block w-64">
            <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl animate-pulse">
              <div className="h-6 bg-slate-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="premium-bg-card rounded-2xl premium-shadow animate-pulse backdrop-blur-xl">
                <div className="p-4 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="h-80 bg-slate-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden xl:block w-80">
            <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl animate-pulse">
              <div className="h-6 bg-slate-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto flex gap-6 p-4 pb-20 md:pb-4">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 space-y-6">
          {/* Your Stats */}
          <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Recipes Posted</span>
                <span className="text-white font-semibold">{userStats.recipesPosted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Total Likes</span>
                <span className="text-white font-semibold">{userStats.totalLikes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Followers</span>
                <span className="text-white font-semibold">{userStats.followersCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
          {/* Stories Section */}
          {storyGroups.length > 0 && (
            <div className="premium-bg-card rounded-2xl p-4 mb-6 premium-shadow backdrop-blur-xl">
              <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                <button
                  className="flex-shrink-0 flex flex-col items-center space-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-dashed border-blue-400">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-blue-200">Your Story</span>
                </button>
                {storyGroups.map((group) => (
                  <StoryRing
                    key={group.author._id}
                    author={group.author}
                    hasUnviewed={group.hasUnviewed}
                    onClick={() => setShowStories(true)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recipes */}
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
                    <button className="p-2 hover:bg-slate-700/50 rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-blue-300" />
                    </button>
                  </div>

                  {/* Media */}
                  {recipe.images.length > 0 && (
                    <div className="aspect-square bg-slate-800 relative">
                      <img
                        src={recipe.images[0]}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                      {showShareModal === recipe._id && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                          Link copied!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recipe Content */}
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-white mb-2">{recipe.title}</h2>
                    <p className="text-blue-200 mb-4 leading-relaxed">{recipe.description}</p>
                    
                    {/* Recipe Meta */}
                    <div className="flex items-center space-x-4 text-sm text-blue-300 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {recipe.cookingTime} mins
                      </div>
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-lg font-medium">
                        {recipe.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg font-medium">
                        {recipe.category}
                      </span>
                    </div>

                    {/* Actions */}
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

                        <button 
                          onClick={() => handleShare(recipe)}
                          className="flex items-center space-x-2 text-blue-300 hover:text-white transition-colors"
                        >
                          <Share className="w-5 h-5" />
                        </button>
                      </div>

                      <button 
                        onClick={() => handleSave(recipe._id)}
                        className={`transition-colors ${
                          savedRecipes.has(recipe._id) 
                            ? 'text-yellow-400' 
                            : 'text-blue-300 hover:text-yellow-400'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${savedRecipes.has(recipe._id) ? 'fill-current' : ''}`} />
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
              {suggestedUsers.length === 0 ? (
                <div className="text-center py-4">
                  <User className="w-12 h-12 text-blue-300 mx-auto mb-2" />
                  <p className="text-blue-200 text-sm">No suggestions available</p>
                </div>
              ) : (
                suggestedUsers.map((friend) => (
                  <div key={friend.username} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden">
                        {friend.profilePicture ? (
                          <img
                            src={friend.profilePicture}
                            alt={friend.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{friend.fullName}</p>
                        <p className="text-blue-300 text-xs">{friend.recipeCount} recipes</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFollowUser(friend._id)}
                      className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs rounded-full hover:from-blue-700 hover:to-blue-600 transition-all"
                    >
                      Follow
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly Challenge */}
          <div className="premium-bg-card rounded-2xl p-6 premium-shadow backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Challenge</h3>
            {currentChallenge ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">{currentChallenge.emoji}</span>
                </div>
                <h4 className="text-white font-semibold mb-2">{currentChallenge.title}</h4>
                <p className="text-blue-200 text-sm mb-4">{currentChallenge.description}</p>
                <div className="flex items-center justify-center space-x-2 text-blue-300 text-xs mb-4">
                  <Users className="w-4 h-4" />
                  <span>{currentChallenge.participantsCount} participants</span>
                </div>
                <button 
                  onClick={handleJoinChallenge}
                  className="w-full px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all text-sm font-semibold"
                >
                  Join Challenge
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">No Active Challenge</h4>
                <p className="text-blue-200 text-sm">Check back soon for new challenges!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stories Modal */}
      {showStories && (
        <Stories
          onClose={() => setShowStories(false)}
        />
      )}
    </div>
  );
};