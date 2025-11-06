// src/components/Session.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { calculateAngle } from '../utils/math';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from "firebase/firestore";

function Session({ user, onStopSession, exerciseType }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  const [angle, setAngle] = useState(0);
  const [feedback, setFeedback] = useState('Get Ready...');
  const [repCount, setRepCount] = useState(0);
  const stageRef = useRef('up');

  // Voice Feedback
  const synthRef = useRef(window.speechSynthesis);
  const lastSpokenFeedbackRef = useRef('Get Ready...');
  const speakFeedback = (text) => {
    if (!text || text === lastSpokenFeedbackRef.current || !synthRef.current) {
      return;
    }
    const synth = synthRef.current;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.1;
    synth.speak(utterance);
    lastSpokenFeedbackRef.current = text;
  };

  useEffect(() => {
    if (feedback === 'Get Ready...' || feedback === 'Make body visible' || feedback === 'No person detected') {
      lastSpokenFeedbackRef.current = feedback;
    } else {
      speakFeedback(feedback);
    }
  }, [feedback]);


  useEffect(() => {
    if (!window.Pose || !window.Camera || !window.drawConnectors) {
      setFeedback("Error: AI Libraries not loaded.");
      return;
    }
    if (!videoRef.current || !canvasRef.current) return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

    const pose = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    poseRef.current = pose;

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (poseRef.current) {
          await poseRef.current.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480,
    });
    cameraRef.current = camera;
    camera.start();

    const onResults = (results) => {
      const landmarks = results.poseLandmarks;
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      let newFeedback = 'Make body visible';
      let currentAngle = 0;

      if (landmarks) {
        window.drawConnectors(canvasCtx, landmarks, window.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        window.drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

        const P = {
          LEFT_HIP: 23, LEFT_KNEE: 25, LEFT_ANKLE: 27,
          RIGHT_HIP: 24, RIGHT_KNEE: 26, RIGHT_ANKLE: 28,
          LEFT_SHOULDER: 11, LEFT_ELBOW: 13, LEFT_WRIST: 15,
          RIGHT_SHOULDER: 12, RIGHT_ELBOW: 14, RIGHT_WRIST: 16
        };
        const VISIBILITY_THRESHOLD = 0.5;

        try {
          let p1, p2, p3;

          const leftKneeVisible = landmarks[P.LEFT_KNEE]?.visibility > VISIBILITY_THRESHOLD;
          const leftShoulderVisible = landmarks[P.LEFT_SHOULDER]?.visibility > VISIBILITY_THRESHOLD;

          switch (exerciseType) {
            // ... (Saare 'case' logic same rahenge)
            case 'knee_squat':
              p1 = leftKneeVisible ? landmarks[P.LEFT_HIP] : landmarks[P.RIGHT_HIP];
              p2 = leftKneeVisible ? landmarks[P.LEFT_KNEE] : landmarks[P.RIGHT_KNEE];
              p3 = leftKneeVisible ? landmarks[P.LEFT_ANKLE] : landmarks[P.RIGHT_ANKLE];
              currentAngle = calculateAngle(p1, p2, p3);
              setAngle(currentAngle.toFixed(0));

              if (currentAngle > 160) {
                if (stageRef.current === 'down') {
                  newFeedback = 'Good Job!';
                  setRepCount(prevCount => prevCount + 1);
                } else { newFeedback = 'Go Down'; }
                stageRef.current = 'up';
              } else if (currentAngle < 100) {
                newFeedback = 'Go Up';
                stageRef.current = 'down';
              } else { newFeedback = (stageRef.current === 'up') ? 'Going Down...' : 'Going Up...'; }

              const p_back1 = leftKneeVisible ? landmarks[P.LEFT_SHOULDER] : landmarks[P.RIGHT_SHOULDER];
              const p_back2 = p1; // Hip
              const p_back3 = p2; // Knee
              const backAngle = calculateAngle(p_back1, p_back2, p_back3);
              if (stageRef.current === 'down' && backAngle < 80) {
                newFeedback = 'Keep your back straight!';
              }
              break;

            case 'shoulder_raise':
              p1 = leftShoulderVisible ? landmarks[P.LEFT_ELBOW] : landmarks[P.RIGHT_ELBOW];
              p2 = leftShoulderVisible ? landmarks[P.LEFT_SHOULDER] : landmarks[P.RIGHT_SHOULDER];
              p3 = leftShoulderVisible ? landmarks[P.LEFT_HIP] : landmarks[P.RIGHT_HIP];
              currentAngle = calculateAngle(p1, p2, p3);
              setAngle(currentAngle.toFixed(0));

              if (currentAngle < 30) {
                if (stageRef.current === 'up') {
                  newFeedback = 'Good Job!';
                  setRepCount(prevCount => prevCount + 1);
                } else { newFeedback = 'Raise Arms'; }
                stageRef.current = 'down';
              } else if (currentAngle > 80) {
                newFeedback = 'Lower Arms';
                stageRef.current = 'up';
              } else { newFeedback = (stageRef.current === 'up') ? 'Lowering...' : 'Raising...'; }

              const p_elb1 = p2; // Shoulder
              const p_elb2 = p1; // Elbow
              const p_elb3 = leftShoulderVisible ? landmarks[P.LEFT_WRIST] : landmarks[P.RIGHT_WRIST];
              const elbowAngle = calculateAngle(p_elb1, p_elb2, p_elb3);
              if (stageRef.current === 'up' && elbowAngle < 150) {
                newFeedback = 'Keep your arm straight!';
              }
              break;

            case 'hip_raise':
              p1 = leftKneeVisible ? landmarks[P.LEFT_SHOULDER] : landmarks[P.RIGHT_SHOULDER];
              p2 = leftKneeVisible ? landmarks[P.LEFT_HIP] : landmarks[P.RIGHT_HIP];
              p3 = leftKneeVisible ? landmarks[P.LEFT_KNEE] : landmarks[P.RIGHT_KNEE];
              currentAngle = calculateAngle(p1, p2, p3);
              setAngle(currentAngle.toFixed(0));

              if (currentAngle > 160) {
                if (stageRef.current === 'down') {
                  newFeedback = 'Good Job!';
                  setRepCount(prevCount => prevCount + 1);
                } else { newFeedback = 'Raise Leg'; }
                stageRef.current = 'up';
              } else if (currentAngle < 130) {
                newFeedback = 'Lower Leg';
                stageRef.current = 'down';
              } else { newFeedback = (stageRef.current === 'up') ? 'Raising...' : 'Lowering...'; }
              break;

            case 'back_stretch':
              p1 = leftKneeVisible ? landmarks[P.LEFT_SHOULDER] : landmarks[P.RIGHT_SHOULDER];
              p2 = leftKneeVisible ? landmarks[P.LEFT_HIP] : landmarks[P.RIGHT_HIP];
              p3 = leftKneeVisible ? landmarks[P.LEFT_KNEE] : landmarks[P.RIGHT_KNEE];
              currentAngle = calculateAngle(p1, p2, p3);
              setAngle(currentAngle.toFixed(0));

              if (currentAngle > 175) {
                if (stageRef.current === 'down') {
                  newFeedback = 'Good Job!';
                  setRepCount(prevCount => prevCount + 1);
                } else { newFeedback = 'Arch back (Cat)'; }
                stageRef.current = 'up';
              } else if (currentAngle < 165) {
                newFeedback = 'Dip back (Cow)';
                stageRef.current = 'down';
              } else { newFeedback = (stageRef.current === 'up') ? 'Arching...' : 'Dipping...'; }
              break;

            default:
              newFeedback = 'This exercise is not setup yet.';
          }

          setFeedback(newFeedback);

        } catch (error) {
           setFeedback('Make body visible');
           setAngle(0);
        }
      } else {
        setFeedback('No person detected');
      }

      canvasCtx.restore();
    };

    pose.onResults(onResults);

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      if (poseRef.current) {
        poseRef.current.close();
        poseRef.current = null;
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [exerciseType]);

  const handleSaveAndExit = async () => {
    // ... (Yeh function same rahega) ...
    if (user && repCount > 0) {
      try {
        await addDoc(collection(db, "sessions"), {
          userId: user.uid,
          username: user.username,
          reps: repCount,
          exercise: exerciseType,
          date: Timestamp.now()
        });
        console.log("Session saved successfully!");
      } catch (e) {
        console.error("Error saving session: ", e);
      }
    }
    onStopSession();
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        variant="contained"
        startIcon={<ArrowBack />}
        onClick={handleSaveAndExit}
        sx={{ mb: 2, alignSelf: 'flex-start' }}
      >
        Save & Exit
      </Button>

      {/* 1. YEH HAI FIX (Feedback Box):
           flexDirection ko responsive bana diya
      */}
      <Paper elevation={3} sx={{
          padding: '16px', // Padding kam kar di mobile ke liye
          mb: 2,
          backgroundColor: '#333',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Mobile par stack, desktop par row
          alignItems: 'center', // Center mein rakhein
          justifyContent: 'space-around', // Thodi space
          gap: 2, // Thoda gap
          width: '100%' // Poori width le lo
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">REPS</Typography>
          <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            {repCount}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">FEEDBACK</Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {feedback}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">Body Angle</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {angle}°
          </Typography>
        </Box>
      </Paper>

      <video ref={videoRef} style={{ display: 'none' }}></video>

      {/* 2. YEH HAI FIX (Canvas):
           Width ko 100% kar diya aur max-width set kar diya
      */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: '640px',
          height: 'auto', // Aspect ratio maintain rakhega
          borderRadius: '8px'
        }}
      ></canvas>
    </Box>
  );
}

export default Session;