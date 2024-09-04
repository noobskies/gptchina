import path, { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, createLogger, loadEnv } from 'vite';
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
  if (msg.includes('vite:css') && msg.includes('^^^^^^^')) {
    return;
  }
  if (msg.includes('Use build.rollupOptions.output.manualChunks')) {
    return;
  }
  originalWarning(msg, options);
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    customLogger: logger,
    server: {
      fs: {
        cachedChecks: false,
      },
      host: 'localhost',
      port: 3090,
      strictPort: false,
      proxy: {
        '/api': {
          target: env.DOMAIN_SERVER,
          changeOrigin: true,
        },
        '/oauth': {
          target: env.DOMAIN_SERVER,
          changeOrigin: true,
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
    envDir: '../',
    envPrefix: ['VITE_', 'SCRIPT_', 'DOMAIN_', 'ALLOW_'],
    plugins: [
      react(),
      VitePWA({
        injectRegister: 'auto',
        registerType: 'prompt',
        devOptions: {
          enabled: false,
        },
        workbox: {
          globPatterns: ['assets/**/*.{png,jpg,svg,ico}', '**/*.{js,css,html,ico,woff2}'],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        },
        manifest: {
          name: env.VITE_APP_AUTHOR || 'Novliisky',
          short_name: env.VITE_APP_AUTHOR || 'Novlisky',
          start_url: '/',
          display: 'standalone',
          background_color: '#000000',
          theme_color: '#009688',
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
              src: env.VITE_APP_FAVICON_32 || '/assets/favicon-32x32.png',
              sizes: '180x180',
              type: 'image/png',
            },
            {
              src: env.VITE_APP_FAVICON_32 || '/assets/favicon-32x32.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
      sourcemapExclude({ excludeNodeModules: true }),
      htmlPlugin(env),
    ],
    publicDir: './public',
    build: {
      sourcemap: process.env.NODE_ENV === 'development',
      outDir: './dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
        onwarn(warning, warn) {
          if (warning.message.includes('Error when using sourcemap')) {
            return;
          }
          warn(warning);
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      chunkSizeWarningLimit: 1000,
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
          map: { mappings: '' },
        };
      }
    },
  };
}