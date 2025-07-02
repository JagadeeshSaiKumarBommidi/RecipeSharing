import React, { useState } from 'react';
import { Home, Users, MessageCircle, User, Plus, Search, Bell, Gamepad2, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Feed } from './Feed';
import { Profile } from './Profile';
import { Friends } from './Friends';
import Chat from './Chat';
import { CreateRecipe } from './CreateRecipe';
import { Games } from './Games';
import { Shopping } from './Shopping';
import { Notification, NotificationItem } from './Notification';

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [lastNotifId, setLastNotifId] = useState(3);

  // Simulate real-time notifications
  React.useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => {
        // Randomly pick a type
        const types = ['friend_request', 'like', 'comment'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        const fromUser = ['Alice', 'Bob', 'Charlie', 'David'][Math.floor(Math.random() * 4)];
        const messages = {
          friend_request: 'sent you a friend request.',
          like: 'liked your post.',
          comment: 'commented on your post.'
        };
        const newNotif: NotificationItem = {
          id: (lastNotifId + 1).toString(),
          type,
          fromUser,
          message: messages[type],
          createdAt: new Date().toISOString(),
          read: false
        };
        setLastNotifId((id) => id + 1);
        return [newNotif, ...prev].slice(0, 10); // keep max 10
      });
    }, 15000); // every 15 seconds
    return () => clearInterval(interval);
  }, [lastNotifId]);

  // Mark all as read when notification bar is opened
  React.useEffect(() => {
    if (showNotifications) {
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    }
  }, [showNotifications]);

  // Only allow notifications from app users (friends, following, followers, or self)
  function isAppUser(fromUser: string) {
    if (!user) return false;
    if (fromUser === user.username) return true;
    if (user.friends && user.friends.includes(fromUser)) return true;
    if (user.following && user.following.includes(fromUser)) return true;
    if (user.followers && user.followers.includes(fromUser)) return true;
    return false;
  }

  const filteredNotifications = notifications.filter(n => isAppUser(n.fromUser));

  const tabs = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'friends', label: 'Search', icon: Users },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'shopping', label: 'Shop', icon: ShoppingCart },
    { id: 'chat', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed />;
      case 'friends':
        return <Friends />;
      case 'games':
        return <Games />;
      case 'shopping':
        return <Shopping />;
      case 'chat':
        return <Chat />;
      case 'profile':
        return <Profile />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Instagram-style Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                RecipeShare
              </h1>
            </div>

            {/* Search Bar - Instagram style */}
            <div className="hidden md:block flex-1 max-w-xs mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-1 focus:ring-gray-300 focus:bg-white text-gray-900 placeholder-gray-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Home Icon (Desktop) */}
              <button 
                onClick={() => setActiveTab('feed')}
                className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className={`w-6 h-6 ${activeTab === 'feed' ? 'text-black' : 'text-gray-700'}`} />
              </button>

              {/* Messages Icon (Desktop) */}
              <button 
                onClick={() => setActiveTab('chat')}
                className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MessageCircle className={`w-6 h-6 ${activeTab === 'chat' ? 'text-black' : 'text-gray-700'}`} />
              </button>

              {/* Create Post Button */}
              <button
                onClick={() => setShowCreateRecipe(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-6 h-6 text-gray-700" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowNotifications((v) => !v)}
                >
                  <Bell className="w-6 h-6 text-gray-700" />
                  {filteredNotifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {filteredNotifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 z-50">
                    <Notification notifications={filteredNotifications} />
                  </div>
                )}
              </div>

              {/* Profile Picture */}
              <div className="relative">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-gray-300 transition-all">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </button>
                    <button
                      onClick={() => setShowCreateRecipe(true)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center md:hidden"
                    >
                      <Plus className="w-4 h-4 mr-3" />
                      Create Post
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="hidden md:block w-64 bg-white shadow-sm h-screen sticky top-16 border-r border-gray-200">
          <div className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 md:ml-0">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex flex-col items-center py-3 transition-all ${
                  activeTab === tab.id
                    ? 'text-orange-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setShowCreateRecipe(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:shadow-3xl transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Recipe Modal */}
      {showCreateRecipe && (
        <CreateRecipe onClose={() => setShowCreateRecipe(false)} />
      )}
    </div>
  );
};