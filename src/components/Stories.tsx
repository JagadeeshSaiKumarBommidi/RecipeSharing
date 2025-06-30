import React, { useState, useEffect } from 'react';
import { Plus, X, Eye } from 'lucide-react';
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
    '#000000', '#1a1a1a', '#4a148c', '#1565c0', '#0d47a1',
    '#00695c', '#2e7d32', '#f57c00', '#d84315', '#c62828'
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
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white">Loading stories...</div>
      </div>
    );
  }

  if (showCreateStory) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 text-white">
          <button onClick={() => setShowCreateStory(false)} className="p-2">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <button 
            onClick={createStory}
            className="bg-blue-600 px-4 py-2 rounded-lg font-semibold"
          >
            Share
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div 
            className="w-80 h-96 rounded-2xl flex items-center justify-center p-6 relative"
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
              className="w-full h-full bg-transparent text-center text-xl resize-none outline-none placeholder-gray-300"
              style={{ color: newStory.textColor, fontFamily: newStory.font }}
            />
          </div>
        </div>

        <div className="p-4 bg-gray-900">
          {/* Background Colors */}
          <div className="mb-4">
            <p className="text-white text-sm mb-2">Background Color</p>
            <div className="flex space-x-2 overflow-x-auto">
              {backgroundColors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewStory(prev => ({ ...prev, backgroundColor: color }))}
                  className={`w-10 h-10 rounded-full border-2 ${
                    newStory.backgroundColor === color ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Text Color */}
          <div className="mb-4">
            <p className="text-white text-sm mb-2">Text Color</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setNewStory(prev => ({ ...prev, textColor: '#ffffff' }))}
                className={`w-8 h-8 rounded-full bg-white border-2 ${
                  newStory.textColor === '#ffffff' ? 'border-blue-500' : 'border-gray-300'
                }`}
              />
              <button
                onClick={() => setNewStory(prev => ({ ...prev, textColor: '#000000' }))}
                className={`w-8 h-8 rounded-full bg-black border-2 ${
                  newStory.textColor === '#000000' ? 'border-blue-500' : 'border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Font */}
          <div>
            <p className="text-white text-sm mb-2">Font</p>
            <select
              value={newStory.font}
              onChange={(e) => setNewStory(prev => ({ ...prev, font: e.target.value }))}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg"
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (storyGroups.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center text-white">
          <p className="text-xl mb-4">No stories yet</p>
          <button
            onClick={() => setShowCreateStory(true)}
            className="bg-blue-600 px-6 py-3 rounded-lg font-semibold"
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
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 text-white relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600">
            {currentGroup.author.profilePicture ? (
              <img
                src={currentGroup.author.profilePicture}
                alt={currentGroup.author.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                {currentGroup.author.fullName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold">{currentGroup.author.fullName}</p>
            <p className="text-sm text-gray-300">
              {new Date(currentStory.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress bars */}
      <div className="flex space-x-1 px-4 pb-2">
        {currentGroup.stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded">
            <div
              className={`h-full bg-white rounded transition-all duration-300 ${
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
        <div className="p-4 bg-black bg-opacity-50 text-white">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{currentStory.views.length} views</span>
          </div>
        </div>
      )}
    </div>
  );
};
