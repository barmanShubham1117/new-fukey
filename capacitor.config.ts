import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fukey.education',
  appName: 'fukey-education',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
  }
};

export default config;
