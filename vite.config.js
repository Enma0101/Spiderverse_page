import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Cache GLB/GLTF 3D models at runtime (CacheFirst = instant on revisit)
        runtimeCaching: [
          {
            urlPattern: /\.(?:glb|gltf)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'models-3d-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache Draco decoder WASM from Google CDN
            urlPattern: /^https:\/\/www\.gstatic\.com\/draco\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'draco-decoder-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Comics Spider - Spider-Man Universe',
        short_name: 'Comics Spider',
        description: 'Explora el universo de Spider-Man en PlayStation',
        theme_color: '#0a0e1a',
        background_color: '#0a0e1a',
        display: 'standalone',
        icons: [
          {
            src: '/spider-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/spider-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  assetsInclude: ['**/*.glb'],
})
