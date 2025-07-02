import React, { useState } from 'react';
import { Camera, User, FileText, Check, SkipBack as Skip, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfileSetupPage: React.FC = () => {
  const { user, updateUser, completeSetup } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileData(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        completeSetup();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    completeSetup();
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      updateProfile();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl premium-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl premium-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold premium-text-gradient mb-2">Complete Your Profile</h1>
          <p className="text-blue-200 text-lg">Let's personalize your RecipeShare experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white premium-shadow' : 'bg-slate-700 text-blue-300'} mr-4 transition-all duration-300`}>
              {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className={`h-1 w-16 ${step > 1 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-700'} mr-4 transition-all duration-300`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white premium-shadow' : 'bg-slate-700 text-blue-300'} transition-all duration-300`}>
              2
            </div>
          </div>
          <div className="flex justify-center space-x-20 text-sm text-blue-300">
            <span className={step >= 1 ? 'text-blue-400 font-semibold' : ''}>Profile Photo</span>
            <span className={step >= 2 ? 'text-blue-400 font-semibold' : ''}>Bio</span>
          </div>
        </div>

        <div className="premium-bg-card rounded-2xl premium-shadow-lg p-8 backdrop-blur-xl">
          {step === 1 ? (
            <div className="text-center">
              <div className="mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl inline-block premium-shadow mb-4">
                  <Camera className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Add Your Profile Photo</h2>
                <p className="text-blue-200">Help others recognize you in the community</p>
              </div>

              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-slate-700 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-blue-500/30 premium-shadow">
                    {profileData.profilePicture ? (
                      <img
                        src={profileData.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-blue-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-full cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all premium-shadow">
                    <Upload className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSkip}
                  className="flex-1 px-6 py-3 border border-blue-800/30 text-blue-300 rounded-xl hover:bg-slate-800/50 transition-all font-semibold backdrop-blur-sm"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all font-semibold premium-shadow hover:shadow-2xl transform hover:scale-105"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl inline-block premium-shadow mb-4">
                  <FileText className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Tell Us About Yourself</h2>
                <p className="text-blue-200">Share what makes you passionate about cooking</p>
              </div>

              <div className="mb-8">
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="I love experimenting with fusion cuisines and sharing family recipes that have been passed down through generations..."
                  className="w-full h-32 p-4 bg-slate-800/50 border border-blue-800/30 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder-blue-300/50 backdrop-blur-sm"
                  maxLength={500}
                />
                <p className="text-sm text-blue-300 mt-2">{profileData.bio.length}/500 characters</p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSkip}
                  className="flex-1 px-6 py-3 border border-blue-800/30 text-blue-300 rounded-xl hover:bg-slate-800/50 transition-all font-semibold backdrop-blur-sm"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 premium-shadow hover:shadow-2xl transform hover:scale-105"
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-blue-300 text-sm">
            Welcome to RecipeShare, {user?.fullName}! 🍳
          </p>
        </div>
      </div>
    </div>
  );
};