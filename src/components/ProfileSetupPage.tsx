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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 text-lg">Let's personalize your RecipeShare experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'} mr-4`}>
              {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className={`h-1 w-16 ${step > 1 ? 'bg-orange-600' : 'bg-gray-200'} mr-4`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
          </div>
          <div className="flex justify-center space-x-20 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-orange-600 font-semibold' : ''}>Profile Photo</span>
            <span className={step >= 2 ? 'text-orange-600 font-semibold' : ''}>Bio</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 ? (
            <div className="text-center">
              <div className="mb-8">
                <Camera className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Your Profile Photo</h2>
                <p className="text-gray-600">Help others recognize you in the community</p>
              </div>

              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mx-auto mb-4">
                    {profileData.profilePicture ? (
                      <img
                        src={profileData.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-orange-600 text-white p-2 rounded-full cursor-pointer hover:bg-orange-700 transition-colors">
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
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <FileText className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
                <p className="text-gray-600">Share what makes you passionate about cooking</p>
              </div>

              <div className="mb-8">
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="I love experimenting with fusion cuisines and sharing family recipes that have been passed down through generations..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-2">{profileData.bio.length}/500 characters</p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSkip}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Welcome to RecipeShare, {user?.fullName}! 🍳
          </p>
        </div>
      </div>
    </div>
  );
};