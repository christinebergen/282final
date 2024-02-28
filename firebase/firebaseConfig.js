// Import the functions you need from the SDKs you need

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQbI0xPVk4yli-MO6lF7PPyfgI87IEuGM",
  authDomain: "ia-campaign-tracker.firebaseapp.com",
  projectId: "ia-campaign-tracker",
  storageBucket: "ia-campaign-tracker.appspot.com",
  messagingSenderId: "522872089137",
  appId: "1:522872089137:web:4b56530734edb16cdc0310",
  measurementId: "G-XJV2CG2D08",
};
// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // if already initialized, use that one
}

const auth = getAuth(app);
const db = getFirestore(app); // If using Firestore

export { db };

export default auth;
