// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { Box, Modal, Typography, TextField, Button, Tabs, Tab } from '@mui/material';
// 1. Apni firebase config se 'db' (database) aur 'setDoc' function import karein
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; // Yeh naya import hai

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

function AuthModal({ open, onClose }) {
  // 2. 'username' ke liye naya state banayein
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (tabIndex === 1) { // --- SIGN UP LOGIC ---
      if (username.trim() === '') { // Check karein ki username khaali na ho
        setError('Please enter a username');
        return;
      }
      try {
        // 1. User ko Auth mein create karein
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. User ka data Firestore Database mein save karein
        // "users" collection ke andar user ki 'uid' se ek document banayein
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: user.email
        });

        console.log('User signed up and data saved!');
        onClose(); // Success par modal band karein
      } catch (err) {
        setError(err.message);
      }
    } else { // --- LOGIN LOGIC ---
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in');
        onClose();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
          {tabIndex === 0 ? 'Welcome Back!' : 'Create Your Account'}
        </Typography>

        {/* 3. Naya Username field (sirf Sign Up tab mein dikhega) */}
        {tabIndex === 1 && (
          <TextField
            label="Username"
            variant="outlined"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password (min. 6 characters)"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <Typography color="error" sx={{ textAlign: 'center', fontSize: '0.9rem' }}>
            {error.replace('Firebase: ', '').replace('auth/', '')}
          </Typography>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          {tabIndex === 0 ? 'Login' : 'Sign Up'}
        </Button>
      </Box>
    </Modal>
  );
}

export default AuthModal;