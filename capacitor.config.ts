import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fukey.education',
  appName: 'Fukey Education',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    },
    "ScreenOrientation": {
      "lockOrientation": "portrait"
    }
  }
};

export default config;
