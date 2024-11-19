import type { CapacitorConfig } from '@capacitor/cli';
import { loadEnv } from 'vite';

// Load environment variables - use process.env.MODE or 'production' as default
const env = loadEnv(process.env.MODE || 'production', process.cwd(), 'VITE_');

const config: CapacitorConfig = {
  appId: 'twa.novlisky.io',
  appName: 'Novlisky',
  webDir: 'client/dist',
  bundledWebRuntime: false,
  plugins: {
    App: {},
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#eeeeee',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
    StatusBar: {
      style: 'dark',
      overlays: false,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: env.VITE_GOOGLE_CLIENT_ID,
      androidClientId: env.VITE_GOOGLE_ANDROID_CLIENT_ID,
      serverClientId: env.VITE_GOOGLE_SERVER_CLIENT_ID,
    },
  },
  android: {
    backgroundColor: '#eeeeee',
  },
  ios: {
    backgroundColor: '#eeeeee',
  },
  server: {
    androidScheme: env.VITE_ANDROID_SCHEME,
    cleartext: env.VITE_CLEARTEXT === 'true',
    url: env.VITE_SERVER_URL,
  },
};

export default config;
