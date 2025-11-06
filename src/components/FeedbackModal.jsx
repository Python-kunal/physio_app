// src/components/FeedbackModal.jsx
import React, { useState } from 'react';
import { Box, Modal, Typography, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Modal ke liye style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 }, // Mobile par 90% width
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

function FeedbackModal({ user, open, onClose }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async () => {
    if (subject.trim() === '' || message.trim() === '') {
      setToast({ open: true, message: 'Please fill out all fields.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "feedback"), {
        userId: user.uid,
        username: user.username,
        email: user.email,
        subject: subject,
        message: message,
        date: Timestamp.now(),
        status: 'new'
      });

      setLoading(false);
      setToast({ open: true, message: 'Feedback sent successfully! Thank you.', severity: 'success' });
      setSubject('');
      setMessage('');
      onClose();

    } catch (err) {
      setLoading(false);
      setToast({ open: true, message: 'Error sending feedback: ' + err.message, severity: 'error' });
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            Send Us Your Feedback
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Found a bug or have an idea? We'd love to hear from you.
          </Typography>

          <TextField
            label="Subject"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            disabled={loading}
          />
          <TextField
            label="Your Message"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            multiline
            rows={5}
            disabled={loading}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
          </Button>
        </Box>
      </Modal>

      <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FeedbackModal;