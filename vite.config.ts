import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    allowedHosts: ['certify.nft.gpadaka.com'],
  },
  // Ensure public files are copied to dist
  publicDir: 'public',
  build: {
    // Ensure all public files are included
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
