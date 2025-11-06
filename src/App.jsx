// src/App.jsx
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline, Container, Typography } from '@mui/material'; // Typography abhi bhi zaroori hai
import TopAppBar from './components/TopAppBar';
import BottomNavBar from './components/BottomNavBar';
import Dashboard from './components/Dashboard';
import Session from './components/Session';
import AuthModal from './components/AuthModal';
import ExerciseSelection from './components/ExerciseSelection';
// 1. Naye pages ko IMPORT karein (uncomment)
import ProgressPage from './components/ProgressPage';
import ProfilePage from './components/ProfilePage';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [view, setView] = useState('dashboard');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser({ ...currentUser, ...userDocSnap.data() });
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleStartSession = (exerciseId) => {
    setSelectedExercise(exerciseId);
    setView('session');
  };

  const handleStopSession = () => {
    setSelectedExercise(null);
    setView('dashboard');
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('User logged out');
      setView('dashboard');
    });
  };

  const renderView = () => {
    if (!user) {
      return <Dashboard user={null} onStartSession={() => setAuthModalOpen(true)} />;
    }

    switch(view) {
      case 'dashboard':
        return <Dashboard
                  user={user}
                  onStartSession={() => setView('selection')}
                />;
      case 'selection':
        return <ExerciseSelection
                  onBack={() => setView('dashboard')}
                  onExerciseSelect={handleStartSession}
                />;
      case 'session':
        return <Session
                  user={user}
                  onStopSession={handleStopSession}
                  exerciseType={selectedExercise}
                />;
      // 2. YEH HAI FIX: 'Coming Soon' ko naye components se replace karein
      case 'progress':
        return <ProgressPage user={user} />;
      case 'profile':
        return <ProfilePage user={user} onLogoutClick={handleLogout} />;
      default:
        return <Dashboard user={user} onStartSession={() => setView('selection')} />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <CssBaseline />
        <TopAppBar
          user={user}
          onLoginClick={() => setAuthModalOpen(true)}
          onLogoutClick={handleLogout}
        />

        <Box component="main" sx={{ flexGrow: 1, overflowY: 'auto', padding: 3 }}>
          <Container maxWidth='lg'>
            {renderView()}
          </Container>
        </Box>

        {/* Yeh navigation bar ab poori tarah functional hai */}
        {view !== 'session' && view !== 'selection' && (
          <BottomNavBar
            currentView={view}
            onNavigate={(newView) => setView(newView)}
          />
        )}
      </Box>

      {!user && <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />}
    </ThemeProvider>
  );
}

export default App;