// vite.config.js (Naya Code)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // YEH HAI NAYA FIX:
  // Hum Vite ko bol rahe hain ki in libraries ko pre-bundle na kare
  optimizeDeps: {
    exclude: [
      '@mediapipe/pose',
      '@mediapipe/camera_utils',
      '@mediapipe/drawing_utils',
    ],
  },
})