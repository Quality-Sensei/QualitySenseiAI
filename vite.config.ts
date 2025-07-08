import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  }
                }
              },
              {
                urlPattern: /^https:\/\/esm\.sh\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'esm-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                  }
                }
              }
            ]
          },
          manifest: {
            name: 'Quality Sensei - AI-Powered QA Assistant',
            short_name: 'Quality Sensei',
            description: 'Your AI-powered QA and test case assistant',
            theme_color: '#0ea5e9',
            background_color: '#0f172a',
            display: 'standalone',
            icons: [
              {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@/components': path.resolve(__dirname, './components'),
          '@/types': path.resolve(__dirname, './types'),
          '@/services': path.resolve(__dirname, './services'),
          '@/hooks': path.resolve(__dirname, './hooks'),
          '@/utils': path.resolve(__dirname, './utils')
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              ai: ['@google/genai'],
              markdown: ['react-markdown', 'remark-gfm']
            }
          }
        },
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      },
      optimizeDeps: {
        include: ['react', 'react-dom', '@google/genai', 'react-markdown', 'remark-gfm']
      }
    };
});
