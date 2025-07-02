import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  friends?: string[];
  following?: string[];
  followers?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasCompletedSetup: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  completeSetup: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedSetup = localStorage.getItem('setupComplete');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setHasCompletedSetup(storedSetup === 'true');
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Check if user has completed profile setup
    const isSetupComplete = userData.profilePicture && userData.bio;
    setHasCompletedSetup(isSetupComplete);
    localStorage.setItem('setupComplete', isSetupComplete.toString());
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setHasCompletedSetup(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('setupComplete');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const completeSetup = () => {
    setHasCompletedSetup(true);
    localStorage.setItem('setupComplete', 'true');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    hasCompletedSetup,
    login,
    logout,
    updateUser,
    completeSetup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};