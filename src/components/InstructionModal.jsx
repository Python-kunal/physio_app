// src/components/InstructionModal.jsx
import React from 'react';
import { Box, Modal, Typography, Button, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

// Modal ke liye style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800, // Modal ki max width
  bgcolor: '#2d2d2d', // Dark background
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  maxHeight: '90vh', // Taaki screen se baahar na jaaye
  overflowY: 'auto' // Scrollable
};

// Props mein 'exercise' object, 'open', 'onClose', 'onStart' receive karein
function InstructionModal({ exercise, open, onClose, onStart }) {
  if (!exercise) return null; // Agar koi exercise select nahi hai toh kuch na dikhayein

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={style}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
          {exercise.title} {exercise.icon}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Left Column (Video) */}
          <Box sx={{ flex: 1.5 }}>
            <video
              src={exercise.videoPath}
              width="100%"
              autoPlay
              loop
              muted
              playsInline // iOS par chalne ke liye
              style={{ borderRadius: '8px' }}
            >
              Your browser does not support the video tag.
            </video>
          </Box>

          {/* Right Column (Instructions) */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>How to perform:</Typography>
            <List dense>
              {exercise.instructions.map((step, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutline color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={step} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={onStart}>
            Start Session
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default InstructionModal;