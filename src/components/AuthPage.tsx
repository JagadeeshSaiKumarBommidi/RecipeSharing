import React, { useState } from 'react';
import { ChefHat, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    confirmPassword: ''
  });

  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.username || !formData.fullName) {
        setError('All fields are required for signup');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            username: formData.username,
            fullName: formData.fullName
          };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl premium-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl premium-float" style={{animationDelay: '3s'}}></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="mb-8 premium-shadow-lg rounded-3xl p-4 bg-white/10 backdrop-blur-sm">
            <ChefHat className="w-24 h-24" />
          </div>
          <h1 className="text-5xl font-bold mb-6 text-center premium-text-gradient">RecipeShare</h1>
          <p className="text-xl text-center leading-relaxed max-w-md text-blue-100">
            Connect with food lovers worldwide. Share your culinary creations and discover amazing recipes.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-blue-900/30"></div>
        <div className="max-w-md w-full relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl mb-4 premium-shadow">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold premium-text-gradient">RecipeShare</h1>
          </div>

          <div className="premium-bg-card rounded-2xl premium-shadow-lg p-8 backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back!' : 'Join RecipeShare'}
              </h2>
              <p className="text-blue-200">
                {isLogin 
                  ? 'Sign in to continue your culinary journey' 
                  : 'Create your account and start sharing recipes'
                }
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border-l-4 border-red-400 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-blue-800/30 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-blue-300/50 backdrop-blur-sm"
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-blue-800/30 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-blue-300/50 backdrop-blur-sm"
                        placeholder="Choose a username"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-blue-800/30 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-blue-300/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-blue-800/30 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-blue-300/50 backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-blue-800/30 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-blue-300/50 backdrop-blur-sm"
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] premium-shadow hover:shadow-2xl"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-blue-300">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors duration-200 underline decoration-2 underline-offset-2"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};