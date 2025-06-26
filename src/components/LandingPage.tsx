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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl">
                <ChefHat className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Recipe<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Share</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the ultimate culinary community where food lovers share recipes, connect with friends, and discover new flavors together
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-full hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl"
            >
              Get Started
              <Sparkles className="ml-3 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Culinary Success
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From recipe sharing to community building, we've got all the tools to make your cooking journey amazing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="text-orange-600 mb-6 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-xl text-orange-100 mb-8 leading-relaxed">
            Join thousands of food lovers who are already sharing, learning, and connecting through RecipeShare
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-12 py-4 text-lg font-semibold text-orange-600 bg-white rounded-full hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-2xl"
          >
            Join the Community
            <Users className="ml-3 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <ChefHat className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-400">
            © 2025 RecipeShare. Bringing food lovers together, one recipe at a time.
          </p>
        </div>
      </div>
    </div>
  );
};