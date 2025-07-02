import React, { useState, useEffect } from 'react';
import { X, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Story {
  _id: string;
  content: string;
  image?: string;
  backgroundColor: string;
  textColor: string;
  font: string;
  author: {
    _id: string;
    username: string;
    fullName: string;
    profilePicture?: string;
  };
  views: Array<{
    user: {
      _id: string;
      username: string;
      fullName: string;
    };
    viewedAt: string;
  }>;
  createdAt: string;
  expiresAt: string;
}

interface StoryGroup {
  author: {
    _id: string;
    username: string;
    fullName: string;
    profilePicture?: string;
  };
  stories: Story[];
  hasUnviewed: boolean;
}

interface StoriesProps {
  onClose?: () => void;
}

export const Stories: React.FC<StoriesProps> = ({ onClose }) => {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [newStory, setNewStory] = useState({
    content: '',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    font: 'Arial'
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const backgroundColors = [
    '#000000', '#0f172a', '#1e293b', '#334155', '#0c1844', 
    '#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'
  ];

  const fonts = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana'];

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (storyGroups.length > 0 && currentGroupIndex < storyGroups.length) {
      const timer = setTimeout(() => {
        handleNext();
      }, 5000); // Auto advance every 5 seconds

      return () => clearTimeout(timer);
    }
  }, [currentGroupIndex, currentStoryIndex, storyGroups]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const currentGroup = storyGroups[currentGroupIndex];
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentGroupIndex < storyGroups.length - 1) {
      setCurrentGroupIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      // End of all stories
      onClose?.();
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
      const prevGroup = storyGroups[currentGroupIndex - 1];
      setCurrentStoryIndex(prevGroup.stories.length - 1);
    }
  };

  const markAsViewed = async (storyId: string) => {
    try {
      await fetch(`http://localhost:5000/api/stories/${storyId}/view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    }
  };

  const createStory = async () => {
    if (!newStory.content.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newStory)
      });

      if (response.ok) {
        setNewStory({ content: '', backgroundColor: '#000000', textColor: '#ffffff', font: 'Arial' });
        setShowCreateStory(false);
        fetchStories(); // Refresh stories
      }
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black flex items-center justify-center z-50">
        <div className="text-blue-100 text-lg font-medium">Loading stories...</div>
      </div>
    );
  }

  if (showCreateStory) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black z-50 flex flex-col">
        <div className="flex justify-between items-center p-6 text-blue-100 border-b border-blue-800/30">
          <button onClick={() => setShowCreateStory(false)} className="p-2 hover:bg-blue-800/30 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">Create Story</h2>
          <button 
            onClick={createStory}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-6 py-2 rounded-xl font-semibold text-white shadow-lg transition-all"
          >
            Share
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div 
            className="w-80 h-96 rounded-3xl flex items-center justify-center p-8 relative shadow-2xl border border-blue-400/20"
            style={{ 
              backgroundColor: newStory.backgroundColor,
              color: newStory.textColor,
              fontFamily: newStory.font
            }}
          >
            <textarea
              value={newStory.content}
              onChange={(e) => setNewStory(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share what's on your mind..."
              className="w-full h-full bg-transparent text-center text-xl resize-none outline-none placeholder-blue-300/60"
              style={{ color: newStory.textColor, fontFamily: newStory.font }}
            />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-t from-black to-slate-900 border-t border-blue-800/30">
          {/* Background Colors */}
          <div className="mb-6">
            <p className="text-blue-100 text-sm mb-3 font-medium">Background Color</p>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {backgroundColors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewStory(prev => ({ ...prev, backgroundColor: color }))}
                  className={`w-12 h-12 rounded-full border-3 shadow-lg transition-all ${
                    newStory.backgroundColor === color ? 'border-blue-400 scale-110' : 'border-blue-600/30 hover:border-blue-500/50'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Text Color */}
          <div className="mb-6">
            <p className="text-blue-100 text-sm mb-3 font-medium">Text Color</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setNewStory(prev => ({ ...prev, textColor: '#ffffff' }))}
                className={`w-10 h-10 rounded-full bg-white border-3 shadow-lg transition-all ${
                  newStory.textColor === '#ffffff' ? 'border-blue-400 scale-110' : 'border-blue-600/30 hover:border-blue-500/50'
                }`}
              />
              <button
                onClick={() => setNewStory(prev => ({ ...prev, textColor: '#60a5fa' }))}
                className={`w-10 h-10 rounded-full bg-blue-400 border-3 shadow-lg transition-all ${
                  newStory.textColor === '#60a5fa' ? 'border-blue-400 scale-110' : 'border-blue-600/30 hover:border-blue-500/50'
                }`}
              />
              <button
                onClick={() => setNewStory(prev => ({ ...prev, textColor: '#000000' }))}
                className={`w-10 h-10 rounded-full bg-black border-3 shadow-lg transition-all ${
                  newStory.textColor === '#000000' ? 'border-blue-400 scale-110' : 'border-blue-600/30 hover:border-blue-500/50'
                }`}
              />
            </div>
          </div>

          {/* Font */}
          <div>
            <p className="text-blue-100 text-sm mb-3 font-medium">Font Style</p>
            <select
              value={newStory.font}
              onChange={(e) => setNewStory(prev => ({ ...prev, font: e.target.value }))}
              className="bg-slate-800 text-blue-100 px-4 py-3 rounded-xl border border-blue-600/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
            >
              {fonts.map(font => (
                <option key={font} value={font} className="bg-slate-800">{font}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (storyGroups.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-2xl mb-6 bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent font-bold">No stories yet</p>
          <button
            onClick={() => setShowCreateStory(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-8 py-4 rounded-xl font-bold text-white shadow-xl transition-all transform hover:scale-105"
          >
            Create Your First Story
          </button>
        </div>
      </div>
    );
  }

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup.stories[currentStoryIndex];

  // Mark current story as viewed
  if (currentStory && currentStory.author._id !== user?.id) {
    markAsViewed(currentStory._id);
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 text-blue-100 relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-400 p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
              {currentGroup.author.profilePicture ? (
                <img
                  src={currentGroup.author.profilePicture}
                  alt={currentGroup.author.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-200 font-bold">
                  {currentGroup.author.fullName.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="font-bold text-blue-100">{currentGroup.author.fullName}</p>
            <p className="text-sm text-blue-300">
              {new Date(currentStory.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-blue-800/30 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress bars */}
      <div className="flex space-x-2 px-6 pb-4">
        {currentGroup.stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-blue-900/50 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-blue-400 to-blue-200 rounded-full transition-all duration-300 ${
                index < currentStoryIndex ? 'w-full' : 
                index === currentStoryIndex ? 'w-full animate-pulse' : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div 
        className="flex-1 flex items-center justify-center relative"
        style={{ backgroundColor: currentStory.backgroundColor }}
        onClick={handleNext}
      >
        <div 
          className="max-w-md w-full h-full flex items-center justify-center p-8 text-center"
          style={{ 
            color: currentStory.textColor,
            fontFamily: currentStory.font
          }}
        >
          {currentStory.image ? (
            <div className="relative w-full h-full">
              <img
                src={currentStory.image}
                alt="Story"
                className="w-full h-full object-cover rounded-lg"
              />
              {currentStory.content && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                  <p className="text-white text-xl font-bold text-center p-4">
                    {currentStory.content}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-2xl leading-relaxed break-words">
              {currentStory.content}
            </p>
          )}
        </div>

        {/* Navigation areas */}
        <div 
          className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
        />
        <div 
          className="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        />
      </div>

      {/* Story info */}
      {currentStory.author._id === user?.id && (
        <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-blue-100">
          <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-blue-600/30">
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="font-medium">{currentStory.views.length} views</span>
          </div>
        </div>
      )}
    </div>
  );
};
