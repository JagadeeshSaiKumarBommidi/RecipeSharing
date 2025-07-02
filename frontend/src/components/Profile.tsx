import React, { useState, useEffect } from 'react';
import { User, Edit3, Settings, Camera, MapPin, Calendar, Users, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  bio: string;
  profilePicture?: string;
  friends: any[];
  following: any[];
  followers: any[];
  recipes: any[];
  createdAt: string;
}

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    bio: '',
    profilePicture: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditData({
          fullName: data.fullName,
          bio: data.bio || '',
          profilePicture: data.profilePicture || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditData(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        updateUser(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-sm animate-pulse">
          <div className="h-48 bg-gray-300 rounded-t-2xl"></div>
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 md:pb-4">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-br from-orange-600 to-red-600 relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col items-center text-center -mt-12 relative">
            {/* Profile Picture */}
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg overflow-hidden">
                {(isEditing ? editData.profilePicture : profile.profilePicture) ? (
                  <img
                    src={isEditing ? editData.profilePicture : profile.profilePicture}
                    alt={profile.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-2 right-2 bg-orange-600 text-white p-2 rounded-full cursor-pointer hover:bg-orange-700 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* User Info */}
            <div className="w-full max-w-md">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.fullName}
                    onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="text-3xl font-bold text-gray-900 border-b-2 border-orange-500 bg-transparent focus:outline-none w-full text-center"
                  />
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-center"
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.fullName}</h1>
                  <p className="text-lg text-gray-600 mb-4">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-gray-700 mb-6 max-w-lg mx-auto leading-relaxed">{profile.bio}</p>
                  )}
                </>
              )}

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {new Date(profile.createdAt).getFullYear()}
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.recipes.length}</div>
                  <div className="text-sm text-gray-500">Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.followers.length}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.following.length}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.friends.length}</div>
                  <div className="text-sm text-gray-500">Friends</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-semibold shadow-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-semibold shadow-lg"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                  <button className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChefHat className="w-6 h-6 mr-2 text-orange-600" />
            My Recipes
          </h2>
        </div>

        {profile.recipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes yet!</h3>
            <p className="text-gray-600 mb-6">Share your first recipe to get started.</p>
            <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all font-semibold">
              Create Recipe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.recipes.map((recipe, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <ChefHat className="w-12 h-12 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Recipe #{index + 1}</h3>
                  <p className="text-sm text-gray-600">Your delicious creation</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};