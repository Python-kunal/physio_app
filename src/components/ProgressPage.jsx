// src/components/ProgressPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Fill (fill: true) ke liye zaroori hai
} from 'chart.js';

// Chart.js ko register karein
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Filler ko register karein
);

function ProgressPage({ user }) {
  // 1. Naye states (Filter aur Summary data ke liye)
  const [exerciseFilter, setExerciseFilter] = useState('all');
  const [chartData, setChartData] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalReps: 0,
    totalSessions: 0,
    avgReps: 0,
  });

  useEffect(() => {
    if (user) {
      // 2. Naya "Dynamic Query"
      let q; // Query ko 'let' banaya

      const sessionsRef = collection(db, "sessions");

      if (exerciseFilter === 'all') {
        // Agar 'All Exercises' select hai, toh sirf user par filter lagao
        q = query(
          sessionsRef,
          where("userId", "==", user.uid),
          orderBy("date", "asc")
        );
      } else {
        // Agar koi specific exercise (jaise 'knee_squat') select hai
        // 3. YEH NAYI QUERY HAI - Iske liye NAYA INDEX LAGEGA
        q = query(
          sessionsRef,
          where("userId", "==", user.uid),
          where("exercise", "==", exerciseFilter), // DUAL FILTER
          orderBy("date", "asc")
        );
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const sessions = [];
        querySnapshot.forEach((doc) => {
          sessions.push(doc.data());
        });

        // Data ko process karke chart aur summary dono ke liye bhejo
        processData(sessions);
      }, (error) => {
          // 4. Yahaan par Index waala error aayega
          console.error("Firebase query error:", error);
          setFeedback("Error: " + error.message); // Error ko screen par dikha bhi sakte hain
      });

      return () => unsubscribe();
    }
  }, [user, exerciseFilter]); // 5. Yeh useEffect ab 'filter' badalne par bhi chalega

  // Data ko process karke chart aur summary dono set karega
  const processData = (sessions) => {
    if (sessions.length === 0) {
      setChartData(null);
      setSummaryData({ totalReps: 0, totalSessions: 0, avgReps: 0 });
      return;
    }

    // Summary Data Calculation
    const totalSessions = sessions.length;
    const totalReps = sessions.reduce((sum, session) => sum + session.reps, 0);
    const avgReps = (totalReps / totalSessions).toFixed(1); // 1 decimal point tak

    setSummaryData({ totalReps, totalSessions, avgReps });

    // Chart Data Calculation
    const labels = sessions.map(session =>
      session.date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const data = sessions.map(session => session.reps);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Reps per Session',
          data: data,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          fill: true,
          tension: 0.1
        },
      ],
    });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Your Physiotherapy Progress',
        font: { size: 20 },
        color: '#FFFFFF'
      },
    },
    scales: {
      x: { ticks: { color: '#FFFFFF' } },
      y: { ticks: { color: '#FFFFFF' } }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Your Progress
      </Typography>

      {/* 6. NAYE SUMMARY CARDS */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#333' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">Total Reps (All Time)</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{summaryData.totalReps}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#333' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">Total Sessions</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{summaryData.totalSessions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#333' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">Avg. Reps / Session</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{summaryData.avgReps}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 7. NAYA FILTER DROPDOWN */}
      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#333' }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="exercise-filter-label" sx={{color: '#fff'}}>Filter by Exercise</InputLabel>
          <Select
            labelId="exercise-filter-label"
            value={exerciseFilter}
            label="Filter by Exercise"
            onChange={(e) => setExerciseFilter(e.target.value)}
            sx={{color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#555' }}}
          >
            <MenuItem value="all">All Exercises</MenuItem>
            <MenuItem value="knee_squat">Knee Pain Relief</MenuItem>
            <MenuItem value="shoulder_raise">Shoulder Pain</MenuItem>
            <MenuItem value="hip_raise">Hip Mobility</MenuItem>
            <MenuItem value="back_stretch">Back Pain Relief</MenuItem>
          </Select>
        </FormControl>

        {/* Chart */}
        {chartData ? (
          <Line options={chartOptions} data={chartData} />
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', p: 4 }}>
            No data found for this filter.
            <br />
            Complete a session to see your progress!
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default ProgressPage;