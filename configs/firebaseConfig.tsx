// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4eO4nK4SzK8agouVNA2rtNrHVorrcoT4",
  authDomain: "wireframe2code-f6b33.firebaseapp.com",
  projectId: "wireframe2code-f6b33",
  storageBucket: "wireframe2code-f6b33.firebasestorage.app",
  messagingSenderId: "176146902662",
  appId: "1:176146902662:web:1f4a63360b6c8084946b07",
  measurementId: "G-ZDNS6Z5ZC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);