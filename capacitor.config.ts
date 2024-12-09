import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'twa.novlisky.io',
  appName: 'Novlisky',
  webDir: 'client/dist',
  bundledWebRuntime: false,
  plugins: {
    App: {},
    StatusBar: {
      style: 'dark',
      backgroundColor: '#eeeeee',
      overlays: false,
    },
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
    CapacitorSocialLogin: {
      google: {
        webClientId: '397122273433-ke16soip38cest3aoochcgbg0grhd73n.apps.googleusercontent.com',
        iosClientId: '397122273433-r5aed9p71h30699rtp2qjgcp9gdta8mb.apps.googleusercontent.com',
      },
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
    url: 'https://novlisky.io',
    // androidScheme: 'http',
    // cleartext: true,
    // url: 'http://192.168.0.167:3090',
  },
};

export default config;
