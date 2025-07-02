import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, UserCheck, Users, Search, X, Check } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface FriendRequest {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
}

interface Friend {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  bio?: string;
}

export const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<{ received: FriendRequest[]; sent: FriendRequest[] }>({ received: [], sent: [] });
  const [suggestions, setSuggestions] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
    fetchSuggestions();
  }, []);

  const searchUsers = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS.SEARCH(searchQuery), {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchUsers]);

  const fetchFriends = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.FRIENDS.LIST, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.FRIENDS.REQUESTS, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS.SUGGESTIONS, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.FRIENDS.REQUEST(userId), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        fetchFriendRequests();
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const acceptFriendRequest = async (userId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.FRIENDS.ACCEPT(userId), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        fetchFriends();
        fetchFriendRequests();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (userId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.FRIENDS.REJECT(userId), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        fetchFriendRequests();
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const UserCard: React.FC<{ 
    user: Friend | FriendRequest; 
    type: 'friend' | 'request' | 'suggestion' | 'search';
    onAction?: (userId: string, action: string) => void;
  }> = ({ user, type, onAction }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{user.fullName}</h3>
          <p className="text-xs sm:text-sm text-gray-500 truncate">@{user.username}</p>
          {'bio' in user && user.bio && (
            <p className="text-xs text-gray-400 mt-1 truncate line-clamp-2">{user.bio}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {type === 'friend' && (
            <button className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors">
              <UserCheck className="w-5 h-5" />
            </button>
          )}
          {type === 'request' && (
            <>
              <button
                onClick={() => onAction?.(user._id, 'accept')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                title="Accept"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => onAction?.(user._id, 'reject')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Reject"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
          {(type === 'suggestion' || type === 'search') && (
            <button
              onClick={() => onAction?.(user._id, 'send')}
              className="flex items-center px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all text-sm font-medium shadow-lg"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const handleUserAction = (userId: string, action: string) => {
    switch (action) {
      case 'send':
        sendFriendRequest(userId);
        break;
      case 'accept':
        acceptFriendRequest(userId);
        break;
      case 'reject':
        rejectFriendRequest(userId);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Friends</h1>
          <p className="text-gray-600 text-sm sm:text-base">Connect with fellow food enthusiasts</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
            <div className="space-y-3">
              {searchResults.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  type="search"
                  onAction={handleUserAction}
                />
              ))}
            </div>
          </div>
        )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: 'friends', label: 'My Friends', count: friends.length },
            { id: 'requests', label: 'Requests', count: friendRequests.received.length },
            { id: 'suggestions', label: 'Suggestions', count: suggestions.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center py-3 px-2 sm:px-4 rounded-xl font-medium transition-all text-xs sm:text-sm ${
                activeTab === tab.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="truncate">{tab.label}</span>
              {tab.count > 0 && (
                <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-semibold min-w-[1.25rem] sm:min-w-[1.5rem] text-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'friends' && (
          <>
            {friends.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No friends yet</h3>
                <p className="text-gray-600 mb-6">Start connecting with other food lovers!</p>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all font-semibold"
                >
                  Find Friends
                </button>
              </div>
            ) : (
              friends.map((friend) => (
                <UserCard key={friend._id} user={friend} type="friend" />
              ))
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            {friendRequests.received.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No friend requests</h3>
                <p className="text-gray-600">New friend requests will appear here.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Pending Requests</h3>
                {friendRequests.received.map((request) => (
                  <UserCard
                    key={request._id}
                    user={request}
                    type="request"
                    onAction={handleUserAction}
                  />
                ))}
              </>
            )}
          </>
        )}

        {activeTab === 'suggestions' && (
          <>
            {suggestions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No suggestions available</h3>
                <p className="text-gray-600">Check back later for new friend suggestions!</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">People You Might Know</h3>
                {suggestions.map((suggestion) => (
                  <UserCard
                    key={suggestion._id}
                    user={suggestion}
                    type="suggestion"
                    onAction={handleUserAction}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
};