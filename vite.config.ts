// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // <-- Импорт плагина

export default defineConfig({
  base: '/glottochronology-frontend/',
  plugins: [
    react(),
    // --- НАСТРОЙКА PWA ---
    VitePWA({
      registerType: 'autoUpdate', // Автоматическое обновление сервис-воркера
      devOptions: {
        enabled: true // Включаем PWA в режиме разработки (для теста)
      },
      manifest: {
        name: 'Glottochronology App', // Полное имя приложения
        short_name: 'Glotto',         // Имя под иконкой на телефоне
        description: 'Приложение для расчета родства языков',
        theme_color: '#ffffff',       // Цвет шапки браузера
        background_color: '#ffffff',  // Цвет фона при загрузке
        display: 'standalone',        // "Нативный" режим без адресной строки
        icons: [
          {
            src: '/pwa-192x192.png',  
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
    },
  },
});
