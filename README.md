##🦾 PhysioAI - AI Posture Correction System

PhysioAI is an AI-powered web application designed to help users perform physiotherapy exercises correctly at home. Using real-time pose estimation, it tracks the user's body, counts repetitions, and provides instant audio-visual feedback to correct bad posture, making recovery safer and more consistent.

This project was built for a hackathon, demonstrating a complete full-stack application with a React frontend, Firebase backend, and MediaPipe for real-time AI.

##✨ Key Features

User Authentication: Secure Sign Up and Login system using Firebase Authentication (Email/Password + Username).

AI Pose Estimation: Real-time body tracking in the browser using MediaPipe Pose.

Multi-Exercise Library: A selection page for multiple physiotherapy exercises (Knee, Shoulder, Hip, Back).

Video Demonstrations: Each exercise includes a pop-up modal with a video demo (.mp4) and step-by-step instructions.

Live Repetition Counting: Smart logic calculates reps by tracking body angles (e.g., knee angle for squats).

Real-time Posture Correction: The system actively monitors form and provides corrective feedback (e.g., "Keep your back straight!" during a squat).

Instant Voice Feedback: Uses the Web Speech API to give audio cues for reps and corrections, so the user doesn't have to look at the screen.

Persistent Data Storage: All user data (profile info, session history) is saved securely in a Firebase Firestore database.

Progress Dashboard: The homepage features an animated robot (Lottie) and live stats for "Reps Today" fetched from the database.

Progress Tracking Page: A dedicated "Progress" tab with:

Lifetime summary cards (Total Reps, Total Sessions).

A filterable line chart (Chart.js) showing rep history over time.

User Profile Page: Displays user details, lifetime stats, and a "Contact Us" feedback form (which saves messages to Firestore).

Fully Responsive: Designed to work smoothly on both desktop and mobile devices.


##🛠️ Technology Stack

Frontend: React.js (Vite)

#UI/UX:

Material-UI (MUI) - For components and layout

Lottie-React - For the dashboard robot animation

React-Chartjs-2 - For the progress graph

AI / Pose Estimation: MediaPipe (loaded via CDN)

#Backend (BaaS):

Firebase Authentication: For user login/signup.

Firebase Firestore: As the NoSQL database for user data, sessions, and feedback.

#Browser APIs:

Web Speech API (SpeechSynthesis) - For voice feedback

WebRTC (getUserMedia) - For camera access


##🚀 How It Works (User Flow)

Sign Up: A new user signs up with their Username, Email, and Password. Their data is saved to Authentication and a new user document is created in Firestore.

Login: The user logs in. The app fetches their data and greets them by name.

Dashboard: The user sees the main dashboard with their "Reps Today" (fetched live from Firestore).

Select Exercise: User clicks "Start Session", which leads to the ExerciseSelection page.

View Demo: User clicks on an exercise (e.g., "Knee Pain Relief"). A modal pops up showing a video demo and instructions.

Start Session: User clicks "Start" in the modal. The Session page opens, and the camera activates.

Perform Exercise: The AI tracks the user's joints (e.g., Hip, Knee, Ankle). Custom logic calculates body angles to count reps and detect bad posture (e.g., back angle < 80°).

Get Feedback: The user hears real-time voice feedback like "Go Up", "Good Job!", or "Keep your back straight!".

Save & Exit: The user clicks "Save & Exit". The session (reps, exercise type, date) is saved to their user profile in Firestore.

Track Progress: The user can go to the "Progress" tab to see their lifetime stats and a filterable chart of all past sessions.

Give Feedback: The user can go to the "Profile" tab to send feedback via the "Contact Us" form, which also saves to Firestore.


##🔧 How to Run Locally

#Clone the repository:

git clone [YOUR_REPOSITORY_URL]
cd physio-ai


#Install dependencies:

npm install


#Set up Firebase:

Go to console.firebase.google.com and create a new project.

Enable Authentication (Email/Password method).

Enable Firestore Database (start in Test Mode).

Go to Project Settings -> Your apps -> Web and register your app.

Copy the firebaseConfig object.

In the project, create src/firebase.js and paste your config (use the code from our chat).

Go to Firestore Database -> Indexes. The app will fail on the "Progress" page. Check the browser console, click the Firebase link to auto-create the required composite indexes.

#Add Video Assets:

Create a folder public/videos/.

Add your four exercise demo videos (.mp4) inside this folder with these exact names:

knee_squat.mp4

shoulder_raise.mp4

hip_raise.mp4

back_stretch.mp4

#Run the app:

npm run dev


The app will be live at http://localhost:5173/ (or a similar port).
