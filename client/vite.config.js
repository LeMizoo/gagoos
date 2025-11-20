import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Chemin exact: /client/vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://bygagoos-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true
  },
  // Important pour le routing SPA
  base: '/',
})