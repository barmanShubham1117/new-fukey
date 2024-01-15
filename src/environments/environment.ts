// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL: 'https://learn.fukeyeducation.com/',
  BASE_API_URL: 'https://learn.fukeyeducation.com/api/',
  firebaseConfig: {
    apiKey: "AIzaSyDpe8lvcG2YXYhM_tD1SqWA1Cs4yxGJVpI",
    authDomain: "fukey-education.firebaseapp.com",
    projectId: "fukey-education",
    storageBucket: "fukey-education.appspot.com",
    messagingSenderId: "591743951341",
    appId: "1:591743951341:web:62673fa29506db8d0487e4",
    measurementId: "G-VEG6DM6YVQ"
  },
  countryJson: [
		{ name: 'India', dial_code: '+91', code: 'IN' },
	]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
