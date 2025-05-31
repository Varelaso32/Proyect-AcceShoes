export const environment = {
  API_URL: 'http://127.0.0.1:8000',
};

export const environmentPaypal = {
  production: false,
  paypalClientId:
    'AWzorEEFkhMfA_OctR52opMbY8UbjVXvCgQOzIuCZ3szFgVCZi9yJ74UlZ6DFKuXRRKXHtIuvY6wkNt5&currency=MXN',
};
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPcQJ9lcv0lNls88FWYKo_WJMz0baJs-w",
  authDomain: "acceshoes-d74e2.firebaseapp.com",
  projectId: "acceshoes-d74e2",
  storageBucket: "acceshoes-d74e2.firebasestorage.app",
  messagingSenderId: "321299621387",
  appId: "1:321299621387:web:e649b7f08366d7cd8d890e",
  measurementId: "G-06QDQ35KNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
