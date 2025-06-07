import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  preview: {
    allowedHosts: ['cybertron-p1tc.onrender.com'] 
  }
});