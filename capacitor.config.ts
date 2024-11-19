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
      clientId: '397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com',
      androidClientId: '397122273433-nu924lptlrh9kp2d1te1t7pn9cafufo1.apps.googleusercontent.com',
      serverClientId: '397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com',
    },
  },
  android: {
    backgroundColor: '#eeeeee',
  },
  ios: {
    backgroundColor: '#eeeeee',
  },
  server: {
    // androidScheme: 'https',
    // url: 'https://novlisky.io',
    androidScheme: 'http',
    cleartext: true,
    url: 'http://192.168.0.167:3090',
  },
};

export default config;
