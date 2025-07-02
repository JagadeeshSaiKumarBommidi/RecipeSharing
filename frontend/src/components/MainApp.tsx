import React, { useState } from 'react';
import { Home, Users, MessageCircle, User, Plus, Search, Bell, Menu, Gamepad2, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Feed } from './Feed';
import { Profile } from './Profile';
import { Friends } from './Friends';
import Chat from './Chat';
import { CreateRecipe } from './CreateRecipe';
import { Games } from './Games';
import { Shopping } from './Shopping';

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
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
      {/* Modern Header with consistent design */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  RecipeShare
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:block flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search recipes, users, or ingredients..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-500 transition-all"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Mobile Search Toggle */}
              <button className="lg:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
                <Search className="w-5 h-5" />
              </button>

              {/* Create Recipe Button */}
              <button
                onClick={() => setShowCreateRecipe(true)}
                className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">Create</span>
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  3
                </span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full overflow-hidden ring-2 ring-orange-200">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:block font-medium text-gray-700 text-sm">{user?.fullName}</span>
                  <Menu className="w-4 h-4 text-gray-600 lg:hidden" />
                </button>

                {/* Dropdown Menu */}
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                    >
                      <User className="w-5 h-5 mr-3" />
                      My Profile
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      Logout
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