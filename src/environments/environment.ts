// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL: 'https://learn.fukeyeducation.com/',
  BASE_API_URL: 'https://learn.fukeyeducation.com/api/',
  firebaseConfig: {
    apiKey: "AIzaSyAxEr0qnyYWvsm1KPwn6vIG6mD9PUdDgGk",
    authDomain: "fukeyeducation-9f070.firebaseapp.com",
    projectId: "fukeyeducation-9f070",
    storageBucket: "fukeyeducation-9f070.appspot.com",
    messagingSenderId: "490557422703",
    appId: "1:490557422703:web:206fcf3fb4c9c55ffa219a",
    measurementId: "G-3L5LM91R7D"
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
