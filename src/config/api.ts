// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

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
  },
  RECIPES: {
    LIST: `${API_BASE_URL}/api/recipes`,
    CREATE: `${API_BASE_URL}/api/recipes`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/api/recipes/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/recipes/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/recipes/${id}`,
  },
  FRIENDS: {
    LIST: `${API_BASE_URL}/api/friends`,
    REQUEST: `${API_BASE_URL}/api/friends/request`,
    ACCEPT: `${API_BASE_URL}/api/friends/accept`,
    REJECT: `${API_BASE_URL}/api/friends/reject`,
  },
  CHAT: {
    MESSAGES: `${API_BASE_URL}/api/chat`,
    SEND: `${API_BASE_URL}/api/chat`,
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
