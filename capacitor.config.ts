import { type CapacitorConfig } from '@capacitor/cli';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

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
      clientId: process.env.VITE_GOOGLE_CLIENT_ID,
      androidClientId: process.env.VITE_GOOGLE_ANDROID_CLIENT_ID,
      serverClientId: process.env.VITE_GOOGLE_SERVER_CLIENT_ID,
    },
  },
  android: {
    backgroundColor: '#eeeeee',
  },
  ios: {
    backgroundColor: '#eeeeee',
  },
  server: {
    androidScheme: process.env.VITE_ANDROID_SCHEME || 'https',
    cleartext: process.env.VITE_CLEARTEXT === 'true',
    url: process.env.VITE_SERVER_URL,
  },
};

export default config;
