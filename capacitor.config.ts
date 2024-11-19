import type { CapacitorConfig } from '@capacitor/cli';

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
      serverClientId: '534352184231-idlmqrpub82mt5mq99v6t0fcs0gtgcp6.apps.googleusercontent.com',
    },
  },
  android: {
    backgroundColor: '#eeeeee',
  },
  ios: {
    backgroundColor: '#eeeeee',
  },
  server: {
    androidScheme: 'https',
    // cleartext: true,
    url: 'https://novlisky.io',
  },
};

export default config;
