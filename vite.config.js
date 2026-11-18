import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration de construction Vite pour Cantine Manager
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});

