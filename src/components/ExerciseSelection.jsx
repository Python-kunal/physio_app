// src/components/ExerciseSelection.jsx
import React, { useState } from 'react'; // 1. useState import karein
import { Box, Typography, Card, CardContent, Button, Grid, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import InstructionModal from './InstructionModal'; // 2. Naya modal import karein

// 3. Exercises ki list ko update karein (video path aur instructions ke saath)
const exercises = [
  {
    id: 'knee_squat',
    title: 'Knee Pain Relief',
    description: 'Perform squats to improve knee strength.',
    icon: '🦵',
    videoPath: '/videos/knee_squat.mp4', // public folder se
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Lower your hips as if sitting in a chair.',
      'Keep your back straight and chest up.',
      'Go down until your knees are at a 90-degree angle.',
      'Push through your heels to return to start.'
    ]
  },
  {
    id: 'shoulder_raise',
    title: 'Shoulder Pain',
    description: 'Perform lateral raises for shoulder mobility.',
    icon: '💪',
    videoPath: '/videos/shoulder_raise.mp4',
    instructions: [
      'Stand or sit with a dumbbell in each hand, palms facing in.',
      'Keep your back straight and arms slightly bent.',
      'Raise your arms out to the sides until they are at shoulder level.',
      'Lower the arms back down slowly.',
    ]
  },
  {
    id: 'hip_raise',
    title: 'Hip Mobility',
    description: 'Perform leg raises to improve hip flexors.',
    icon: '🤸',
    videoPath: '/videos/hip_raise.mp4',
    instructions: [
      'Lie on your back with your legs straight out.',
      'Slowly raise one leg as high as you can, keeping it straight.',
      'Hold for 2 seconds.',
      'Slowly lower the leg back down.',
      'Repeat with the other leg.'
    ]
  },
  {
    id: 'back_stretch',
    title: 'Back Pain Relief',
    description: 'Perform cat-cow pose for spinal stretch.',
    icon: '🧘',
    videoPath: '/videos/back_stretch.mp4',
    instructions: [
      'Start on all fours (tabletop position).',
      'Inhale: Dip your back, lift your chest and tailbone (Cow pose).',
      'Exhale: Arch your back, tuck your chin (Cat pose).',
      'Move slowly and breathe deeply.',
    ]
  },
];

// 4. Props mein 'onExerciseSelect' (App.jsx se) aur 'onBack' receive karein
function ExerciseSelection({ onExerciseSelect, onBack }) {

  // 5. Modal ko control karne ke liye naye states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // 6. Jab card par click ho
  const handleCardClick = (exercise) => {
    setSelectedExercise(exercise); // Select karo
    setModalOpen(true); // Modal kholo
  };

  // 7. Jab modal band ho
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedExercise(null); // Selection clear karo
  };

  // 8. Jab modal ke andar "Start" button dabe
  const handleStartSession = () => {
    setModalOpen(false);
    // App.jsx ko batao ki session start karna hai
    onExerciseSelect(selectedExercise.id);
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<ArrowBack />}
        onClick={onBack}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Choose Your Exercise
      </Typography>

      <Grid container spacing={3}>
        {exercises.map((ex) => (
          <Grid item xs={12} sm={6} md={4} key={ex.id}>
            <Paper
              elevation={3}
              sx={{
                p: 3, display: 'flex', flexDirection: 'column',
                gap: 2, height: '100%', border: '1px solid #444',
                '&:hover': {
                  backgroundColor: '#222', cursor: 'pointer'
                }
              }}
              // 9. onClick ko naye function se badal diya
              onClick={() => handleCardClick(ex)}
            >
              <Typography variant="h2" sx={{ textAlign: 'center' }}>{ex.icon}</Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {ex.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {ex.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 10. Modal ko yahaan render karein */}
      <InstructionModal
        exercise={selectedExercise}
        open={modalOpen}
        onClose={handleCloseModal}
        onStart={handleStartSession}
      />
    </Box>
  );
}

export default ExerciseSelection;