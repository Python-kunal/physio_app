// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { PlayCircleFilled } from '@mui/icons-material';
import Lottie from 'lottie-react';
import robotAnimation from '../assets/robot.json';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";

function Dashboard({ user, onStartSession }) {

  // 1. YEH HAI FIX (Robot Size):
  // Height ko responsive bana diya
  const lottieStyle = {
    height: { xs: 300, md: 600 }, // Mobile par 300px, desktop par 600px
    width: '100%',
  };

  const [repsToday, setRepsToday] = useState(0);

  useEffect(() => {
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfToday = Timestamp.fromDate(today);
      const q = query(
        collection(db, "sessions"),
        where("userId", "==", user.uid),
        where("date", ">=", startOfToday)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let totalReps = 0;
        querySnapshot.forEach((doc) => {
          totalReps += doc.data().reps;
        });
        setRepsToday(totalReps);
      }, (error) => {
          console.error("Firebase query error:", error);
      });
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 4,
      }}
    >
      {/* --- LEFT COLUMN --- */}
      <Box sx={{ width: { xs: '100%', md: '50%' } }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome Back!
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          {user ? `Ready for your next session, ${user.username}?` : 'Ready for your next session?'}
        </Typography>

        <Card sx={{ mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
          <CardContent sx={{ padding: '24px !important' }}>
            <Typography variant="h5" component="div" gutterBottom>
              Start New Session
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Click here to choose your exercise for today.
            </Typography>
            <Button
              variant="contained" size="large"
              startIcon={<PlayCircleFilled />}
              sx={{ backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: '#f0f0f0' } }}
              onClick={onStartSession}
              disabled={!user}
            >
              Start Session
            </Button>
            {!user && <Typography sx={{mt: 1, fontSize: '0.9rem'}}>Please login to start a session.</Typography>}
          </CardContent>
        </Card>

        {/* 2. YEH HAI FIX (Stats Cards):
          // flexDirection ko responsive bana diya
        */}
        <Box sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' } // Mobile par stack, tablet/desktop par row
        }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Reps Today</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{repsToday}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Accuracy</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>92%</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* --- RIGHT COLUMN (Robot) --- */}
      <Box sx={{ width: { xs: '80%', md: '50%' } }}>
        <Lottie
          animationData={robotAnimation}
          style={lottieStyle}
          loop={true}
        />
      </Box>
    </Box>
  );
}

export default Dashboard;