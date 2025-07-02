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
    <div className="flex flex-col items-center space-y-3 cursor-pointer group" onClick={onClick}>
      <div className={`relative w-20 h-20 rounded-full p-1 transition-all duration-300 ${
        hasUnviewed 
          ? 'bg-gradient-to-tr from-blue-600 via-blue-400 to-blue-200 shadow-lg shadow-blue-400/25' 
          : 'bg-gradient-to-tr from-slate-600 to-slate-500'
      } ${isOwn ? 'ring-2 ring-blue-400/50 ring-offset-2 ring-offset-slate-900' : ''} group-hover:scale-105`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 p-0.5">
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 relative border border-slate-700">
            {author.profilePicture ? (
              <img
                src={author.profilePicture}
                alt={author.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                <User className="w-7 h-7 text-blue-300" />
              </div>
            )}
            {isOwn && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                <Plus className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
      <span className="text-xs text-blue-200 text-center max-w-20 truncate font-medium">
        {isOwn ? 'Your Story' : author.fullName.split(' ')[0]}
      </span>
    </div>
  );
};
