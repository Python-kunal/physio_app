// src/components/BottomNavBar.jsx
import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Assessment, Person } from '@mui/icons-material';

// 1. Props mein 'currentView' aur 'onNavigate' receive karein
function BottomNavBar({ currentView, onNavigate }) {

  // 2. 'value' ko currentView se sync karein
  const viewToValue = {
    'dashboard': 0,
    'progress': 1,
    'profile': 2
  };
  const value = viewToValue[currentView] || 0;

  return (
    <Paper sx={{ position: 'sticky', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        // 3. Click hone par 'onNavigate' function ko call karein
        onChange={(event, newValue) => {
          if (newValue === 0) onNavigate('dashboard');
          if (newValue === 1) onNavigate('progress');
          if (newValue === 2) onNavigate('profile');
        }}
      >
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Progress" icon={<Assessment />} />
        <BottomNavigationAction label="Profile" icon={<Person />} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNavBar;