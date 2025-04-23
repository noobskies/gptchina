import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'twa.novlisky.io',
  appName: 'Novlisky',
  webDir: 'dist',
  plugins: {
    App: {},
    StatusBar: {
      style: 'dark',
      backgroundColor: '#eeeeee',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    PurchasesPlugin: {
      apiKey: {
        android: 'goog_PRNqHNeHMCYERXtfbPLhprIEoKd',
        ios: 'appl_vuZAeLssHCVGtsEstmTrYnWKEey',
      },
      observerMode: false,
      usesStoreKit2IfAvailable: true,
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
