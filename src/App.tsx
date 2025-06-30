import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { ProfileSetupPage } from './components/ProfileSetupPage';
import { MainApp } from './components/MainApp';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated, hasCompletedSetup } = useAuth();
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLanding(false);
    }
  }, [isAuthenticated]);

  if (showLanding && !isAuthenticated) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (!hasCompletedSetup) {
    return <ProfileSetupPage />;
  }

  return <MainApp />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;