import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      
      // The manifest object should be at this top level
      manifest: {
        name: 'EduSafe: Smart Safety for Schools',
        short_name: 'EduSafe',
        description: 'Your daily hub for weather, safety education, and interactive quizzes.',
        theme_color: '#667eea',
        background_color: '#f8f9fa',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },

      // Configuration for our custom service worker
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: {
        enabled: true
      },
      // This tells the plugin to use our custom file and inject the precache manifest into it
      strategy: 'injectManifest', // <-- CORRECTED: Was 'strategies'
      srcDir: 'src',
      filename: 'custom-sw.js', // <-- CORRECTED: Added comma
    })
  ],
})
