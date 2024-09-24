import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.novlisky.twa',
  appName: 'Novlisky',
  webDir: 'client/dist',
  bundledWebRuntime: false,
  plugins: {
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
      scopes: ["profile", "email"],
      serverClientId: "397122273433-dkp13np8tm8e5llur593tmupu05764rs.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    },
    StatusBar: {
      style: 'dark',
      overlays: false,
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
  },
};

export default config;
