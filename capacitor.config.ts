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
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      iosClientId: '397122273433-qecugthkbekessf6784dntdkgh9u8vlu.apps.googleusercontent.com',
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
