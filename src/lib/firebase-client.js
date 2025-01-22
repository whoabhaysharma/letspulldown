// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCakh5s7fHYLAKn9YXIUx4kZog8_L3rz-0",
    authDomain: "letspulldown.firebaseapp.com",
    projectId: "letspulldown",
    storageBucket: "letspulldown.firebasestorage.app",
    messagingSenderId: "25096743455",
    appId: "1:25096743455:web:8f0f8f50ef40803ad5432a",
    measurementId: "G-Y11W2WV09S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);