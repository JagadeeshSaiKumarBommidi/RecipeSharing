// API Configuration
// PRODUCTION FIX: Force production URLs when deployed
const isRenderProduction = typeof window !== 'undefined' && window.location.hostname.includes('onrender.com');
const isDevelopment = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Force production backend URL when on Render
const API_BASE_URL = isRenderProduction 
  ? 'https://recipesharing-3.onrender.com'
  : isDevelopment 
    ? (import.meta.env.VITE_API_URL || 'http://localhost:5000')
    : 'https://recipesharing-3.onrender.com'; // Default to production

const SOCKET_URL = isRenderProduction 
  ? 'https://recipesharing-3.onrender.com'
  : isDevelopment 
    ? (import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000')
    : 'https://recipesharing-3.onrender.com'; // Default to production

// Debug logging in development and production
console.log('🔧 API Configuration (ENHANCED DEBUG):');
console.log('- Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'SSR');
console.log('- isRenderProduction:', isRenderProduction);
console.log('- isDevelopment:', isDevelopment);
console.log('- API_BASE_URL:', API_BASE_URL);
console.log('- SOCKET_URL:', SOCKET_URL);
console.log('- Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');
console.log('- Environment:', import.meta.env.MODE);
console.log('- VITE_API_URL from env:', import.meta.env.VITE_API_URL);
console.log('- VITE_SOCKET_URL from env:', import.meta.env.VITE_SOCKET_URL);

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    UPDATE: `${API_BASE_URL}/api/users/profile`,
    SUGGESTIONS: `${API_BASE_URL}/api/users/suggestions/new`,
    FOLLOWERS: `${API_BASE_URL}/api/users/followers-list`,
    FOLLOW: (userId: string) => `${API_BASE_URL}/api/users/${userId}/follow`,
    SEARCH: (query: string) => `${API_BASE_URL}/api/users/search/${query}`,
  },
  RECIPES: {
    LIST: `${API_BASE_URL}/api/recipes`,
    CREATE: `${API_BASE_URL}/api/recipes`,
    FEED: `${API_BASE_URL}/api/recipes/feed`,
    SAVED: `${API_BASE_URL}/api/recipes/saved`,
    LIKED: `${API_BASE_URL}/api/recipes/liked`,
    POPULAR: `${API_BASE_URL}/api/recipes/popular`,
    RECOMMENDATIONS: `${API_BASE_URL}/api/recipes/recommendations`,
    LIKE: (id: string) => `${API_BASE_URL}/api/recipes/${id}/like`,
    SAVE: (id: string) => `${API_BASE_URL}/api/recipes/${id}/save`,
    BY_USER: (userId: string) => `${API_BASE_URL}/api/recipes/user/${userId}`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/api/recipes/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/recipes/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/recipes/${id}`,
    COMMENT: (id: string) => `${API_BASE_URL}/api/recipes/${id}/comment`,
  },
  FRIENDS: {
    LIST: `${API_BASE_URL}/api/friends`,
    REQUESTS: `${API_BASE_URL}/api/friends/requests`,
    REQUEST: (userId: string) => `${API_BASE_URL}/api/friends/request/${userId}`,
    ACCEPT: (userId: string) => `${API_BASE_URL}/api/friends/accept/${userId}`,
    REJECT: (userId: string) => `${API_BASE_URL}/api/friends/reject/${userId}`,
  },
  CHAT: {
    MESSAGES: `${API_BASE_URL}/api/chat`,
    SEND: `${API_BASE_URL}/api/chat`,
  },
  STORIES: {
    FEED: `${API_BASE_URL}/api/stories/feed`,
    CREATE: `${API_BASE_URL}/api/stories`,
    VIEW: (storyId: string) => `${API_BASE_URL}/api/stories/${storyId}/view`,
  },
  CHALLENGES: {
    CURRENT: `${API_BASE_URL}/api/challenges/current`,
    JOIN: (id: string) => `${API_BASE_URL}/api/challenges/${id}/join`,
  },
  HEALTH: `${API_BASE_URL}/api/health`,
};

// Socket.io URL
export const SOCKET_URL_CONFIG = SOCKET_URL;

// Default headers for API requests
export const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

// API request helper
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default API_BASE_URL;
