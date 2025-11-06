// src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Avatar, Grid, Card, CardContent } from '@mui/material';
import { Logout, Person, FitnessCenter, Event, Email } from '@mui/icons-material';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from "firebase/firestore";
// 1. Naya FeedbackModal import karein
import FeedbackModal from './FeedbackModal';

function ProfilePage({ user, onLogoutClick }) {
  const [stats, setStats] = useState({
    totalReps: 0,
    totalSessions: 0
  });

  // 2. Feedback modal ke liye naya state
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "sessions"),
        where("userId", "==", user.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let totalReps = 0;
        const totalSessions = querySnapshot.size;
        querySnapshot.forEach((doc) => {
          totalReps += doc.data().reps;
        });
        setStats({ totalReps, totalSessions });
      });
      return () => unsubscribe();
    }
  }, [user]);

  const getMemberSince = () => {
    if (!user || !user.metadata.creationTime) return '...';
    return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long'
    });
  };

  if (!user) return null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Your Profile
      </Typography>

      <Grid container spacing={3}>

        {/* --- LEFT COLUMN (Profile Card) --- */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              height: '100%'
            }}
          >
            <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', mb: 2 }}>
              <Person sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {user.username}
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 2, wordBreak: 'break-all' }}>
              {user.email}
            </Typography>

            <Typography variant="body1" color="textSecondary">
              Member Since: {getMemberSince()}
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Logout />}
              onClick={onLogoutClick}
              sx={{ mt: 'auto', width: '100%' }}
            >
              Logout
            </Button>
          </Paper>
        </Grid>

        {/* --- RIGHT COLUMN (Stats Cards) --- */}
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Lifetime Stats
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                {/* ... (Total Reps Card - No Change) ... */}
                <Card sx={{ backgroundColor: '#333', height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <FitnessCenter sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" color="textSecondary">Total Reps (All Time)</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {stats.totalReps}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {/* ... (Total Sessions Card - No Change) ... */}
                <Card sx={{ backgroundColor: '#333', height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Event sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" color="textSecondary">Total Sessions</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {stats.totalSessions}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 3. YEH HAI NAYA FIX:
                Card ab 'onClick' se modal kholega
              */}
              <Grid item xs={12} sm={12} md={4}>
                <Card
                  onClick={() => setFeedbackModalOpen(true)} // Modal kholega
                  sx={{
                    backgroundColor: '#333',
                    height: '100%',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    cursor: 'pointer', // Cursor ko pointer banayein
                    '&:hover': {
                      backgroundColor: '#444'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Email sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" color="textSecondary">
                      Have Feedback?
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      Contact Us
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>
          </Box>
        </Grid>

      </Grid>

      {/* 4. Modal ko yahaan render karein */}
      <FeedbackModal
        user={user}
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </Box>
  );
}

export default ProfilePage;