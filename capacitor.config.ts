import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.novlisky.twa',
  appName: 'Novlisky',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
