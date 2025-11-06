// src/components/TopAppBar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Spa, Logout } from '@mui/icons-material';

function TopAppBar({ user, onLoginClick, onLogoutClick }) {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Spa sx={{ mr: 2, color: '#64b5f6' }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          PhysioAI
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {user ? (
          <>
            {/* 1. YEH HAI FIX:
              Username ko 'xs' (mobile) par 'none' (chupa) kar diya,
              aur 'sm' (tablet/desktop) par 'block' (dikha) diya
            */}
            <Typography
              sx={{
                mr: 2,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Hello, {user.username ? user.username : user.email.split('@')[0]}
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              onClick={onLogoutClick}
              startIcon={<Logout />}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" sx={{ mr: 1 }} onClick={onLoginClick}>
              Login
            </Button>
            <Button variant="contained" color="primary" onClick={onLoginClick}>
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopAppBar;