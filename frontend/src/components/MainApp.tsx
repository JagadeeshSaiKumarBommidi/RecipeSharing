import React, { useState } from 'react';
import { Home, Users, MessageCircle, User, Plus, Search, Bell, Menu, X, Gamepad2, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Feed } from './Feed';
import { Profile } from './Profile';
import { Friends } from './Friends';
import { Chat } from './Chat';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 shadow-2xl border-b border-blue-800/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">RecipeShare</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search recipes, users, or ingredients..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-blue-800/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-blue-300/70 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Create Recipe Button */}
              <button
                onClick={() => setShowCreateRecipe(true)}
                className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-blue-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all backdrop-blur-sm">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg"></span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-slate-800/50 rounded-xl transition-all backdrop-blur-sm"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden ring-2 ring-blue-400/30">
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
                  <span className="hidden sm:block font-medium text-blue-200">{user?.fullName}</span>
                </button>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl border border-blue-800/30 py-2 z-50 backdrop-blur-sm">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-blue-200 hover:bg-slate-800/50 flex items-center transition-colors"
                    >
                      <User className="w-5 h-5 mr-3" />
                      My Profile
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 flex items-center transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-blue-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all backdrop-blur-sm"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="hidden md:block w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl h-screen sticky top-16 border-r border-blue-800/30">
          <div className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-blue-200 hover:bg-slate-800/50 hover:text-white backdrop-blur-sm'
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 border-t border-blue-800/30 z-40 backdrop-blur-sm">
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
                    ? 'text-blue-300'
                    : 'text-blue-400/70'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Create Button */}
      <button
        onClick={() => setShowCreateRecipe(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:shadow-3xl transform hover:scale-110 transition-all"
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