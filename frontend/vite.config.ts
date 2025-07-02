import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // Allow external connections
    port: 5173,
    cors: true,
  },
  preview: {
    host: true, // Allow external connections in preview mode
    port: 4173,
    strictPort: false,
    cors: true,
    allowedHosts: [
      'localhost',
      '.onrender.com',
      'recipesharing-3-frontend.onrender.com'
    ],
  },
});
