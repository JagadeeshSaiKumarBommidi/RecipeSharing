import React from 'react';
import { ChefHat, Users, MessageCircle, Heart, Camera, Video, Shield, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: "Share Your Recipes",
      description: "Upload delicious recipes with beautiful photos and step-by-step videos"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect with Foodies",
      description: "Make friends with fellow cooking enthusiasts and build your culinary community"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Chat with friends, share cooking tips, and exchange recipe ideas instantly"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "React & Engage",
      description: "Like, comment, and share your favorite recipes with the community"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Visual Storytelling",
      description: "Capture every step with high-quality photos that make recipes come alive"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Tutorials",
      description: "Create and watch cooking videos to master new techniques"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-level security and privacy controls"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Discover New Flavors",
      description: "Explore trending recipes and get personalized recommendations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl premium-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl premium-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl premium-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl premium-shadow-lg">
                <ChefHat className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Recipe<span className="premium-text-gradient">Share</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the ultimate culinary community where food lovers share recipes, connect with friends, and discover new flavors together
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 premium-shadow-lg hover:shadow-2xl premium-hover"
            >
              Get Started
              <Sparkles className="ml-3 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need for Culinary Success
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            From recipe sharing to community building, we've got all the tools to make your cooking journey amazing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group premium-bg-card rounded-2xl p-8 premium-shadow hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 premium-hover"
            >
              <div className="text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-200 group-hover:text-blue-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-blue-300/80 leading-relaxed group-hover:text-blue-200 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-20 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of food lovers who are already sharing, learning, and connecting through RecipeShare
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-12 py-4 text-lg font-semibold text-slate-900 bg-white rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 premium-shadow-lg premium-hover"
          >
            Join the Community
            <Users className="ml-3 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-12 border-t border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <ChefHat className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-blue-300/70">
            © 2025 RecipeShare. Bringing food lovers together, one recipe at a time.
          </p>
        </div>
      </div>
    </div>
  );
};