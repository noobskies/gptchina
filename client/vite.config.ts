import path, { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, createLogger, loadEnv } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import compression from 'vite-plugin-compression';
import type { Plugin } from 'vite';

function htmlPlugin(env: ReturnType<typeof loadEnv>) {
  return {
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'pre' as const,
      transform: (html: string): string => {
        return html.replace(/%(.*?)%/g, (match, p1) => {
          const value = env[p1];
          if (value === undefined) {
            return match;
          }
          if (!value.includes('"')) {
            return value;
          }
          return value.replace(/"/g, '&quot;');
        });
      },
    },
  };
}

const logger = createLogger();
const originalWarning = logger.warn;
logger.warn = (msg, options) => {
  /* Suppresses:
   [vite:css] Complex selectors in '.group:focus-within .dark\:group-focus-within\:text-gray-300:is(.dark *)' can not be transformed to an equivalent selector without ':is()'.
   */
  if (msg.includes('vite:css') && msg.includes('^^^^^^^')) {
    return;
  }
  /* Suppresses:
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
   */
  if (msg.includes('Use build.rollupOptions.output.manualChunks')) {
    return;
  }
  originalWarning(msg, options);
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    customLogger: logger,
    server: {
      fs: {
        cachedChecks: false,
      },
      host: '0.0.0.0',
      port: 3090,
      strictPort: false,
      proxy: {
        '/api': {
          target: 'http://localhost:3080',
          changeOrigin: true,
        },
        '/oauth': {
          target: 'http://localhost:3080',
          changeOrigin: true,
        },
      },
    },
    // All other env variables are filtered out
    envDir: '../',
    envPrefix: ['VITE_', 'SCRIPT_', 'DOMAIN_', 'ALLOW_'],
    plugins: [
      react(),
      nodePolyfills(),
      VitePWA({
        injectRegister: 'auto', // 'auto' | 'manual' | 'disabled'
        registerType: 'autoUpdate', // 'prompt' | 'autoUpdate'
        devOptions: {
          enabled: false, // enable/disable registering SW in development mode
        },
        useCredentials: true,
        workbox: {
          globPatterns: ['assets/**/*.{png,jpg,svg,ico}', '**/*.{js,css,html,ico,woff2}'],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          navigateFallbackDenylist: [/^\/oauth/],
        },
        manifest: {
          name: env.VITE_APP_AUTHOR || 'Novlisky',
          short_name: env.VITE_APP_AUTHOR || 'Novlisky',
          start_url: '/',
          display: 'standalone',
          background_color: '#000000',
          theme_color: '#009688',
          prefer_related_applications: true,
          related_applications: [
            {
              platform: 'play',
              url: 'https://play.google.com/store/apps/details?id=twa.novlisky.io',
              id: 'twa.novlisky.io',
            },
            {
              platform: 'itunes',
              url: 'https://apps.apple.com/app/6670143059',
              id: '6670143059',
            },
          ],
          icons: [
            {
              src: env.VITE_APP_FAVICON_32 || '/assets/favicon-32x32.png',
              sizes: '32x32',
              type: 'image/png',
            },
            {
              src: env.VITE_APP_FAVICON_16 || '/assets/favicon-16x16.png',
              sizes: '16x16',
              type: 'image/png',
            },
            {
              src: env.VITE_APP_FAVICON_32 || '/assets/apple-touch-icon-180x180.png',
              sizes: '180x180',
              type: 'image/png',
            },
            {
              src: env.VITE_APP_FAVICON_32 || '/assets/maskable-icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
      sourcemapExclude({ excludeNodeModules: true }),
      htmlPlugin(env),
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'gpt-global',
        project: 'gpt',
      }),
      compression({
        verbose: true,
        disable: false,
        threshold: 10240, // compress files larger than 10KB
        algorithm: 'gzip',
        ext: '.gz',
      }),
    ],
    publicDir: './public',
    build: {
      sourcemap: process.env.NODE_ENV === 'development',
      outDir: './dist',
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            // Group Radix UI libraries together
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            // Group framer-motion separately
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('node_modules/highlight.js')) {
              return 'markdown_highlight';
            }
            if (id.includes('node_modules/hast-util-raw') || id.includes('node_modules/katex')) {
              return 'markdown_large';
            }
            // Group TanStack libraries together
            if (id.includes('@tanstack')) {
              return 'tanstack-vendor';
            }
            // Additional grouping for other node_modules
            if (id.includes('@headlessui')) {
              return 'headlessui';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            // Create a separate chunk for all locale files under src/locales
            if (id.includes(path.join('src', 'locales'))) {
              return 'locales';
            }
            return null;
          },
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && /\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
              return 'assets/fonts/[name][extname]';
            }
            return 'assets/[name].[hash][extname]';
          },
        },
        onwarn(warning, warn) {
          if (warning.message.includes('Error when using sourcemap')) {
            return;
          }
          warn(warning);
        },
      },
      chunkSizeWarningLimit: 1200,
    },
    resolve: {
      alias: {
        '~': path.join(__dirname, 'src/'),
        $fonts: resolve('public/fonts'),
      },
    },
  };
});

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
          // https://github.com/rollup/rollup/docs/plugin-development/index.md#source-code-transformations
          map: { mappings: '' },
        };
      }
    },
  };
}
