// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

//
// ===== IMPORTANT! =====
//
// Yahaan par apna 'firebaseConfig' object paste karein
// jo aapne Firebase console se copy kiya tha
//
const firebaseConfig = {
  apiKey: "AIzaSyD0FB_gydYNc7o_7YJ0d36rZQe4gP_u49o",
  authDomain: "physio-ai-hackathon.firebaseapp.com",
  projectId: "physio-ai-hackathon",
  storageBucket: "physio-ai-hackathon.firebasestorage.app",
  messagingSenderId: "448306205429",
  appId: "1:448306205429:web:8dca1f6eb6ffa08ede6bbc",
  measurementId: "G-L2BN1SL9WH"
};
//
// ===== IMPORTANT! =====
//


// Firebase services ko initialize karein
const app = initializeApp(firebaseConfig);

//
// YEH HAIN FIX WALI LINES:
// Hum 'auth' aur 'db' ko 'export' kar rahe hain
//
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;