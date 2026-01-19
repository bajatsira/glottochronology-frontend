import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      // Любой запрос, начинающийся с /api, будет перенаправлен
      '/api': {
        target: 'http://localhost:8082',
        // Необходимо для корректной работы proxy
        changeOrigin: true, 
      },
    },
  },
  // --------------------------
});
