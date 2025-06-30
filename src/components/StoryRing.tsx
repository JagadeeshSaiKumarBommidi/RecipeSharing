import React from 'react';
import { Plus, User } from 'lucide-react';

interface StoryRingProps {
  author: {
    _id: string;
    username: string;
    fullName: string;
    profilePicture?: string;
  };
  hasUnviewed: boolean;
  isOwn?: boolean;
  onClick: () => void;
}

export const StoryRing: React.FC<StoryRingProps> = ({ 
  author, 
  hasUnviewed, 
  isOwn = false, 
  onClick 
}) => {
  return (
    <div className="flex flex-col items-center space-y-2 cursor-pointer" onClick={onClick}>
      <div className={`relative w-16 h-16 rounded-full p-1 ${
        hasUnviewed 
          ? 'bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-600' 
          : 'bg-gray-300'
      }`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 relative">
            {author.profilePicture ? (
              <img
                src={author.profilePicture}
                alt={author.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <User className="w-6 h-6 text-gray-600" />
              </div>
            )}
            {isOwn && (
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                <Plus className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-700 text-center max-w-16 truncate">
        {isOwn ? 'Your Story' : author.fullName.split(' ')[0]}
      </span>
    </div>
  );
};
