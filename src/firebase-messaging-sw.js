import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpe8lvcG2YXYhM_tD1SqWA1Cs4yxGJVpI",
  authDomain: "fukey-education.firebaseapp.com",
  projectId: "fukey-education",
  storageBucket: "fukey-education.appspot.com",
  messagingSenderId: "591743951341",
  appId: "1:591743951341:web:62673fa29506db8d0487e4",
  measurementId: "G-VEG6DM6YVQ"
};
const app = initializeApp(firebaseConfig);
const messaging = firebaseConfig.messaging();

const analytics = getAnalytics(app);