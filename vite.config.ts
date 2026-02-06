// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // <-- Импорт плагина
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  //base: '/glottochronology-frontend/',
  base: './',
  plugins: [
    react(),
    basicSsl(),
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
    host: true,
    proxy: {
      '/api': {
        //target: 'http://localhost:8082',
        //target: 'http://192.168.3.39:8082',
        target: 'http://127.0.0.1:8082', 
        changeOrigin: true,
        //secure: false,
        //rewrite: (path) => path.replace(/^\/api/, ''), // Убираем /api, если бэкенд его не ждет (в Go у вас роуты /api/..., так что rewrite может быть не нужен, проверьте роутер Gin)

      },
    },
  },
});
