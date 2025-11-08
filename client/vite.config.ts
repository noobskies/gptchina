import react from '@vitejs/plugin-react';
// @ts-ignore
import path from 'path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
const backendPort = (process.env.BACKEND_PORT && Number(process.env.BACKEND_PORT)) || 3080;
const backendURL = process.env.HOST
  ? `http://${process.env.HOST}:${backendPort}`
  : `http://localhost:${backendPort}`;

export default defineConfig(({ command }) => ({
  base: '',
  server: {
    allowedHosts:
      (process.env.VITE_ALLOWED_HOSTS && process.env.VITE_ALLOWED_HOSTS.split(',')) || [],
    host: '0.0.0.0', // Mobile-friendly host for Capacitor
    port: (process.env.PORT && Number(process.env.PORT)) || 3090,
    strictPort: false,
    proxy: {
      '/api': {
        target: backendURL,
        changeOrigin: true,
      },
      '/oauth': {
        target: backendURL,
        changeOrigin: true,
      },
    },
  },
  // Set the directory where environment variables are loaded from and restrict prefixes
  envDir: '../',
  envPrefix: ['VITE_', 'SCRIPT_', 'DOMAIN_', 'ALLOW_'],
  plugins: [
    react(),
    nodePolyfills(),
    VitePWA({
      injectRegister: 'auto', // 'auto' | 'manual' | 'disabled'
      registerType: 'autoUpdate', // 'prompt' | 'autoUpdate'
      devOptions: {
        enabled: false, // disable service worker registration in development mode
      },
      useCredentials: true,
      includeManifestIcons: false,
      workbox: {
        globPatterns: [
          '**/*.{js,css,html}',
          'assets/favicon*.png',
          'assets/icon-*.png',
          'assets/apple-touch-icon*.png',
          'assets/maskable-icon.png',
          'manifest.webmanifest',
        ],
        globIgnores: ['images/**/*', '**/*.map'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/oauth/, /^\/api/],
      },
      includeAssets: [],
      manifest: {
        name: 'Novlisky',
        short_name: 'Novlisky',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#009688',
        icons: [
          {
            src: 'assets/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: 'assets/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: 'assets/apple-touch-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: 'assets/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/maskable-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    sourcemapExclude({ excludeNodeModules: true }),
    compression({
      threshold: 10240,
    }),
  ],
  publicDir: command === 'serve' ? './public' : false,
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
    outDir: './dist',
    minify: false, // Disabled for production debugging
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      output: {
        manualChunks(id: string) {
          const normalizedId = id.replace(/\\/g, '/');
          // Only keep locale files separation - let Vite handle node_modules automatically
          // This prevents circular dependency issues with complex libraries (CodeMirror, Sandpack, etc.)
          if (normalizedId.includes('/src/locales/')) {
            return 'locales';
          }
          // Let Vite's automatic chunking handle everything else
          return undefined;
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.[0] && /\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.names[0])) {
            return 'assets/fonts/[name][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
      /**
       * Ignore "use client" warning since we are not using SSR
       * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives TanStack/query#5161}
       */
      onwarn(warning, warn) {
        if (warning.message.includes('Error when using sourcemap')) {
          return;
        }
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 1500,
  },
  resolve: {
    alias: {
      '~': path.join(__dirname, 'src/'),
      $fonts: path.resolve(__dirname, 'public/fonts'),
      'micromark-extension-math': 'micromark-extension-llm-math',
    },
  },
}));

interface SourcemapExclude {
  excludeNodeModules?: boolean;
}

export function sourcemapExclude(opts?: SourcemapExclude): Plugin {
  return {
    name: 'sourcemap-exclude',
    transform(code: string, id: string) {
      if (opts?.excludeNodeModules && id.includes('node_modules')) {
        return {
          code,
          // https://github.com/rollup/rollup/blob/master/docs/plugin-development/index.md#source-code-transformations
          map: { mappings: '' },
        };
      }
    },
  };
}
